import React, { useState, useReducer, useEffect } from "react";
import { m } from "framer-motion";
// @mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { TextField, Button } from "@mui/material";

// components
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { MotionViewport, varFade } from "src/components/animate";

import { UserForm, FormStateEdit, FormAction, User } from "./types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

interface EditUserProps {
  users: User[];
  editingUserId: string | null;
  onClose: () => void;
}

const EditUser = ({ editingUserId, onClose }: EditUserProps) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const initialFormValues: UserForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    submitting: false,
  };

  const formReducer = (
    state: FormStateEdit,
    action: FormAction
  ): FormStateEdit => {
    switch (action.type) {
      case "SUBMIT":
        return { ...state, submitting: true };
      case "SUCCESS":
        return { ...state, submitting: false };
      case "RESET":
        return { ...state, ...action.values };
      case "ERROR":
        return { ...state, submitting: false, submitError: action.error };
      case "LOAD_DATA":
        return { ...state, ...action.values };
      default:
        return state;
    }
  };

  const [formState, dispatch] = useReducer(formReducer, initialFormValues);

  useEffect(() => {
    if (editingUserId) {
      // Fetch the user data when the component mounts
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user/${editingUserId}`)
        .then((res) => {
          const userData = res.data;
          console.log("userData in GET:", userData);
          dispatch({ type: "LOAD_DATA", values: userData });
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        });
    }
  }, [editingUserId]);

  const handleFormSubmit = async (values: UserForm) => {
    // event.preventDefault();
    dispatch({ type: "SUBMIT" });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${editingUserId}`,
        values
      );
      dispatch({ type: "SUCCESS" });

      setOpenSuccess(true);

      // After a successful submission, fetch the updated users and pass them to the parent
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user`)
        .then((res) => {
          const userData = res.data;
          console.log("userData in PUT:", userData);
          dispatch({ type: "LOAD_DATA", values: userData });
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        });

      onClose(); // Close the EditUser component
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
          <Typography variant="h3">Edit User</Typography>
        </m.div>

        <Formik
          validationSchema={validationSchema}
          initialValues={formState}
          enableReinitialize={true}
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
                    onChange={handleChange}
                    value={values.firstName}
                    onBlur={handleBlur}
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
                    onChange={handleChange}
                    value={values.lastName}
                    onBlur={handleBlur}
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
                    onChange={handleChange}
                    value={values.email}
                    onBlur={handleBlur}
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
                    onChange={handleChange}
                    value={values.password}
                    onBlur={handleBlur}
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
};

export default EditUser;
