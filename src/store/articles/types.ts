import { Article } from '../../models/article';

export const FETCH_ARTICLE_LIST = 'FETCH_ARTICLE_LIST';
export const FETCH_ARTICLE_LIST_FAILURE = 'FETCH_ARTICLE_LIST_FAILURE';
export const FETCH_ARTICLE_LIST_SUCCESS = 'FETCH_ARTICLE_LIST_SUCCESS';

interface FetchArticleListAction {
  type: typeof FETCH_ARTICLE_LIST;
}

interface FetchArticleListFailureAction {
  type: typeof FETCH_ARTICLE_LIST_FAILURE;
  payload: Error;
}

interface FetchArticleListSuccessAction {
  type: typeof FETCH_ARTICLE_LIST_SUCCESS;
  payload: Article[];
}

export type ArticleAction =
  | FetchArticleListAction
  | FetchArticleListFailureAction
  | FetchArticleListSuccessAction;
