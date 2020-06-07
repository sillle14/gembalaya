import { tier1Cards, tier2Cards, tier3Cards, nobles } from './static'
import Player from "./player.js"
import Bundle from "./bundle.js"



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

    // NOTE: Running with a server deconstructs the G object in such a way that all prototypes are lost. So,
    //       although the Bundle class is useful for organization, only its static methods can be used on 
    //       objects in G.
    return {
        decks: [tier1Deck, tier2Deck, tier3Deck],
        board: [tier1Board, tier2Board, tier3Board],
        gems: gems,
        nobles: test,
        players: players
    }
}

function takeGems(G, ctx, gems) {
    Bundle.subtractBundles(G.gems, gems)
    Bundle.addBundles(G.players[ctx.currentPlayer].gems, gems)
}

function buyCard(G, ctx, cardPosition) {
    const card = G.board[cardPosition.tier][cardPosition.position]
    const player = G.players[ctx.currentPlayer]
    let effectiveCost = new Bundle(card.cost)
    effectiveCost.discountBundle(player.cards)

    Bundle.subtractBundles(player.gems, effectiveCost)  // Spend gems.
    Bundle.addBundles(G.gems, effectiveCost)            // Return gems.
    player.cards[card.gem] += 1                         // Add bonus.
    player.score += card.points                         // Add score.

    // Replace the card. 
    // TODO: Handle last card.
    G.board[cardPosition.tier][cardPosition.position] = G.decks[cardPosition.tier].pop()
}

export const Splendor = {
    name: "Splendor",
    setup: setupGame,
    moves: {
        takeGems: takeGems,
        buyCard: buyCard
    },

    // TODO: Game end
};