import {
  importNews,
  importArticle,
  importGallery,
  importNotificationsConfig,
  importSchedule,
  importSessions,
  importPengurus,
  importVideos,
} from './utils';

importNews()
  .then(() => importArticle())
  .then(() => importGallery())
  .then(() => importNotificationsConfig())
  .then(() => importSchedule())
  .then(() => importSessions())
  .then(() => importPengurus())
  .then(() => importVideos())
  .then(() => {
    console.log('Finished');
    process.exit();
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit();
  });
