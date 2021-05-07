import { Initialized, RemoteData } from '@abraham/remotedata';
import { Article } from '../../models/articles';

export type ArticleState = RemoteData<Error, Article[]>;
export const initialArticleState: ArticleState = new Initialized();
