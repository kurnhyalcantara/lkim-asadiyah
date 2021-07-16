import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import { sessionsPengurusScheduleMap } from './schedule-generator/pengurus-sessions-schedule-map';
import { sessionsPengurusMap } from './schedule-generator/pengurus-sessions-map';

export const sessionsWrite = functions.firestore
  .document('sessions/{session}')
  .onWrite(async () => {
    return generateAndSaveData();
  });

export const scheduleWrite = functions.firestore.document('schedule/{day}').onWrite(async () => {
  const scheduleConfig = functions.config().schedule;
  if (!scheduleConfig || typeof scheduleConfig.enabled === 'undefined') {
    console.error(
      // eslint-disable-next-line
      'Schedule config is NOT set! Run `firebase functions:config:set schedule.enabled=true`, redeploy functions and try again.'
    );
    return null;
  }
  if (scheduleConfig.enabled === 'true') {
    return generateAndSaveData();
  }
  return null;
});

export const pengurusWrite = functions.firestore
  .document('pengurus/{pengurusId}')
  .onWrite(async (change, context) => {
    const changedPengurus = change.after.exists
      ? { id: context.params.pengurusId, ...change.after.data() }
      : null;
    return generateAndSaveData(changedPengurus);
  });

async function generateAndSaveData(changedPengurus?) {
  const sessionsPromise = firestore().collection('sessions').get();
  const schedulePromise = firestore().collection('schedule').orderBy('date', 'desc').get();
  const pengurusPromise = firestore().collection('pengurus').get();

  const [sessionsSnapshot, scheduleSnapshot, pengurusSnapshot] = await Promise.all([
    sessionsPromise,
    schedulePromise,
    pengurusPromise,
  ]);

  const sessions = {};
  const schedule = {};
  const pengurus = {};

  sessionsSnapshot.forEach((doc) => {
    sessions[doc.id] = doc.data();
  });

  scheduleSnapshot.forEach((doc) => {
    schedule[doc.id] = doc.data();
  });

  pengurusSnapshot.forEach((doc) => {
    pengurus[doc.id] = doc.data();
  });

  let generatedData: {
    sessions?: {};
    pengurus?: {};
    schedule?: {};
  } = {};
  const scheduleConfig = functions.config().schedule;
  if (!scheduleConfig || typeof scheduleConfig.enabled === 'undefined') {
    console.error(
      // eslint-disable-next-line
      'Schedule config is NOT set! Run `firebase functions:config:set schedule.enabled=true`, redeploy functions and try again.'
    );
    return null;
  }
  const scheduleEnabled = scheduleConfig.enabled === 'true';

  if (!Object.keys(sessions).length) {
    generatedData.pengurus = { ...pengurus };
  } else if (!scheduleEnabled || !Object.keys(schedule).length) {
    generatedData = sessionsPengurusMap(sessions, pengurus);
  } else {
    generatedData = sessionsPengurusScheduleMap(sessions, pengurus, schedule);
  }

  // If changed pengurus does not have assigned session(s) yet
  if (changedPengurus && !generatedData.pengurus[changedPengurus.id]) {
    generatedData.pengurus[changedPengurus.id] = changedPengurus;
  }

  saveGeneratedData(generatedData.sessions, 'generatedSessions');
  saveGeneratedData(generatedData.pengurus, 'generatedPengurus');
  saveGeneratedData(generatedData.schedule, 'generatedSchedule');
}

function saveGeneratedData(data, collectionName) {
  if (!data || !Object.keys(data).length) return;

  for (let index = 0; index < Object.keys(data).length; index++) {
    const key = Object.keys(data)[index];
    firestore().collection(collectionName).doc(key).set(data[key]);
  }
}
