import { initialCredentialState } from './state';
import { SIGN_IN, SIGN_OUT, CredentialActionTypes } from './types';

export const credentialReducer = (
  state = initialCredentialState,
  action: CredentialActionTypes
) => {
  switch (action.type) {
    case SIGN_IN:
      return action.credential;
    case SIGN_OUT:
      return action.credential;
    default:
      return state;
  }
};
