/**
 * 로또버깅(LottoBugging) 분석 엔진 v3.5
 * 22가지 가중치 스코어링 및 수익화 전략(광고) 로직 포함
 */

const STATE = {
    currentDrwNo: 0,
    recentHistory: [],
    selectedQty: 1,
    isAnalyzing: false
};

const ui = {
    btnGenerate: document.getElementById('btnGenerate'),
    btnGacha: document.getElementById('btnGacha'),
    logContent: document.getElementById('logContent'),
    ballContainer: document.getElementById('ballContainer'),
    probValue: document.getElementById('probValue'),
    historyTable: document.getElementById('historyTable'),
    qtyBtns: document.querySelectorAll('.qty-btn'),
    bottomAd: document.getElementById('bottomAd'),
    analysisOverlay: document.getElementById('analysisOverlay'),
    analysisProgress: document.getElementById('analysisProgress')
};

/**
 * 1. 자동 회차 계산 (KST 기준)
 */
function getKST() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 9));
}

function calculateCurrentTurn() {
    const start = new Date('2002-12-07T21:00:00+09:00'); 
    const now = getKST();
    const diff = now - start;
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return weeks + 1;
}

/**
 * 2. 필터 엔진 (22개 가중치 로직)
 */
class FilterEngine {
    static getScore(nums) {
        let score = 0;
        const sorted = [...nums].sort((a,b) => a-b);
        const history = STATE.recentHistory;
        const flatWinNums = history.flatMap(h => h.winNums);

        const sum = sorted.reduce((a,b) => a+b, 0);
        if (sum >= 100 && sum <= 175) score += 10;
        
        const odds = sorted.filter(n => n%2).length;
        if (odds >= 2 && odds <= 4) score += 10;
        
        const highs = sorted.filter(n => n >= 23).length;
        if (highs >= 2 && highs <= 4) score += 10;
        
        let diffs = new Set();
        for(let i=0; i<6; i++) for(let j=i+1; j<6; j++) diffs.add(Math.abs(sorted[i]-sorted[j]));
        if (diffs.size - 5 >= 7) score += 10;

        const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43];
        if (sorted.filter(n => primes.includes(n)).length <= 3) score += 5;
        if (sorted.filter(n => n%3 === 0).length <= 3) score += 5;
        
        const endSum = sorted.reduce((a,b) => a+(b%10), 0);
        if (endSum >= 20 && endSum <= 35) score += 5;
        
        let con = 0;
        for(let i=0; i<5; i++) if(sorted[i]+1 === sorted[i+1]) con++;
        if (con <= 1) score += 15; else if (con > 2) score -= 20;

        if (history.length > 0) {
            const lastWin = history[0].winNums;
            const carryOver = sorted.filter(n => lastWin.includes(n)).length;
            if (carryOver >= 1 && carryOver <= 2) score += 15;
            
            const hotCount = sorted.filter(n => flatWinNums.filter(x => x===n).length >= 2).length;
            if (hotCount >= 1) score += 10;
            
            if (sorted.some(n => !flatWinNums.includes(n))) score += 10;
            if (!sorted.every(n => lastWin.includes(n))) score += 50;
        }

        const ends = sorted.map(n => n%10);
        if (new Set(ends).size >= 4) score += 5;
        
        const sections = new Set(sorted.map(n => Math.floor((n-1)/10)));
        if (sections.size >= 4) score += 5;
        
        const corners = [1,2,8,9,6,7,13,14,29,30,36,37,34,35,41,42];
        if (sorted.filter(n => corners.includes(n)).length >= 1) score += 5;
        
        score += (Math.random() * 10); 

        return score;
    }
}

/**
 * 3. 데이터 로드 및 UI 제어
 */
async function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.innerHTML = `> ${msg}`;
    ui.logContent.appendChild(p);
    ui.logContent.scrollTop = ui.logContent.scrollHeight;
    await new Promise(r => setTimeout(r, 100));
}

async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    ui.btnGenerate.disabled = true;
    ui.ballContainer.innerHTML = '';
    
    // 수익화 전략: 10개/20개 추출 시 전면 광고/대기
    if (STATE.selectedQty >= 10) {
        ui.analysisOverlay.style.display = 'flex';
        let progress = 0;
        const interval = setInterval(() => {
            progress += 3.33;
            ui.analysisProgress.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(interval);
        }, 100);
        
        await new Promise(r => setTimeout(r, 3000));
        ui.analysisOverlay.style.display = 'none';
        ui.analysisProgress.style.width = '0%';
    }

    // 수익화 전략: 5개 추출 시 하단 광고 노출
    if (STATE.selectedQty === 5) {
        ui.bottomAd.style.display = 'block';
    } else {
        ui.bottomAd.style.display = 'none';
    }

    await addLog("시스템 메모리 정렬 중...", "warn");
    await addLog("최근 데이터 동기화 확인...", "warn");
    await addLog(`${STATE.selectedQty}개 고가중치 조합 추출 엔진 가동...`, "warn");

    const probInterval = setInterval(() => {
        ui.probValue.textContent = (Math.random() * 99).toFixed(6) + "%";
    }, 50);

    setTimeout(async () => {
        let candidates = [];
        for(let i=0; i<5000; i++) {
            const nums = generateRandomSet();
            candidates.push({ nums, score: FilterEngine.getScore(nums) });
        }
        candidates.sort((a,b) => b.score - a.score);
        
        const results = candidates.slice(0, STATE.selectedQty).map(c => c.nums);
        
        clearInterval(probInterval);
        ui.probValue.textContent = "99.999999%";
        
        await displayResults(results);
        addLog(`분석 완료. ${STATE.selectedQty}개 조합 도출됨.`, "success");
        
        ui.btnGenerate.disabled = false;
        STATE.isAnalyzing = false;
    }, 500);
}

function generateRandomSet() {
    const set = new Set();
    while(set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
    return [...set].sort((a,b) => a-b);
}

async function displayResults(bundles) {
    for (const nums of bundles) {
        const row = document.createElement('div');
        row.className = 'result-row';
        for (const n of nums) {
            const ball = document.createElement('div');
            ball.className = bundles.length === 1 ? 'ball' : 'mini-ball';
            ball.textContent = n;
            const color = getBallColor(n);
            ball.style.borderColor = color;
            ball.style.color = color;
            ball.style.boxShadow = `0 0 15px ${color}66`;
            row.appendChild(ball);
            await new Promise(r => setTimeout(r, 50));
        }
        ui.ballContainer.appendChild(row);
    }
}

function getBallColor(n) {
    if (n <= 10) return "#fbc400";
    if (n <= 20) return "#69c8f2";
    if (n <= 30) return "#ff7272";
    if (n <= 40) return "#aaaaaa";
    return "#b0d840";
}

async function init() {
    STATE.currentDrwNo = calculateCurrentTurn();
    addLog(`LOTTOBUGGING 접속 완료. (Target: ${STATE.currentDrwNo}회차)`, "success");
    
    for(let i=1; i<=5; i++) {
        const drwNo = STATE.currentDrwNo - i;
        try {
            const res = await fetch(`/api/lotto?drwNo=${drwNo}`);
            const data = await res.json();
            if(data.returnValue === 'success') {
                const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
                STATE.recentHistory.push({ drwNo, winNums: nums });
                renderHistoryRow(drwNo, data.drwNoDate, nums, data.bnusNo);
            }
        } catch(e) {}
    }
}

function renderHistoryRow(no, date, nums, bonus) {
    const row = document.createElement('div');
    row.className = 'history-row';
    row.innerHTML = `<span class='drw-no'>${no}회</span><span class='drw-nums'>${nums.join(' ')} + ${bonus}</span>`;
    ui.historyTable.appendChild(row);
}

ui.btnGenerate.addEventListener('click', runAnalysis);
ui.qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        ui.qtyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.selectedQty = parseInt(btn.dataset.qty);
    });
});

init();
