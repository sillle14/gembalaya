import React from "react"
import {NobleSet} from "./nobles.jsx"
import {Piles} from "./coins.jsx"
import {CardGrid} from "./cards.jsx"
import {Players} from "./players.jsx"
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
        options = <div className="options"><button disabled={buyDisabled} onClick={props.buyCard}>Buy</button><button disabled={reserveDisabled}>Reserve</button></div>
    } else if (props.selectedCoins.gemCount !== 0) {
        const disabled = props.validGemPick ? "" : "disabled"
        options = <div className="options"><CoinMessage gems={props.selectedCoins}></CoinMessage><button disabled={disabled} onClick={props.takeGems}>Confirm</button></div>
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

export class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCard: {},
            selectedCoins: new Bundle(),
            validGemPick: false,
            validCardBuy: false,
            validCardReserve: false  // TODO
        }
        this.onSelectCard = this.onSelectCard.bind(this)
        this.onSelectCoin = this.onSelectCoin.bind(this)
        this.clearSelection = this.clearSelection.bind(this)
        this.takeGems = this.takeGems.bind(this)
        this.buyCard = this.buyCard.bind(this)
    }

    onSelectCard(cardID) {
        this.setState(prevState => {
            
            if (
            this.props.playerID !== this.props.ctx.currentPlayer ||     // If it is not your turn, do nothing.
            this.props.ctx.gameover                                     // No moves if the game is over.
            ) { return }

            let validCardBuy
            if (cardID.position === "deck") {
                validCardBuy = false   // Can't buy off the deck
            } else {
                validCardBuy = true
                const cardCost = this.props.G.board[cardID.tier][cardID.position].cost
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
            
            return {selectedCard: cardID, validCardBuy: validCardBuy, selectedCoins: new Bundle()}
        })
    }

    onSelectCoin(gem) {
        this.setState(prevState => {
            if (
                this.props.playerID !== this.props.ctx.currentPlayer ||  // Not your turn.
                gem === "gold" ||                                       // Can't take gold.
                prevState.selectedCoins.gemCount >= 3 ||                // Can't take more than 3 coins.
                prevState.selectedCoins[gem] > 1 ||                     // Can't take more than 2 of each.
                this.props.G.gems[gem] < 1 ||                           // Can't take if none left.
                this.props.ctx.gameover                                 // No moves if game over.
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
            return {selectedCoins: selectedCoins, validGemPick: validGemPick, selectedCard: {}}
        })
    }

    clearSelection() {
        this.setState({selectedCard: {}, selectedCoins: new Bundle()})
    }

    takeGems() {
        this.clearSelection()
        this.props.moves.takeGems(this.state.selectedCoins)
        // TODO: Gem discarding and nobles
        this.props.moves.checkForWin()
        this.props.events.endTurn()
    }

    buyCard() {
        this.clearSelection()
        this.props.moves.buyCard(this.state.selectedCard)
        // TODO: Check for nobles
        this.props.moves.checkForWin()
        this.props.events.endTurn()
    }
    
    render () {
        return (
            <div className="board">
                <Players players={this.props.G.players} currentPlayer={this.props.ctx.currentPlayer}></Players>
                <CardGrid board={this.props.G.board} decks={this.props.G.decks} selectedCard={this.state.selectedCard} onSelectCard={this.onSelectCard}></CardGrid>
                <NobleSet nobles={this.props.G.nobles}></NobleSet>
                <Piles gems={this.props.G.gems} selectedCoins={this.state.selectedCoins} onSelectCoin={this.onSelectCoin}></Piles>
                <ActionBox 
                    selectedCard={this.state.selectedCard} 
                    selectedCoins={this.state.selectedCoins}
                    clearSelection={this.clearSelection}
                    validGemPick={this.state.validGemPick}
                    validCardBuy={this.state.validCardBuy}
                    validCardReserve={this.state.validCardReserve}
                    takeGems={this.takeGems}
                    buyCard={this.buyCard}
                    myTurn={this.props.playerID === this.props.ctx.currentPlayer}
                    gameOver={this.props.ctx.gameover}
                ></ActionBox>
            </div>
        )
    }
}
