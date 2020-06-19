import { tier1Cards, tier2Cards, tier3Cards, nobles } from './static'
import * as moves from './moves'
import Player from './player'
import Bundle from './bundle'

// Refactoring TODOs:
// * simplify css
// * organization

// Other TODOs:
// * better lobby
// * show other players reserves


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
    let gameNobles = ctx.random.Shuffle(nobles)
    gameNobles = gameNobles.slice(0, playerCountSettings[ctx.numPlayers].nobles)

    let players = {}
    for (let i = 0; i < ctx.numPlayers; i ++) {
        players[i] = new Player()
    }

    const gems = new Bundle({
        onyx: gemCount, 
        ruby: gemCount, 
        sapphire: gemCount, 
        diamond: gemCount, 
        emerald: gemCount, 
        gold: 5  // Always 5 gold
    })

    // NOTE: G is communicated between servers and clients in JSON, so only JSON serializable objects are allowed here.
    //      So, although the Bundle class is useful for organization, only its static methods can be used safely on objects in G.
    return {
        // Core components
        decks: [tier1Deck, tier2Deck, tier3Deck],
        board: [tier1Board, tier2Board, tier3Board],
        gems: gems,
        nobles: gameNobles,
        players: players,

        // Game state
        selectedGems: new Bundle(),
        selectedCardPosition: {},
        selectedNoble: null,
        validGemPick: false,
        validCardBuy: false,
        validCardReserve: false,
        availableNobles: [],
        logs: []
    }
}

export const Gembalaya = {
    name: 'Gembalaya',
    setup: setupGame,
    moves: {
        takeGems: moves.takeGems,
        buyCard: moves.buyCard,
        reserveCard: moves.reserveCard,
        takeNoble: moves.takeNoble,
        selectGem: moves.selectGem,
        selectCard: moves.selectCard,
        clearGems: moves.clearGems,
    },
    turn: {
        stages: {
            nobles: {
                moves: {
                    selectNoble: moves.selectNoble,
                    takeNoble: moves.takeNoble
                }
            }
        }
    },
    minPlayers: 2,
    maxPlayers: 4,
};