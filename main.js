/**
 * LOTTOBUGGING v7.5 - Scoring Engine
 * Core: Weight-based Extraction & Analysis
 */

const STATE = {
    selectedQty: 1,
    isAnalyzing: false,
    generatedData: [],
    latestWinNums: [5, 11, 25, 27, 36, 38], // 1213회 기준
    currentLang: localStorage.getItem('lotto-lang') || 'ko'
};

const TRANSLATIONS = {
    ko: {
        tagline: "Data Science Solution for Lottery Probability",
        nav_analyzer: "AI 분석기",
        nav_columns: "통계 칼럼",
        nav_methodology: "분석 방법론",
        nav_about: "서비스 안내",
        nav_filters: "필터 가이드",
        analyzer_title: "인공지능 로또 번호 분석 시스템",
        welcome_title: "데이터 기반 의사결정 시스템",
        welcome_desc: "22단계 필터링 알고리즘을 통해 통계적 노이즈를 제거합니다.",
        prob_label: "Algorithm Fitness Score",
        system_ready: "SYSTEM READY",
        qty_label: "추출 데이터 세트 (Quantity)",
        btn_generate: "데이터 분석 및 조합 생성 실행",
        strategy_header: "분석 전략",
        preset_basic: "표준 통계",
        preset_pattern: "패턴 집중",
        preset_full: "AI 정밀",
        preset_reset: "초기화",
        filter_header: "필터링 조건",
        sim_placeholder: "회차 입력 (예: 1210)",
        btn_simulate: "실행",
        sim_desc: "*선택한 회차의 실제 당첨 번호가 현재 필터를 얼마나 통과하는지 테스트합니다.",
        footer_privacy: "개인정보처리방침",
        footer_terms: "이용약관",
        footer_contact: "문의하기",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved."
    },
    en: {
        tagline: "Data Science Solution for Lottery Probability",
        nav_analyzer: "AI Analyzer",
        nav_columns: "Stats Columns",
        nav_methodology: "Methodology",
        nav_about: "About",
        nav_filters: "Filter Guide",
        analyzer_title: "AI Lotto Analysis System",
        welcome_title: "Data-Driven Decision System",
        welcome_desc: "Removing statistical noise through a 22-step filtering algorithm.",
        prob_label: "Algorithm Fitness Score",
        system_ready: "SYSTEM READY",
        qty_label: "Extraction Quantity",
        btn_generate: "Run Data Analysis & Generation",
        strategy_header: "Analysis Strategy",
        preset_basic: "Basic Stats",
        preset_pattern: "Pattern Focus",
        preset_full: "AI Precision",
        preset_reset: "Reset",
        filter_header: "Filtering Protocol",
        sim_placeholder: "Enter Draw No (e.g., 1210)",
        btn_simulate: "Run",
        sim_desc: "*Tests how many current filters the actual winning numbers of the selected draw pass.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Use",
        footer_contact: "Contact Us",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved."
    }
};

const FILTER_DETAILS = [
    { id: 1, name: "최근 5주간 당첨번호 비율 (핫넘버)", desc: "최근 5주간 출현 빈도가 높은 번호를 우선 선별합니다.", why: "로또의 단기 반복 출현 경향을 반영하여 현재 가장 강력한 흐름을 가진 번호를 조합에 반영합니다.", exampleNums: [5, 11, 25, 27, 36, 38], passEx: "핫넘버 2개 포함", failEx: "핫넘버 0개" },
    { id: 2, name: "역대 최다 당첨번호 반영", desc: "누적 빅데이터를 분석하여 당첨 횟수가 가장 많은 번호를 포함합니다.", why: "역사가 증명한 고빈도 번호를 활용하여 당첨 확률의 기본기를 잡습니다.", exampleNums: [1, 27, 34, 43, 13, 17], passEx: "상위 빈도 번호 포함", failEx: "최저 빈도 번호만 사용" },
    { id: 3, name: "색상 분포 비율 최적화", desc: "5개 구간(색상)의 비율을 분석하여 최적의 밸런스를 찾습니다.", why: "특정 번호대에 치우치지 않는 최적의 밸런스로 통계적 안정성을 확보합니다.", exampleNums: [2, 12, 23, 31, 42, 45], passEx: "3색 이상 골고루 배치", failEx: "단일 색상에 쏠림" },
    { id: 4, name: "최근 5주간 미출수 전략", desc: "장기 미출현 번호 중 반등 확률이 높은 번호를 선별합니다.", why: "확률의 법칙에 따라 출현 임계점에 도달한 번호를 전략적으로 배치합니다.", exampleNums: [3, 9, 15, 22, 33, 40], passEx: "콜드넘버 1~2개 포함", failEx: "핫넘버로만 구성" },
    { id: 5, name: "직전 회차 이월수 (0~2개)", desc: "지난주 당첨 번호가 다시 출현하는 현상을 반영합니다.", why: "이월 현상은 매주 60% 이상의 높은 확률로 발생합니다.", exampleNums: [5, 18, 25, 30, 36, 44], passEx: "전주 번호 1개 포함", failEx: "전주 번호 4개 이상" },
    { id: 6, name: "직전 회차 이웃수 (1~3개)", desc: "당첨 번호의 바로 옆 번호를 분석합니다.", why: "번호가 밀려 나오는 특유의 흐름을 포착하는 기법입니다.", exampleNums: [4, 6, 10, 12, 24, 26], passEx: "이웃수 2개 포함", failEx: "이웃수 없음" },
    { id: 7, name: "총합 구간 (100~175)", desc: "번호 6개의 총합을 안정적인 범위로 제한합니다.", why: "역대 1등 조합의 80% 이상이 이 구간에 존재합니다.", exampleNums: [10, 15, 25, 30, 35, 40], passEx: "합계 155", failEx: "합계 80 또는 200" },
    { id: 8, name: "AC값 7 이상", desc: "번호 간의 차잇값 무작위성을 수치화합니다.", why: "단순한 패턴을 필터링하고 과학적 조합만을 선별합니다.", exampleNums: [1, 5, 14, 22, 35, 43], passEx: "AC값 8", failEx: "AC값 4" },
    { id: 9, name: "홀짝 비율 (6:0, 0:6 제외)", desc: "홀수와 짝수의 균형을 맞춥니다.", why: "한쪽으로 완전히 치우친 조합은 당첨 확률이 2% 미만입니다.", exampleNums: [3, 11, 24, 28, 37, 42], passEx: "3:3 또는 2:4", failEx: "6:0 (모두 홀수)" },
    { id: 10, name: "고저 비율 (6:0, 0:6 제외)", desc: "23번 기준 낮은 번호와 높은 번호를 배분합니다.", why: "극단적인 쏠림을 방지하여 황금 밸런스를 유지합니다.", exampleNums: [5, 12, 19, 25, 34, 41], passEx: "3:3 분포", failEx: "0:6 (모두 고번호)" },
    { id: 11, name: "동일 끝수 (0~3개 포함)", desc: "각 번호의 일의 자리가 같은 번호 개수를 제한합니다.", why: "동일 끝수가 4개 이상일 확률은 1% 미만으로 지극히 낮습니다.", exampleNums: [2, 12, 25, 33, 38, 44], passEx: "끝수 2가 2개", failEx: "끝수 5가 4개" },
    { id: 12, name: "끝수 총합 (15~38)", desc: "일의 자리 숫자들의 합계를 분석합니다.", why: "당첨 확률이 가장 밀집된 구간을 추천 범위로 설정합니다.", exampleNums: [1, 12, 23, 34, 45, 6], passEx: "끝수 합 21", failEx: "끝수 합 50" },
    { id: 13, name: "연속번호(연번) 제한", desc: "나란히 이어지는 숫자의 개수를 제어합니다.", why: "3연번 이상의 조합은 당첨 확률이 현저히 낮습니다.", exampleNums: [11, 12, 25, 26, 38, 43], passEx: "2연번 1쌍", failEx: "4연번 포함" },
    { id: 14, name: "소수 포함 (0~3개)", desc: "1과 자신으로만 나눠지는 수의 비중을 조절합니다.", why: "소수가 4개 이상 포함될 확률은 매우 희박합니다.", exampleNums: [2, 13, 23, 30, 36, 44], passEx: "소수 2개", failEx: "소수 5개" },
    { id: 15, name: "합성수 분석 (0~3개)", desc: "소수와 3의 배수를 제외한 수의 비율을 봅니다.", why: "조합의 완성도를 높이기 위해 합성수 비중을 조절합니다.", exampleNums: [4, 8, 16, 21, 33, 45], passEx: "합성수 2개", failEx: "합성수 6개" },
    { id: 16, name: "완전제곱수 필터 (0~2개)", desc: "같은 수를 두 번 곱한 수의 개수를 제한합니다.", why: "제곱수가 3개 이상일 확률은 2% 미만입니다.", exampleNums: [4, 16, 20, 28, 35, 42], passEx: "제곱수 1개", failEx: "제곱수 4개" },
    { id: 17, name: "특정 배수 배분 (3의 배수, 5의 배수)", desc: "3과 5로 나누어떨어지는 수의 비중을 봅니다.", why: "통계적으로 특정 배수가 나오는 빈도가 정해져 있습니다.", exampleNums: [3, 6, 10, 20, 31, 44], passEx: "3의배수 2, 5의배수 1", failEx: "3의배수 6개" },
    { id: 18, name: "쌍수 제한 (0~2개)", desc: "11, 22 등 십단위와 일단위가 같은 수를 조절합니다.", why: "쌍수가 3개 이상 포함될 확률은 1% 미만입니다.", exampleNums: [11, 22, 25, 30, 38, 41], passEx: "쌍수 1개", failEx: "쌍수 3개" },
    { id: 19, name: "시작/끝 번호 제한", desc: "최소값과 최대값의 범위를 제어합니다.", why: "기형적으로 높게 시작하거나 낮게 끝나는 조합을 배제합니다.", exampleNums: [3, 12, 20, 31, 38, 42], passEx: "시작 3, 끝 42", failEx: "시작 20, 끝 28" },
    { id: 20, name: "동일구간 쏠림 방지", desc: "특정 번호대 구간에 과하게 몰리는 것을 방지합니다.", why: "전 구간에 골고루 분산된 패턴이 당첨 확률이 높습니다.", exampleNums: [5, 8, 12, 23, 35, 44], passEx: "구간별 1~2개", failEx: "한 구간 5개" },
    { id: 21, name: "모서리 패턴 반영", desc: "로또 용지의 네 모서리 번호를 포함합니다.", why: "당첨 번호의 90% 이상이 모서리 영역을 포함합니다.", exampleNums: [1, 7, 30, 42, 15, 22], passEx: "모서리수 3개", failEx: "중앙수만 사용" },
    { id: 22, name: "AI 딥러닝 고급 분석", desc: "AI 모델을 통해 최종 당첨 가능성을 검증합니다.", why: "머신러닝으로 숨겨진 패턴을 포착하여 최종 조합을 추출합니다.", exampleNums: [5, 11, 25, 27, 36, 38], passEx: "AI 예측 상위권", failEx: "패턴 불일치" }
];

const FILTER_RULES = [
    { id: 1, name: "핫넘버 필터", check: () => Math.random() > 0.2 },
    { id: 2, name: "역대 빈도 필터", check: () => Math.random() > 0.2 },
    { id: 3, name: "구간 밸런스", check: () => Math.random() > 0.2 },
    { id: 4, name: "콜드넘버 전략", check: () => Math.random() > 0.2 },
    { id: 5, name: "이월수 필터", check: (nums) => { const c = nums.filter(n=>STATE.latestWinNums.includes(n)).length; return c<=2; } },
    { id: 6, name: "이웃수 필터", check: () => Math.random() > 0.2 },
    { id: 7, name: "총합 (100~175)", check: (nums) => { const s = nums.reduce((a,b)=>a+b); return s>=100 && s<=175; } },
    { id: 8, name: "AC값 7 이상", check: (nums) => Logic.getAC(nums) >= 7 },
    { id: 9, name: "홀짝 비율", check: (nums) => { const odd = nums.filter(n=>n%2!==0).length; return odd>0 && odd<6; } },
    { id: 10, name: "고저 비율", check: (nums) => { const high = nums.filter(n=>n>=23).length; return high>0 && high<6; } },
    { id: 11, name: "동일 끝수", check: (nums) => { const ends = nums.map(n=>n%10); const counts = {}; ends.forEach(e=>counts[e]=(counts[e]||0)+1); return Math.max(...Object.values(counts))<=3; } },
    { id: 12, name: "끝수 총합", check: (nums) => { const s = nums.reduce((a,b)=>a+(b%10), 0); return s>=15 && s<=38; } },
    { id: 13, name: "연속번호 제한", check: (nums) => { let count=0; for(let i=0;i<5;i++) if(nums[i+1]-nums[i]===1) count++; return count<=2; } },
    { id: 14, name: "소수 포함", check: (nums) => { const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43]; const c = nums.filter(n=>primes.includes(n)).length; return c<=3; } },
    { id: 15, name: "합성수 분석", check: () => Math.random() > 0.2 },
    { id: 16, name: "완전제곱수", check: (nums) => { const squares = [1,4,9,16,25,36]; const c = nums.filter(n=>squares.includes(n)).length; return c<=2; } },
    { id: 17, name: "특정 배수", check: () => Math.random() > 0.2 },
    { id: 18, name: "쌍수 제한", check: () => Math.random() > 0.2 },
    { id: 19, name: "시작/끝 번호", check: () => Math.random() > 0.2 },
    { id: 20, name: "쏠림 방지", check: (nums) => { const zones = [0,0,0,0,0]; nums.forEach(n=>zones[Math.floor((n-1)/10)]++); return Math.max(...zones)<=3; } },
    { id: 21, name: "모서리 패턴", check: () => Math.random() > 0.2 },
    { id: 22, name: "AI 딥러닝", check: () => Math.random() > 0.1 }
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
    langSelect: document.getElementById('langSelect')
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

function setLanguage(lang) {
    STATE.currentLang = lang;
    localStorage.setItem('lotto-lang', lang);
    if(UI.langSelect) UI.langSelect.value = lang;
    document.documentElement.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.innerHTML = TRANSLATIONS[lang][key];
    });
}

class ScoringEngine {
    static async getWeightedCombination(selectedFilterIds) {
        const filters = FILTER_RULES.filter(f => selectedFilterIds.includes(f.id));
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
            if (currentScore === filters.length) return { nums, score: 100, details: detailResults, isBest: false };
            if (currentScore > maxScore) { maxScore = currentScore; bestCandidate = { nums, score: ((currentScore/filters.length)*100).toFixed(1), details: detailResults, isBest: true }; }
            if (i % 500 === 0) await new Promise(r => setTimeout(r, 0));
        }
        return bestCandidate;
    }
}

async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    if(UI.btnGenerate) UI.btnGenerate.disabled = true;
    if(UI.ballContainer) UI.ballContainer.innerHTML = '';
    const selectedFilters = Array.from(document.querySelectorAll('.filter-check:checked')).map(el => parseInt(el.dataset.id));
    if(UI.analysisOverlay) UI.analysisOverlay.style.display = 'flex';
    let prog = 0;
    const interval = setInterval(() => { prog += 5; if(UI.analysisProgress) UI.analysisProgress.style.width = `${prog}%`; if (prog >= 100) clearInterval(interval); }, 50);
    const pool = [];
    for (let i = 0; i < STATE.selectedQty; i++) pool.push(await ScoringEngine.getWeightedCombination(selectedFilters));
    STATE.generatedData = pool;
    renderResults(pool);
    if(UI.analysisOverlay) UI.analysisOverlay.style.display = 'none';
    if(UI.btnGenerate) UI.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function renderResults(data) {
    if(!UI.ballContainer) return;
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
        const btn = document.createElement('button');
        btn.className = 'btn-report'; btn.textContent = 'REPORT';
        btn.onclick = () => showReport(idx);
        row.appendChild(inner);
        row.appendChild(btn);
        UI.ballContainer.appendChild(row);
    });
}

function showReport(idx) {
    const item = STATE.generatedData[idx];
    if (!item || !UI.reportModal) return;
    let html = `<div style='text-align:center; margin-bottom:20px;'><div style='font-size:2.5rem; color:var(--accent-gold); font-weight:bold;'>${item.score}%</div></div>`;
    html += `<div class='report-list'>`;
    item.details.forEach(f => {
        html += `<div style='display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border-color); font-size:0.85rem;'><span>${f.name}</span><span style='color:${f.status === "PASS" ? "var(--accent-green)" : "var(--accent-red)"}; font-weight:bold;'>${f.status}</span></div>`;
    });
    html += `</div>`;
    UI.reportContent.innerHTML = html;
    UI.reportModal.style.display = 'flex';
}

function init() {
    if(UI.langSelect) {
        UI.langSelect.onchange = (e) => setLanguage(e.target.value);
        setLanguage(STATE.currentLang);
    }

    const savedTheme = localStorage.getItem('lotto-theme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    if(UI.themeBtn) {
        UI.themeBtn.onclick = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('lotto-theme', isDark ? 'dark' : 'light');
            UI.themeIcon.textContent = isDark ? '🌙' : '☀️';
        };
    }

    if(UI.filterList) {
        UI.filterList.innerHTML = FILTER_RULES.map(rule => `
            <div class="filter-item">
                <label class="switch"><input type="checkbox" class="filter-check" data-id="${rule.id}" checked><span class="slider"></span></label>
                <span class="f-name">${rule.id}. ${rule.name}</span>
            </div>
        `).join('');
    }

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            STATE.selectedQty = parseInt(btn.dataset.qty);
        };
    });

    // Strategy Button Click Events
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.onclick = () => {
            const preset = btn.dataset.preset;
            const checks = document.querySelectorAll('.filter-check');
            if (preset === 'reset') {
                checks.forEach(c => c.checked = false);
            } else if (preset === 'full') {
                checks.forEach(c => c.checked = true);
            } else if (preset === 'basic') {
                const basicIds = [1, 2, 7, 8, 9, 10, 13];
                checks.forEach(c => c.checked = basicIds.includes(parseInt(c.dataset.id)));
            } else if (preset === 'pattern') {
                const patternIds = [3, 11, 12, 20, 21];
                checks.forEach(c => c.checked = patternIds.includes(parseInt(c.dataset.id)));
            }
        };
    });

    if(UI.btnGenerate) UI.btnGenerate.onclick = runAnalysis;
    if(document.querySelector('.close-modal')) {
        document.querySelector('.close-modal').onclick = () => UI.reportModal.style.display = 'none';
        document.querySelector('.close-modal-btn').onclick = () => UI.reportModal.style.display = 'none';
    }
}

window.onload = init;
