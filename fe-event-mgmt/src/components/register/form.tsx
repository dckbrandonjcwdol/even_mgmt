"use client";

import axios from "@/lib/axios";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useEffect, useState  } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

const RegisterSchema = yup.object().shape({
  username: yup.string().required("username is required"),
  email: yup
    .string()
    .required("email is required")
    .email("invalid email format"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "min 6 character"),
  role: yup
    .string()
    .required("role is required"),
});

interface IRegisterForm {
  username: string;
  email: string;
  password: string;
  role: string;
  referralCode: string;
}

export default function FormRegister() {
  const [roles, setRoles] =  useState<string[]>([]);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralChecking, setReferralChecking] = useState(false);

  // Fungsi untuk validasi referral
  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralValid(null);
      return;
    }

    setReferralChecking(true);
    try {
      const res = await axios.get(`/auth/referral-validate?code=${code}`);
      setReferralValid(res.data.valid);
    } catch (err) {
      setReferralValid(false);
    } finally {
      setReferralChecking(false);
    }
  };      
          

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("/auth/role"); // pastikan endpoint ini sesuai
        setRoles(res.data);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };

    fetchRoles();
  }, []);


  const initialValues: IRegisterForm = {
    username: "",
    email: "",
    password: "",
    role: "",
    referralCode: ""
  };

  // const onRegister = async (
  //   value: IRegisterForm,
  //   action: FormikHelpers<IRegisterForm>
  // ) => {
  //   try {
  //     // await axios.post("/users/register", value);
  //     await axios.post("/auth/register", value);
  //     toast.success("Register successfully");
  //     action.resetForm();
  //   } catch (err) {
  //     console.log(err);
  //     action.setSubmitting(false);
  //     toast.error("Register failed");
  //   }
  // };

  const onRegister = async (
    value: IRegisterForm,
    action: FormikHelpers<IRegisterForm>
  ) => {
    try {
      if (referralValid === false) {
        toast.error("Referral code invalid");
        action.setSubmitting(false);
        return;
      }

      await axios.post("/auth/register", value);
      toast.success("Register successfully");
      action.resetForm();
    } catch (err) {
      console.log(err);
      action.setSubmitting(false);
      toast.error("Register failed");
    }
  };

  return (
     <div className="max-w-md mx-auto mt-8 p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={(values, action) => {
          onRegister(values, action);
        }}
      >
        {(props: FormikProps<IRegisterForm>) => {
          const { touched, errors, isSubmitting } = props;

          useEffect(() => {
            const timeout = setTimeout(() => {
              validateReferralCode(props.values.referralCode);
            }, 500); // debounce agar tidak langsung trigger tiap ketik

            return () => clearTimeout(timeout);
          }, [props.values.referralCode]);
          
          return (
            <Form>
              <div className="flex flex-col">
                <label htmlFor="name" className="text-md">
                  Username
                </label>
                <Field
                  name="username"
                  type="text"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.username && errors.username && (
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">{errors.username}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-md">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">{errors.email}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="password" className="text-md">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="role" className="text-md">Role</label>
                <Field
                  as="select"
                  name="role"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                >
                  <option value="">-- Select Role --</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Field>
                {touched.role && errors.role && (
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">{errors.role}</div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="referralCode" className="text-md">
                  Referral Code
                </label>
                <Field
                  name="referralCode"
                  type="text"
                  className="mb-2 p-2 border border-gray-600 rounded-md"
                />
                {referralChecking && (
                  <div className="text-gray-500 text-[12px] -mt-2 mb-2">Checking...</div>
                )}
                {referralValid === false && (
                  <div className="text-red-500 text-[12px] -mt-2 mb-2">Referral code is invalid</div>
                )}
              </div>


              <div className="mt-12">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-1 px-2 w-full bg-gray-600 text-white tsxt-sm rounded-md disabled:bg-gray-400"
                >
                  {isSubmitting ? "Loading ..." : "Sign up"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
