import { createReducer } from '@reduxjs/toolkit';
import { getDefaultBoard } from './gameConfigDefaults';

export const playerReducer = createReducer({}, {

  AddPlayer: (state, action) => {
    state.player = action.payload;
  },

});


export const strategyReducer = createReducer({}, {

  SaveMyStrategy: (state, action) => {
    state.strategy = action.payload.strategy;
  },

});

const initialGameStatus = {
  opponentBoard: getDefaultBoard(),
  myBoard: getDefaultBoard(),
  activity: [],
}
export const gameStatusReducer = createReducer(initialGameStatus, {

  NextMoverId: (state, action) => {
    state.nextMoverId = action.payload.nextMoverId;
  },

  SetOpponentName: (state, action) => {
    state.opponentName = action.payload.name;
  },

  AddToOpponentBoard: (state, action) => {
    const { rIndex, cIndex, value } = action.payload;
    state.opponentBoard[rIndex][cIndex] = value;
  },

  AddToMyBoard: (state, action) => {
    const { rIndex, cIndex, value } = action.payload;
    state.myBoard[rIndex][cIndex] = value;
  },

  AddActivity: (state, action) => {
    state.activity = [action.payload.activity, ...state.activity];
  },

  RestGameStatus: (state, action) => {
    state.opponentBoard = getDefaultBoard();
    state.myBoard = getDefaultBoard();
    state.activity = [];
  },

});