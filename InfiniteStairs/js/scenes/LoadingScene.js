export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
    }

    preload() {
        // 자원 로드 예시
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        // 가로 중앙과 세로 3분의 1 지점에 로딩 메시지 배치
        this.add.text(this.scale.width / 2, this.scale.height / 3, 'Loading...', {
            fontSize: '32px',
            color: '#fff'
        })
        .setOrigin(0.5);

        this.scene.start('GameMenuScene');
    }
}
