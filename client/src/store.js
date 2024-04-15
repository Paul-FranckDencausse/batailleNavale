import { configureStore } from '@reduxjs/toolkit';
import { strategyReducer, playerReducer, gameStatusReducer } from './Reducer';

const store = configureStore({
  reducer: {
    player: playerReducer,
    strategy: strategyReducer,
    gameStatus: gameStatusReducer,
  },
})

export default store;