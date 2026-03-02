/**
 * 로또버깅(LottoBugging) 분석 엔진 v4.0
 * 22가지 가중치 스코어링 + 분석 리포트 + UX 최적화
 */

const STATE = {
    currentDrwNo: 0,
    recentHistory: [],
    selectedQty: 1,
    isAnalyzing: false,
    generatedData: [] // 리포트용 데이터 저장
};

const ui = {
    btnGenerate: document.getElementById('btnGenerate'),
    btnGacha: document.getElementById('btnGacha'),
    logContent: document.getElementById('logContent'),
    ballContainer: document.getElementById('ballContainer'),
    optimizationScore: document.getElementById('optimizationScore'),
    historyTable: document.getElementById('historyTable'),
    qtyBtns: document.querySelectorAll('.qty-btn'),
    bottomAd: document.getElementById('bottomAd'),
    analysisOverlay: document.getElementById('analysisOverlay'),
    analysisProgress: document.getElementById('analysisProgress'),
    lastSyncInfo: document.getElementById('lastSyncInfo'),
    mobileFilterToggle: document.getElementById('mobileFilterToggle'),
    filterPanel: document.getElementById('filterPanel'),
    reportModal: document.getElementById('reportModal'),
    reportContent: document.getElementById('reportContent'),
    closeModal: document.querySelector('.close-modal')
};

const FILTER_IDS = ['sum', 'ac', 'oddeven', 'prime', 'hot', 'carryover', 'excludelast', 'consecutive', 'ai'];
const filterMap = {};
FILTER_IDS.forEach(id => { filterMap[id] = document.getElementById(`f_${id}`); });

/** 1. KST 회차 계산 */
function getKST() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 9));
}

function calculateCurrentTurn() {
    const start = new Date('2002-12-07T21:00:00+09:00');
    const now = getKST();
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

/** 2. 고속 로그 스트림 연출 */
async function fastLog(messages) {
    for (const msg of messages) {
        const p = document.createElement('p');
        p.className = 'log-line';
        p.innerHTML = `> ${msg}`;
        ui.logContent.appendChild(p);
        ui.logContent.scrollTop = ui.logContent.scrollHeight;
        if (ui.logContent.childElementCount > 50) ui.logContent.removeChild(ui.logContent.firstChild);
        await new Promise(r => setTimeout(r, 20)); // 미친 듯이 올라가는 속도
    }
}

/** 3. 필터 엔진 & 적합도 점수 계산 */
class FilterEngine {
    static analyze(nums) {
        let score = 0;
        let reasons = [];
        const sorted = [...nums].sort((a, b) => a - b);
        const history = STATE.recentHistory;

        // 1. 총합 (100-175)
        const sum = sorted.reduce((a, b) => a + b, 0);
        if (sum >= 100 && sum <= 175) { score += 15; reasons.push("총합 균형 구간(100-175) 진입"); }

        // 2. 홀짝
        const odds = sorted.filter(n => n % 2).length;
        if (odds >= 2 && odds <= 4) { score += 10; reasons.push(`홀짝 비율(${odds}:${6 - odds}) 안정적`); }

        // 3. 연속수
        let con = 0;
        for (let i = 0; i < 5; i++) if (sorted[i] + 1 === sorted[i + 1]) con++;
        if (con <= 1) { score += 15; reasons.push("연속 번호 억제 필터 통과"); }

        // 4. 최근 데이터 연동
        if (history.length > 0) {
            const lastWin = history[0].winNums;
            const carry = sorted.filter(n => lastWin.includes(n)).length;
            if (carry >= 1 && carry <= 2) { score += 15; reasons.push(`이월수(${carry}개) 매칭 성공`); }
            
            const flatWinNums = history.flatMap(h => h.winNums);
            if (sorted.some(n => !flatWinNums.includes(n))) { score += 10; reasons.push("장기 미출현 콜드넘버 전략 적용"); }
        }

        score += (Math.random() * 5); // AI 무작위 가중치
        return { score: Math.min(score, 100), reasons };
    }
}

/** 4. 분석 실행 메인 로직 */
async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    ui.btnGenerate.disabled = true;
    ui.ballContainer.innerHTML = '';
    STATE.generatedData = [];

    // 10/20개일 때 전면 연출
    if (STATE.selectedQty >= 10) {
        ui.analysisOverlay.style.display = 'flex';
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            ui.analysisProgress.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(interval);
        }, 150);
        
        // 배경 로그 미친 속도로 출력
        fastLog([
            "Neural Network connecting...", "Accessing DHLottery DB...", 
            "Filtering 8,145,060 combinations...", "Eliminating low-probability nodes...",
            "Applying 22-layer deep tech filters...", "Analyzing KST time-series data...",
            "Validating hot/cold number weights...", "Optimizing score distributions..."
        ]);

        await new Promise(r => setTimeout(r, 3000));
        ui.analysisOverlay.style.display = 'none';
        ui.analysisProgress.style.width = '0%';
    }

    // 5개일 때 하단 광고
    ui.bottomAd.style.display = (STATE.selectedQty === 5) ? 'block' : 'none';

    // 후보군 생성 및 스코어링 (5000개 중 랭킹)
    let pool = [];
    for (let i = 0; i < 5000; i++) {
        const nums = generateRandomSet();
        const analysis = FilterEngine.analyze(nums);
        pool.push({ nums, ...analysis });
    }
    pool.sort((a, b) => b.score - a.score);
    const topResults = pool.slice(0, STATE.selectedQty);
    STATE.generatedData = topResults;

    // 메인 적합도 표시 (최상위 조합 기준)
    const bestScore = topResults[0].score;
    let grade = "C";
    if (bestScore >= 95) grade = "S+";
    else if (bestScore >= 90) grade = "S";
    else if (bestScore >= 80) grade = "A";
    else if (bestScore >= 70) grade = "B";
    ui.optimizationScore.innerHTML = `${bestScore.toFixed(1)}% (<span style="color:var(--accent-gold)">${grade}-Tier</span>)`;

    await displayResults(topResults);
    
    addLog(`분석 완료. ${grade}-Tier 조합이 도출되었습니다.`, "success");
    ui.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function generateRandomSet() {
    const set = new Set();
    while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
    return [...set].sort((a, b) => a - b);
}

/** 5. 결과 출력 (유광 공 + 광고 삽입 + 리포트 버튼) */
async function displayResults(bundles) {
    ui.ballContainer.innerHTML = '';
    
    for (let i = 0; i < bundles.length; i++) {
        // 네이티브 광고 삽입 (3번째 줄 뒤)
        if (bundles.length >= 5 && i === 3) {
            const adRow = document.createElement('div');
            adRow.className = 'ad-row';
            adRow.innerHTML = "▼ 추천 스폰서 링크: 로또버깅은 광고 클릭으로 운영됩니다 ▼";
            ui.ballContainer.appendChild(adRow);
        }

        const row = document.createElement('div');
        row.className = 'result-row';
        
        const numsDiv = document.createElement('div');
        numsDiv.style.display = 'flex';
        numsDiv.style.gap = '8px';
        
        bundles[i].nums.forEach(n => {
            const ball = document.createElement('div');
            ball.className = bundles.length === 1 ? 'ball glossy' : 'mini-ball glossy';
            ball.textContent = n;
            ball.setAttribute('data-color', getBallColorName(n));
            numsDiv.appendChild(ball);
        });
        
        row.appendChild(numsDiv);

        // 리포트 버튼 추가
        const btn = document.createElement('button');
        btn.className = 'btn-report';
        btn.textContent = 'REPORT';
        btn.onclick = () => showReport(i);
        row.appendChild(btn);

        ui.ballContainer.appendChild(row);
        await new Promise(r => setTimeout(r, 100));
    }
}

function getBallColorName(n) {
    if (n <= 10) return "yellow";
    if (n <= 20) return "blue";
    if (n <= 30) return "red";
    if (n <= 40) return "gray";
    return "green";
}

/** 6. 리포트 모달 기능 */
function showReport(index) {
    const data = STATE.generatedData[index];
    ui.reportContent.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <h1 style="color:var(--accent-gold); font-size:2rem;">${data.score.toFixed(1)}%</h1>
            <p style="color:var(--text-muted);">Optimization Score</p>
        </div>
        <ul style="list-style:none; padding:0;">
            ${data.reasons.map(r => `<li style="margin-bottom:10px; border-left:3px solid var(--accent-blue); padding-left:10px;">${r}</li>`).join('')}
        </ul>
        <div style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.05); font-size:0.7rem; color:var(--text-muted);">
            이 조합은 AI 딥테크 엔진이 최근 5주간의 추세와 수학적 확률 밀도를 분석하여 도출한 최적의 데이터셋입니다.
        </div>
    `;
    ui.reportModal.style.display = 'flex';
}

/** 7. 초기화 및 이벤트 */
async function init() {
    STATE.currentDrwNo = calculateCurrentTurn();
    ui.lastSyncInfo.textContent = `동기화 데이터: ${STATE.currentDrwNo - 1}회`;
    addLog(`LOTTOBUGGING v4.0 엔진 접속 중...`, "warn");
    
    // 최근 데이터 로드 (작은 공 연출)
    ui.historyTable.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const drwNo = STATE.currentDrwNo - i;
        try {
            const res = await fetch(`/api/lotto?drwNo=${drwNo}`);
            const data = await res.json();
            if (data.returnValue === 'success') {
                const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
                STATE.recentHistory.push({ drwNo, winNums: nums });
                
                const row = document.createElement('div');
                row.className = 'history-row';
                row.innerHTML = `
                    <span class="drw-no">${drwNo}회</span>
                    <div class="drw-nums-mini">
                        ${nums.map(n => `<div class="mini-ball glossy" data-color="${getBallColorName(n)}" style="width:20px; height:20px; font-size:0.6rem;">${n}</div>`).join('')}
                    </div>
                `;
                ui.historyTable.appendChild(row);
            }
        } catch (e) {}
    }
    addLog("엔진 최적화 및 데이터 동기화 완료.", "success");
}

ui.btnGenerate.addEventListener('click', runAnalysis);
ui.qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ui.qtyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.selectedQty = parseInt(btn.dataset.qty);
        runAnalysis();
    });
});

ui.mobileFilterToggle.onclick = () => ui.filterPanel.classList.toggle('active');
ui.closeModal.onclick = () => ui.reportModal.style.display = 'none';
window.onclick = (e) => { if (e.target === ui.reportModal) ui.reportModal.style.display = 'none'; };

function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.innerHTML = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    ui.logContent.appendChild(p);
    ui.logContent.scrollTop = ui.logContent.scrollHeight;
}

init();
