import { tier1Cards, tier2Cards, tier3Cards, nobles } from './static'
import Player from "./player.js"
import Bundle from "./bundle.js"

// Refactoring TODOs:
// * coin -> gem
// * only use moves
// * simplify css
// * organization
// * splendor -> gembalya
// * ' -> " (look up which is best)

// Other TODOs:
// * better lobby
// * add a log
// * better deployment
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

    // NOTE: Running with a server means clients only recieve deconstructed G objects in such a way that all 
    //      prototypes are lost. So, although the Bundle class is useful for organization, only its static 
    //      methods can be used on objects in G.
    return {
        decks: [tier1Deck, tier2Deck, tier3Deck],
        board: [tier1Board, tier2Board, tier3Board],
        gems: gems,
        nobles: gameNobles,
        players: players
    }
}

function takeGems(G, ctx, gems) {
    Bundle.subtractBundles(G.gems, gems)
    Bundle.addBundles(G.players[ctx.currentPlayer].gems, gems)
}

function buyCard(G, ctx, cardPosition) {
    let card
    const player = G.players[ctx.currentPlayer]
    if (cardPosition.reserved) {
        card = player.reserves.splice(cardPosition.postion, 1)[0]
    } else {
        card = G.board[cardPosition.tier][cardPosition.position]
        // Replace the card. 
        G.board[cardPosition.tier][cardPosition.position] = G.decks[cardPosition.tier].pop()
    }

    let effectiveCost = new Bundle(card.cost)
    effectiveCost.discountBundle(player.cards)

    Bundle.subtractBundles(player.gems, effectiveCost)  // Spend gems.
    Bundle.addBundles(G.gems, effectiveCost)            // Return gems.
    player.cards[card.gem] += 1                         // Add bonus.
    player.score += card.points                         // Add score.
}

function reserveCard(G, ctx, cardPosition) {
    const player = G.players[ctx.currentPlayer]
    let card
    if (cardPosition.position) {
        // For some reason, we need to copy the card from the game state.
        card = {...G.board[cardPosition.tier][cardPosition.position]}
        
        // Replace the card. 
        G.board[cardPosition.tier][cardPosition.position] = G.decks[cardPosition.tier].pop()
    } else {
        card = {...G.decks[cardPosition.tier].pop()}
    }
    // Add the card to the players reserves.
    player.reserves.push(card)

    // Take a gold gem, if there is one left.
    try {
        Bundle.subtractBundles(G.gems, {gold: 1})
        Bundle.addBundles(player.gems, {gold: 1})
    } catch { }
}

function takeNoble(G, ctx, noblePosition) {
    const player = G.players[ctx.currentPlayer]
    G.nobles.splice(noblePosition, 1)
    player.score += 3
}

// Call this move at the end of a players turn, since we don't check for win conditions otherwise.
function checkForWin(G, ctx) {
    // Only end if it is the first player's turn.
    // Note that turn 0 is setup, so the turns are effectively indexed at 1.
    if ((ctx.turn) % ctx.numPlayers === 0){
        // If anyone has more than 15, check for a winner.
        if (Object.values(G.players).filter(player => player.score >= 15).length > 0) {
            const winningScore = Math.max.apply(null, Object.values(G.players).map(player => player.score))
            let winners = []
            for (const playerID in G.players) {
                if (G.players[playerID].score === winningScore) {
                    winners.push(playerID)
                }
            }
            ctx.events.endGame({winners: winners})
        }
    }
}

export const Splendor = {
    name: "Splendor",
    setup: setupGame,
    moves: {
        takeGems: takeGems,
        buyCard: buyCard,
        reserveCard: reserveCard,
        takeNoble: takeNoble,
        checkForWin: checkForWin,
    },

    minPlayers: 2,
    maxPlayers: 4,
};