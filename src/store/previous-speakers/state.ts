import { Initialized, RemoteData } from '@abraham/remotedata';
import { Pengurus } from '../../models/pengurus';

export type PreviousSpeakersState = RemoteData<Error, Pengurus[]>;
export const initialPreviousSpeakersState: PreviousSpeakersState = new Initialized();
