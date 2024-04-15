import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { defaultColMarker, defaultRowMarker, getDefaultBoard } from '../../gameConfigDefaults';
import './OpponentBoard.scss';

const OpponentBoard = ({ socket, sessionId }) => {
  const boardData = getDefaultBoard();
  const { player } = useSelector((state) => state.player);
  const { opponentBoard, nextMoverId } = useSelector((state) => state.gameStatus);
  const playerId = player?.playerId;
  const isMyTurn = playerId === nextMoverId;
  const onClick = (rI, cI) => {
    if (!isMyTurn) {
      return toast.info('Please wait for your turn!');
    }
    if (opponentBoard[rI][cI]) {
      return toast.error('Action already performed for the selected tile!');
    }
    socket.emit('move', { sessionId, playerId, position: Number(`${rI}${cI}`) });
  }
  const getTile = (key, cnText, value, rI, cI) => {
    if (rI !== undefined && cI !== undefined) {
      const tileStatus = opponentBoard[rI][cI];
      const isHit = tileStatus === 'X';
      const isMiss = tileStatus === 'O';

      return (
        <div key={key} className={cn(cnText, { hit: isHit, miss: isMiss })} onClick={() => onClick(rI, cI)}>
          {tileStatus}
        </div>
      );
    }
    return (
      <div key={key} className={cnText} >
        {value}
      </div>
    );
  };

  return (
    <div className='opponentBoard'>
      <div className='board'>
        <div className='bRow'>
          {getTile('bCorner', cn('bCol', `bCorner`), '')}
          {defaultRowMarker.map((num, i) => getTile(i, cn('bCol', `bNum`), num))}
        </div>
        {boardData.map((row, rIndex) => (
          <div key={rIndex} className='bRow'>
            {getTile(defaultColMarker[rIndex], cn('bCol', `bAlp`), defaultColMarker[rIndex])}
            {row.map((val, cIndex) => getTile(cIndex, cn('bCol', `bRow-${rIndex}`, `bCol-${cIndex}`), val, rIndex, cIndex))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OpponentBoard;