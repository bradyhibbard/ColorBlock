import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';
import { HUDScene } from './scenes/HUDScene.js';
import { LevelClearScene } from './scenes/LevelClearScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';

const W = window.innerWidth;
const H = window.innerHeight;

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#000000',
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    TitleScene,
    WorldMapScene,
    GameScene,
    HUDScene,
    LevelClearScene,
    GameOverScene,
  ],
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  input: {
    activePointers: 3,
  },
  audio: {
    disableWebAudio: false,
  },
};

const game = new Phaser.Game(config);

window.addEventListener('contextmenu', (e) => e.preventDefault());
