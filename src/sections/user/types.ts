export interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  submitting: boolean;
}

export interface FormStateEdit {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  submitting: boolean;
  submitError?: string;
}

export interface AnimatedTextFieldProps {
  show: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export interface FormState {
  submitting: boolean;
  submitError?: string;
}

export type FormAction =
  | {
      values: FormState;
      type: "LOAD_DATA";
    }
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | {
      values: FormState;
      type: "RESET";
    }
  | { type: "ERROR"; error: string };

export interface ListState {
  loading: boolean;
  users: User[];
  error: string | null;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// List Action types
export interface FetchUsersRequestAction {
  type: "FETCH_PAGES_REQUEST";
}

export interface FetchUsersSuccessAction {
  type: "FETCH_PAGES_SUCCESS";
  payload: User[];
}

export interface FetchUsersFailureAction {
  type: "FETCH_PAGES_FAILURE";
  payload: string;
}

// Delete Action types
export interface DeleteUserRequestAction {
  type: "DELETE_PAGE_REQUEST";
  payload: string; // user ID
}

export interface DeleteUserSuccessAction {
  type: "DELETE_PAGE_SUCCESS";
  payload: string; // deleted user ID
}

export interface DeleteUserFailureAction {
  type: "DELETE_PAGE_FAILURE";
  payload: string; // error message
}

// List Reducer type
export type ListAction =
  | FetchUsersRequestAction
  | FetchUsersSuccessAction
  | FetchUsersFailureAction
  | DeleteUserRequestAction
  | DeleteUserSuccessAction
  | DeleteUserFailureAction;
