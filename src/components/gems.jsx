import React from 'react'

const gems = ['onyx', 'ruby', 'sapphire', 'diamond', 'emerald', 'gold']

function Gem(props) {
    let selectClass = ''
    switch (props.selected) {
        case 1: selectClass = ' gb-selected-coin'; break
        case 2: selectClass = ' gb-selected-coin-2'; break
        default: break
    }
    return (
        <div className="gb-coin-wrapper">
            <div className={'gb-coin-aspect-box' + selectClass} onClick={() => props.selectGem(props.gem)}>
                <div className="gb-coin">
                    <div className="gb-coin-inner">
                        <div className={'gem gb-gem' + props.gem + ' gb-gem-coin'}>{props.count}</div>
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
        <div className="gb-coin-row">{gemPiles}</div>
    )
}