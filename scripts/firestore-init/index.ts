import {
  importNews,
  importArticle,
  importGallery,
  importNotificationsConfig,
  importSchedule,
  importPengurus,
  importVideos,
} from './utils';

importNews()
  .then(() => importArticle())
  .then(() => importGallery())
  .then(() => importNotificationsConfig())
  .then(() => importSchedule())
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
