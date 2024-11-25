export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        // 가로 중앙과 세로 3분의 1 지점에 텍스트 배치
        const restartButton = this.add.text(this.scale.width / 2, this.scale.height / 3, 'Play Again', {
            fontSize: '32px',
            color: '#fff'
        })
        .setOrigin(0.5)
        .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('GamePlayScene');
        });
    }
}
