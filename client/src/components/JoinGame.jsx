import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Container from './common/Container';
import Footer from './common/Footer';
import Header from './common/Header';
import './JoinGame.scss';

const JoinGame = ({ socket }) => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search)
  const { player } = useSelector((state) => state.player);
  const [sessionId, setSessionId] = useState(query.get('sessionId') || '');
  const [joined, setJoined] = useState(false);
  const onJoinClick = () => {
    const { playerId, playerName } = player;

    socket.emit('join', { playerId, playerName, sessionId });
  };
  const onStart = () => {
    navigate(`/planning/${sessionId}`);
  };

  useEffect(() => {
    if (!player) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    socket.on('message', (payload) => {
      if (payload?.error) {
        return toast.error(payload?.error);
      }
      setJoined(payload?.joined || false);
    });
    socket.on('playerLeft', () => {
      toast.info('Host left!');
      setJoined(false);
    })
    socket.on('prepare-planning', (payload) => {
      navigate(`/planning/${payload?.sessionId}`);
    });

    return () => {
      socket.off('message');
      socket.off('playerLeft');
      socket.off('prepare-planning');
    };
  }, [socket])

  return (
    <div className='joinGame'>
      <Header />
      <Container>
        <div className='titleSection'>
          <span className='title'>Multiplayer</span>
        </div>
        <div className='contents'>
          <span className='invitaion'>Enter session ID to join a game</span>
          <div className='sessionHolder'>
            <input className="uk-input sessionIdField" type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
            <button className="uk-button joinGameButton" onClick={onJoinClick} disabled={joined}>Join</button>
          </div>
          <span className='sessionJoined'>Session joined:</span>
          <span className='sessionId'>{(joined && sessionId) || 'none'}</span>
          <button className="uk-button startGameButton" onClick={onStart} disabled={!joined}>Start game</button>
        </div>

      </Container>
      <Footer />
    </div>
  )
}

export default JoinGame