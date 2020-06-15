import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SplendorClient from './games/gembalaya/App';
import * as serviceWorker from './serviceWorker';
import { Table } from "./games/gembalaya/components/board"
import {Splendor} from "./games/gembalaya/Game"

import { Lobby } from 'boardgame.io/react';

const NO_LOBBY = process.env.REACT_APP_NO_LOBBY

// TODO: fix this
// const SERVER = `https://${window.location.hostname}` // Prod
 const SERVER = `http://${window.location.hostname}:8000`  // Local

if (NO_LOBBY) {
    // Code for local deployment no lobby both players on one screen, no seperate server.
    ReactDOM.render(
      <React.StrictMode>
        <SplendorClient playerID="0"/>
        <SplendorClient playerID="1"/>
      </React.StrictMode>,
      document.getElementById('root')
    );
} else {
  // Render the lobby. This relies on a running server.
  // TODO: Make the lobby way nicer looking!
  ReactDOM.render(
    <React.StrictMode>
      <Lobby
        gameServer={SERVER}
        lobbyServer={SERVER}
        gameComponents={[{game: Splendor, board: Table}]}
      />
    </React.StrictMode>,
    document.getElementById("root")
  )
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
