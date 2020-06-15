import React from "react"

export function Card(props) {

    let costs = []; 
    for (const gem in props.cost) {
        if (props.cost[gem] > 0) {
            const className = "gem gem-card-cost gem-" + gem;
            costs.push(
                <div className={className} key={gem}>{props.cost[gem]}</div>
            )
        }
    }

    return (
        <div className="card-wrapper">
            <div className={"card-aspect-box" + (props.selected ? " selected-card" : "")} 
                onClick={() => props.onSelectCard(props.cardPosition)}>
                <div className={"card card-" + props.gem}>
                    <div className="card-info">
                        <span className="points">{props.points || ""}</span> 
                        <div className={"gem gem-card-value gem-" + props.gem}></div>
                    </div>
                    <div className="card-costs">{costs}</div>
                </div>
            </div>
        </div>
        
    )
}

function CardBack(props) {
    const numeral = "i".repeat(props.tier + 1) // Tier is 0 indexed
    return (
        <div className="card-wrapper">
            <div className={"card-aspect-box" + (props.selected ? " selected-card": "")} onClick={() => props.onSelectCard({tier: props.tier})}>
                <div className={"card card-back card-back-" + numeral}>
                    {numeral.toUpperCase()}
                    <span className="card-back-count">{"(" + props.count + ")"}</span>
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
        const deckSelected = props.selectedCard.tier === tier && props.selectedCard.position === undefined
        cards.push(<CardBack key={tier} tier={tier} count={cardsRemaining} selected={deckSelected} onSelectCard={props.onSelectCard}></CardBack>);
        for (let i = 0; i < props.board[tier].length; i++) {
            const selected = props.selectedCard.tier === tier && props.selectedCard.position === i
            const card = props.board[tier][i]
            if (card) {
                cards.push(<Card 
                    key={"tier: " + tier + " positon:" + i} 
                    cardPosition={{tier: tier, position: i}}
                    cost={card.cost} 
                    gem={card.gem} 
                    points={card.points} 
                    selected={selected}
                    onSelectCard={props.onSelectCard}
                ></Card>)
            }
        }
        cardRows.push(<div className="card-row" key={tier}>{cards}</div>)
    }
    return (
        <div className="card-grid">{cardRows}</div>
    )
}