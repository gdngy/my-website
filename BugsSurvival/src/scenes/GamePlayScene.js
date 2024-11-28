import Bug from '../objects/Bug.js';

export default class GamePlayScene extends Phaser.Scene {
    constructor() {
        super('GamePlayScene');
    }

    create() {
        // 게임 상태 초기화
        this.score = 0;
        this.level = 1;
        this.maxLevelScore = 30; // 1레벨의 최대 점수 (30점)
        this.lives = 3;
        this.missedBugs = 0; // 놓친 벌레 수

        // 초기 벌레 생성 속도 (3초)
        this.spawnDelay = 3000;

        // 배경 설정
        const background = this.add.image(0, 0, 'background');
        background.setOrigin(0);
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // 벌레 그룹 생성
        this.bugs = this.add.group();

        // 벌레 생성 타이머
        this.startSpawnTimer();

        // UI 텍스트 추가
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: '24px',
            fill: '#fff',
        });
        this.levelText = this.add.text(200, 10, `Level: ${this.level}`, {
            fontSize: '24px',
            fill: '#fff',
        });
        this.livesText = this.add.text(400, 10, `Lives: ${this.lives}`, {
            fontSize: '24px',
            fill: '#fff',
        });
        this.missedText = this.add.text(600, 10, `Missed: ${this.missedBugs}`, {
            fontSize: '24px',
            fill: '#fff',
        });

        // 입력 이벤트
        this.input.on('pointerdown', this.handleClick, this);
    }

    startSpawnTimer() {
        // 기존 타이머 제거 (레벨업 시 필요)
        if (this.spawnTimer) {
            this.spawnTimer.remove(false);
        }

        // 벌레 생성 타이머 추가
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay, // 생성 속도
            callback: this.spawnBug,
            callbackScope: this,
            loop: true,
        });
    }

    updateSpawnDelay() {
        // 새로운 생성 속도 계산: 3초 / √레벨
        this.spawnDelay = Math.floor(3000 / Math.sqrt(this.level));

        // 타이머를 갱신
        this.startSpawnTimer();
    }

    spawnBug() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        let x, y;

        // 벌레가 화면 밖에서 생성되도록 위치 계산
        const side = Phaser.Math.Between(0, 3); // 0: 상단, 1: 하단, 2: 좌측, 3: 우측
        switch (side) {
            case 0:
                x = Phaser.Math.Between(-50, screenWidth + 50);
                y = -50;
                break;
            case 1:
                x = Phaser.Math.Between(-50, screenWidth + 50);
                y = screenHeight + 50;
                break;
            case 2:
                x = -50;
                y = Phaser.Math.Between(-50, screenHeight + 50);
                break;
            case 3:
                x = screenWidth + 50;
                y = Phaser.Math.Between(-50, screenHeight + 50);
                break;
        }

        // 목표 지점 계산: 화면 안의 랜덤 지점
        const targetX = Phaser.Math.Between(0, screenWidth);
        const targetY = Phaser.Math.Between(0, screenHeight);

        // 벌레 생성
        const bug = new Bug(this, x, y, 'bug', this.level);

        // 이동 방향 설정: 생성 위치에서 목표 지점으로
        const direction = new Phaser.Math.Vector2(targetX - x, targetY - y).normalize();
        bug.setDirection(direction);

        this.bugs.add(bug);
    }

    handleClick(pointer) {
        const bug = this.bugs.getChildren().find(b => b.getBounds().contains(pointer.x, pointer.y));
        if (bug) {
            this.updateScore(Math.round(bug.scoreValue / 2)); // 점수의 1/3 추가
            bug.destroy();
        } else {
            this.updateLives(-1); // 생명 감소
        }
    }

    update() {
        this.bugs.getChildren().forEach(bug => {
            if (bug.isOutOfBounds()) {
                this.updateMissedBugs(); // 놓친 벌레 수 증가
                bug.destroy(); // 벌레 제거
            } else {
                bug.update();
            }
        });

        // 점수에 따라 레벨 업데이트
        this.updateLevel();

        // 게임 오버 조건
        if (this.lives <= 0) {
            this.scene.start('GameOverScene');
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    updateLevel() {
        // 레벨 계산: 1레벨은 0~30점, 이후는 이전 최대 점수 + (이전 최대 점수 * √레벨)
        if (this.score > this.maxLevelScore) {
            this.level++;
            this.maxLevelScore = Math.floor(
                this.maxLevelScore + this.maxLevelScore * Math.sqrt(this.level)
            );
            this.levelText.setText(`Level: ${this.level}`);
            this.updateSpawnDelay(); // 레벨업 시 벌레 생성 속도 업데이트
        }
    }

    updateLives(amount) {
        this.lives += amount;
        this.livesText.setText(`Lives: ${this.lives}`);
    }

    updateMissedBugs() {
        this.missedBugs++;
        this.missedText.setText(`Missed: ${this.missedBugs}`);
    }
}
