import { AuthenticatedCredential, UnauthenticatedCredential } from '../../models/credential';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export interface CredentialState {
  signedIn: boolean;
}

interface SignInAction {
  type: typeof SIGN_IN;
  credential: AuthenticatedCredential;
}

interface SignOutAction {
  type: typeof SIGN_OUT;
  credential: UnauthenticatedCredential;
}

export type CredentialActionTypes = SignInAction | SignOutAction;
