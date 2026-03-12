// LottoConfig.js
export const LOTTO_CONFIGS = {
    KOREA_645: {
        id: "KR_645",
        name: "Korea Lotto 6/45",
        mainPool: { min: 1, max: 45, count: 6 },
        bonusPool: null, 
        colors: ["yellow", "blue", "red", "gray", "green"]
    },
    US_POWERBALL: {
        id: "US_PB",
        name: "US Powerball",
        mainPool: { min: 1, max: 69, count: 5 },
        bonusPool: { min: 1, max: 26, count: 1, allowDuplicateBetweenPools: true },
        colors: ["white", "red"]
    },
    US_MEGA_MILLIONS: {
        id: "US_MM",
        name: "US Mega Millions",
        mainPool: { min: 1, max: 70, count: 5 },
        bonusPool: { min: 1, max: 25, count: 1, allowDuplicateBetweenPools: true },
        colors: ["white", "yellow"]
    },
    EURO_MILLIONS: {
        id: "EU_EM",
        name: "EuroMillions",
        mainPool: { min: 1, max: 50, count: 5 },
        bonusPool: { min: 1, max: 12, count: 2, allowDuplicateBetweenPools: false },
        colors: ["blue", "yellow"]
    },
    EURO_JACKPOT: {
        id: "EU_EJ",
        name: "EuroJackpot",
        mainPool: { min: 1, max: 50, count: 5 },
        bonusPool: { min: 1, max: 12, count: 2, allowDuplicateBetweenPools: false },
        colors: ["yellow", "yellow"] // 메인은 노랑계열, 유로볼은 금색/노랑
    }
};
