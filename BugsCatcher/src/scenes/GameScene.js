export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        // 동적으로 텍스트 생성
        this.titleText = this.add.text(screenWidth / 2, screenHeight / 2 - 50, 'Adaptive Phaser Game', {
            fontSize: `${screenWidth / 20}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // 버튼 생성
        const startButton = this.add.text(screenWidth / 2, screenHeight / 2 + 50, 'Start Game', {
            fontSize: `${screenWidth / 25}px`,
            color: '#ffffff',
            backgroundColor: '#007bff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            console.log('Game Started!');
        });

        // 화면 크기 조정 이벤트 핸들러
        this.scale.on('resize', this.resize, this);
    }

    resize(gameSize) {
        const { width, height } = gameSize;

        // 텍스트 크기 및 위치 조정
        this.titleText.setFontSize(width / 20);
        this.titleText.setPosition(width / 2, height / 2 - 50);
    }
}
