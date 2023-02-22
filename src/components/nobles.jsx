function Noble(props) {
    let costs = []; 
    for (const gem in props.cost) {
        if (props.cost[gem] > 0) {
            const className = 'gem gb-gem-noble-cost gb-gem-' + gem;
            costs.push(
                <div className={className} key={gem}>{props.cost[gem]}</div>
            )
        }
    }
    let borderClass = ''
    if (props.selected) {
        borderClass = ' gb-selected-noble'
    } else if (props.available) {
        borderClass = ' gb-available-noble'
    }
    return (
        <div className="gb-noble-wrapper">
            <div className="gb-noble-aspect-box" onClick={() => props.selectNoble(props.position)}>
                <div className={'gb-noble' + borderClass}>
                    <span className="gb-points">3</span>
                    <div className="gb-noble-cost">{costs}</div>
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
        <div className="gb-noble-row">{nobles}</div>
    )
}