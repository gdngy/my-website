export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { centerX, centerY } = this.cameras.main;
        this.add.text(centerX, centerY, 'Bug Catcher Game', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('GamePlayScene');
        });
    }
}
