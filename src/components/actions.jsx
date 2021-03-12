import React from 'react';
import Button from '@material-ui/core/Button'

import { logBundle } from './logs'
import Bundle from '../bundle.js'

import './styles/action.css'

function GemMessage(props) {
    let message = [props.verb + ' ']
    message = message.concat(logBundle(props.gems))
    message.push('?')
    return <span className="gb-action-text">{message}</span>
}

export function ActionBox(props) {

    if (props.gameOver) {
        const winners = props.gameOver.winnerIDs.map((id) => props.playerMap[id])
        const msg = winners.length > 1 ? `${winners.join(' and ')} Tie!` : `${winners[0]} wins!`
        return <div className="gb-action-box"><span className="gb-action-text">
            {`Game over. ${msg}`}
        </span></div>;
    }

    if (!props.myTurn) {
        return <div className="gb-action-box"><span className="gb-action-text">Wait for your turn!</span></div>;
    }

    let options;

    if (Object.keys(props.selectedCard).length !== 0) {
        options = <div className="gb-options">
            <Button variant="contained" disabled={!props.validCardReserve} onClick={() => props.reserveCard()}>Reserve</Button>
            <Button variant="contained" color="primary" disabled={!props.validCardBuy} onClick={() => props.buyCard()}>Buy</Button>
        </div>;
    } else if (Bundle.getGemCount(props.selectedGems) !== 0) {
        options = [
            <div key="option" className="gb-options">
                <GemMessage gems={props.selectedGems} verb="Take"></GemMessage>
                <Button variant="contained" disabled={!props.validGemPick} onClick={() => props.takeGems()}>Confirm</Button>
            </div>,
            <Button variant="contained" key="clear" onClick={() => props.clearGems()}>Clear</Button>
        ];
    } else if (props.stage === "nobles" && (props.selectedNoble || props.selectedNoble === 0)) {
        options = <Button variant="contained" onClick={() => props.takeNoble()}>Select</Button>;
    } else if (props.stage === "nobles") {
        options = <span className="gb-action-text">Select a noble.</span>;
    } else if (props.stage === "discard" && Bundle.getGemCount(props.discardedGems) > 0) {
        options = [
            <div key="option" className="gb-options">
                <GemMessage gems={props.discardedGems} verb="Discard"></GemMessage>
                <Button variant="contained" disabled={!props.validDiscard} onClick={() => props.discardGems()}>Confirm</Button>
            </div>,
            <Button variant="contained" key="clear" onClick={() => props.clearGems()}>Clear</Button>
        ];
    } else if (props.stage === "discard") {
        options = <span className="gb-action-text">Discard down to 10 gems.</span>;
    } else {
        options = <span className="gb-action-text">Select a card or gem.</span>;
    }

    return (
        <div className="gb-action-box gb-selected-player">
            {options}
        </div>
    );
}
