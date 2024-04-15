import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { defaultColMarker, defaultRowMarker, getDefaultBoard } from '../../gameConfigDefaults';
import './MyBoard.scss';

const MyBoard = () => {
  const boardData = getDefaultBoard();
  const { strategy } = useSelector((state) => state.strategy);
  const { myBoard } = useSelector((state) => state.gameStatus);
  const insertShip = (rI, cI) => {
    const position = Number(`${rI}${cI}`);
    const ship = strategy.find((s) => s[0] === position);

    if (ship) {
      const isHorizondal = (ship[0] + 1) === ship[1];

      return (<progress className={cn('uk-progress',{horizondal: isHorizondal, vertical: !isHorizondal}, `ship-${ship.length}`)} value='1' max='1'></progress>);
    }

    return null;
  };
  const getTile = (key, cnText, value, rI, cI) => {
    if (rI !== undefined && cI !== undefined) {
      const tileStatus = myBoard[rI][cI];
      const isHit = tileStatus === 'X';
      const isMiss = tileStatus === 'O';

      return (
        <div key={key} className={cn(cnText, { hit: isHit, miss: isMiss })} >
          {insertShip(rI, cI)}
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
    <div className='myBoard'>
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

export default MyBoard;