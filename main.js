/**
 * LOTTOBUGGING v8.1 - Data Evidence & Transparency
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
        welcome_title: "로또버깅",
        welcome_desc: "무료 AI 로또 필터링 분석",
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
        welcome_title: "LottoBugging",
        welcome_desc: "Free AI Lotto Filtering Analysis",
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
        welcome_title: "ロトバギング",
        welcome_desc: "無料AIロトフィルタリング分析",
        prob_label: "Algorithm Fitness Score",
        system_ready: "SYSTEM READY",
        qty_label: "抽出データセット (Quantity)",
        btn_generate: "데이터 분석 및 조합 생성 실행",
        strategy_header: "分析戦略",
        preset_basic: "標準統計",
        preset_pattern: "パターン集中",
        preset_full: "AI精密",
        preset_reset: "初期화",
        filter_header: "フィルタリング条件",
        footer_privacy: "個人情報保護方針",
        footer_terms: "利用規約",
        footer_contact: "お問い合わせ",
        footer_copyright: "&copy; 2026 LOTTOBUGGING Data Science Lab. All Rights Reserved.",
        analysis_report: "分析レポート",
        processing: "데이터 분석 중...",
        optimal_badge: "最適組み合わせ",
        lang_display: "言語選択"
    }
};

const FILTER_DETAILS = [
    { 
        id: 1, 
        name: { ko: "최근 5주간 당첨번호 비율 (핫넘버)", en: "Hot Numbers (Last 5 Weeks)", ja: "直近5週間の当選番号比率" }, 
        desc: { 
            ko: "실시간 API 연동을 통해 최근 5주간 출현 빈도가 높은 '핫넘버'를 우선 선별합니다. 로또의 단기 반복 출현 경향을 반영하여 현재 가장 강력한 흐름을 가진 번호를 조합에 즉각 반영합니다.", 
            en: "Selects 'Hot Numbers' with high appearance frequency in the last 5 weeks. Reflects short-term repetition trends to incorporate numbers with the strongest current momentum.", 
            ja: "直近5週間の出現頻度が高い「ホットナンバー」を優先的に選別します。短期的な反復出現傾向を反映し、現在の流れを組み合わせに反映します。" 
        },
        why: {
            ko: "로또 공은 물리적으로 동일한 확률을 갖지만, 단기적으로는 특정 번호가 몰려 나오는 '흐름'이 존재합니다. 이 필터는 그 흐름을 타는 전략입니다.",
            en: "While balls have equal physical probability, short-term 'flows' often occur. This filter targets that specific momentum.",
            ja: "ロトの玉は物理的に同確率ですが、短期的には特定の番号が集中する「流れ」が存在します。このフィルタはその流れに乗る戦略です。"
        },
        exampleNums: [5, 11, 25, 27, 36, 38],
        exAnalysis: {
            ko: "최근 5주간 당첨 데이터 분석 결과, 위 조합에서 5번, 11번, 36번이 현재 '핫넘버'에 해당되어 포함되었습니다.",
            en: "Analysis shows that numbers 5, 11, and 36 in this set are classified as 'Hot Numbers' based on the last 5 weeks' data.",
            ja: "直近5週間の当選データ分析の結果、上記の組み合わせから5番、11番、36番が現在の「ホットナンバー」に該当し含まれました。"
        },
        passEx: { ko: "최근 5주간 2회 이상 출연한 번호가 1개 이상 포함됨", en: "Includes 1+ numbers that appeared 2+ times in 5 weeks.", ja: "直近5週間に2回以上出現した番号が1つ以上含まれる" },
        failEx: { ko: "최근 한 달간 한 번도 나오지 않은 번호로만 구성됨", en: "Uses only numbers that haven't appeared in a month.", ja: "直近1ヶ月間一度も出ていない番号のみで構成される" }
    },
    { 
        id: 2, 
        name: { ko: "역대 최다 당첨번호 반영", en: "Historical High Frequency", ja: "歴代最多当選番号の反映" }, 
        desc: { 
            ko: "제1회차부터 현재까지의 전체 누적 빅데이터를 분석하여, 당첨 횟수가 가장 많은 '검증된 번호'들을 포함합니다. 역사가 증명한 고빈도 번호(예: 43번 등)를 활용하여 당첨 확률의 기본기를 잡습니다.", 
            en: "Analyzes the entire historical big data to include 'proven numbers' with the highest win counts.", 
            ja: "第1回から現在までの全累積データを分析し、当選回数が最も多い「検証済みの番号」を含めます。" 
        },
        why: {
            ko: "누적 데이터는 거짓말을 하지 않습니다. 오랜 기간 많이 당첨된 번호는 통계적 안정성이 높음을 의미합니다.",
            en: "Cumulative data doesn't lie. High historical frequency indicates statistical stability over a long period.",
            ja: "累積データは嘘をつきません。長期間多く当選した番号は、統計的な安定性が高いことを意味します。"
        },
        exampleNums: [1, 13, 17, 27, 34, 43],
        exAnalysis: {
            ko: "역대 누적 데이터에서 당첨 횟수 TOP 10에 드는 43번(부동의 1위)과 1번, 27번이 전략적으로 배치된 조합입니다.",
            en: "Includes No. 43 (historically most drawn), No. 1, and No. 27, all of which rank within the top 10 historical frequencies.",
            ja: "歴代累積データで当選回数TOP10に入る43番（不動の1位）と1番、27番が戦略的に配置された組み合わせです。"
        },
        passEx: { ko: "역대 누적 당첨 TOP 10 번호 중 2개 이상 포함", en: "Includes 2+ numbers from the historical TOP 10 list.", ja: "歴代累積当選TOP10の番号のうち2つ以上を含む" },
        failEx: { ko: "역대 당첨 횟수가 가장 적은 하위권 번호들로만 구성", en: "Uses only numbers with the lowest historical win counts.", ja: "歴代当選回数が最も少ない下位の番号のみで構成される" }
    },
    { 
        id: 3, 
        name: { ko: "색상 분포 비율 최적화", en: "Color Distribution", ja: "カラー分布比率の最適化" }, 
        desc: { 
            ko: "최근 5주간 당첨된 번호들의 색상(구간) 비율을 실시간으로 분석하여, 특정 번호대에 치우치지 않는 최적의 밸런스를 찾아냅니다.", 
            en: "Analyzes the color ratios of winning numbers in real-time to find an optimal balance across zones.", 
            ja: "直近5週間の当選番号の色比率を分析し、特定の番号帯に偏らない最適なバランスを見つけます。" 
        },
        why: {
            ko: "특정 색상(번호대)에서 모든 번호가 나올 확률은 매우 낮습니다. 골고루 섞어야 당첨권에 들어갈 확률이 높아집니다.",
            en: "The probability of all numbers coming from one color zone is extremely low. A balanced mix is key.",
            ja: "特定の色（番号帯）からすべての番号が出る確率は非常に低いです。均等に混ぜることで当選確率が高まります。"
        },
        exampleNums: [1, 2, 12, 23, 34, 45],
        exAnalysis: {
            ko: "노랑(1,2), 파랑(12), 빨강(23), 회색(34), 보라(45) 등 5개 색상 전 구간에서 번호가 골고루 배출된 이상적 모델입니다.",
            en: "Demonstrates an ideal model where numbers are drawn from all 5 color zones: Yellow, Blue, Red, Gray, and Purple.",
            ja: "黄色(1,2)、青(12)、赤(23)、灰色(34)、紫(45)の5つの全カラー区間から番号が均等に選出された理想的なモデルです。"
        },
        passEx: { ko: "5개 색상 구역 중 3개 이상의 구역에서 번호가 배출됨", en: "Numbers are drawn from 3 or more color zones.", ja: "5つの色区間のうち3つ以上の区間から番号が選出される" },
        failEx: { ko: "노란색(1~10번) 구간에서만 4개 이상의 번호가 쏠림", en: "4+ numbers are concentrated in the Yellow (1-10) zone.", ja: "黄色(1〜10番)区間のみに4つ以上の番号가偏る" }
    },
    { 
        id: 4, 
        name: { ko: "최근 5주간 미출수(콜드넘버) 전략", en: "Cold Numbers Strategy", ja: "直近5週間の未出現数戦略" }, 
        desc: { 
            ko: "최근 5주간 한 번도 당첨되지 않은 번호 중, 역대 누적 당첨 횟수가 많아 반등 확률이 높은 '잠재 번호'를 선별하여 포함합니다.", 
            en: "Selects 'Potential Numbers' that haven't won recently but have a high probability of a rebound.", 
            ja: "直近5週間に当選していない番号のうち、反発確率が高い「潜在番号」を選別して含めます。" 
        },
        why: {
            ko: "나오지 않은 번호는 결국 나오게 되어 있습니다(평균 회귀의 법칙). 임계점에 도달한 미출수를 잡는 것이 핵심입니다.",
            en: "Numbers that haven't appeared will eventually return (Law of Mean Reversion). Capturing cold numbers at their limit is vital.",
            ja: "出ていない番号はいずれ出ることになります（平均回帰の法則）。臨界点に達した未出現数を捉えるのが核心です。"
        },
        exampleNums: [2, 15, 22, 29, 31, 40],
        exAnalysis: {
            ko: "위 조합에는 최근 5주간 출현하지 않았으나 통계적으로 반등 시기가 임박한 15번과 31번이 포함되어 있습니다.",
            en: "Includes numbers 15 and 31, which haven't appeared in the last 5 weeks but are statistically overdue for a comeback.",
            ja: "上記の組み合わせには直近5週間出現していませんが、統計的に反発時期が迫っている15番と31番が含まれています。"
        },
        passEx: { ko: "5주 이상 미출현한 번호 중 강력 추천수 1개 포함", en: "Includes 1 recommended number absent for 5+ weeks.", ja: "5週間以上未出現の番号のうち、強力な推奨数を1つ含む" },
        failEx: { ko: "최근 매주 나오고 있는 번호(핫넘버)로만 전체 조합 구성", en: "Composition consists entirely of high-frequency hot numbers.", ja: "直近で毎週出ている番号（ホットナンバー）のみで構成される" }
    },
    { 
        id: 5, 
        name: { ko: "직전 회차 이월수 (0 ~ 2개)", en: "Previous Draw Carry-over", ja: "前回の繰越し数" }, 
        desc: { 
            ko: "지난주 당첨 번호가 이번 회차에 다시 출현하는 '이월' 현상은 매주 약 60% 이상의 높은 확률로 발생합니다. 무작위로 0~2개를 조합에 포함시킵니다.", 
            en: "The 'Carry-over' phenomenon occurs in over 60% of draws. Includes 0-2 numbers from the previous week.", 
            ja: "前回の当選番号が再び出現する「繰越し」現象は、毎週60%以上の確率で発生します。ランダムに0〜2個を含めます。" 
        },
        why: {
            ko: "통계적으로 직전 회차 번호가 1~2개 다시 나오는 경우가 가장 빈번합니다. 이 패턴을 무시하면 당첨 확률이 낮아집니다.",
            en: "Statistically, 1-2 numbers from the previous draw often reappear. Ignoring this pattern reduces overall odds.",
            ja: "統計的に直前の番号이 1〜2個再び出るケースが最も頻繁です。このパターンを無視すると当選確率が下がります。"
        },
        exampleNums: [5, 11, 18, 22, 30, 41],
        exAnalysis: {
            ko: "직전 회차 당첨 번호인 5번과 11번 중, '5번'을 이월수로 채택하여 번호의 연속성을 반영한 예시입니다.",
            en: "Incorporates number 5 from the previous week's winning set as a carry-over to maintain continuity.",
            ja: "直前の当選番号である5番と11番のうち、「5番」を繰越し数として採用し、番号の連続性を反映した例です。"
        },
        passEx: { ko: "지난주 당첨 번호 중 1개가 이번 조합에 포함됨", en: "Includes exactly 1 number from the previous winning set.", ja: "前回の当選番号のうち1つが今回の組み合わせに含まれる" },
        failEx: { ko: "지난주 당첨 번호를 4개 이상 중복 포함함 (매우 희박)", en: "Includes 4+ carry-over numbers (extremely rare).", ja: "前回の当選番号を4つ以上重複して含む（極めて稀）" }
    },
    { 
        id: 6, 
        name: { ko: "직전 회차 이웃수 (1 ~ 3개)", en: "Previous Draw Neighbors", ja: "前回の隣接数" }, 
        desc: { 
            ko: "당첨 번호의 바로 옆 번호가 다음 회차에 등장하는 것을 '이웃수'라고 합니다. 시스템은 직전 회차 번호들의 ±1에 해당하는 번호들 중 1~3개를 조합에 배치합니다.", 
            en: "Includes 1-3 'Neighbor Numbers' (±1 of previous draw results) to capture the unique sliding trend.", 
            ja: "当選番号のすぐ隣の番号が出る「隣接数」を1〜3個配置し、番号がずれて出る特有の流れを捉えます。" 
        },
        why: {
            ko: "로또 번호는 직전 번호 근처에서 생성되는 '연쇄성'을 보입니다. 이웃수를 넣는 것은 실전 분석의 핵심입니다.",
            en: "Lotto numbers often show 'chain reactions' near previous results. Including neighbors is a core practical strategy.",
            ja: "ロト番号は直前の番号付近で生成される「連鎖性」を示します。隣接数を入れることは実戦分析の核心です。"
        },
        exampleNums: [4, 6, 10, 12, 24, 26],
        exAnalysis: {
            ko: "지난주 당첨번호 5, 11, 25번의 인접수인 4, 6, 10, 12, 24, 26번 중 4번과 12번을 포함시킨 예시입니다.",
            en: "Includes numbers 4 and 12, which are the neighbors (±1) of the previous winning numbers 5 and 11.",
            ja: "前回の当選番号5, 11, 25番の隣接数である4, 6, 10, 12, 24, 26番のうち、4番と12番を含めた例です。"
        },
        passEx: { ko: "지난주 5번이 나왔을 때, 이웃수인 4번 또는 6번이 포함됨", en: "Includes 4 or 6 if 5 appeared in the last draw.", ja: "前回5番が出た場合、隣接数である4番または6番が含まれる" },
        failEx: { ko: "지난주 번호와 전혀 상관없는 원거리 번호로만 구성", en: "Uses only distant numbers unrelated to the last draw.", ja: "前回の番号と全く関係のない遠い番号のみで構成される" }
    },
    { 
        id: 7, 
        name: { ko: "총합 구간 (100 ~ 175)", en: "Total Sum Range", ja: "総和区間" }, 
        desc: { 
            ko: "선택된 조합 번호 6개를 모두 더한 값을 '총합'이라고 합니다. 통계적으로 총합이 100~175 사이의 핵심 구간에 위치할 확률이 가장 높습니다.", 
            en: "The sum of all 6 numbers. Statistically, winning sets most likely fall within the 100-175 range.", 
            ja: "6つの番号の合計値。統計的に総和が100〜175の間の核心区間に位置する確率が最も高いです。" 
        },
        why: {
            ko: "번호가 너무 작거나(1,2,3,4,5,6) 너무 크면(40,41,42,43,44,45) 당첨 확률이 제로에 가깝습니다. 중간값으로 수렴해야 합니다.",
            en: "Extremely low or high sums have near-zero win rates. Distribution must converge toward the center.",
            ja: "番号が小さすぎたり大きすぎたりすると当選確率はゼロに近くなります。中間値に収束させる必要があります。"
        },
        exampleNums: [10, 15, 22, 28, 35, 42],
        exAnalysis: {
            ko: "위 번호들의 총합은 152입니다. 이는 역대 당첨 번호들이 가장 많이 분포된 '황금 구간'에 해당합니다.",
            en: "The total sum of these numbers is 152, which falls within the 'Golden Range' observed in most historical wins.",
            ja: "上記の番号の総和は152です。これは歴代当選番号が最も多く分布している「黄金区間」に該当します。"
        },
        passEx: { ko: "조합의 총합이 152로 안정적인 범위 내에 존재함", en: "Total sum is 152, which is well within the stable range.", ja: "組み合わせの総和が152で安定した範囲内に存在する" },
        failEx: { ko: "총합이 55이거나 230인 극단적인 조합", en: "Total sum is extremely low (55) or high (230).", ja: "総和が55または230の極端な組み合わせ" }
    },
    { 
        id: 8, 
        name: { ko: "AC값 (산술적 복잡도) 7 이상", en: "AC Value (Complexity) 7+", ja: "AC値7以上" }, 
        desc: { 
            ko: "'AC값'이란 로또 번호 6개가 얼마나 무작위로 골고루 섞여 있는지를 나타내는 산술적 복잡도 지수입니다. 7 이상의 복잡한 조합이 전체 당첨의 80% 이상을 차지합니다.", 
            en: "AC Value measures randomness. Sets with AC 7 or higher account for over 80% of historical 1st prize wins.", 
            ja: "AC値はランダム性を示します。7以上の複雑な組み合わせが全体の当選の80%以上を占めます。" 
        },
        why: {
            ko: "단순한 패턴은 당첨될 확률이 극히 낮습니다. AC값은 인위적인 패턴을 배제하고 무작위성을 검증하는 도구입니다.",
            en: "Simple patterns rarely win. AC values are used to exclude artificial patterns and verify true randomness.",
            ja: "単純なパターンは当選確率が極めて低いです。AC値は人為的なパターンを排除し、ランダム性を検証する道具です。"
        },
        exampleNums: [5, 12, 23, 25, 38, 44],
        exAnalysis: {
            ko: "각 번호 간의 모든 차잇값을 분석한 결과, 중복을 제외한 고유 차잇값이 많아 AC값 8을 기록했습니다.",
            en: "Calculated by analyzing all differences between pairs; this set has a high degree of variation, resulting in AC 8.",
            ja: "各番号間のすべての差を分析した結果、重複を除いた固有の差が多く、AC値8を記録しました。"
        },
        passEx: { ko: "번호 간 차잇값의 개수가 다양하여 AC값이 8로 나옴", en: "Features diverse differences between numbers, resulting in AC 8.", ja: "番号間の差の個数が多様で、AC値が8となる" },
        failEx: { ko: "1, 2, 3, 4, 5, 6 과 같이 규칙적인 조합 (AC값 0)", en: "Sequential set like 1, 2, 3, 4, 5, 6 (AC value 0).", ja: "1, 2, 3, 4, 5, 6のような規則的な組み合わせ（AC値0）" }
    },
    { 
        id: 9, 
        name: { ko: "홀짝 비율 (6:0, 0:6 제외)", en: "Odd:Even Ratio", ja: "奇数・偶数比率" }, 
        desc: { 
            ko: "조합된 번호 6개 중 홀수와 짝수의 비율을 분석합니다. 6:0 또는 0:6인 기형적인 조합을 자동으로 제외하고 가장 빈도가 높은 배합을 적용합니다.", 
            en: "Analyzes the ratio of odd and even numbers. Automatically excludes rare 6:0 or 0:6 extreme distributions.", 
            ja: "奇数と偶数の比率を分析します。6:0または0:6の異常な組み合わせを除外し、最も頻度が高い配合を適用します。" 
        },
        why: {
            ko: "자연의 법칙상 홀수와 짝수는 비슷한 비율로 섞여 나올 확률이 압도적으로 높습니다.",
            en: "In probability, odd and even numbers are most likely to appear in a relatively balanced mix.",
            ja: "自然の法則上、奇数と偶数は似たような比率で混ざって出る確率이圧倒的に高いです。"
        },
        exampleNums: [3, 10, 17, 22, 31, 44],
        exAnalysis: {
            ko: "홀수(3, 17, 31) 3개와 짝수(10, 22, 44) 3개로 구성되어 가장 이상적인 3:3 비율을 보여줍니다.",
            en: "Features 3 odd (3, 17, 31) and 3 even (10, 22, 44) numbers, representing the most common 3:3 win ratio.",
            ja: "奇数(3, 17, 31)3つと偶数(10, 22, 44)3つで構成され、最も理想的な3:3の比率を示しています。"
        },
        passEx: { ko: "홀수 3개, 짝수 3개로 완벽한 3:3 밸런스 유지", en: "Perfect 3:3 balance with 3 odd and 3 even numbers.", ja: "奇数3つ、偶数3つで完璧な3:3バランスを維持" },
        failEx: { ko: "모든 번호가 짝수(2, 10, 20, 30, 40, 44)로만 구성됨", en: "All numbers are even (0:6 ratio).", ja: "すべての番号が偶数（2, 10, 20, 30, 40, 44）のみで構成される" }
    },
    { 
        id: 10, 
        name: { ko: "고저 비율 (6:0, 0:6 제외)", en: "High:Low Ratio", ja: "高低比率" }, 
        desc: { 
            ko: "중간값 23을 기준으로 1~22번(저번호), 23~45번(고번호)의 비율을 조절하여 한쪽으로 쏠린 조합을 방지합니다.", 
            en: "Balances 'Low' (1-22) and 'High' (23-45) numbers based on the midpoint 23 to prevent heavy bias.", 
            ja: "中間値23を基準に、低番号(1〜22)と高番号(23〜45)の比率を調整し、偏りを防止します。" 
        },
        why: {
            ko: "번호가 앞쪽(낮은 수)이나 뒤쪽(높은 수)에만 몰려 나오는 경우는 통계적으로 매우 드뭅니다.",
            en: "Sets concentrated only at the beginning (Low) or end (High) of the range are statistically rare.",
            ja: "番号が前方（低い数）や後方（高い数）だけに偏って出るケースは統計的に非常に稀です。"
        },
        exampleNums: [5, 12, 19, 28, 33, 42],
        exAnalysis: {
            ko: "23 미만의 저번호 3개(5, 12, 19)와 고번호 3개(28, 33, 42)로 고르게 분포된 예시입니다.",
            en: "Includes 3 low numbers (5, 12, 19) and 3 high numbers (28, 33, 42) for a balanced distribution across the board.",
            ja: "23未満の低番号3つ(5, 12, 19)と高番号3つ(28, 33, 42)で均等に分布した例です。"
        },
        passEx: { ko: "저번호 3개, 고번호 3개로 균형 잡힌 배합", en: "Balanced mix with 3 low and 3 high numbers.", ja: "低番号3つ、高番号3つでバランスの取れた配合" },
        failEx: { ko: "1부터 22 사이의 낮은 번호로만 6개 모두 선택됨", en: "All 6 numbers are chosen from the low 1-22 range.", ja: "1から22の間の低い番号のみで6つすべて選択される" }
    },
    { 
        id: 11, 
        name: { ko: "동일 끝수 (0 ~ 3개 포함)", en: "Same Ending Digit", ja: "同一末尾" }, 
        desc: { 
            ko: "일의 자리 숫자가 같은 '동일 끝수'가 4개 이상 포함될 확률은 1% 미만입니다. 끝수 중복을 최대 3개로 제한합니다.", 
            en: "Limits same ending digits to a maximum of 3, as featuring 4+ occurs in less than 1% of wins.", 
            ja: "下一桁が同じ「同一末尾」が4つ以上含まれる確率は1%未満です。重複を最大3つに制限します。" 
        },
        why: {
            ko: "끝수가 같은 번호가 너무 많으면 인위적인 패턴이 되기 쉽습니다. 자연스러운 무작위 조합을 지향합니다.",
            en: "Too many identical ending digits often imply an artificial pattern rather than a random draw.",
            ja: "末尾가 같은 번호가 많으면 인위적인 패턴이 되기 쉽습니다. 자연스러운 무작위 조합을 지향합니다。"
        },
        exampleNums: [2, 5, 12, 18, 22, 30],
        exAnalysis: {
            ko: "끝수가 '2'인 번호가 3개(2, 12, 22) 포함되어 있으나, 임계치인 4개 미만이므로 당첨 가용권에 들어옵니다.",
            en: "Contains 3 numbers ending in '2'. Since this is below the risky limit of 4, it remains a high-probability set.",
            ja: "末尾が「2」の番号が3つ(2, 12, 22)含まれていますが、臨界値である4つ未満なため、当選可用圏内に入ります。"
        },
        passEx: { ko: "끝수가 '2'인 번호가 3개 포함되어 허용 범위 내 존재", en: "Includes 3 numbers ending in '2', staying within the allowed limit.", ja: "末尾が「2」の番号が3つ含まれ、許容範囲内に存在" },
        failEx: { ko: "1, 11, 21, 31, 41 등 끝수가 같은 번호가 5개나 포함됨", en: "Includes 5 numbers with the same ending digit (e.g., 1, 11, 21, 31, 41).", ja: "1, 11, 21, 31, 41など末尾が同じ番号가 5つも含まれる" }
    },
    { 
        id: 12, 
        name: { ko: "끝수 총합 (15 ~ 38)", en: "Last Digit Sum", ja: "末尾総和" }, 
        desc: { 
            ko: "각 번호 일의 자리 숫자의 총합이 15 ~ 38 구간에 들어올 확률은 무려 90%에 달하므로 이 구간을 타격합니다.", 
            en: "Targets the 15-38 range for the sum of all ones-place digits, which covers 90% of winning draws.", 
            ja: "各番号の下一桁の総和が15〜38の区間に入る確率は90%에達하기 때문에, この区間を狙います。" 
        },
        why: {
            ko: "끝수들의 합 또한 정규 분포를 따릅니다. 너무 작거나 큰 끝수 합은 확률적으로 배제하는 것이 좋습니다.",
            en: "The sum of ending digits also follows a normal distribution. Extreme sums are statistically unlikely.",
            ja: "末尾の和も正規分布に従います。小さすぎたり大きすぎたりする末尾の和は統計的に除外するのが良いです。"
        },
        exampleNums: [2, 13, 24, 25, 36, 41],
        exAnalysis: {
            ko: "각 끝수(2,3,4,5,6,1)의 합은 21입니다. 이는 당첨 확률이 매우 높은 15~38 구간의 정중앙에 위치합니다.",
            en: "The sum of the digits (2+3+4+5+6+1) is 21, which perfectly aligns with the high-frequency 15-38 range.",
            ja: "各末尾(2,3,4,5,6,1)の和は21です。これは当選確率が非常に高い15〜38区間の正中央に位置します。"
        },
        passEx: { ko: "끝수 합(2+3+4+5+6+1)이 21로 매우 안정적인 수치임", en: "The sum of ending digits is 21, which is a very stable value.", ja: "末尾の和(2+3+4+5+6+1)が21で非常に安定した数値である" },
        failEx: { ko: "끝수 합이 5이거나 42인 경우 (통계적 희박)", en: "Ending digit sum is extremely low (5) or high (42).", ja: "末尾の和が5または42の場合（統計的に稀）" }
    },
    { 
        id: 13, 
        name: { ko: "연속번호(연번) 제한", en: "Consecutive Numbers", ja: "連続番号制限" }, 
        desc: { 
            ko: "숫자가 나란히 이어지는 연번이 아예 없거나 딱 2개만 이어지는 조합이 당첨 결과의 90% 이상을 차지합니다. 3연번 이상은 배제합니다.", 
            en: "Over 90% of wins feature no or only two consecutive numbers. Filters out sets with 3 or more consecutive values.", 
            ja: "数字が並ぶ連番が全くないか、ちょうど2つだけ続く組み合わせが当選結果の90%以上を占めます。3連番以上は排除します。" 
        },
        why: {
            ko: "1-2-3-4 처럼 길게 이어지는 번호는 실제 당첨에서 거의 나타나지 않는 기하학적 확률입니다.",
            en: "Long sequences like 1-2-3-4 are geometrical anomalies that almost never occur in real draws.",
            ja: "1-2-3-4のように長く続く番号は、実際の当選でほとんど現れない幾何学的な確率です。"
        },
        exampleNums: [5, 6, 18, 19, 33, 45],
        exAnalysis: {
            ko: "위 조합에는 '5-6'과 '18-19'라는 두 쌍의 2연번이 포함되어 있습니다. 이는 통계상 매우 안정적인 구성입니다.",
            en: "Includes two pairs of consecutive numbers (5-6 and 18-19), a structure common in winning combinations.",
            ja: "上記の組み合わせには「5-6」と「18-19」という2組の2連番が含まれています。これは統計上非常に安定した構成です。"
        },
        passEx: { ko: "5-6, 18-19 처럼 2연번 두 쌍까지만 허용함", en: "Allows up to two pairs of 2-consecutive numbers (e.g., 5-6 and 18-19).", ja: "5-6, 18-19のように2連番が2つまで許容される" },
        failEx: { ko: "10, 11, 12, 13 처럼 4개가 나란히 이어지는 조합", en: "A sequence of 4 consecutive numbers (e.g., 10, 11, 12, 13).", ja: "10, 11, 12, 13のように4つが並んで続く組み合わせ" }
    },
    { 
        id: 14, 
        name: { ko: "소수 포함 (0 ~ 3개)", en: "Prime Numbers", ja: "素数含む" }, 
        desc: { 
            ko: "1과 자기 자신 이외에는 나누어떨어지지 않는 14개의 소수의 비중을 0~3개 사이로 엄격히 제한하여 최적 조합을 구성합니다.", 
            en: "Strictly limits the 14 prime numbers to 0-3 per combination to maintain high-probability profiles.", 
            ja: "1と自分自身以外で割り切れない14個の素数の比率を0〜3個の間に厳格に制限し、最適組み合わせを構成します。" 
        },
        why: {
            ko: "소수는 수학적으로 특수한 성질을 갖지만, 로또 당첨 조합에서는 4개 이상 포함되는 경우가 극히 드뭅니다.",
            en: "While primes are unique mathematically, having 4+ in a winning set is statistically rare.",
            ja: "素数は数学的に特殊な性質を持ちますが、ロト当選組み合わせで4つ以上含まれるケースは極めて稀です。"
        },
        exampleNums: [2, 7, 13, 20, 30, 44],
        exAnalysis: {
            ko: "6개 번호 중 2, 7, 13번이 소수에 해당합니다. 총 3개로 임계치(3개)를 준수하고 있습니다.",
            en: "Contains 3 prime numbers (2, 7, and 13), meeting the criteria for high-probability distribution.",
            ja: "6つの番号のうち2, 7, 13番が素数に該当します。計3つで臨界値(3つ)を遵守しています。"
        },
        passEx: { ko: "소수가 3개(2, 7, 13) 포함되어 통계적 안정권임", en: "Includes 3 primes (2, 7, 13), staying within the stable range.", ja: "素数が3つ(2, 7, 13)含まれ、統計적安定圏内である" },
        failEx: { ko: "2, 3, 5, 7, 11, 13 처럼 소수로만 6개 모두 구성됨", en: "Set is composed entirely of primes (e.g., 2, 3, 5, 7, 11, 13).", ja: "2, 3, 5, 7, 11, 13のように素数のみで6つすべて構成される" }
    },
    { 
        id: 15, 
        name: { ko: "합성수 분석 (0 ~ 3개)", en: "Composite Numbers", ja: "合成数分析" }, 
        desc: { 
            ko: "소수와 3의 배수를 제외한 17개의 합성수 비중을 조절합니다. 통계상 4개 이상 포함될 확률이 낮으므로 완성도를 높입니다.", 
            en: "Regulates the 17 composite numbers (excluding primes and 3-multiples) to optimize set quality.", 
            ja: "素数と3の倍数を除いた17個の合成数の比率を調整します。4つ以上含まれる確率は低いため、完成度を高めます。" 
        },
        why: {
            ko: "특정 성질을 가진 번호들만 몰려 있으면 당첨 가능성이 낮아집니다. 합성수 역시 적절한 비율이 중요합니다.",
            en: "A concentration of numbers with specific mathematical properties decreases the overall win rate.",
            ja: "特定の性質を持つ番号だけが偏っていると当選の可能性が低くなります。合成数も適切な比率が重要です。"
        },
        exampleNums: [1, 8, 14, 21, 33, 45],
        exAnalysis: {
            ko: "위 조합에서 1, 8, 14번이 합성수로 분류됩니다. 적절한 3개의 합성수 배합으로 확률을 최적화했습니다.",
            en: "Numbers 1, 8, and 14 are classified as composites in this set, maintaining an optimal frequency.",
            ja: "上記の組み合わせで1, 8, 14番が合成数に分類されます。適切な3つの合成数配合で確率を最適化しました。"
        },
        passEx: { ko: "합성수가 3개(1, 8, 14) 포함되어 이상적인 비율 유지", en: "Features 3 composite numbers (1, 8, 14), maintaining an ideal ratio.", ja: "合成数が3つ(1, 8, 14)含まれ、理想的な比率を維持" },
        failEx: { ko: "합성수 번호로만 5개 이상 채워진 불균형 조합", en: "Unbalanced set with 5+ composite numbers.", ja: "合成数番号のみで5つ以上埋められた不均衡な組み合わせ" }
    },
    { 
        id: 16, 
        name: { ko: "완전제곱수 필터 (0 ~ 2개)", en: "Perfect Squares", ja: "完全平方数フィルタ" }, 
        desc: { 
            ko: "같은 수를 두 번 곱해서 나오는 6개의 완전제곱수(1, 4, 9, 16, 25, 36)의 중복 포함을 0~2개 이내로 제한합니다.", 
            en: "Limits the inclusion of the 6 perfect squares (1, 4, 9, 16, 25, 36) to 0-2 per set.", 
            ja: "同じ数を2回掛けて出る6つの完全平方数(1, 4, 9, 16, 25, 36)の重複を0〜2個以内に制限します。" 
        },
        why: {
            ko: "완전제곱수는 전체 번호 중 개수가 적으며, 당첨 조합에서 많이 발견되지 않는 경향이 있습니다.",
            en: "Perfect squares are few in number and rarely dominate winning combinations.",
            ja: "完全平方数は全体の中で数が少なく、当選組み合わせで多く発見されない傾向があります。"
        },
        exampleNums: [4, 16, 20, 28, 35, 42],
        exAnalysis: {
            ko: "위 조합에는 완전제곱수 4(2x2)와 16(4x4)이 2개 포함되어 당첨 확률이 높은 균형을 맞췄습니다.",
            en: "Includes exactly two perfect squares (4 and 16), adhering to historical winning patterns.",
            ja: "上記の組み合わせには完全平方数4(2x2)と16(4x4)が2つ含まれており、当選確率の高いバランスを整えました。"
        },
        passEx: { ko: "완전제곱수 4, 16 두 개를 포함한 과학적 조합", en: "Includes 2 perfect squares (4, 16), creating a scientific profile.", ja: "完全平方数4, 16の2つを含んだ科学的な組み合わせ" },
        failEx: { ko: "1, 4, 9, 16 처럼 제곱수가 4개나 포함된 조합", en: "Includes 4+ squares (e.g., 1, 4, 9, 16).", ja: "1, 4, 9, 16のように平方数が4つも含まれる組み合わせ" }
    },
    { 
        id: 17, 
        name: { ko: "특정 배수 배분", en: "Specific Multiples", ja: "特定倍数配분" }, 
        desc: { 
            ko: "3의 배수는 0~3개, 5의 배수는 0~2개까지만 포함하도록 정교하게 배분하여 당첨 확률을 극대화합니다.", 
            en: "Precision allocation of 3-multiples (0-3) and 5-multiples (0-2) to maximize winning probability.", 
            ja: "3の倍数は0〜3個、5の倍数は0〜2個まで含めるよう精巧に配分し、当選確率を極大化します。" 
        },
        why: {
            ko: "특정 배수로만 조합이 채워지면 확률적 균형이 깨집니다. 배수의 분포를 제어하여 안정성을 높입니다.",
            en: "Sets filled only with specific multiples break the probabilistic balance. Controlling distribution increases stability.",
            ja: "特定の倍数のみで組み合わせが埋められると確率的バランスが崩れます。倍数の分布を制御して安定性を高めます。"
        },
        exampleNums: [3, 6, 10, 15, 22, 38],
        exAnalysis: {
            ko: "3의 배수(3, 6, 15) 3개와 5의 배수(10, 15) 2개가 복합적으로 포함된 이상적 배분 예시입니다.",
            en: "Contains three 3-multiples (3, 6, 15) and two 5-multiples (10, 15), meeting the optimal balance criteria.",
            ja: "3の倍数(3, 6, 15)3つと5の倍数(10, 15)2つが複合的に含まれた理想的な配分の例です。"
        },
        passEx: { ko: "3의 배수 3개, 5의 배수 1개로 이상적인 배분", en: "Ideal mix with three 3-multiples and one 5-multiple.", ja: "3の倍数3つ、5の倍数1つで理想的な配分" },
        failEx: { ko: "3, 6, 9, 12, 15, 18 처럼 특정 배수로만 전체 구성", en: "Composition consists entirely of one multiple (e.g., 3, 6, 9, 12, 15, 18).", ja: "3, 6, 9, 12, 15, 18のように特定の倍数のみで構成" }
    },
    { 
        id: 18, 
        name: { ko: "쌍수 제한 (0 ~ 2개)", en: "Double Numbers", ja: "双数制限" }, 
        desc: { 
            ko: "11, 22, 33, 44와 같은 쌍수의 포함 개수를 0~2개 이내로 엄격히 제한하여 확률 중심의 조합을 구성합니다.", 
            en: "Strictly limits double-digit numbers (11, 22, 33, 44) to 0-2 to focus on probability center.", 
            ja: "11, 22, 33, 44のような双数の包含個数を0〜2個以内に厳格に制限し、確率中心の組み合わせを構成します。" 
        },
        why: {
            ko: "쌍수가 3개 이상 동시에 나오는 경우는 역대 로또 통계에서 거의 찾아볼 수 없는 희귀 사례입니다.",
            en: "Winning sets featuring 3+ doubles are statistical rarities across all historical data.",
            ja: "双数が3つ以上同時に出るケースは、歴代統計でほとんど見られない稀な事例です。"
        },
        exampleNums: [5, 11, 18, 22, 30, 42],
        exAnalysis: {
            ko: "위 조합에는 쌍수 11과 22가 포함되어 있습니다. 총 2개로 통계적으로 검증된 허용 범위를 지켰습니다.",
            en: "Contains two double-digit numbers, 11 and 22, ensuring the set stays within common probability limits.",
            ja: "上記の組み合わせには双数11と22が含まれています。計2つで統計的に検証された許容範囲を守りました。"
        },
        passEx: { ko: "쌍수 11, 22 두 개만 포함되어 안정적임", en: "Includes only 2 doubles (11, 22), keeping the set stable.", ja: "双数11, 22の2つのみが含まれ、安定している" },
        failEx: { ko: "11, 22, 33, 44 중 3개 이상이 한 조합에 포함됨", en: "Includes 3+ doubles in a single combination.", ja: "11, 22, 33, 44のうち3つ以上が1つの組み合わせに含まれる" }
    },
    { 
        id: 19, 
        name: { ko: "시작/끝 번호 제한", en: "Start/End Range", ja: "開始・終了番号制限" }, 
        desc: { 
            ko: "시작번호가 15 이상이거나 끝번호가 30 이하인 기형적인 조합을 제외하여 당첨 가용성을 극대화합니다.", 
            en: "Excludes improbable sets starting over 15 or ending below 30 to maximize valid range potential.", 
            ja: "開始番号が15以上、または終了番号が30以下の異常な組み合わせを除外し、可用性を極大化します。" 
        },
        why: {
            ko: "로또 번호는 전체 범위(1~45)를 넓게 쓰는 경향이 있습니다. 시작과 끝이 너무 좁으면 확률이 낮아집니다.",
            en: "Lotto results tend to use the full 1-45 range. Narrow starts and ends drastically lower the win probability.",
            ja: "ロト番号は全範囲(1〜45)を広く使う傾向があります。開始と終了が狭すぎると確率が低くなります。"
        },
        exampleNums: [1, 8, 15, 22, 35, 45],
        exAnalysis: {
            ko: "1번으로 시작하여 45번으로 끝나는 폭넓은 분포를 보여줌으로써 전체 당첨 번호의 약 95%가 포함되는 가용 범위를 확보했습니다.",
            en: "Starts with 1 and ends with 45, covering the full spectrum used in 95% of all historic draws.",
            ja: "1番で始まり45番で終わる幅広い分布を示すことで、全当選番号の約95%が含まれる可用範囲を確保しました。"
        },
        passEx: { ko: "1번으로 시작해 45번으로 끝나 넓은 가용 범위 확보", en: "Starts at 1 and ends at 45, ensuring full range coverage.", ja: "1番で始まり45番で終わる広い可用範囲を確保" },
        failEx: { ko: "20번으로 시작하거나 25번으로 끝나는 좁은 구간 조합", en: "A narrow set starting at 20 or ending at 25.", ja: "20番で始まったり25番で終わったりする狭い区間の組み合わせ" }
    },
    { 
        id: 20, 
        name: { ko: "동일구간 쏠림 방지", en: "Zone Crowding Prevention", ja: "同一区間偏り防止" }, 
        desc: { 
            ko: "특정 한 구간에서만 4개 이상의 번호가 쏟아져 나올 확률은 5% 미만입니다. 전체 구간에 골고루 분산된 조합을 생성합니다.", 
            en: "The probability of 4+ numbers in a single 10-digit zone is under 5%. Forces uniform distribution.", 
            ja: "特定の1区間からのみ4つ以上の番号が出る確率は5%未満です。全区間に均等に分散された組み合わせを生成します。" 
        },
        why: {
            ko: "번호가 뭉쳐서 나오기보다 흩어져서 나올 확률이 높습니다. 뭉침 현상을 제어하는 것이 중요합니다.",
            en: "Numbers are more likely to be dispersed than clumped together. Controlling crowding is crucial.",
            ja: "番号は固まって出るより散らばって出る確率が高いです。固まり現象を制御することが重要です。"
        },
        exampleNums: [5, 12, 23, 31, 42, 44],
        exAnalysis: {
            ko: "1~10번대부터 40번대까지 각 구간별로 1~2개의 번호가 고르게 흩어져 배출된 분산형 조합입니다.",
            en: "Features a dispersed distribution with 1-2 numbers in almost every 10-digit zone (10s, 20s, 30s, 40s).",
            ja: "1〜10番台から40番台まで各区間ごとに1〜2個の番号が均等に散らばって選出された分散型組み合わせです。"
        },
        passEx: { ko: "각 10단위 구간별로 번호가 1~2개씩 골고루 분포됨", en: "Features 1-2 numbers evenly across each 10-digit zone.", ja: "各10単位区間ごとに番号が1〜2個ずつ均等に分布" },
        failEx: { ko: "31, 33, 35, 38, 39 처럼 30번대에만 5개가 몰림", en: "5 numbers crowded in the 30s zone (e.g., 31, 33, 35, 38, 39).", ja: "31, 33, 35, 38, 39のように30번대だけに5つが集中する" }
    },
    { 
        id: 21, 
        name: { ko: "모서리 패턴 반영 (1 ~ 4개 포함)", en: "Corner Patterns", ja: "コーナーパターン反映" }, 
        desc: { 
            ko: "로또 용지의 사방 끝부분 모서리 영역 번호들이 1~4개 포함될 확률은 90% 이상입니다. 공간적 균형을 위해 이를 반영합니다.", 
            en: "Includes 1-4 numbers from ticket corners, reflecting a pattern found in over 90% of winning sets.", 
            ja: "ロト用紙の四隅のコーナー領域の番号が1〜4個含まれる確率は90%以上です。空間的バランスを反映します。" 
        },
        why: {
            ko: "실제 당첨 번호를 용지에 마킹해 보면 모서리 영역이 1개 이상 포함되는 것이 일반적입니다.",
            en: "Marking real winning results on a ticket shows that including corner zones is a standard occurrence.",
            ja: "実際の当選番号を用紙にマークしてみると、コーナー領域が1つ以上含まれるのが一般的です。"
        },
        exampleNums: [1, 6, 15, 22, 29, 34],
        exAnalysis: {
            ko: "로또 용지 사방 모서리 번호 중 1(좌상), 6(우상), 29(좌하), 34(우하)번을 모두 포함한 예시입니다.",
            en: "Strategically includes numbers 1, 6, 29, and 34, which represent the four corner zones of a standard lottery slip.",
            ja: "ロト用紙の四隅の末尾番号のうち1(左上)、6(右上)、29(左下)、34(右下)番をすべて含んだ例です。"
        },
        passEx: { ko: "모서리 영역 번호(1, 6, 29, 34)가 4개 포함됨", en: "Includes 4 numbers from the corner regions (1, 6, 29, 34).", ja: "コーナー領域の番号(1, 6, 29, 34)が4つ含まれる" },
        failEx: { ko: "모서리 영역을 하나도 포함하지 않는 중앙 집중형 조합", en: "Centralized set that includes zero numbers from corner zones.", ja: "コーナー領域を一つも含まない中央集中型の組み合わせ" }
    },
    { 
        id: 22, 
        name: { ko: "AI 딥러닝 고급 분석", en: "AI Deep Learning", ja: "AI디ープラーニング" }, 
        desc: { 
            ko: "최첨단 AI 모델을 통해 최종 당첨 가능성을 검증합니다. 방대한 과거 데이터를 학습하여 인공지능이 선별한 조합을 제안합니다.", 
            en: "Uses advanced AI models to verify final win potential by learning from massive historical data.", 
            ja: "最先端のAIモデルを通じて最終的な当選の可能性を検証します。膨大な過去データを学習した組み合わせを提案します。" 
        },
        why: {
            ko: "단순 통계로 포착하기 어려운 비선형적인 패턴과 미세한 상관관계를 AI가 최종적으로 걸러냅니다.",
            en: "AI filters out non-linear patterns and subtle correlations that simple statistics cannot capture.",
            ja: "単純統計では捉えにくい非線形なパターンと微細な相関関係をAIが最終的に選別します。"
        },
        exampleNums: [5, 11, 25, 27, 36, 38],
        exAnalysis: {
            ko: "머신러닝 모델(Random Forest) 분석 결과, 과거 1등 당첨 패턴과 92% 이상의 상관계수를 기록한 최적 조합입니다.",
            en: "Verified by a Random Forest model, this combination shows over 92% correlation with historic 1st prize patterns.",
            ja: "機械学習モデル（Random Forest）分析の結果、過去1等当選パターンと92%以上の相関係数を記録した最適組み合わせです。"
        },
        passEx: { ko: "머신러닝 모델의 피트니스 점수가 기준치 이상으로 나옴", en: "The ML model's fitness score exceeds the required threshold.", ja: "機械学習モデルの適合度スコアが基準値以上となる" },
        failEx: { ko: "학습된 당첨 패턴과 상관계수가 낮은 부적합 조합", en: "Combination with low correlation to learned winning patterns.", ja: "学習された当選パターンとの相関が低い不適合な組み合わせ" }
    }
];

// ===== 동적 통계 로딩 (최근 5주 핫/콜드, 역대 최다) =====
let hotLast5 = [];
let coldLast5 = [];
let historicTop = [43, 27, 34, 17, 1, 33];

async function loadLast5Stats() {
  try {
    const res = await fetch('/data/last5_stats.json');
    const data = await res.json();
    hotLast5 = data.hotLast5 || [];
    coldLast5 = data.coldLast5 || [];
  } catch (e) { console.warn('Stats failed, using defaults'); }
}

async function loadHistoricTop() {
  try {
    const res = await fetch('/data/historic_top.json');
    const data = await res.json();
    historicTop = data.top || historicTop;
  } catch (e) { console.warn('Historic failed, using defaults'); }
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
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            el.innerHTML = TRANSLATIONS[lang][key];
            if (key === 'welcome_title') el.classList.add('brand-gradient');
        }
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
