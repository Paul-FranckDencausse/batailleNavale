
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetGameStatus } from '../../Actions';
import './Winner.scss';

const Winner = ({ socket, playerName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onExit = () => {
    socket.emit('leave');
    dispatch(resetGameStatus());
    navigate('/');
  };

  return (
    <div className='uk-modal uk-open winner'>
      <div className='uk-modal-dialog uk-modal-body uk-text-center'>
        <h3 className='winnerText'>{playerName} is the winner!</h3>
        <button className='uk-button exitButton' onClick={onExit}>Exit</button>
      </div>
    </div>
  )
}

export default Winner
