class Bundle {
    static new(gems) {
        return Object.assign({onyx: 0, ruby: 0, sapphire: 0, diamond: 0, emerald: 0, gold: 0}, gems || {})
    }

    
    static getGemCount(bundle) {
        return (bundle.onyx + bundle.ruby + bundle.sapphire + bundle.diamond + bundle.emerald + bundle.gold)
    }

    addBundle(otherBundle) {
        Bundle.addBundles(this, otherBundle)
    }

    static addBundles(bundle1, bundle2) {
        for (const gem in bundle2) {
            bundle1[gem] += bundle2[gem]
        }
    }

    static subtractBundles(bundle1, bundle2) {
        let deficit = 0
        for (const gem in bundle2) {
            deficit += Math.max(bundle2[gem] - bundle1[gem], 0)
            bundle1[gem] = Math.max(bundle1[gem] - bundle2[gem], 0)
        }
        if (bundle1.gold < deficit) {
            throw new Error('Not enough gems')
        }
        bundle1.gold -= deficit
    }

    static discountBundles(bundle1, bundle2) {
        for (const gem in bundle2) {
            bundle1[gem] = Math.max(bundle1[gem] - bundle2[gem], 0)
        }
    }
}

export default Bundle
