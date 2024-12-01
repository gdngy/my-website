export default class Bug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, size, level) {
        super(scene, x, y, texture);

        // 장면에 추가
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 크기 설정
        this.setScale(size * this.getDeviceScale(scene));

        // 난이도에 따른 속도 설정
        const { min, max } = this.getDifficultyRange(level);
        this.speed = Phaser.Math.Between(min, max);

        // 이동 시작
        this.startMoving(scene, level);
    }

    getDeviceScale(scene) {
        // 디바이스 해상도에 따라 크기 조정
        const screenWidth = scene.scale.width;
        const screenHeight = scene.scale.height;

        if (screenWidth >= 1024) {
            // PC 해상도 (1024px 이상)
            return 1; // 기본 크기 유지
        } else if (screenWidth >= 768) {
            // 태블릿 해상도
            return 1.2; // 크기를 조금 더 키움
        } else {
            // 스마트폰 해상도
            return 1.5; // 크기를 더 키움
        }
    }

    getDifficultyRange(level) {
        if (level >= 1 && level <= 10) {
            return { min: 10, max: 100, difficulty: '초보' };
        } else if (level >= 11 && level <= 25) {
            return { min: 80, max: 300, difficulty: '중급' };
        } else if (level >= 26 && level <= 50) {
            return { min: 200, max: 500, difficulty: '고급' };
        } else if (level >= 51 && level <= 100) {
            return { min: 400, max: 1000, difficulty: '초인' };
        } else {
            return { min: 1000, max: 5000, difficulty: '신' };
        }
    }

    startMoving(scene, level) {
        this.changeDirection(scene);

        // 난이도에 따라 방향 전환 설정
        if (this.remainingTurns > 0) {
            for (let i = 1; i <= this.remainingTurns; i++) {
                const delay = 3000 + Phaser.Math.Between(1000, 5000);
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
}
