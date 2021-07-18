import {
  AuthenticatedCredential,
  isAuthenticated,
  isUnauthenticated,
  UnauthenticatedCredential,
  Credential,
} from './credential';
import { allKeys } from './utils';

const users: Credential[] = [
  {
    signedIn: false,
  },
  {
    signedIn: true,
    uid: 'abcxyz',
    email: 'sam@example.com',
    refreshToken: 'xyzabc',
    initialProviderId: 'google.com',
  },
];

describe('user', () => {
  describe('authenticated', () => {
    it('matches the shape of the default data', () => {
      const authenticatedCredentials: AuthenticatedCredential[] = users.filter(isAuthenticated);
      const keys: Array<keyof AuthenticatedCredential> = [
        'email',
        'initialProviderId',
        'refreshToken',
        'signedIn',
        'uid',
      ];
      expect(authenticatedCredentials).toHaveLength(1);
      expect(allKeys(authenticatedCredentials)).toStrictEqual(keys);
    });
  });

  describe('unauthenticated', () => {
    it('matches the shape of the default data', () => {
      const unauthenticatedCredentials: UnauthenticatedCredential[] =
        users.filter(isUnauthenticated);
      const keys: Array<keyof UnauthenticatedCredential> = ['signedIn'];
      expect(unauthenticatedCredentials).toHaveLength(1);
      expect(allKeys(unauthenticatedCredentials)).toStrictEqual(keys);
    });
  });
});
