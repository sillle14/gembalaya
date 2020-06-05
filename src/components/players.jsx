import React from "react"

function Player(props) {

    let cards = []
    for (const gem in props.cards) {
        cards.push(<div key={gem} className={"gem gem-" + gem}>{props.cards[gem]}</div>)
    }

    let coins = []
    for (const gem in props.coins) {
        coins.push(<div key={gem} className={"gem gem-player-coin gem-" + gem}>{props.coins[gem]}</div>)
    }

    return (
        <div className="player-wrapper">
            <div className="player-aspect-box">
                <div className="player-mat">
                    <div className="player-info">
                        <span className="points">{props.score}</span>
                        <span className="player-name">{"Player " + props.playerID}</span>
                    </div>
                    <div className="player-holdings">
                        {cards}
                    </div>
                    <div className="player-holdings">
                        {coins}
                    </div>
                </div>
            </div>
        </div>
        )
}

export function Players(props) {
    let players = []
    for (const playerID in props.players) {
        const player = props.players[playerID]
        players.push(
        <Player 
            key={playerID}
            cards={player.cards}
            coins={player.coins}
            score={player.score}
            playerID={playerID}
        ></Player>
        )
    }
    return <div className="player-column">{players}</div>
}