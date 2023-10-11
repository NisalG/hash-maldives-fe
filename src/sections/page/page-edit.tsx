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

import { PageForm, FormStateEdit, FormAction, Page } from "./types";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

interface EditPageProps {
  pages: Page[];
  editingPageId: string | null;
  onClose: () => void;
}

const EditPage = ({ editingPageId, onClose }: EditPageProps) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const initialFormValues: PageForm = {
    title: "",
    slug: "",
    content: "",
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
    if (editingPageId) {
      // Fetch the page data when the component mounts
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/page/${editingPageId}`)
        .then((res) => {
          const pageData = res.data;
          console.log("pageData in GET:", pageData);
          dispatch({ type: "LOAD_DATA", values: pageData });
        })
        .catch((err) => {
          console.error("Error fetching page:", err);
        });
    }
  }, [editingPageId]);

  const handleFormSubmit = async (values: PageForm) => {
    // event.preventDefault();
    dispatch({ type: "SUBMIT" });

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/page/${editingPageId}`,
        values
      );
      dispatch({ type: "SUCCESS" });

      setOpenSuccess(true);

      // After a successful submission, fetch the updated pages and pass them to the parent
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/page`)
        .then((res) => {
          const pageData = res.data;
          console.log("pageData in PUT:", pageData);
          dispatch({ type: "LOAD_DATA", values: pageData });
        })
        .catch((err) => {
          console.error("Error fetching pages:", err);
        });

      onClose(); // Close the EditPage component
    } catch (error) {
      dispatch({ type: "ERROR", error: error.message });
      setOpenError(true);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Required")
      .min(3, "Enter at least 3 characters")
      .max(100, "Enter at least 100 characters"),
    slug: Yup.string()
      .required("Required")
      .min(3, "Enter at least 3 characters")
      .max(100, "Enter at least 100 characters"),
    content: Yup.string()
      .required("Required")
      .min(3, "Enter at least 3 characters")
      .max(100, "Enter at least 500 characters"),
  });

  const handleSnackBarClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  return (
    <>
      <Stack component={MotionViewport} spacing={5}>
        <m.div variants={varFade().inUp}>
          <Typography variant="h3">Edit Page</Typography>
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
                    label="Title"
                    name="title"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.title}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </m.div>

                <m.div variants={varFade().inUp}>
                  <TextField
                    label="Slug"
                    name="slug"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.slug}
                    onBlur={handleBlur}
                    error={touched.slug && Boolean(errors.slug)}
                    helperText={touched.slug && errors.slug}
                  />
                </m.div>

                <m.div variants={varFade().inUp}>
                  <TextField
                    multiline
                    label="Content"
                    name="content"
                    margin="normal"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.content}
                    onBlur={handleBlur}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && errors.content}
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

export default EditPage;
