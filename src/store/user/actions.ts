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
    .then((userCredential) => {
      console.log(userCredential)
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
    console.log(user)
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

const storeUser = (user?: any) => {
  let userToStore: any = { signedIn: false };

  if (user) {
    const { uid, displayName, photoURL, refreshToken, actualProvider, pendingCredential } = user;

    const email = user.email || (user.providerData && user.providerData[0].email);
    const initialProviderId =
      (user.providerData && user.providerData[0].providerId) || user.initialProviderId;
    const signedIn = (user.uid && true) || user.signedIn;

    userToStore = {
      signedIn,
      uid,
      email,
      displayName,
      photoURL,
      refreshToken,
      initialProviderId,
      actualProvider,
      pendingCredential,
    };
  }

  store.dispatch({
    type: SIGN_IN,
    user: userToStore,
  });

  if (!userToStore.signedIn) store.dispatch({ type: WIPE_PREVIOUS_FEEDBACK });
};
