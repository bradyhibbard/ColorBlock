import Phaser from 'phaser';
import { COLORS, WORLDS } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';

// TODO: Implement core gameplay loop
export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.worldId = data.worldId ?? 0;
    this.level = data.level ?? 1;
  }

  create() {
    const { width, height } = this.scale;

    // Properties referenced by entity classes
    this.W = width;
    this._groundY = height * 0.82;
    this.ufo = null;
    this.bullets = null;

    const world = WORLDS[this.worldId] ?? WORLDS[0];

    // Sky
    this.add.rectangle(width / 2, height / 2, width, height, world.skyColor);

    // Ground
    this.add.rectangle(width / 2, this._groundY + 20, width, 40, world.groundColor);

    this.add.text(width / 2, height * 0.40, 'GAMEPLAY', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#33ff99',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.50, 'COMING SOON', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#aaffcc',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.58, `${world.name}  —  Level ${this.level}`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#557766',
    }).setOrigin(0.5);

    audioManager.resume();
    audioManager.playWorldMusic(this.worldId);

    const backBtn = this.add.rectangle(width / 2, height * 0.72, 180, 48, COLORS.UI_DARK)
      .setStrokeStyle(2, COLORS.UI_BORDER)
      .setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height * 0.72, 'BACK TO MAP', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#33ff99',
    }).setOrigin(0.5);

    backBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      audioManager.stopMusic();
      this.scene.start('WorldMapScene');
    });
  }
}
