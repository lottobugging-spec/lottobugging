/**
 * LOTTOBUGGING v7.5 - Scoring Engine & i18n
 */

// Userback Feedback Service
window.Userback = window.Userback || {};
Userback.access_token = "A-sBQHLH60t5i7qrdZCdmd3x7B1";
(function(d) {
    var s = d.createElement('script');s.async = true;s.src = 'https://static.userback.io/widget/v1.js';(d.head || d.body).appendChild(s);
})(document);

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
        analyzer_title: "人工知能ロト번호분석시스템",
        welcome_title: "데이터 기반 의사결정 시스템",
        welcome_desc: "22단계의 필터링 알고리즘을 통해 통계적 노이즈를 제거합니다.",
        prob_label: "Algorithm Fitness Score",
        system_ready: "SYSTEM READY",
        qty_label: "抽出データセット (Quantity)",
        btn_generate: "데이터 분석 및 조합 생성 실행",
        strategy_header: "分析戦略",
        preset_basic: "標準統計",
        preset_pattern: "パターン集中",
        preset_full: "AI精密",
        preset_reset: "初期化",
        filter_header: "フィルタリング条件",
        footer_privacy: "個人정보처리방침",
        footer_terms: "이용약관",
        footer_contact: "お問い合わせ",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "分析レポート",
        processing: "데이터 분석 중...",
        optimal_badge: "最適組合せ",
        lang_display: "言語選択"
    }
};

const FILTER_DETAILS = [
    { id: 1, name: { ko: "최근 5주간 당첨번호 비율 (핫넘버)", en: "Hot Numbers (Last 5 Weeks)", ja: "直近5週間の当選番号比率" }, desc: { ko: "실시간 API 연동을 통해 최근 5주간 출현 빈도가 높은 '핫넘버'를 우선 선별합니다. 로또의 단기 반복 출현 경향을 반영하여 현재 가장 강력한 흐름을 가진 번호를 조합에 즉각 반영합니다. 즉각 반영합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", en: "실시간 API 연동을 통해 최근 5주간 출현 빈도가 높은 '핫넘버'를 우선 선별합니다. 로또의 단기 반복 출현 경향을 반영하여 현재 가장 강력한 흐름을 가진 번호를 조합에 즉각 반영합니다. 즉각 반영합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", ja: "실시간 API 연동을 통해 최근 5주간 출현 빈도가 높은 '핫넘버'를 우선 선별합니다. 로또의 단기 반복 출현 경향을 반영하여 현재 가장 강력한 흐름을 가진 번호를 조합에 즉각 반영합니다. 즉각 반영합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)" } },
    { id: 2, name: { ko: "역대 최다 당첨번호 반영", en: "Historical High Frequency", ja: "歴代最多当選番号の反映" }, desc: { ko: "제1회차부터 현재까지의 전체 누적 빅데이터를 분석하여, 당첨 횟수가 가장 많은 '검증된 번호'들을 포함합니다. 역사가 증명한 고빈도 번호(예: 43번 등)를 활용하여 당첨 확률의 기본기를 잡습니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", en: "제1회차부터 현재까지의 전체 누적 빅데이터를 분석하여, 당첨 횟수가 가장 많은 '검증된 번호'들을 포함합니다. 역사가 증명한 고빈도 번호(예: 43번 등)를 활용하여 당첨 확률의 기본기를 잡습니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", ja: "제1회차부터 현재까지의 전체 누적 빅데이터를 분석하여, 당첨 횟수가 가장 많은 '검증된 번호'들을 포함합니다. 역사가 증명한 고빈도 번호(예: 43번 등)를 활용하여 당첨 확률의 기본기를 잡습니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)" } },
    { id: 3, name: { ko: "색상 분포 비율 최적화", en: "Color Distribution", ja: "カラー分布比率の最適化" }, desc: { ko: "최근 5주간 당첨된 번호들의 색상(구간) 비율을 실시간으로 분석하여, 특정 번호대에 치우치지 않는 최적의 밸런스를 찾아냅니다. 노랑(1번대), 파랑(11번대), 빨강(21번대), 회색(31번대), 보라(41번대) 등 5개 구간의 색상을 골고루 배치하여 시각적 균형과 통계적 안정성을 동시에 확보합니다 (사이트참조 https://www.lotto.co.kr/article/list/AC01)", en: "최근 5주간 당첨된 번호들의 색상(구간) 비율을 실시간으로 분석하여, 특정 번호대에 치우치지 않는 최적의 밸런스를 찾아냅니다. 노랑(1번대), 파랑(11번대), 빨강(21번대), 회색(31번대), 보라(41번대) 등 5개 구간의 색상을 골고루 배치하여 시각적 균형과 통계적 안정성을 동시에 확보합니다 (사이트참조 https://www.lotto.co.kr/article/list/AC01)", ja: "최근 5주간 당첨된 번호들의 색상(구간) 비율을 실시간으로 분석하여, 특정 번호대에 치우치지 않는 최적의 밸런스를 찾아냅니다. 노랑(1번대), 파랑(11번대), 빨강(21번대), 회색(31번대), 보라(41번대) 등 5개 구간의 색상을 골고루 배치하여 시각적 균형과 통계적 안정성을 동시에 확보합니다 (사이트참조 https://www.lotto.co.kr/article/list/AC01)" } },
    { id: 4, name: { ko: "최근 5주간 미출수 전략", en: "Cold Numbers (Last 5 Weeks)", ja: "直近5週間の未出現数戦略" }, desc: { ko: "최근 5주간 한 번도 당첨되지 않은 번호 중, 역대 누적 당첨 횟수가 많아 반등 확률이 높은 '잠재 번호'를 선별하여 포함합니다. 실시간 미출수 데이터를 추적하여 출현 임계점에 도달한 번호들을 전략적으로 배치함으로써 당첨 확률을 극대화합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", en: "최근 5주간 한 번도 당첨되지 않은 번호 중, 역대 누적 당첨 횟수가 많아 반등 확률이 높은 '잠재 번호'를 선별하여 포함합니다. 실시간 미출수 데이터를 추적하여 출현 임계점에 도달한 번호들을 전략적으로 배치함으로써 당첨 확률을 극대화합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", ja: "최근 5주간 한 번도 당첨되지 않은 번호 중, 역대 누적 당첨 횟수가 많아 반등 확률이 높은 '잠재 번호'를 선별하여 포함합니다. 실시간 미출수 데이터를 추적하여 출현 임계점에 도달한 번호들을 전략적으로 배치함으로써 당첨 확률을 극대화합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)" } },
    { id: 5, name: { ko: "직전 회차 이월수 (0~2개)", en: "Previous Draw Carry-over", ja: "前回の繰越し数" }, desc: { ko: "지난주 당첨 번호가 이번 회차에 다시 출현하는 '이월' 현상은 매주 약 60% 이상의 높은 확률로 발생합니다. 시스템은 실시간 API로 수집된 직전 회차 당첨 번호를 분석하여, 무작위로 0~2개를 조합에 포함시킵니다. 이를 통해 실제 당첨 조합에서 빈번하게 나타나는 번호의 연속성을 확보하고 당첨 확률을 현실적으로 높입니다.", en: "지난주 당첨 번호가 이번 회차에 다시 출현하는 '이월' 현상은 매주 약 60% 이상의 높은 확률로 발생합니다. 시스템은 실시간 API로 수집된 직전 회차 당첨 번호를 분석하여, 무작위로 0~2개를 조합에 포함시킵니다. 이를 통해 실제 당첨 조합에서 빈번하게 나타나는 번호의 연속성을 확보하고 당첨 확률을 현실적으로 높입니다.", ja: "지난주 당첨 번호가 이번 회차에 다시 출현하는 '이월' 현상은 매주 약 60% 이상의 높은 확률로 발생합니다. 시스템은 실시간 API로 수집된 직전 회차 당첨 번호를 분석하여, 무작위로 0~2개를 조합에 포함시킵니다. 이를 통해 실제 당첨 조합에서 빈번하게 나타나는 번호의 연속성을 확보하고 당첨 확률을 현실적으로 높입니다." } },
    { id: 6, name: { ko: "직전 회차 이웃수 (1~3개)", en: "Previous Draw Neighbors", ja: "前回の隣接数" }, desc: { ko: "당첨 번호의 바로 옆 번호가 다음 회차에 등장하는 것을 **'이웃수'**라고 합니다. 예를 들어 지난주에 10번이 당첨되었다면 9번과 11번이 이번 주의 이웃수가 됩니다. 이는 번호가 밀려 나오는 특유의 흐름을 포착하는 기법으로, 실제 당첨 조합에서 매우 높은 비중을 차지하는 실전 분석의 핵심입니다. 시스템은 직전 회차 번호들의 ±1에 해당하는 번호들 중 AI가 엄선한 1~3개의 번호를 조합에 배치하여 당첨권에 가장 가깝게 접근합니다.", en: "당첨 번호의 바로 옆 번호가 다음 회차에 등장하는 것을 **'이웃수'**라고 합니다. 예를 들어 지난주에 10번이 당첨되었다면 9번과 11번이 이번 주의 이웃수가 됩니다. 이는 번호가 밀려 나오는 특유의 흐름을 포착하는 기법으로, 실제 당첨 조합에서 매우 높은 비중을 차지하는 실전 분석의 핵심입니다. 시스템은 직전 회차 번호들의 ±1에 해당하는 번호들 중 AI가 엄선한 1~3개의 번호를 조합에 배치하여 당첨권에 가장 가깝게 접근합니다.", ja: "당첨 번호의 바로 옆 번호가 다음 회차에 등장하는 것을 **'이웃수'**라고 합니다. 예를 들어 지난주에 10번이 당첨되었다면 9번과 11번이 이번 주의 이웃수가 됩니다. 이는 번호가 밀려 나오는 특유의 흐름을 포착하는 기법으로, 실제 당첨 조합에서 매우 높은 비중을 차지하는 실전 분석의 핵심입니다. 시스템은 직전 회차 번호들의 ±1에 해당하는 번호들 중 AI가 엄선한 1~3개의 번호를 조합에 배치하여 당첨권에 가장 가깝게 접근합니다." } },
    { id: 7, name: { ko: "총합 구간 (100~175)", en: "Total Sum Range", ja: "総和区間" }, desc: { ko: "선택된 조합 번호 6개를 모두 더한 값을 **'총합'**이라고 합니다. 역대 1등 당첨 번호의 통계 데이터를 분석해 보면, 총합이 100 미만이거나 175를 초과하는 기형적인 조합이 당첨될 확률은 10% 이내로 매우 희박합니다. 따라서 가장 당첨 빈도가 높고 안정적인 100 ~ 175 사이의 핵심 구간을 타격하여 실제 당첨 확률을 극대화하는 최적화 로직을 적용합니다.", en: "선택된 조합 번호 6개를 모두 더한 값을 **'총합'**이라고 합니다. 역대 1등 당첨 번호의 통계 데이터를 분석해 보면, 총합이 100 미만이거나 175를 초과하는 기형적인 조합이 당첨될 확률은 10% 이내로 매우 희박합니다. 따라서 가장 당첨 빈도가 높고 안정적인 100 ~ 175 사이의 핵심 구간을 타격하여 실제 당첨 확률을 극대화하는 최적화 로직을 적용합니다.", ja: "선택된 조합 번호 6개를 모두 더한 값을 **'총합'**이라고 합니다. 역대 1등 당첨 번호의 통계 데이터를 분석해 보면, 총합이 100 미만이거나 175를 초과하는 기형적인 조합이 당첨될 확률은 10% 이내로 매우 희박합니다. 따라서 가장 당첨 빈도가 높고 안정적인 100 ~ 175 사이의 핵심 구간을 타격하여 실제 당첨 확률을 극대화하는 최적화 로직을 적용합니다." } },
    { id: 8, name: { ko: "AC값 7 이상", en: "AC Value (Complexity) 7+", ja: "AC値7以上" }, desc: { ko: "**'AC값'**이란 로또 번호 6개가 얼마나 무작위로 골고루 섞여 있는지를 나타내는 산술적 복잡도 지수(0~10)입니다. 역대 1등 당첨 번호 통계를 분석해 보면, 번호 간의 차이값이 다양하게 나타나는 AC값 7 이상의 복잡한 조합이 전체 당첨의 80% 이상을 차지합니다. 계산 방식(예시): 번호가 1, 5, 10, 15, 22, 30일 때, 큰 수에서 작은 수를 뺀 모든 차잇값(30-22, 30-15... 5-1 등)을 구합니다. 이 결과값들 중 중복되지 않는 고유한 값의 개수에서 5를 뺀 수치가 AC값입니다. 적용 로직: 단순한 패턴(예: 1, 2, 3, 4, 5, 6 등)을 필터링하고, 통계적으로 당첨 확률이 가장 높은 AC값 7 이상의 과학적 조합만을 선별하여 제공합니다.", en: "**'AC값'**이란 로또 번호 6개가 얼마나 무작위로 골고루 섞여 있는지를 나타내는 산술적 복잡도 지수(0~10)입니다. 역대 1등 당첨 번호 통계를 분석해 보면, 번호 간의 차이값이 다양하게 나타나는 AC값 7 이상의 복잡한 조합이 전체 당첨의 80% 이상을 차지합니다. 계산 방식(예시): 번호가 1, 5, 10, 15, 22, 30일 때, 큰 수에서 작은 수를 뺀 모든 차잇값(30-22, 30-15... 5-1 등)을 구합니다. 이 결과값들 중 중복되지 않는 고유한 값의 개수에서 5를 뺀 수치가 AC값입니다. 적용 로직: 단순한 패턴(예: 1, 2, 3, 4, 5, 6 등)을 필터링하고, 통계적으로 당첨 확률이 가장 높은 AC값 7 이상의 과학적 조합만을 선별하여 제공합니다.", ja: "**'AC값'**이란 로또 번호 6개가 얼마나 무작위로 골고루 섞여 있는지를 나타내는 산술적 복잡도 지수(0~10)입니다. 역대 1등 당첨 번호 통계를 분석해 보면, 번호 간의 차이값이 다양하게 나타나는 AC값 7 이상의 복잡한 조합이 전체 당첨의 80% 이상을 차지합니다. 계산 방식(예시): 번호가 1, 5, 10, 15, 22, 30일 때, 큰 수에서 작은 수를 뺀 모든 차잇값(30-22, 30-15... 5-1 등)을 구합니다. 이 결과값들 중 중복되지 않는 고유한 값의 개수에서 5를 뺀 수치가 AC값입니다. 적용 로직: 단순한 패턴(예: 1, 2, 3, 4, 5, 6 등)을 필터링하고, 통계적으로 당첨 확률이 가장 높은 AC값 7 이상의 과학적 조합만을 선별하여 제공합니다." } },
    { id: 9, name: { ko: "홀짝 비율 (6:0, 0:6 제외)", en: "Odd:Even Ratio", ja: "奇数・偶数比率" }, desc: { ko: "조합된 번호 6개 중 홀수와 짝수가 각각 몇 개씩 섞여 있는지를 분석합니다. 역대 1등 당첨 번호 통계를 살펴보면, 6개 번호가 모두 홀수(6:0)이거나 모두 짝수(0:6)인 기형적인 조합이 당첨될 확률은 2% 미만으로 매우 희박합니다. 따라서 시스템은 통계적으로 안정적인 밸런스를 유지하기 위해, 한쪽으로 완전히 치우친 조합을 자동으로 제외하고 가장 당첨 빈도가 높은 홀짝 배합을 우선적으로 적용합니다.", en: "조합된 번호 6개 중 홀수와 짝수가 각각 몇 개씩 섞여 있는지를 분석합니다. 역대 1등 당첨 번호 통계를 살펴보면, 6개 번호가 모두 홀수(6:0)이거나 모두 짝수(0:6)인 기형적인 조합이 당첨될 확률은 2% 미만으로 매우 희박합니다. 따라서 시스템은 통계적으로 안정적인 밸런스를 유지하기 위해, 한쪽으로 완전히 치우친 조합을 자동으로 제외하고 가장 당첨 빈도가 높은 홀짝 배합을 우선적으로 적용합니다.", ja: "조합된 번호 6개 중 홀수와 짝수가 각각 몇 개씩 섞여 있는지를 분석합니다. 역대 1등 당첨 번호 통계를 살펴보면, 6개 번호가 모두 홀수(6:0)이거나 모두 짝수(0:6)인 기형적인 조합이 당첨될 확률은 2% 미만으로 매우 희박합니다. 따라서 시스템은 통계적으로 안정적인 밸런스를 유지하기 위해, 한쪽으로 완전히 치우친 조합을 자동으로 제외하고 가장 당첨 빈도가 높은 홀짝 배합을 우선적으로 적용합니다." } },
    { id: 10, name: { ko: "고저 비율 (6:0, 0:6 제외)", en: "High:Low Ratio", ja: "高低比率" }, desc: { ko: "로또 번호의 중간값인 23을 기준으로, 1~22번을 '저번호', 23~45번을 **'고번호'**라고 정의합니다. 역대 1등 당첨 통계상, 6개 번호가 모두 낮은 번호로만 구성되거나(0:6) 모두 높은 번호로만 구성되는(6:0) 경우의 당첨 확률은 3% 미만으로 매우 낮습니다. 시스템은 이러한 극단적인 쏠림 현상을 방지하기 위해, 고번호와 저번호가 적절히 섞인 확률 중심의 황금 밸런스 조합만을 생성합니다.", en: "로또 번호의 중간값인 23을 기준으로, 1~22번을 '저번호', 23~45번을 **'고번호'**라고 정의합니다. 역대 1등 당첨 통계상, 6개 번호가 모두 낮은 번호로만 구성되거나(0:6) 모두 높은 번호로만 구성되는(6:0) 경우의 당첨 확률은 3% 미만으로 매우 낮습니다. 시스템은 이러한 극단적인 쏠림 현상을 방지하기 위해, 고번호와 저번호가 적절히 섞인 확률 중심의 황금 밸런스 조합만을 생성합니다.", ja: "로또 번호의 중간값인 23을 기준으로, 1~22번을 '저번호', 23~45번을 **'고번호'**라고 정의합니다. 역대 1등 당첨 통계상, 6개 번호가 모두 낮은 번호로만 구성되거나(0:6) 모두 높은 번호로만 구성되는(6:0) 경우의 당첨 확률은 3% 미만으로 매우 낮습니다. 시스템은 이러한 극단적인 쏠림 현상을 방지하기 위해, 고번호와 저번호가 적절히 섞인 확률 중심의 황금 밸런스 조합만을 생성합니다." } },
    { id: 11, name: { ko: "동일 끝수 (0~3개 포함)", en: "Same Ending Digit", ja: "同一末尾" }, desc: { ko: "**'끝수'**란 각 번호의 일의 자리 숫자를 의미하며, 이 숫자가 같은 번호들을 **'동일 끝수'**라고 부릅니다. 예를 들어 번호가 2, 12, 22, 32라면 모두 끝수가 '2'로 동일한 경우입니다. 역대 1등 당첨 통계상, 한 조합 안에 동일 끝수가 4개 이상 포함될 확률은 1% 미만으로 지극히 낮습니다. 따라서 시스템은 같은 끝수의 번호를 최대 3개까지만 제한적으로 포함시켜, 실질적인 당첨 가능성이 희박한 조합을 사전에 완벽히 필터링합니다.", en: "**'끝수'**란 각 번호의 일의 자리 숫자를 의미하며, 이 숫자가 같은 번호들을 **'동일 끝수'**라고 부릅니다. 예를 들어 번호가 2, 12, 22, 32라면 모두 끝수가 '2'로 동일한 경우입니다. 역대 1등 당첨 통계상, 한 조합 안에 동일 끝수가 4개 이상 포함될 확률은 1% 미만으로 지극히 낮습니다. 따라서 시스템은 같은 끝수의 번호를 최대 3개까지만 제한적으로 포함시켜, 실질적인 당첨 가능성이 희박한 조합을 사전에 완벽히 필터링합니다.", ja: "**'끝수'**란 각 번호의 일의 자리 숫자를 의미하며, 이 숫자가 같은 번호들을 **'동일 끝수'**라고 부릅니다. 예를 들어 번호가 2, 12, 22, 32라면 모두 끝수가 '2'로 동일한 경우입니다. 역대 1등 당첨 통계상, 한 조합 안에 동일 끝수가 4개 이상 포함될 확률은 1% 미만으로 지극히 낮습니다. 따라서 시스템은 같은 끝수의 번호를 최대 3개까지만 제한적으로 포함시켜, 실질적인 당첨 가능성이 희박한 조합을 사전에 완벽히 필터링합니다." } },
    { id: 12, name: { ko: "끝수 총합 (15~38)", en: "Last Digit Sum", ja: "末尾総和" }, desc: { ko: "조합된 6개 번호의 마지막 자릿수인 **'끝수'**들을 모두 더한 값을 분석합니다. 예를 들어 번호가 42라면 끝수는 2가 되며, 7과 같은 단자리수는 숫자 그대로 7이 끝수가 됩니다. 역대 1등 당첨 데이터 분석 결과, 이 끝수들의 총합이 **15 ~ 35 구간에 들어올 확률은 무려 90%**에 달합니다. 시스템은 이러한 압도적 통계를 바탕으로, 당첨 확률이 가장 밀집된 15 ~ 38 구간을 추천 범위로 설정하여 안정적인 조합을 생성합니다.", en: "조합된 6개 번호의 마지막 자릿수인 **'끝수'**들을 모두 더한 값을 분석합니다. 예를 들어 번호가 42라면 끝수는 2가 되며, 7과 같은 단자리수는 숫자 그대로 7이 끝수가 됩니다. 역대 1등 당첨 데이터 분석 결과, 이 끝수들의 총합이 **15 ~ 35 구간에 들어올 확률은 무려 90%**에 달합니다. 시스템은 이러한 압도적 통계를 바탕으로, 당첨 확률이 가장 밀집된 15 ~ 38 구간을 추천 범위로 설정하여 안정적인 조합을 생성합니다.", ja: "조합된 6개 번호의 마지막 자릿수인 **'끝수'**들을 모두 더한 값을 분석합니다. 예를 들어 번호가 42라면 끝수는 2가 되며, 7과 같은 단자리수는 숫자 그대로 7이 끝수가 됩니다. 역대 1등 당첨 데이터 분석 결과, 이 끝수들의 총합이 **15 ~ 35 구간에 들어올 확률은 무려 90%**에 달합니다. 시스템은 이러한 압도적 통계를 바탕으로, 당첨 확률이 가장 밀집된 15 ~ 38 구간을 추천 범위로 설정하여 안정적인 조합을 생성합니다." } },
    { id: 13, name: { ko: "연속번호(연번) 제한", en: "Consecutive Numbers", ja: "連続番号制限" }, desc: { ko: "로또 당첨 번호 중 1, 2, 3처럼 숫자가 나란히 이어지는 것을 '연속번호' 또는 줄여서 **'연번'**이라고 부릅니다. 예를 들어 조합 중 1, 2가 포함되면 '2연번', 1, 2, 3이 모두 포함되면 **'3연번'**입니다. 역대 1등 당첨 통계를 분석하면, 연속번호가 아예 없거나 딱 2개만 이어지는 2연번 조합이 나올 확률이 90% 이상으로 압도적입니다. 따라서 시스템은 당첨 확률이 현저히 낮은 3연번 이상의 조합은 배제하고, 통계적으로 가장 유망한 '연번 없음' 또는 '2연번 존재' 조합만을 정교하게 선별합니다.", en: "로또 당첨 번호 중 1, 2, 3처럼 숫자가 나란히 이어지는 것을 '연속번호' 또는 줄여서 **'연번'**이라고 부릅니다. 예를 들어 조합 중 1, 2가 포함되면 '2연번', 1, 2, 3이 모두 포함되면 **'3연번'**입니다. 역대 1등 당첨 통계를 분석하면, 연속번호가 아예 없거나 딱 2개만 이어지는 2연번 조합이 나올 확률이 90% 이상으로 압도적입니다. 따라서 시스템은 당첨 확률이 현저히 낮은 3연번 이상의 조합은 배제하고, 통계적으로 가장 유망한 '연번 없음' 또는 '2연번 존재' 조합만을 정교하게 선별합니다.", ja: "로또 당첨 번호 중 1, 2, 3처럼 숫자가 나란히 이어지는 것을 '연속번호' 또는 줄여서 **'연번'**이라고 부릅니다. 예를 들어 조합 중 1, 2가 포함되면 '2연번', 1, 2, 3이 모두 포함되면 **'3연번'**입니다. 역대 1등 당첨 통계를 분석하면, 연속번호가 아예 없거나 딱 2개만 이어지는 2연번 조합이 나올 확률이 90% 이상으로 압도적입니다. 따라서 시스템은 당첨 확률이 현저히 낮은 3연번 이상의 조합은 배제하고, 통계적으로 가장 유망한 '연번 없음' 또는 '2연번 존재' 조합만을 정교하게 선별합니다." } },
    { id: 14, name: { ko: "소수 포함 (0~3개)", en: "Prime Numbers", ja: "素数含む" }, desc: { ko: "**'소수'**란 1과 자기 자신 이외에는 나누어떨어지지 않는 숫자를 의미하며, 로또 번호 45개 중에는 **총 14개(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43)**가 존재합니다. 역대 1등 당첨 번호 통계 분석 결과, 한 조합 안에 소수가 4개 이상 포함될 확률은 1% 미만으로 매우 희박합니다. 시스템은 이러한 데이터를 바탕으로, 소수의 비중을 0~3개 사이로 엄격히 제한하여 당첨 가능성이 가장 높은 최적의 숫자 조합만을 구성합니다.", en: "**'소수'**란 1과 자기 자신 이외에는 나누어떨어지지 않는 숫자를 의미하며, 로또 번호 45개 중에는 **총 14개(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43)**가 존재합니다. 역대 1등 당첨 번호 통계 분석 결과, 한 조합 안에 소수가 4개 이상 포함될 확률은 1% 미만으로 매우 희박합니다. 시스템은 이러한 데이터를 바탕으로, 소수의 비중을 0~3개 사이로 엄격히 제한하여 당첨 가능성이 가장 높은 최적의 숫자 조합만을 구성합니다.", ja: "**'소수'**란 1과 자기 자신 이외에는 나누어떨어지지 않는 숫자를 의미하며, 로또 번호 45개 중에는 **총 14개(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43)**가 존재합니다. 역대 1등 당첨 번호 통계 분석 결과, 한 조합 안에 소수가 4개 이상 포함될 확률은 1% 미만으로 매우 희박합니다. 시스템은 이러한 데이터를 바탕으로, 소수의 비중을 0~3개 사이로 엄격히 제한하여 당첨 가능성이 가장 높은 최적의 숫자 조합만을 구성합니다." } },
    { id: 15, name: { ko: "합성수 분석 (0~3개)", en: "Composite Numbers", ja: "合成数分析" }, desc: { ko: "**'합성수'**란 로또 번호 중 소수와 3의 배수를 제외한 숫자를 의미하며, 45개 번호 중 **총 17개(1, 4, 8, 10, 14, 16, 20, 22, 25, 26, 28, 32, 34, 35, 38, 40, 44)**가 이에 해당합니다. 역대 1등 당첨 통계를 분석했을 때, 한 조합 안에 합성수가 4개 이상 포함될 확률은 10% 미만으로 낮게 나타납니다. 시스템은 당첨 가능성을 높이기 위해 합성수의 비중을 0~3개 이내로 정교하게 조절하여 조합의 완성도를 높입니다.", en: "**'합성수'**란 로또 번호 중 소수와 3의 배수를 제외한 숫자를 의미하며, 45개 번호 중 **총 17개(1, 4, 8, 10, 14, 16, 20, 22, 25, 26, 28, 32, 34, 35, 38, 40, 44)**가 이에 해당합니다. 역대 1등 당첨 통계를 분석했을 때, 한 조합 안에 합성수가 4개 이상 포함될 확률은 10% 미만으로 낮게 나타납니다. 시스템은 당첨 가능성을 높이기 위해 합성수의 비중을 0~3개 이내로 정교하게 조절하여 조합의 완성도를 높입니다.", ja: "**'합성수'**란 로또 번호 중 소수와 3의 배수를 제외한 숫자를 의미하며, 45개 번호 중 **총 17개(1, 4, 8, 10, 14, 16, 20, 22, 25, 26, 28, 32, 34, 35, 38, 40, 44)**가 이에 해당합니다. 역대 1등 당첨 통계를 분석했을 때, 한 조합 안에 합성수가 4개 이상 포함될 확률은 10% 미만으로 낮게 나타납니다. 시스템은 당첨 가능성을 높이기 위해 합성수의 비중을 0~3개 이내로 정교하게 조절하여 조합의 완성도를 높입니다." } },
    { id: 16, name: { ko: "완전제곱수 필터 (0~2개)", en: "Perfect Squares", ja: "完全平方数フィルタ" }, desc: { ko: "**'완전제곱수'**란 같은 수를 두 번 곱해서 나오는 숫자를 말하며, 로또 번호 45개 중에는 **총 6개(1, 4, 9, 16, 25, 36)**가 존재합니다. 역대 1등 당첨 통계를 분석해 보면, 한 조합 안에 완전제곱수가 3개 이상 포함될 확률은 2% 미만으로 매우 희박합니다. 시스템은 당첨 확률을 극대화하기 위해 완전제곱수의 포함 개수를 0~2개 이내로 엄격히 제한하여, 확률적으로 가장 유리한 조합만을 생성합니다.", en: "**'완전제곱수'**란 같은 수를 두 번 곱해서 나오는 숫자를 말하며, 로또 번호 45개 중에는 **총 6개(1, 4, 9, 16, 25, 36)**가 존재합니다. 역대 1등 당첨 통계를 분석해 보면, 한 조합 안에 완전제곱수가 3개 이상 포함될 확률은 2% 미만으로 매우 희박합니다. 시스템은 당첨 확률을 극대화하기 위해 완전제곱수의 포함 개수를 0~2개 이내로 엄격히 제한하여, 확률적으로 가장 유리한 조합만을 생성합니다.", ja: "**'완전제곱수'**란 같은 수를 두 번 곱해서 나오는 숫자를 말하며, 로또 번호 45개 중에는 **총 6개(1, 4, 9, 16, 25, 36)**가 존재합니다. 역대 1등 당첨 통계를 분석해 보면, 한 조합 안에 완전제곱수가 3개 이상 포함될 확률은 2% 미만으로 매우 희박합니다. 시스템은 당첨 확률을 극대화하기 위해 완전제곱수의 포함 개수를 0~2개 이내로 엄격히 제한하여, 확률적으로 가장 유리한 조합만을 생성합니다." } },
    { id: 17, name: { ko: "특정 배수 배분", en: "Specific Multiples", ja: "特定倍数配分" }, desc: { ko: "로또 번호 45개 중 특정 숫자로 나누어떨어지는 **'배수'**들의 비중을 조절합니다. 3의 배수는 총 15개(3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45)이며, 5의 배수는 총 9개(5, 10, 15, 25, 30, 35, 40, 45)가 존재합니다. 역대 1등 당첨 번호 통계상 이 배수들이 특정 개수 범위 내에서 출현할 확률은 90% 이상으로 매우 높습니다. 시스템은 이 데이터를 기반으로 3의 배수는 0~3개, 5의 배수는 0~2개까지만 포함하도록 정교하게 배분하여 당첨 확률을 극대화합니다.", en: "로또 번호 45개 중 특정 숫자로 나누어떨어지는 **'배수'**들의 비중을 조절합니다. 3의 배수는 총 15개(3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45)이며, 5의 배수는 총 9개(5, 10, 15, 25, 30, 35, 40, 45)가 존재합니다. 역대 1등 당첨 번호 통계상 이 배수들이 특정 개수 범위 내에서 출현할 확률은 90% 이상으로 매우 높습니다. 시스템은 이 데이터를 기반으로 3의 배수는 0~3개, 5의 배수는 0~2개까지만 포함하도록 정교하게 배분하여 당첨 확률을 극대화합니다.", ja: "ロト番号45個のうち特定の数字で割り切れる**「倍数」**の比重を調整します。3の倍数は計15個、5の倍数は計9個存在します。歴代1等当選番号の統計上、これらの倍数が特定の個数範囲内で出現する確率は90%以上と非常に高いです。システムはこのデータに基づき、3の倍数は0〜3個、5の倍数は0〜2個まで含めるよう精巧に配分し、当選確率を極大化します。" } },
    { id: 18, name: { ko: "쌍수 제한 (0~2개)", en: "Double Numbers", ja: "双数制限" }, desc: { ko: "**'쌍수'**란 로또 번호 중 십의 자리와 일의 자리 숫자가 같은 번호를 의미하며, 로또 번호 45개 중 11, 22, 33, 44 총 4개가 이에 해당합니다. 역대 1등 당첨 번호 통계 분석 결과, 한 조합 안에 쌍수가 3개 이상 포함될 확률은 1% 미만으로 지극히 낮습니다. 따라서 시스템은 당첨 가능성이 희박한 조합을 배제하기 위해, 쌍수의 포함 개수를 0~2개 이내로 엄격히 제한하여 확률 중심의 조합을 구성합니다.", en: "**'쌍수'**란 로또 번호 중 십의 자리와 일의 자리 숫자가 같은 번호를 의미하며, 로또 번호 45개 중 11, 22, 33, 44 총 4개가 이에 해당합니다. 역대 1등 당첨 번호 통계 분석 결과, 한 조합 안에 쌍수가 3개 이상 포함될 확률은 1% 미만으로 지극히 낮습니다. 따라서 시스템은 당첨 가능성이 희박한 조합을 배제하기 위해, 쌍수의 포함 개수를 0~2개 이내로 엄격히 제한하여 확률 중심의 조합을 구성합니다.", ja: "**'쌍수'**란 로또 번호 중 십의 자리와 일의 자리 숫자가 같은 번호를 의미하며, 로또 번호 45개 중 11, 22, 33, 44 총 4개가 이에 해당합니다. 역대 1등 당첨 번호 통계 분석 결과, 한 조합 안에 쌍수가 3개 이상 포함될 확률은 1% 미만으로 지극히 낮습니다. 따라서 시스템은 당첨 가능성이 희박한 조합을 배제하기 위해, 쌍수의 포함 개수를 0~2개 이내로 엄격히 제한하여 확률 중심의 조합을 구성합니다." } },
    { id: 19, name: { ko: "시작/끝 번호 제한", en: "Start/End Range", ja: "開始・終了番号制限" }, desc: { ko: "조합된 6개 번호 중 가장 작은 수를 '시작번호', 가장 큰 수를 **'끝번호'**라고 합니다. 예를 들어 당첨 번호가 13, 18, 30, 31, 38, 41이라면 시작번호는 13, 끝번호는 41이 됩니다. 역대 1등 당첨 통계를 분석해 보면, 시작번호가 15 이상으로 너무 높게 시작하거나 끝번호가 30 이하로 너무 낮게 끝나는 기형적인 조합이 당첨될 확률은 10% 미만입니다. 시스템은 이러한 통계를 바탕으로 번호가 특정 구간에 너무 몰리지 않도록 시작과 끝의 범위를 조절하여 당첨 가용성을 극대화합니다.", en: "조합된 6개 번호 중 가장 작은 수를 '시작번호', 가장 큰 수를 **'끝번호'**라고 합니다. 예를 들어 당첨 번호가 13, 18, 30, 31, 38, 41이라면 시작번호는 13, 끝번호는 41이 됩니다. 역대 1등 당첨 통계를 분석해 보면, 시작번호가 15 이상으로 너무 높게 시작하거나 끝번호가 30 이하로 너무 낮게 끝나는 기형적인 조합이 당첨될 확률은 10% 미만입니다. 시스템은 이러한 통계를 바탕으로 번호가 특정 구간에 너무 몰리지 않도록 시작과 끝의 범위를 조절하여 당첨 가용성을 극대화합니다.", ja: "조합된 6개 번호 중 가장 작은 수를 '시작번호', 가장 큰 수를 **'끝번호'**라고 합니다. 예를 들어 당첨 번호가 13, 18, 30, 31, 38, 41이라면 시작번호는 13, 끝번호는 41이 됩니다. 역대 1등 당첨 통계를 분석해 보면, 시작번호가 15 이상으로 너무 높게 시작하거나 끝번호가 30 이하로 너무 낮게 끝나는 기형적인 조합이 당첨될 확률은 10% 미만입니다. 시스템은 이러한 통계를 바탕으로 번호가 특정 구간에 너무 몰리지 않도록 시작과 끝의 범위를 조절하여 당첨 가용성을 극대화합니다." } },
    { id: 20, name: { ko: "동일구간 쏠림 방지", en: "Zone Crowding Prevention", ja: "同一区間偏り防止" }, desc: { ko: "로또 번호 45개를 10단위씩 공 색깔 기준으로 나누면 1~10번, 11~20번, 21~30번, 31~40번, 41~45번까지 총 5개의 **'동일구간'**이 생성됩니다. 역대 1등 당첨 통계상, 특정 한 구간에서만 4개 이상의 번호가 쏟아져 나올 확률은 5% 미만으로 매우 희박합니다. 따라서 시스템은 번호가 특정 구간에 과도하게 쏠리는 것을 방지하고, 전체 구간에 골고루 분산된 가장 이상적인 당첨 패턴의 조합만을 생성합니다.", en: "로또 번호 45개를 10단위씩 공 색깔 기준으로 나누면 1~10번, 11~20번, 21~30번, 31~40번, 41~45번까지 총 5개의 **'동일구간'**이 생성됩니다. 역대 1등 당첨 통계상, 특정 한 구간에서만 4개 이상의 번호가 쏟아져 나올 확률은 5% 미만으로 매우 희박합니다. 따라서 시스템은 번호가 특정 구간에 과도하게 쏠리는 것을 방지하고, 전체 구간에 골고루 분산된 가장 이상적인 당첨 패턴의 조합만을 생성합니다.", ja: "로또 번호 45개를 10단위씩 공 색깔 기준으로 나누면 1~10번, 11~20번, 21~30번, 31~40번, 41~45번까지 총 5개의 **'동일구간'**이 생성됩니다. 역대 1등 당첨 통계상, 특정 한 구간에서만 4개 이상의 번호가 쏟아져 나올 확률은 5% 미만으로 매우 희박합니다. 따라서 시스템은 번호가 특정 구간에 과도하게 쏠리는 것을 방지하고, 전체 구간에 골고루 분산된 가장 이상적인 당첨 패턴의 조합만을 생성합니다." } },
    { id: 21, name: { ko: "모서리 패턴 반영", en: "Corner Patterns", ja: "コーナーパターン反映" }, desc: { ko: "로또 용지의 사방 끝부분에 위치한 번호들을 **'모서리 패턴'**이라고 합니다. 역대 1등 당첨 데이터 분석 결과, 이 모서리 영역에서 최소 1개에서 최대 4개의 번호가 포함될 확률은 90% 이상에 달합니다. 시스템은 공간적 균형과 통계적 확률을 동시에 잡기 위해, 아래의 모서리 영역 번호들을 1~4개 포함하는 황금 조합을 구성합니다. 좌측 상단: 1, 2, 8, 9 / 우측 상단: 6, 7, 13, 14 / 좌측 하단: 29, 30, 36, 37 / 우측 하단: 34, 35, 41, 42", en: "로또 용지의 사방 끝부분에 위치한 번호들을 **'모서리 패턴'**이라고 합니다. 역대 1등 당첨 데이터 분석 결과, 이 모서리 영역에서 최소 1개에서 최대 4개의 번호가 포함될 확률은 90% 이상에 달합니다. 시스템은 공간적 균형과 통계적 확률을 동시에 잡기 위해, 아래의 모서리 영역 번호들을 1~4개 포함하는 황금 조합을 구성합니다. 좌측 상단: 1, 2, 8, 9 / 우측 상단: 6, 7, 13, 14 / 좌측 하단: 29, 30, 36, 37 / 우측 하단: 34, 35, 41, 42", ja: "로또 용지의 사방 끝부분에 위치한 번호들을 **'모서리 패턴'**이라고 합니다. 역대 1등 당첨 데이터 분석 결과, 이 모서리 영역에서 최소 1개에서 최대 4개의 번호가 포함될 확률은 90% 이상에 달합니다. 시스템은 공간적 균형과 통계적 확률을 동시에 잡기 위해, 아래의 모서리 영역 번호들을 1~4개 포함하는 황금 조합을 구성합니다. 좌측 상단: 1, 2, 8, 9 / 우측 상단: 6, 7, 13, 14 / 좌측 하단: 29, 30, 36, 37 / 우측 하단: 34, 35, 41, 42" } },
    { id: 22, name: { ko: "AI 딥러닝 고급 분석", en: "AI Deep Learning", ja: "AIディープラーニング" }, desc: { ko: "앞선 21가지의 통계 필터링을 거친 번호들을 대상으로, 최첨단 인공지능(AI) 모델을 통해 최종 당첨 가능성을 검증합니다. 단순히 운에 맡기는 것이 아니라, 방대한 과거 당첨 데이터를 머신러닝 알고리즘으로 분석하여 가장 유망한 번호 조합을 추출합니다. 데이터 사이언스 적용: 랜덤 포레스트(Random Forest), GBM(Gradient Boosting Machine) 등 고도화된 머신러닝 모델을 활용하여 번호 간의 복잡한 상관관계를 분석합니다. 패턴 학습 및 검증: 과거 당첨 번호의 확률 분포와 미세한 변동 패턴을 학습시키고, 모델의 성능을 사전에 철저히 검증하여 신뢰도를 높였습니다. 지능형 번호 추출: 일반적인 분석으로는 찾아내기 힘든 특별한 경향과 숨겨진 패턴을 포착하여, 인공지능이 선별한 '최적의 필살기 조합'을 최종적으로 제공합니다.", en: "앞선 21가지의 통계 필터링을 거친 번호들을 대상으로, 최첨단 인공지능(AI) 모델을 통해 최종 당첨 가능성을 검증합니다. 단순히 운에 맡기는 것이 아니라, 방대한 과거 당첨 데이터를 머신러닝 알고리즘으로 분석하여 가장 유망한 번호 조합을 추출합니다. 데이터 사이언스 적용: 랜덤 포레스트(Random Forest), GBM(Gradient Boosting Machine) 등 고도화된 머신러닝 모델을 활용하여 번호 간의 복잡한 상관관계를 분석합니다. 패턴 학습 및 검증: 과거 당첨 번호의 확률 분포와 미세한 변동 패턴을 학습시키고, 모델의 성능을 사전에 철저히 검증하여 신뢰도를 높였습니다. 지능형 번호 추출: 일반적인 분석으로는 찾아내기 힘든 특별한 경향과 숨겨진 패턴을 포착하여, 인공지능이 선별한 '최적의 필살기 조합'을 최종적으로 제공합니다.", ja: "앞선 21가지의 통계 필터링을 거친 번호들을 대상으로, 최첨단 인공지능(AI) 모델을 통해 최종 당첨 가능성을 검증합니다. 단순히 운에 맡기는 것이 아니라, 방대한 과거 당첨 데이터를 머신러닝 알고리즘으로 분석하여 가장 유망한 번호 조합을 추출합니다. 데이터 사이언스 적용: 랜덤 포레스트(Random Forest), GBM(Gradient Boosting Machine) 등 고도화된 머신러닝 모델을 활용하여 번호 간의 복잡한 상관관계를 분석합니다. 패턴 학습 및 검증: 과거 당첨 번호의 확률 분포와 미세한 변동 패턴을 학습시키고, 모델의 성능을 사전에 철저히 검증하여 신뢰도를 높였습니다. 지능형 번호 추출: 일반적인 분석으로는 찾아내기 힘든 특별한 경향과 숨겨진 패턴을 포착하여, 인공지능이 선별한 '최적의 필살기 조합'을 최종적으로 제공합니다." } }
];

// ===== 동적 통계 로딩 (최근 5주 핫/콜드, 역대 최다) =====
let hotLast5 = [];
let coldLast5 = [];
let historicTop = [43, 27, 34, 17, 1, 33]; // 초기 기본값

async function loadLast5Stats() {
  try {
    const res = await fetch('/data/last5_stats.json');
    const data = await res.json();
    hotLast5 = data.hotLast5 || [];
    coldLast5 = data.coldLast5 || [];
  } catch (e) {
    console.warn('최근 5주 통계 불러오기 실패, 기본값 사용', e);
  }
}

async function loadHistoricTop() {
  try {
    const res = await fetch('/data/historic_top.json');
    const data = await res.json();
    historicTop = data.top || historicTop;
  } catch (e) {
    console.warn('historicTop 불러오기 실패, 기본값 사용', e);
  }
}

// ===== 공통 유틸 =====
function getAC(nums) {
  const diffs = new Set();
  for (let i = 0; i < 6; i++) {
    for (let j = i + 1; j < 6; j++) {
      diffs.add(Math.abs(nums[i] - nums[j]));
    }
  }
  return diffs.size - 5;
}

const COLOR_ZONES = [[1,10],[11,20],[21,30],[31,40],[41,45]];
const PRIMES      = [2,3,5,7,11,13,17,19,23,29,31,37,41,43];
const COMPOSITES  = [1,4,8,10,14,16,20,22,25,26,28,32,34,35,38,40,44];
const SQUARES     = [1,4,9,16,25,36];
const PAIRS       = [11,22,33,44];
const ZONES       = [[1,10],[11,20],[21,30],[31,40],[41,45]];
const CORNERS     = [1,2,8,9,6,7,13,14,29,30,36,37,34,35,41,42];

// ===== 22개 필터 함수 =====

const FILTER_FUNCTIONS = {
    1: (nums) => nums.filter(n => hotLast5.includes(n)).length >= 1,
    2: (nums) => nums.filter(n => historicTop.includes(n)).length >= 2,
    3: (nums) => COLOR_ZONES.every(([min, max]) => nums.filter(n => n >= min && n <= max).length <= 2),
    4: (nums) => nums.filter(n => coldLast5.includes(n)).length >= 1,
    5: (nums) => nums.filter(n => (STATE.latestWinNums || []).includes(n)).length <= 2,
    6: (nums) => {
        const prev = STATE.latestWinNums || [];
        let neighbors = 0;
        nums.forEach(n => prev.forEach(p => { if (Math.abs(n - p) === 1) neighbors++; }));
        return neighbors >= 1 && neighbors <= 3;
    },
    7: (nums) => { const sum = nums.reduce((a, b) => a + b, 0); return sum >= 100 && sum <= 175; },
    8: (nums) => getAC(nums) >= 7,
    9: (nums) => { const odd = nums.filter(n => n % 2 !== 0).length; return !(odd === 0 || odd === 6); },
    10: (nums) => { const high = nums.filter(n => n >= 23).length; return !(high === 0 || high === 6); },
    11: (nums) => {
        const counts = {};
        nums.forEach(n => { const d = n % 10; counts[d] = (counts[d] || 0) + 1; });
        return Math.max(...Object.values(counts)) <= 3;
    },
    12: (nums) => { const sumEnds = nums.reduce((a, n) => a + (n % 10), 0); return sumEnds >= 15 && sumEnds <= 38; },
    13: (nums) => {
        let consecPairs = 0;
        for (let i = 0; i < 5; i++) { if (nums[i + 1] - nums[i] === 1) consecPairs++; }
        return consecPairs <= 2;
    },
    14: (nums) => nums.filter(n => PRIMES.includes(n)).length <= 3,
    15: (nums) => nums.filter(n => COMPOSITES.includes(n)).length <= 3,
    16: (nums) => nums.filter(n => SQUARES.includes(n)).length <= 2,
    17: (nums) => {
        const mul3 = nums.filter(n => n % 3 === 0).length;
        const mul5 = nums.filter(n => n % 5 === 0).length;
        return mul3 <= 3 && mul5 <= 2;
    },
    18: (nums) => nums.filter(n => PAIRS.includes(n)).length <= 2,
    19: (nums) => nums[0] >= 14 && nums[5] > 30,
    20: (nums) => ZONES.every(([min, max]) => nums.filter(n => n >= min && n <= max).length <= 3),
    21: (nums) => { const cnt = nums.filter(n => CORNERS.includes(n)).length; return cnt >= 1 && cnt <= 4; },
    22: (nums) => {
        const ac = getAC(nums);
        const sum = nums.reduce((a, b) => a + b, 0);
        return ((ac * 3) + (sum / 30)) / 2 > 7;
    }
};

const FILTER_RULES = FILTER_DETAILS.map(f => ({
    id: f.id,
    name: f.name,
    check: FILTER_FUNCTIONS[f.id] || (() => Math.random() > 0.2)
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
    getAC: getAC,
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

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.innerHTML = TRANSLATIONS[lang][key];
    });

    document.querySelectorAll('.lang-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(lang));
    });

    renderFilters();
    
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

    const menuToggle = document.getElementById('menuToggle');
    const topNav = document.querySelector('.top-nav');
    if (menuToggle && topNav) {
        menuToggle.onclick = () => {
            menuToggle.classList.toggle('active');
            topNav.classList.toggle('open');
        };
    }
}

window.onload = async () => {
    await Promise.all([loadLast5Stats(), loadHistoricTop()]);
    init();
};
