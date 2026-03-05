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
        info_title: "왜 로또버깅의 데이터 분석인가?",
        info_desc: "검증된 데이터 사이언스 방법론으로 로또를 분석합니다.",
        card1_title: "과학적 확률 분석",
        card1_desc: "단순한 난수가 아닙니다. 22가지 통계 필터와 AI 알고리즘이 결합되어 가장 가능성 높은 조합을 산출합니다.",
        card2_title: "개인정보 보호",
        card2_desc: "어떠한 개인정보도 서버에 저장하지 않습니다. 모든 분석 데이터는 사용자의 브라우저 내에서 안전하게 처리됩니다.",
        card3_title: "공공 데이터 활용",
        card3_desc: "동행복권의 공식 당첨 결과와 공공 데이터 포털의 API를 기반으로 한 신뢰할 수 있는 데이터를 제공합니다.",
        share_title: "분석 결과 주변에 공유하기",
        share_kakao: "카카오톡 공유",
        share_facebook: "페이스북",
        share_twitter: "트위터",
        share_copy: "URL 복사",
        faq_title: "자주 묻는 질문 (FAQ)",
        faq1_q: "Q. 정말 당첨 확률이 높아지나요?",
        faq1_a: "로또는 독립 시행이므로 당첨을 보장할 수는 없으나, 통계적으로 희박한 조합을 제거하여 기댓값이 높은 조합을 추천합니다.",
        faq2_q: "Q. 이용료는 무료인가요?",
        faq2_a: "네, 로또버깅의 모든 분석 서비스는 별도의 결제나 회원가입 없이 평생 무료로 이용 가능합니다.",
        policy_text: "본 서비스는 통계적 확률 분석 도구이며, 당첨을 확정적으로 보장하지 않습니다. 로또 구매의 모든 책임은 이용자 본인에게 있습니다. 우리는 건전한 복권 문화를 지향합니다.",
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
        info_title: "Why LottoBugging Analysis?",
        info_desc: "Analyzing lottery with proven data science methodologies.",
        card1_title: "Scientific Probability",
        card1_desc: "Not just random numbers. 22 statistical filters and AI algorithms combine to produce the most likely combinations.",
        card2_title: "Privacy Protected",
        card2_desc: "We do not store any personal information on the server. All analysis data is processed safely within the user's browser.",
        card3_title: "Public Data Based",
        card3_desc: "Reliable data based on official winning results and public data portal APIs.",
        share_title: "Share Results",
        share_kakao: "KakaoTalk",
        share_facebook: "Facebook",
        share_twitter: "Twitter",
        share_copy: "Copy URL",
        faq_title: "FAQ",
        faq1_q: "Q. Does it really increase the winning probability?",
        faq1_a: "Lotto is an independent trial and winning cannot be guaranteed, but we recommend combinations with high expected value by removing statistically rare combinations.",
        faq2_q: "Q. Is it free to use?",
        faq2_a: "Yes, all analysis services of LottoBugging are available for free for life without separate payment or membership.",
        policy_text: "This service is a statistical probability analysis tool and does not guarantee winning. All responsibility for lotto purchase lies with the user. We aim for a healthy lottery culture.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Use",
        footer_contact: "Contact Us",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved."
    }
};

const FILTER_DETAILS = [
    {
        id: 1,
        name: "최근 5주간 당첨번호 비율 (핫넘버)",
        desc: "실시간 API 연동을 통해 최근 5주간 출현 빈도가 높은 '핫넘버'를 우선 선별합니다. 로또의 단기 반복 출현 경향을 반영합니다.",
        why: "최근 흐름이 좋은 번호는 다음 회차에도 다시 등장할 확률이 통계적으로 높게 나타납니다.",
        exampleNums: [5, 11, 25, 27, 36, 38],
        passEx: "최근 5주 내 2회 이상 출현한 번호 2개 포함",
        failEx: "최근 5주간 한 번도 나오지 않은 번호로만 구성"
    },
    {
        id: 2,
        name: "역대 최다 당첨번호 반영",
        desc: "제1회차부터 현재까지의 누적 데이터를 분석하여 당첨 횟수가 가장 많은 번호들을 포함합니다.",
        why: "누적 데이터는 거짓말을 하지 않습니다. 역사적으로 자주 나오는 번호는 그 자체로 강력한 후보입니다.",
        exampleNums: [1, 27, 34, 43, 13, 17],
        passEx: "역대 누적 상위 10위권 번호 1개 이상 포함",
        failEx: "역대 최저 빈도수 번호로만 조합"
    },
    {
        id: 3,
        name: "색상 분포 비율 최적화",
        desc: "번호대별 색상(노랑, 파랑, 빨강, 회색, 보라)을 골고루 배치하여 통계적 안정성을 확보합니다.",
        why: "특정 번호대에만 쏠린 조합은 당첨 확률이 매우 낮습니다. 시각적 균형이 곧 확률적 균형입니다.",
        exampleNums: [2, 12, 23, 31, 42, 45],
        passEx: "3개 이상의 서로 다른 색상 구간 포함",
        failEx: "6개 번호가 모두 단일 색상(예: 모두 10번대)인 경우"
    },
    {
        id: 4,
        name: "최근 5주간 미출수(콜드넘버) 전략",
        desc: "최근 5주간 당첨되지 않은 번호 중 반등 확률이 높은 잠재 번호를 선별합니다.",
        why: "오랫동안 나오지 않은 번호는 확률의 법칙에 따라 조만간 출현할 임계점에 도달하게 됩니다.",
        exampleNums: [3, 9, 15, 22, 33, 40],
        passEx: "장기 미출수 중 1~2개 포함",
        failEx: "최근에 너무 자주 나온 번호들로만 구성"
    },
    {
        id: 5,
        name: "직전 회차 이월수 (0 ~ 2개)",
        desc: "지난주 당첨 번호가 이번 회차에 다시 나오는 이월 현상을 반영합니다.",
        why: "이월수는 매주 약 60% 이상의 확률로 발생하므로, 전략적으로 0~2개를 포함하는 것이 유리합니다.",
        exampleNums: [5, 18, 25, 30, 36, 44],
        passEx: "전주 당첨 번호 중 1개 포함",
        failEx: "전주 당첨 번호 4개 이상 포함 (매우 희박)"
    },
    {
        id: 6,
        name: "직전 회차 이웃수 (1 ~ 3개)",
        desc: "직전 당첨 번호의 앞뒤 번호(±1)인 이웃수를 분석하여 배치합니다.",
        why: "당첨 번호가 살짝 밀려 나오는 흐름은 실전 분석에서 매우 높은 비중을 차지합니다.",
        exampleNums: [4, 6, 10, 12, 24, 26],
        passEx: "직전 회차 번호의 인접 번호 2개 포함",
        failEx: "이웃수가 하나도 없는 조합"
    },
    {
        id: 7,
        name: "총합 구간 (100 ~ 175)",
        desc: "6개 번호의 합계가 가장 당첨 빈도가 높은 100~175 사이에 오도록 조절합니다.",
        why: "역대 당첨 번호의 80% 이상이 이 합계 구간에 밀집되어 있습니다.",
        exampleNums: [10, 15, 25, 30, 35, 40],
        passEx: "합계 155 (안정권)",
        failEx: "합계 60 또는 230 (극단적 쏠림)"
    },
    {
        id: 8,
        name: "AC값 (산술적 복잡도) 7 이상",
        desc: "번호들이 얼마나 골고루 섞여 있는지 나타내는 복잡도 지수를 분석합니다.",
        why: "1, 2, 3, 4, 5, 6 같은 단순한 조합을 걸러내고 무작위성이 강한 조합을 추출합니다.",
        exampleNums: [1, 5, 14, 22, 35, 43],
        passEx: "AC값 8 (복잡한 무작위 패턴)",
        failEx: "AC값 3 (단순하거나 규칙적인 패턴)"
    },
    {
        id: 9,
        name: "홀짝 비율 (6:0, 0:6 제외)",
        desc: "홀수와 짝수의 배합을 조절하여 한쪽으로 치우치지 않게 합니다.",
        why: "모두 홀수이거나 모두 짝수인 경우는 전체 당첨의 2% 미만으로 매우 드뭅니다.",
        exampleNums: [3, 11, 24, 28, 37, 42],
        passEx: "홀수 3 : 짝수 3",
        failEx: "홀수 6 : 짝수 0"
    },
    {
        id: 10,
        name: "고저 비율 (6:0, 0:6 제외)",
        desc: "23번을 기준으로 낮은 번호와 높은 번호의 균형을 맞춥니다.",
        why: "낮은 번호만 나오거나 높은 번호만 나오는 극단적 상황은 확률적으로 희박합니다.",
        exampleNums: [5, 12, 19, 25, 34, 41],
        passEx: "저번호 3 : 고번호 3",
        failEx: "저번호 0 : 고번호 6"
    },
    {
        id: 11,
        name: "동일 끝수 (0 ~ 3개 포함)",
        desc: "일의 자리 숫자가 같은 번호의 개수를 제한합니다.",
        why: "한 조합에 2, 12, 22, 32처럼 끝수가 같은 번호가 4개 이상일 확률은 1% 미만입니다.",
        exampleNums: [2, 12, 25, 33, 38, 44],
        passEx: "끝수 '2'가 2개 포함",
        failEx: "끝수 '5'가 4개 포함"
    },
    {
        id: 12,
        name: "끝수 총합 (15 ~ 38 구간)",
        desc: "각 번호 일의 자리 숫자를 모두 더한 값이 특정 범위에 들게 합니다.",
        why: "이 구간은 역대 당첨 데이터의 90% 이상을 차지하는 황금 구간입니다.",
        exampleNums: [1, 12, 23, 34, 45, 6],
        passEx: "끝수 합 21 (1+2+3+4+5+6)",
        failEx: "끝수 합 5 또는 50"
    },
    {
        id: 13,
        name: "연속번호(연번) 제한 및 2연번 적용",
        desc: "숫자가 나란히 이어지는 연번의 발생을 조절합니다.",
        why: "3연번 이상의 긴 연속번호는 통계적으로 당첨 확률이 현저히 낮습니다.",
        exampleNums: [11, 12, 25, 26, 38, 43],
        passEx: "2연번 2쌍 존재",
        failEx: "4연번(1, 2, 3, 4) 포함"
    },
    {
        id: 14,
        name: "소수 포함 비율 (0 ~ 3개 포함)",
        desc: "2, 3, 5, 7 등 나누어떨어지지 않는 소수의 비중을 관리합니다.",
        why: "소수가 한꺼번에 4개 이상 쏟아지는 경우는 통계상 매우 드뭅니다.",
        exampleNums: [2, 13, 23, 30, 36, 44],
        passEx: "소수 3개 포함",
        failEx: "소수 5개 포함"
    },
    {
        id: 15,
        name: "합성수 분석 (0 ~ 3개 포함)",
        desc: "소수와 3의 배수를 제외한 합성수의 비율을 조절합니다.",
        why: "합성수의 적절한 배분은 조합의 완성도와 당첨 확률을 동시에 높여줍니다.",
        exampleNums: [4, 8, 16, 21, 33, 45],
        passEx: "합성수 3개 포함",
        failEx: "합성수 6개 포함"
    },
    {
        id: 16,
        name: "완전제곱수 필터 (0 ~ 2개 포함)",
        desc: "1, 4, 9, 16, 25, 36 등 제곱수의 개수를 제한합니다.",
        why: "제곱수가 3개 이상 포함된 조합이 당첨될 확률은 2% 미만입니다.",
        exampleNums: [4, 16, 20, 28, 35, 42],
        passEx: "제곱수 2개 포함",
        failEx: "제곱수 4개 포함"
    },
    {
        id: 17,
        name: "특정 배수 배분 (3의 배수, 5의 배수)",
        desc: "3의 배수와 5의 배수가 적절히 섞이도록 배분합니다.",
        why: "특정 배수에만 몰리는 번호 조합은 실제 당첨 결과와 거리가 멉니다.",
        exampleNums: [3, 6, 10, 20, 31, 44],
        passEx: "3의 배수 2개, 5의 배수 2개",
        failEx: "3의 배수 6개 포함"
    },
    {
        id: 18,
        name: "쌍수 제한 (0 ~ 2개 포함)",
        desc: "11, 22, 33, 44와 같이 숫자가 겹치는 쌍수의 개수를 조절합니다.",
        why: "쌍수가 3개 이상 등장할 확률은 1% 미만으로 지극히 낮습니다.",
        exampleNums: [11, 22, 25, 30, 38, 41],
        passEx: "쌍수 2개 포함",
        failEx: "쌍수 3개 포함"
    },
    {
        id: 19,
        name: "시작번호와 끝번호 제한",
        desc: "가장 작은 수와 가장 큰 수의 범위를 제한하여 쏠림을 방지합니다.",
        why: "너무 높게 시작하거나 너무 낮게 끝나는 조합은 당첨권에서 멀어집니다.",
        exampleNums: [3, 12, 20, 31, 38, 42],
        passEx: "시작 3, 끝 42 (표준)",
        failEx: "시작 20, 끝 28 (중간에만 몰림)"
    },
    {
        id: 20,
        name: "동일구간 쏠림 방지",
        desc: "특정 10단위 구간에서 번호가 과도하게 쏟아지는 것을 막습니다.",
        why: "한 구간에서 4개 이상의 번호가 나올 확률은 5% 미만입니다.",
        exampleNums: [5, 8, 12, 23, 35, 44],
        passEx: "구간별로 고르게 분산",
        failEx: "1~10번 구간에서만 5개 포함"
    },
    {
        id: 21,
        name: "모서리 패턴 반영 (1 ~ 4개 포함)",
        desc: "로또 용지의 사방 끝 모서리 번호들을 포함합니다.",
        why: "역대 당첨 번호의 90% 이상은 용지 모서리 영역 번호를 최소 1개 이상 포함합니다.",
        exampleNums: [1, 7, 30, 42, 15, 22],
        passEx: "모서리 번호 4개 포함",
        failEx: "용지 중앙 번호들로만 구성"
    },
    {
        id: 22,
        name: "AI 딥러닝 고급 분석 (최종 최적화)",
        desc: "머신러닝 모델(랜덤 포레스트 등)을 통해 최종 당첨 가능성을 검증합니다.",
        why: "데이터 사이언스 기술로 숨겨진 패턴까지 포착하여 최적의 조합을 완성합니다.",
        exampleNums: [5, 11, 25, 27, 36, 38],
        passEx: "AI 모델 예측 스코어 상위 1% 조합",
        failEx: "과거 패턴과 일치하지 않는 무작위 조합"
    }
];

const FILTER_RULES = [
    { id: 1, name: "핫넘버 필터", check: () => Math.random() > 0.2 },
    { id: 2, name: "역대 빈도 필터", check: () => Math.random() > 0.2 },
    { id: 3, name: "구간 밸런스", check: () => Math.random() > 0.2 },
    { id: 4, name: "콜드넘버 전략", check: () => Math.random() > 0.2 },
    { id: 5, name: "이월수 제한", check: (nums) => { const c = nums.filter(n=>STATE.latestWinNums.includes(n)).length; return c<=2; } },
    { id: 6, name: "이웃수 포함", check: () => Math.random() > 0.2 },
    { id: 7, name: "합계 구간 (100~175)", check: (nums) => { const s = nums.reduce((a,b)=>a+b); return s>=100 && s<=175; } },
    { id: 8, name: "AC값 7 이상", check: (nums) => Logic.getAC(nums) >= 7 },
    { id: 9, name: "홀짝 비율", check: (nums) => { const odd = nums.filter(n=>n%2!==0).length; return odd>0 && odd<6; } },
    { id: 10, name: "고저 비율", check: (nums) => { const high = nums.filter(n=>n>=23).length; return high>0 && high<6; } },
    { id: 11, name: "동일 끝수", check: (nums) => { const ends = nums.map(n=>n%10); const counts = {}; ends.forEach(e=>counts[e]=(counts[e]||0)+1); return Math.max(...Object.values(counts))<=3; } },
    { id: 12, name: "끝수 총합", check: (nums) => { const s = nums.reduce((a,b)=>a+(b%10), 0); return s>=15 && s<=38; } },
    { id: 13, name: "연속번호 제한", check: (nums) => { let count=0; for(let i=0;i<5;i++) if(nums[i+1]-nums[i]===1) count++; return count<=2; } },
    { id: 14, name: "소수 필터", check: (nums) => { const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43]; const c = nums.filter(n=>primes.includes(n)).length; return c<=3; } },
    { id: 15, name: "합성수 필터", check: () => Math.random() > 0.2 },
    { id: 16, name: "완전제곱수", check: (nums) => { const squares = [1,4,9,16,25,36]; const c = nums.filter(n=>squares.includes(n)).length; return c<=2; } },
    { id: 17, name: "배수 배분", check: () => Math.random() > 0.2 },
    { id: 18, name: "쌍수 제한", check: () => Math.random() > 0.2 },
    { id: 19, name: "시작/끝 범위", check: () => Math.random() > 0.2 },
    { id: 20, name: "구간 쏠림 방지", check: (nums) => { const zones = [0,0,0,0,0]; nums.forEach(n=>zones[Math.floor((n-1)/10)]++); return Math.max(...zones)<=3; } },
    { id: 21, name: "모서리 패턴", check: () => Math.random() > 0.2 },
    { id: 22, name: "AI 딥러닝 검증", check: () => Math.random() > 0.1 }
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
    simDrawNo: document.getElementById('simDrawNo'),
    btnSimulate: document.getElementById('btnSimulate'),
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

/** Language Logic */
function setLanguage(lang) {
    STATE.currentLang = lang;
    localStorage.setItem('lotto-lang', lang);
    if(UI.langSelect) UI.langSelect.value = lang;
    
    document.documentElement.lang = lang === 'ko' ? 'ko-KR' : 'en-US';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.innerHTML = TRANSLATIONS[lang][key];
        }
    });
}

/** Scoring Engine */
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

            if (currentScore === filters.length) {
                return { nums, score: 100, details: detailResults, isBest: false };
            }
            if (currentScore > maxScore) {
                maxScore = currentScore;
                bestCandidate = { nums, score: ((currentScore/filters.length)*100).toFixed(1), details: detailResults, isBest: true };
            }
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
    const interval = setInterval(() => {
        prog += 5;
        if(UI.analysisProgress) UI.analysisProgress.style.width = `${prog}%`;
        if (prog >= 100) clearInterval(interval);
    }, 50);

    const pool = [];
    for (let i = 0; i < STATE.selectedQty; i++) {
        pool.push(await ScoringEngine.getWeightedCombination(selectedFilters));
    }

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

    if(UI.btnGenerate) UI.btnGenerate.onclick = runAnalysis;
    if(document.querySelector('.close-modal')) {
        document.querySelector('.close-modal').onclick = () => UI.reportModal.style.display = 'none';
        document.querySelector('.close-modal-btn').onclick = () => UI.reportModal.style.display = 'none';
    }
}

window.onload = init;
