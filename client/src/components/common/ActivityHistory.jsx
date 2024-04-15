import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import Container from './Container';
import './ActivityHistory.scss';

const ActivityHistory = () => {
  const { activity } = useSelector((state) => state.gameStatus);

  return (
    <div className='activityHistory'>
      <Container cStyle={{ width: '100%', padding: '30px' }}>
        <div className='activities'>
          <span className='cardTitle'>Activity History</span>
          {
            activity.map(({ message, isHit, isSinked }, key) => {
              const symbol = isSinked ? 'SINK' : (isHit) ? 'HIT' : 'MISS';

              return (<span key={key} className={cn('activityEntry', { hit: isHit, miss: !isHit })}>{symbol} - {message}</span>)
            })
          }
        </div>
      </Container>
    </div>
  )
}

export default ActivityHistory;
