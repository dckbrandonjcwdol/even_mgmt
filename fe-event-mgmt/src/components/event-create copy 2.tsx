"use client";

import axios from "@/lib/axios";
import { Field, FieldArray, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const EventSchema = yup.object().shape({
  organizerId: yup.string().required("Organizer ID is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  locationId: yup.number().required("Location is required").notOneOf([0], "Please select a valid location"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
  isPaid: yup.boolean().required("Please specify if the event is paid"),
  price: yup.number().when("isPaid", {
    is: true,
    then: (schema) => schema.required("Price is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  totalSeats: yup.number().required("Total seats is required").moreThan(0, "Total seats must be greater than 0"),
  categoryId: yup.number().required("Category is required").notOneOf([0], "Please select a valid category"),
  ticketTypes: yup.array(),
  promotions: yup.array(),
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
    name: string;
    discountPercentage: number;
  }[];
}

export default function FormCreateEvent({ organizerId }: Props) {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();

  console.log("RENDERED COMPONENT - organizerId:", organizerId); // ✅ tambahkan ini

  useEffect(() => {
    console.log("USEEFFECT organizerId:", organizerId);
  }, [organizerId]);
  
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
    organizerId,
    title: "",
    description: "",
    locationId: 0,
    startDate: "",
    endDate: "",
    price: undefined,
    isPaid: true,
    totalSeats: 1,
    categoryId: 0,
    ticketTypes: [{ name: "", price: 0, quota: 0 }],
    promotions: [{ name: "", discountPercentage: 0 }]
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={EventSchema}
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
                  <option value="0">-- Select Location --</option>
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
                  <option value="0">-- Select Category --</option>
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
                <label>Is Paid</label>
                <Field
                  as="select"
                  name="isPaid"
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
                    className="mb-2 p-2 border border-gray-600 rounded-md"
                  />
                  {touched.price && errors.price && (
                    <div className="text-red-500 text-xs">{errors.price}</div>
                  )}
                </div>
              )}



            {/* Ticket Types */}
            <div>
              <h3 className="font-semibold">Ticket Types</h3>
              <FieldArray name="ticketTypes">
                {({ push, remove }) => (
                  <>
                    {values.ticketTypes.map((_, index) => (
                      <div key={index} className="border p-4 rounded mb-2 space-y-2">
                        <div>
                          <label>Name</label>
                          <Field name={`ticketTypes.${index}.name`} as={Input} />
                        </div>
                        <div>
                          <label>Price</label>
                          <Field type="number" name={`ticketTypes.${index}.price`} as={Input} />
                        </div>
                        <div>
                          <label>Quota</label>
                          <Field type="number" name={`ticketTypes.${index}.quota`} as={Input} />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Remove Ticket
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => push({ name: "", price: 0, quota: 0 })}
                    >
                      + Add Ticket Type
                    </Button>
                  </>
                )}
              </FieldArray>
            </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Submitting..." : "Create Event"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
