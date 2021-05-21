import { store } from '..';
import { openDialog } from '../dialogs/actions';
import { DIALOGS } from '../dialogs/types';
import { WIPE_PREVIOUS_FEEDBACK } from '../feedback/types';
import { getToken } from '../notifications/actions';
import { resetSubscribed } from '../subscribe/actions';
import { showToast } from '../toast/actions';
import { SIGN_IN } from './types';

export const signIn = (emailUser: string, passUser: string) => {
  return window.firebase
    .auth()
    .signInWithEmailAndPassword(emailUser, passUser)
    .then(() => {
      getToken(true);
      showToast({ message: 'Login Berhasil'});
    })
    .catch((error) => {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-email'
      ) {
        openDialog(DIALOGS.SIGNIN, { errorOccurred: true, errorMessage: 'Akun tidak ditemukan'});
      } 
      
      if (error.code === 'auth/wrong-password') {
        openDialog(DIALOGS.SIGNIN, { errorOccurred: true, errorMessage: 'Password salah'});
      }
    });
};

export const updateUser = () => {
  window.firebase.auth().onAuthStateChanged((user) => {
    storeUser(user);
  });
};

export const signOut = () => {
  return window.firebase
    .auth()
    .signOut()
    .then(() => {
      storeUser();
      resetSubscribed();
    });
};

const storeUser = (credential?: any) => {
  let credentialToStore: any = { signedIn: false };

  if (credential) {
    const { uid, refreshToken, actualProvider, pendingCredential } = credential;

    const email = credential.email || (credential.providerData && credential.providerData[0].email);
    const initialProviderId =
      (credential.providerData && credential.providerData[0].providerId) || credential.initialProviderId;
    const signedIn = (credential.uid && true) || credential.signedIn;

    credentialToStore = {
      signedIn,
      uid,
      email,
      refreshToken,
      initialProviderId,
      actualProvider,
      pendingCredential,
    };
  }

  store.dispatch({
    type: SIGN_IN,
    credential: credentialToStore,
  });

  if (!credentialToStore.signedIn) store.dispatch({ type: WIPE_PREVIOUS_FEEDBACK });
};