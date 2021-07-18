import { Initialized, RemoteData } from '@abraham/remotedata';
import { News } from '../../models/news';

export type NewsState = RemoteData<Error, News[]>;
export const initialNewsState: NewsState = new Initialized();
