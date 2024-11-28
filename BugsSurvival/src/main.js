import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GamePlayScene from './scenes/GamePlayScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// 16:9 비율 설정
const DEFAULT_WIDTH = 1280; // 16:9 기본 너비
const DEFAULT_HEIGHT = 720; // 16:9 기본 높이

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    backgroundColor: '#1d1d1d',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT, // 16:9 비율 유지
        autoCenter: Phaser.Scale.CENTER_BOTH, // 중앙 정렬
    },
    scene: [BootScene, PreloadScene, MenuScene, GamePlayScene, GameOverScene],
};

const game = new Phaser.Game(config);
