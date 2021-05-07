import { Article } from '../../models/articles';

export const FETCH_ARTICLES_LIST = 'FETCH_ARTICLES_LIST';
export const FETCH_ARTICLES_LIST_FAILURE = 'FETCH_ARTICLES_LIST_FAILURE';
export const FETCH_ARTICLES_LIST_SUCCESS = 'FETCH_ARTICLES_LIST_SUCCESS';

interface FetchArticleListAction {
  type: typeof FETCH_ARTICLES_LIST;
}

interface FetchArticleListFailureAction {
  type: typeof FETCH_ARTICLES_LIST_FAILURE;
  payload: Error;
}

interface FetchArticleListSuccessAction {
  type: typeof FETCH_ARTICLES_LIST_SUCCESS;
  payload: Article[];
}

export type ArticleAction =
  | FetchArticleListAction
  | FetchArticleListFailureAction
  | FetchArticleListSuccessAction;
