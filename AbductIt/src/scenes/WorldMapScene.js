import Phaser from 'phaser';
import { WORLDS } from '../data/Constants.js';
import { SaveManager } from '../ui/SaveManager.js';
import { audioManager } from '../audio/AudioManager.js';

export class WorldMapScene extends Phaser.Scene {
  constructor() { super({ key: 'WorldMapScene' }); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // BG
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000011, 0x000011, 0x0a0022, 0x0a0022, 1);
    bg.fillRect(0, 0, W, H);

    // Stars
    for (let i = 0; i < 60; i++) {
      this.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        'star'
      ).setAlpha(Math.random() * 0.7 + 0.2);
    }

    // Title
    this.add.text(W / 2, 48, 'SELECT WORLD', {
      fontFamily: 'monospace',
      fontSize: `${Math.min(W * 0.07, 28)}px`,
      color: '#33ff99',
      stroke: '#003322',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // World cards
    const cardW = W * 0.82;
    const cardH = 76;
    const startY = 100;
    const gap = 84;

    WORLDS.forEach((world, i) => {
      const unlocked = SaveManager.isWorldUnlocked(i) || i === 0;
      const y = startY + i * gap;
      const x = W / 2;
      const progress = SaveManager.getLevelProgress(i);

      // Card bg
      const card = this.add.graphics();
      if (unlocked) {
        card.fillStyle(0x112233, 1);
        card.lineStyle(2, 0x33ff99, 1);
      } else {
        card.fillStyle(0x111111, 1);
        card.lineStyle(2, 0x333333, 1);
      }
      card.fillRoundedRect(x - cardW / 2, y, cardW, cardH, 10);
      card.strokeRoundedRect(x - cardW / 2, y, cardW, cardH, 10);

      // World number dot
      const dotColor = unlocked ? 0x33ff99 : 0x444444;
      const dot = this.add.graphics();
      dot.fillStyle(dotColor, 1);
      dot.fillCircle(x - cardW / 2 + 28, y + cardH / 2, 16);
      this.add.text(x - cardW / 2 + 28, y + cardH / 2, `${i + 1}`, {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: unlocked ? '#001a00' : '#222222',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // World name
      this.add.text(x - cardW / 2 + 60, y + 16, world.name, {
        fontFamily: 'monospace',
        fontSize: `${Math.min(W * 0.05, 18)}px`,
        color: unlocked ? '#ffffff' : '#444444',
      });

      if (unlocked) {
        // Progress
        this.add.text(x - cardW / 2 + 60, y + 40, `LEVEL ${Math.min(progress + 1, 10)} / 10`, {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#aaffdd',
        });

        // Progress bar
        const barW = cardW - 80;
        const barX = x - cardW / 2 + 60;
        const barY = y + 58;
        const prog = this.add.graphics();
        prog.fillStyle(0x224433, 1);
        prog.fillRect(barX, barY, barW, 6);
        prog.fillStyle(0x33ff99, 1);
        prog.fillRect(barX, barY, barW * (progress / 10), 6);

        // Make interactive
        const zone = this.add.zone(x, y + cardH / 2, cardW, cardH).setInteractive();
        zone.on('pointerdown', () => {
          audioManager.playButtonTap();
          this._selectWorld(i);
        });
      } else {
        this.add.text(x - cardW / 2 + 60, y + 40, 'LOCKED', {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#555555',
        });
      }
    });

    // Back button
    const backBtn = this.add.text(W / 2, H - 36, '<- BACK', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5).setInteractive();
    backBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.scene.start('TitleScene');
    });

    // CRT
    this._addCRT();

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  _selectWorld(worldId) {
    this.scene.start('GameScene', {
      worldId,
      levelId: Math.max(0, SaveManager.getLevelProgress(worldId)),
    });
  }

  _addCRT() {
    const W = this.scale.width;
    const H = this.scale.height;
    const crt = this.add.graphics();
    crt.setDepth(1000);
    crt.fillStyle(0x000000, 0.1);
    for (let y = 0; y < H; y += 3) crt.fillRect(0, y, W, 1);
  }
}
