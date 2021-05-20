import { Dispatch } from 'redux';
import { db } from '../db';
import {  
  FETCH_USER,
  FETCH_USER_FAILURE,
  FETCH_USER_SUCCESS
} from './types';

// const getUser = async (userId: string): Promise<User> => {
//   const doc = await db().collection('users').doc(userId).get();
//   return doc.data() || {};
// };

export const fetchUser = (userId: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: FETCH_USER,
  });

  db()
    .collection('users')
    .doc(userId)
    .get()
    .then((snapshot) => {
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: snapshot.data(),
      })
    })
    .catch((error) => {
      dispatch({
        type: FETCH_USER_FAILURE,
        payload: error,
      });
    })
};
