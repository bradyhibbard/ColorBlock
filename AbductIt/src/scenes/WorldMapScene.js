import Phaser from 'phaser';
import { COLORS, WORLDS } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';

// TODO: Implement world/level selection UI
export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WorldMapScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, COLORS.UI_BG);

    this.add.text(width / 2, height * 0.12, 'SELECT WORLD', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#33ff99',
    }).setOrigin(0.5);

    // Placeholder world list
    WORLDS.forEach((world, i) => {
      const unlocked = SaveManager.isWorldUnlocked(world.id) || world.unlocked;
      const y = height * 0.26 + i * 62;
      const color = unlocked ? COLORS.UI_DARK : 0x0a0a0a;
      const textColor = unlocked ? '#33ff99' : '#335544';

      const btn = this.add.rectangle(width / 2, y, width * 0.82, 48, color)
        .setStrokeStyle(1, unlocked ? COLORS.UI_BORDER : 0x223322);
      if (unlocked) btn.setInteractive({ useHandCursor: true });

      this.add.text(width / 2, y, unlocked ? world.name : `${world.name}  [LOCKED]`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: textColor,
      }).setOrigin(0.5);

      if (unlocked) {
        btn.on('pointerdown', () => {
          audioManager.playButtonTap();
          audioManager.stopMusic();
          this.scene.start('GameScene', { worldId: world.id, level: 1 });
        });
      }
    });

    // Back button
    const backBtn = this.add.rectangle(60, height - 40, 100, 36, COLORS.UI_DARK)
      .setStrokeStyle(1, COLORS.UI_BORDER)
      .setInteractive({ useHandCursor: true });
    this.add.text(60, height - 40, 'BACK', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#33ff99',
    }).setOrigin(0.5);

    backBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.scene.start('TitleScene');
    });
  }
}
