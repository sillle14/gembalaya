import React from 'react';
import Button from '@material-ui/core/Button'

import Bundle from '../bundle.js';
import { logBundle } from './logs'
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
        const buyDisabled = props.validCardBuy ? '' : 'disabled';
        const reserveDisabled = props.validCardReserve ? '' : 'disabled';
        options = <div className="gb-options">
            <Button variant="contained" disabled={buyDisabled} onClick={() => props.buyCard()}>Buy</Button>
            <Button variant="contained" color="primary" disabled={reserveDisabled} onClick={() => props.reserveCard()}>Reserve</Button>
        </div>;
    } else if (Bundle.getGemCount(props.selectedGems) !== 0) {
        const disabled = props.validGemPick ? '' : 'disabled';
        options = [
            <div key="option" className="gb-options">
                <GemMessage gems={props.selectedGems} verb="Take"></GemMessage>
                <Button variant="contained" disabled={disabled} onClick={() => props.takeGems()}>Confirm</Button>
            </div>,
            <Button variant="contained" key="clear" onClick={() => props.clearGems()}>Clear</Button>
        ];
    } else if (props.stage === "nobles" && (props.selectedNoble || props.selectedNoble === 0)) {
        options = <Button variant="contained" onClick={() => props.takeNoble()}>Select</Button>;
    } else if (props.stage === "nobles") {
        options = <span className="gb-action-text">Select a noble.</span>;
    } else if (props.stage === "discard" && Bundle.getGemCount(props.discardedGems) > 0) {
        const disabled = props.validDiscard ? '' : 'disabled';
        options = [
            <div key="option" className="gb-options">
                <GemMessage gems={props.discardedGems} verb="Discard"></GemMessage>
                <Button variant="contained" disabled={disabled} onClick={() => props.discardGems()}>Confirm</Button>
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
