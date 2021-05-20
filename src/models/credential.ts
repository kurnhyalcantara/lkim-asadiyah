export interface UnauthenticatedCredential {
  signedIn: false;
}

export interface AuthenticatedCredential {
  email: string;
  initialProviderId: string;
  refreshToken: string;
  signedIn: true;
  uid: string;
}

export type Credential = UnauthenticatedCredential | AuthenticatedCredential;

export const isAuthenticated = (credential: Credential): credential is AuthenticatedCredential => {
  return credential.signedIn;
};

export const isUnauthenticated = (credential: Credential): credential is UnauthenticatedCredential => {
  return !credential.signedIn;
};
