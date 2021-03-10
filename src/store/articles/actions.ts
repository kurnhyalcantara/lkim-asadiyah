import { Dispatch } from 'redux';
import { Article } from '../../models/article';
import { mergeId } from '../../utils/merge-id';
import { db } from '../db';
import {
  ArticleAction,
  FETCH_ARTICLE_LIST,
  FETCH_ARTICLE_LIST_FAILURE,
  FETCH_ARTICLE_LIST_SUCCESS,
} from './types';

const getArticle = async (): Promise<Article[]> => {
  const { docs } = await db().collection('blog').orderBy('published', 'desc').get();

  return docs.map<Article>(mergeId);
};

export const fetchArticleList = () => async (dispatch: Dispatch<ArticleAction>) => {
  dispatch({
    type: FETCH_ARTICLE_LIST,
  });

  try {
    dispatch({
      type: FETCH_ARTICLE_LIST_SUCCESS,
      payload: await getArticle(),
    });
  } catch (error) {
    dispatch({
      type: FETCH_ARTICLE_LIST_FAILURE,
      payload: error,
    });
  }
};
