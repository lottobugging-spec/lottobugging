/**
 * LOTTOBUGGING v12.0 - Global Modular Lotto Engine Integration
 */
import { GlobalLottoEngine } from './LottoEngine.js';
import { LOTTO_CONFIGS } from './LottoConfig.js';
import { FILTER_DETAILS } from './FilterData.js';

export const STATE = {
    selectedQty: 1,
    isAnalyzing: false,
    generatedData: [],
    latestWinNums: [5, 11, 25, 27, 36, 38],
    currentLang: localStorage.getItem('lotto-lang') || 'ko',
    aiModel: null,
    currentMode: 'full',
    currentLottoType: 'KOREA_645'
};

export { FILTER_DETAILS };

// 엔진 초기화
let engine = new GlobalLottoEngine(STATE.currentLottoType);

// AI 엔진 초기화
async function initAI() {
    let retry = 0;
    while (typeof window.tf === 'undefined' && retry < 6) {
        await new Promise(r => setTimeout(r, 500));
        retry++;
    }

    if (typeof window.tf !== 'undefined' && !STATE.aiModel) {
        try {
            const tf = window.tf;
            const model = tf.sequential();
            model.add(tf.layers.dense({units: 16, inputShape: [6], activation: 'relu'}));
            model.add(tf.layers.dense({units: 8, activation: 'sigmoid'}));
            model.add(tf.layers.dense({units: 1, activation: 'linear'}));
            model.compile({optimizer: 'adam', loss: 'meanSquaredError'});
            STATE.aiModel = model;
        } catch(e) { /* silent fallback */ }
    }
}

async function predictFitness(nums) {
    if (!STATE.aiModel || typeof window.tf === 'undefined') return 0.5;
    try {
        const tf = window.tf;
        // 엔진 설정에 따라 입력 형태 조정 (기본 6개 기준)
        const inputNums = nums.slice(0, 6);
        while(inputNums.length < 6) inputNums.push(0);
        const input = tf.tensor2d([inputNums.map(n => n / 70)]); // 정규화 범위 확대
        const prediction = STATE.aiModel.predict(input);
        const score = await prediction.data();
        input.dispose(); prediction.dispose();
        return Math.min(1, Math.max(0, score[0] + 0.5));
    } catch(e) { return 0.5; }
}

const TRANSLATIONS = {
    ko: {
        tagline: "Data Science Solution for Lottery Probability",
        nav_analyzer: "AI 분석기", nav_columns: "통계 칼럼", nav_methodology: "분석 방법론", nav_filters: "필터 가이드", nav_about: "서비스 안내",
        analyzer_title: "인공지능 로또 번호 분석 시스템", welcome_title: "로또버깅", welcome_desc: "무료 AI 로또 필터링 분석",
        prob_label: "Algorithm Fitness Score", system_ready: "SYSTEM READY", qty_label: "추출 수량 설정",
        btn_generate: "데이터 분석 및 조합 생성 실행", 
        filter_header: "필터링 조건", footer_privacy: "개인정보처리방침", footer_terms: "이용약관",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "분석 리포트", processing: "데이터 분석 중...", optimal_badge: "최적 조합", lang_display: "언어 선택",
        chart_stability: "통계 적합도", chart_randomness: "조합 복잡도", chart_balance: "수치 균형도", chart_pattern: "패턴 최적화", chart_momentum: "AI 분석 지수",
        streaming_status: "최적 조합 탐색 중...", total_fitness: "종합 적합도", share_title: "분석 결과 주변에 공유하기", share_kakao: "카카오톡", share_facebook: "페이스북", share_twitter: "X (트위터)", share_copy: "URL 복사", copied: "URL이 복사되었습니다!"
    },
    en: {
        tagline: "Data Science Solution for Lottery Probability",
        nav_analyzer: "AI Analyzer", nav_columns: "Stats Columns", nav_methodology: "Methodology", nav_filters: "Filter Guide", nav_about: "About",
        analyzer_title: "AI Lotto Analysis System", welcome_title: "LottoBugging", welcome_desc: "Free AI Lotto Filtering Analysis",
        prob_label: "Algorithm Fitness Score", system_ready: "SYSTEM READY", qty_label: "Extraction Quantity",
        btn_generate: "Run Analysis & Generate", 
        filter_header: "Filtering Protocol", footer_privacy: "Privacy Policy", footer_terms: "Terms of Use",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "ANALYSIS REPORT", processing: "PROCESSING DATA...", optimal_badge: "OPTIMAL", lang_display: "Language",
        chart_stability: "Statistical Fitness", chart_randomness: "Complexity", chart_balance: "Numeric Balance", chart_pattern: "Pattern Optimization", chart_momentum: "AI Analysis Index",
        streaming_status: "Searching Optimal...", total_fitness: "Total Fitness", share_title: "Share Results", share_kakao: "KakaoTalk", share_facebook: "Facebook", share_twitter: "X (Twitter)", share_copy: "Copy URL", copied: "URL Copied!"
    },
    ja: {
        tagline: "ロト確率のためのデータサイエンスソリューション",
        nav_analyzer: "AI分析機", nav_columns: "統計コラム", nav_methodology: "分析手法", nav_filters: "フィルターガイド", nav_about: "サービス案内",
        analyzer_title: "人工知能로또 번호 분석 시스템", welcome_title: "로또버깅", welcome_desc: "無料AIロトフィルタリング分析",
        prob_label: "Algorithm Fitness Score", system_ready: "SYSTEM READY", qty_label: "抽出セット設定",
        btn_generate: "データ分析と組合せ生成実行", 
        filter_header: "フィルタリング条件", footer_privacy: "個人情報保護方針", footer_terms: "利用規約",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "分析レポート", processing: "데이터 분석 중...", optimal_badge: "最適組合せ", lang_display: "言語選択",
        chart_stability: "統計適合度", chart_randomness: "組合せ複雑度", chart_balance: "数値バランス", chart_pattern: "パターン最適化", chart_momentum: "AI分析指数",
        streaming_status: "最適解を探索中...", total_fitness: "総合適合度", share_title: "結果を共有する", share_kakao: "カカ오톡", share_facebook: "Facebook", share_twitter: "X (Twitter)", share_copy: "URLコピー", copied: "URLがコピーされました！"
    }
};

let hotLast5 = [], coldLast5 = [], historicTop = [];

async function loadStats() {
    try {
        const [res1, res2] = await Promise.all([
            fetch('/data/last5_stats.json').then(r => r.json()),
            fetch('/data/historic_top.json').then(r => r.json())
        ]);
        hotLast5 = res1.hotLast5 || [];
        coldLast5 = res1.coldLast5 || [];
        historicTop = res2.top || [];
        engine.setStats({ hotLast5, coldLast5, historicTop });
    } catch (e) { console.warn('Stats load failed'); }
}

const UI = {
    filterList: document.getElementById('filterList'),
    ballContainer: document.getElementById('ballContainer'),
    btnGenerate: document.getElementById('btnGenerate'),
    reportModal: document.getElementById('reportModal'),
    reportContent: document.getElementById('reportContent'),
    themeBtn: document.getElementById('themeBtn'),
    themeIcon: document.getElementById('themeIcon'),
    lottoTypeSelect: document.getElementById('lottoTypeSelect'),
    openFilterDrawer: document.getElementById('openFilterDrawer'),
    closeFilterDrawer: document.getElementById('closeFilterDrawer'),
    filterDrawer: document.getElementById('filterDrawer'),
    filterDrawerOverlay: document.getElementById('filterDrawerOverlay'),
    applyFiltersBtn: document.getElementById('applyFiltersBtn')
};

function toggleFilterDrawer(isOpen) {
    if (isOpen) {
        UI.filterDrawerOverlay.classList.remove('hidden');
        setTimeout(() => {
            UI.filterDrawerOverlay.style.opacity = '1';
            UI.filterDrawer.style.right = '0';
        }, 10);
        document.body.style.overflow = 'hidden';
    } else {
        UI.filterDrawerOverlay.style.opacity = '0';
        UI.filterDrawer.style.right = '-100%';
        setTimeout(() => {
            UI.filterDrawerOverlay.classList.add('hidden');
        }, 300);
        document.body.style.overflow = 'auto';
    }
}

function updateActiveBadge() {
    const count = document.querySelectorAll('.filter-check:checked').length;
    const el = document.getElementById('activeFilterCount');
    if (el) el.textContent = `${count} Active`;
}

function renderFilters() {
    if(!UI.filterList) return;
    UI.filterList.innerHTML = FILTER_DETAILS.map(f => `
        <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0">
            <div class="flex items-center gap-3">
                <span class="text-[10px] font-bold text-primary bg-primary/10 w-5 h-5 flex items-center justify-center rounded-md">${f.id}</span>
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">${f.name[STATE.currentLang]}</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="filter-check sr-only peer" data-id="${f.id}" checked onchange="updateActiveBadge()">
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    `).join('');
    updateActiveBadge();
}

async function runAnalysis() {
    if (STATE.isAnalyzing) return;
    STATE.isAnalyzing = true;
    UI.btnGenerate.disabled = true;
    UI.ballContainer.innerHTML = `<div class="inline-loader" style="display:flex;"><div class="spinner"></div><div class="loader-text">${TRANSLATIONS[STATE.currentLang].streaming_status}</div></div>`;
    
    const selectedIds = Array.from(document.querySelectorAll('.filter-check:checked')).map(el => parseInt(el.dataset.id));
    const results = [];
    
    for (let i = 0; i < STATE.selectedQty; i++) {
        const item = await engine.getWeightedCandidate(selectedIds, 400, selectedIds.includes(22) ? predictFitness : null);
        results.push(item);
        renderSingleResult(item, i);
    }
    
    STATE.generatedData = results;
    const loader = UI.ballContainer.querySelector('.inline-loader');
    if (loader) loader.remove();
    UI.btnGenerate.disabled = false;
    STATE.isAnalyzing = false;
}

function renderSingleResult(item, idx) {
    if (!item || !item.mainBalls) return; 
    if (idx === 0) { const w = UI.ballContainer.querySelector('.welcome-msg'); if (w) w.remove(); }
    
    const row = document.createElement('div');
    row.className = 'result-row';
    
    let ballsHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px;">`;
    
    // 메인 볼 렌더링
    const config = LOTTO_CONFIGS[STATE.currentLottoType];
    item.mainBalls.forEach((n, i) => {
        let color = "gray";
        if (STATE.currentLottoType === 'KOREA_645') {
            color = n <= 10 ? "yellow" : n <= 20 ? "blue" : n <= 30 ? "red" : n <= 40 ? "gray" : "green";
        } else {
            color = config.colors[0];
        }
        ballsHtml += `<div class="ball" data-color="${color}">${n}</div>`;
    });

    // 보너스 볼 렌더링
    if (item.bonusBalls && item.bonusBalls.length > 0) {
        item.bonusBalls.forEach(n => {
            const color = config.colors[1] || "green";
            ballsHtml += `<div class="ball" data-color="${color}" style="border: 3px solid #FFD700;">${n}</div>`;
        });
    }

    ballsHtml += `</div>`;
    row.innerHTML = ballsHtml;
    
    const btn = document.createElement('button');
    btn.className = 'btn-report'; btn.textContent = 'REPORT';
    btn.onclick = () => showReport(idx);
    row.appendChild(btn);
    
    const loader = UI.ballContainer.querySelector('.inline-loader');
    if (loader) UI.ballContainer.insertBefore(row, loader); else UI.ballContainer.appendChild(row);
}

function calculateReportStats(item) {
    if (!item) return [0,0,0,0,0];
    const stability = 85; 
    const complexity = 90;
    const balance = 88;
    const pattern = 82;
    const aiIndex = parseFloat(item.aiScore) || 50;
    return [stability, complexity, balance, pattern, aiIndex];
}

let currentChart = null;
function showReport(idx) {
    const item = STATE.generatedData[idx];
    if (!item) return;
    const lang = TRANSLATIONS[STATE.currentLang];
    const statsData = calculateReportStats(item);
    document.body.style.overflow = 'hidden';
    UI.reportContent.innerHTML = `
        <div style="text-align:center; margin-bottom:20px;">
            <div style="width:100%; max-width:280px; margin: 0 auto; min-height: 280px; position: relative;"><canvas id="radarChart"></canvas></div>
            <div style="font-size:2.5rem; color:var(--accent-gold); font-weight:bold; margin-top:10px;">${item.score}%</div>
            <p style="color:var(--text-dim);">${lang.total_fitness}</p>
        </div>
    `;
    UI.reportModal.style.display = 'flex';
    setTimeout(() => {
        const ctx = document.getElementById('radarChart').getContext('2d');
        if (currentChart) currentChart.destroy();
        const isDark = document.body.classList.contains('dark-mode');
        currentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [lang.chart_stability, lang.chart_randomness, lang.chart_balance, lang.chart_pattern, lang.chart_momentum],
                datasets: [{
                    data: statsData,
                    backgroundColor: 'rgba(236, 91, 19, 0.2)', borderColor: '#ec5b13', borderWidth: 2, pointBackgroundColor: '#ec5b13', pointRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { r: { beginAtZero: true, max: 100, min: 0, stepSize: 20, ticks: { display: false }, grid: { circular: false, color: isDark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)' }, pointLabels: { font: { size: 12, weight: 'bold' }, color: isDark?'#8b949e':'#57606a' } } },
                plugins: { legend: { display: false } }
            }
        });
    }, 150);
}

function closeModal() { if (UI.reportModal) UI.reportModal.style.display = 'none'; document.body.style.overflow = 'auto'; }

window.setLanguage = function(lang) {
    STATE.currentLang = lang; localStorage.setItem('lotto-lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.innerHTML = TRANSLATIONS[lang][key];
    });
    renderFilters();
}

function init() {
    window.setLanguage(STATE.currentLang); initAI();
    loadStats();
    
    if (UI.themeBtn) {
        UI.themeBtn.onclick = () => { 
            const isDark = document.body.classList.toggle('dark-mode'); 
            localStorage.setItem('lotto-theme', isDark?'dark':'light'); 
            if (UI.themeIcon) UI.themeIcon.textContent = isDark?'dark_mode':'light_mode'; 
        };
    }

    if (UI.lottoTypeSelect) {
        UI.lottoTypeSelect.onchange = (e) => {
            STATE.currentLottoType = e.target.value;
            engine = new GlobalLottoEngine(STATE.currentLottoType);
            engine.setStats({ hotLast5, coldLast5, historicTop });
            UI.ballContainer.innerHTML = `<div class="welcome-msg text-center"><h3 class="text-5xl font-black text-primary mb-2">${LOTTO_CONFIGS[STATE.currentLottoType].name}</h3><p class="text-slate-500 dark:text-slate-400 font-medium">Ready to Analyze</p></div>`;
        };
    }

    // Filter Drawer Listeners
    if (UI.openFilterDrawer) UI.openFilterDrawer.onclick = () => toggleFilterDrawer(true);
    if (UI.closeFilterDrawer) UI.closeFilterDrawer.onclick = () => toggleFilterDrawer(false);
    if (UI.filterDrawerOverlay) UI.filterDrawerOverlay.onclick = () => toggleFilterDrawer(false);
    if (UI.applyFiltersBtn) UI.applyFiltersBtn.onclick = () => toggleFilterDrawer(false);

    document.querySelectorAll('.qty-btn').forEach(btn => { 
        btn.onclick = () => { 
            document.querySelectorAll('.qty-btn').forEach(b => b.classList.remove('active')); 
            btn.classList.add('active'); 
            STATE.selectedQty = parseInt(btn.dataset.qty); 
        }; 
    });
    
    if (UI.btnGenerate) UI.btnGenerate.onclick = runAnalysis;
    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(el => el.onclick = closeModal);
}

window.onload = init;
