import { LOTTO_CONFIGS } from './LottoConfig.js';

export class GlobalLottoEngine {
    constructor(lottoType = 'KOREA_645') {
        this.lottoType = lottoType;
        this.config = LOTTO_CONFIGS[lottoType];
        this.stats = {
            hotLast5: [],
            coldLast5: [],
            historicTop: []
        };
    }

    setStats(stats) {
        this.stats = { ...this.stats, ...stats };
    }

    generateRandomCandidate() {
        const { mainPool, bonusPool } = this.config;
        
        // Generate main numbers
        const mainBalls = new Set();
        while (mainBalls.size < mainPool.count) {
            mainBalls.add(Math.floor(Math.random() * (mainPool.max - mainPool.min + 1)) + mainPool.min);
        }
        const sortedMain = Array.from(mainBalls).sort((a, b) => a - b);

        // Generate bonus numbers if applicable
        const bonusBalls = [];
        if (bonusPool) {
            const pool = [];
            for (let i = bonusPool.min; i <= bonusPool.max; i++) {
                if (!bonusPool.allowDuplicateBetweenPools && mainBalls.has(i)) continue;
                pool.push(i);
            }
            
            for (let i = 0; i < bonusPool.count; i++) {
                if (pool.length === 0) break;
                const idx = Math.floor(Math.random() * pool.length);
                bonusBalls.push(pool.splice(idx, 1)[0]);
            }
        }

        return { mainBalls: sortedMain, bonusBalls: bonusBalls.sort((a, b) => a - b) };
    }

    getAC(nums) {
        const diffs = new Set();
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                diffs.add(Math.abs(nums[i] - nums[j]));
            }
        }
        return diffs.size - (nums.length - 1);
    }

    applyFilters(candidate, selectedIds) {
        const nums = candidate.mainBalls;
        const { hotLast5, coldLast5, historicTop } = this.stats;
        
        const filters = {
            1: () => nums.filter(n => hotLast5.includes(n)).length >= 1,
            2: () => nums.filter(n => historicTop.includes(n)).length >= 1,
            4: () => nums.filter(n => coldLast5.includes(n)).length >= 1,
            7: () => {
                const sum = nums.reduce((a, b) => a + b, 0);
                // General sum range: 30% to 70% of max possible sum
                const maxSum = Array.from({length: this.config.mainPool.count}, (_, i) => this.config.mainPool.max - i).reduce((a, b) => a + b, 0);
                const minSum = Array.from({length: this.config.mainPool.count}, (_, i) => this.config.mainPool.min + i).reduce((a, b) => a + b, 0);
                const range = maxSum - minSum;
                return sum >= minSum + range * 0.3 && sum <= minSum + range * 0.7;
            },
            8: () => this.getAC(nums) >= (this.config.mainPool.count >= 6 ? 7 : 4),
            9: () => {
                const odd = nums.filter(n => n % 2 !== 0).length;
                return odd >= 1 && odd <= (nums.length - 1);
            },
            13: () => {
                let consecutive = 0;
                for (let i = 0; i < nums.length - 1; i++) {
                    if (nums[i+1] - nums[i] === 1) consecutive++;
                }
                return consecutive <= 2;
            },
            22: () => true // AI filter handled separately
        };

        let passed = 0;
        const activeIds = selectedIds.filter(id => filters[id]);
        if (activeIds.length === 0) return 1;

        for (const id of activeIds) {
            if (filters[id]()) passed++;
        }
        return passed / activeIds.length;
    }

    async getWeightedCandidate(selectedIds, iterations = 400, aiPredictor = null) {
        let best = null;
        let maxTotalScore = -1;

        const isAiEnabled = selectedIds.includes(22) && aiPredictor;

        for (let i = 0; i < iterations; i++) {
            const candidate = this.generateRandomCandidate();
            const filterScore = this.applyFilters(candidate, selectedIds);
            
            let aiScore = 0.5;
            if (isAiEnabled) {
                // Only run AI if filters are somewhat decent to save performance
                if (filterScore > 0.5) {
                    aiScore = await aiPredictor(candidate.mainBalls);
                } else {
                    aiScore = 0.1;
                }
            }

            // Weights: 50% Filter, 50% AI
            const totalScore = (filterScore * 50) + (aiScore * 50);

            if (totalScore > maxTotalScore) {
                maxTotalScore = totalScore;
                best = {
                    ...candidate,
                    score: totalScore.toFixed(1),
                    aiScore: (aiScore * 100).toFixed(1),
                    filterRate: filterScore
                };
            }

            if (i % 100 === 0) await new Promise(r => setTimeout(r, 0));
        }

        return best;
    }
}
