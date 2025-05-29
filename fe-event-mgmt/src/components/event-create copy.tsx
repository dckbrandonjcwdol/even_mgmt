"use client";

import axios from "@/lib/axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

const EventSchema = yup.object().shape({
  name: yup.string().required("Event name is required"),
  location: yup.string().required("Location is required"),
  date: yup.string().required("Date is required"),
});

interface IEventForm {
  name: string;
  location: string;
  date: string;
}

export default function PageCreateEvent() {
  const [submitting, setSubmitting] = useState(false);

  const initialValues: IEventForm = {
    name: "",
    location: "",
    date: "",
  };

  const onSubmit = async (
    values: IEventForm,
    actions: FormikHelpers<IEventForm>
  ) => {
    setSubmitting(true);
    try {
      await axios.post("/events", values);
      toast.success("Event created successfully");
      actions.resetForm();
    } catch (error) {
      console.error("Create event failed:", error);
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={EventSchema}
        onSubmit={onSubmit}
      >
        {(props: FormikProps<IEventForm>) => {
          const { touched, errors, isSubmitting } = props;

          return (
            <Form>
              <div className="flex flex-col mb-4">
                <label htmlFor="name" className="mb-1">Event Name</label>
                <Field
                  name="name"
                  type="text"
                  className="p-2 border rounded-md"
                />
                {touched.name && errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="location" className="mb-1">Location</label>
                <Field
                  name="location"
                  type="text"
                  className="p-2 border rounded-md"
                />
                {touched.location && errors.location && (
                  <div className="text-red-500 text-sm mt-1">{errors.location}</div>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <label htmlFor="date" className="mb-1">Date</label>
                <Field
                  name="date"
                  type="date"
                  className="p-2 border rounded-md"
                />
                {touched.date && errors.date && (
                  <div className="text-red-500 text-sm mt-1">{errors.date}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md disabled:bg-blue-300"
              >
                {isSubmitting || submitting ? "Submitting..." : "Create Event"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
