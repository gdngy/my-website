import Bug from '../sprites/Bug.js';
import { HUD_INITIAL_VALUES, LEVEL_UP_SETTINGS, TIMINGS, GAME_SETTINGS } from '../constants.js';


export default class GamePlayScene extends Phaser.Scene {
    constructor() {
        super('GamePlayScene');
        this.initialValues = HUD_INITIAL_VALUES;
        this.levelUpSettings = LEVEL_UP_SETTINGS;
    }

    init() {
        // HUD 초기화
        this.level = this.initialValues.level;
        this.score = this.initialValues.score;
        this.lives = this.initialValues.lives;
        this.missed = this.initialValues.missed;
        this.currentLevelThreshold = this.levelUpSettings.baseThreshold;
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

        // 벌레 생성 타이머 설정
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

        // 벌레를 그룹에 추가
        this.bugs.add(bug);

        // 벌레가 화면에 10초 동안 남아있으면 놓친 수 증가 및 점수 감점
        this.time.delayedCall(10000, () => {
            if (bug.active) {
                this.missed += 1; // 놓친 수 증가
                this.score -= GAME_SETTINGS.pointLossPerMissedBug; // 상수를 사용한 감점
                if (this.score < 0) this.score = 0; // 점수는 0 이하로 내려가지 않도록 제한
                this.updateHUD();
                bug.destroy();
            }
        });
    }


    handleClick(pointer) {
        const clickedBug = this.bugs.getChildren().find((bug) => {
            const bugBounds = bug.getBounds();
            return Phaser.Geom.Rectangle.Contains(bugBounds, pointer.x, pointer.y);
        });

        if (clickedBug) {
            // 벌레 클릭
            const wasDestroyed = clickedBug.handleClick(); // 클릭 처리
            if (wasDestroyed) {
                // 클릭 횟수 충족 시 점수 증가
                this.score += 10;
                this.bugs.remove(clickedBug, true, true); // 그룹에서 제거
            }
            this.updateHUD();
            this.checkLevelUp();
        } else {
            // 벌레가 아닌 곳 클릭 시 생명 감소
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

    getSpawnRate() {
        const baseSpawnCount = 1 + Math.floor(this.level / 10); // 레벨에 따라 벌레 생성 증가
        return baseSpawnCount * Math.sqrt(this.level);
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
            this.currentLevelThreshold = this.levelUpSettings.thresholdMultiplier(
                this.currentLevelThreshold,
                this.level
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

    gameOver() {
        this.scene.start('GameOverScene', { score: this.score });
    }
}
