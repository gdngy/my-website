export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        console.log('BootScene: Loading...');
    }

    create() {
        console.log('BootScene: Starting...');
        this.scene.start('PreloadScene');
    }
}
