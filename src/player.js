import Bundle from "./bundle.js"

class Player {
    constructor () {
        this.score = 0
        this.gems = new Bundle({onyx: 2, ruby: 2, sapphire: 2, emerald: 2, diamond: 2})
        this.cards = new Bundle()
        this.reserves = []
    }

    get effectiveGems() {
        return Player.getEffectiveGems(this)
    }

    static getEffectiveGems(player) {
        let effectiveGems = new Bundle()
        effectiveGems.addBundle(player.gems)
        effectiveGems.addBundle(player.cards)
        return effectiveGems
    } 
}

export default Player