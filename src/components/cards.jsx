export function Card(props) {

    let costs = []; 
    for (const gem in props.cost) {
        if (props.cost[gem] > 0) {
            const className = 'gem gb-gem-card-cost gb-gem-' + gem;
            costs.push(
                <div className={className} key={gem}>{props.cost[gem]}</div>
            )
        }
    }

    return (
        <div className="gb-card-wrapper">
            <div className="gb-card-aspect-box" onClick={() => props.selectCard(props.cardPosition)}>
                <div className={'gb-card gb-card-' + props.gem + (props.selected ? ' gb-selected-card' : '')}>
                    <div className="gb-card-info">
                        <span className="gb-points">{props.points || ''}</span> 
                        <div className={'gem gb-gem-card-value gb-gem-' + props.gem}></div>
                    </div>
                    <div className="gb-card-costs">{costs}</div>
                </div>
            </div>
        </div>
        
    )
}

function CardBack(props) {
    const numeral = 'i'.repeat(props.tier + 1) // Tier is 0 indexed
    return (
        <div className="gb-card-wrapper">
            <div className="gb-card-aspect-box" onClick={() => props.selectCard({tier: props.tier})}>
                <div className={'gb-card gb-card-back gb-card-back-' + numeral + (props.selected ? ' gb-selected-card': '')}>
                    {numeral.toUpperCase()}
                    <span className="gb-card-back-count">{'(' + props.count + ')'}</span>
                </div>
            </div>
        </div>
    )
}

export function CardGrid(props) {
    let cardRows = []
    for (let tier = 2; tier > -1; tier--) {
        let cards = []
        const cardsRemaining = props.decks[tier].length
        const deckSelected = props.selectedCard.tier === tier && props.selectedCard.position === undefined && props.myTurn
        cards.push(<CardBack key={tier} tier={tier} count={cardsRemaining} selected={deckSelected} selectCard={props.selectCard}></CardBack>);
        for (let i = 0; i < props.board[tier].length; i++) {
            const selected = props.selectedCard.tier === tier && props.selectedCard.position === i && props.myTurn
            const card = props.board[tier][i]
            if (card) {
                cards.push(<Card 
                    key={'tier: ' + tier + ' positon:' + i} 
                    cardPosition={{tier: tier, position: i}}
                    cost={card.cost} 
                    gem={card.gem} 
                    points={card.points} 
                    selected={selected}
                    selectCard={props.selectCard}
                ></Card>)
            }
        }
        cardRows.push(<div className="gb-card-row" key={tier}>{cards}</div>)
    }
    return (
        <div className="gb-card-grid">{cardRows}</div>
    )
}