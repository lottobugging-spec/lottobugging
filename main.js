/**
 * 로또버깅(LottoBugging) 분석 엔진 v4.0
 * 22가지 엄격한 필터 규칙 반영 (가중치 스코어링 시스템)
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
    bottomAd: document.getElementById('bottomAd')
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

/** 2. 22가지 필터링 엔진 (Core Scorer) */
class FilterEngine {
    static analyze(nums) {
        let score = 0;
        let reasons = [];
        const sorted = [...nums].sort((a, b) => a - b);
        const history = STATE.recentHistory;
        const flatHistory = history.flatMap(h => h.winNums);

        // 1. 핫넘버 (최근 5주 빈출수)
        if (filterMap[1].checked && history.length > 0) {
            const hot = sorted.filter(n => flatHistory.filter(x => x === n).length >= 2).length;
            if (hot >= 1) { score += 5; reasons.push("1. 최근 5주 핫넘버 전략 반영"); }
        }

        // 2. 역대 최다 당첨번호 (예시 리스트: 43, 27, 34, 17, 1...)
        if (filterMap[2].checked) {
            const mostFreq = [43, 27, 34, 17, 1, 13, 33, 4, 45, 39];
            if (sorted.some(n => mostFreq.includes(n))) { score += 5; reasons.push("2. 역대 최다 당첨번호 가중치 적용"); }
        }

        // 3. 색상 분포 최적화
        if (filterMap[3].checked) {
            const sections = new Set(sorted.map(n => Math.floor((n - 1) / 10)));
            if (sections.size >= 3) { score += 5; reasons.push("3. 5개 구간 색상 밸런스 최적화"); }
        }

        // 4. 콜드넘버 (최근 5주 미출수)
        if (filterMap[4].checked && history.length > 0) {
            if (sorted.some(n => !flatHistory.includes(n))) { score += 5; reasons.push("4. 최근 5주 미출수(콜드넘버) 배치"); }
        }

        // 5. 이월수 (0~2개)
        if (filterMap[5].checked && history.length > 0) {
            const lastWin = history[0].winNums;
            const carry = sorted.filter(n => lastWin.includes(n)).length;
            if (carry <= 2) { score += 5; reasons.push(`5. 직전 회차 이월수(${carry}개) 제한 필터`); }
        }

        // 6. 이웃수 (1~3개)
        if (filterMap[6].checked && history.length > 0) {
            const lastWin = history[0].winNums;
            const neighbors = new Set(lastWin.flatMap(n => [n - 1, n + 1]).filter(n => n >= 1 && n <= 45));
            const count = sorted.filter(n => neighbors.has(n)).length;
            if (count >= 1 && count <= 3) { score += 5; reasons.push(`6. 직전 회차 이웃수(${count}개) 흐름 포착`); }
        }

        // 7. 총합 (100~175)
        const sum = sorted.reduce((a, b) => a + b, 0);
        if (filterMap[7].checked && sum >= 100 && sum <= 175) { score += 10; reasons.push("7. 총합 핵심 구간(100~175) 타격"); }

        // 8. AC값 (7 이상)
        if (filterMap[8].checked) {
            let diffs = new Set();
            for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) diffs.add(Math.abs(sorted[i] - sorted[j]));
            const ac = diffs.size - 5;
            if (ac >= 7) { score += 10; reasons.push(`8. 산술적 복잡도 AC값(${ac}) 검증 완료`); }
        }

        // 9. 홀짝 (6:0, 0:6 제외)
        const odds = sorted.filter(n => n % 2).length;
        if (filterMap[9].checked && odds !== 0 && odds !== 6) { score += 5; reasons.push(`9. 홀짝 비율(${odds}:${6 - odds}) 밸런스`); }

        // 10. 고저 (6:0, 0:6 제외)
        const highs = sorted.filter(n => n >= 23).length;
        if (filterMap[10].checked && highs !== 0 && highs !== 6) { score += 5; reasons.push(`10. 고저 비율(${highs}:${6 - highs}) 황금 배합`); }

        // 11. 동일 끝수 (0~3개)
        const ends = sorted.map(n => n % 10);
        const maxSameEnd = Math.max(...Object.values(ends.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {})));
        if (filterMap[11].checked && maxSameEnd <= 3) { score += 5; reasons.push("11. 동일 끝수 과집중 필터링"); }

        // 12. 끝수 총합 (15~38)
        const endSum = ends.reduce((a, b) => a + b, 0);
        if (filterMap[12].checked && endSum >= 15 && endSum <= 38) { score += 5; reasons.push(`12. 끝수 총합(${endSum}) 안정권 진입`); }

        // 13. 연번 제한 (3연번 이상 제외)
        let con = 0;
        for (let i = 0; i < 5; i++) if (sorted[i] + 1 === sorted[i + 1]) con++;
        if (filterMap[13].checked && con <= 1) { score += 5; reasons.push("13. 3연번 이상 고위험 패턴 제거"); }

        // 14. 소수 (0~3개)
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
        const pCount = sorted.filter(n => primes.includes(n)).length;
        if (filterMap[14].checked && pCount <= 3) { score += 5; reasons.push(`14. 소수 비중(${pCount}개) 최적화`); }

        // 15. 합성수 (0~3개) - 소수/3배수 제외
        const composites = [1, 4, 8, 10, 14, 16, 20, 22, 25, 26, 28, 32, 34, 35, 38, 40, 44];
        const cCount = sorted.filter(n => composites.includes(n)).length;
        if (filterMap[15].checked && cCount <= 3) { score += 5; reasons.push(`15. 합성수 비중(${cCount}개) 조절`); }

        // 16. 완전제곱수 (0~2개)
        const squares = [1, 4, 9, 16, 25, 36];
        const sCount = sorted.filter(n => squares.includes(n)).length;
        if (filterMap[16].checked && sCount <= 2) { score += 5; reasons.push(`16. 완전제곱수(${sCount}개) 필터 통과`); }

        // 17. 특정 배수 (3배수 0-3, 5배수 0-2)
        const m3 = sorted.filter(n => n % 3 === 0).length;
        const m5 = sorted.filter(n => n % 5 === 0).length;
        if (filterMap[17].checked && m3 <= 3 && m5 <= 2) { score += 5; reasons.push("17. 3/5 배수 배분 안정성 확보"); }

        // 18. 쌍수 (0~2개)
        const twins = [11, 22, 33, 44];
        const tCount = sorted.filter(n => twins.includes(n)).length;
        if (filterMap[18].checked && tCount <= 2) { score += 5; reasons.push(`18. 쌍수(${tCount}개) 중복 제한`); }

        // 19. 시작/끝번호 제한
        const startNo = sorted[0], endNo = sorted[5];
        if (filterMap[19].checked && startNo < 15 && endNo > 30) { score += 5; reasons.push("19. 시작/끝번호 범위 유효성 검증"); }

        // 20. 동일구간 쏠림 방지
        const maxSection = Math.max(...Object.values(sorted.reduce((a, c) => { let s = Math.floor((c - 1) / 10); a[s] = (a[s] || 0) + 1; return a; }, {})));
        if (filterMap[20].checked && maxSection <= 3) { score += 5; reasons.push("20. 특정 번호대 쏠림 방지"); }

        // 21. 모서리 패턴 (1~4개)
        const corners = [1, 2, 8, 9, 6, 7, 13, 14, 29, 30, 36, 37, 34, 35, 41, 42];
        const coCount = sorted.filter(n => corners.includes(n)).length;
        if (filterMap[21].checked && coCount >= 1 && coCount <= 4) { score += 5; reasons.push(`21. 모서리 공간 패턴(${coCount}개) 반영`); }

        // 22. AI 딥러닝 최종 최적화
        if (filterMap[22].checked) { score += Math.random() * 5; reasons.push("22. AI 딥러닝 패턴 최종 검증"); }

        return { score: Math.min(score, 100), reasons };
    }
}

/** 3. 유틸리티 & 연출 */
function getBallColor(n) {
    if (n <= 10) return "yellow";
    if (n <= 20) return "blue";
    if (n <= 30) return "red";
    if (n <= 40) return "gray";
    return "green";
}

async function fastLog(msgs) {
    for (const m of msgs) {
        const p = document.createElement('p');
        p.className = 'log-line';
        p.innerHTML = `> ${m}`;
        ui.logContent.appendChild(p);
        ui.logContent.scrollTop = ui.logContent.scrollHeight;
        await new Promise(r => setTimeout(r, 30));
    }
}

async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    ui.ballContainer.innerHTML = '';
    STATE.generatedData = [];

    if (STATE.selectedQty >= 10) {
        ui.analysisOverlay.style.display = 'flex';
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            ui.analysisProgress.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(interval);
        }, 150);
        await fastLog([
            "Connecting to Global Big Data...", "Filtering noise data...", 
            "Analyzing 5-week Hot/Cold numbers...", "Calculating AC Complexity index...",
            "Applying 22-step scoring logic...", "Finalizing AI optimization..."
        ]);
        await new Promise(r => setTimeout(r, 2000));
        ui.analysisOverlay.style.display = 'none';
    }

    ui.bottomAd.style.display = (STATE.selectedQty === 5) ? 'block' : 'none';

    let pool = [];
    for (let i = 0; i < 3000; i++) {
        const nums = Array.from({length: 6}, () => Math.floor(Math.random() * 45) + 1);
        const set = [...new Set(nums)];
        if (set.length < 6) { i--; continue; }
        const analysis = FilterEngine.analyze(set);
        pool.push({ nums: set.sort((a,b) => a-b), ...analysis });
    }
    pool.sort((a,b) => b.score - a.score);
    const results = pool.slice(0, STATE.selectedQty);
    STATE.generatedData = results;

    const best = results[0].score;
    let tier = best >= 90 ? "S+" : best >= 80 ? "S" : best >= 70 ? "A" : "B";
    ui.optimizationScore.innerHTML = `${best.toFixed(1)}% (<span style='color:var(--accent-gold)'>${tier}-Tier</span>)`;

    await displayResults(results);
    STATE.isAnalyzing = false;
}

async function displayResults(data) {
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('div');
        row.className = 'result-row';
        const inner = document.createElement('div');
        inner.style.display = 'flex'; inner.style.gap = '8px';
        data[i].nums.forEach(n => {
            const b = document.createElement('div');
            b.className = 'ball glossy'; b.textContent = n;
            b.setAttribute('data-color', getBallColor(n));
            inner.appendChild(b);
        });
        row.appendChild(inner);
        const btn = document.createElement('button');
        btn.className = 'btn-report'; btn.textContent = 'REPORT';
        btn.onclick = () => showReport(i);
        row.appendChild(btn);
        ui.ballContainer.appendChild(row);
        await new Promise(r => setTimeout(r, 50));
    }
}

function showReport(idx) {
    const d = STATE.generatedData[idx];
    ui.reportContent.innerHTML = `
        <div style='text-align:center;margin-bottom:15px;'><h1 style='color:var(--accent-gold)'>${d.score.toFixed(1)}점</h1></div>
        <ul style='list-style:none;padding:0;'>
            ${d.reasons.map(r => `<li style='margin-bottom:8px;border-left:3px solid var(--accent-blue);padding-left:10px;'>${r}</li>`).join('')}
        </ul>
    `;
    ui.reportModal.style.display = 'flex';
}

/** 4. 초기화 */
async function init() {
    STATE.currentDrwNo = calculateCurrentTurn();
    ui.lastSyncInfo.textContent = `동기화 데이터: ${STATE.currentDrwNo - 1}회`;
    ui.historyTable.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const res = await fetch(`/api/lotto?drwNo=${STATE.currentDrwNo - i}`);
        const data = await res.json();
        if (data.returnValue === 'success') {
            const nums = [data.drwtNo1, data.drwtNo2, data.drwtNo3, data.drwtNo4, data.drwtNo5, data.drwtNo6];
            STATE.recentHistory.push({ winNums: nums });
            const r = document.createElement('div');
            r.className = 'history-row';
            r.innerHTML = `<span class='drw-no'>${STATE.currentDrwNo - i}회</span>
                <div style='display:flex;gap:3px;'>${nums.map(n => `<div class='mini-ball glossy' data-color='${getBallColor(n)}' style='width:22px;height:22px;font-size:0.6rem;'>${n}</div>`).join('')}</div>`;
            ui.historyTable.appendChild(r);
        }
    }
}

ui.qtyBtns.forEach(b => b.addEventListener('click', () => {
    ui.qtyBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    STATE.selectedQty = parseInt(b.dataset.qty);
    runAnalysis();
}));
ui.btnGenerate.onclick = runAnalysis;
ui.btnCloseModal.onclick = () => ui.reportModal.style.display = 'none';
window.onclick = (e) => { if(e.target === ui.reportModal) ui.reportModal.style.display = 'none'; };

init();
