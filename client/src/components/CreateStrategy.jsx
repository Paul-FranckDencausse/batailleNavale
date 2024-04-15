import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveMyStrategy, setNextMoverId, setOpponentName } from '../Actions';
import { convertToCoordinates } from '../boardHelper';
import { defaultShipConfig } from '../gameConfigDefaults';
import { getShipPosition, hasSpacesForShipPlacement, placeShip, removeShip, rotateShip } from '../planningHelper';
import Footer from './common/Footer';
import Header from './common/Header';
import PlanningBoard from './common/PlanningBoard';
import PlanningCard from './common/PlanningCard';
import './CreateStrategy.scss';

const CreateStrategy = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = useParams().sessionId;
  const { player } = useSelector((state) => state.player);
  const [opponentReady, setOpponentReady] = useState(false);
  const [availableShips, setAvailableShips] = useState(defaultShipConfig);
  const [strategy, setStrategy] = useState([]);
  const addToAvailableShips = (sSize) => {
    if (sSize) {
      const aShips = { ...availableShips };

      aShips[sSize]++;
      setAvailableShips(aShips);
    }
  };
  const removeFromAvailableShips = (sSize) => {
    const aShips = { ...availableShips };

    aShips[sSize]--;
    setAvailableShips(aShips);
  };
  const onShipDrop = (rI, cI, sSize) => {
    const hasSpace = hasSpacesForShipPlacement([...strategy], rI, cI, sSize);

    if (!hasSpace) {
      return toast.info('Unable to complete action due to collide with other ships or edges');
    }
    setStrategy(placeShip([...strategy], rI, cI, sSize));
    removeFromAvailableShips(sSize);
  };
  const onShipDelete = (ship) => {
    setStrategy(removeShip([...strategy], ship));
    addToAvailableShips(ship.length);
  };
  const onShipRotate = (ship) => {
    const { rIndex, cIndex } = convertToCoordinates(ship[0]);
    const isHorizondal = getShipPosition(ship) === 'row';
    const targetPosition = isHorizondal ? 'col' : 'row';
    const nStrategy = removeShip(strategy, ship);
    const hasSpace = hasSpacesForShipPlacement([...nStrategy], rIndex, cIndex, ship.length, targetPosition);

    if (!hasSpace) {
      nStrategy.push(ship);
      setStrategy(nStrategy);
      return toast.info('Unable to complete action due to collide with other ships or edges');
    }
    setStrategy(rotateShip([...strategy], ship, targetPosition));
  };
  const onReady = () => {
    dispatch(saveMyStrategy([...strategy]));
    socket.emit('planning-ready', { sessionId, playerId: player.playerId, strategy: [...strategy] });
    if (!opponentReady) {
      toast.promise(new Promise(() => { }), { pending: 'Waiting for opponent to complete the planning!' });
    }
  };

  useEffect(() => {
    if (!player) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    socket.emit('prepare-planning', { sessionId, playerId: player.playerId });
    socket.on('plan-registered', (payload) => {
      if (payload.playerId !== player.playerId) {
        setOpponentReady(true);
        toast.info('Opponent is ready, and waiting for you to complete the planning!');
      }
    });
    socket.on('start-game', (payload) => {
      const [player1Name, player2Name] = payload?.players || [];
      const opponnetName = (player?.playerName === player1Name) ? player2Name : player1Name;

      dispatch(setNextMoverId(payload?.nextMoverId));
      dispatch(setOpponentName(opponnetName));
      navigate(`/game/${payload?.sessionId}`);
    });
    return () => {
      toast.dismiss();
      socket.off('plan-registered');
      socket.off('start-game');
    };
  }, []);

  return (
    <div className='createStrategy'>
      <Header />
      <div className='contents'>
        <PlanningCard availableShips={availableShips} onReady={onReady} />
        <PlanningBoard strategy={strategy} onShipDrop={onShipDrop} onShipDelete={onShipDelete} onShipRotate={onShipRotate} />
      </div>
      <Footer />
    </div>
  );
}

export default CreateStrategy