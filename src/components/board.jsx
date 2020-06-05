import React from "react"
import {NobleSet} from "./nobles.jsx"
import {Piles} from "./coins.jsx"
import {CardGrid} from "./cards.jsx"
import {Players} from "./players.jsx"
import "./styles/gem.css"
import "./styles/coin.css"
import "./styles/card.css"
import "./styles/noble.css"
import "./styles/player.css"
import "./styles/board.css"

function ActionBox(props) {

    let options;

    if (Object.keys(props.selectedCard).length !== 0) {
        options = <div className="options"><button disabled="true">Buy</button><button>Reserve</button></div>
    } else if (Object.keys(props.selectedCard).length !== 0) {
        options = <div className="options">A Test</div>
    } else {
        options = <span>Select a move.</span>
    }


    return (
        <div class="action-box">
            <button onClick={props.clearSelection}>Clear</button>
            {options}
        </div>
    )
}

export class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCard: {},
            selectedCoins: {},
        }
        this.onSelectCard = this.onSelectCard.bind(this)
        this.clearSelection = this.clearSelection.bind(this)
    }

    onSelectCard(cardID) {
        this.setState({selectedCard: cardID})
    }

    clearSelection() {
        this.setState({selectedCard: {}, selectedCoins: {}})
    }
    
    render () {
        return (
            <div className="board">
                <Players players={this.props.G.players}></Players>
                <CardGrid board={this.props.G.board} decks={this.props.G.decks} selectedCard={this.state.selectedCard} onSelectCard={this.onSelectCard}></CardGrid>
                <NobleSet nobles={this.props.G.nobles}></NobleSet>
                <Piles gems={this.props.G.gems}></Piles>
                <ActionBox 
                    selectedCard={this.state.selectedCard} 
                    selectedCoins={this.state.selectedCoins}
                    clearSelection={this.clearSelection}
                    G={this.props.G} // pass less than this
                ></ActionBox>
            </div>
        )
    }
}
