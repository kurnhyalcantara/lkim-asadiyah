import { Failure, Pending, Success } from '@abraham/remotedata';
import { NewsState, initialNewsState } from './state';
import {
  NewsAction,
  FETCH_NEWS_LIST,
  FETCH_NEWS_LIST_FAILURE,
  FETCH_NEWS_LIST_SUCCESS,
} from './types';

export const blogReducer = (state = initialNewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case FETCH_NEWS_LIST:
      return new Pending();

    case FETCH_NEWS_LIST_FAILURE:
      return new Failure(action.payload);

    case FETCH_NEWS_LIST_SUCCESS:
      return new Success(action.payload);

    default:
      return state;
  }
};
