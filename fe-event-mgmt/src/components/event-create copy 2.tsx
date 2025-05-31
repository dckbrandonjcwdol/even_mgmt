"use client";

import axios from "@/lib/axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

const EventSchema = yup.object().shape({
  organizerId: yup.string().required("Organizer ID is required"),
  title: yup.string().required("Title is required"),
  description: yup.string(),
  location: yup.string(),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
  isPaid: yup.boolean().required(),
  price: yup.number().when("isPaid", {
    is: true,
    then: (schema) => schema.required("Price is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  totalSeats: yup.number().required("Total seats is required"),
  category: yup.string(),
  ticketTypes: yup.array(),
  promotions: yup.array(),
});

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
  category?: string;
  ticketTypes?: any[];
  promotions?: any[];
}



export default function FormCreateEvent() {
  const [locations, setLocations] =  useState<string[]>([]);

  const initialValues: IEventForm = {
    organizerId: "",
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    price: undefined,
    isPaid: false,
    totalSeats: 0,
    category: "",
    ticketTypes: [],
    promotions: [],
  };

  const onCreateEvent = async (
    values: IEventForm,
    actions: FormikHelpers<IEventForm>
  ) => {
    try {
      await axios.post("/event", values); // Sesuaikan endpoint sesuai routing kamu
      toast.success("Event created successfully");
      actions.resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    } finally {
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("/locations"); // pastikan endpoint ini sesuai
        setLocations(res.data);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };

    fetchLocations();
  }, []);


  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={EventSchema}
        onSubmit={onCreateEvent}
      >
        {(props: FormikProps<IEventForm>) => {
          const { touched, errors, isSubmitting } = props;

          return (
            <Form className="space-y-4">
               {/* <div className="flex flex-col">
                <label>Organizer ID</label>
                <Field 
                  name="organizerId" 
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.organizerId && errors.organizerId && (
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">{errors.organizerId}</div>
                )}
              </div> */}

             <div className="flex flex-col">
                <label>Title</label>
                <Field 
                  name="title" 
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label>Description</label>
                <Field 
                  name="description" 
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
              </div>

              {/* <div className="flex flex-col">
                <label>Location</label>
                <Field 
                  name="location" 
                  className="mb-2 p-2 border border-gray-600 rounded-md" 
                />
              </div> */}

              <div className="flex flex-col">
                <label htmlFor="location" className="text-md">Location</label>
                {/* <Field
                  as="select"
                  name="locationId"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                >
                  <option value="">-- Select Location --</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.name}>
                      {location}
                    </option>
                  ))}
                </Field> */}
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
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">{errors.location}</div>
                )}
              </div>



              <div className="flex flex-col">
                <label>Start Date</label>
                <Field 
                  name="startDate" 
                  type="datetime-local"                   
                  className="mb-2 p-2 border border-gray-600 rounded-md" 
                />
              </div>

              <div className="flex flex-col">
                <label>End Date</label>
                <Field 
                  name="endDate" 
                  type="datetime-local" 
                  className="mb-2 p-2 border border-gray-600 rounded-md" 
                />
              </div>

              <div className="flex flex-col">
                <label>Total Seats</label>
                <Field 
                  name="totalSeats" 
                  type="number" 
                  className="mb-2 p-2 border border-gray-600 rounded-md" 
                />
              </div>

              <div className="flex flex-col">
                <label>Category</label>
                <Field 
                  name="category" 
                  className="mb-2 p-2 border border-gray-600 rounded-md" 
                />
              </div>

              {/* <div className="flex flex-col">
                <label>Is Paid</label>
                <Field name="isPaid" as="select" className="input">
                  <option value={false}>Free</option>
                  <option value={true}>Paid</option>
                </Field>
              </div> */}

              {props.values.isPaid && (
                <div className="flex flex-col">
                  <label>Price</label>
                  <Field 
                    name="price" 
                    type="number" 
                    className="mb-2 p-2 border border-gray-600 rounded-md" 
                  />
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
