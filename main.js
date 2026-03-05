/**
 * LOTTOBUGGING v7.5 - Scoring Engine & i18n
 */

const STATE = {
    selectedQty: 1,
    isAnalyzing: false,
    generatedData: [],
    latestWinNums: [5, 11, 25, 27, 36, 38],
    currentLang: localStorage.getItem('lotto-lang') || 'ko'
};

const TRANSLATIONS = {
    ko: {
        tagline: "Data Science Solution for Lottery Probability",
        nav_analyzer: "AI 분석기",
        nav_columns: "통계 칼럼",
        nav_methodology: "분석 방법론",
        nav_filters: "필터 가이드",
        nav_about: "서비스 안내",
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
        footer_privacy: "개인정보처리방침",
        footer_terms: "이용약관",
        footer_contact: "문의하기",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "분석 리포트",
        processing: "데이터 분석 중...",
        optimal_badge: "최적 조합",
        lang_display: "언어 선택"
    },
    en: {
        tagline: "Data Science Solution for Lottery Probability",
        nav_analyzer: "AI Analyzer",
        nav_columns: "Stats Columns",
        nav_methodology: "Methodology",
        nav_filters: "Filter Guide",
        nav_about: "About",
        analyzer_title: "AI Lotto Analysis System",
        welcome_title: "Data-Driven Decision System",
        welcome_desc: "Removing statistical noise through a 22-step filtering algorithm.",
        prob_label: "Algorithm Fitness Score",
        system_ready: "SYSTEM READY",
        qty_label: "Extraction Quantity",
        btn_generate: "Run Analysis & Generate",
        strategy_header: "Analysis Strategy",
        preset_basic: "Basic Stats",
        preset_pattern: "Pattern Focus",
        preset_full: "AI Precision",
        preset_reset: "Reset",
        filter_header: "Filtering Protocol",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Use",
        footer_contact: "Contact Us",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "ANALYSIS REPORT",
        processing: "PROCESSING DATA...",
        optimal_badge: "OPTIMAL",
        lang_display: "Language"
    },
    ja: {
        tagline: "ロト確率のためのデータサイエンスソリューション",
        nav_analyzer: "AI分析機",
        nav_columns: "統計コラム",
        nav_methodology: "分析手法",
        nav_filters: "フィルターガイド",
        nav_about: "サービス案内",
        analyzer_title: "人工知能ロト番号分析システム",
        welcome_title: "データ駆動型意思決定システム",
        welcome_desc: "22段階のフィルタリングアルゴリズムにより統計的ノイズを除去します。",
        prob_label: "Algorithm Fitness Score",
        system_ready: "SYSTEM READY",
        qty_label: "抽出データセット (Quantity)",
        btn_generate: "データ分析および組合せ生成実行",
        strategy_header: "分析戦略",
        preset_basic: "標準統計",
        preset_pattern: "パターン集中",
        preset_full: "AI精密",
        preset_reset: "初期化",
        filter_header: "フィルタリング条件",
        footer_privacy: "個人情報処理方針",
        footer_terms: "利用規約",
        footer_contact: "お問い合わせ",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "分析レポート",
        processing: "データ分析中...",
        optimal_badge: "最適組合せ",
        lang_display: "言語選択"
    }
};

const FILTER_DETAILS = [
    { id: 1, name: { ko: "최근 5주간 당첨번호 비율 (핫넘버)", en: "Hot Numbers (Last 5 Weeks)", ja: "直近5週間の当選番号比率" }, desc: { ko: "최근 5주간 출현 빈도가 높은 번호를 우선 선별합니다.", en: "Prioritizes numbers that appeared frequently in the last 5 weeks.", ja: "直近5週間で出現頻度の高い番号を優先的に選別します。" } },
    { id: 2, name: { ko: "역대 최다 당첨번호 반영", en: "Historical High Frequency", ja: "歴代最多当選番号の反映" }, desc: { ko: "누적 빅데이터를 분석하여 당첨 횟수가 가장 많은 번호를 포함합니다.", en: "Includes numbers with the highest historical winning frequency.", ja: "累積ビッグデータを分析し、当選回数が最も多い番号を含めます。" } },
    { id: 3, name: { ko: "색상 분포 비율 최적화", en: "Color Distribution", ja: "カラー分布比率の最適化" }, desc: { ko: "5개 구간(색상)의 비율을 분석하여 최적의 밸런스를 찾습니다.", en: "Optimizes balance across 5 color-coded number ranges.", ja: "5つの区間（カラー）の比率を分析し、最適なバランスを見つけます。" } },
    { id: 4, name: { ko: "최근 5주간 미출수 전략", en: "Cold Numbers (Last 5 Weeks)", ja: "直近5週間の未出現数戦略" }, desc: { ko: "장기 미출현 번호 중 반등 확률이 높은 번호를 선별합니다.", en: "Selects numbers that haven't appeared recently but are due.", ja: "長期間出現していない番号の中から、反発確率の高い番号を選別します。" } },
    { id: 5, name: { ko: "직전 회차 이월수 (0~2개)", en: "Previous Draw Carry-over", ja: "前回の繰越し数" }, desc: { ko: "지난주 당첨 번호가 다시 출현하는 현상을 반영합니다.", en: "Includes 0-2 numbers from the immediate previous draw.", ja: "前回の当選番号が再び出現する現象を反映します。" } },
    { id: 6, name: { ko: "직전 회차 이웃수 (1~3개)", en: "Previous Draw Neighbors", ja: "前回の隣接数" }, desc: { ko: "당첨 번호의 바로 옆 번호를 분석합니다.", en: "Includes numbers adjacent (±1) to the previous winning numbers.", ja: "当選番号のすぐ隣の番号を分析します。" } },
    { id: 7, name: { ko: "총합 구간 (100~175)", en: "Total Sum Range", ja: "総和区間" }, desc: { ko: "번호 6개의 총합을 안정적인 범위로 제한합니다.", en: "Ensures the total sum of 6 numbers is between 100 and 175.", ja: "番号6個の総和を安定した範囲（100〜175）に制限します。" } },
    { id: 8, name: { ko: "AC값 7 이상", en: "AC Value (Complexity) 7+", ja: "AC値7以上" }, desc: { ko: "번호 간의 차잇값 무작위성을 수치화합니다.", en: "Measures the arithmetic complexity of the combination.", ja: "番号間の差分値のランダム性を数値化します。" } },
    { id: 9, name: { ko: "홀짝 비율 (6:0, 0:6 제외)", en: "Odd:Even Ratio", ja: "奇数・偶数比率" }, desc: { ko: "홀수와 짝수의 균형을 맞춥니다.", en: "Balances the ratio of odd and even numbers.", ja: "奇数と偶数のバランスを調整します。" } },
    { id: 10, name: { ko: "고저 비율 (6:0, 0:6 제외)", en: "High:Low Ratio", ja: "高低比率" }, desc: { ko: "23번 기준 낮은 번호와 높은 번호를 배분합니다.", en: "Balances numbers above and below the median (23).", ja: "23番を基準に低い番号と高い番号を配分します。" } },
    { id: 11, name: { ko: "동일 끝수 (0~3개 포함)", en: "Same Ending Digit", ja: "同一末尾" }, desc: { ko: "각 번호의 일의 자리가 같은 번호 개수를 제한합니다.", en: "Limits the number of digits sharing the same last digit.", ja: "各番号の下1桁が同じ番号の個数を制限します。" } },
    { id: 12, name: { ko: "끝수 총합 (15~38)", en: "Last Digit Sum", ja: "末尾総和" }, desc: { ko: "일의 자리 숫자들의 합계를 분석합니다.", en: "Analyzes the sum of the last digits of all 6 numbers.", ja: "下1桁の数字の合計を分析します。" } },
    { id: 13, name: { ko: "연속번호(연번) 제한", en: "Consecutive Numbers", ja: "連続番号制限" }, desc: { ko: "나란히 이어지는 숫자의 개수를 제어합니다.", en: "Controls the occurrence of consecutive numbers (e.g., 1, 2).", ja: "隣り合う数字の個数を制御します。" } },
    { id: 14, name: { ko: "소수 포함 (0~3개)", en: "Prime Numbers", ja: "素数含む" }, desc: { ko: "1과 자신으로만 나눠지는 수의 비중을 조절합니다.", en: "Adjusts the weight of prime numbers in the combination.", ja: "1とその数以外で割り切れない素数の比重を調整します。" } },
    { id: 15, name: { ko: "합성수 분석 (0~3개)", en: "Composite Numbers", ja: "合成数分析" }, desc: { ko: "소수와 3의 배수를 제외한 수의 비율을 봅니다.", en: "Adjusts the ratio of composite numbers.", ja: "素数と3の倍数を除いた数の比率を確認します。" } },
    { id: 16, name: { ko: "완전제곱수 필터 (0~2개)", en: "Perfect Squares", ja: "完全平方数フィルタ" }, desc: { ko: "같은 수를 두 번 곱한 수의 개수를 제한합니다.", en: "Limits numbers like 1, 4, 9, 16, 25, 36.", ja: "同じ数を2回掛けた数の個数を制限します。" } },
    { id: 17, name: { ko: "특정 배수 배분", en: "Specific Multiples", ja: "特定倍数配分" }, desc: { ko: "3과 5로 나누어떨어지는 수의 비중을 봅니다.", en: "Balances multiples of 3 and 5.", ja: "3と5で割り切れる数の比重を確認します。" } },
    { id: 18, name: { ko: "쌍수 제한 (0~2개)", en: "Double Numbers", ja: "双数制限" }, desc: { ko: "11, 22 등 십단위와 일단위가 같은 수를 조절합니다.", en: "Limits numbers like 11, 22, 33, 44.", ja: "11、22など10の位と1の位が同じ数字を調整します。" } },
    { id: 19, name: { ko: "시작/끝 번호 제한", en: "Start/End Range", ja: "開始・終了番号制限" }, desc: { ko: "최소값과 최대값의 범위를 제어합니다.", en: "Controls the range of the smallest and largest numbers.", ja: "最小値と最大値の範囲を制御します。" } },
    { id: 20, name: { ko: "동일구간 쏠림 방지", en: "Zone Crowding Prevention", ja: "同一区間偏り防止" }, desc: { ko: "특정 번호대 구간에 과하게 몰리는 것을 방지합니다.", en: "Prevents too many numbers from falling into one 10-digit range.", ja: "特定の番号帯区間に過度に集中するのを防ぎます。" } },
    { id: 21, name: { ko: "모서리 패턴 반영", en: "Corner Patterns", ja: "コーナーパターン反映" }, desc: { ko: "로또 용지의 네 모서리 번호를 포함합니다.", en: "Includes numbers from the corners of the lottery slip.", ja: "ロト用紙の四隅の番号を含めます。" } },
    { id: 22, name: { ko: "AI 딥러닝 고급 분석", en: "AI Deep Learning", ja: "AIディープラーニング" }, desc: { ko: "AI 모델을 통해 최종 당첨 가능성을 검증합니다.", en: "Final verification using a trained AI machine learning model.", ja: "AIモデルを通じて最終的な当選可能性を検証します。" } }
];

const FILTER_RULES = FILTER_DETAILS.map(f => ({
    id: f.id,
    name: f.name,
    check: (nums) => {
        if (f.id === 7) { const s = nums.reduce((a,b)=>a+b); return s>=100 && s<=175; }
        if (f.id === 8) return Logic.getAC(nums) >= 7;
        if (f.id === 9) { const odd = nums.filter(n=>n%2!==0).length; return odd>0 && odd<6; }
        if (f.id === 10) { const high = nums.filter(n=>n>=23).length; return high>0 && high<6; }
        if (f.id === 13) { let count=0; for(let i=0;i<5;i++) if(nums[i+1]-nums[i]===1) count++; return count<=2; }
        return Math.random() > 0.2; // Default mock logic for others
    }
}));

const UI = {
    filterList: document.getElementById('filterList'),
    ballContainer: document.getElementById('ballContainer'),
    optimizationScore: document.getElementById('optimizationScore'),
    btnGenerate: document.getElementById('btnGenerate'),
    analysisOverlay: document.getElementById('analysisOverlay'),
    analysisProgress: document.getElementById('analysisProgress'),
    reportModal: document.getElementById('reportModal'),
    reportContent: document.getElementById('reportContent'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    langDisplay: document.getElementById('langDisplay')
};

const Logic = {
    getAC: (nums) => {
        let diffs = new Set();
        for (let i = 0; i < 6; i++) {
            for (let j = i + 1; j < 6; j++) diffs.add(Math.abs(nums[i] - nums[j]));
        }
        return diffs.size - 5;
    },
    generateRandomSet: () => {
        let nums = new Set();
        while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
        return Array.from(nums).sort((a, b) => a - b);
    }
};

/** Full Page Translation */
function setLanguage(lang) {
    STATE.currentLang = lang;
    localStorage.setItem('lotto-lang', lang);
    document.documentElement.lang = lang === 'ko' ? 'ko-KR' : lang === 'en' ? 'en-US' : 'ja-JP';

    // Update data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.innerHTML = TRANSLATIONS[lang][key];
    });

    // Update active pill styling
    document.querySelectorAll('.lang-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(lang));
    });

    // Re-render filters with translated names
    renderFilters();
    
    // Close dropdown if exists
    const menu = document.querySelector('.lang-dropdown-menu');
    if(menu) menu.classList.remove('show');
}

function renderFilters() {
    if(!UI.filterList) return;
    UI.filterList.innerHTML = FILTER_DETAILS.map(f => `
        <div class="filter-item">
            <label class="switch"><input type="checkbox" class="filter-check" data-id="${f.id}" checked><span class="slider"></span></label>
            <span class="f-name">${f.id}. ${f.name[STATE.currentLang]}</span>
        </div>
    `).join('');
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
                detailResults.push({ name: f.name[STATE.currentLang], status: pass ? "PASS" : "FAIL" });
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
    setLanguage(STATE.currentLang);

    const savedTheme = localStorage.getItem('lotto-theme') || 'light';
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    if(UI.themeBtn) {
        UI.themeBtn.onclick = () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('lotto-theme', isDark ? 'dark' : 'light');
            UI.themeIcon.textContent = isDark ? '🌙' : '☀️';
        };
    }

    // Language Dropdown Toggle
    const langBtn = document.querySelector('.lang-dropdown-btn');
    const langMenu = document.querySelector('.lang-dropdown-menu');
    if(langBtn) {
        langBtn.onclick = (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        };
        window.onclick = () => langMenu.classList.remove('show');
    }

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            STATE.selectedQty = parseInt(btn.dataset.qty);
        };
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const preset = btn.dataset.preset;
            const checks = document.querySelectorAll('.filter-check');
            if (preset === 'reset') checks.forEach(c => c.checked = false);
            else if (preset === 'full') checks.forEach(c => c.checked = true);
            else if (preset === 'basic') { const ids = [1, 2, 7, 8, 9, 10, 13]; checks.forEach(c => c.checked = ids.includes(parseInt(c.dataset.id))); }
            else if (preset === 'pattern') { const ids = [3, 11, 12, 20, 21]; checks.forEach(c => c.checked = ids.includes(parseInt(c.dataset.id))); }
        };
    });

    if(UI.btnGenerate) UI.btnGenerate.onclick = runAnalysis;
    if(document.querySelector('.close-modal')) {
        document.querySelector('.close-modal').onclick = () => UI.reportModal.style.display = 'none';
        document.querySelector('.close-modal-btn').onclick = () => UI.reportModal.style.display = 'none';
    }
}

window.onload = init;
