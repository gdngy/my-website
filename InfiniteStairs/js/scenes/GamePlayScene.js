export default class GamePlayScene extends Phaser.Scene {
    constructor() {
        super('GamePlayScene');
        this.lastStairX = null;
        this.lastStairY = null;
        this.currentStair = null;
        this.level = 1;
        this.score = 0;
        this.nextLevelScore = 20;
        this.stairDelay = 1000;
        this.stairLimit = 15; // 화면에 유지할 최대 계단 수
    }

    create() {
        const { width, height } = this.scale;

        // 레벨과 점수 텍스트 추가 (화면 고정)
        this.levelText = this.add.text(20, 20, `Level: ${this.level}`, { fontSize: '24px', fill: '#ffffff' }).setScrollFactor(0);
        this.scoreText = this.add.text(width - 20, 20, `Score: ${this.score}`, { fontSize: '24px', fill: '#ffffff' }).setOrigin(1, 0).setScrollFactor(0);

        // 땅 생성 (스크롤되지 않도록 설정)
        const groundHeight = 50;
        this.ground = this.add.rectangle(width / 2, height - groundHeight / 2, width, groundHeight, 0x8B4513);
        this.physics.add.existing(this.ground, true);

        // 계단 그룹 생성
        this.stairs = this.physics.add.staticGroup();

        // 첫 번째 계단 생성 (땅 위쪽에 정확히 붙도록 설정)
        const stairWidth = 60;
        const stairHeight = 20;
        this.lastStairX = width / 2;
        this.lastStairY = height - groundHeight + stairHeight / 2;

        const firstStair = this.addFirstStair();
        this.currentStair = firstStair;

        // 캐릭터 생성
        this.character = this.add.rectangle(this.lastStairX, this.lastStairY - stairHeight / 2 - 15, 30, 30, 0xff0000);
        this.physics.add.existing(this.character);
        this.character.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.character, this.ground);

        // 방향키 입력 설정
        this.cursors = this.input.keyboard.createCursorKeys();

        // 좌우 이동 버튼 생성
        this.createMoveButtons();

        // 계단 생성 타이머 설정
        this.startStairTimer();
    }

    createMoveButtons() {
        const { width, height } = this.scale;

        // 왼쪽 이동 버튼
        const leftButton = this.add.text(50, height - 50, '◀', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setInteractive();

        // 오른쪽 이동 버튼
        const rightButton = this.add.text(width - 50, height - 50, '▶', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }).setInteractive();

        // 왼쪽 버튼 클릭 시 캐릭터 이동
        leftButton.on('pointerdown', () => {
            this.moveCharacterToNextStair('left');
        });

        // 오른쪽 버튼 클릭 시 캐릭터 이동
        rightButton.on('pointerdown', () => {
            this.moveCharacterToNextStair('right');
        });
    }


    startStairTimer() {
        // 기존 타이머가 있다면 제거
        if (this.stairTimer) {
            this.stairTimer.remove();
        }

        // 새로운 계단 생성 타이머 시작
        this.stairTimer = this.time.addEvent({
            delay: this.stairDelay,
            callback: this.prepareStair,
            callbackScope: this,
            loop: true
        });
    }

    prepareStair() {
        // 계단이 화면 중앙을 넘어가면 모든 요소를 아래로 이동
        if (this.lastStairY < this.scale.height / 2) {
            this.scrollDown(20);  // 스크롤 크기 설정 (계단 높이와 일치)
        }
        this.addStair();
        this.cleanupStairs(); // 화면 아래로 벗어난 계단 제거
    }

    addFirstStair() {
        const stairWidth = 60;
        const stairHeight = 20;
        const yPosition = this.ground.y - this.ground.displayHeight / 2 + stairHeight / 2;

        const stair = this.stairs.create(this.lastStairX, yPosition, null);
        stair.displayWidth = stairWidth;
        stair.displayHeight = stairHeight;
        stair.setOrigin(0.5);
        stair.setFillStyle = 0x808080;

        stair.body.immovable = true;

        return stair;
    }

    addStair() {
        const { width } = this.scale;
        const stairWidth = 60;
        const stairHeight = 20;

        let xPosition;
        if (Phaser.Math.Between(0, 1) === 0) {
            xPosition = this.lastStairX - stairWidth + 10;
            if (xPosition - stairWidth / 2 < 0) {
                xPosition = this.lastStairX + stairWidth - 10;
            }
        } else {
            xPosition = this.lastStairX + stairWidth - 10;
            if (xPosition + stairWidth / 2 > width) {
                xPosition = this.lastStairX - stairWidth + 10;
            }
        }

        const yPosition = this.lastStairY - stairHeight - 2;
        const stair = this.stairs.create(xPosition, yPosition, null);
        stair.displayWidth = stairWidth;
        stair.displayHeight = stairHeight;
        stair.setOrigin(0.5);
        stair.setFillStyle = 0x808080;

        this.lastStairX = xPosition;
        this.lastStairY = yPosition;

        stair.body.immovable = true;
    }

    scrollDown(amount) {
        // 캐릭터, 계단 모두를 아래로 이동하여 스크롤 효과를 만듦
        this.character.y += amount;
        
        this.stairs.getChildren().forEach(stair => {
            stair.y += amount;
        });

        // 계단 Y 위치 보정
        this.lastStairY += amount;
    }

    cleanupStairs() {
        // 화면 아래로 벗어난 계단을 제거하여 메모리 최적화
        const screenBottom = this.scale.height + 50;
        this.stairs.getChildren().forEach(stair => {
            if (stair.y > screenBottom) {
                stair.destroy(); // 화면 아래로 벗어난 계단 제거
            }
        });
    }

    update() {
        // 캐릭터가 왼쪽 방향키로 이동
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.moveCharacterToNextStair("left");
        } 
        // 캐릭터가 오른쪽 방향키로 이동
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.moveCharacterToNextStair("right");
        }

        // 캐릭터가 땅에 닿으면 게임 오버 처리
        if (this.character.y >= this.ground.y - this.ground.displayHeight / 2) {
            this.endGame();
        }
    }


    moveCharacterToNextStair(direction) {
        const nextStair = this.findAdjacentUpperStair(this.currentStair, direction);

        if (!nextStair) {
            this.endGame();
        } else {
            this.character.setPosition(nextStair.x, nextStair.y - nextStair.displayHeight / 2 - this.character.displayHeight / 2);
            this.currentStair = nextStair;
            this.incrementScore(); // 계단 이동 시 점수 증가
        }
    }

    findAdjacentUpperStair(currentStair, direction) {
        const stairs = this.stairs.getChildren();
        for (const candidateStair of stairs) {
            const isDirectlyAbove = candidateStair.y < currentStair.y && candidateStair.y >= currentStair.y - candidateStair.displayHeight * 1.5;
            const isLeft = direction === "left" && candidateStair.x < currentStair.x;
            const isRight = direction === "right" && candidateStair.x > currentStair.x;

            if (isDirectlyAbove && (isLeft || isRight)) {
                return candidateStair;
            }
        }
        return null;
    }

    incrementScore() {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);

        if (this.score >= this.nextLevelScore) {
            this.incrementLevel();
        }
    }

    incrementLevel() {
        this.level += 1;
        this.levelText.setText(`Level: ${this.level}`);
        
        // 다음 레벨에 필요한 계단 수를 계산
        this.nextLevelScore += Math.floor(this.nextLevelScore * 1.2);

        // 레벨 증가 시 계단 생성 속도 증가
        this.stairDelay = Math.max(200, this.stairDelay * 0.8); // 최소 200ms까지 감소
        this.startStairTimer(); // 새로운 속도로 타이머 재설정
    }

    endGame() {
        console.log("Game Over");
        
        // 화면 중앙에 Game Over 메시지 표시
        this.add.text(
            this.scale.width / 2, 
            this.scale.height / 2, 
            'Game Over', 
            { fontSize: '48px', color: '#ff0000' }
        ).setOrigin(0.5);
        
        this.scene.pause();
    }
}
