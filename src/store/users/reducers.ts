import { initialUserState, UserState } from './state';
import { FETCH_USER, FETCH_USER_FAILURE, FETCH_USER_SUCCESS, UserActions } from './types';

export const userReducer = (state = initialUserState, action: UserActions): UserState => {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
      };

    case FETCH_USER_FAILURE:
      return {
        ...state,
        ...action.payload,
      };

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
