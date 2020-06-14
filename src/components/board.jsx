import React from "react"
import {NobleSet} from "./nobles.jsx"
import {Piles} from "./coins.jsx"
import {CardGrid} from "./cards.jsx"
import {Players, PlayerReserves} from "./players.jsx"
import "./styles/gem.css"
import "./styles/coin.css"
import "./styles/card.css"
import "./styles/noble.css"
import "./styles/player.css"
import "./styles/board.css"
import Bundle from "../bundle.js"
import Player from "../player.js"

function CoinMessage(props) {
    let message = ["Take "]
    for (const gem in props.gems) {
        if (props.gems[gem] > 0) {
            message.push(<span key={gem} className={"gem-" + gem + "-text"}>{props.gems[gem] + " " + gem + " "}</span>)
        }
    }
    message.push("?")
    return <span>{message}</span>
}

function ActionBox(props) {

    if (props.gameOver) {
        return <div className="action-box">{"Game over. Winner(s): " + props.gameOver.winners.join(", ")}</div>
    }

    if (!props.myTurn) {
        return <div className="action-box">Wait for your turn!</div>
    }

    let options;

    if (Object.keys(props.selectedCard).length !== 0) {
        const buyDisabled = props.validCardBuy ? "" : "disabled"
        const reserveDisabled = props.validCardReserve ? "" : "disabled"
        options = <div className="options">
            <button disabled={buyDisabled} onClick={props.buyCard}>Buy</button>
            <button disabled={reserveDisabled} onClick={props.reserveCard}>Reserve</button>
        </div>
    } else if (props.selectedCoins.gemCount !== 0) {
        const disabled = props.validGemPick ? "" : "disabled"
        options = <div className="options"><CoinMessage gems={props.selectedCoins}></CoinMessage><button disabled={disabled} onClick={props.takeGems}>Confirm</button></div>
    } else if (props.nobleSelection && (props.selectedNoble || props.selectedNoble === 0)) {
        options = <button onClick={props.takeNoble}>Select</button>
    } else if (props.nobleSelection) {
        options = <span>Select a noble.</span>
    } else {
        options = <span>Select a move.</span>
    }

    return (
        <div className="action-box">
            <button onClick={props.clearSelection}>Clear</button>
            {options}
        </div>
    )
}

export function getCardFromPosition(cardPosition, G) {
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

export class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCardPosition: {},
            selectedCoins: new Bundle(),
        }
        this.onSelectCard = this.onSelectCard.bind(this)
        this.onSelectCoin = this.onSelectCoin.bind(this)
        this.clearSelection = this.clearSelection.bind(this)
        this.takeGems = this.takeGems.bind(this)
        this.buyCard = this.buyCard.bind(this)
        this.takeNoble = this.takeNoble.bind(this)
        this.reserveCard = this.reserveCard.bind(this)
        this.checkForNobles = this.checkForNobles.bind(this)
        this.onSelectNoble = this.onSelectNoble.bind(this)

        this.cleanup = this.cleanup.bind(this)
    }

    cleanup() {
        // If a player is in noble selection phase on reload, end their turn so they can't go again.
        if (this.state.nobleSelection) {
            this.props.events.endTurn()
        }
    }

    // See https://stackoverflow.com/a/39085062
    componentDidMount(){
        window.addEventListener('beforeunload', this.cleanup);
    }
  
    componentWillUnmount() {
        this.cleanup();
        window.removeEventListener('beforeunload', this.cleanup);
    }

    onSelectCard(cardPosition) {
        if (
            this.props.playerID !== this.props.ctx.currentPlayer ||     // If it is not your turn, do nothing.
            this.props.ctx.gameover ||                                  // No moves if the game is over.
            this.state.nobleSelection
        ) { return }

        // Can't reserve from an empty deck.
        if (
            cardPosition.position === undefined &&
            this.props.G.decks[cardPosition.tier].length === 0
        ) { return }

        let validCardBuy
        if (cardPosition.position === "deck") {
            validCardBuy = false   // Can't buy off the deck
        } else {
            validCardBuy = true
            const cardCost = getCardFromPosition(cardPosition, this.props.G).cost
            const purchasingPower = Player.getEffectiveGems(
                this.props.G.players[this.props.ctx.currentPlayer]
            )
            try {
                // Raises an error if the player can't afford the card.
                new Bundle(purchasingPower).subtractBundle(cardCost)
            } catch {
                validCardBuy = false;
            }
        }
        const validCardReserve = (
            this.props.G.players[this.props.playerID].reserves.length < 3 &&
            !cardPosition.reserved
        )
        this.setState({
            selectedCardPosition: cardPosition,
            validCardBuy: validCardBuy, 
            validCardReserve: validCardReserve, 
            selectedCoins: new Bundle()
        })
    }

    onSelectCoin(gem) {
        this.setState(prevState => {
            if (
                this.props.playerID !== this.props.ctx.currentPlayer || // Not your turn.
                gem === "gold" ||                                       // Can't take gold.
                prevState.selectedCoins.gemCount >= 3 ||                // Can't take more than 3 coins.
                prevState.selectedCoins[gem] > 1 ||                     // Can't take more than 2 of each.
                this.props.G.gems[gem] < 1 ||                           // Can't take if none left.
                this.props.ctx.gameover ||                              // No moves if game over.
                this.state.nobleSelection                               // Can't take card if noble selection phase
            ) { return }

            // Doubles are only allow if no other gems are picked and there at least four left.
            if (
                prevState.selectedCoins[gem] === 1 &&
                (prevState.selectedCoins.gemCount !== 1 || this.props.G.gems[gem] < 4)
            ) { return {} }

            // If a double has already been selected, no more gems are allowed.
            if (Object.values(prevState.selectedCoins).filter(count => count > 1).length > 0) { return {} }

            let selectedCoins = new Bundle(prevState.selectedCoins)
            selectedCoins[gem] += 1

            // Picking the gems is a valid move if there are 3 gems (guaranteed to be distinct) or 2 of the same.
            const validGemPick = selectedCoins.gemCount === 3 || (Object.values(selectedCoins).filter(count => count === 2).length > 0)
            return {selectedCoins: selectedCoins, validGemPick: validGemPick, selectedCardPosition: {}}
        })
    }

    onSelectNoble(position) {
        if (
            this.props.playerID !== this.props.ctx.currentPlayer || // Not your turn.
            this.props.ctx.gameover ||                              // No moves if game over.
            !this.state.nobleSelection                              // Only during noble selection
        ) { return }
        this.setState({selectedNoble: position})
    }

    clearSelection() {
        this.setState({selectedCardPosition: {}, selectedCoins: new Bundle(), selectedNoble: null, nobleSelection: false})
    }

    checkForNobles() {
        let availableNobles = []
        const currentPlayer = this.props.G.players[this.props.ctx.currentPlayer]
        for (let i = 0; i < this.props.G.nobles.length; i ++) {
            const noble = this.props.G.nobles[i]
            console.log(noble.cost)
            try {
                // Raises an error if the player can't afford the card.
                new Bundle(currentPlayer.cards).subtractBundle(noble.cost)
                availableNobles.push(i)
            } catch { }
        }
        return availableNobles
    }

    takeGems() {
        this.clearSelection()
        this.props.moves.takeGems(this.state.selectedCoins)

        const availableNobles = this.checkForNobles()
        if (availableNobles.length > 0) {
            this.setState({availableNobles: availableNobles, nobleSelection: true})
            return
        }
        // TODO: Gem discarding
        this.props.moves.checkForWin()
        this.props.events.endTurn()
    }

    buyCard() {
        this.clearSelection()
        this.props.moves.buyCard(this.state.selectedCardPosition)

        const availableNobles = this.checkForNobles()
        if (availableNobles.length > 0) {
            this.setState({availableNobles: availableNobles, nobleSelection: true})
            return
        }
        this.props.moves.checkForWin()
        this.props.events.endTurn()
    }

    takeNoble() {
        this.clearSelection()
        this.props.moves.takeNoble(this.state.selectedNoble)
        this.props.moves.checkForWin()
        this.props.events.endTurn()
    }

    reserveCard() {
        this.clearSelection()
        this.props.moves.reserveCard(this.state.selectedCardPosition)

        const availableNobles = this.checkForNobles()
        if (availableNobles.length > 0) {
            this.setState({availableNobles: availableNobles, nobleSelection: true})
            return
        }
        // TODO: gem discarding
        this.props.moves.checkForWin()
        this.props.events.endTurn()
    }
    
    render () {
        return (
            <div className="board">
                <Players players={this.props.G.players} currentPlayer={this.props.ctx.currentPlayer}></Players>
                <CardGrid board={this.props.G.board} decks={this.props.G.decks} selectedCard={this.state.selectedCardPosition} onSelectCard={this.onSelectCard}></CardGrid>
                <NobleSet
                    nobles={this.props.G.nobles}
                    nobleSelection={this.state.nobleSelection}
                    availableNobles={this.state.availableNobles}
                    selectedNoble={this.state.selectedNoble}
                    onSelectNoble={this.onSelectNoble}
                ></NobleSet>
                <Piles gems={this.props.G.gems} selectedCoins={this.state.selectedCoins} onSelectCoin={this.onSelectCoin}></Piles>
                <ActionBox 
                    selectedCard={this.state.selectedCardPosition} 
                    selectedCoins={this.state.selectedCoins}
                    clearSelection={this.clearSelection}
                    validGemPick={this.state.validGemPick}
                    validCardBuy={this.state.validCardBuy}
                    validCardReserve={this.state.validCardReserve}
                    takeGems={this.takeGems}
                    buyCard={this.buyCard}
                    reserveCard={this.reserveCard}
                    myTurn={this.props.playerID === this.props.ctx.currentPlayer}
                    gameOver={this.props.ctx.gameover}
                    nobleSelection={this.state.nobleSelection}
                    selectedNoble={this.state.selectedNoble}
                    takeNoble={this.takeNoble}
                ></ActionBox>
                <div className="sidebar">
                    <PlayerReserves
                        reserves={this.props.G.players[this.props.playerID].reserves}
                        onSelectCard={this.onSelectCard}
                        playerID={this.props.playerID}
                        selectedCard={this.state.selectedCardPosition} 
                    ></PlayerReserves>
                </div>
            </div>
        )
    }
}
