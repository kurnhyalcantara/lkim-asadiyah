import { Failure, Pending, Success } from '@abraham/remotedata';
import { initialPengurusState, PengurusState } from './state';
import {
  FETCH_PENGURUS,
  FETCH_PENGURUS_FAILURE,
  FETCH_PENGURUS_SUCCESS,
  PengurusActions,
} from './types';

export const pengurusReducer = (
  state = initialPengurusState,
  action: PengurusActions
): PengurusState => {
  switch (action.type) {
    case FETCH_PENGURUS:
      return new Pending();

    case FETCH_PENGURUS_FAILURE:
      return new Failure(action.payload);

    case FETCH_PENGURUS_SUCCESS:
      return new Success(action.payload);

    default:
      return state;
  }
};
