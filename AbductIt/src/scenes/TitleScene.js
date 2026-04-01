import Phaser from 'phaser';
import { COLORS } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.scale;
    this._w = width;
    this._h = height;

    this._createStarfield();
    this._createGround();
    this._createUFO();
    this._createTitle();
    this._createPlayButton();
    this._createSoundButton();

    audioManager.resume();
    audioManager.playWorldMusic(0);
  }

  // ─── Starfield ─────────────────────────────────────────────────────────────

  _createStarfield() {
    for (let i = 0; i < 90; i++) {
      const x = Phaser.Math.Between(0, this._w);
      const y = Phaser.Math.Between(0, this._h * 0.80);
      const sz = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 1.0);
      const star = this.add.rectangle(x, y, sz, sz, 0xffffff, alpha);
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.05, 0.2),
        duration: Phaser.Math.Between(700, 2800),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2500),
        ease: 'Sine.easeInOut',
      });
    }
  }

  // ─── Ground & Panicking Humans ─────────────────────────────────────────────

  _createGround() {
    const gY = this._h * 0.84;

    // Ground fill
    this.add.rectangle(this._w / 2, gY + 15, this._w, 30, COLORS.GROUND_COUNTRYSIDE);

    // Grass surface
    this.add.rectangle(this._w / 2, gY, this._w, 5, 0x44cc44);

    // Grass tufts
    let x = 8;
    while (x < this._w) {
      this.add.rectangle(x, gY - 4, 2, 7, 0x33aa33);
      x += Phaser.Math.Between(20, 44);
    }

    // Tiny running humans
    const humanColors = [0xffcc88, 0xff8866, 0xffdd99, 0xee9966, 0xffbb77, 0xffaa55];
    for (let i = 0; i < 6; i++) {
      const hx = Phaser.Math.Between(24, this._w - 24);
      const human = this.add.rectangle(hx, gY - 9, 5, 12, humanColors[i]);
      const dir = Math.random() < 0.5 ? 1 : -1;
      this.tweens.add({
        targets: human,
        x: hx + dir * Phaser.Math.Between(35, 90),
        duration: Phaser.Math.Between(1000, 2600),
        yoyo: true,
        repeat: -1,
        ease: 'Linear',
      });
    }
  }

  // ─── UFO & Beam ────────────────────────────────────────────────────────────

  _createUFO() {
    const ufo = this.add.image(this._w * 0.35, this._h * 0.44, 'ufo');
    ufo.setScale(1.6).setDepth(10);
    this._ufo = ufo;
    this._beam = this.add.graphics().setDepth(8);

    // Hover bob
    this.tweens.add({
      targets: ufo,
      y: ufo.y - 12,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Left-right patrol
    this.tweens.add({
      targets: ufo,
      x: this._w * 0.65,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ─── Title Text ────────────────────────────────────────────────────────────

  _createTitle() {
    // Semi-transparent panel behind title
    this.add.rectangle(this._w / 2, this._h * 0.185, this._w * 0.9, 72, 0x000000, 0.45).setDepth(5);

    // Main title
    this.add.text(this._w / 2, this._h * 0.155, 'ABDUCT IT!', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#33ff99',
      stroke: '#004422',
      strokeThickness: 5,
    }).setOrigin(0.5).setDepth(6);

    // Tagline
    this.add.text(this._w / 2, this._h * 0.234, 'B E A M   T H E M   U P', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#aaffcc',
    }).setOrigin(0.5).setDepth(6);
  }

  // ─── Play Button ───────────────────────────────────────────────────────────

  _createPlayButton() {
    const btnY = this._h * 0.67;
    const btnW = 220, btnH = 62;

    const bg = this.add.rectangle(this._w / 2, btnY, btnW, btnH, COLORS.UI_DARK)
      .setDepth(10)
      .setInteractive({ useHandCursor: true });
    bg.setStrokeStyle(2, COLORS.UI_BORDER);

    const label = this.add.text(this._w / 2, btnY, 'PLAY', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#33ff99',
    }).setOrigin(0.5).setDepth(11);

    this.add.text(this._w / 2, this._h * 0.748, 'TAP TO START', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#446655',
    }).setOrigin(0.5).setDepth(6);

    // Border pulse
    this.tweens.add({
      targets: bg,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 950,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    bg.on('pointerover', () => {
      bg.setFillColor(0x003322);
      label.setColor('#ffffff');
    });

    bg.on('pointerout', () => {
      bg.setFillColor(COLORS.UI_DARK);
      label.setColor('#33ff99');
    });

    bg.on('pointerdown', () => {
      audioManager.playButtonTap();
      label.setColor('#ffffff');
      this.time.delayedCall(220, () => {
        audioManager.stopMusic();
        this.scene.start('WorldMapScene');
      });
    });
  }

  // ─── Sound Toggle ──────────────────────────────────────────────────────────

  _createSoundButton() {
    const btnX = this._w - 46;
    const btnY = 36;
    const isMuted = SaveManager.data.muteAudio;

    const bg = this.add.rectangle(btnX, btnY, 76, 28, 0x001a0a)
      .setDepth(15)
      .setInteractive({ useHandCursor: true });
    bg.setStrokeStyle(1, COLORS.UI_BORDER);

    const label = this.add.text(btnX, btnY, isMuted ? 'SFX OFF' : 'SFX ON', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: isMuted ? '#446655' : '#33ff99',
    }).setOrigin(0.5).setDepth(16);

    bg.on('pointerdown', () => {
      const muted = !SaveManager.data.muteAudio;
      SaveManager.data.muteAudio = muted;
      SaveManager.save();
      audioManager.setMuted(muted);
      label.setText(muted ? 'SFX OFF' : 'SFX ON');
      label.setColor(muted ? '#446655' : '#33ff99');
      if (!muted) {
        audioManager.resume();
        audioManager.playWorldMusic(0);
      }
    });
  }

  // ─── Update (beam follows UFO each frame) ──────────────────────────────────

  update() {
    if (!this._ufo || !this._beam) return;
    const groundY = this._h * 0.84;
    const ux = this._ufo.x;
    const uy = this._ufo.y + 26;

    this._beam.clear();

    const bw = 38;
    // Wide outer beam (very faint)
    this._beam.fillStyle(0x3399ff, 0.05);
    this._beam.fillTriangle(ux - bw * 1.6, uy, ux + bw * 1.6, uy, ux, groundY);

    // Mid beam
    this._beam.fillStyle(0x3399ff, 0.13);
    this._beam.fillTriangle(ux - bw, uy, ux + bw, uy, ux, groundY);

    // Core beam
    this._beam.fillStyle(0x88ccff, 0.26);
    this._beam.fillTriangle(ux - bw * 0.38, uy, ux + bw * 0.38, uy, ux, groundY);
  }
}
