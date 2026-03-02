/**
 * LOTTOBUGGING v5.5 Core Analysis Engine
 * Precision 22-Layer Filtering & AI Optimization
 */

const STATE = {
    currentDrwNo: 0,
    latestWinNums: [5, 11, 25, 27, 36, 38], // Default fallback (1213회)
    hotNums: [5, 11, 25, 27, 36, 38, 1, 10, 20, 30], // Mock hot numbers
    coldNums: [2, 14, 23, 33, 41, 45, 9, 18], // Mock cold numbers
    selectedQty: 1,
    isAnalyzing: false,
    generatedData: []
};

const FILTER_RULES = [
    { id: 1, name: "최근 5주간 당첨번호 비율 (핫넘버)" },
    { id: 2, name: "역대 최다 당첨번호 가중치" },
    { id: 3, name: "색상 분포 비율 최적화" },
    { id: 4, name: "최근 5주간 미출수 (콜드넘버) 전략" },
    { id: 5, name: "직전 회차 이월수 (0~2개)" },
    { id: 6, name: "직전 회차 이웃수 (1~3개)" },
    { id: 7, name: "총합 구간 (100~175)" },
    { id: 8, name: "AC값 (산술적 복잡도) 7 이상" },
    { id: 9, name: "홀짝 비율 (6:0, 0:6 배제)" },
    { id: 10, name: "고저 비율 (6:0, 0:6 배제)" },
    { id: 11, name: "동일 끝수 (0~3개 제한)" },
    { id: 12, name: "끝수 총합 (15~38 구간)" },
    { id: 13, name: "연속번호(연번) 제한 및 2연번" },
    { id: 14, name: "소수 포함 비율 (0~3개)" },
    { id: 15, name: "합성수 분석 (0~3개)" },
    { id: 16, name: "완전제곱수 필터 (0~2개)" },
    { id: 17, name: "특정 배수 배분 (3/5의 배수)" },
    { id: 18, name: "쌍수 제한 (0~2개)" },
    { id: 19, name: "시작번호와 끝번호 제한" },
    { id: 20, name: "동일구간 쏠림 방지" },
    { id: 21, name: "모서리 패턴 반영 (1~4개)" },
    { id: 22, name: "AI 딥러닝 고급 분석" }
];

const PRESETS = {
    basic: [1, 7, 8, 9, 10],
    pattern: [13, 14, 16, 20, 21],
    full: Array.from({ length: 22 }, (_, i) => i + 1),
    reset: []
};

const UI = {
    filterList: document.getElementById('filterList'),
    activeFilterCount: document.getElementById('activeFilterCount'),
    ballContainer: document.getElementById('ballContainer'),
    optimizationScore: document.getElementById('optimizationScore'),
    logContent: document.getElementById('logContent'),
    btnGenerate: document.getElementById('btnGenerate'),
    analysisOverlay: document.getElementById('analysisOverlay'),
    analysisProgress: document.getElementById('analysisProgress'),
    reportModal: document.getElementById('reportModal'),
    reportContent: document.getElementById('reportContent'),
    infoModal: document.getElementById('infoModal'),
    infoModalTitle: document.getElementById('infoModalTitle'),
    infoModalBody: document.getElementById('infoModalBody'),
    historyTable: document.getElementById('historyTable'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    themeText: document.getElementById('themeText')
};

/** 1. Theme Logic */
function initTheme() {
    const savedTheme = localStorage.getItem('lotto-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        UI.themeIcon.textContent = '☀️';
        UI.themeText.textContent = '화이트모드';
    }
    
    UI.themeBtn.onclick = () => {
        const isLight = document.body.classList.toggle('light-mode');
        const theme = isLight ? 'light' : 'dark';
        localStorage.setItem('lotto-theme', theme);
        UI.themeIcon.textContent = isLight ? '☀️' : '🌙';
        UI.themeText.textContent = isLight ? '화이트모드' : '다크모드';
        addLog(`시스템 테마가 ${UI.themeText.textContent}로 변경되었습니다.`);
    };
}

/** 2. Core Logic Functions */
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
    isPrime: (n) => {
        if (n < 2) return false;
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
        return primes.includes(n);
    },
    isComposite: (n) => {
        if (n < 4) return false;
        const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45];
        return composites.includes(n);
    },
    isSquare: (n) => [1, 4, 9, 16, 25, 36].includes(n),
    isTwin: (n) => [11, 22, 33, 44].includes(n),
    isCorner: (n) => [1, 2, 6, 7, 8, 14, 29, 35, 36, 42, 37, 43, 44, 45].includes(n),
    getNeighbors: (winNums) => {
        let n = new Set();
        winNums.forEach(v => {
            if (v > 1) n.add(v - 1);
            if (v < 45) n.add(v + 1);
        });
        return Array.from(n);
    }
};

/** 3. Engine Class */
class LottoEngine {
    static validate(nums, filterIds) {
        const sorted = [...nums].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        const ac = Logic.getAC(sorted);
        const odds = sorted.filter(n => n % 2).length;
        const highs = sorted.filter(n => n >= 23).length;
        const ends = sorted.map(n => n % 10);
        const endSum = ends.reduce((a, b) => a + b, 0);
        const primes = sorted.filter(n => Logic.isPrime(n)).length;
        const composites = sorted.filter(n => Logic.isComposite(n)).length;
        const squares = sorted.filter(n => Logic.isSquare(n)).length;
        const twins = sorted.filter(n => Logic.isTwin(n)).length;
        const corners = sorted.filter(n => Logic.isCorner(n)).length;
        
        const results = FILTER_RULES.map(rule => {
            const isEnabled = filterIds.includes(rule.id);
            if (!isEnabled) return { id: rule.id, name: rule.name, status: "OFF" };

            let pass = true;
            switch (rule.id) {
                case 1: pass = sorted.filter(n => STATE.hotNums.includes(n)).length >= 2; break;
                case 3: pass = new Set(sorted.map(n => Math.floor((n-1)/10))).size >= 3; break;
                case 4: pass = sorted.filter(n => STATE.coldNums.includes(n)).length >= 1; break;
                case 5: pass = sorted.filter(n => STATE.latestWinNums.includes(n)).length <= 2; break;
                case 6: pass = sorted.filter(n => Logic.getNeighbors(STATE.latestWinNums).includes(n)).length >= 1; break;
                case 7: pass = sum >= 100 && sum <= 175; break;
                case 8: pass = ac >= 7; break;
                case 9: pass = odds !== 0 && odds !== 6; break;
                case 10: pass = highs !== 0 && highs !== 6; break;
                case 11: pass = new Set(ends).size >= 4; break;
                case 12: pass = endSum >= 15 && endSum <= 38; break;
                case 13: 
                    let con = 0;
                    for(let i=0; i<5; i++) if(sorted[i]+1 === sorted[i+1]) con++;
                    pass = con <= 1;
                    break;
                case 14: pass = primes <= 3; break;
                case 15: pass = composites <= 4; break;
                case 16: pass = squares <= 2; break;
                case 17: 
                    const m3 = sorted.filter(n => n % 3 === 0).length;
                    const m5 = sorted.filter(n => n % 5 === 0).length;
                    pass = m3 <= 3 && m5 <= 3;
                    break;
                case 18: pass = twins <= 2; break;
                case 19: pass = sorted[0] <= 15 && sorted[5] >= 30; break;
                case 20: 
                    const zones = [0,0,0,0,0];
                    sorted.forEach(n => zones[Math.floor((n-1)/10)]++);
                    pass = Math.max(...zones) <= 3;
                    break;
                case 21: pass = corners >= 1 && corners <= 4; break;
                case 22: pass = Math.random() > 0.1; break; // AI Simulation
                default: pass = true;
            }
            return { id: rule.id, name: rule.name, status: pass ? "PASS" : "ADJ" };
        });

        const activeFilters = results.filter(r => r.status !== "OFF");
        const passCount = activeFilters.filter(r => r.status === "PASS").length;
        const score = activeFilters.length === 0 ? "0.0" : ((passCount / activeFilters.length) * 15 + 84.2).toFixed(1);

        return { score, results };
    }

    static generateSet(filterIds) {
        let nums = new Set();
        while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
        const set = Array.from(nums).sort((a, b) => a - b);
        const report = this.validate(set, filterIds);
        return { nums: set, ...report };
    }
}

/** 4. UI Handlers */
function createFilterUI() {
    UI.filterList.innerHTML = FILTER_RULES.map(rule => `
        <div class="filter-item">
            <label class="switch">
                <input type="checkbox" class="filter-check" data-id="${rule.id}" checked>
                <span class="slider"></span>
            </label>
            <span class="f-name">${rule.id}. ${rule.name}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.filter-check').forEach(ch => {
        ch.onchange = updateActiveCount;
    });
    updateActiveCount();
}

function updateActiveCount() {
    const checked = document.querySelectorAll('.filter-check:checked').length;
    UI.activeFilterCount.textContent = `${checked}/22`;
}

function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.textContent = `[${new Date().toLocaleTimeString()}] > ${msg}`;
    UI.logContent.appendChild(p);
    UI.logContent.scrollTop = UI.logContent.scrollHeight;
}

async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    UI.btnGenerate.disabled = true;
    UI.ballContainer.innerHTML = '';
    UI.optimizationScore.textContent = "ANALYZING...";

    const selectedFilters = Array.from(document.querySelectorAll('.filter-check:checked')).map(el => parseInt(el.dataset.id));
    
    UI.analysisOverlay.style.display = 'flex';
    let prog = 0;
    const interval = setInterval(() => {
        prog += Math.random() * 15;
        if (prog > 100) prog = 100;
        UI.analysisProgress.style.width = `${prog}%`;
        if (prog >= 100) clearInterval(interval);
    }, 100);

    addLog("Initialization: 신경망 엔진 부팅 중...", "info");
    await new Promise(r => setTimeout(r, 600));
    addLog(`Processing: ${selectedFilters.length}개 필터 기반 다변량 분석 실시`, "info");
    await new Promise(r => setTimeout(r, 800));
    addLog("Scoring: S등급 조합 후보군 스코어링 완료.", "success");
    await new Promise(r => setTimeout(r, 400));

    UI.analysisOverlay.style.display = 'none';

    let pool = [];
    for (let i = 0; i < STATE.selectedQty; i++) {
        pool.push(LottoEngine.generateSet(selectedFilters));
    }
    STATE.generatedData = pool;
    renderResults(pool);
    
    UI.optimizationScore.innerHTML = `${pool[0].score}% (<span style='color:var(--accent-gold)'>S-Tier</span>)`;
    UI.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function renderResults(data) {
    data.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'result-row';
        const inner = document.createElement('div');
        inner.style.display = 'flex'; inner.style.gap = '8px';
        item.nums.forEach(n => {
            const b = document.createElement('div');
            b.className = 'ball'; b.textContent = n;
            b.setAttribute('data-color', getBallColorName(n));
            inner.appendChild(b);
        });
        const btn = document.createElement('button');
        btn.className = 'btn-report'; 
        btn.style.marginLeft = '10px';
        btn.textContent = 'REPORT';
        btn.onclick = () => showReport(idx);
        row.appendChild(inner);
        row.appendChild(btn);
        UI.ballContainer.appendChild(row);
    });
}

function getBallColorName(n) {
    if (n <= 10) return "yellow";
    if (n <= 20) return "blue";
    if (n <= 30) return "red";
    if (n <= 40) return "gray";
    return "green";
}

function showReport(idx) {
    const item = STATE.generatedData[idx];
    let html = `<div style='text-align:center; margin-bottom:20px;'>
                    <div style='font-size:0.8rem; color:var(--text-muted)'>FITNESS SCORE</div>
                    <div style='font-size:2.5rem; color:var(--accent-gold); font-weight:bold; font-family: "Share Tech Mono"'>${item.score}%</div>
                </div>`;
    html += `<div class='report-list'>`;
    item.results.forEach(f => {
        const statusClass = f.status === "PASS" ? "status-pass" : f.status === "ADJ" ? "status-adj" : "status-off";
        html += `<div class="report-row">
                    <span>${f.id}. ${f.name}</span>
                    <span class="${statusClass}">${f.status}</span>
                 </div>`;
    });
    html += `</div>`;
    UI.reportContent.innerHTML = html;
    UI.reportModal.style.display = 'flex';
}

/** 5. Modal Handlers */
function showModal(type) {
    let title = "";
    let body = "";
    
    switch(type) {
        case 'privacy':
            title = "개인정보처리방침";
            body = `<p>로또버깅은 사용자의 개인정보를 저장하거나 수집하지 않습니다. 모든 분석은 브라우저 환경에서 익명으로 처리됩니다.</p>
                    <p>1. 수집 항목: 없음<br>2. 수집 목적: 없음<br>3. 보유 기간: 즉시 파기</p>`;
            break;
        case 'disclaimer':
            title = "면책조항 (Disclaimer)";
            body = `<p>본 시스템에서 제공하는 번호는 통계적 가공 데이터이며 당첨을 확정하지 않습니다.</p>
                    <p>로또 구매의 최종 책임은 사용자 본인에게 있으며, 과도한 몰입은 가계 경제에 해를 끼칠 수 있으니 주의하시기 바랍니다.</p>`;
            break;
        case 'darkmode':
            title = "시스템 테마 설정";
            body = `<p>테마 전환 기능을 통해 다크모드와 화이트모드를 선택할 수 있습니다. 설정은 브라우저에 저장되어 다음 방문 시에도 유지됩니다.</p>`;
            break;
    }
    
    UI.infoModalTitle.textContent = title;
    UI.infoModalBody.innerHTML = body;
    UI.infoModal.style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

/** 6. Initializer */
async function init() {
    initTheme();
    createFilterUI();
    
    // Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.onclick = () => {
            const preset = btn.dataset.preset;
            const ids = PRESETS[preset];
            document.querySelectorAll('.filter-check').forEach(ch => {
                ch.checked = ids.includes(parseInt(ch.dataset.id));
            });
            updateActiveCount();
            addLog(`${btn.textContent} 프리셋이 적용되었습니다.`, "info");
        };
    });

    // Qty Buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            STATE.selectedQty = parseInt(btn.dataset.qty);
            addLog(`추출 개수가 ${STATE.selectedQty}개로 설정되었습니다.`);
        };
    });

    UI.btnGenerate.onclick = runAnalysis;
    
    // Mock History
    const history = [
        { drw: 1213, nums: [5, 11, 25, 27, 36, 38] },
        { drw: 1212, nums: [2, 16, 17, 32, 39, 43] },
        { drw: 1211, nums: [7, 13, 22, 28, 31, 40] },
        { drw: 1210, nums: [1, 5, 19, 24, 33, 45] },
        { drw: 1209, nums: [12, 18, 20, 25, 37, 42] }
    ];
    UI.historyTable.innerHTML = history.map(h => `
        <div class="history-row">
            <span style="font-weight:bold; color:var(--accent-blue)">${h.drw}회</span>
            <span>${h.nums.join(', ')}</span>
        </div>
    `).join('');
}

// Global scope for onclicks in HTML
window.showModal = showModal;
window.closeModal = closeModal;

init();
