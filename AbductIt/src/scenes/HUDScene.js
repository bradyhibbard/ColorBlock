import Phaser from 'phaser';
import { BEAM_LEVELS } from '../data/Constants.js';

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
  }

  create() {
    const { width } = this.scale;

    // Semi-transparent top bar
    this.add.rectangle(width / 2, 28, width, 56, 0x000000, 0.55);

    // ── Score ────────────────────────────────────────────────────────────────
    this.add.text(14, 10, 'SCORE', {
      fontFamily: 'monospace', fontSize: '10px', color: '#446655',
    });
    this._scoreText = this.add.text(14, 22, '0', {
      fontFamily: 'monospace', fontSize: '22px', color: '#33ff99',
    });

    // ── Timer ────────────────────────────────────────────────────────────────
    this.add.text(width / 2, 8, 'TIME', {
      fontFamily: 'monospace', fontSize: '10px', color: '#446655',
    }).setOrigin(0.5, 0);
    this._timerText = this.add.text(width / 2, 20, '1:30', {
      fontFamily: 'monospace', fontSize: '24px', color: '#aaffcc',
    }).setOrigin(0.5, 0);

    // ── Beam level ───────────────────────────────────────────────────────────
    this._beamText = this.add.text(width - 14, 10, 'BEAM LV.1', {
      fontFamily: 'monospace', fontSize: '12px', color: '#66aaff',
    }).setOrigin(1, 0);

    // ── Lives (small coloured squares) ───────────────────────────────────────
    this._livesGfx = this.add.graphics().setDepth(2);

    // ── Energy bar (progress toward next beam level) ──────────────────────
    this._energyGfx = this.add.graphics().setDepth(3);
    this._barLeft   = (width - width * 0.68) / 2;
    this._barWidth  = width * 0.68;
  }

  update() {
    const gs = this.scene.get('GameScene');
    if (!gs || !gs.sys.isActive()) return;

    // Score
    this._scoreText.setText(`${gs._score}`);

    // Timer
    const secs = Math.max(0, Math.ceil(gs._timer));
    const m    = Math.floor(secs / 60);
    const s    = secs % 60;
    this._timerText.setText(`${m}:${s.toString().padStart(2, '0')}`);
    this._timerText.setColor(
      gs._timer <= 10 ? '#ff4444' : gs._timer <= 30 ? '#ffaa00' : '#aaffcc'
    );

    // Beam level
    const bl     = BEAM_LEVELS[gs.beamLevel] ?? BEAM_LEVELS[1];
    const blHex  = `#${bl.color.toString(16).padStart(6, '0')}`;
    this._beamText.setText(`BEAM LV.${gs.beamLevel}`);
    this._beamText.setColor(blHex);

    // Lives
    this._livesGfx.clear();
    const lvX = this.scale.width - 14;
    for (let i = 0; i < 3; i++) {
      this._livesGfx.fillStyle(i < gs._lives ? 0xff3366 : 0x333333, 1);
      this._livesGfx.fillRect(lvX - (i + 1) * 15, 36, 11, 11);
    }

    // Energy bar
    this._energyGfx.clear();
    const baseBl = BEAM_LEVELS[gs._baseBeamLevel];
    const pct    = gs._baseBeamLevel >= 10
      ? 1
      : Math.min(1, gs._energy / (baseBl?.energyNeeded ?? 1));
    const barFill = this._barWidth * pct;

    this._energyGfx.fillStyle(0x112211, 1);
    this._energyGfx.fillRect(this._barLeft, 53, this._barWidth, 5);

    if (barFill > 0) {
      const barColor = BEAM_LEVELS[gs._baseBeamLevel]?.color ?? 0x33ff99;
      this._energyGfx.fillStyle(barColor, 1);
      this._energyGfx.fillRect(this._barLeft, 53, barFill, 5);
    }
  }
}
