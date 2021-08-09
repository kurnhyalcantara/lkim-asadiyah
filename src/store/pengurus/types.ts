import { Pengurus } from '../../models/pengurus';

export const FETCH_PENGURUS = 'FETCH_PENGURUS';
export const FETCH_PENGURUS_FAILURE = 'FETCH_PENGURUS_FAILURE';
export const FETCH_PENGURUS_SUCCESS = 'FETCH_PENGURUS_SUCCESS';

interface FetchPengurusAction {
  type: typeof FETCH_PENGURUS;
}

interface FetchPengurusFailureAction {
  type: typeof FETCH_PENGURUS_FAILURE;
  payload: Error;
}

interface FetchPengurusSuccessAction {
  type: typeof FETCH_PENGURUS_SUCCESS;
  payload: Pengurus[];
}

export type PengurusActions =
  | FetchPengurusAction
  | FetchPengurusFailureAction
  | FetchPengurusSuccessAction;
