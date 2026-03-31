import Phaser from 'phaser';
import { WORLDS } from '../data/Constants.js';
import { SaveManager } from '../ui/SaveManager.js';
import { audioManager } from '../audio/AudioManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) {
    this.worldId = data.worldId;
    this.levelId = data.levelId;
    this.score   = data.score;
    this.reason  = data.reason || 'TIME';
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const world = WORLDS[this.worldId];

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0000, 0x1a0000, 0x220000, 0x220000, 1);
    bg.fillRect(0, 0, W, H);

    for (let i = 0; i < 30; i++) {
      this.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        'star'
      ).setAlpha(Math.random() * 0.3 + 0.05);
    }

    const ufo = this.add.image(W / 2, H * 0.25, 'ufo').setScale(1.4).setTint(0xff4444);
    this.tweens.add({
      targets: ufo,
      angle: 360,
      y: H * 0.25 + 20,
      duration: 2000,
      repeat: -1,
      ease: 'Linear',
    });

    const reason = this.reason === 'TIME' ? "TIME'S UP!" : 'SHIP DESTROYED';
    this.add.text(W / 2, H * 0.44, 'ABDUCTION FAILED', {
      fontFamily: 'monospace',
      fontSize: `${Math.min(W * 0.085, 32)}px`,
      color: '#ff4444',
      stroke: '#1a0000',
      strokeThickness: 5,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.54, reason, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ff8888',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.62, `SCORE: ${this.score.toLocaleString()}`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.70, `${world.name} - Level ${this.levelId + 1}`, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#888888',
    }).setOrigin(0.5);

    const btnW = W * 0.6;
    const retryY = H * 0.80;
    this._makeButton(W / 2 - btnW / 2, retryY, btnW, 50, 'TRY AGAIN', '#ff8888', 0x220000, () => {
      audioManager.playButtonTap();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', {
          worldId: this.worldId,
          levelId: this.levelId,
        });
      });
    });

    const mapY = H * 0.88;
    this._makeButton(W / 2 - btnW / 2, mapY - 12, btnW, 40, 'WORLD MAP', '#888888', 0x110000, () => {
      audioManager.playButtonTap();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('WorldMapScene');
      });
    });

    const crt = this.add.graphics().setDepth(1000);
    crt.fillStyle(0x000000, 0.1);
    for (let y = 0; y < H; y += 3) crt.fillRect(0, y, W, 1);

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  _makeButton(x, y, w, h, label, textColor, fillColor, callback) {
    const g = this.add.graphics();
    g.fillStyle(fillColor, 1);
    g.lineStyle(2, 0xff4444, 0.6);
    g.fillRoundedRect(x, y, w, h, 8);
    g.strokeRoundedRect(x, y, w, h, 8);

    this.add.text(x + w / 2, y + h / 2, label, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: textColor,
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setOrigin(0, 0).setInteractive();
    zone.on('pointerdown', callback);
  }
}
