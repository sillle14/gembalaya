import { Client } from 'boardgame.io/react';
import { Table } from './components/board'
import { tier1Cards, tier2Cards, tier3Cards, nobles } from './static'

// Map player counts to starting gem piles
const playerCountSettings = {
    2: {gems: 4, nobles: 3},
    3: {gems: 5, nobles: 4},
    4: {gems: 7, nobles: 5}
}

function setupGame(ctx, setupData) {
    let tier1Deck = ctx.random.Shuffle(tier1Cards)
    let tier2Deck = ctx.random.Shuffle(tier2Cards)
    let tier3Deck = ctx.random.Shuffle(tier3Cards)
    let tier1Board = tier1Deck.splice(0, 4)
    let tier2Board = tier2Deck.splice(0, 4)
    let tier3Board = tier3Deck.splice(0, 4)

    const gemCount = playerCountSettings[ctx.numPlayers].gems
    const gameNobles = ctx.random.Shuffle(nobles)
    const test = gameNobles.slice(0, playerCountSettings[ctx.numPlayers].nobles)

    let players = {}
    for (let i = 0; i < ctx.numPlayers; i ++) {
        players[i] = {
            cards: {onyx: 0, ruby: 0, sapphire: 0, diamond: 0, emerald: 0},
            coins: {onyx: 0, ruby: 0, sapphire: 0, diamond: 0, emerald: 0, gold: 0},
            score: 0,
        }
    }

    return {
        decks: [tier1Deck, tier2Deck, tier3Deck],
        board: [tier1Board, tier2Board, tier3Board],
        gems: {
            onyx: gemCount, 
            ruby: gemCount, 
            sapphire: gemCount, 
            diamond: gemCount, 
            emerald: gemCount, 
            gold: 5  // Always 5 gold
        },
        nobles: test,
        players: players
    }
}

const Splendor = {
    setup: setupGame,
    moves: {
        clickCell: (G, ctx, id) => {},
    },
};

const App = Client({ game: Splendor, board: Table, debug: false});

export default App;
