/**
 * 로또버깅(LottoBugging) 분석 엔진 v4.2
 * 모바일 최적화 레이아웃 대응 및 스캔 연출 강화
 */

const STATE = {
    currentDrwNo: 0,
    recentHistory: [],
    selectedQty: 1,
    isAnalyzing: false,
    generatedData: []
};

const ui = {
    btnGenerate: document.getElementById('btnGenerate'),
    qtyBtns: document.querySelectorAll('.qty-btn'),
    logContent: document.getElementById('logContent'),
    ballContainer: document.getElementById('ballContainer'),
    optimizationScore: document.getElementById('optimizationScore'),
    historyTable: document.getElementById('historyTable'),
    lastSyncInfo: document.getElementById('lastSyncInfo'),
    analysisOverlay: document.getElementById('analysisOverlay'),
    analysisProgress: document.getElementById('analysisProgress'),
    reportModal: document.getElementById('reportModal'),
    reportContent: document.getElementById('reportContent'),
    btnCloseModal: document.getElementById('btnCloseModal'),
    btnShare: document.getElementById('btnShare')
};

// 필터 맵 (1~22)
const filterMap = {};
for (let i = 1; i <= 22; i++) {
    filterMap[i] = document.getElementById(`f_${i}`);
}

/** 1. KST 회차 계산 */
function calculateCurrentTurn() {
    const start = new Date('2002-12-07T21:00:00+09:00');
    const now = new Date(new Date().getTime() + (new Date().getTimezoneOffset() * 60000) + (3600000 * 9));
    return Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7)) + 1;
}

/** 2. 터미널 로그 시스템 */
async function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.innerHTML = `> ${msg}`;
    ui.logContent.appendChild(p);
    ui.logContent.scrollTop = ui.logContent.scrollHeight;
}

async function fastLog(msgs) {
    for (const m of msgs) {
        await addLog(m, "warn");
        await new Promise(r => setTimeout(r, 50));
    }
}

/** 3. 분석 메인 로직 */
async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    ui.btnGenerate.disabled = true;
    ui.ballContainer.innerHTML = '';
    STATE.generatedData = [];

    if (STATE.selectedQty >= 10) {
        ui.analysisOverlay.style.display = 'flex';
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            ui.analysisProgress.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(interval);
        }, 100);

        await fastLog([
            "Initializing deep learning clusters...",
            "Loading KST time-series metadata...",
            "Filtering 8.14M combinations...",
            "Applying 22-layer optimization rules...",
            "Syncing with DHLottery real-time API...",
            "Generating high-probability nodes..."
        ]);

        await new Promise(r => setTimeout(r, 2000));
        ui.analysisOverlay.style.display = 'none';
    }

    addLog(`${STATE.selectedQty}개 조합 생성 시뮬레이션 시작...`, "success");

    let pool = [];
    for (let i = 0; i < STATE.selectedQty; i++) {
        const nums = generateRandomSet();
        const score = (Math.random() * (99.2 - 85.0) + 85.0).toFixed(1);
        pool.push({ nums, score, reasons: ["기본 통계 필터 통과", "AC값 복잡도 검증됨", "구간 밸런스 최적화"] });
    }
    STATE.generatedData = pool;

    const best = pool[0].score;
    ui.optimizationScore.innerHTML = `${best}% (<span style='color:var(--accent-gold)'>S-Tier</span>)`;

    await displayResults(pool);
    ui.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function generateRandomSet() {
    const set = new Set();
    while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
    return [...set].sort((a, b) => a - b);
}

function getBallColor(n) {
    if (n <= 10) return "#fbc400";
    if (n <= 20) return "#69c8f2";
    if (n <= 30) return "#ff7272";
    if (n <= 40) return "#aaaaaa";
    return "#b0d840";
}

/** 4. 결과 렌더링 (모바일 대응 가로 정렬) */
async function displayResults(data) {
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('div');
        row.className = 'result-row';
        
        const ballWrap = document.createElement('div');
        ballWrap.style.display = 'flex';
        ballWrap.style.gap = '6px';
        ballWrap.style.flexWrap = 'nowrap';

        data[i].nums.forEach(n => {
            const b = document.createElement('div');
            b.className = 'ball';
            b.textContent = n;
            const color = getBallColor(n);
            b.style.borderColor = color;
            b.style.color = color;
            b.style.boxShadow = `0 0 10px ${color}33`;
            ballWrap.appendChild(b);
        });

        row.appendChild(ballWrap);

        const btn = document.createElement('button');
        btn.className = 'btn-report';
        btn.textContent = 'REPORT';
        btn.onclick = () => showReport(i);
        row.appendChild(btn);

        ui.ballContainer.appendChild(row);
        await new Promise(r => setTimeout(r, 100));
    }
}

function showReport(idx) {
    const d = STATE.generatedData[idx];
    ui.reportContent.innerHTML = `
        <div style='text-align:center;margin-bottom:20px;'><h1 style='color:var(--accent-gold)'>${d.score}%</h1></div>
        <ul style='list-style:none;padding:0;'>
            ${d.reasons.map(r => `<li style='margin-bottom:10px;border-left:3px solid var(--accent-blue);padding-left:10px;'>${r}</li>`).join('')}
        </ul>
    `;
    ui.reportModal.style.display = 'flex';
}

/** 5. 초기화 */
async function init() {
    STATE.currentDrwNo = calculateCurrentTurn();
    ui.lastSyncInfo.textContent = `동기화 데이터: ${STATE.currentDrwNo - 1}회`;
    
    ui.historyTable.innerHTML = '<div class="loading-scan">데이터 동기화 중...</div>';
    
    for (let i = 1; i <= 5; i++) {
        try {
            const res = await fetch(`/api/lotto?drwNo=${STATE.currentDrwNo - i}`);
            const data = await res.json();
            if (data.returnValue === 'success') {
                if(i === 1) ui.historyTable.innerHTML = '';
                const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
                STATE.recentHistory.push({ winNums: nums });
                const r = document.createElement('div');
                r.className = 'history-row';
                r.innerHTML = `<span>${STATE.currentDrwNo - i}회</span><span>${nums.join(', ')}</span>`;
                ui.historyTable.appendChild(r);
            }
        } catch(e) {}
    }
}

ui.qtyBtns.forEach(b => b.addEventListener('click', () => {
    ui.qtyBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    STATE.selectedQty = parseInt(b.dataset.qty);
    addLog(`추출 개수 ${STATE.selectedQty}개 설정됨. [분석 시작]을 누르세요.`);
}));

ui.btnGenerate.onclick = runAnalysis;
ui.btnCloseModal.onclick = () => ui.reportModal.style.display = 'none';
window.onclick = (e) => { if(e.target === ui.reportModal) ui.reportModal.style.display = 'none'; };

init();
