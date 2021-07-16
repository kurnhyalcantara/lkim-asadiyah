import { Dispatch } from 'redux';
import { Session } from '../../models/session';
import { mergeId } from '../../utils/merge-id';
import { db } from '../db';
import { FiltersActions, SET_FILTERS } from '../filters/types';
import {
  FETCH_SESSIONS,
  FETCH_SESSIONS_FAILURE,
  FETCH_SESSIONS_SUCCESS,
  SessionsActions,
} from './types';

const getSessions = async () => {
  const { docs } = await db().collection('generatedSessions').orderBy('id', 'desc').get();
  const tagFilters = new Set<string>();
  const partisipantsFilters = new Set<string>();
  const sessions = docs.map<Session>(mergeId);

  sessions.forEach((session) => {
    (session.tags || []).map((tag) => tagFilters.add(tag.trim()));
    session.partisipants && partisipantsFilters.add(session.partisipants.trim());
  });

  return {
    partisipantsFilters,
    sessions,
    tagFilters,
  };
};

export const fetchSessions = () => async (dispatch: Dispatch<SessionsActions | FiltersActions>) => {
  dispatch({
    type: FETCH_SESSIONS,
  });

  try {
    const { partisipantsFilters, sessions, tagFilters } = await getSessions();

    dispatch({
      type: FETCH_SESSIONS_SUCCESS,
      payload: sessions,
    });
    dispatch({
      type: SET_FILTERS,
      payload: {
        tags: [...tagFilters].sort(),
        partisipants: [...partisipantsFilters],
      },
    });
  } catch (error) {
    dispatch({
      type: FETCH_SESSIONS_FAILURE,
      payload: error,
    });
  }
};
