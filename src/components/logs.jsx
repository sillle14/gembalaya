import React from 'react'
import { animateScroll } from 'react-scroll'

function logGem(gem) {
    return <span key={gem} className={'gb-gem-' + gem + '-text'}>{gem}</span>
}

export function logBundle(gems) {
    let message = []
    for (const gem in gems) {
        if (gems[gem] > 0) {
            message.push(<span key={gem} className={'gb-gem-' + gem + '-text'}>{gems[gem] + ' ' + gem + ' '}</span>)
        }
    }
    return message
}

function Log(props) {
    const log = props.log
    const playerName = props.playerMap[log.playerID]
    let details
    switch (log.move) {
        case 'takeGems':
            details = [
                <span key="header">{`${playerName} takes gems:`}</span>,
                <br key="br"></br>,
                <span key="gems">{[<span key="span">&nbsp;&nbsp;&nbsp;&nbsp;</span>].concat(logBundle(log.gems))}</span>
            ]
            break
        case 'buyCard':
        case 'reserveCard':
            const action = log.move === 'buyCard' ? 'buys' : 'reserves'
            details = [
                <span key="reserve 1">{`${playerName} ${action} tier ${log.card.tier} `}</span>,
                logGem(log.card.gem),
                <span key="reserve 2"> card</span>
            ]
            if (log.card.points) {
                if (!log.hidePoints) {
                    details.push(<span key="points">{` worth ${log.card.points} point${log.card.points > 1 ? 's' : ''}`}</span>)
                }
            }
            if (log.fromReserve) {
                details.push(<br key="br"></br>)
                details.push(<span key="reserve">&nbsp;&nbsp;&nbsp;&nbsp;(from reserve)</span>)
            }
            break
        case 'takeNoble':
            details = <span>{`${playerName} takes a noble (3 points)`}</span>
            break
        case 'endGame':
            let winStatement;
            let winners = log.winnerIDs.map((id) => props.playerMap[id])
            if (log.winnerIDs.length > 1) {
                winStatement = 'Tie between players ' + winners.join(' and ')
            } else {
                winStatement = `${winners[0]} wins!`
            }
            details = <span>{`Game over. ${winStatement}`}</span>
            break;
        case 'discardGems':
            details = [
                <span key="header">{`${playerName} discards gems:`}</span>,
                <br key="br"></br>,
                <span key="gems">{[<span key="span">&nbsp;&nbsp;&nbsp;&nbsp;</span>].concat(logBundle(log.gems))}</span>
            ]
            break
        case 'gameEnd':
            details=<span>15 points reached. Last round!</span>
            break
        default:
            break
    }

    return <div>{details}</div>
}

export class Logs extends React.Component {

    constructor(props) {
        super(props);
        this.bottom = React.createRef();
    }

    scrollToBottom = () => {
        animateScroll.scrollToBottom({containerId: this.props.playerID + '-log', duration: 0});
    }
    
    componentDidMount() { this.scrollToBottom() }

    componentDidUpdate(prevProps) { 
        if (this.props.logs.length !== prevProps.logs.length) {
            this.scrollToBottom() 
        }
    }

    render () {
        let logs = []
        for (let i = this.props.logs.length - 1; i >= 0; i--) {
            logs.push(<Log key={i} log={this.props.logs[i]} playerMap={this.props.playerMap}></Log>)
        }
    
        return (
            <div className="gb-logs">
                <span>Game Log:</span>
                <hr className="gb-log-break"></hr>
                <div className="gb-scroll" id={this.props.playerID + '-log'}>
                    {logs}
                </div>
            </div>
        )
    }
}