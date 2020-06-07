import { Client } from 'boardgame.io/react';
import { Table } from './components/board'
import {Splendor} from "./Game"
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { Local } from 'boardgame.io/multiplayer'

const SplendorClient = Client({
    game: Splendor,
    board: Table, 
    debug: false, 
    multiplayer: Local(),
    enhancer: applyMiddleware(logger),
});

export default SplendorClient;
