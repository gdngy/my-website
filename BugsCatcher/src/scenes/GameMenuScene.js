export default class GameMenuScene extends Phaser.Scene {
    constructor() {
        super('GameMenuScene');
    }

    create() {
        // 버튼 스타일
        const buttonStyle = {
            fontSize: '24px',
            fontFamily: '"Noto Sans KR", sans-serif',
            color: '#fff'
        };

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonColor = 0x555555;

        // 첫 번째 버튼: "게임 시작"
        const startButton = this.createButton(this.scale.width / 2, this.scale.height / 3, '게임 시작', buttonWidth, buttonHeight, buttonColor, buttonStyle);
        startButton.on('pointerdown', () => {
            this.scene.start('GamePlayScene'); // GamePlayScene으로 전환
        });

        // 두 번째 버튼: "게임 종료"
        const quitButton = this.createButton(this.scale.width / 2, this.scale.height / 3 + 70, '게임 종료', buttonWidth, buttonHeight, buttonColor, buttonStyle);
        quitButton.on('pointerdown', () => {
            this.game.destroy(true); // 게임 종료
        });

        // 세 번째 버튼: "게임 이력"
        const historyButton = this.createButton(this.scale.width / 2, this.scale.height / 3 + 140, '게임 이력', buttonWidth, buttonHeight, buttonColor, buttonStyle);
        historyButton.on('pointerdown', () => {
            console.log('게임 이력 보기'); // 콘솔 출력 (추후 구현 가능)
        });
    }

    createButton(x, y, text, width, height, color, textStyle) {
        const buttonBg = this.add.rectangle(x, y, width, height, color)
            .setInteractive()
            .setOrigin(0.5);

        const buttonText = this.add.text(x, y, text, textStyle)
            .setOrigin(0.5);

        const button = this.add.container(0, 0, [buttonBg, buttonText]);

        buttonBg.on('pointerdown', () => button.emit('pointerdown'));

        return button;
    }
}
