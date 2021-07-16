import { User } from '../../models/user';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

interface FetchUserAction {
  type: typeof FETCH_USER;
}

interface FetchUserFailureAction {
  type: typeof FETCH_USER_FAILURE;
  payload: Error;
}

interface FetchUserSuccessAction {
  type: typeof FETCH_USER_SUCCESS;
  payload: User;
}

export type UserActions = FetchUserAction | FetchUserFailureAction | FetchUserSuccessAction;
