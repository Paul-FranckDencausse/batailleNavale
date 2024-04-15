export const addPlayer = (playerId, playerName) => async (dispatch) => {
  dispatch({
    type: "AddPlayer",
    payload: { playerId, playerName }
  })
};

export const saveMyStrategy = (strategy) => async (dispatch) => {
  dispatch({
    type: "SaveMyStrategy",
    payload: { strategy }
  })
};

export const setNextMoverId = (nextMoverId) => async (dispatch) => {
  dispatch({
    type: "NextMoverId",
    payload: { nextMoverId }
  })
};

export const setOpponentName = (name) => async (dispatch) => {
  dispatch({
    type: "SetOpponentName",
    payload: { name }
  })
};

export const addToOpponentBoard = (rIndex, cIndex, value) => async (dispatch) => {
  dispatch({
    type: "AddToOpponentBoard",
    payload: { rIndex, cIndex, value }
  })
};

export const addToMyBoard = (rIndex, cIndex, value) => async (dispatch) => {
  dispatch({
    type: "AddToMyBoard",
    payload: { rIndex, cIndex, value }
  })
};

export const addActivity = (activity) => async (dispatch) => {
  dispatch({
    type: "AddActivity",
    payload: { activity }
  })
};

export const resetGameStatus = () => async (dispatch) => {
  dispatch({
    type: "RestGameStatus",
    payload: {}
  })
};
