import Phaser from 'phaser';
import { WORLDS } from '../data/Constants.js';
import { SaveManager } from '../ui/SaveManager.js';
import { audioManager } from '../audio/AudioManager.js';

export class LevelClearScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelClearScene' }); }

  init(data) {
    this.worldId   = data.worldId;
    this.levelId   = data.levelId;
    this.score     = data.score;
    this.timeBonus = data.timeBonus;
    this.timeLeft  = data.timeLeft;
    this.lives     = data.lives;
    this.maxCombo  = data.maxCombo;
    this.abducted  = data.abducted;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    const world = WORLDS[this.worldId];

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x001a00, 0x001a00, 0x002200, 0x002200, 1);
    bg.fillRect(0, 0, W, H);

    for (let i = 0; i < 50; i++) {
      this.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        'star'
      ).setAlpha(Math.random() * 0.5 + 0.2);
    }

    const panW = W * 0.88;
    const panH = H * 0.72;
    const panX = W / 2 - panW / 2;
    const panY = H / 2 - panH / 2;
    const panel = this.add.graphics();
    panel.fillStyle(0x001100, 0.95);
    panel.lineStyle(3, 0x33ff99, 1);
    panel.fillRoundedRect(panX, panY, panW, panH, 16);
    panel.strokeRoundedRect(panX, panY, panW, panH, 16);

    const ufoIcon = this.add.image(W / 2, panY + 36, 'ufo').setScale(1.2);

    this.add.text(W / 2, panY + 72, 'LEVEL CLEAR!', {
      fontFamily: 'monospace',
      fontSize: `${Math.min(W * 0.1, 36)}px`,
      color: '#33ff99',
      stroke: '#002200',
      strokeThickness: 5,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(W / 2, panY + 108, `${world.name} - Level ${this.levelId + 1}`, {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#aaffdd',
    }).setOrigin(0.5);

    const rank = this._getRank();
    const rankColors = { S: '#ffdd00', A: '#33ff99', B: '#4488ff', C: '#ff8800', F: '#ff4444' };
    this.add.text(W / 2, panY + 142, `RANK: ${rank}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: rankColors[rank],
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const rows = [
      ['Abductions:', `${this.abducted}`, '#ffffff'],
      ['Combo Peak:', `x${this._getComboMult(this.maxCombo).toFixed(1)}`, '#ff8800'],
      [`Time Bonus (${this.timeLeft}s):`, `+${this.timeBonus.toLocaleString()}`, '#33ff99'],
    ];

    const rowStartY = panY + 185;
    rows.forEach((row, i) => {
      const y = rowStartY + i * 28;
      this.add.text(panX + 24, y, row[0], {
        fontFamily: 'monospace', fontSize: '13px', color: '#aaaaaa',
      });
      this.add.text(panX + panW - 24, y, row[1], {
        fontFamily: 'monospace', fontSize: '13px', color: row[2],
      }).setOrigin(1, 0);
    });

    this.add.graphics().lineStyle(1, 0x33ff99, 0.4)
      .strokeRect(panX + 16, rowStartY + rows.length * 28 + 4, panW - 32, 0);

    const totalY = rowStartY + rows.length * 28 + 16;
    this.add.text(panX + 24, totalY, 'TOTAL SCORE', {
      fontFamily: 'monospace', fontSize: '14px', color: '#aaffdd',
    });
    this.add.text(panX + panW - 24, totalY, this.score.toLocaleString(), {
      fontFamily: 'monospace', fontSize: '22px', color: '#ffdd00',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(1, 0);

    const hs = SaveManager.getHighScore(this.worldId, this.levelId + 1);
    if (this.score >= hs) {
      this.add.text(W / 2, totalY + 32, '* NEW BEST! *', {
        fontFamily: 'monospace', fontSize: '13px', color: '#ffdd00',
      }).setOrigin(0.5);
    }

    const nextBtnY = panY + panH - 30;
    const btnW = (panW - 48) / 2;

    const retryBtn = this._makeButton(
      panX + 16, nextBtnY - 20, btnW, 40,
      'RETRY', '#aaaaaa', 0x221100
    );
    retryBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene', {
          worldId: this.worldId,
          levelId: this.levelId,
        });
      });
    });

    const isLastLevel = this.levelId >= 9;
    const nextLabel = isLastLevel ? 'WORLD MAP' : 'NEXT >';
    const nextBtn = this._makeButton(
      panX + panW - btnW - 16, nextBtnY - 20, btnW, 40,
      nextLabel, '#33ff99', 0x002200
    );
    nextBtn.on('pointerdown', () => {
      audioManager.playButtonTap();
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        if (isLastLevel) {
          this.scene.start('WorldMapScene');
        } else {
          this.scene.start('GameScene', {
            worldId: this.worldId,
            levelId: this.levelId + 1,
            score:   this.score,
            lives:   this.lives,
          });
        }
      });
    });

    const crt = this.add.graphics().setDepth(1000);
    crt.fillStyle(0x000000, 0.1);
    for (let y = 0; y < H; y += 3) crt.fillRect(0, y, W, 1);

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  _makeButton(x, y, w, h, label, color, fillColor) {
    const g = this.add.graphics();
    g.fillStyle(fillColor, 1);
    g.lineStyle(2, 0x33ff99, 0.8);
    g.fillRoundedRect(x, y, w, h, 8);
    g.strokeRoundedRect(x, y, w, h, 8);

    const txt = this.add.text(x + w / 2, y + h / 2, label, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color,
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setOrigin(0, 0).setInteractive();
    zone.on('pointerover', () => { g.setAlpha(0.7); txt.setAlpha(0.7); });
    zone.on('pointerout',  () => { g.setAlpha(1);   txt.setAlpha(1); });
    return zone;
  }

  _getRank() {
    if (this.lives === 3 && this.timeLeft > 30) return 'S';
    if (this.lives >= 2 && this.timeLeft > 15) return 'A';
    if (this.lives >= 1 && this.timeLeft > 5)  return 'B';
    if (this.lives >= 1)                        return 'C';
    return 'F';
  }

  _getComboMult(count) {
    if (count >= 8) return 3.0;
    if (count >= 5) return 2.5;
    if (count >= 3) return 2.0;
    if (count >= 2) return 1.5;
    return 1.0;
  }
}
