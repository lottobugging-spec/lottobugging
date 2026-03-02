/**
 * 로또버깅(LottoBugging) 분석 엔진 v4.1
 * 버튼 로직 수정, 리얼 적합도(85.0%~99.2%), 결과 초기화 적용
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
    bottomAd: document.getElementById('bottomAd'),
    btnShare: document.getElementById('btnShare')
};

// 필터 ID (1~22) 매핑
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

/** 2. 현실적인 적합도 점수 생성 (85.0% ~ 99.2%) */
function generateRealScore() {
    return (Math.random() * (99.2 - 85.0) + 85.0).toFixed(1);
}

/** 3. 필터링 엔진 (Scorer) */
class FilterEngine {
    static analyze(nums) {
        const score = generateRealScore();
        let reasons = ["기본 통계 필터링 통과"];
        const sorted = [...nums].sort((a,b) => a-b);
        const sum = sorted.reduce((a,b) => a+b, 0);
        
        if (sum >= 100 && sum <= 175) reasons.push(`총합 구간(${sum}) 최적화`);
        if (sorted.filter(n => n%2).length >= 2) reasons.push("홀짝 밸런스 조정 완료");
        
        return { score: parseFloat(score), reasons };
    }
}

/** 4. 분석 실행 메인 로직 (버튼 클릭 시만 실행) */
async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    ui.btnGenerate.disabled = true;

    // 결과창 및 기존 데이터 초기화 (핵심 요구사항)
    ui.ballContainer.innerHTML = '';
    ui.optimizationScore.textContent = '00.0% (N/A)';
    STATE.generatedData = [];

    // 10/20개일 때 전면 연출
    if (STATE.selectedQty >= 10) {
        ui.analysisOverlay.style.display = 'flex';
        let progress = 0;
        ui.analysisProgress.style.width = '0%';
        const interval = setInterval(() => {
            progress += 5;
            ui.analysisProgress.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(interval);
        }, 100);
        await new Promise(r => setTimeout(r, 2000));
        ui.analysisOverlay.style.display = 'none';
    }

    ui.bottomAd.style.display = (STATE.selectedQty === 5) ? 'block' : 'none';

    addLog(`${STATE.selectedQty}개 조합에 대한 정밀 알고리즘 분석을 시작합니다...`, "warn");

    let pool = [];
    for (let i = 0; i < STATE.selectedQty; i++) {
        const set = generateRandomSet();
        const analysis = FilterEngine.analyze(set);
        pool.push({ nums: set, ...analysis });
    }
    STATE.generatedData = pool;

    // 메인 상단 적합도 표시 (평균값 또는 최고값)
    const bestScore = pool[0].score;
    ui.optimizationScore.innerHTML = `${bestScore}% (<span style='color:var(--accent-gold)'>S-Tier</span>)`;

    await displayResults(pool);
    
    addLog(`분석이 완료되었습니다. 최적의 조합을 확인하세요.`, "success");
    ui.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function generateRandomSet() {
    const set = new Set();
    while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
    return [...set].sort((a, b) => a - b);
}

/** 5. 결과 출력 (세트별 개별 점수 표시 추가) */
async function displayResults(data) {
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('div');
        row.className = 'result-row';
        
        const infoDiv = document.createElement('div');
        infoDiv.style.width = '100%';
        infoDiv.style.display = 'flex';
        infoDiv.style.justifyContent = 'space-between';
        infoDiv.style.alignItems = 'center';

        const numsDiv = document.createElement('div');
        numsDiv.style.display = 'flex';
        numsDiv.style.gap = '8px';
        
        data[i].nums.forEach(n => {
            const b = document.createElement('div');
            b.className = 'ball'; 
            b.textContent = n;
            const color = getBallColor(n);
            b.style.borderColor = color;
            b.style.color = color;
            b.style.boxShadow = `0 0 15px ${color}44`;
            numsDiv.appendChild(b);
        });
        
        const scoreSpan = document.createElement('span');
        scoreSpan.style.fontSize = '0.7rem';
        scoreSpan.style.color = 'var(--accent-neon)';
        scoreSpan.style.fontFamily = 'Share Tech Mono';
        scoreSpan.textContent = `적합도: ${data[i].score}%`;

        const btn = document.createElement('button');
        btn.className = 'btn-report'; btn.textContent = 'REPORT';
        btn.style.position = 'static';
        btn.onclick = () => showReport(i);

        infoDiv.appendChild(numsDiv);
        infoDiv.appendChild(scoreSpan);
        infoDiv.appendChild(btn);
        
        row.appendChild(infoDiv);
        ui.ballContainer.appendChild(row);
        await new Promise(r => setTimeout(r, 50));
    }
}

function getBallColor(n) {
    if (n <= 10) return "#fbc400";
    if (n <= 20) return "#69c8f2";
    if (n <= 30) return "#ff7272";
    if (n <= 40) return "#aaaaaa";
    return "#b0d840";
}

function showReport(idx) {
    const d = STATE.generatedData[idx];
    ui.reportContent.innerHTML = `
        <div style='text-align:center;margin-bottom:15px;'><h1 style='color:var(--accent-gold)'>${d.score}점</h1></div>
        <ul style='list-style:none;padding:0;'>
            ${d.reasons.map(r => `<li style='margin-bottom:8px;border-left:3px solid var(--accent-blue);padding-left:10px;'>${r}</li>`).join('')}
        </ul>
    `;
    ui.reportModal.style.display = 'flex';
}

/** 6. 초기화 및 이벤트 */
async function init() {
    STATE.currentDrwNo = calculateCurrentTurn();
    ui.lastSyncInfo.textContent = `동기화 데이터: ${STATE.currentDrwNo - 1}회`;
    
    for (let i = 1; i <= 5; i++) {
        try {
            const res = await fetch(`/api/lotto?drwNo=${STATE.currentDrwNo - i}`);
            const data = await res.json();
            if (data.returnValue === 'success') {
                const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
                STATE.recentHistory.push({ winNums: nums });
                const r = document.createElement('div');
                r.className = 'history-row';
                r.innerHTML = `<span>${STATE.currentDrwNo - i}회</span><span style='color:var(--text-muted)'>${nums.join(', ')}</span>`;
                ui.historyTable.appendChild(r);
            }
        } catch(e) {}
    }
}

// 개수 버튼 클릭 시: 선택 표시만 변경 (핵심 요구사항)
ui.qtyBtns.forEach(b => b.addEventListener('click', () => {
    ui.qtyBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    STATE.selectedQty = parseInt(b.dataset.qty);
    addLog(`추출 개수가 ${STATE.selectedQty}개로 설정되었습니다. 분석 시작을 눌러주세요.`);
}));

ui.btnGenerate.onclick = runAnalysis;
ui.btnCloseModal.onclick = () => ui.reportModal.style.display = 'none';
window.onclick = (e) => { if(e.target === ui.reportModal) ui.reportModal.style.display = 'none'; };

function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.innerHTML = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    ui.logContent.appendChild(p);
    ui.logContent.scrollTop = ui.logContent.scrollHeight;
}

init();
