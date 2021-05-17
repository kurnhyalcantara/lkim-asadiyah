import { Dispatch } from 'redux';
import { store } from '..';
import { db } from '../db';
import { openDialog } from '../dialogs/actions';
import { SignUpForm, DIALOGS } from '../dialogs/types';
import { showToast } from '../toast/actions';
import {
  DAFTAR,
  DaftarActions,
  DAFTAR_FAILURE,
  DAFTAR_RESET,
  DAFTAR_SUCCESS,
} from './types';

const setDaftar = async (data: SignUpForm): Promise<true> => {
  const id = data.email.replace(/[^\w\s]/gi, '');
  console.log(id)
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
  return true;
};

export const daftar = (data: SignUpForm) => async (dispatch: Dispatch<DaftarActions>) => {
  dispatch({
    type: DAFTAR,
  });

  try {
    dispatch({
      type: DAFTAR_SUCCESS,
      payload: await setDaftar(data),
    });
    showToast({ message: '{$ subscribeBlock.toast $}' });
  } catch (error) {
    dispatch({
      type: DAFTAR_FAILURE,
      payload: error,
    });
    console.log(error)
    openDialog(DIALOGS.SIGNUP, { ...data, errorOccurred: true });
  }
};

export const resetDaftar = () => {
  store.dispatch({
    type: DAFTAR_RESET,
  });
};
