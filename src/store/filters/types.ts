export const SET_FILTERS = 'SET_FILTERS';

export interface FiltersState {
  tags: string[];
  partisipants: string[];
}

interface SetFiltersAction {
  type: typeof SET_FILTERS;
  payload: FiltersState;
}

export type FiltersActions = SetFiltersAction;
