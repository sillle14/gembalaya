import Bundle from './bundle'

class Player {
    static new() {
        return {score: 0, gems: Bundle.new(), cards: Bundle.new(), reserves: []}
    }

    static getEffectiveGems(player) {
        let effectiveGems = {}
        Bundle.addBundles(effectiveGems, player.gems)
        Bundle.addBundles(effectiveGems, player.cards)
        return effectiveGems
    } 
}

export default Player