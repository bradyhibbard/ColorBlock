import Phaser from 'phaser';
import { BEAM_LEVELS, COLORS } from '../data/Constants.js';

export class HUDScene extends Phaser.Scene {
  constructor() { super({ key: 'HUDScene' }); }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this._graphics = this.add.graphics();

    this._livesText = this.add.text(16, 14, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ff4444',
    }).setDepth(500);

    this._scoreText = this.add.text(W / 2, 14, '0', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(500);

    this._timerText = this.add.text(W - 16, 14, '90', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#33ff99',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(1, 0).setDepth(500);

    const barY = 44;
    const barH = 14;
    const barW = W - 32;

    this._quotaLabel = this.add.text(16, barY - 16, 'ABDUCTION ENERGY', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#aaffdd',
    }).setDepth(500);

    this._barBg = this.add.graphics().setDepth(499);
    this._barBg.fillStyle(0x112233, 1);
    this._barBg.fillRoundedRect(16, barY, barW, barH, 4);
    this._barBg.lineStyle(1, 0x33ff99, 0.4);
    this._barBg.strokeRoundedRect(16, barY, barW, barH, 4);

    this._barFill = this.add.graphics().setDepth(500);
    this._barPulse = 0;

    this._quotaMarker = this.add.graphics().setDepth(501);

    const beamY = 68;

    this._beamLevelBg = this.add.graphics().setDepth(499);
    this._beamLevelBg.fillStyle(0x001a00, 0.9);
    this._beamLevelBg.fillRoundedRect(16, beamY, 180, 22, 4);

    this._beamIcon = this.add.graphics().setDepth(501);
    this._beamLevelText = this.add.text(30, beamY + 4, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#33ff99',
    }).setDepth(501);

    this._beamUpgradeBar = this.add.graphics().setDepth(500);

    this._comboText = this.add.text(W - 16, beamY + 4, '', {
      fontFamily: 'monospace',
      fontSize: '13px',
      color: '#ff8800',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(1, 0).setDepth(501);

    this._levelText = this.add.text(W / 2, barY - 16, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#aaaaaa',
    }).setOrigin(1, 0).setDepth(500).setX(W - 16).setOrigin(1, 0);
  }

  update() {
    if (!this.gameScene) return;
    const gs = this.gameScene;
    const W = this.scale.width;

    let livesStr = '';
    for (let i = 0; i < gs.lives; i++) livesStr += '* ';
    this._livesText.setText(livesStr.trim());

    this._scoreText.setText(gs.score.toLocaleString());

    const t = gs.timeLeft;
    this._timerText.setText(String(t).padStart(2, '0'));
    if (t <= 10) {
      this._timerText.setColor(Math.floor(t * 0.5) % 2 === 0 ? '#ff0000' : '#ffff00');
    } else if (t <= 30) {
      this._timerText.setColor('#ff8800');
    } else {
      this._timerText.setColor('#33ff99');
    }

    this._levelText.setText(`W${gs.worldId + 1}-L${gs.levelId + 1}`);

    const barW = W - 32;
    const barH = 14;
    const barY = 44;
    const progress = Math.min(gs.energyGained / gs.quota, 1);

    this._barFill.clear();
    this._barPulse += 0.05;
    const barColor = progress >= 1 ? 0x00ff88 : 0x33ff99;
    const pulseA = 0.7 + Math.sin(this._barPulse) * 0.2;

    this._barFill.fillStyle(barColor, pulseA);
    this._barFill.fillRoundedRect(16, barY, Math.max(4, barW * progress), barH, 4);

    const blvl = BEAM_LEVELS[gs.beamLevel] || BEAM_LEVELS[10];
    const nextLvl = BEAM_LEVELS[gs.beamLevel + 1];
    let upgradeProgress = 0;
    if (nextLvl) {
      const prev = gs.beamLevel > 1 ? BEAM_LEVELS[gs.beamLevel - 1].energyNeeded : 0;
      upgradeProgress = Math.min((gs.abductEnergy - prev) / (blvl.energyNeeded - prev), 1);
    }

    const beamY = 68;
    this._beamLevelText.setText(`* ${blvl.name}`);
    this._beamLevelText.setColor(`#${blvl.color.toString(16).padStart(6, '0')}`);

    this._beamUpgradeBar.clear();
    if (nextLvl) {
      this._beamUpgradeBar.fillStyle(0x002200, 1);
      this._beamUpgradeBar.fillRoundedRect(16, beamY + 16, 180, 4, 2);
      this._beamUpgradeBar.fillStyle(blvl.color, 0.8);
      this._beamUpgradeBar.fillRoundedRect(16, beamY + 16, 180 * upgradeProgress, 4, 2);
    }

    const combo = gs.comboCount;
    if (combo >= 2) {
      const mult = this._getComboMult(combo);
      this._comboText.setText(`x${mult.toFixed(1)} COMBO`);
      this._comboText.setVisible(true);
    } else {
      this._comboText.setVisible(false);
    }
  }

  _getComboMult(count) {
    if (count >= 8) return 3.0;
    if (count >= 5) return 2.5;
    if (count >= 3) return 2.0;
    if (count >= 2) return 1.5;
    return 1.0;
  }
}
