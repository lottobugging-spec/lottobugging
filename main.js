/**
 * LottoBugging Core Engine v2.1
 * Specialized for Deep Tech Analysis
 */

const MOCK_DATA = {
    recentWins: [[3, 12, 23, 34, 42, 45], [7, 18, 19, 21, 23, 35], [5, 11, 14, 25, 33, 40]],
    hotNumbers: [12, 23, 34, 42, 45, 1, 4, 15, 33, 40],
    coldNumbers: [8, 16, 29, 31, 37, 41, 19],
    primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43],
    corners: [1, 2, 8, 9, 6, 7, 13, 14, 29, 30, 36, 37, 34, 35, 41, 42],
    twins: [11, 22, 33, 44],
    mirrors: [12, 21, 13, 31, 14, 41, 23, 32, 24, 42, 34, 43]
};

// UI Elements
const btnGenerate = document.getElementById('btnGenerate');
const btnGacha = document.getElementById('btnGacha');
const logContent = document.getElementById('logContent');
const ballContainer = document.getElementById('ballContainer');
const probValue = document.getElementById('probValue');

// Filter IDs matching HTML
const FILTER_IDS = [
    'sum', 'ac', 'oddeven', 'highlow', 'endsum', 'prime', 'mul3',
    'hot', 'cold', 'carryover', 'missing', 'serial', 'lastdigit', 'excludelast',
    'consecutive', 'corner', 'section', 'twin', 'mirror', 'symmetry', 'diagonal', 'ai'
];

const filterMap = {};
FILTER_IDS.forEach(id => {
    filterMap[id] = document.getElementById(`f_${id}`);
});

/**
 * Filter Engine
 */
class LottoEngine {
    static validate(nums) {
        // 1. Sum (100-175)
        if (filterMap.sum.checked) {
            const sum = nums.reduce((a, b) => a + b, 0);
            if (sum < 100 || sum > 175) return { pass: false, log: "SUM_ERR: " + sum };
        }

        // 2. AC Value (>=7)
        if (filterMap.ac.checked) {
            let diffs = new Set();
            for (let i = 0; i < nums.length; i++) {
                for (let j = i + 1; j < nums.length; j++) diffs.add(Math.abs(nums[i] - nums[j]));
            }
            const ac = diffs.size - 5;
            if (ac < 7) return { pass: false, log: "AC_LOW: " + ac };
        }

        // 3. Odd/Even (2:4, 3:3, 4:2)
        if (filterMap.oddeven.checked) {
            const odds = nums.filter(n => n % 2 !== 0).length;
            if (odds < 2 || odds > 4) return { pass: false, log: "ODD_EVEN_IMBALANCE: " + odds };
        }

        // 4. High/Low (2:4, 3:3, 4:2) -> High is 23-45
        if (filterMap.highlow.checked) {
            const high = nums.filter(n => n >= 23).length;
            if (high < 2 || high > 4) return { pass: false, log: "HIGH_LOW_IMBALANCE: " + high };
        }

        // 5. End Digit Sum (20-35)
        if (filterMap.endsum.checked) {
            const endSum = nums.reduce((a, b) => a + (b % 10), 0);
            if (endSum < 20 || endSum > 35) return { pass: false, log: "END_SUM_ERR: " + endSum };
        }

        // 6. Primes (1-3)
        if (filterMap.prime.checked) {
            const count = nums.filter(n => MOCK_DATA.primes.includes(n)).length;
            if (count < 1 || count > 3) return { pass: false, log: "PRIME_COUNT_ERR: " + count };
        }

        // 7. Multiple of 3 (1-3)
        if (filterMap.mul3.checked) {
            const count = nums.filter(n => n % 3 === 0).length;
            if (count < 1 || count > 3) return { pass: false, log: "MUL3_COUNT_ERR: " + count };
        }

        // 8. Hot Numbers (>=1)
        if (filterMap.hot.checked) {
            if (!nums.some(n => MOCK_DATA.hotNumbers.includes(n))) return { pass: false, log: "HOT_MISSING" };
        }

        // 9. Cold Numbers (>=1)
        if (filterMap.cold.checked) {
            if (!nums.some(n => MOCK_DATA.coldNumbers.includes(n))) return { pass: false, log: "COLD_MISSING" };
        }

        // 10. Carryover (0-2)
        if (filterMap.carryover.checked) {
            const lastWin = MOCK_DATA.recentWins[0];
            const count = nums.filter(n => lastWin.includes(n)).length;
            if (count > 2) return { pass: false, log: "CARRYOVER_EXCESS: " + count };
        }

        // 13. Last Digit Limit (Max 2 same last digits)
        if (filterMap.lastdigit.checked) {
            const ends = nums.map(n => n % 10);
            const counts = {};
            for(let e of ends) {
                counts[e] = (counts[e] || 0) + 1;
                if (counts[e] > 2) return { pass: false, log: "SAME_LAST_DIGIT_ERR" };
            }
        }

        // 14. Exclude Last Win (Completely)
        if (filterMap.excludelast.checked) {
            const lastWin = MOCK_DATA.recentWins[0];
            const isMatch = nums.every((n, i) => n === lastWin[i]);
            if (isMatch) return { pass: false, log: "LAST_WIN_MATCH" };
        }

        // 15. Consecutive Limit (Max 2)
        if (filterMap.consecutive.checked) {
            let max = 1, curr = 1;
            for (let i = 1; i < nums.length; i++) {
                if (nums[i] === nums[i-1] + 1) curr++;
                else { max = Math.max(max, curr); curr = 1; }
            }
            if (Math.max(max, curr) > 2) return { pass: false, log: "CONSECUTIVE_LIMIT" };
        }

        // 16. Corner Check
        if (filterMap.corner.checked) {
            const count = nums.filter(n => MOCK_DATA.corners.includes(n)).length;
            if (count < 1) return { pass: false, log: "CORNER_MISSING" };
        }

        // 18. Twin Check (11, 22, 33, 44)
        if (filterMap.twin.checked) {
            const count = nums.filter(n => MOCK_DATA.twins.includes(n)).length;
            if (count > 1) return { pass: false, log: "TWIN_EXCESS" };
        }

        // 19. Mirror Check
        if (filterMap.mirror.checked) {
            const count = nums.filter(n => MOCK_DATA.mirrors.includes(n)).length;
            if (count > 2) return { pass: false, log: "MIRROR_EXCESS" };
        }

        // 17. Section Balance (Min 4 sections covered)
        if (filterMap.section.checked) {
            const sections = new Set(nums.map(n => Math.floor((n-1)/10)));
            if (sections.size < 4) return { pass: false, log: "SECTION_IMBALANCE" };
        }

        // 20. Symmetry (Around 23)
        if (filterMap.symmetry.checked) {
            const balanced = nums.filter(n => n < 23).length;
            if (balanced < 2 || balanced > 4) return { pass: false, log: "SYMMETRY_ERR" };
        }

        // 21. Diagonal Pattern (7x7 grid check)
        if (filterMap.diagonal.checked) {
            const positions = nums.map(n => ({ r: Math.floor((n-1)/7), c: (n-1)%7 }));
            const diags = positions.filter(p => p.r === p.c || p.r + p.c === 6).length;
            if (diags < 1) return { pass: false, log: "DIAGONAL_PATTERN_MISSING" };
        }

        // 11. Missing Numbers
        if (filterMap.missing.checked) {
            const missing = [5, 17, 26, 38, 44]; // Mock missing
            if (!nums.some(n => missing.includes(n))) return { pass: false, log: "MISSING_NUM_REQUIRED" };
        }

        // 12. Serial (Same ending pattern)
        if (filterMap.serial.checked) {
            const ends = nums.map(n => n % 10);
            const uniqueEnds = new Set(ends).size;
            if (uniqueEnds > 5) return { pass: false, log: "SERIAL_PATTERN_WEAK" };
        }

        // 22. AI Optimization
        if (filterMap.ai.checked) {
            if (Math.random() < 0.05) return { pass: false, log: "AI_DIVERGENCE_REJECT" };
        }

        return { pass: true };
    }
}

/**
 * Controller
 */
function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    logContent.appendChild(p);
    logContent.scrollTop = logContent.scrollHeight;
}

async function runAnalysis() {
    btnGenerate.disabled = true;
    addLog("DEEP ANALYSIS INITIATED...", "warn");
    
    let attempts = 0;
    let candidate = null;
    const startTime = Date.now();

    // Fake Real-time probability update
    const probInterval = setInterval(() => {
        const val = (Math.random() * 0.0005).toFixed(6);
        probValue.textContent = `${val}%`;
    }, 100);

    // Ball Animation
    const ballInterval = setInterval(() => {
        document.querySelectorAll('.ball').forEach(el => {
            el.textContent = Math.floor(Math.random() * 45) + 1;
        });
    }, 50);

    // Actual Calculation
    while (attempts < 20000) {
        attempts++;
        let nums = [];
        while(nums.length < 6) {
            let n = Math.floor(Math.random() * 45) + 1;
            if(!nums.includes(n)) nums.push(n);
        }
        nums.sort((a,b) => a - b);

        const result = LottoEngine.validate(nums);
        if (result.pass) {
            candidate = nums;
            break;
        } else if (attempts % 1000 === 0) {
            addLog(`CHECKPOINT: ${attempts} ITERATIONS...`, "info");
        }
    }

    clearInterval(probInterval);
    clearInterval(ballInterval);

    if (candidate) {
        addLog(`OPTIMAL BUNDLE FOUND. Iterations: ${attempts}`, "success");
        candidate.forEach((n, i) => {
            const el = document.querySelector(`.ball[data-index="${i+1}"]`);
            el.textContent = n;
            el.style.borderColor = getBallColor(n);
            el.style.color = getBallColor(n);
            el.style.boxShadow = `0 0 15px ${getBallColor(n)}`;
        });
        probValue.textContent = (Math.random() * 0.0008).toFixed(6) + "%";
    } else {
        addLog("ANALYSIS FAILED TO CONVERGE. ADJUST FILTERS.", "error");
        probValue.textContent = "0.000000%";
    }

    btnGenerate.disabled = false;
}

function getBallColor(n) {
    if (n <= 10) return "#fbc400";
    if (n <= 20) return "#69c8f2";
    if (n <= 30) return "#ff7272";
    if (n <= 40) return "#aaaaaa";
    return "#b0d840";
}

// Preset Handlers
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const p = btn.dataset.preset;
        Object.values(filterMap).forEach(cb => cb.checked = false);
        
        if (p === 'golden') {
            ['sum', 'ac', 'oddeven', 'highlow', 'hot', 'consecutive', 'ai'].forEach(k => filterMap[k].checked = true);
        } else if (p === 'aggressive') {
            ['ac', 'prime', 'cold', 'corner', 'mirror'].forEach(k => filterMap[k].checked = true);
        } else if (p === 'defensive') {
            ['sum', 'oddeven', 'hot', 'carryover', 'section', 'ai'].forEach(k => filterMap[k].checked = true);
        }
        addLog(`PRESET_LOADED: ${p.toUpperCase()}`);
    });
});

// Gacha Logic
btnGacha.addEventListener('click', async () => {
    btnGacha.classList.add('active');
    addLog("GACHA_MODE: RANDOMIZING FILTERS...", "warn");
    
    // Clear all
    Object.values(filterMap).forEach(cb => cb.checked = false);
    
    // Randomly select 5-8 filters
    let shuffled = FILTER_IDS.sort(() => 0.5 - Math.random());
    let count = 5 + Math.floor(Math.random() * 4);
    let selected = shuffled.slice(0, count);
    
    // Animation effect
    for(let i = 0; i < 15; i++) {
        let randomId = FILTER_IDS[Math.floor(Math.random() * FILTER_IDS.length)];
        filterMap[randomId].parentElement.style.boxShadow = "0 0 10px #ff00ff";
        await new Promise(r => setTimeout(r, 50));
        filterMap[randomId].parentElement.style.boxShadow = "none";
    }

    selected.forEach(id => {
        filterMap[id].checked = true;
    });

    addLog(`GACHA_COMPLETE: ${count} FILTERS ACTIVATED.`);
    btnGacha.classList.remove('active');
    
    // Auto-run analysis after gacha
    setTimeout(runAnalysis, 500);
});

btnGenerate.addEventListener('click', runAnalysis);
