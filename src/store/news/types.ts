import { News } from '../../models/news';

export const FETCH_NEWS_LIST = 'FETCH_NEWS_LIST';
export const FETCH_NEWS_LIST_FAILURE = 'FETCH_NEWS_LIST_FAILURE';
export const FETCH_NEWS_LIST_SUCCESS = 'FETCH_NEWS_LIST_SUCCESS';

interface FetchBlogListAction {
  type: typeof FETCH_NEWS_LIST;
}

interface FetchBlogListFailureAction {
  type: typeof FETCH_NEWS_LIST_FAILURE;
  payload: Error;
}

interface FetchBlogListSuccessAction {
  type: typeof FETCH_NEWS_LIST_SUCCESS;
  payload: News[];
}

export type NewsAction =
  | FetchBlogListAction
  | FetchBlogListFailureAction
  | FetchBlogListSuccessAction;
