const { generate: generateId } = require('shortid');

const sessions = [];

const getSession = (sessionId) => {
  return sessions.find((session) => session.id === sessionId);
};

const getSessionBySocketId = (socketId) => {
  return sessions.find((session) => {
    const { player1, player2 } = session;

    return ((player1 && player1.socketId === socketId) || (player2 && player2.socketId === socketId))
  });
};

const createSession = (playerId, playerName, socketId) => {
  const id = generateId();
  const session = {
    id,
    player1: {
      playerId,
      playerName,
      strategy: [],
      socketId,
      hitList: new Set([]),
      missList: new Set([]),
      ready: false
    }
  };

  sessions.push(session);

  return session;
};

const deleteSession = (sessionId) => {
  let index = sessions.findIndex((session) => session.id === sessionId);

  if (index !== -1) {
    return sessions.splice(index, 1)[0];
  }
}

const joinSession = (sessionId, playerId, playerName, socketId) => {
  const session = getSession(sessionId)

  if (!session || session.player2) {
    return;
  }
  session.player2 = {
    playerId,
    playerName,
    strategy: [],
    socketId,
    hitList: new Set([]),
    missList: new Set([]),
    ready: false
  };

  return session;
};

const assignStrategy = (sessionId, playerId, strategy) => {
  const session = getSession(sessionId);

  if (!session) {
    return;
  }
  if (session.player1?.playerId === playerId) {
    session.player1.strategy = strategy;
    session.player1.ready = true;
  }
  if (session.player2?.playerId === playerId) {
    session.player2.strategy = strategy;
    session.player2.ready = true;
  }
}

const readyToStart = (sessionId) => {
  const session = getSession(sessionId);

  if (!session) {
    return false;
  }
  return (session.player1?.ready && !!session.player2?.ready);
}

const startGame = (sessionId) => {
  const session = getSession(sessionId)

  if (!session || !session.player1 || !session.player2) {
    return;
  }
  const { player1, player2 } = session;

  if (!session.nextMoverId) {
    session.nextMoverId = (Math.floor(Math.random() * 10) % 2) ? player1.playerId : player2.playerId;
  }

  return session.nextMoverId;
}

const getImpactedShip = (strategy, impactPosition) => strategy.find((ship) => ship.some((position) => position === impactPosition));

const isAllShipSinked = (strategy, hitList) => strategy.every((ship) => ship.every((position) => hitList.has(position)));

const makeMove = (sessionId, playerId, position) => {
  const session = getSession(sessionId);
  const response = { status: false };

  if (session) {
    const { player1, player2 } = session;
    const player = (player1.playerId === playerId) ? player1 : player2;
    const opponent = (player1.playerId === playerId) ? player2 : player1;

    if (player.hitList.has(position) || player.missList.has(position)) {
      return response;
    }
    response.isHit = opponent.strategy.some((ship) => ship.some((p) => p === position));

    if (response.isHit) {
      player.hitList.add(position);
    } else {
      player.missList.add(position);
    }

    if (response.isHit) {
      const ship = getImpactedShip(opponent.strategy, position);

      response.isSinked = ship.every((position) => player.hitList.has(position))
    }
    const isGameOver = isAllShipSinked(opponent.strategy, player.hitList);

    if (isGameOver) {
      response.winnerId = playerId;
      session.nextMoverId = '';
    }

    if (!isGameOver) {
      session.nextMoverId = (player1.playerId === playerId) ? player2.playerId : player1.playerId;
      response.nextMoverId = session.nextMoverId;
    }

    response.status = true;
  }

  return response;
};

const leaveSession = (socketId) => {
  const session = getSessionBySocketId(socketId);

  if (session) {
    const { id, player1, player2 } = session;

    if (player1 && player1.socketId === socketId) {
      deleteSession(id)
      return id;
    }
    if (player2 && player2.socketId === socketId) {
      delete session.player2;
      return id;
    }
  }
}

const getPlayerNames = (sessionId) => {
  const session = getSession(sessionId);
  const names = [];

  if (session?.player1) {
    names.push(session?.player1.playerName);
  }
  if (session?.player2) {
    names.push(session?.player2.playerName);
  }

  return names;
}

module.exports = {
  createSession,
  deleteSession,
  joinSession,
  assignStrategy,
  readyToStart,
  startGame,
  makeMove,
  leaveSession,
  getPlayerNames,
};
