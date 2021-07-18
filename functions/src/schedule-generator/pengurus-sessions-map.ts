export function sessionsPengurusMap(sessionsRaw, pengurusRaw) {
  const sessions = {};
  const pengurus = {};

  for (let index = 0; index < Object.keys(sessionsRaw).length; index++) {
    const sessionId = Object.keys(sessionsRaw)[index];
    const currentSession = sessionsRaw[sessionId];
    const sessionPengurus = [];
    const mainTag = currentSession.tags ? currentSession.tags[0] : 'Umum';

    currentSession.pengurus &&
      currentSession.pengurus.forEach((pengurusId) => {
        if (!pengurusRaw[pengurusId]) return;
        sessionPengurus.push({ id: pengurusId, ...pengurusRaw[pengurusId] });

        const generatedPengurus = pengurus[pengurusId];
        const sessionByPengurus = {
          id: sessionId,
          mainTag: mainTag,
          ...currentSession,
        };

        if (generatedPengurus) {
          const pengurusTags = generatedPengurus.tags ? [...generatedPengurus.tags] : [];
          sessionByPengurus.tags &&
            sessionByPengurus.tags.forEach((tag) => {
              if (!pengurusTags.includes(tag)) pengurusTags.push(tag);
            });
          const pengurusSessions = generatedPengurus.sessions
            ? [...generatedPengurus.sessions, sessionByPengurus]
            : [sessionByPengurus];

          pengurus[pengurusId] = {
            ...generatedPengurus,
            tags: [...pengurusTags],
            sessions: pengurusSessions,
          };
        } else {
          pengurus[pengurusId] = {
            ...pengurusRaw[pengurusId],
            id: pengurusId,
            tags: sessionByPengurus.tags,
            sessions: [sessionByPengurus],
          };
        }
      });

    sessions[sessionId] = {
      ...currentSession,
      id: sessionId,
      mainTag: mainTag,
      pengurus: sessionPengurus,
    };
  }

  return { sessions, pengurus };
}
