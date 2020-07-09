import React from 'react'

function Noble(props) {
    let costs = []; 
    for (const gem in props.cost) {
        if (props.cost[gem] > 0) {
            const className = 'gem gem-noble-cost gem-' + gem;
            costs.push(
                <div className={className} key={gem}>{props.cost[gem]}</div>
            )
        }
    }
    let borderClass = ''
    if (props.selected) {
        borderClass = ' selected-noble'
    } else if (props.available) {
        borderClass = ' available-noble'
    }
    return (
        <div className="noble-wrapper">
            <div className={'noble-aspect-box' + borderClass} onClick={() => props.selectNoble(props.position)}>
                <div className="noble">
                    <span className="points">3</span>
                    <div className="noble-cost">{costs}</div>
                </div>
            </div>
        </div>
    )
}

export function NobleSet(props) {
    let nobles = [];
    for (let i = 0; i < props.nobles.length; i++) {
        const cost = props.nobles[i].cost
        const available = (props.availableNobles || []).includes(i) && props.myTurn
        const selected = i === props.selectedNoble && props.myTurn
        nobles.push(<Noble
            key={i} 
            cost={cost} 
            available={available} 
            selected={selected}
            position={i}
            selectNoble={props.selectNoble}
        ></Noble>
        )
    }
    return (
        <div className="noble-row">{nobles}</div>
    )
}