import { Pending, RemoteData } from '@abraham/remotedata';
import { Pengurus } from '../../models/pengurus';

export type PengurusState = RemoteData<Error, Pengurus[]>;
export const initialPengurusState: PengurusState = new Pending();
