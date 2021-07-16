import { Dispatch } from 'redux';
import { News } from '../../models/news';
import { mergeId } from '../../utils/merge-id';
import { db } from '../db';
import {
  NewsAction,
  FETCH_NEWS_LIST,
  FETCH_NEWS_LIST_FAILURE,
  FETCH_NEWS_LIST_SUCCESS,
} from './types';

const getNews = async (): Promise<News[]> => {
  const { docs } = await db().collection('news').orderBy('published', 'desc').get();
  return docs.map<News>(mergeId);
};

export const fetchNewsList = () => async (dispatch: Dispatch<NewsAction>) => {
  dispatch({
    type: FETCH_NEWS_LIST,
  });

  try {
    dispatch({
      type: FETCH_NEWS_LIST_SUCCESS,
      payload: await getNews(),
    });
  } catch (error) {
    dispatch({
      type: FETCH_NEWS_LIST_FAILURE,
      payload: error,
    });
  }
};
