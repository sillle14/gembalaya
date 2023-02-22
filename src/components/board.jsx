import { Component } from 'react';

import { ActionBox } from './actions'
import { CardGrid } from './cards'
import { Logs } from './logs'
import { NobleSet } from './nobles'
import { Piles } from './gems'
import { Players, PlayerReserves } from './players'

import './styles/gem.css'
import './styles/coin.css'
import './styles/card.css'
import './styles/noble.css'
import './styles/player.css'
import './styles/board.css'
import './styles/logs.css'

export class GembalayaTable extends Component {

    constructor(props) {
        super(props)
        this.playerMap = {}
        if (this.props.matchData[0]?.name) {
            for (let i = 0; i < this.props.matchData.length; i ++) {
                // Limit to 10 characters
                this.playerMap[this.props.matchData[i].id] = this.props.matchData[i].name.slice(0, 10)
            }
        } else {
            for (let i = 0; i < this.props.ctx.numPlayers; i ++) {
                this.playerMap[i] = 'Player ' + i
            }
        }
    }
    
    render () {
        const myTurn = this.props.playerID === this.props.ctx.currentPlayer
        const stage = this.props.ctx.activePlayers && this.props.ctx.activePlayers[this.props.ctx.currentPlayer]
        return (
            <div className="gb-board">
                <Players 
                    players={this.props.G.players} 
                    currentPlayer={this.props.ctx.currentPlayer}
                    selectDiscard={this.props.moves.selectDiscard}
                    playerMap={this.playerMap}
                    playerOrder={this.props.G.playerOrder}
                ></Players>
                <CardGrid 
                    board={this.props.G.board} 
                    decks={this.props.G.decks} 
                    selectedCard={this.props.G.selectedCardPosition} 
                    selectCard={this.props.moves.selectCard}
                    myTurn={myTurn}
                ></CardGrid>
                <NobleSet
                    nobles={this.props.G.nobles}
                    availableNobles={this.props.G.availableNobles}
                    myTurn={myTurn}
                    selectedNoble={this.props.G.selectedNoble}
                    selectNoble={this.props.moves.selectNoble}
                ></NobleSet>
                <Piles gems={this.props.G.gems} selectedGems={this.props.G.selectedGems} selectGem={this.props.moves.selectGem} myTurn={myTurn}></Piles>
                <ActionBox 
                    selectedCard={this.props.G.selectedCardPosition} 
                    selectedGems={this.props.G.selectedGems}
                    discardedGems={this.props.G.discardedGems}
                    clearGems={this.props.moves.clearGems}
                    validGemPick={this.props.G.validGemPick}
                    validDiscard={this.props.G.validDiscard}
                    validCardBuy={this.props.G.validCardBuy}
                    validCardReserve={this.props.G.validCardReserve}
                    takeGems={this.props.moves.takeGems}
                    discardGems={this.props.moves.discardGems}
                    buyCard={this.props.moves.buyCard}
                    reserveCard={this.props.moves.reserveCard}
                    myTurn={myTurn}
                    gameOver={this.props.ctx.gameover}
                    playerMap={this.playerMap}
                    currentPlayer={this.props.ctx.currentPlayer}
                    spectator={!!!this.props.playerID}
                    stage={stage}
                    selectedNoble={this.props.G.selectedNoble}
                    takeNoble={this.props.moves.takeNoble}
                ></ActionBox>
                <div className="gb-sidebar">
                    <PlayerReserves
                        reserves={this.props.G.players[this.props.playerID || this.props.ctx.currentPlayer].reserves}
                        selectCard={this.props.moves.selectCard}
                        playerID={this.props.playerID}
                        selectedCard={this.props.G.selectedCardPosition}
                        playerMap={this.playerMap}
                        currentPlayer={this.props.ctx.currentPlayer}
                        spectator={!!!this.props.playerID}  
                    ></PlayerReserves>
                    <Logs logs={this.props.G.logs} playerMap={this.playerMap} playerID={this.props.playerID}></Logs>
                </div>
            </div>
        )
    }
}
