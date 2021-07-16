export const DAFTAR = 'DAFTAR';
export const DAFTAR_SUCCESS = 'DAFTAR_SUCCESS';
export const DAFTAR_FAILURE = 'DAFTAR_FAILURE';
export const DAFTAR_RESET = 'DAFTAR_RESET';

interface DaftarAction {
  type: typeof DAFTAR;
}

interface DaftarSuccessAction {
  type: typeof DAFTAR_SUCCESS;
}

interface DaftarFailureAction {
  type: typeof DAFTAR_FAILURE;
  payload: Error;
}

interface DaftarResetAction {
  type: typeof DAFTAR_RESET;
}

export type DaftarActions =
  | DaftarAction
  | DaftarSuccessAction
  | DaftarFailureAction
  | DaftarResetAction;
