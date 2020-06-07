import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'
import { Table } from './components/board'
import {Splendor} from "./Game"
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';

const SplendorClient = Client({
    game: Splendor,
    board: Table, 
    debug: false, 
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    enhancer: applyMiddleware(logger),
});

export default SplendorClient;
