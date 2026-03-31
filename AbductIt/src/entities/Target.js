import Phaser from 'phaser';
import { TARGET_TYPES } from '../data/Constants.js';

export class Target {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.targetType = type;
    this.abducted = false;
    this._walkDir = Math.random() < 0.5 ? 1 : -1;
    this._walkTimer = 0;
    this._walkSpeed = Phaser.Math.Between(20, 60);
    const def = TARGET_TYPES[type];
    this.x = x; this.y = y;
    const liftable = def.weight <= scene.beamLevel;
    this.sprite = scene.add.image(x, y, `target_${type}`).setDepth(6);
    this.sprite.setDisplaySize(def.w, def.h);
    this.displayWidth = def.w;
    this.displayHeight = def.h;
    if (!liftable) { this.sprite.setTint(0x555555); this.sprite.setAlpha(0.55); }
    if (!liftable) {
      this._lockLabel = scene.add.text(x, y - def.h / 2 - 14, `Lv.${def.weight}`, {
        fontFamily: 'monospace', fontSize: '9px', color: '#ff6633',
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(7).setAlpha(0.8);
    }
    this.sprite.setScale(0);
    scene.tweens.add({ targets: this.sprite, scaleX: 1, scaleY: 1, duration: 300, ease: 'Back.out' });
    this._shadow = scene.add.graphics().setDepth(5);
    this._drawShadow();
    this._active = true;
  }

  get active() { return this._active; }
  set active(v) { this._active = v; }
  startReel() { this.abducted = true; }

  _drawShadow() {
    this._shadow.clear();
    const def = TARGET_TYPES[this.targetType];
    this._shadow.fillStyle(0x000000, 0.25);
    this._shadow.fillEllipse(this.x, this.scene._groundY, def.w * 0.6, 8);
  }

  update(delta) {
    if (!this.active || this.abducted) return;
    const def = TARGET_TYPES[this.targetType];
    const liftable = def.weight <= this.scene.beamLevel;
    if (liftable && this.sprite.tintTopLeft !== 0xffffff) {
      this.sprite.clearTint(); this.sprite.setAlpha(1);
      if (this._lockLabel) { this._lockLabel.destroy(); this._lockLabel = null; }
    }
    if (def.weight <= 3) {
      this._walkTimer += delta;
      if (this._walkTimer > Phaser.Math.Between(2000, 4000)) { this._walkDir *= -1; this._walkTimer = 0; }
      this.x += this._walkDir * this._walkSpeed * (delta / 1000);
      this.x = Phaser.Math.Clamp(this.x, 30, this.scene.W - 30);
    }
    if (def.weight <= 2) {
      this.y = this.scene._groundY - def.h / 2 + Math.sin(this.scene.time.now / 400 + this.x) * 2;
    }
    this.sprite.setPosition(this.x, this.y);
    if (this._lockLabel) this._lockLabel.setPosition(this.x, this.y - def.h / 2 - 14);
    this._drawShadow();
  }

  destroy() {
    this._active = false;
    this.sprite.destroy();
    this._shadow.destroy();
    if (this._lockLabel) this._lockLabel.destroy();
  }
}
