import { Client } from 'boardgame.io/react';
import { GembalayaTable } from './components/board'
import {Gembalaya} from './Game'
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { SocketIO } from 'boardgame.io/multiplayer'

// NOTE: Local multiplayer seems to mess up moves (they are taken twice)
const GembalayaClient = Client({
    game: Gembalaya,
    board: GembalayaTable, 
    debug: false, 
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    enhancer: applyMiddleware(logger),
});

export default GembalayaClient;
