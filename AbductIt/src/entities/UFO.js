import Phaser from 'phaser';

export class UFO {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.speed = 260;
    this.friction = 0.88;
    this.beamActive = false;
    this.reeling = false;
    this.lockedTarget = null;
    this.sprite = scene.add.image(x, y, 'ufo').setDepth(10).setScale(1.1);
    this.glowGfx = scene.add.graphics().setDepth(9);
    this.minX = 32; this.maxX = scene.W - 32;
    this.minY = 30; this.maxY = scene._groundY - 30;
  }

  setInput(dx, dy) { this.inputDx = dx; this.inputDy = dy; }

  update(delta) {
    const dt = delta / 1000;
    const speed = this.reeling ? this.speed * 0.3 : this.speed;
    this.vx += (this.inputDx ?? 0) * speed * dt * 6;
    this.vy += (this.inputDy ?? 0) * speed * dt * 6;
    this.vx *= this.friction;
    this.vy *= this.friction;
    const maxV = speed * 0.85;
    const vel = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (vel > maxV) { this.vx = (this.vx / vel) * maxV; this.vy = (this.vy / vel) * maxV; }
    this.x = Phaser.Math.Clamp(this.x + this.vx * dt, this.minX, this.maxX);
    this.y = Phaser.Math.Clamp(this.y + this.vy * dt, this.minY, this.maxY);
    this.sprite.setPosition(this.x, this.y);
    const targetAngle = (this.vx / (this.speed * 0.85)) * 12;
    this.sprite.angle += (targetAngle - this.sprite.angle) * 0.15;
    this._updateGlow();
  }

  _updateGlow() {
    const g = this.glowGfx;
    g.clear();
    const pulse = (Math.sin(this.scene.time.now / 150) + 1) * 0.5;
    const glowA = this.beamActive ? 0.5 + pulse * 0.3 : 0.2 + pulse * 0.15;
    const glowColor = this.beamActive ? 0x33ff99 : 0x4488ff;
    g.fillStyle(glowColor, glowA * 0.4);
    g.fillEllipse(this.x, this.y + 18, 50, 12);
    g.fillStyle(glowColor, glowA * 0.6);
    g.fillEllipse(this.x, this.y + 18, 30, 8);
  }

  destroy() { this.sprite.destroy(); this.glowGfx.destroy(); }
}
