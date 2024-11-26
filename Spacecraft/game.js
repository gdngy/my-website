// 기본 Phaser 게임 설정
const config = {
    type: Phaser.AUTO, // WebGL 지원 여부에 따라 자동 설정
    width: 800, // 게임 너비
    height: 600, // 게임 높이
    scene: {
        preload: preload, // 자원 로드
        create: create, // 게임 요소 생성
        update: update // 매 프레임 업데이트
    },
    physics: {
        default: 'arcade', // 간단한 물리 엔진
        arcade: {
            gravity: { y: 0 }, // 중력 없음 (우주 게임이므로)
            debug: false // 디버그 모드 비활성화
        }
    }
};

// Phaser 게임 시작
const game = new Phaser.Game(config);

function preload() {
    // 이미지 리소스 로드
    this.load.image('background', 'assets/space-background.png'); // 배경
    this.load.image('spaceship', 'assets/spaceship.png'); // 우주선 이미지
    this.load.image('meteor', 'assets/meteor.png'); // 운석 이미지
    this.load.image('missile', 'assets/missile.png'); // 미사일 이미지
}

function create() {
    // 배경 이미지 추가 (화면 중앙에 맞게 배치)
    this.add.image(400, 300, 'background');

    // 우주선 생성 및 크기 조정
    this.player = this.physics.add.sprite(400, 500, 'spaceship'); // 우주선을 화면 아래 중앙에 추가
    this.player.setDisplaySize(24, 24); // 우주선 이미지의 크기를 24x24로 조정
    this.player.setCollideWorldBounds(true); // 화면 밖으로 나가지 않도록 설정

    // 키보드 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // 스페이스바 입력 추가

    // 초기 속도 및 최대 속도 설정
    this.playerSpeed = 200; // 초기 속도
    this.maxSpeed = 600; // 최대 속도
    this.acceleration = 10; // 가속도 (프레임당 증가량)
    this.deceleration = 20; // 감속도 (프레임당 감소량)

    // 점수 및 레벨 초기화
    this.score = 0;
    this.level = 1;
    this.nextLevelScore = 100; // 1레벨에서 2레벨로 가기 위한 점수
    this.interestRate = 1.5; // 복리 이자율 (다음 레벨로 가기 위한 점수 계산에 사용)

    // 초기 초당 운석 생성 수
    this.meteorsPerSecond = 1;

    // 초기 속도 범위 설정
    this.minMeteorSpeed = 100;
    this.maxMeteorSpeed = 120;

    // 텍스트 추가 (점수 및 레벨)
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    this.levelText = this.add.text(16, 50, 'Level: 1', { fontSize: '32px', fill: '#fff' });

    // 운석 그룹 생성
    this.meteors = this.physics.add.group();
    
    // 미사일 그룹 생성
    this.missiles = this.physics.add.group();

    // 운석 생성 타이머 설정
    this.updateMeteorTimer(); // 메서드 호출

    // 충돌 이벤트 설정
    this.physics.add.overlap(this.player, this.meteors, this.handleCollision, null, this);
    this.physics.add.overlap(this.missiles, this.meteors, this.handleMissileCollision, null, this);

    // 게임 오버 상태 변수
    this.isGameOver = false;
}

function update() {
    if (this.isGameOver) return; // 게임 오버 상태에서는 업데이트 중지

    // 방향키 입력에 따른 우주선 이동 및 가속 처리
    if (this.cursors.left.isDown) {
        if (this.player.body.velocity.x > -this.maxSpeed) {
            this.player.setVelocityX(Math.max(this.player.body.velocity.x - this.acceleration, -this.maxSpeed));
        }
    } else if (this.cursors.right.isDown) {
        if (this.player.body.velocity.x < this.maxSpeed) {
            this.player.setVelocityX(Math.min(this.player.body.velocity.x + this.acceleration, this.maxSpeed));
        }
    } else {
        if (this.player.body.velocity.x > 0) {
            this.player.setVelocityX(Math.max(this.player.body.velocity.x - this.deceleration, 0));
        } else if (this.player.body.velocity.x < 0) {
            this.player.setVelocityX(Math.min(this.player.body.velocity.x + this.deceleration, 0));
        }
    }

    // 점수 증가 (프레임당 0.01씩 증가)
    this.score += 0.01;
    this.scoreText.setText('Score: ' + Math.floor(this.score)); // 화면에 정수로 표시

    // 스페이스바로 미사일 발사
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.fireMissile();
    }

    // 레벨업 처리
    if (this.score >= this.nextLevelScore) {
        const previousLevelScore = this.nextLevelScore; // 이전 레벨의 목표 점수 저장
        this.level++; // 레벨 증가
        this.levelText.setText('Level: ' + this.level); // 새로운 레벨 텍스트 표시

        // 다음 레벨로 가기 위한 점수 설정 (복리 이자 방식)
        const additionalScore = 100 * Math.pow(this.interestRate, this.level - 1); // 추가 점수 계산
        this.nextLevelScore += additionalScore; // 누적된 점수에 추가

        // 운석 생성 수 조정
        this.meteorsPerSecond += this.meteorsPerSecond * 1.2; // 이전 초당 생성 수 + (이전 초당 생성 수 * 1.2)
        this.updateMeteorTimer(); // 타이머 업데이트

        // 운석 속도 범위 조정
        this.minMeteorSpeed += 10; // 최소 속도 10 증가
        this.maxMeteorSpeed += 20; // 최대 속도 20 증가
    }

    // 운석이 화면 밖으로 나가면 제거하고 추가 점수 10점 부여
    this.meteors.children.each(function (meteor) {
        if (meteor.y > 600) { // 화면 하단을 벗어났을 때
            meteor.destroy(); // 운석 제거
            this.score += 10; // 점수 10점 추가
        }
    }, this);
}

// 운석 생성 타이머 갱신 함수
Phaser.Scene.prototype.updateMeteorTimer = function () {
    if (this.meteorTimer) {
        this.meteorTimer.remove(); // 기존 타이머 제거
    }

    const delay = 1000 / this.meteorsPerSecond; // 초당 생성할 운석 수 기반으로 지연 시간 설정
    this.meteorTimer = this.time.addEvent({
        delay: delay,
        callback: this.createMeteor,
        callbackScope: this,
        loop: true
    });
}

// 운석 생성 함수
Phaser.Scene.prototype.createMeteor = function () {
    const x = Phaser.Math.Between(50, 750); // 무작위 X 위치
    const meteor = this.meteors.create(x, 0, 'meteor');

    // 운석의 무작위 크기 설정 (가로: 8 ~ 64, 세로: 8 ~ 64)
    const randomWidth = Phaser.Math.Between(8, 64);
    const randomHeight = Phaser.Math.Between(8, 64);
    meteor.setDisplaySize(randomWidth, randomHeight);

    // 무작위 속도 설정 (레벨에 따라 달라지는 범위 사용)
    const speed = Phaser.Math.Between(this.minMeteorSpeed, this.maxMeteorSpeed);
    meteor.setVelocityY(speed);
}

// 미사일 발사 함수
Phaser.Scene.prototype.fireMissile = function () {
    const missile = this.missiles.create(this.player.x, this.player.y - 20, 'missile');
    missile.setDisplaySize(8, 20);
    missile.setVelocityY(-400); // 위로 발사
}

// 미사일과 운석 충돌 처리
Phaser.Scene.prototype.handleMissileCollision = function (missile, meteor) {
    missile.destroy(); // 미사일 제거
    meteor.destroy(); // 운석 제거
    this.score += 20; // 점수 추가
}

// 우주선과 운석 충돌 처리 함수
Phaser.Scene.prototype.handleCollision = function () {
    if (this.isGameOver) return;

    this.isGameOver = true; // 게임 오버 상태로 전환
    this.physics.pause(); // 모든 물리적 움직임 중지

    // 운석 생성 타이머 제거 (운석 생성 중지)
    if (this.meteorTimer) {
        this.meteorTimer.remove();
    }

    // 게임 오버 텍스트 표시
    this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5);
    this.add.text(400, 380, `Score: ${Math.floor(this.score)}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(400, 420, `Level: ${this.level}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // "다시하기" 버튼 추가
    const restartButton = this.add.text(400, 480, 'Restart', { fontSize: '32px', fill: '#008CBA', backgroundColor: '#000' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.restart(); // 게임 장면 다시 시작
        });
}
