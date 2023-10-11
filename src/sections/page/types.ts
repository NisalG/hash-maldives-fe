export interface PageForm {
  title: string;
  slug: string;
  content: string;
  submitting: boolean;
}

export interface FormStateEdit {
  title: string;
  slug: string;
  content: string;
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
  pages: Page[];
  error: string | null;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
}

// List Action types
export interface FetchPagesRequestAction {
  type: "FETCH_PAGES_REQUEST";
}

export interface FetchPagesSuccessAction {
  type: "FETCH_PAGES_SUCCESS";
  payload: Page[];
}

export interface FetchPagesFailureAction {
  type: "FETCH_PAGES_FAILURE";
  payload: string;
}

// Delete Action types
export interface DeletePageRequestAction {
  type: "DELETE_PAGE_REQUEST";
  payload: string; // page ID
}

export interface DeletePageSuccessAction {
  type: "DELETE_PAGE_SUCCESS";
  payload: string; // deleted page ID
}

export interface DeletePageFailureAction {
  type: "DELETE_PAGE_FAILURE";
  payload: string; // error message
}

// List Reducer type
export type ListAction =
  | FetchPagesRequestAction
  | FetchPagesSuccessAction
  | FetchPagesFailureAction
  | DeletePageRequestAction
  | DeletePageSuccessAction
  | DeletePageFailureAction;
