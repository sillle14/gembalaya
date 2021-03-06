import { INVALID_MOVE } from 'boardgame.io/core'
import Bundle from './bundle.js'
import Player from './player.js'

/***************
 *   HELPERS   *
 ***************/

function getCardFromPosition(cardPosition, G) {
    if (cardPosition.reserved) {
        // In a reserve board.
        return G.players[cardPosition.playerID].reserves[cardPosition.position]
    } else if (cardPosition.position !== undefined) {
        // On the main board.
        return G.board[cardPosition.tier][cardPosition.position]
    } else {
        // From the deck.
        return G.decks[cardPosition.tier][0]
    }
}

// Call this at the end of a player's turn, since we don't check for win conditions otherwise.
function checkForWin(G, ctx) {
    
    // If anyone has more than 15, check for a winner.
    if (Object.values(G.players).filter(player => player.score >= 15).length > 0) {
        if (!G.lastTurnMessage) {
            G.logs.push({move: 'gameEnd'})
            G.lastTurnMessage = true
        }
        // Only end if it is the first player's turn.
        // Note that turn 0 is setup, so the turns are effectively indexed at 1.
        if ((ctx.turn) % ctx.numPlayers === 0) {
            const winningScore = Math.max.apply(null, Object.values(G.players).map(player => player.score))
            let winnerIDs = []
            for (const playerID in G.players) {
                if (G.players[playerID].score === winningScore) {
                    winnerIDs.push(playerID)
                }
            }
            G.logs.push({move: 'endGame', winnerIDs: winnerIDs})
            ctx.events.endGame({winnerIDs: winnerIDs})
        }
    }
}

function checkForNobles(G, ctx) {
    let availableNobles = []
    const currentPlayer = G.players[ctx.currentPlayer]
    for (let i = 0; i < G.nobles.length; i ++) {
        const noble = G.nobles[i]
        try {
            // Raises an error if the player can't afford the card.
            new Bundle(currentPlayer.cards).subtractBundle(noble.cost)
            availableNobles.push(i)
        } catch { }
    }
    return availableNobles
}

/***************
 *   ACTIONS   *
 ***************/


export function takeGems(G, ctx) {
    // Take the gems.
    Bundle.subtractBundles(G.gems, G.selectedGems)
    Bundle.addBundles(G.players[ctx.currentPlayer].gems, G.selectedGems)

    G.logs.push({playerID: ctx.currentPlayer, move: 'takeGems', gems: G.selectedGems})

    // Clear selection
    G.selectedGems = new Bundle()

    G.availableNobles = checkForNobles(G, ctx)
    if (G.availableNobles.length > 0) {
        ctx.events.setStage('nobles')
    } else if (Bundle.getGemCount(G.players[ctx.currentPlayer].gems) > 10) {
        ctx.events.setStage('discard')
    } else {
        // TODO: Gem discarding
        checkForWin(G, ctx)
        ctx.events.endTurn()
    }
}

export function buyCard(G, ctx) {
    let card
    const player = G.players[ctx.currentPlayer]
    if (G.selectedCardPosition.reserved) {
        // For some reason, defining the card as the output of splice led to issues, I think because of the operation occuring
        //  both on the server and client. In any case, it works to define the card first.
        card = player.reserves[G.selectedCardPosition.position]
        player.reserves.splice(G.selectedCardPosition.position, 1)
    } else {
        card = G.board[G.selectedCardPosition.tier][G.selectedCardPosition.position]
        // Replace the card. 
        G.board[G.selectedCardPosition.tier][G.selectedCardPosition.position] = G.decks[G.selectedCardPosition.tier].pop()
    }

    let effectiveCost = new Bundle(card.cost)
    effectiveCost.discountBundle(player.cards)


    let spend = new Bundle(player.gems)
    Bundle.subtractBundles(player.gems, effectiveCost)  // Spend gems.

    // Recalculate the true spend to account for gold gems.
    spend.subtractBundle(player.gems)

    Bundle.addBundles(G.gems, spend)                    // Return gems.
    player.cards[card.gem] += 1                         // Add bonus.
    player.score += card.points                         // Add score.

    G.logs.push({playerID: ctx.currentPlayer, move: 'buyCard', card: card, fromReserve: G.selectedCardPosition.reserved})

    // Clear selected card
    G.selectedCardPosition = {}

    G.availableNobles = checkForNobles(G, ctx)
    if (G.availableNobles.length > 0) {
        ctx.events.setStage('nobles')
    } else {
        checkForWin(G, ctx)
        ctx.events.endTurn()
    }
}

export function reserveCard(G, ctx) {
    const player = G.players[ctx.currentPlayer]
    let card
    if (G.selectedCardPosition.position === undefined) {
        card = {...G.decks[G.selectedCardPosition.tier].pop()}
    } else {
        // For some reason, we need to copy the card from the game state.
        card = {...G.board[G.selectedCardPosition.tier][G.selectedCardPosition.position]}
        
        // Replace the card. 
        G.board[G.selectedCardPosition.tier][G.selectedCardPosition.position] = G.decks[G.selectedCardPosition.tier].pop()
    }
    // Add the card to the players reserves.
    player.reserves.push(card)

    // Take a gold gem, if there is one left.
    try {
        Bundle.subtractBundles(G.gems, {gold: 1})
        Bundle.addBundles(player.gems, {gold: 1})
    } catch { }

    G.logs.push({playerID: ctx.currentPlayer, move: 'reserveCard', card: card, hidePoints: G.selectedCardPosition.position === undefined})

    // Clear selected card
    G.selectedCardPosition = {}

    G.availableNobles = checkForNobles(G, ctx)
    if (G.availableNobles.length > 0) {
        ctx.events.setStage('nobles')
    } else if (Bundle.getGemCount(G.players[ctx.currentPlayer].gems) > 10) {
        ctx.events.setStage('discard')
    } else {
        // TODO: Gem discarding
        checkForWin(G, ctx)
        ctx.events.endTurn()
    }
}

export function takeNoble(G, ctx) {
    G.nobles.splice(G.selectedNoble, 1)
    G.players[ctx.currentPlayer].score += 3

    G.logs.push({playerID: ctx.currentPlayer, move: 'takeNoble'})

    G.selectedNoble = null
    G.availableNobles = []

    checkForWin(G, ctx)
    ctx.events.endTurn()
}

export function discardGems(G, ctx) {
    Bundle.subtractBundles(G.players[ctx.currentPlayer].gems, G.discardedGems)
    Bundle.addBundles(G.gems, G.discardedGems)
    G.logs.push({playerID: ctx.currentPlayer, move: 'discardGems', gems: G.discardedGems})
    G.discardedGems = new Bundle()

    checkForWin(G, ctx)
    ctx.events.endTurn()
}

/******************
 *   SELECTIONS   *
 ******************/

export function selectGem(G, ctx, gem) {
    if (
        gem === 'gold' ||                                       // Can't take gold.
        Bundle.getGemCount(G.selectedGems) >= 3 ||              // Can't take more than 3 gems.
        G.selectedGems[gem] > 1 ||                              // Can't take more than 2 of each.
        G.gems[gem] < 1                                         // Can't take if none left.
    ) { return INVALID_MOVE }

    // Doubles are only allow if no other gems are picked and there at least four left.
    if (
        G.selectedGems[gem] === 1 &&
        (Bundle.getGemCount(G.selectedGems) !== 1 || G.gems[gem] < 4)
    ) { return INVALID_MOVE }

    // If a double has already been selected, no more gems are allowed.
    if (Object.values(G.selectedGems).filter(count => count > 1).length > 0) { return INVALID_MOVE }

    // Select the gem.
    G.selectedGems[gem] += 1

    // Clear any selected cards.
    G.selectedCardPosition = {}

    // Picking the gems is a valid move if there are 3 gems (guaranteed to be distinct) or 2 of the same.
    G.validGemPick = G.selectedGems.gemCount === 3 || (Object.values(G.selectedGems).filter(count => count === 2).length > 0)

    // If all the other piles are empty, picking less than three gems is allowed.
    let otherGemsAvailable = false
    for (const gemType in G.gems) {
        if (gemType !== 'gold' && G.selectedGems[gemType] === 0 && G.gems[gemType] > 0) {
            otherGemsAvailable = true
        }
    }

    // If all the other piles are empty, picking less than three gems is allowed.
    if (!otherGemsAvailable) {
        // Picks of 2 are allow.
        if (Bundle.getGemCount(G.selectedGems) === 2) {
            G.validGemPick = true
        }
        // Picks of one gem are allowed, if there aren't enough to pick 2. In this case, note that the current gem is the only gem selected.
        if (Bundle.getGemCount(G.selectedGems) === 1 && G.gems[gem] < 4) {
            G.validGemPick = true
        } 
    }
}

export function clearGems(G, ctx) { G.selectedGems = new Bundle(); G.discardedGems = new Bundle() }

export function selectCard(G, ctx, cardPosition) {
    // Can't reserve from an empty deck.
    if (cardPosition.position === undefined && G.decks[cardPosition.tier].length === 0) { 
        return INVALID_MOVE 
    }

    if (cardPosition.position === 'deck') {
        G.validCardBuy = false   // Can't buy off the deck
    } else {
        G.validCardBuy = true
        const cardCost = getCardFromPosition(cardPosition, G).cost
        const purchasingPower = Player.getEffectiveGems(G.players[ctx.currentPlayer])
        try {
            // Raises an error if the player can't afford the card.
            new Bundle(purchasingPower).subtractBundle(cardCost)
        } catch {
            G.validCardBuy = false;
        }
    }
    G.validCardReserve = (
        G.players[ctx.currentPlayer].reserves.length < 3 &&
        !cardPosition.reserved
    )

    // Clear selected gems.
    G.selectedGems = new Bundle()

    // Select the card.
    G.selectedCardPosition = cardPosition
}

export function selectNoble(G, ctx, position) {
    if (!(G.availableNobles || []).includes(position)) {
        return INVALID_MOVE
    }
    G.selectedNoble = position 
}

export function selectDiscard(G, ctx, gem) {
    const ifDiscard = new Bundle(G.players[ctx.currentPlayer].gems)
    try {
        G.discardedGems[gem] += 1
        ifDiscard.subtractBundle(G.discardedGems)  // Raises an error if there are not enough to discard
    } catch {
        G.discardedGems[gem] -= 1  // Reset the discard count
        return INVALID_MOVE
    }
    if (ifDiscard.gemCount < 10) {
        G.discardedGems[gem] -= 1  // Reset the discard count
        return INVALID_MOVE
    }
    G.validDiscard = ifDiscard.gemCount === 10
}
