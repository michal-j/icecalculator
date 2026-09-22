// Pure ICE scoring logic, shared by index.html (as a plain <script> global)
// and the test suite (as a CommonJS module) — no DOM access in this file.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ICEScoring = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    const tiers = [
        { max: 5, n: 1, label: 'Low priority' },
        { max: 15, n: 2, label: 'Needs work' },
        { max: 30, n: 3, label: 'Worth exploring' },
        { max: 55, n: 4, label: 'Strong bet' },
        { max: Infinity, n: 5, label: 'Must-do' }
    ];

    function round1(n) {
        return Math.round(n * 10) / 10;
    }

    function calculateImpact(inputs) {
        let impact = 0;
        impact += parseFloat(inputs.winRate) || 0;
        impact += parseFloat(inputs.arrPotential) || 0;
        impact += parseFloat(inputs.retentionLtv) || 0;
        impact += parseFloat(inputs.customerSat) || 0;
        impact += parseFloat(inputs.userBaseReach) || 0;
        return Math.min(round1(impact), 5);
    }

    function calculateConfidence(inputs) {
        let confidence = 0;
        confidence += parseFloat(inputs.cannyVotes) || 0;
        confidence += parseFloat(inputs.competitive) || 0;
        confidence += inputs.userResearch ? 1 : 0;
        confidence += inputs.analytics ? 0.5 : 0;
        confidence += inputs.differentiator ? 0.5 : 0;
        confidence += inputs.marketTrends ? 0.1 : 0;
        confidence += inputs.icpSegment ? 0.1 : 0;
        confidence += inputs.icpMarket ? 0.25 : 0;
        confidence += inputs.churnedDeals ? 0.75 : 0;
        confidence += inputs.supportWorkload ? 0.5 : 0;
        confidence += inputs.techPerspective ? 1 : 0;
        confidence += inputs.selfConviction ? 0.01 : 0;
        confidence += inputs.managerConviction ? 0.02 : 0;
        confidence += inputs.externalFactors ? 0.5 : 0;
        return Math.min(round1(confidence), 5);
    }

    function calculateEase(inputs) {
        let ease = 5;
        ease += parseFloat(inputs.complexity) || 0;
        ease += parseFloat(inputs.timeframe) || 0;
        ease += inputs.crossTech ? -1 : 0;
        ease += inputs.crossModule ? -2 : 0;
        ease += inputs.crossProject ? -1 : 0;
        ease += inputs.integrations ? -2 : 0;
        ease += inputs.internal3rd ? -1 : 0;
        ease += inputs.external3rd ? -2 : 0;
        ease += inputs.legalSecurity ? -1 : 0;
        ease += inputs.unknownRisk ? -1 : 0;
        return Math.max(round1(ease), 1);
    }

    function calculateTotal(impact, confidence, ease) {
        return round1(impact * confidence * ease);
    }

    function getTier(total) {
        return tiers.find(t => total < t.max) || tiers[tiers.length - 1];
    }

    function calculateAll(inputs) {
        const impact = calculateImpact(inputs);
        const confidence = calculateConfidence(inputs);
        const ease = calculateEase(inputs);
        const total = calculateTotal(impact, confidence, ease);
        const tier = getTier(total);
        return { impact, confidence, ease, total, tier };
    }

    return {
        tiers,
        calculateImpact,
        calculateConfidence,
        calculateEase,
        calculateTotal,
        getTier,
        calculateAll
    };
});
