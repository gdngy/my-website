export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // 리소스 로드
        this.load.image('background', 'assets/images/background.png');
        this.load.image('bug', 'assets/images/bugs/bug.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}
