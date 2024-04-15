import React, { useState } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { defaultColMarker, defaultRowMarker, getDefaultBoard } from '../../gameConfigDefaults';
import Container from './Container';
import './PlanningBoard.scss';
import { getShipPosition } from '../../planningHelper';


const Ship = ({ ship, onShipDelete, onShipRotate }) => {
  const { strategy } = useSelector((state) => state.strategy);
  const isHorizondal = getShipPosition(ship) === 'row';
  const [showOption, setShowOption] = useState(false);
  const onShipClick = () => {
    if (strategy?.length) {
      return toast.info('Modification not allowed!');
    }
    setShowOption(!showOption);
  };

  return (
    <div className='ship' onClick={onShipClick}>
      <progress className={cn('uk-progress',{horizondal: isHorizondal, vertical: !isHorizondal}, `ship-${ship.length}`)} value='1' max='1' ></progress>
      { showOption && <FontAwesomeIcon className='actionIcon' icon="trash" color="red" title='Delete ship' onClick={() => onShipDelete(ship)}/>}
      { showOption && isHorizondal && <FontAwesomeIcon className='actionIcon' icon="rotate-right" color='blue' title='Rotate ship' onClick={() => onShipRotate(ship) } />}
      { showOption && !isHorizondal && <FontAwesomeIcon className='actionIcon' icon="rotate-left" color='blue' title='Rotate ship' onClick={() => onShipRotate(ship) } />}
    </div>
  );
};

const PlanningBoard = ({ strategy, onShipDrop, onShipDelete, onShipRotate }) => {
  const boardData = getDefaultBoard();
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (e, rIndex, cIndex) => {
    e.preventDefault();
    onShipDrop(rIndex, cIndex, Number(e.dataTransfer.getData("shipSize")));
  };
  
  const insertShip = (rI, cI) => {
    const position = Number(`${rI}${cI}`);
    const ship = strategy.find((s) => s[0] === position);

    return ship ? (<Ship ship={ship} onShipDelete={onShipDelete} onShipRotate={onShipRotate} />) : null;
  };
  const getTile = (key, cnText, value, rI, cI) => {
    if (rI !== undefined && cI !== undefined) {
      return (
        <div key={key} id={`${rI}${cI}`} className={cnText} onDragOver={onDragOver} onDrop={(e) => onDrop(e, rI, cI)} >
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
    <div className='boardContainer'>
      <Container cStyle={{ width: '100%', padding: '20px' }}>
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
      </Container>
    </div>
  )
}

export default PlanningBoard