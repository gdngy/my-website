export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0; // 게임 종료 시 전달받은 점수
    }

    create() {
        const { width, height } = this.scale;

        // 게임 오버 텍스트
        this.add.text(width / 2, height / 2 - 50, '게임 오버', {
            fontSize: '40px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ff0000',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        // 최종 점수 표시
        this.add.text(width / 2, height / 2, `최종 점수: ${this.finalScore}`, {
            fontSize: '24px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 메인 메뉴로 이동 버튼
        const menuButton = this.add.text(width / 2, height / 2 + 50, '메인 메뉴로', {
            fontSize: '24px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        menuButton.on('pointerdown', () => {
            this.scene.start('GameMenuScene'); // 메인 메뉴로 이동
        });
    }
}
