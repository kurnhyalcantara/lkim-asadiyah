import { Dispatch } from 'redux';
import { Pengurus } from '../../models/pengurus';
import { mergeId } from '../../utils/merge-id';
import { db } from '../db';
import {
  FETCH_PENGURUS,
  FETCH_PENGURUS_FAILURE,
  FETCH_PENGURUS_SUCCESS,
  PengurusActions,
} from './types';

const getPengurus = async (): Promise<Pengurus[]> => {
  const { docs } = await db().collection('pengurus').orderBy('order', 'asc').get();
  return docs.map<Pengurus>(mergeId);
};

export const fetchPengurusList = () => async (dispatch: Dispatch<PengurusActions>) => {
  dispatch({
    type: FETCH_PENGURUS,
  });

  try {
    dispatch({
      type: FETCH_PENGURUS_SUCCESS,
      payload: await getPengurus(),
    });
  } catch (error) {
    dispatch({
      type: FETCH_PENGURUS_FAILURE,
      payload: error,
    });
  }
};
