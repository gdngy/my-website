import { DIFFICULTY_SETTINGS } from '../constants.js';

export default class Bug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, size, level) {
        super(scene, x, y, texture);

        // 장면에 추가
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 크기 설정
        this.setScale(size * this.getDeviceScale(scene));

        // 난이도 설정
        const difficulty = this.getDifficultySettings(level);
        this.speed = Phaser.Math.Between(difficulty.minSpeed, difficulty.maxSpeed);
        this.remainingTurns = difficulty.turns;

        // 클릭 횟수 설정
        this.requiredClicks = this.calculateRequiredClicks(level);
        this.currentClicks = 0; // 현재 클릭된 횟수

        // 이동 시작
        this.startMoving(scene);
    }

    getDeviceScale(scene) {
        const screenWidth = scene.scale.width;
        if (screenWidth >= 1024) return 1; // PC
        if (screenWidth >= 768) return 1.5; // 태블릿
        return 2; // 스마트폰
    }

    getDifficultySettings(level) {
        if (level <= 10) return DIFFICULTY_SETTINGS.beginner;
        if (level <= 25) return DIFFICULTY_SETTINGS.intermediate;
        if (level <= 50) return DIFFICULTY_SETTINGS.advanced;
        if (level <= 100) return DIFFICULTY_SETTINGS.expert;
        return DIFFICULTY_SETTINGS.godlike;
    }

    calculateRequiredClicks(level) {
        const probability = level; // 레벨에 따른 확률 (%)
        const random = Phaser.Math.Between(1, 100);

        if (random <= probability) {
            if (level <= 10) return 2; // 초보: 2번 클릭
            if (level <= 25) return Phaser.Math.Between(2, 3); // 중급: 2~3번 클릭
            if (level <= 50) return Phaser.Math.Between(3, 4); // 고급: 3~4번 클릭
            if (level <= 100) return Phaser.Math.Between(4, 5); // 초인: 4~5번 클릭
            return Phaser.Math.Between(5, 10); // 신: 5~10번 클릭
        }

        return 1; // 기본값: 1번 클릭
    }

    startMoving(scene) {
        // 랜덤한 목표 위치 설정
        const targetX = Phaser.Math.Between(0, scene.scale.width);
        const targetY = Phaser.Math.Between(0, scene.scale.height);

        // 이동 방향에 따라 회전 각도 설정
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.setRotation(angle + Math.PI / 2); // 12시 방향 기준 보정

        // 이동 시작
        scene.physics.moveTo(this, targetX, targetY, this.speed);

        // 방향 전환 횟수 처리
        if (this.remainingTurns > 0) {
            for (let i = 1; i <= this.remainingTurns; i++) {
                const delay = Phaser.Math.Between(3000, 8000); // 3~8초 후 방향 전환
                scene.time.delayedCall(delay, () => {
                    if (this.active) {
                        this.changeDirection(scene);
                    }
                });
            }
        }
    }

    changeDirection(scene) {
        const targetX = Phaser.Math.Between(0, scene.scale.width);
        const targetY = Phaser.Math.Between(0, scene.scale.height);

        // 이동 방향에 따라 회전 각도 설정
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.setRotation(angle + Math.PI / 2);

        // 새로운 방향으로 이동 시작
        scene.physics.moveTo(this, targetX, targetY, this.speed);
    }

    handleClick() {
        this.currentClicks += 1; // 클릭 횟수 증가
        if (this.currentClicks >= this.requiredClicks) {
            this.destroy(); // 클릭 횟수 충족 시 제거
            return true; // 벌레 제거 성공
        }
        return false; // 아직 제거되지 않음
    }
}
