import { Card } from './cards'

function Player(props) {

    let cards = []
    for (const gem in props.cards) {
        // No gold cards.
        if (gem !== 'gold') { cards.push(<div key={gem} className={'gem gb-gem-' + gem}>{props.cards[gem]}</div>) }
    }

    let gems = []
    for (const gem in props.gems) {
        gems.push(<div
            key={gem} 
            className={'gem gb-gem-player-coin gb-gem-' + gem}
            onClick={() => props.selectDiscard(gem)}
        >{props.gems[gem]}</div>)
    }

    let reserves = [<span key="label">Reserves:&nbsp;</span>]
    for (let i = 0; i < props.reserves.length; i++) {
        const tier = 'i'.repeat(props.reserves[i].tier)
        reserves.push(<div
            key={i}
            className={'gb-card-back gb-card-back-' + tier}
        >{tier.toUpperCase()}</div>)
    }

    return (
        <div className="gb-player-wrapper">
            <div className="gb-player-aspect-box">
                <div className={'gb-player-mat' + (props.active ? ' gb-selected-player' : '')}>
                    <div className="gb-player-info">
                        <span className="gb-points">{props.score}</span>
                        <span className="gb-player-name">{props.playerName}</span>
                    </div>
                    <div className="gb-player-holdings">
                        {cards}
                    </div>
                    <div className="gb-player-holdings">
                        {gems}
                    </div>
                    <div className="gb-player-public-reserves">
                        {reserves}
                    </div>
                </div>
            </div>
        </div>
        )
}

export function Players(props) {
    let players = []
    props.playerOrder.forEach((playerID) => {
        const player = props.players[playerID]
        const playerName = props.playerMap[playerID]
        const active = props.currentPlayer === playerID
        players.push(
        <Player 
            key={playerID}
            cards={player.cards}
            gems={player.gems}
            score={player.score}
            playerName={playerName}
            active={active}
            selectDiscard={props.selectDiscard}
            reserves={player.reserves}
        ></Player>
        )
    })
    return <div className='gb-player-column'>{players}</div>
}

export function PlayerReserves(props) {

    let reserves = []
    for (let i = 0; i < props.reserves.length; i++) {
        const card = props.reserves[i]
        const selectedCard = props.selectedCard
        let selected = (
            selectedCard.reserved &&
            selectedCard.playerID === props.playerID &&
            selectedCard.position === i
        )
        reserves.push(<Card 
            key={i} 
            cardPosition={{reserved: true, playerID: props.playerID, position: i}}
            cost={card.cost} 
            gem={card.gem} 
            points={card.points} 
            selected={selected}
            selectCard={props.selectCard}
        ></Card>)
    }

    let msg
    if (props.spectator) {
        msg = `${props.playerMap[props.currentPlayer]}'s Reserves:`
    } else{
        msg = 'Your Reserves:'
    }

    return (
        <div className="gb-player-reserves">
            <span className="gb-player-reserves-label">{msg}</span>
            <div className="gb-player-reserves-cards">{reserves}</div>
        </div>
    )
}