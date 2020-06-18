import React from 'react'

const gems = ['onyx', 'ruby', 'sapphire', 'diamond', 'emerald', 'gold']

function Gem(props) {
    let selectClass = ''
    switch (props.selected) {
        case 1: selectClass = ' selected-coin'; break
        case 2: selectClass = ' selected-coin-2'; break
        default: break
    }
    return (
        <div className="coin-wrapper">
            <div className={'coin-aspect-box' + selectClass} onClick={() => props.selectGem(props.gem)}>
                <div className="coin">
                    <div className="coin-inner">
                        <div className={'gem gem-' + props.gem + ' gem-coin'}>{props.count}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Piles(props) {
    let gemPiles = [];
    function addGem(gem) {
        const selected = props.myTurn && (props.selectedGems[gem] || false)
        gemPiles.push(<Gem gem={gem} key={gem} count={props.gems[gem]} selected={selected} selectGem={props.selectGem}></Gem>)
    }
    gems.forEach(addGem)
    return (
        <div className="coin-row">{gemPiles}</div>
    )
}