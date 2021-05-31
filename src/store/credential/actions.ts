import { store } from '..';
import { openDialog } from '../dialogs/actions';
import { DIALOGS } from '../dialogs/types';
import { WIPE_PREVIOUS_FEEDBACK } from '../feedback/types';
import { getToken } from '../notifications/actions';
import { resetSubscribed } from '../subscribe/actions';
import { showToast } from '../toast/actions';
import { fetchUser } from '../users/actions';
import { SIGN_IN } from './types';

export const signIn = (emailUser: string, passUser: string) => {
  return window.firebase
    .auth()
    .signInWithEmailAndPassword(emailUser, passUser)
    .then(() => {
      getToken(true);
      showToast({ message: 'Login Berhasil' });
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        openDialog(DIALOGS.SIGNIN, {
          errorOccurred: true,
          errorMessage: 'Akun tidak ditemukan',
          submitLogin: 'Login',
        });
      }

      if (error.code === 'auth/wrong-password') {
        openDialog(DIALOGS.SIGNIN, {
          errorOccurred: true,
          errorMessage: 'Password salah',
          submitLogin: 'Login',
        });
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
      showToast({ message: 'Logout berhasil' });
    });
};

export const updateUserPassword = (email: string, oldPass: string, newPass: string) => {
  const currentUser = window.firebase.auth().currentUser;
  const credential = window.firebase.auth.EmailAuthProvider.credential(email, oldPass);
  return currentUser
    ?.reauthenticateWithCredential(credential)
    .then(() => {
      currentUser?.updatePassword(newPass);
      openDialog(DIALOGS.PROFILE);
      showToast({ message: 'Password telah diupdate' });
    })
    .catch((error) => {
      if (error.code === 'auth/wrong-password') {
        openDialog(DIALOGS.CHANGEPASS, {
          errorOccurred: true,
          errorMessage: 'Password lama salah',
        });
      }
    });
};

export const sendEmailForgotPassword = (email: string) => {
  const optionUri = {
    url: `https://lkim-asadiyah.web.app/?email=${email}`
  }
  return window.firebase.auth()
    .sendPasswordResetEmail(email, optionUri)
    .then(() => {
      openDialog(DIALOGS.FORGOTPASS, { sendEmailSuccess: true, closeLabel: 'Tutup'})
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        openDialog(DIALOGS.FORGOTPASS, { errorOccurred: true, errorMessage: 'Akun tidak ditemukan', closeLabel: 'Tutup'})
      }
    })
}

const storeUser = (credential?: any) => {
  let credentialToStore: any = { signedIn: false };

  if (credential) {
    const { uid, refreshToken, actualProvider, pendingCredential } = credential;

    const email = credential.email || (credential.providerData && credential.providerData[0].email);
    const initialProviderId =
      (credential.providerData && credential.providerData[0].providerId) ||
      credential.initialProviderId;
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

    store.dispatch(fetchUser(credentialToStore.uid));
  }

  store.dispatch({
    type: SIGN_IN,
    credential: credentialToStore,
  });

  if (!credentialToStore.signedIn) store.dispatch({ type: WIPE_PREVIOUS_FEEDBACK });
};
