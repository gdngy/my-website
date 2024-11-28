export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        const { centerX, centerY } = this.cameras.main;
        this.add.text(centerX, centerY, 'Game Over!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}
