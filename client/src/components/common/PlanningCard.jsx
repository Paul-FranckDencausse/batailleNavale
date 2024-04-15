import React from 'react';
import cn from 'classnames';
import Container from './Container';
import './PlanningCard.scss';

const PlanningCard = ({ availableShips, onReady }) => {
  const shipSizes = Object.keys(availableShips).filter((k) => k > 0).sort().reverse();
  const isReady = shipSizes.every((sSize) => availableShips[sSize] <= 0);
  const dragStart = (e, shipSize) => {
    e.dataTransfer.setData("shipSize", shipSize);
  };

  return (
    <div className='planningCard'>
      <Container cStyle={{ width: '100%', padding: '20px' }}>
        <div className='planning'>
          <span className='cardTitle'>Planning</span>
          <span className='cardText'>Place your ships on the board </span>
          <div className='ships'>
            {
              shipSizes.map((size) => (
                <div key={size} className='ship'>
                  <progress className={cn('uk-progress', `ship-${size}`)} value="1" max="1" onDragStart={(e) => dragStart(e, size)} draggable={availableShips[size] > 0} />
                  <span className='cardText'> X {availableShips[size]}</span>
                </div>
              ))
            }
          </div>
          <span className='cardText instruction'>Drag and drop your ships onto the board to place them</span>
          <span className='cardText instruction'>Click ship on the board to manage the ship's position</span>
        </div>
      </Container>
      <button className='uk-button readyButton' disabled={!isReady} onClick={onReady}>Ready</button>
    </div>
  )
}

export default PlanningCard