export function sessionsPengurusScheduleMap(sessionsRaw, pengurusRaw, scheduleRaw) {
  let schedule = {};
  const sessions = {};
  let pengurus = {};
  let scheduleTags = [];

  for (const dayKey of Object.keys(scheduleRaw)) {
    const day = scheduleRaw[dayKey];
    let dayTags = [];
    const timeslots = [];
    const extensions = {};

    const timeslotLen = day.timeslots.length;
    for (let timeslotsIndex = 0; timeslotsIndex < timeslotLen; timeslotsIndex++) {
      const timeslot = day.timeslots[timeslotsIndex];
      let innerSessions = [];

      const sessionsLen = timeslot.sessions.length;
      for (let sessionIndex = 0; sessionIndex < sessionsLen; sessionIndex++) {
        const subSessions = [];

        const subSessionsLen = timeslot.sessions[sessionIndex].items.length;
        for (let subSessionIndex = 0; subSessionIndex < subSessionsLen; subSessionIndex++) {
          const sessionId = timeslot.sessions[sessionIndex].items[subSessionIndex];
          const subsession = sessionsRaw[sessionId];
          const mainTag = subsession.tags ? subsession.tags[0] : 'Umum';

          if (subsession.tags) {
            dayTags = [...new Set([...dayTags, ...subsession.tags])];
          }
          scheduleTags = addTagTo(scheduleTags || [], mainTag);

          const finalSubSession = Object.assign({}, subsession, {
            mainTag,
            id: sessionId.toString(),
            day: dayKey,
            pengurus: subsession.pengurus
              ? subsession.pengurus.map((pengurusId) =>
                  Object.assign(
                    {
                      id: pengurusId,
                    },
                    pengurusRaw[pengurusId],
                    {
                      sessions: null,
                    }
                  )
                )
              : [],
          });

          subSessions.push(finalSubSession);
          sessions[sessionId] = finalSubSession;
          if (subsession.pengurus) {
            pengurus = Object.assign(
              {},
              pengurus,
              updatePengurusSessions(pengurusRaw, subsession.pengurus, finalSubSession, pengurus)
            );
          }
        }

        const start = `${timeslotsIndex + 1} / ${sessionIndex + 1}`;
        const end = `${timeslotsIndex + (timeslot.sessions[sessionIndex].extend || 0) + 1} / ${
          sessionsLen !== 1
            ? sessionIndex + 2
            : Object.keys(extensions).length
            ? Object.keys(extensions)[0]
            : 1
        }`;

        if (timeslot.sessions[sessionIndex].extend) {
          extensions[sessionIndex + 1] = timeslot.sessions[sessionIndex].extend;
        }

        innerSessions = [
          ...innerSessions,
          {
            gridArea: `${start} / ${end}`,
            items: subSessions,
          },
        ];
      }

      for (const [key, value] of Object.entries(extensions)) {
        if (value === 1) {
          delete extensions[key];
        } else {
          extensions[key] = value;
        }
      }

      timeslots.push(
        Object.assign({}, timeslot, {
          sessions: innerSessions,
        })
      );
    }

    schedule = Object.assign({}, schedule, {
      [dayKey]: Object.assign({}, day, {
        timeslots,
        tags: dayTags,
      }),
    });
  }

  return {
    sessions,
    schedule,
    pengurus,
  };
}

function addTagTo(array, element) {
  if (array.indexOf(element) < 0) {
    return [...array, element];
  }
}

function updatePengurusSessions(pengurusRaw, pengurusIds, session, generatedPengurus) {
  const result = {};
  for (let i = 0; i < pengurusIds.length; i++) {
    const pengurus = pengurusRaw[pengurusIds[i]];
    const generatedSpeaker = generatedPengurus[pengurusIds[i]];
    const hasSessionsAssigned =
      generatedSpeaker && generatedSpeaker.sessions && generatedSpeaker.sessions.length;

    if (pengurus) {
      const pengurusSessions = hasSessionsAssigned ? [...generatedSpeaker.sessions] : [];

      if (!pengurusSessions.filter((pengurusSession) => pengurusSession.id === session.id).length) {
        pengurusSessions.push(session);
      }

      const pengurusTags = hasSessionsAssigned ? [...generatedSpeaker.tags] : [];
      pengurusSessions.forEach((session) => {
        if (session.tags)
          session.tags.forEach((tag) => {
            if (!pengurusTags.includes(tag)) pengurusTags.push(tag);
          });
      });

      result[pengurusIds[i]] = Object.assign({}, pengurus, {
        id: pengurusIds[i],
        sessions: pengurusSessions,
        tags: pengurusTags,
      });
    }
  }
  return result;
}

