import { configureStore } from '@reduxjs/toolkit';
import { newsReducer } from './news/reducers';
import { articleReducer } from './articles/reducers';
import { dialogsReducer } from './dialogs/reducers';
import { featuredSessionsReducer } from './featured-sessions/reducers';
import { feedbackReducer } from './feedback/reducers';
import { filtersReducer } from './filters/reducers';
import { galleryReducer } from './gallery/reducers';
import { notificationsReducer } from './notifications/reducers';
import { partnersReducer } from './partners/reducers';
import { potentialPartnersReducer } from './potential-partners/reducers';
import { previousSpeakersReducer } from './previous-speakers/reducers';
import { routingReducer } from './routing/reducers';
import { scheduleReducer } from './schedule/reducers';
import { sessionsReducer } from './sessions/reducers';
import { pengurusReducer } from './pengurus/reducers';
import { subscribeReducer } from './subscribe/reducers';
import { signupReducer } from './signup/reducers';
import { teamReducer } from './team/reducers';
import { ticketsReducer } from './tickets/reducers';
import { toastReducer } from './toast/reducers';
import { uiReducer } from './ui/reducers';
import { userReducer } from './user/reducers';
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
  partners: partnersReducer,
  potentialPartners: potentialPartnersReducer,
  previousSpeakers: previousSpeakersReducer,
  routing: routingReducer,
  schedule: scheduleReducer,
  sessions: sessionsReducer,
  pengurus: pengurusReducer,
  subscribed: subscribeReducer,
  signup: signupReducer,
  team: teamReducer,
  tickets: ticketsReducer,
  toast: toastReducer,
  ui: uiReducer,
  user: userReducer,
  videos: videosReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
