"use client";

import axios from "@/lib/axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

const EventSchema = yup.object().shape({
  organizerId: yup.string().required("Organizer ID is required"),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  location: yup.string().required("Location is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
  isPaid: yup.boolean().required("Please specify if the event is paid"),
  price: yup.number().when("isPaid", {
    is: true,
    then: (schema) => schema.required("Price is required"),
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

interface IEventForm {
  organizerId: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  price?: number;
  isPaid: boolean;
  totalSeats: number;
  categoryId: number;
  ticketTypes?: any[];
  promotions?: any[];
}

export default function FormCreateEvent() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const initialValues: IEventForm = {
    organizerId: "",
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    price: undefined,
    isPaid: false,
    totalSeats: 1,
    categoryId: 0,
    ticketTypes: [],
    promotions: [],
  };

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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("/locations");
        setLocations(res.data);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchLocations();
    fetchCategories();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={EventSchema}
        onSubmit={async (values, actions) => {
          try {
            await axios.post("/event-create", values);
            toast.success("Event created successfully");
            actions.resetForm();
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
          const { touched, errors, isSubmitting, values } = props;

          return (
            <Form className="space-y-4">
              <div className="flex flex-col">
                <label>Organizer ID</label>
                <Field
                  name="organizerId"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.organizerId && errors.organizerId && (
                  <div className="text-red-500 text-xs">{errors.organizerId}</div>
                )}
              </div>

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
                <label htmlFor="location">Location</label>
                <Field
                  as="select"
                  name="location"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                >
                  <option value="">-- Select Location --</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </Field>
                {touched.location && errors.location && (
                  <div className="text-red-500 text-xs">{errors.location}</div>
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
                  name="isPaid"
                  as="select"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    props.setFieldValue("isPaid", e.target.value === "true")
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

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
