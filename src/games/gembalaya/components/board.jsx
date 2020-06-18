import React from 'react'
import {NobleSet} from './nobles.jsx'
import {Piles} from './gems.jsx'
import {CardGrid} from './cards.jsx'
import {Players, PlayerReserves} from './players.jsx'
import './styles/gem.css'
import './styles/coin.css'
import './styles/card.css'
import './styles/noble.css'
import './styles/player.css'
import './styles/board.css'
import Bundle from '../bundle.js'

function GemMessage(props) {
    let message = ['Take ']
    for (const gem in props.gems) {
        if (props.gems[gem] > 0) {
            message.push(<span key={gem} className={'gem-' + gem + '-text'}>{props.gems[gem] + ' ' + gem + ' '}</span>)
        }
    }
    message.push('?')
    return <span>{message}</span>
}

function ActionBox(props) {

    if (props.gameOver) {
        return <div className="action-box">{'Game over. Winner(s): ' + props.gameOver.winners.join(', ')}</div>
    }

    if (!props.myTurn) {
        return <div className="action-box">Wait for your turn!</div>
    }

    let options;

    if (Object.keys(props.selectedCard).length !== 0) {
        const buyDisabled = props.validCardBuy ? '' : 'disabled'
        const reserveDisabled = props.validCardReserve ? '' : 'disabled'
        options = <div className="options">
            <button disabled={buyDisabled} onClick={() => props.buyCard()}>Buy</button>
            <button disabled={reserveDisabled} onClick={() => props.reserveCard()}>Reserve</button>
        </div>
    } else if (Bundle.getGemCount(props.selectedGems) !== 0) {
        const disabled = props.validGemPick ? '' : 'disabled'
        options = [
            <div key="option" className="options">
                <GemMessage gems={props.selectedGems}></GemMessage>
                <button disabled={disabled} onClick={() => props.takeGems()}>Confirm</button>
            </div>,
            <button key="clear" onClick={() => props.clearGems()}>Clear</button>
        ]
    } else if (props.nobleStage && (props.selectedNoble || props.selectedNoble === 0)) {
        options = <button onClick={() => props.takeNoble()}>Select</button>
    } else if (props.nobleStage) {
        options = <span>Select a noble.</span>
    } else {
        options = <span>Select a move.</span>
    }

    return (
        <div className="action-box">
            
            {options}
        </div>
    )
}

export class GembalayaTable extends React.Component {
    
    render () {
        const myTurn = this.props.playerID === this.props.ctx.currentPlayer
        const nobleStage = this.props.ctx.activePlayers && this.props.ctx.activePlayers[this.props.ctx.currentPlayer]
        return (
            <div className="board">
                <Players players={this.props.G.players} currentPlayer={this.props.ctx.currentPlayer}></Players>
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
                    clearGems={this.props.moves.clearGems}
                    validGemPick={this.props.G.validGemPick}
                    validCardBuy={this.props.G.validCardBuy}
                    validCardReserve={this.props.G.validCardReserve}
                    takeGems={this.props.moves.takeGems}
                    buyCard={this.props.moves.buyCard}
                    reserveCard={this.props.moves.reserveCard}
                    myTurn={myTurn}
                    gameOver={this.props.ctx.gameover}
                    nobleStage={nobleStage}
                    selectedNoble={this.props.G.selectedNoble}
                    takeNoble={this.props.moves.takeNoble}
                ></ActionBox>
                <div className="sidebar">
                    <PlayerReserves
                        reserves={this.props.G.players[this.props.playerID].reserves}
                        selectCard={this.props.moves.selectCard}
                        playerID={this.props.playerID}
                        selectedCard={this.props.G.selectedCardPosition}  
                    ></PlayerReserves>
                </div>
            </div>
        )
    }
}
