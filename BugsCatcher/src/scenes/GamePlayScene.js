import Bug from '../sprites/Bug.js';

export default class GamePlayScene extends Phaser.Scene {
    constructor() {
        super('GamePlayScene');
        this.initialLives = 3; // 초기 생명값
        this.initialLevel = 1; // 초기 레벨값
        this.initialScore = 0; // 초기 점수값
        this.initialMissed = 0; // 초기 놓친 수
        this.levelUpThreshold = 30; // 1레벨의 점수 기준
    }

    init() {
        this.level = this.initialLevel;
        this.score = this.initialScore;
        this.lives = this.initialLives;
        this.missed = this.initialMissed; // 놓친 수 초기화
        this.currentLevelThreshold = this.levelUpThreshold;
    }

    preload() {
        // 벌레 이미지 로드
        for (let i = 1; i <= 10; i++) {
            const imageName = `bug_${String(i).padStart(3, '0')}`;
            this.load.image(imageName, `assets/images/sprites/bugs/${imageName}.png`);
        }
    }

    create() {
        const { width } = this.scale;

        // HUD 텍스트 생성
        this.levelText = this.add.text(10, 10, `Level: ${this.level}`, {
            fontSize: '20px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffffff'
        });

        this.scoreText = this.add.text(10, 40, `Score: ${this.score}`, {
            fontSize: '20px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffffff'
        });

        this.missedText = this.add.text(10, 70, `Missed: ${this.missed}`, {
            fontSize: '20px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffffff'
        });

        this.livesText = this.add.text(width - 10, 10, `Lives: ${this.lives}`, {
            fontSize: '20px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffffff'
        }).setOrigin(1, 0); // 우측 정렬

        // 벌레 그룹 생성
        this.bugs = this.add.group();

        // 주기적으로 벌레 생성
        this.updateSpawnRate();

        // 클릭 이벤트 통합 처리
        this.input.on('pointerdown', this.handleClick, this);
    }

    spawnBug() {
        const { width, height } = this.scale;

        const randomBugIndex = Phaser.Math.Between(1, 10);
        const bugImage = `bug_${String(randomBugIndex).padStart(3, '0')}`;

        const sizes = [0.3, 0.5, 0.8];
        const randomSize = Phaser.Utils.Array.GetRandom(sizes);

        const positions = [
            { x: -50, y: Phaser.Math.Between(0, height) },
            { x: width + 50, y: Phaser.Math.Between(0, height) },
            { x: Phaser.Math.Between(0, width), y: -50 },
            { x: Phaser.Math.Between(0, width), y: height + 50 }
        ];
        const startPosition = Phaser.Utils.Array.GetRandom(positions);

        const bug = new Bug(this, startPosition.x, startPosition.y, bugImage, randomSize, this.level);

        // 벌레 그룹에 추가
        this.bugs.add(bug);

        // 벌레가 화면에 10초 동안 남아있으면 놓친 수 증가
        this.time.delayedCall(10000, () => {
            if (!bug.isMissed && bug.active) { // 벌레가 놓치지 않았고 활성 상태일 경우
                bug.isMissed = true; // 놓친 상태로 플래그 설정
                this.missed += 1; // 놓친 수 증가
                this.updateHUD();
                bug.destroy(); // 벌레 제거
            }
        });
    }

    handleClick(pointer) {
        const clickedBug = this.bugs.getChildren().find((bug) => {
            return bug.active && Phaser.Geom.Rectangle.Contains(bug.getBounds(), pointer.x, pointer.y);
        });

        if (clickedBug) {
            this.score += 10;
            clickedBug.isMissed = true; // 클릭된 벌레는 놓친 상태가 아님
            clickedBug.destroy();
            this.updateHUD();
            this.checkLevelUp();
        } else {
            this.lives -= 1;
            this.updateHUD();

            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }

    updateSpawnRate() {
        if (this.bugTimer) {
            this.bugTimer.remove();
        }

        this.bugTimer = this.time.addEvent({
            delay: 1000 / this.getSpawnRate(),
            callback: this.spawnBug,
            callbackScope: this,
            loop: true
        });
    }

    updateHUD() {
        this.levelText.setText(`Level: ${this.level}`);
        this.scoreText.setText(`Score: ${this.score}`);
        this.missedText.setText(`Missed: ${this.missed}`);
        this.livesText.setText(`Lives: ${this.lives}`);
    }

    checkLevelUp() {
        if (this.score >= this.currentLevelThreshold) {
            this.level += 1;
            this.currentLevelThreshold += Math.floor(
                this.currentLevelThreshold * Math.sqrt(this.level)
            );

            this.handleLevelUp();
            this.updateHUD();
        }
    }

    handleLevelUp() {
        const { width, height } = this.scale;

        this.bugTimer.paused = true;

        const levelUpText = this.add.text(width / 2, height / 2, `Level ${this.level} UP!`, {
            fontSize: '40px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffcc00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.bugs.clear(true, true);

        this.time.delayedCall(2000, () => {
            levelUpText.destroy();
            this.bugTimer.paused = false;
            this.updateSpawnRate();
        });
    }

    getSpawnRate() {
        let baseSpawnCount = 1;
        if (this.level >= 1 && this.level <= 10) {
            baseSpawnCount = 1;
        } else if (this.level >= 11 && this.level <= 25) {
            baseSpawnCount = 5;
        } else if (this.level >= 26 && this.level <= 50) {
            baseSpawnCount = 10;
        } else if (this.level >= 51 && this.level <= 100) {
            baseSpawnCount = 20;
        } else {
            baseSpawnCount = 30;
        }

        return baseSpawnCount * Math.sqrt(this.level);
    }

    gameOver() {
        this.scene.start('GameOverScene', { score: this.score });
    }
}
