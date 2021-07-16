import { Initialized, RemoteData } from '@abraham/remotedata';

export type DaftarState = RemoteData<Error, true>;
export const initialDaftarState: DaftarState = new Initialized();
