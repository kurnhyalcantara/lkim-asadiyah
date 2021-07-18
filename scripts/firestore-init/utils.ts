import { firestore } from '../firebase-config';
import data from '../../docs/default-firebase-data.json';

export const importPengurus = () => {
  const pengurus: { [key: string]: object } = data.pengurus;
  if (!Object.keys(pengurus).length) {
    return Promise.resolve();
  }
  console.log('Importing', Object.keys(pengurus).length, 'pengurus...');

  const batch = firestore.batch();

  Object.keys(pengurus).forEach((speakerId, order) => {
    batch.set(firestore.collection('pengurus').doc(speakerId), {
      ...pengurus[speakerId],
      order,
    });
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'pengurus');
  });
};

export const importGallery = () => {
  const gallery: string[] = data.gallery;
  if (!Object.keys(gallery).length) {
    return;
  }
  console.log('Importing gallery...');

  const batch = firestore.batch();

  Object.keys(gallery).forEach((docId: string) => {
    batch.set(firestore.collection('gallery').doc(docId.padStart(3, '0')), {
      url: gallery[Number(docId)],
      order: docId,
    });
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'images');
  });
};

export const importNews = () => {
  const news: { [key: string]: object } = data.news;
  if (!Object.keys(news).length) {
    return Promise.resolve();
  }
  console.log('Importing news...');

  const batch = firestore.batch();

  Object.keys(news).forEach((docId: string) => {
    batch.set(firestore.collection('news').doc(docId), news[docId]);
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'news posts');
  });
};

export const importArticle = () => {
  const articles: { [key: string]: object } = data.articles;
  if (!Object.keys(articles).length) {
    return Promise.resolve();
  }
  console.log('Importing articles...');

  const batch = firestore.batch();

  Object.keys(articles).forEach((docId: string) => {
    batch.set(firestore.collection('articles').doc(docId), articles[docId]);
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'articles posts');
  });
};

export const importVideos = () => {
  const docs = data.videos;
  if (!Object.keys(docs).length) {
    return Promise.resolve();
  }
  console.log('Importing videos...');

  const batch = firestore.batch();

  Object.keys(docs).forEach((docId: string) => {
    batch.set(firestore.collection('videos').doc(docId.padStart(3, '0')), {
      ...docs[Number(docId)],
      order: docId,
    });
  });

  return batch.commit().then((results) => {
    console.log('Imported data for', results.length, 'videos');
  });
};

export const importSchedule = () => {
  const docs: { [key: string]: object } = data.schedule;
  if (!Object.keys(docs).length) {
    return Promise.resolve();
  }
  console.log('Importing schedule...');

  const batch = firestore.batch();

  Object.keys(docs).forEach((docId) => {
    batch.set(firestore.collection('schedule').doc(docId), {
      ...docs[docId],
      date: docId,
    });
  });

  return batch.commit().then(() => {
    console.log('Imported data for', Object.keys(docs).length, 'days');
  });
};

export const importSessions = () => {
  const docs: { [key: string]: object } = data.sessions;
  if (!Object.keys(docs).length) {
    return Promise.resolve();
  }
  console.log('Importing sessions...');

  const batch = firestore.batch();

  Object.keys(docs).forEach((docId) => {
    batch.set(firestore.collection('sessions').doc(docId), {
      ...docs[docId],
      date: docId,
    });
  });

  return batch.commit().then(() => {
    console.log('Imported data for', Object.keys(docs).length, 'sessions');
  });
};

export const importNotificationsConfig = async () => {
  const notificationsConfig = data.notifications.config;
  console.log('Migrating notifications config...');
  const batch = firestore.batch();

  batch.set(firestore.collection('config').doc('notifications'), notificationsConfig);

  return batch.commit().then(() => {
    console.log('Imported data for notifications config');
  });
};
