export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    preload() {
        const { width, height } = this.scale;

        // 로딩 화면 표시
        const progressBar = this.add.graphics();
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4, height / 2, (width / 2) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
        });

        // 리소스 로드
        // 예: this.load.image('someAsset', 'path/to/asset.png');
    }

    create() {
        // 로딩 완료 후 메뉴 씬으로 이동
        this.scene.start('GameMenuScene');
    }
}
