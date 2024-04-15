import React from 'react';
import { useSelector } from 'react-redux';
import './PlayerInfo.scss';

const PlayerInfo = () => {
  const { player } = useSelector((state) => state.player);
  const gameStatus = useSelector((state) => state.gameStatus);
  const playerName = player?.playerName || '';
  const opponentName = gameStatus?.opponentName || '';
  const nextMoverId = gameStatus?.nextMoverId;
  const isMyTurn = player?.playerId === nextMoverId;
  const myName = isMyTurn ? `${playerName}'s turn (You)` : `${playerName} (You)`;
  const oName = isMyTurn ? opponentName : `${opponentName}'s turn`;

  return (
    <div className='playerInfo'>
      <button className='uk-button playerButton' disabled={!isMyTurn}>{myName}</button>
      <button className='uk-button playerButton' disabled={isMyTurn}>{oName}</button>
    </div>
  )
}

export default PlayerInfo;