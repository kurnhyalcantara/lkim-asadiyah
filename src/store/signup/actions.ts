import { Dispatch } from 'redux';
import { store } from '..';
import { db } from '../db';
import { openDialog } from '../dialogs/actions';
import { SignUpForm, DIALOGS } from '../dialogs/types';
import { hideToast, showToast } from '../toast/actions';
import {
  DAFTAR,
  DaftarActions,
  DAFTAR_FAILURE,
  DAFTAR_RESET,
  DAFTAR_SUCCESS,
} from './types';

const storeData = async (data: SignUpForm, uid: string | undefined) => {
  const id = uid;
  const userData = {
    nama_lengkap: data.firstFieldValue,
    jenis_kelamin: data.secondFieldValue,
    tanggal_lahir: data.thirdFieldValue,
    tempat_lahir: data.fourthFieldValue,
    alamat_sekarang: data.fifthFieldValue,
    no_whatsapp: data.sixthFieldValue,
    instagram_id: data.seventhFieldValue,
    fakultas: data.eighthFieldValue,
    jurusan: data.ninethFieldValue,
    semester: data.tenthFieldValue,
    email: data.email
  };

  await db().collection('users').doc(id).set(userData);
};

export const daftarUser = (data: SignUpForm) => {
  return window.firebase
    .auth()
    .createUserWithEmailAndPassword(data.email, data.pass)
    .then((credential) => {
      storeData(data, credential.user?.uid)
      showToast({ message: 'Pembuatan akun berhasil dan anda telah login otomatis'});
    })
}

export const daftar = (data: SignUpForm) => async (dispatch: Dispatch<DaftarActions>) => {
  dispatch({
    type: DAFTAR,
  });

  try {
    dispatch({
      type: DAFTAR_SUCCESS,
      payload: await daftarUser(data)
    });
  } catch (error) {
    dispatch({
      type: DAFTAR_FAILURE,
      payload: error,
    });
    hideToast()
    if (error.code === 'auth/email-already-in-use') {
      openDialog(DIALOGS.SIGNUP, { errorOccurred: true, errorMessage: 'Email telah digunakan orang lain'})
    }
  }
};

export const resetDaftar = () => {
  store.dispatch({
    type: DAFTAR_RESET,
  });
};

