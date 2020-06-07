class Bundle {
    constructor(gems) {
        if (!gems) {
            gems = {}
        }
        this.onyx = gems.onyx || 0
        this.ruby = gems.ruby || 0
        this.sapphire = gems.sapphire || 0
        this.diamond = gems.diamond || 0
        this.emerald = gems.emerald || 0
        this.gold = gems.gold || 0
    }

    get gemCount() {
        return Bundle.getGemCount(this)
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

    subtractBundle(otherBundle) {
        Bundle.subtractBundles(this, otherBundle)
    }

    static subtractBundles(bundle1, bundle2) {
        let deficit = 0
        for (const gem in bundle2) {
            deficit += Math.max(bundle2[gem] - bundle1[gem], 0)
            bundle1[gem] = Math.max(bundle1[gem] - bundle2[gem], 0)
        }
        if (bundle1["gold"] < deficit) {
            throw new Error("Not enough gems")
        }
        bundle1["gold"] -= deficit
    }

    discountBundle(otherBundle) {
        Bundle.discountBundles(this, otherBundle)
    }

    static discountBundles(bundle1, bundle2) {
        for (const gem in bundle2) {
            bundle1[gem] = Math.max(bundle1[gem] - bundle2[gem], 0)
        }
    }
}

export default Bundle
