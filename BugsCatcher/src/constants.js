export const DIFFICULTY_SETTINGS = {
    beginner: { minSpeed: 10, maxSpeed: 100, turns: 0 }, // 초보
    intermediate: { minSpeed: 80, maxSpeed: 300, turns: 1 }, // 중급
    advanced: { minSpeed: 200, maxSpeed: 500, turns: 3 }, // 고급
    expert: { minSpeed: 400, maxSpeed: 1000, turns: 5 }, // 초인
    godlike: { minSpeed: 1000, maxSpeed: 5000, turns: 10 } // 신
};

export const DEVICE_SCALE = {
    pc: 1, // PC 화면
    tablet: 1.5, // 태블릿 화면
    smartphone: 2 // 스마트폰 화면
};

export const HUD_INITIAL_VALUES = {
    level: 1, // 초기 레벨
    score: 0, // 초기 점수
    lives: 3, // 초기 생명
    missed: 0 // 초기 놓친 수
};

export const LEVEL_UP_SETTINGS = {
    baseThreshold: 1, // 1레벨 기준 점수
    thresholdMultiplier: (currentThreshold, level) =>
        currentThreshold + Math.floor(currentThreshold * Math.sqrt(level)) // 레벨 업 기준 계산
};

export const TIMINGS = {
    bugDisappearTime: 10000, // 벌레가 사라지기 전 대기 시간 (10초)
    directionChange: { min: 1000, max: 5000, after: 3000 } // 방향 전환 최소/최대 시간 (3초 이후)
};
