import { DAFTAR, DaftarActions, DAFTAR_FAILURE, DAFTAR_RESET, DAFTAR_SUCCESS } from './types';
import { initialDaftarState, DaftarState } from './state';
import { Failure, Initialized, Pending, Success } from '@abraham/remotedata';

export const signupReducer = (state = initialDaftarState, action: DaftarActions): DaftarState => {
  switch (action.type) {
    case DAFTAR:
      return new Pending();

    case DAFTAR_SUCCESS:
      return new Success(true);

    case DAFTAR_FAILURE:
      return new Failure(action.payload);

    case DAFTAR_RESET:
      return new Initialized();

    default:
      return state;
  }
};
