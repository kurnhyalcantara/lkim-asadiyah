import { Dialog } from './state';

export const OPEN_DIALOG = 'OPEN_DIALOG';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export const SET_DIALOG_ERROR = 'SET_DIALOG_ERROR';

export interface SignUpForm {
  email: string;
  pass: string;
  firstFieldValue?: string;
  secondFieldValue?: string;
  thirdFieldValue?: string;
  fourthFieldValue?: string;
  fifthFieldValue?: string;
  sixthFieldValue?: string;
  seventhFieldValue?: string;
  eighthFieldValue?: string;
  ninethFieldValue?: string;
  tenthFieldValue?: string;
}

export enum DIALOGS {
  PENGURUS = 'pengurus',
  SESSION = 'session',
  FEEDBACK = 'feedback',
  SUBSCRIBE = 'subscribe',
  SIGNUP = 'signup',
  SIGNIN = 'signin',
  PROFILE = 'profile',
  CHANGEPASS = 'changepass',
  EDITPROFILE = 'editprofile'
}

interface OpenDialogAction {
  type: typeof OPEN_DIALOG;
  payload: Dialog;
}

interface CloseDialogAction {
  type: typeof CLOSE_DIALOG;
}

interface SetDialogErrorAction {
  type: typeof SET_DIALOG_ERROR;
  payload: Error;
}

export type DialogActions = OpenDialogAction | CloseDialogAction | SetDialogErrorAction;
