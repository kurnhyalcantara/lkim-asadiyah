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

const setDaftar = async (data: SignUpForm) => {
  const id = data.email.replace(/[^\w\s]/gi, '');
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

export const daftar = (data: SignUpForm) => async (dispatch: Dispatch<DaftarActions>) => {
  dispatch({
    type: DAFTAR,
  });

  try {
    dispatch({
      type: DAFTAR_SUCCESS,
      payload: await daftarUser(data.email, data.pass)
    });
    setDaftar(data);
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

export const daftarUser = (emailUser: string, passUser: string) => {
  return window.firebase
    .auth()
    .createUserWithEmailAndPassword(emailUser, passUser)
    .then(() => {
      showToast({ message: 'Pembuatan akun berhasil dan anda telah login otomatis'});
    })
}
