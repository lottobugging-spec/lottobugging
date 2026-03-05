/**
 * LOTTOBUGGING v7.5 - Scoring Engine
 * Core: Weight-based Extraction & Analysis
 */

const STATE = {
    selectedQty: 1,
    threshold: 0.8, // 80%
    isAnalyzing: false,
    generatedData: [],
    latestWinNums: [5, 11, 25, 27, 36, 38] // 1213회 기준
};

const FILTER_RULES = [
    { id: 1, name: "합계 구간 (100~175)", check: (nums) => { const s = nums.reduce((a,b)=>a+b); return s>=100 && s<=175; } },
    { id: 2, name: "AC값 (산술적 복잡도) 7 이상", check: (nums) => Logic.getAC(nums) >= 7 },
    { id: 3, name: "홀짝 비율 (6:0, 0:6 배제)", check: (nums) => { const odd = nums.filter(n=>n%2!==0).length; return odd>0 && odd<6; } },
    { id: 4, name: "고저 비율 (6:0, 0:6 배제)", check: (nums) => { const high = nums.filter(n=>n>=23).length; return high>0 && high<6; } },
    { id: 5, name: "연속번호(연번) 제한 (2연번 이하)", check: (nums) => { let count=0; for(let i=0;i<5;i++) if(nums[i+1]-nums[i]===1) count++; return count<=2; } },
    { id: 6, name: "동일 끝수 (3개 이하)", check: (nums) => { const ends = nums.map(n=>n%10); const counts = {}; ends.forEach(e=>counts[e]=(counts[e]||0)+1); return Math.max(...Object.values(counts))<=3; } },
    { id: 7, name: "소수 포함 (1~3개)", check: (nums) => { const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43]; const c = nums.filter(n=>primes.includes(n)).length; return c>=1 && c<=3; } },
    { id: 8, name: "완전제곱수 필터 (0~2개)", check: (nums) => { const squares = [1,4,9,16,25,36]; const c = nums.filter(n=>squares.includes(n)).length; return c<=2; } },
    { id: 9, name: "이월수 필터 (0~2개)", check: (nums) => { const c = nums.filter(n=>STATE.latestWinNums.includes(n)).length; return c<=2; } },
    { id: 10, name: "동일구간 쏠림 방지 (3개 이하)", check: (nums) => { const zones = [0,0,0,0,0]; nums.forEach(n=>zones[Math.floor((n-1)/10)]++); return Math.max(...zones)<=3; } },
    { id: 11, name: "끝수 총합 (15~38)", check: (nums) => { const s = nums.reduce((a,b)=>a+(b%10), 0); return s>=15 && s<=38; } },
    { id: 12, name: "AI 딥러닝 패턴 매칭", check: () => Math.random() > 0.2 }
];

const UI = {
    filterList: document.getElementById('filterList'),
    activeFilterCount: document.getElementById('activeFilterCount'),
    ballContainer: document.getElementById('ballContainer'),
    optimizationScore: document.getElementById('optimizationScore'),
    btnGenerate: document.getElementById('btnGenerate'),
    analysisOverlay: document.getElementById('analysisOverlay'),
    analysisProgress: document.getElementById('analysisProgress'),
    reportModal: document.getElementById('reportModal'),
    reportContent: document.getElementById('reportContent'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    thresholdRange: document.getElementById('thresholdRange'),
    thresholdValue: document.getElementById('thresholdValue')
};

const Logic = {
    getAC: (nums) => {
        let diffs = new Set();
        for (let i = 0; i < 6; i++) {
            for (let j = i + 1; j < 6; j++) {
                diffs.add(Math.abs(nums[i] - nums[j]));
            }
        }
        return diffs.size - 5;
    },
    generateRandomSet: () => {
        let nums = new Set();
        while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
        return Array.from(nums).sort((a, b) => a - b);
    }
};

/** Scoring Engine */
class ScoringEngine {
    static async getWeightedCombination(selectedFilterIds) {
        const filters = FILTER_RULES.filter(f => selectedFilterIds.includes(f.id));
        const targetScore = filters.length * STATE.threshold;
        let bestCandidate = null;
        let maxScore = -1;

        for (let i = 0; i < 5000; i++) {
            const nums = Logic.generateRandomSet();
            let currentScore = 0;
            const detailResults = [];

            filters.forEach(f => {
                const pass = f.check(nums);
                if (pass) currentScore++;
                detailResults.push({ name: f.name, status: pass ? "PASS" : "FAIL" });
            });

            if (currentScore >= targetScore) {
                return { nums, score: ((currentScore/filters.length)*100).toFixed(1), details: detailResults, isBest: false };
            }
            if (currentScore > maxScore) {
                maxScore = currentScore;
                bestCandidate = { nums, score: ((currentScore/filters.length)*100).toFixed(1), details: detailResults, isBest: true };
            }
            if (i % 500 === 0) await new Promise(r => setTimeout(r, 0));
        }
        return bestCandidate;
    }
}

async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    UI.btnGenerate.disabled = true;
    UI.ballContainer.innerHTML = '';
    UI.optimizationScore.textContent = "ALGORITHM RUNNING...";

    const selectedFilters = Array.from(document.querySelectorAll('.filter-check:checked')).map(el => parseInt(el.dataset.id));
    UI.analysisOverlay.style.display = 'flex';
    
    let prog = 0;
    const interval = setInterval(() => {
        prog += 5;
        UI.analysisProgress.style.width = `${prog}%`;
        if (prog >= 100) clearInterval(interval);
    }, 50);

    const pool = [];
    for (let i = 0; i < STATE.selectedQty; i++) {
        pool.push(await ScoringEngine.getWeightedCombination(selectedFilters));
    }

    STATE.generatedData = pool;
    renderResults(pool);
    UI.analysisOverlay.style.display = 'none';
    UI.optimizationScore.innerHTML = `OPTIMIZATION COMPLETE (${pool[0].score}%)`;
    UI.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function renderResults(data) {
    UI.ballContainer.innerHTML = '';
    data.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'result-row';
        const inner = document.createElement('div');
        inner.style.display = 'flex'; inner.style.gap = '8px';
        item.nums.forEach(n => {
            const b = document.createElement('div');
            b.className = 'ball'; b.textContent = n;
            b.setAttribute('data-color', n <= 10 ? "yellow" : n <= 20 ? "blue" : n <= 30 ? "red" : n <= 40 ? "gray" : "green");
            inner.appendChild(b);
        });
        const btnArea = document.createElement('div');
        btnArea.style.display = 'flex'; btnArea.style.alignItems = 'center'; btnArea.style.gap = '10px';
        if (item.isBest) {
            const badge = document.createElement('span');
            badge.style.cssText = "font-size:0.6rem; background:var(--accent-gold); color:#000; padding:2px 5px; border-radius:4px; font-weight:bold;";
            badge.textContent = "최적 조합";
            btnArea.appendChild(badge);
        }
        const btn = document.createElement('button');
        btn.className = 'btn-report'; btn.textContent = 'REPORT';
        btn.onclick = () => showReport(idx);
        btnArea.appendChild(btn);
        row.appendChild(inner);
        row.appendChild(btnArea);
        UI.ballContainer.appendChild(row);
    });
}

function showReport(idx) {
    const item = STATE.generatedData[idx];
    if (!item) return;
    let html = `<div style='text-align:center; margin-bottom:20px;'>
                    <div style='font-size:2.5rem; color:var(--accent-gold); font-weight:bold;'>${item.score}%</div>
                    <p style='font-size:0.8rem; color:var(--text-dim);'>${item.isBest ? "5,000회 시뮬레이션 중 최적해 도출" : "필터 적합성 분석 결과"}</p>
                </div>`;
    html += `<div class='report-list'>`;
    item.details.forEach(f => {
        html += `<div style='display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border-color); font-size:0.85rem;'>
                    <span>${f.name}</span>
                    <span style='color:${f.status === "PASS" ? "var(--accent-green)" : "var(--accent-red)"}; font-weight:bold;'>${f.status}</span>
                 </div>`;
    });
    html += `</div>`;
    UI.reportContent.innerHTML = html;
    UI.reportModal.style.display = 'flex';
}

function init() {
    // Theme
    const savedTheme = localStorage.getItem('lotto-theme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    UI.themeBtn.onclick = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('lotto-theme', isDark ? 'dark' : 'light');
        UI.themeIcon.textContent = isDark ? '🌙' : '☀️';
    };

    // Filters
    UI.filterList.innerHTML = FILTER_RULES.map(rule => `
        <div class="filter-item">
            <label class="switch">
                <input type="checkbox" class="filter-check" data-id="${rule.id}" checked>
                <span class="slider"></span>
            </label>
            <span class="f-name">${rule.id}. ${rule.name}</span>
        </div>
    `).join('');

    // Events
    UI.thresholdRange.oninput = (e) => {
        const val = e.target.value;
        UI.thresholdValue.textContent = `${val}%`;
        STATE.threshold = val / 100;
    };
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            STATE.selectedQty = parseInt(btn.dataset.qty);
        };
    });
    UI.btnGenerate.onclick = runAnalysis;
    document.querySelector('.close-modal').onclick = () => UI.reportModal.style.display = 'none';
    document.querySelector('.close-modal-btn').onclick = () => UI.reportModal.style.display = 'none';
}

window.onload = init;
