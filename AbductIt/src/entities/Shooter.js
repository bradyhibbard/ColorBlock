import Phaser from 'phaser';

export class Shooter {
  constructor(scene, x, y) {
    this.scene = scene; this.x = x; this.y = y;
    this.active = true;
    this._shootTimer = Phaser.Math.Between(2000, 5000);
    this._aimAngle = 0;
    this.sprite = scene.add.image(x, y, 'shooter').setDepth(7);
  }

  update(delta) {
    if (!this.active) return;
    const dx = this.scene.ufo.x - this.x;
    const dy = this.scene.ufo.y - this.y;
    this._aimAngle = Math.atan2(dy, dx);
    this.sprite.setRotation(this._aimAngle + Math.PI * 0.5);
    this._shootTimer -= delta;
    if (this._shootTimer <= 0) { this._shoot(); this._shootTimer = Phaser.Math.Between(2500, 5500); }
  }

  _shoot() {
    if (!this.active) return;
    const scene = this.scene;
    const bullet = scene.physics.add.image(this.x, this.y - 8, 'particle_exp');
    bullet.setScale(1.2).setTint(0xff6600).setDepth(8);
    scene.bullets.add(bullet);
    bullet.setVelocity(Math.cos(this._aimAngle) * 200, Math.sin(this._aimAngle) * 200);
  }

  destroy() { this.active = false; this.sprite.destroy(); }
}
