import Phaser from 'phaser';

const POWERUP_TYPES = {
  megabeam: { label: 'MEGA BEAM',    color: 0xffdd00, duration: 8000 },
  shield:   { label: 'SHIELD',       color: 0x4488ff, duration: 10000 },
  freeze:   { label: 'FREEZE',       color: 0x88ddff, duration: 4000 },
  time:     { label: 'TIME +20s',    color: 0xffcc44, duration: 0 },
  gravity:  { label: 'GRAVITY BOMB', color: 0xff3366, duration: 5000 },
  magnet:   { label: 'MAGNET',       color: 0xff4444, duration: 6000 },
};

export class PowerUp {
  constructor(scene, x, y, type) {
    this.scene = scene; this.type = type;
    this.x = x; this.y = y; this.active = true;
    this._bobTimer = 0; this._baseY = y;
    const def = POWERUP_TYPES[type] || POWERUP_TYPES.megabeam;
    this.sprite = scene.add.image(x, y, `powerup_${type}`).setDepth(12).setScale(2);
    this._glow = scene.add.graphics().setDepth(11);
    this._glow.lineStyle(2, def.color, 0.6);
    this._glow.strokeCircle(x, y, 18);
    this._label = scene.add.text(x, y - 26, def.label, {
      fontFamily: 'monospace', fontSize: '9px',
      color: `#${def.color.toString(16).padStart(6, '0')}`,
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(13);
    scene.tweens.add({ targets: [this.sprite, this._glow], alpha: { from: 1, to: 0.5 }, duration: 600, yoyo: true, repeat: -1 });
  }

  update(delta) {
    if (!this.active) return;
    this._bobTimer += delta;
    this.y = this._baseY + Math.sin(this._bobTimer / 400) * 5;
    this.sprite.setPosition(this.x, this.y);
    this._label.setPosition(this.x, this.y - 26);
    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.scene.ufo.x, this.scene.ufo.y);
    if (dist < 36) this._collect();
  }

  _collect() {
    if (!this.active) return;
    this.active = false;
    this.scene._applyPowerUp?.(this.type);
    this.destroy();
  }

  destroy() {
    this.active = false;
    this.sprite.destroy();
    this._glow.destroy();
    this._label.destroy();
  }
}
