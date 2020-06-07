import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SplendorClient from './App';
import * as serviceWorker from './serviceWorker';
import { Table } from './components/board'
import {Splendor} from "./Game"

import { Lobby } from 'boardgame.io/react';

// The below will render the lobby, but it makes it tough to debug.
// TODO: Come up with a better way of running the lobby.
ReactDOM.render(
  <React.StrictMode>
    <Lobby
      gameServer={`https://${window.location.hostname}:8000`}
      lobbyServer={`https://${window.location.hostname}:8000`}
      gameComponents={[{game: Splendor, board: Table}]}
    />
  </React.StrictMode>,
  document.getElementById("root")
)


// Code for local deployment no lobby both players on one screen.
// ReactDOM.render(
//   <React.StrictMode>
//     <SplendorClient playerID="0"/>
//     <SplendorClient playerID="1"/>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
