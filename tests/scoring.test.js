const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const ICEScoring = require('../scoring.js');

describe('calculateImpact', () => {
    test('defaults to 0 when nothing is answered', () => {
        assert.equal(ICEScoring.calculateImpact({}), 0);
    });

    test('sums all five Impact fields', () => {
        const impact = ICEScoring.calculateImpact({
            winRate: '0.1',
            arrPotential: '0.2',
            retentionLtv: '0.1',
            customerSat: '0.01',
            userBaseReach: '0.2'
        });
        assert.equal(impact, 0.6);
    });

    test('caps at 5 even though the max possible raw sum is 6.5', () => {
        const impact = ICEScoring.calculateImpact({
            winRate: '1',
            arrPotential: '3',
            retentionLtv: '1',
            customerSat: '0.5',
            userBaseReach: '1'
        });
        assert.equal(impact, 5);
    });

    test('rounds to one decimal place', () => {
        // 0.2 + 0.1 = 0.30000000000000004 in floating point without rounding.
        const impact = ICEScoring.calculateImpact({ winRate: '0.1', arrPotential: '0.2' });
        assert.equal(impact, 0.3);
    });
});

describe('calculateConfidence', () => {
    test('defaults to 0 when nothing is answered', () => {
        assert.equal(ICEScoring.calculateConfidence({}), 0);
    });

    test('adds 1 for each checked box using its documented weight', () => {
        const confidence = ICEScoring.calculateConfidence({
            userResearch: true,
            analytics: true
        });
        assert.equal(confidence, 1.5);
    });

    test('caps at 5', () => {
        const confidence = ICEScoring.calculateConfidence({
            cannyVotes: '1',
            competitive: '0.5',
            userResearch: true,
            analytics: true,
            differentiator: true,
            marketTrends: true,
            icpSegment: true,
            icpMarket: true,
            churnedDeals: true,
            supportWorkload: true,
            techPerspective: true,
            selfConviction: true,
            managerConviction: true,
            externalFactors: true
        });
        assert.equal(confidence, 5);
    });

    test('documented gotcha: the two smallest checkbox weights can round away to nothing', () => {
        // selfConviction (0.01) + managerConviction (0.02) = 0.03, which rounds to 0.0
        // at the one-decimal-place precision calculateConfidence rounds to.
        const confidence = ICEScoring.calculateConfidence({
            selfConviction: true,
            managerConviction: true
        });
        assert.equal(confidence, 0);
    });
});

describe('calculateEase', () => {
    test('defaults to 5 (best case) when nothing is answered', () => {
        assert.equal(ICEScoring.calculateEase({}), 5);
    });

    test('documented gotcha: an unanswered dropdown scores identically to its best-case answer', () => {
        // complexity/timeframe both default their "Select..." option to the same
        // value as "Low"/"Short" (0), so a skipped field is indistinguishable from
        // the most favorable answer. Intended for now (internal-use tool) — see
        // docs/architecture.md for the tradeoff.
        const unanswered = ICEScoring.calculateEase({});
        const bestCase = ICEScoring.calculateEase({ complexity: '0', timeframe: '0' });
        assert.equal(unanswered, bestCase);
    });

    test('subtracts complexity, timeframe, and dependency checkboxes', () => {
        const ease = ICEScoring.calculateEase({
            complexity: '-1',
            timeframe: '-0.5',
            crossTech: true
        });
        assert.equal(ease, 2.5);
    });

    test('floors at 1 even if the raw total goes negative', () => {
        const ease = ICEScoring.calculateEase({
            complexity: '-3',
            timeframe: '-3',
            crossTech: true,
            crossModule: true,
            crossProject: true,
            integrations: true,
            internal3rd: true,
            external3rd: true,
            legalSecurity: true,
            unknownRisk: true
        });
        assert.equal(ease, 1);
    });
});

describe('calculateTotal', () => {
    test('multiplies impact, confidence, and ease', () => {
        assert.equal(ICEScoring.calculateTotal(2, 3, 4), 24);
    });

    test('rounds the product to one decimal place', () => {
        assert.equal(ICEScoring.calculateTotal(1.1, 1.1, 1.1), 1.3);
    });
});

describe('getTier', () => {
    test('tier boundaries are exclusive on the upper end', () => {
        // total < max, so a score exactly on a boundary belongs to the NEXT tier up.
        assert.equal(ICEScoring.getTier(4.9).label, 'Low priority');
        assert.equal(ICEScoring.getTier(5).label, 'Needs work');
        assert.equal(ICEScoring.getTier(15).label, 'Worth exploring');
        assert.equal(ICEScoring.getTier(30).label, 'Strong bet');
        assert.equal(ICEScoring.getTier(55).label, 'Must-do');
    });

    test('covers the full range from 0 to very large totals', () => {
        assert.equal(ICEScoring.getTier(0).label, 'Low priority');
        assert.equal(ICEScoring.getTier(1000).label, 'Must-do');
    });
});

describe('calculateAll (end-to-end)', () => {
    test('a fully unanswered form scores 0 total at the lowest tier', () => {
        const result = ICEScoring.calculateAll({});
        assert.equal(result.impact, 0);
        assert.equal(result.confidence, 0);
        assert.equal(result.ease, 5);
        assert.equal(result.total, 0);
        assert.equal(result.tier.label, 'Low priority');
    });

    test('a strong, well-supported, easy idea lands in a top tier', () => {
        const result = ICEScoring.calculateAll({
            winRate: '1',
            arrPotential: '3',
            retentionLtv: '1',
            customerSat: '0.5',
            userBaseReach: '1',
            cannyVotes: '1',
            competitive: '0.5',
            userResearch: true,
            analytics: true,
            techPerspective: true,
            complexity: '0',
            timeframe: '0'
        });
        assert.equal(result.impact, 5);
        assert.equal(result.confidence, 4);
        assert.equal(result.ease, 5);
        assert.equal(result.total, 100);
        assert.equal(result.tier.label, 'Must-do');
    });
});
