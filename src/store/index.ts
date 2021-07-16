import { configureStore } from '@reduxjs/toolkit';
import { newsReducer } from './news/reducers';
import { articleReducer } from './articles/reducers';
import { dialogsReducer } from './dialogs/reducers';
import { featuredSessionsReducer } from './featured-sessions/reducers';
import { feedbackReducer } from './feedback/reducers';
import { filtersReducer } from './filters/reducers';
import { galleryReducer } from './gallery/reducers';
import { notificationsReducer } from './notifications/reducers';
import { previousSpeakersReducer } from './previous-speakers/reducers';
import { routingReducer } from './routing/reducers';
import { scheduleReducer } from './schedule/reducers';
import { sessionsReducer } from './sessions/reducers';
import { pengurusReducer } from './pengurus/reducers';
import { subscribeReducer } from './subscribe/reducers';
import { signupReducer } from './signup/reducers';
import { toastReducer } from './toast/reducers';
import { uiReducer } from './ui/reducers';
import { credentialReducer } from './credential/reducers';
import { userReducer } from './users/reducers';
import { videosReducer } from './videos/reducers';

const rootReducer = {
  news: newsReducer,
  article: articleReducer,
  dialogs: dialogsReducer,
  featuredSessions: featuredSessionsReducer,
  feedback: feedbackReducer,
  filters: filtersReducer,
  gallery: galleryReducer,
  notifications: notificationsReducer,
  previousSpeakers: previousSpeakersReducer,
  routing: routingReducer,
  schedule: scheduleReducer,
  sessions: sessionsReducer,
  pengurus: pengurusReducer,
  subscribed: subscribeReducer,
  signup: signupReducer,
  toast: toastReducer,
  ui: uiReducer,
  credential: credentialReducer,
  user: userReducer,
  videos: videosReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
