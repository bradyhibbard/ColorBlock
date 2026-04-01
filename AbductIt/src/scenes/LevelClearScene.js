import Phaser from 'phaser';
import { COLORS } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';

// TODO: Implement level clear screen with score summary and next-level flow
export class LevelClearScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelClearScene' });
  }

  init(data) {
    this.worldId = data.worldId ?? 0;
    this.level = data.level ?? 1;
    this.score = data.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, COLORS.UI_BG);

    this.add.text(width / 2, height * 0.30, 'LEVEL CLEAR!', {
      fontFamily: 'monospace',
      fontSize: '38px',
      color: '#ffdd00',
      stroke: '#886600',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.44, `SCORE: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#33ff99',
    }).setOrigin(0.5);

    audioManager.playLevelClear();

    const nextBtn = this.add.rectangle(width / 2, height * 0.62, 200, 54, COLORS.UI_DARK)
      .setStrokeStyle(2, COLORS.UI_BORDER)
      .setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height * 0.62, 'CONTINUE', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#33ff99',
    }).setOrigin(0.5);

    nextBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.scene.start('GameScene', { worldId: this.worldId, level: this.level + 1 });
    });

    const menuBtn = this.add.rectangle(width / 2, height * 0.74, 200, 46, 0x080808)
      .setStrokeStyle(1, 0x335544)
      .setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height * 0.74, 'WORLD MAP', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#557766',
    }).setOrigin(0.5);

    menuBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.scene.start('WorldMapScene');
    });
  }
}
