import React, {
  useState,
  useCallback,
  useMemo,
  useReducer,
  useEffect,
} from "react";
import axios from "axios";

// @mui
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Icon } from "@iconify/react";
import { Box } from "@mui/system";

// components
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";

// ----------------------------------------------------------------------
import { ListState, ListAction, Page } from "./types";
import EditPage from "./page-edit";

const TABLE_HEAD = [
  { id: "title", label: "Title" },
  { id: "slug", label: "Slug" },
  { id: "content", label: "Content" },
  { id: "edit", label: "Edit", align: "center" },
  { id: "delete", label: "Delete", align: "center" },
];

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

interface PageTableProps {
  pages: Page[];
  onEditPage: (pageId: string) => void;
}

export default function PageTable({ pages, onEditPage }: PageTableProps) {
  const [open, setOpen] = useState(false);
  const [deletePage, setDeletePage] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  useEffect(() => {
    if (pages) {
      dispatch({ type: "FETCH_PAGES_REQUEST" });
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/page`)
        .then((res) => {
          dispatch({ type: "FETCH_PAGES_SUCCESS", payload: res.data });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_PAGES_FAILURE", payload: err.message });
        });
    }
  }, [pages]);

  const editRow = (page: string): void => {
    console.log("page", page);
    onEditPage(page);
  };

  const closeEditForm = () => {
    setEditingPageId(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    setDeletePage(deletePage);

    dispatch({ type: "DELETE_PAGE_REQUEST", payload: deletePage });

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/page/${deletePage}`)
      .then((res) => {
        dispatch({
          type: "DELETE_PAGE_SUCCESS",
          payload: deletePage,
        });
        setOpenSuccess(true);
      })
      .catch((err) => {
        dispatch({
          type: "DELETE_PAGE_FAILURE",
          payload: err.message,
        });
        setOpenError(true);
      });
  };

  const deleteRow = (page: string): void => {
    setOpen(true);
    setDeletePage(page);
  };

  const initialListState: ListState = {
    loading: false,
    pages: [],
    error: null,
  };

  const listReducer = (state: ListState, action: ListAction) => {
    switch (action.type) {
      case "FETCH_PAGES_REQUEST":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "FETCH_PAGES_SUCCESS":
        return {
          ...state,
          loading: false,
          pages: action.payload,
          error: null,
        };
      case "FETCH_PAGES_FAILURE":
        return {
          ...state,
          loading: false,
          pages: [],
          error: action.payload,
        };

      case "DELETE_PAGE_REQUEST":
        return { ...state, loading: true };

      case "DELETE_PAGE_SUCCESS":
        return {
          ...state,
          loading: false,
          pages: state.pages.filter((c) => c._id !== action.payload),
        };

      case "DELETE_PAGE_FAILURE":
        return { ...state, loading: false, error: action.payload };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(listReducer, initialListState);

  const handleSnackBarClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
  };

  return (
    <>
      <TableContainer sx={{ mt: 3, overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 200 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {state.pages.map((page) => (
                <TableRow key={page._id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{page.content}</TableCell>
                  <TableCell align="right" onClick={() => editRow(page._id)}>
                    {" "}
                    <Box
                      sx={{
                        borderRadius: 0.65,
                        width: 28,
                        cursor: "pointer",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Icon icon={"eva:edit-outline"} />
                    </Box>
                  </TableCell>
                  <TableCell align="right" onClick={() => deleteRow(page._id)}>
                    <Box
                      sx={{
                        borderRadius: 0.65,
                        width: 28,
                        cursor: "pointer",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Icon icon={"eva:trash-2-outline"} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {editingPageId && (
        <EditPage
          key={editingPageId}
          pages={pages}
          editingPageId={editingPageId}
          onClose={closeEditForm}
        />
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Delete Page</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to Delete the selected Page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleDelete}
            sx={{
              bgcolor: "red",
              color: "white",
              "&:hover": {
                bgcolor: "darkred",
                color: "white",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
