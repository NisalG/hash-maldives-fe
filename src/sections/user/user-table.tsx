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
import { ListState, ListAction, User } from "./types";
import EditUser from "./user-edit";

const TABLE_HEAD = [
  { id: "firstName", label: "First Name" },
  { id: "lastName", label: "Last Name" },
  { id: "email", label: "Email" },
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

interface UserTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
}

export default function UserTable({ users, onEditUser }: UserTableProps) {
  const [open, setOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (users) {
      dispatch({ type: "FETCH_PAGES_REQUEST" });
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/user`)
        .then((res) => {
          dispatch({ type: "FETCH_PAGES_SUCCESS", payload: res.data });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_PAGES_FAILURE", payload: err.message });
        });
    }
  }, [users]);

  const editRow = (user: string): void => {
    console.log("user", user);
    onEditUser(user);
  };

  const closeEditForm = () => {
    setEditingUserId(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    setDeleteUser(deleteUser);

    dispatch({ type: "DELETE_PAGE_REQUEST", payload: deleteUser });

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${deleteUser}`)
      .then((res) => {
        dispatch({
          type: "DELETE_PAGE_SUCCESS",
          payload: deleteUser,
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

  const deleteRow = (user: string): void => {
    setOpen(true);
    setDeleteUser(user);
  };

  const initialListState: ListState = {
    loading: false,
    users: [],
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
          users: action.payload,
          error: null,
        };
      case "FETCH_PAGES_FAILURE":
        return {
          ...state,
          loading: false,
          users: [],
          error: action.payload,
        };

      case "DELETE_PAGE_REQUEST":
        return { ...state, loading: true };

      case "DELETE_PAGE_SUCCESS":
        return {
          ...state,
          loading: false,
          users: state.users.filter((c) => c._id !== action.payload),
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
              {state.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right" onClick={() => editRow(user._id)}>
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
                  <TableCell align="right" onClick={() => deleteRow(user._id)}>
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

      {editingUserId && (
        <EditUser
          key={editingUserId}
          users={users}
          editingUserId={editingUserId}
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to Delete the selected User?
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
