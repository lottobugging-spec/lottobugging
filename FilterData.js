export const FILTER_DETAILS = [
    { 
        id: 1, 
        name: { ko: "최근 5주간 당첨번호 비율 (핫넘버)", en: "Hot Numbers Ratio", ja: "直近5週間当選番号比率" }, 
        category: "momentum", 
        desc: { 
            ko: "실시간 API 연동을 통해 최근 5주간 출현 빈도가 높은 '핫넘버'를 우선 선별합니다. 로또의 단기 반복 출현 경향을 반영하여 현재 가장 강력한 흐름을 가진 번호를 조합에 즉각 반영합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", 
            en: "Selects 'Hot Numbers' that have appeared frequently in the last 5 weeks via real-time API.", 
            ja: "直近5週間に頻出した「ホットナンバー」を優先的に選別します。" 
        } 
    },
    { 
        id: 2, 
        name: { ko: "역대 최다 당첨번호 반영", en: "Historical High Frequency", ja: "歴대最多当選番号" }, 
        category: "stability", 
        desc: { 
            ko: "제1회차부터 현재까지의 전체 누적 빅데이터를 분석하여, 당첨 횟수가 가장 많은 '검증된 번호'들을 포함합니다. 역사가 증명한 고빈도 번호(예: 43번 등)를 활용하여 당첨 확률의 기본기를 잡습니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", 
            en: "Includes 'proven numbers' with the highest cumulative frequency since the 1st draw.", 
            ja: "第1回から現在までの累積データを分析し、当選回数が最も多い番号を含めます。" 
        } 
    },
    { 
        id: 3, 
        name: { ko: "색상 분포 비율 최적화", en: "Color Distribution", ja: "カラー分布最適化" }, 
        category: "balance", 
        desc: { 
            ko: "최근 5주간 당첨된 번호들의 색상(구간) 비율을 실시간으로 분석하여, 특정 번호대에 치우치지 않는 최적의 밸런스를 찾아냅니다. 노랑(1번대), 파랑(11번대), 빨강(21번대), 회색(31번대), 보라(41번대) 등 5개 구간의 색상을 골고루 배치하여 시각적 균형과 통계적 안정성을 동시에 확보합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", 
            en: "Analyzes color ratios from the last 5 weeks to find optimal balance across 5 color zones.", 
            ja: "直近5週間の当選番号のカラー比率を分析し、バランスよく配置します。" 
        } 
    },
    { 
        id: 4, 
        name: { ko: "최근 5주간 미출수(콜드넘버) 전략", en: "Cold Numbers Strategy", ja: "直近5週間未出現数戦略" }, 
        category: "momentum", 
        desc: { 
            ko: "최근 5주간 한 번도 당첨되지 않은 번호 중, 역대 누적 당첨 횟수가 많아 반등 확률이 높은 '잠재 번호'를 선별하여 포함합니다. 실시간 미출수 데이터를 추적하여 출현 임계점에 도달한 번호들을 전략적으로 배치합니다. (사이트참조 https://www.lotto.co.kr/article/list/AC01)", 
            en: "Selects 'potential numbers' from those that haven't appeared in 5 weeks but have high historical frequency.", 
            ja: "直近5週間未出現の番号のうち、反発確率が高い番号を戦略的に配置します。" 
        } 
    },
    { 
        id: 5, 
        name: { ko: "직전 회차 이월수 (0 ~ 2개)", en: "Carry-over", ja: "繰越し数" }, 
        category: "stability", 
        desc: { 
            ko: "지난주 당첨 번호가 이번 회차에 다시 출현하는 '이월' 현상은 매주 약 60% 이상의 높은 확률로 발생합니다. 실시간 API로 수집된 직전 회차 당첨 번호를 분석하여, 무작위로 0~2개를 조합에 포함시킵니다.", 
            en: "Includes 0-2 numbers from the previous draw, reflecting the high probability of carry-over.", 
            ja: "前回の当選番号が再び出現する現象を反映し、0〜2個を組み入れます。" 
        } 
    },
    { 
        id: 6, 
        name: { ko: "직전 회차 이웃수 (1 ~ 3개)", en: "Neighbor Numbers", ja: "隣接数" }, 
        category: "momentum", 
        desc: { 
            ko: "당첨 번호의 바로 옆 번호가 다음 회차에 등장하는 것을 '이웃수'라고 합니다. 예를 들어 지난주에 10번이 당첨되었다면 9번과 11번이 이웃수가 됩니다. 직전 회차 번호들의 ±1에 해당하는 번호들 중 1~3개를 배치합니다.", 
            en: "Selects 1-3 'neighbor numbers' (±1 of previous winners) that frequently appear in draws.", 
            ja: "前回の当選番号の前後（±1）の番号から、1〜3個を配置します。" 
        } 
    },
    { 
        id: 7, 
        name: { ko: "총합 구간 (100 ~ 175)", en: "Total Sum Range", ja: "合計数値区間" }, 
        category: "stability", 
        desc: { 
            ko: "선택된 조합 번호 6개를 모두 더한 값을 '총합'이라고 합니다. 역대 1등 당첨 번호의 통계 데이터를 분석해 보면, 총합이 100 미만이거나 175를 초과하는 기형적인 조합이 당첨될 확률은 10% 이내로 희박합니다.", 
            en: "Targets the 100-175 sum range where the majority of 1st prize draws occur.", 
            ja: "当選番号6個の合計が最も頻繁に発生する100〜175の区間に制限します。" 
        } 
    },
    { 
        id: 8, 
        name: { ko: "AC값 (산술적 복잡도) 7 이상", en: "AC Value 7+", ja: "AC値7以上" }, 
        category: "complexity", 
        desc: { 
            ko: "AC값은 로또 번호 6개가 얼마나 무작위로 골고루 섞여 있는지를 나타내는 지수입니다. 번호 간의 차이값이 다양하게 나타나는 AC값 7 이상의 복잡한 조합이 전체 당첨의 80% 이상을 차지합니다.", 
            en: "Selects combinations with an AC value of 7 or higher for optimal complexity.", 
            ja: "数値の混ざり具合を示すAC値を7以上に保ち、統計的に有利な組み合わせを選別します。" 
        } 
    },
    { 
        id: 9, 
        name: { ko: "홀짝 비율 (6:0, 0:6 제외)", en: "Odd/Even Ratio", ja: "奇数・偶数比率" }, 
        category: "balance", 
        desc: { 
            ko: "역대 1등 당첨 번호 통계를 살펴보면, 6개 번호가 모두 홀수(6:0)이거나 모두 짝수(0:6)인 기형적인 조합이 당첨될 확률은 2% 미만으로 매우 희박합니다. 가장 당첨 빈도가 높은 홀짝 배합을 적용합니다.", 
            en: "Excludes all-odd or all-even combinations to maintain statistical balance.", 
            ja: "すべて奇数またはすべて偶数のケースを除外し、バランスの取れた比率を適用します。" 
        } 
    },
    { 
        id: 13, 
        name: { ko: "연속번호(연번) 제한 및 2연번 적용", en: "Consecutive Numbers", ja: "連続番号制限" }, 
        category: "pattern", 
        desc: { 
            ko: "연속번호가 아예 없거나 딱 2개만 이어지는 2연번 조합이 나올 확률이 90% 이상으로 압도적입니다. 당첨 확률이 현저히 낮은 3연번 이상의 조합은 배제하고 정교하게 선별합니다.", 
            en: "Focuses on 'no consecutive' or '2-consecutive' patterns, excluding rare 3+ consecutive numbers.", 
            ja: "3連続以上の番号を排除し、当選確率が高いパターンのみを選別します。" 
        } 
    },
    { 
        id: 22, 
        name: { ko: "AI 딥러닝 고급 분석 (TensorFlow.js)", en: "TensorFlow.js Deep Learning", ja: "TensorFlow.js 딥러닝 분석" }, 
        category: "ai", 
        desc: { 
            ko: "웹 브라우저 기반의 강력한 인공지능 엔진인 TensorFlow.js를 프로젝트에 전격 도입했습니다. 단순히 정적 데이터를 조회하는 수준을 넘어, 사용자의 브라우저 내에서 실시간 딥러닝 모델(Neural Network)이 작동하여 생성된 번호 조합의 적합성을 즉각 판별합니다.", 
            en: "Implemented a powerful Neural Network engine using TensorFlow.js. Analyzes combinations in real-time within the browser using advanced deep learning models.", 
            ja: "TensorFlow.jsを用いたニューラルネットワーク分析を搭載。ブラウザ上でリアルタイムにディープラーニングモデルが作動し、統計を超えた最適解を抽出します。" 
        }
    }
];
