import { Failure, Pending, Success } from '@abraham/remotedata';
import { ArticleState, initialArticleState } from './state';
import {
  ArticleAction,
  FETCH_ARTICLE_LIST,
  FETCH_ARTICLE_LIST_FAILURE,
  FETCH_ARTICLE_LIST_SUCCESS,
} from './types';

export const articleReducer = (
  state = initialArticleState,
  action: ArticleAction
): ArticleState => {
  switch (action.type) {
    case FETCH_ARTICLE_LIST:
      return new Pending();

    case FETCH_ARTICLE_LIST_FAILURE:
      return new Failure(action.payload);

    case FETCH_ARTICLE_LIST_SUCCESS:
      return new Success(action.payload);

    default:
      return state;
  }
};
