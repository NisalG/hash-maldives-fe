import React, { useState, useReducer, useEffect } from "react";
import { m } from "framer-motion";
// @mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { TextField, Button, InputAdornment } from "@mui/material";

// components
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { MotionViewport, varFade } from "src/components/animate";

import { UserForm, FormState, FormAction, User } from "./types";
import { RHFTextField } from "src/components/hook-form";

const initialFormValues: UserForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  submitting: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SUBMIT":
      return { submitting: true };
    case "SUCCESS":
      return { submitting: false };
    case "RESET":
      return action.values;
    case "ERROR":
      return { submitting: false, submitError: action.error };
    default:
      return state;
  }
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

interface UserAddProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserAdd({ setUsers }: UserAddProps) {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [formState, dispatch] = useReducer(formReducer, initialFormValues);

  const handleFormSubmit = async (values: UserForm) => {
    // event.preventDefault();
    dispatch({ type: "SUBMIT" });

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user`, values);
      dispatch({ type: "SUCCESS" });
      dispatch({
        type: "RESET",
        values: initialFormValues,
      });

      setOpenSuccess(true);

      // After a successful submission, fetch the updated users and pass them to the parent
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user`)
        .then((res) => {
          setUsers(res.data);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        });
    } catch (error) {
      dispatch({ type: "ERROR", error: error.message });
      setOpenError(true);
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Required")
      .min(3, "Enter at least 3 characters")
      .max(100, "Enter at least 100 characters"),
    lastName: Yup.string()
      .required("Required")
      .min(3, "Enter at least 3 characters")
      .max(100, "Enter at least 100 characters"),
    email: Yup.string()
      .email("Invalid email")
      .required("Required")
      .min(3, "Enter at least 3 characters")
      .max(100, "Enter at least 100 characters"),
    password: Yup.string()
      .required("Required")
      .min(8, "Enter at least 8 characters")
      .max(20, "Enter at least 20 characters"),
  });

  const handleSnackBarClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  return (
    <>
      <Stack component={MotionViewport} spacing={5}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h3">Create User</Typography>
        </m.div>

        <Formik
          validationSchema={validationSchema}
          initialValues={initialFormValues}
          onSubmit={(values, { resetForm }) => {
            handleFormSubmit(values);
            resetForm();
          }}
        >
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            handleSubmit,
            setFieldTouched,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <m.div variants={varFade().inUp}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange("firstName")}
                    value={values.firstName}
                    onBlur={handleBlur("firstName")}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </m.div>

                <m.div variants={varFade().inUp}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange("lastName")}
                    value={values.lastName}
                    onBlur={handleBlur("lastName")}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </m.div>

                <m.div variants={varFade().inUp}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange("email")}
                    value={values.email}
                    onBlur={handleBlur("email")}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </m.div>

                <m.div variants={varFade().inUp}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange("password")}
                    value={values.password}
                    onBlur={handleBlur("password")}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </m.div>
              </Stack>

              <m.div variants={varFade().inUp}>
                <Button
                  size="large"
                  variant="contained"
                  type="submit"
                  sx={{ mr: 2 }}
                >
                  Submit
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  type="button"
                  onClick={() => {
                    resetForm();
                  }}
                  sx={{ mr: 2 }}
                >
                  Clear
                </Button>
              </m.div>
            </form>
          )}
        </Formik>
      </Stack>

      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Success!"
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successful!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Error!"
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error!
        </Alert>
      </Snackbar>
    </>
  );
}
