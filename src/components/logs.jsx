import React from 'react'

function logGem(gem) {
    return <span key={gem} className={'gem-' + gem + '-text'}>{gem}</span>
}

export function logBundle(gems) {
    let message = []
    for (const gem in gems) {
        if (gems[gem] > 0) {
            message.push(<span key={gem} className={'gem-' + gem + '-text'}>{gems[gem] + ' ' + gem + ' '}</span>)
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
                winStatement = `${winners[0]} wins!` // TODO
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
        default:
            break
    }

    return <div>{details}</div>
}

export function Logs(props) {
    let logs = []
    for (let i = props.logs.length - 1; i >= 0; i--) {
        logs.push(<Log key={i} log={props.logs[i]} playerMap={props.playerMap}></Log>)
        logs.push(<br key={i + "br"}></br>)
    }

    return (
        <div className="logs">
            <span>Game Log:</span>
            <hr className="log-break"></hr>
            <div className="scroll">
                {logs}
            </div>
        </div>
    )
}