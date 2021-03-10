import { Initialized, RemoteData } from '@abraham/remotedata';
import { Article } from '../../models/article';

export type ArticleState = RemoteData<Error, Article[]>;
export const initialArticleState: ArticleState = new Initialized();
