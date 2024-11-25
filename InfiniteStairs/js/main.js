import LoadingScene from './scenes/LoadingScene.js';
import GameMenuScene from './scenes/GameMenuScene.js'; // 변경된 파일명
import GamePlayScene from './scenes/GamePlayScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 540,
    height: 960,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 540,
        height: 960
    },
    scene: [LoadingScene, GameMenuScene, GamePlayScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};

const game = new Phaser.Game(config);
