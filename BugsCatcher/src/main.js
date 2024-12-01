import PreloaderScene from './scenes/PreloaderScene.js';
import GameMenuScene from './scenes/GameMenuScene.js';
import GamePlayScene from './scenes/GamePlayScene.js';
import GameOverScene from './scenes/GameOverScene.js'; // 게임 오버 씬 추가

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.EXPAND,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // 필요 시 true로 변경
        }
    },
    scene: [
        PreloaderScene,  // 로딩 화면
        GameMenuScene,   // 메인 메뉴
        GamePlayScene,   // 게임 플레이
        GameOverScene    // 게임 오버 화면
    ],
    parent: 'game-container'
};

const game = new Phaser.Game(config);
