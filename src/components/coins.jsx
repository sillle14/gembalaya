import React from "react"

const gems = ["onyx", "ruby", "sapphire", "diamond", "emerald", "gold"]

function Coin(props) {
    return (
        <div className="coin-wrapper">
            <div className="coin-aspect-box">
                <div className="coin">
                    <div className="coin-inner">
                        <div className={"gem gem-" + props.type + " gem-coin"}>{props.count}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Piles(props) {
    let gemPiles = [];
    gems.forEach(gem => gemPiles.push(<Coin type={gem} key={gem} count={props.gems[gem]}></Coin>))
    return (
        <div className="coin-row">{gemPiles}</div>
    )
}