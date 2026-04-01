import Phaser from 'phaser';
import { COLORS } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';

// TODO: Implement game over screen with high score display and retry flow
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.worldId = data.worldId ?? 0;
    this.level = data.level ?? 1;
    this.score = data.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0008);

    this.add.text(width / 2, height * 0.28, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: '#ff3366',
      stroke: '#660022',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.42, `SCORE: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#aaffcc',
    }).setOrigin(0.5);

    audioManager.playGameOver();

    const retryBtn = this.add.rectangle(width / 2, height * 0.60, 200, 54, COLORS.UI_DARK)
      .setStrokeStyle(2, COLORS.UI_BORDER)
      .setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height * 0.60, 'RETRY', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#33ff99',
    }).setOrigin(0.5);

    retryBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.scene.start('GameScene', { worldId: this.worldId, level: this.level });
    });

    const menuBtn = this.add.rectangle(width / 2, height * 0.72, 200, 46, 0x080808)
      .setStrokeStyle(1, 0x335544)
      .setInteractive({ useHandCursor: true });
    this.add.text(width / 2, height * 0.72, 'MAIN MENU', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#557766',
    }).setOrigin(0.5);

    menuBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.scene.start('TitleScene');
    });
  }
}
