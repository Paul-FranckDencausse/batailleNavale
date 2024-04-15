import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addActivity, addToMyBoard, addToOpponentBoard, setNextMoverId } from '../Actions';
import { convertToCoordinates, convertToMarker } from '../boardHelper';
import ActivityHistory from './common/ActivityHistory';
import Container from './common/Container';
import Footer from './common/Footer';
import Header from './common/Header';
import MyBoard from './common/MyBoard';
import OpponentBoard from './common/OpponentBoard';
import PlayerInfo from './common/PlayerInfo';
import Winner from './common/Winner';
import './Game.scss';

const Game = ({ socket }) => {
  const dispatch = useDispatch();
  const sessionId = useParams().sessionId;
  const { player } = useSelector((state) => state.player);
  const { opponentName } = useSelector((state) => state.gameStatus);
  const [tab, setTab] = useState(1);
  const [winner, setWinner] = useState('');
  const updateOpponentBoard = (isHit, position) => {
    const { rIndex, cIndex } = convertToCoordinates(position);

    dispatch(addToOpponentBoard(rIndex, cIndex, (isHit ? 'X' : 'O')));
  };
  const updateMyBoard = (isHit, position) => {
    const { rIndex, cIndex } = convertToCoordinates(position);

    dispatch(addToMyBoard(rIndex, cIndex, (isHit ? 'X' : 'O')));
  };
  const addActivityEntry = ({ isHit, isSinked, message }) => {
    dispatch(addActivity({ isHit, isSinked, message }));
  }

  useEffect(() => {
    if (!player) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    socket.on('move-status', (payload) => {
      const { playerId, status, isHit, isSinked, winnerId, nextMoverId, position } = payload;

      if (!status) {
        return toast.error('Something wrong!');
      }
      const isMyMoveRes = playerId === player?.playerId;

      if (isMyMoveRes) {
        updateOpponentBoard(isHit, position);
      }
      if (!isMyMoveRes) {
        updateMyBoard(isHit, position);
      }
      addActivityEntry({ isHit, isSinked, message: `${convertToMarker(position)} by ${isMyMoveRes ? player.playerName : opponentName}` });

      if (winnerId) {
        setWinner((winnerId === player?.playerId) ? player?.playerName : opponentName)
        dispatch(setNextMoverId(''));
        return;
      }
      dispatch(setNextMoverId(nextMoverId));
    });
    socket.on('playerLeft', (payload) => {
      return toast.info('Opponent left!');
    });

    return () => {
      toast.dismiss();
      socket.off('move-status');
      socket.off('playerLeft');
    };
  }, []);

  return (
    <div className='game'>
      <Header />
      <div className='contents'>
        <PlayerInfo />
        <div className='gBoard'>
          <Container cStyle={{ width: '100%', padding: '20px' }}>
            <ul className='uk-tab tabHeader'>
              <li className={cn({ 'uk-active': (tab === 0) })} onClick={() => setTab(0)}><a className='tabHeaderText'>Your Board</a></li>
              <li className={cn({ 'uk-active': (tab === 1) })} onClick={() => setTab(1)}><a className='tabHeaderText'>Opponents Board</a></li>
            </ul>
            <div className='tabContent'>
              {(tab === 0) && <MyBoard />}
              {(tab === 1) && <OpponentBoard sessionId={sessionId} socket={socket} />}
            </div>
          </Container>
        </div>
        <ActivityHistory />
      </div>
      {winner && <Winner socket={socket} playerName={winner} />}
      <Footer />
    </div>
  );
}

export default Game