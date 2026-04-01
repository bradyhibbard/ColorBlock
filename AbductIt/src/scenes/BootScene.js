import Phaser from 'phaser';
import { COLORS, TARGET_TYPES } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, COLORS.UI_BG);
    this.add.text(width / 2, height / 2 - 22, 'ABDUCT IT!', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#33ff99',
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 22, 'LOADING...', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#88ccaa',
    }).setOrigin(0.5);

    this._generateTextures();

    SaveManager.load();
    audioManager.init();
    audioManager.setMuted(SaveManager.data.muteAudio);

    this.time.delayedCall(500, () => this.scene.start('TitleScene'));
  }

  // ─── Texture Generation ────────────────────────────────────────────────────

  _generateTextures() {
    this._genUFO();
    this._genShooter();
    this._genParticle();
    this._genTargets();
    this._genPowerUps();
  }

  _genUFO() {
    const W = 80, H = 44;
    const g = this.make.graphics({ add: false });

    // Underside ambient glow
    g.fillStyle(0x2266aa, 0.35);
    g.fillEllipse(W / 2, H * 0.85, W * 0.65, H * 0.25);

    // Saucer body
    g.fillStyle(0x778899, 1);
    g.fillEllipse(W / 2, H * 0.68, W * 0.98, H * 0.40);

    // Top rim highlight
    g.fillStyle(0x99aabb, 1);
    g.fillEllipse(W / 2, H * 0.61, W * 0.78, H * 0.24);

    // Rim shine strip
    g.fillStyle(0xbbccdd, 1);
    g.fillEllipse(W / 2, H * 0.54, W * 0.52, H * 0.11);

    // Dome
    g.fillStyle(0x55bbee, 1);
    g.fillEllipse(W / 2, H * 0.33, W * 0.38, H * 0.50);

    // Dome inner shine
    g.fillStyle(0x99ddff, 0.8);
    g.fillEllipse(W / 2 - 5, H * 0.25, W * 0.14, H * 0.18);

    // Underside lights
    const lightX = [W * 0.22, W * 0.39, W * 0.61, W * 0.78];
    const lightColors = [0xff4444, 0x44ff88, 0x4488ff, 0xffee00];
    lightX.forEach((x, i) => {
      g.fillStyle(lightColors[i], 1);
      g.fillCircle(x, H * 0.78, 2.5);
    });

    g.generateTexture('ufo', W, H);
    g.destroy();
  }

  _genShooter() {
    // Barrel points UP by default; Shooter.js rotates by aimAngle + PI/2
    const W = 36, H = 38;
    const g = this.make.graphics({ add: false });

    // Base platform
    g.fillStyle(0x3a4a2a, 1);
    g.fillRect(2, 22, 32, 15);

    // Turret body
    g.fillStyle(0x506038, 1);
    g.fillCircle(W / 2, 22, 12);

    // Barrel
    g.fillStyle(0x6a7a48, 1);
    g.fillRect(W / 2 - 3, 4, 6, 20);

    // Barrel tip
    g.fillStyle(0x8a9a60, 1);
    g.fillRect(W / 2 - 4, 2, 8, 6);

    // Targeting sensor
    g.fillStyle(0xff2200, 1);
    g.fillCircle(W / 2, 22, 4);
    g.fillStyle(0xff7755, 0.7);
    g.fillCircle(W / 2, 22, 2);

    g.generateTexture('shooter', W, H);
    g.destroy();
  }

  _genParticle() {
    const S = 8;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xffffff, 1);
    g.fillCircle(S / 2, S / 2, S / 2);
    g.fillStyle(0xffee88, 1);
    g.fillCircle(S / 2, S / 2, S / 2 - 1);
    g.generateTexture('particle_exp', S, S);
    g.destroy();
  }

  _genTargets() {
    Object.entries(TARGET_TYPES).forEach(([key, t]) => {
      const W = t.w, H = t.h;
      const g = this.make.graphics({ add: false });
      const dark = this._darken(t.color, 0.55);
      const lite = this._lighten(t.color, 0.28);

      // Drop shadow
      g.fillStyle(0x000000, 0.28);
      g.fillEllipse(W / 2, H - 1, W * 0.72, 4);

      // Main body
      g.fillStyle(t.color, 1);
      g.fillRect(0, 0, W, H - 2);

      // Top highlight
      g.fillStyle(lite, 0.45);
      g.fillRect(1, 1, W - 2, Math.max(2, Math.floor(H * 0.14)));

      // Outline
      g.lineStyle(1, dark, 1);
      g.strokeRect(0, 0, W, H - 2);

      // Weight-based detail
      if (t.weight <= 2) {
        // Tiny creatures: dot eyes
        g.fillStyle(0x111111, 1);
        g.fillRect(Math.floor(W * 0.28), Math.floor(H * 0.28), 2, 2);
        g.fillRect(Math.floor(W * 0.60), Math.floor(H * 0.28), 2, 2);
      } else if (t.weight === 3 && H > 22) {
        // Humans/person-sized: head circle
        g.fillStyle(0xffcc88, 1);
        g.fillCircle(W / 2, Math.floor(H * 0.17), Math.max(3, Math.floor(W * 0.22)));
      } else if (t.weight >= 4 && t.weight <= 7 && W > 36) {
        // Vehicles: windows + wheels
        g.fillStyle(0x99ccff, 0.8);
        g.fillRect(Math.floor(W * 0.14), Math.floor(H * 0.14), Math.floor(W * 0.28), Math.floor(H * 0.34));
        if (W > 50) {
          g.fillRect(Math.floor(W * 0.56), Math.floor(H * 0.14), Math.floor(W * 0.28), Math.floor(H * 0.34));
        }
        g.fillStyle(0x111111, 1);
        g.fillCircle(Math.floor(W * 0.21), H - 4, 4);
        g.fillCircle(Math.floor(W * 0.79), H - 4, 4);
        if (W > 65) g.fillCircle(Math.floor(W * 0.50), H - 4, 4);
      } else if (t.weight >= 8) {
        // Buildings/landmarks: window grid
        g.fillStyle(0xffee88, 0.85);
        const cols = W > 80 ? 3 : 2;
        const rows = H > 100 ? 4 : 3;
        const cellW = Math.floor((W - 8) / cols);
        const cellH = Math.floor((H - 16) / rows);
        const winW = Math.max(3, cellW - 3);
        const winH = Math.max(3, cellH - 4);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            g.fillRect(4 + c * cellW + 1, 8 + r * cellH + 2, winW, winH);
          }
        }
      }

      g.generateTexture(`target_${key}`, W, H);
      g.destroy();
    });
  }

  _genPowerUps() {
    const S = 24;
    const defs = [
      { key: 'powerup_megabeam', color: 0x3399ff },
      { key: 'powerup_shield',   color: 0x44ffaa },
      { key: 'powerup_freeze',   color: 0x88eeff },
      { key: 'powerup_time',     color: 0xffdd00 },
      { key: 'powerup_gravity',  color: 0xcc44ff },
      { key: 'powerup_magnet',   color: 0xff4444 },
    ];

    defs.forEach(({ key, color }) => {
      const g = this.make.graphics({ add: false });
      const dark = this._darken(color, 0.5);

      // Outer glow ring
      g.fillStyle(color, 0.22);
      g.fillCircle(S / 2, S / 2, S / 2);

      // Border ring
      g.lineStyle(2, dark, 1);
      g.strokeCircle(S / 2, S / 2, S / 2 - 1);

      // Inner fill
      g.fillStyle(color, 1);
      g.fillCircle(S / 2, S / 2, S / 2 - 4);

      // Shine
      g.fillStyle(0xffffff, 0.55);
      g.fillCircle(S / 2 - 3, S / 2 - 3, 4);

      g.generateTexture(key, S, S);
      g.destroy();
    });
  }

  // ─── Color Helpers ─────────────────────────────────────────────────────────

  _darken(color, factor = 0.6) {
    const r = Math.floor(((color >> 16) & 0xff) * factor);
    const g = Math.floor(((color >> 8) & 0xff) * factor);
    const b = Math.floor((color & 0xff) * factor);
    return (r << 16) | (g << 8) | b;
  }

  _lighten(color, amount = 0.3) {
    const r = Math.min(255, Math.floor(((color >> 16) & 0xff) + 255 * amount));
    const g = Math.min(255, Math.floor(((color >> 8) & 0xff) + 255 * amount));
    const b = Math.min(255, Math.floor((color & 0xff) + 255 * amount));
    return (r << 16) | (g << 8) | b;
  }
}
