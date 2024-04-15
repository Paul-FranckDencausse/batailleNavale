import React from 'react';
import { Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faRotateRight, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import CreateStatergry from './components/CreateStrategy';
import Game from './components/Game';
import Home from './components/Home';
import HostGame from './components/HostGame';
import JoinGame from './components/JoinGame';
import NotFound from './components/NotFound';
import { BACKEND_URL } from './config';

library.add(fab, faRotateRight, faTrash, faRotateLeft);
const socket = io.connect(BACKEND_URL, {
  pingTimeout: 130000, // 2 min 10 sec - Increased the default value to delay the handshake request, this will reduce no of request made to spaces 
  pingInterval: 60000, // 1 min
});

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/host-game' element={<HostGame socket={socket} />}></Route>
      <Route path='/join-game' element={<JoinGame socket={socket} />}></Route>
      <Route path='/planning/:sessionId' element={<CreateStatergry socket={socket} />}></Route>
      <Route path='/game/:sessionId' element={<Game socket={socket} />}></Route>
      <Route path='*' element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
