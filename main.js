/**
 * 로또버깅 코어 엔진 v2.1
 * AI 딥테크 분석 특화
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

// UI 요소
const btnGenerate = document.getElementById('btnGenerate');
const btnGacha = document.getElementById('btnGacha');
const logContent = document.getElementById('logContent');
const ballContainer = document.getElementById('ballContainer');
const probValue = document.getElementById('probValue');
const resultDisplay = document.getElementById('resultDisplay');

let selectedQty = 1;

// 필터 ID 매핑 (HTML과 일치)
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
 * 필터 엔진 클래스
 */
class LottoEngine {
    static validate(nums) {
        // 1. 총합 필터 (100-175)
        if (filterMap.sum.checked) {
            const sum = nums.reduce((a, b) => a + b, 0);
            if (sum < 100 || sum > 175) return { pass: false, log: "총합 범위 초과: " + sum };
        }

        // 2. AC값 복잡도 (>=7)
        if (filterMap.ac.checked) {
            let diffs = new Set();
            for (let i = 0; i < nums.length; i++) {
                for (let j = i + 1; j < nums.length; j++) diffs.add(Math.abs(nums[i] - nums[j]));
            }
            const ac = diffs.size - 5;
            if (ac < 7) return { pass: false, log: "산술 복잡도 낮음: " + ac };
        }

        // 3. 홀짝 밸런스
        if (filterMap.oddeven.checked) {
            const odds = nums.filter(n => n % 2 !== 0).length;
            if (odds < 2 || odds > 4) return { pass: false, log: "홀짝 불균형: " + odds };
        }

        // 4. 고저 밸런스 (23 이상이 '고')
        if (filterMap.highlow.checked) {
            const high = nums.filter(n => n >= 23).length;
            if (high < 2 || high > 4) return { pass: false, log: "고저 불균형: " + high };
        }

        // 5. 끝수 합 (20-35)
        if (filterMap.endsum.checked) {
            const endSum = nums.reduce((a, b) => a + (b % 10), 0);
            if (endSum < 20 || endSum > 35) return { pass: false, log: "끝수 합 오류: " + endSum };
        }

        // 6. 소수 포함 (1-3개)
        if (filterMap.prime.checked) {
            const count = nums.filter(n => MOCK_DATA.primes.includes(n)).length;
            if (count < 1 || count > 3) return { pass: false, log: "소수 비중 부적절: " + count };
        }

        // 7. 3의 배수 (1-3개)
        if (filterMap.mul3.checked) {
            const count = nums.filter(n => n % 3 === 0).length;
            if (count < 1 || count > 3) return { pass: false, log: "3의배수 비중 부적절: " + count };
        }

        // 8. 핫넘버 포함
        if (filterMap.hot.checked) {
            if (!nums.some(n => MOCK_DATA.hotNumbers.includes(n))) return { pass: false, log: "최근 빈출수 미포함" };
        }

        // 9. 콜드넘버 포함
        if (filterMap.cold.checked) {
            if (!nums.some(n => MOCK_DATA.coldNumbers.includes(n))) return { pass: false, log: "장기 미출수 미포함" };
        }

        // 10. 이월수 반영 (0-2개)
        if (filterMap.carryover.checked) {
            const lastWin = MOCK_DATA.recentWins[0];
            const count = nums.filter(n => lastWin.includes(n)).length;
            if (count > 2) return { pass: false, log: "이월수 과다: " + count };
        }

        // 13. 동일 끝수 제한
        if (filterMap.lastdigit.checked) {
            const ends = nums.map(n => n % 10);
            const counts = {};
            for(let e of ends) {
                counts[e] = (counts[e] || 0) + 1;
                if (counts[e] > 2) return { pass: false, log: "동일 끝수 반복 감지" };
            }
        }

        // 14. 전회차 번호와 완전 일치 제외
        if (filterMap.excludelast.checked) {
            const lastWin = MOCK_DATA.recentWins[0];
            const isMatch = nums.every((n, i) => n === lastWin[i]);
            if (isMatch) return { pass: false, log: "전회차 번호와 일치" };
        }

        // 15. 연속 번호 제한 (최대 2연번)
        if (filterMap.consecutive.checked) {
            let max = 1, curr = 1;
            for (let i = 1; i < nums.length; i++) {
                if (nums[i] === nums[i-1] + 1) curr++;
                else { max = Math.max(max, curr); curr = 1; }
            }
            if (Math.max(max, curr) > 2) return { pass: false, log: "연속 번호 제한 위반" };
        }

        // 16. 모서리 패턴
        if (filterMap.corner.checked) {
            const count = nums.filter(n => MOCK_DATA.corners.includes(n)).length;
            if (count < 1) return { pass: false, log: "모서리 패턴 미탐지" };
        }

        // 18. 쌍둥이수 필터
        if (filterMap.twin.checked) {
            const count = nums.filter(n => MOCK_DATA.twins.includes(n)).length;
            if (count > 1) return { pass: false, log: "쌍둥이수 과다" };
        }

        // 19. 거울수 분석
        if (filterMap.mirror.checked) {
            const count = nums.filter(n => MOCK_DATA.mirrors.includes(n)).length;
            if (count > 2) return { pass: false, log: "거울수 과다" };
        }

        // 17. 번호대 균등 배분 (최소 4개 구간 점유)
        if (filterMap.section.checked) {
            const sections = new Set(nums.map(n => Math.floor((n-1)/10)));
            if (sections.size < 4) return { pass: false, log: "번호대 분포 불균형" };
        }

        // 20. 좌우 대칭 패턴
        if (filterMap.symmetry.checked) {
            const balanced = nums.filter(n => n < 23).length;
            if (balanced < 2 || balanced > 4) return { pass: false, log: "대칭 밸런스 위반" };
        }

        // 21. 대각선 분포
        if (filterMap.diagonal.checked) {
            const positions = nums.map(n => ({ r: Math.floor((n-1)/7), c: (n-1)%7 }));
            const diags = positions.filter(p => p.r === p.c || p.r + p.c === 6).length;
            if (diags < 1) return { pass: false, log: "대각선 패턴 미발견" };
        }

        // 11. 미출현 번호대
        if (filterMap.missing.checked) {
            const missing = [5, 17, 26, 38, 44]; 
            if (!nums.some(n => missing.includes(n))) return { pass: false, log: "필수 미출수 누락" };
        }

        // 12. 동형수/연번 통계
        if (filterMap.serial.checked) {
            const ends = nums.map(n => n % 10);
            const uniqueEnds = new Set(ends).size;
            if (uniqueEnds > 5) return { pass: false, log: "동형 패턴 분석 실패" };
        }

        // 22. AI 최종 최적화
        if (filterMap.ai.checked) {
            if (Math.random() < 0.05) return { pass: false, log: "AI 편향성 엔진 거부" };
        }

        return { pass: true };
    }
}

/**
 * 컨트롤러 함수
 */
function addLog(msg, type = '') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    logContent.appendChild(p);
    logContent.scrollTop = logContent.scrollHeight;
}

function getBallColor(n) {
    if (n <= 10) return "#fbc400";
    if (n <= 20) return "#69c8f2";
    if (n <= 30) return "#ff7272";
    if (n <= 40) return "#aaaaaa";
    return "#b0d840";
}

async function runAnalysis() {
    btnGenerate.disabled = true;
    addLog(`${selectedQty}개 조합에 대한 정밀 분석을 시작합니다...`, "warn");
    
    ballContainer.innerHTML = ''; 
    resultDisplay.scrollTop = 0;
    
    let candidates = [];

    // 확률 수렴 애니메이션
    const probInterval = setInterval(() => {
        probValue.textContent = (Math.random() * 0.0005).toFixed(6) + "%";
    }, 100);

    // 조합 생성 루프
    for (let q = 0; q < selectedQty; q++) {
        let attempts = 0;
        let found = null;
        
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
                found = nums;
                break;
            }
        }

        if (found) {
            candidates.push(found);
            addLog(`조합 #${q+1} 생성 완료 (${attempts}회 시도)`, "success");
        } else {
            addLog(`조합 #${q+1} 분석 실패 (필터 조정 권장)`, "error");
        }
    }

    clearInterval(probInterval);

    // 결과 출력
    if (candidates.length > 0) {
        displayResults(candidates);
        probValue.textContent = (0.000412 / selectedQty).toFixed(8) + "%";
    } else {
        ballContainer.innerHTML = '<div class="log-line error">결과 생성에 실패했습니다. 필터 조건을 완화해 주세요.</div>';
        probValue.textContent = "0.000000%";
    }

    btnGenerate.disabled = false;
}

function displayResults(bundles) {
    ballContainer.innerHTML = '';
    
    bundles.forEach((nums, idx) => {
        const row = document.createElement('div');
        row.className = 'result-row';
        
        nums.forEach(n => {
            const ball = document.createElement('div');
            ball.className = bundles.length === 1 ? 'ball' : 'mini-ball';
            ball.textContent = n;
            const color = getBallColor(n);
            ball.style.borderColor = color;
            ball.style.color = color;
            ball.style.boxShadow = `0 0 10px ${color}44`;
            row.appendChild(ball);
        });
        
        ballContainer.appendChild(row);
    });
}

// 개수 선택 버튼 핸들러
document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedQty = parseInt(btn.dataset.qty);
        addLog(`추출 개수 설정됨: ${selectedQty}개`);
    });
});

// 프리셋 핸들러
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
        addLog(`프리셋 로드됨: ${btn.textContent}`);
    });
});

// 가챠 로직
btnGacha.addEventListener('click', async () => {
    btnGacha.classList.add('active');
    addLog("가챠 모드: 필터를 무작위로 구성 중...", "warn");
    
    Object.values(filterMap).forEach(cb => cb.checked = false);
    let shuffled = FILTER_IDS.sort(() => 0.5 - Math.random());
    let count = 5 + Math.floor(Math.random() * 4);
    let selected = shuffled.slice(0, count);
    
    for(let i = 0; i < 15; i++) {
        let randomId = FILTER_IDS[Math.floor(Math.random() * FILTER_IDS.length)];
        filterMap[randomId].parentElement.style.boxShadow = "0 0 10px #ff00ff";
        await new Promise(r => setTimeout(r, 50));
        filterMap[randomId].parentElement.style.boxShadow = "none";
    }

    selected.forEach(id => { filterMap[id].checked = true; });
    addLog(`가챠 완료: ${count}개의 알고리즘이 활성화되었습니다.`);
    btnGacha.classList.remove('active');
    setTimeout(runAnalysis, 500);
});

btnGenerate.addEventListener('click', runAnalysis);
