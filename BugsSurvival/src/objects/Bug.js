export default class Bug extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, level) {
        super(scene, x, y, texture);

        this.scene = scene;

        // 벌레를 씬에 추가
        scene.add.existing(this);

        // 현재 레벨 저장
        this.level = level;

        // 벌레의 크기 설정 (1단계~5단계)
        this.sizeLevel = Phaser.Math.Between(1, 5); // 1단계~5단계
        const scale = 1.5 - 0.2 * (this.sizeLevel - 1); // 크기 단계가 높을수록 작아짐
        this.setScale(scale);

        // 레벨에 따른 최대 속도 단계 제한
        const maxSpeedLevel = Math.min(this.level * 2, 100); // 최대 속도 단계: 레벨 * 2 또는 100 중 작은 값
        this.speedLevel = Phaser.Math.Between(10, maxSpeedLevel); // 속도 단계는 10~maxSpeedLevel 사이

        // 벌레의 속도 설정
        this.speed = this.calculateSpeed(); // 속도 계산

        // 벌레의 점수 계산
        this.scoreValue = this.calculateScore();

        // 방향 변경 설정 (3레벨부터 적용)
        if (this.level >= 3) {
            this.remainingDirectionChanges = this.level - 2; // 3레벨에서는 1회, 이후 레벨마다 1씩 증가
            this.setupDirectionChange();
        } else {
            this.remainingDirectionChanges = 0; // 3레벨 미만에서는 방향 변경 없음
        }
    }

    setDirection(direction) {
        this.direction = direction;

        // 방향에 따라 회전 각도 설정
        const angleInRadians = Phaser.Math.Angle.Between(0, 0, direction.x, direction.y);
        this.rotation = angleInRadians + Phaser.Math.DegToRad(90); // 12시 방향 기준 보정
    }

    calculateSpeed() {
        // 속도 공식: (50 + (속도 단계 - 1) * 10) * 루트(현재 레벨)
        const baseSpeed = 50 + (this.speedLevel - 1) * 10;
        return baseSpeed * Math.sqrt(this.level);
    }

    calculateScore() {
        // 점수 계산: (크기 * 0.1) * (속도 단계 * 10), 결과를 제곱근으로 구하고 2로 나눔
        return Math.round(Math.sqrt((this.sizeLevel * 0.1) * (this.speedLevel * 10)) / 2);
    }

    setupDirectionChange() {
        this.changeDirectionTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // 1초 ~ 3초 사이 랜덤
            callback: this.changeDirection,
            callbackScope: this,
            loop: true,
        });
    }

    changeDirection() {
        // 남은 방향 변경 횟수 확인
        if (this.remainingDirectionChanges <= 0) {
            this.changeDirectionTimer.remove(false); // 타이머 제거
            return;
        }

        // 새 방향 벡터 생성 (랜덤)
        const newDirection = new Phaser.Math.Vector2(
            Phaser.Math.FloatBetween(-1, 1),
            Phaser.Math.FloatBetween(-1, 1)
        ).normalize();

        // 기존 방향과 동일하지 않도록 확인
        if (this.direction && newDirection.equals(this.direction)) {
            return this.changeDirection(); // 동일 방향이면 재귀 호출로 새 방향 생성
        }

        // 새 방향 설정 및 회전
        this.setDirection(newDirection);

        // 남은 방향 변경 횟수 감소
        this.remainingDirectionChanges--;
    }

    isOutOfBounds() {
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;

        return (
            this.x < -50 || this.x > screenWidth + 50 || // 화면 좌우 경계 밖
            this.y < -50 || this.y > screenHeight + 50   // 화면 상하 경계 밖
        );
    }

    update() {
        // 벌레 이동
        if (this.direction) {
            const delta = this.scene.game.loop.delta / 1000; // 프레임 간 시간
            this.x += this.direction.x * this.speed * delta;
            this.y += this.direction.y * this.speed * delta;
        }
    }

    destroy() {
        // 방향 변경 타이머 제거
        if (this.changeDirectionTimer) {
            this.changeDirectionTimer.remove(false);
        }
        super.destroy();
    }
}
