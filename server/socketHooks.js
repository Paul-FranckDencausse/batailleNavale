const { createSession, joinSession, assignStrategy, readyToStart, getPlayerNames, makeMove, startGame, leaveSession } = require('./gameManager');

const initializeSocketHooks = (io) => {
  io.on('connection', (client) => {

    client.on('create', (payload) => {
      const { playerId, playerName } = payload;
      const session = createSession(playerId, playerName, client.id);

      client.join(session.id);

      client.emit('message', { created: true, sessionId: session.id });
    });

    client.on('join', (payload) => {
      const { sessionId, playerId, playerName } = payload;
      const session = joinSession(sessionId, playerId, playerName, client.id);

      if (!session) {
        client.emit('message', { error: 'Session does not exists or full' });
        return;
      }
      client.join(session.id);
      client.emit('message', { joined: true, sessionId: session.id });
      client.to(session.id).emit('playerJoined', { playerName, joined: true });
    });

    client.on('prepare-planning', (payload) => {
      const { sessionId } = payload;

      io.in(sessionId).emit('prepare-planning', { sessionId });
    });

    client.on('planning-ready', (payload) => {
      const { sessionId, playerId, strategy } = payload;

      assignStrategy(sessionId, playerId, strategy);

      if (readyToStart(sessionId)) {
        const nextMoverId = startGame(sessionId);
        const players = getPlayerNames(sessionId);

        io.in(sessionId).emit('start-game', { sessionId, nextMoverId, players });
      } else {
        io.in(sessionId).emit('plan-registered', { sessionId, playerId });
      }
    });

    client.on('move', (payload) => {
      const { sessionId, playerId, position } = payload;
      const response = makeMove(sessionId, playerId, position);

      io.in(sessionId).emit('move-status', { ...payload, ...response });
    });

    client.on('leave', () => {
      const sessionId = leaveSession(client.id);
      io.in(sessionId).emit('playerLeft', { sessionId });
    })

    client.on('disconnect', () => {
      const sessionId = leaveSession(client.id);
      io.in(sessionId).emit('playerLeft', { sessionId });
    })

  })
}

module.exports = {
  initializeSocketHooks,
};
