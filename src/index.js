import { Lobby } from 'boardgame.io/react'
import { StrictMode } from 'react';
import ReactDOM from 'react-dom'

import { Gembalaya } from './Game'
import { GembalayaTable } from './components/board'
import GembalayaClient from './App'

import './components/styles/lobby.css'
import './index.css'

const NO_LOBBY = process.env.REACT_APP_NO_LOBBY

if (NO_LOBBY) {
  // Code for local deployment no lobby both players on one screen, no separate server.
  ReactDOM.render(
    <StrictMode>
      <GembalayaClient playerID='0'/>
      <GembalayaClient playerID='1'/>
    </StrictMode>,
    document.getElementById('root')
  );
} else {
  const ENV = process.env.REACT_APP_ENV

  let SERVER
  if (ENV === 'dev') {
    SERVER = `http://${window.location.hostname}:8000`  // Local
  } else {
    SERVER = `https://${window.location.hostname}` // Prod
  }

  // Render the lobby. This relies on a running server.
  ReactDOM.render(
    <StrictMode>
      <Lobby
        gameServer={SERVER}
        lobbyServer={SERVER}
        gameComponents={[{game: Gembalaya, board: GembalayaTable}]}
      />
    </StrictMode>,
    document.getElementById('root')
  )
}
