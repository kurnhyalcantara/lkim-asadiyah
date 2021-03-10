import {
  importBlog,
  importGallery,
  importNotificationsConfig,
  importPartners,
  importSchedule,
  importSessions,
  importPengurus,
  importTeam,
  importTickets,
  importVideos,
} from './utils';

importBlog()
  .then(() => importGallery())
  .then(() => importNotificationsConfig())
  .then(() => importPartners())
  .then(() => importSchedule())
  .then(() => importSessions())
  .then(() => importPengurus())
  .then(() => importTeam())
  .then(() => importTickets())
  .then(() => importVideos())
  .then(() => {
    console.log('Finished');
    process.exit();
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit();
  });
