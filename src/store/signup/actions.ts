import { Dispatch } from 'redux';
import { store } from '..';
import { db } from '../db';
import { openDialog } from '../dialogs/actions';
import { DialogForm, DIALOGS } from '../dialogs/types';
import { showToast } from '../toast/actions';
import {
  DAFTAR,
  DaftarActions,
  DAFTAR_FAILURE,
  DAFTAR_RESET,
  DAFTAR_SUCCESS,
} from './types';

const setDaftar = async (data: DialogForm): Promise<true> => {
  const id = data.email.replace(/[^\w\s]/gi, '');
  const userData = {
    email: data.email,
    firstName: data.firstFieldValue || '',
    lastName: data.secondFieldValue || '',
  };

  await db().collection('users').doc(id).set(userData);

  return true;
};

export const daftar = (data: DialogForm) => async (dispatch: Dispatch<DaftarActions>) => {
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
    openDialog(DIALOGS.SIGNUP, { ...data, errorOccurred: true });
  }
};

export const resetDaftar = () => {
  store.dispatch({
    type: DAFTAR_RESET,
  });
};
