'use client';

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Button } from "./ui/button";

const EventSchema = yup.object().shape({
  organizerId: yup.string().required("Organizer ID is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  locationId: yup
    .number()
    .required("Location is required")
    .notOneOf([0], "Please select a valid location"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date can't be before start date")
    .required("End date is required"),
  isPaid: yup.boolean().required("Please specify if the event is paid"),
  price: yup.number().when("isPaid", {
    is: true,
    then: (schema) => schema.required("Price is required").min(0),
    otherwise: (schema) => schema.nullable(),
  }),
  totalSeats: yup
    .number()
    .required("Total seats is required")
    .moreThan(0, "Total seats must be greater than 0"),
  categoryId: yup
    .number()
    .required("Category is required")
    .notOneOf([0], "Please select a valid category"),
  ticketTypes: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Ticket name is required"),
      price: yup.number().min(0, "Price must be >= 0").required(),
      quota: yup.number().min(1, "Quota must be >= 1").required(),
    })
  ),
  promotions: yup.array().of(
    yup.object().shape({
      code: yup.string().required("Promotion code is required"),
      description: yup.string(),
      discountPercentage: yup
        .number()
        .min(0)
        .max(100)
        .required("Discount percentage is required"),
      maxUsage: yup.number().required("Max usage is required").min(1),
      validUntil: yup.string().required("Valid until is required"),
    })
  ),
});

interface ILocation {
  id: number;
  name: string;
}

interface ICategory {
  id: number;
  name: string;
}

interface Props {
  organizerId: string;
}

interface IEventForm {
  organizerId: string;
  title: string;
  description?: string;
  locationId: number;
  startDate: string;
  endDate: string;
  price?: number;
  isPaid: boolean;
  totalSeats: number;
  categoryId: number;
  ticketTypes: {
    name: string;
    price: number;
    quota: number;
  }[];
  promotions: {
    code: string;
    description: string;
    discountPercentage: number;
    maxUsage: number;
    validUntil: string;
  }[];
}

export default function FormCreateEvent({ organizerId }: Props) {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [locationsRes, categoriesRes] = await Promise.all([
          axios.get("/locations"),
          axios.get("/categories"),
        ]);
        setLocations(locationsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    };
    fetchInitialData();
  }, []);

  const touchAllFields = (
    values: IEventForm,
    setTouched: FormikHelpers<IEventForm>["setTouched"]
  ) => {
    const touchedFields: Record<string, boolean> = {};
    Object.keys(values).forEach((key) => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields, true);
  };

  const initialValues: IEventForm = {
    organizerId: String(organizerId),
    title: "",
    description: "",
    locationId: 0,
    startDate: "",
    endDate: "",
    price: undefined,
    isPaid: true,
    totalSeats: 1,
    categoryId: 0,
    ticketTypes: [{ name: "", price: 0, quota: 1 }],
    promotions: [
      {
        code: "",
        description: "",
        discountPercentage: 0,
        maxUsage: 50,
        validUntil: "",
      },
    ],
  };

  return (
    <div className="pt-16 max-h-[calc(100vh-64px)] overflow-y-auto max-w-md mx-auto p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={EventSchema}
        validateOnBlur
        validateOnChange
        onSubmit={async (values, actions) => {
          try {
            await axios.post("/event", values);
            toast.success("Event created successfully");
            actions.resetForm();
            router.push("/");
          } catch (err) {
            console.error(err);
            toast.error("Failed to create event");
            touchAllFields(values, actions.setTouched);
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {(props: FormikProps<IEventForm>) => {
          const { touched, errors, isSubmitting, values, setFieldValue } = props;

          return (
            <Form className="space-y-4">
              <Field type="hidden" name="organizerId" />

              <div className="flex flex-col">
                <label>Title</label>
                <Field
                  name="title"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.title && errors.title && (
                  <div className="text-red-500 text-xs">{errors.title}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label>Description</label>
                <Field
                  name="description"
                  as="textarea"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.description && errors.description && (
                  <div className="text-red-500 text-xs">{errors.description}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="locationId">Location</label>
                <Field
                  as="select"
                  name="locationId"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                >
                  <option value={0}>-- Select Location --</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </Field>
                {touched.locationId && errors.locationId && (
                  <div className="text-red-500 text-xs">{errors.locationId}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label>Start Date</label>
                <Field
                  name="startDate"
                  type="datetime-local"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.startDate && errors.startDate && (
                  <div className="text-red-500 text-xs">{errors.startDate}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label>End Date</label>
                <Field
                  name="endDate"
                  type="datetime-local"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.endDate && errors.endDate && (
                  <div className="text-red-500 text-xs">{errors.endDate}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label>Total Seats</label>
                <Field
                  name="totalSeats"
                  type="number"
                  min={1}
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.totalSeats && errors.totalSeats && (
                  <div className="text-red-500 text-xs">{errors.totalSeats}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="categoryId">Category</label>
                <Field
                  as="select"
                  name="categoryId"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                >
                  <option value={0}>-- Select Category --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {touched.categoryId && errors.categoryId && (
                  <div className="text-red-500 text-xs">{errors.categoryId}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label>Is Paid?</label>
                <Field
                  as="select"
                  name="isPaid"
                  value={values.isPaid ? "true" : "false"}
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFieldValue("isPaid", e.target.value === "true")
                  }
                >
                  <option value="false">Free</option>
                  <option value="true">Paid</option>
                </Field>
                {touched.isPaid && errors.isPaid && (
                  <div className="text-red-500 text-xs">{errors.isPaid}</div>
                )}
              </div>

              {values.isPaid && (
                <div className="flex flex-col">
                  <label>Price</label>
                  <Field
                    name="price"
                    type="number"
                    min={0}
                    className="mb-2 p-2 border border-gray-600 rounded-md"
                  />
                  {touched.price && errors.price && (
                    <div className="text-red-500 text-xs">{errors.price}</div>
                  )}
                </div>
              )}

              {/* Ticket Types */}
              <FieldArray name="ticketTypes">
                {(arrayHelpers) => (
                  <div>
                    <h3 className="font-semibold mb-2">Ticket Types</h3>
                    {values.ticketTypes.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex flex-col mb-4 border p-3 rounded-md"
                      >
                        <label>Name</label>
                        <Field
                          name={`ticketTypes.${index}.name`}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {touched.ticketTypes &&
                          touched.ticketTypes[index]?.name &&
                          errors.ticketTypes &&
                          typeof errors.ticketTypes[index] === "object" &&
                          errors.ticketTypes[index]?.name && (
                            <div className="text-red-500 text-xs">
                              {errors.ticketTypes[index].name}
                            </div>
                        )}

                        <label>Price</label>
                        <Field
                          name={`ticketTypes.${index}.price`}
                          type="number"
                          min={0}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {/* {touched.ticketTypes &&
                          touched.ticketTypes[index]?.price &&
                          errors.ticketTypes &&
                          errors.ticketTypes[index]?.price && (
                            <div className="text-red-500 text-xs">
                              {errors.ticketTypes[index].price}
                            </div>
                          )} */}
                          {touched.ticketTypes &&
                            touched.ticketTypes[index]?.price &&
                            errors.ticketTypes &&
                            typeof errors.ticketTypes[index] === 'object' &&
                            errors.ticketTypes[index]?.price && (
                              <div className="text-red-500 text-xs">
                                {errors.ticketTypes[index].price}
                              </div>
                          )}

                        <label>Quota</label>
                        <Field
                          name={`ticketTypes.${index}.quota`}
                          type="number"
                          min={1}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {touched.ticketTypes &&
                          touched.ticketTypes[index]?.quota &&
                          errors.ticketTypes &&
                          typeof errors.ticketTypes[index] === 'object' && // pastikan ini objek
                          errors.ticketTypes[index] !== null &&             // pastikan bukan null
                          'quota' in errors.ticketTypes[index] &&           // pastikan ada properti quota
                          errors.ticketTypes[index]?.quota && (
                            <div className="text-red-500 text-xs">
                              {errors.ticketTypes[index].quota}
                            </div>
                        )}



                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={values.ticketTypes.length === 1}
                        >
                          Remove Ticket Type
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({ name: "", price: 0, quota: 1 })
                      }
                    >
                      Add Ticket Type
                    </Button>
                  </div>
                )}
              </FieldArray>

              {/* Promotions */}
              <FieldArray name="promotions">
                {(arrayHelpers) => (
                  <div>
                    <h3 className="font-semibold mb-2 mt-6">Promotions</h3>
                    {values.promotions.map((promo, index) => (
                      <div
                        key={index}
                        className="flex flex-col mb-4 border p-3 rounded-md"
                      >
                        <label>Code</label>
                        <Field
                          name={`promotions.${index}.code`}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {/* {touched.promotions &&
                          touched.promotions[index]?.code &&
                          errors.promotions &&
                          errors.promotions[index]?.code && (
                            <div className="text-red-500 text-xs">
                              {errors.promotions[index].code}
                            </div>
                          )} */}
                          {touched.promotions &&
                            touched.promotions[index]?.code &&
                            errors.promotions &&
                            typeof errors.promotions[index] === 'object' &&
                            errors.promotions[index]?.code && (
                              <div className="text-red-500 text-xs">
                                {errors.promotions[index].code}
                              </div>
                          )}

                        <label>Description</label>
                        <Field
                          name={`promotions.${index}.description`}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />

                        <label>Discount Percentage</label>
                        <Field
                          name={`promotions.${index}.discountPercentage`}
                          type="number"
                          min={0}
                          max={100}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {touched.promotions &&
                          touched.promotions[index]?.discountPercentage &&
                          errors.promotions &&
                          typeof errors.promotions[index] === "object" &&
                          errors.promotions[index]?.discountPercentage && (
                            <div className="text-red-500 text-xs">
                              {errors.promotions[index].discountPercentage}
                            </div>
                        )}

                        <label>Max Usage</label>
                        <Field
                          name={`promotions.${index}.maxUsage`}
                          type="number"
                          min={1}
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {touched.promotions &&
                          touched.promotions[index]?.maxUsage &&
                          errors.promotions &&
                          typeof errors.promotions[index] === "object" &&
                          errors.promotions[index]?.maxUsage && (
                            <div className="text-red-500 text-xs">
                              {errors.promotions[index].maxUsage}
                            </div>
                        )}

                        <label>Valid Until</label>
                        <Field
                          name={`promotions.${index}.validUntil`}
                          type="date"
                          className="mb-2 p-2 border border-gray-600 rounded-md"
                        />
                        {touched.promotions &&
                          touched.promotions[index]?.validUntil &&
                          errors.promotions &&
                          typeof errors.promotions[index] === "object" &&
                          errors.promotions[index]?.validUntil && (
                            <div className="text-red-500 text-xs">
                              {errors.promotions[index].validUntil}
                            </div>
                        )}

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => arrayHelpers.remove(index)}
                          disabled={values.promotions.length === 1}
                        >
                          Remove Promotion
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          code: "",
                          description: "",
                          discountPercentage: 0,
                          maxUsage: 50,
                          validUntil: "",
                        })
                      }
                    >
                      Add Promotion
                    </Button>
                  </div>
                )}
              </FieldArray>

              <Button
                type="submit"
                disabled={isSubmitting || !props.isValid}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
