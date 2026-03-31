import Phaser from 'phaser';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';
import { COLORS } from '../data/Constants.js';

export class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    audioManager.resume();

    // Starfield background
    this._starfield = [];
    for (let i = 0; i < 80; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        'star'
      );
      star.setAlpha(Math.random() * 0.8 + 0.2);
      star.speed = Math.random() * 0.3 + 0.1;
      this._starfield.push(star);
    }

    // Deep space gradient bg
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000011, 0x000011, 0x0a0022, 0x0a0022, 1);
    bg.fillRect(0, 0, W, H);
    bg.setDepth(-1);

    // UFO flying across
    this._ufo = this.add.image(W * 0.5, H * 0.3, 'ufo');
    this._ufo.setScale(1.5);
    this.tweens.add({
      targets: this._ufo,
      x: { from: -80, to: W + 80 },
      y: { from: H * 0.25, to: H * 0.35 },
      duration: 6000,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Beam pulsing below UFO
    this._beam = this.add.graphics();
    this._beamTimer = 0;

    // Title text
    const titleStyle = {
      fontFamily: 'monospace',
      fontSize: `${Math.min(W * 0.16, 60)}px`,
      color: '#33ff99',
      stroke: '#003322',
      strokeThickness: 6,
      shadow: { offsetX: 3, offsetY: 3, color: '#003322', blur: 0, fill: true },
    };
    const title = this.add.text(W / 2, H * 0.52, 'ABDUCT IT!', titleStyle)
      .setOrigin(0.5);

    // Subtitle
    this.add.text(W / 2, H * 0.62, 'THE GALAXY NEEDS YOUR STUFF', {
      fontFamily: 'monospace',
      fontSize: `${Math.min(W * 0.04, 16)}px`,
      color: '#aaffdd',
    }).setOrigin(0.5);

    // Pulse title
    this.tweens.add({
      targets: title,
      scaleX: { from: 1, to: 1.04 },
      scaleY: { from: 1, to: 1.04 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Start button
    const btnW = Math.min(W * 0.6, 240);
    const btnH = 60;
    const btnX = W / 2;
    const btnY = H * 0.76;

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x22cc66, 1);
    btnBg.fillRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);
    btnBg.lineStyle(3, 0x33ff99, 1);
    btnBg.strokeRoundedRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH, 12);

    const btnText = this.add.text(btnX, btnY, 'TAP TO ABDUCT', {
      fontFamily: 'monospace',
      fontSize: `${Math.min(W * 0.055, 22)}px`,
      color: '#ffffff',
      stroke: '#004422',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Blink start button
    this.tweens.add({
      targets: [btnBg, btnText],
      alpha: { from: 1, to: 0.3 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    // High score
    const topScore = this._getTopScore();
    if (topScore > 0) {
      this.add.text(W / 2, H * 0.88, `BEST: ${topScore.toLocaleString()}`, {
        fontFamily: 'monospace',
        fontSize: `${Math.min(W * 0.04, 15)}px`,
        color: '#ffdd00',
      }).setOrigin(0.5);
    }

    // Version
    this.add.text(W - 8, H - 8, 'v1.0', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#334433',
    }).setOrigin(1, 1);

    // CRT overlay
    this._addCRT();

    // Input
    this.input.once('pointerdown', () => {
      audioManager.resume();
      audioManager.init();
      audioManager.playButtonTap();
      this._transitionToGame();
    });

    // Play title music
    audioManager.playWorldMusic(0);
  }

  update(time, delta) {
    // Scroll stars
    this._starfield.forEach(star => {
      star.x -= star.speed;
      if (star.x < -2) star.x = this.scale.width + 2;
    });

    // Animate beam under UFO
    this._beamTimer += delta;
    this._beam.clear();
    const alpha = 0.2 + Math.sin(this._beamTimer / 300) * 0.15;
    const ufoX = this._ufo.x;
    const ufoY = this._ufo.y + 18;
    const beamH = 60 + Math.sin(this._beamTimer / 200) * 20;
    this._beam.fillStyle(0x33aaff, alpha);
    this._beam.fillTriangle(
      ufoX - 18, ufoY,
      ufoX + 18, ufoY,
      ufoX + 30, ufoY + beamH,
    );
    this._beam.fillTriangle(
      ufoX - 18, ufoY,
      ufoX - 30, ufoY + beamH,
      ufoX + 30, ufoY + beamH,
    );
  }

  _transitionToGame() {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('WorldMapScene');
    });
  }

  _getTopScore() {
    let best = 0;
    Object.values(SaveManager.data.highScores).forEach(s => {
      if (s > best) best = s;
    });
    return best;
  }

  _addCRT() {
    const W = this.scale.width;
    const H = this.scale.height;
    const crt = this.add.graphics();
    crt.setDepth(1000);
    // Scanlines
    crt.fillStyle(0x000000, 0.12);
    for (let y = 0; y < H; y += 3) crt.fillRect(0, y, W, 1);
    // Vignette
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * 0.4;
      crt.fillStyle(0x000000, a * 0.5);
      crt.fillRect(0, 0, i * 3, H);
      crt.fillRect(W - i * 3, 0, i * 3, H);
      crt.fillRect(0, 0, W, i * 3);
      crt.fillRect(0, H - i * 3, W, i * 3);
    }
  }
}
