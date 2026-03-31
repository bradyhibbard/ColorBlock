import Phaser from 'phaser';
import { UFO } from '../entities/UFO.js';
import { Target } from '../entities/Target.js';
import { Shooter } from '../entities/Shooter.js';
import { PowerUp } from '../entities/PowerUp.js';
import { WORLDS, BEAM_LEVELS, TARGET_TYPES, COLORS } from '../data/Constants.js';
import { getLevelData } from '../data/LevelData.js';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.worldId  = data.worldId  ?? 0;
    this.levelId  = data.levelId  ?? 0;
    this.score    = data.score    ?? 0;
    this.lives    = data.lives    ?? 3;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;
    this.W = W;
    this.H = H;

    this.levelData = getLevelData(this.worldId, this.levelId + 1);
    this.world     = WORLDS[this.worldId];

    // State
    this.beamLevel     = 1;
    this.abductEnergy  = 0;
    this.energyNeeded  = BEAM_LEVELS[1].energyNeeded;
    this.quota         = this.levelData.quota;
    this.energyGained  = 0;
    this.timeLeft      = this.levelData.timeLimit;
    this.gameActive    = true;
    this.comboCount    = 0;
    this.comboTimer    = 0;
    this.maxCombo      = 0;
    this.abductCount   = 0;

    this._spawnTimer  = 0;
    this._spawnQ      = this._buildSpawnQueue();
    this._spawnIdx    = 0;

    this._buildBackground();

    this.targets   = this.add.group();
    this.shooters  = this.add.group();
    this.powerUps  = this.add.group();
    this.bullets   = this.physics.add.group();
    this.particles = this.add.particles(0, 0, 'particle_exp', {
      speed: { min: 30, max: 120 },
      lifespan: { min: 200, max: 600 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      gravityY: 100,
      emitting: false,
    });
    this.beamParticles = this.add.particles(0, 0, 'particle_beam', {
      speed: { min: 10, max: 40 },
      lifespan: { min: 150, max: 400 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.8, end: 0 },
      gravityY: -30,
      emitting: false,
    });

    this.ufo = new UFO(this, W / 2, H * 0.2);

    this._setupControls();

    this.beamGfx = this.add.graphics();
    this.beamGfx.setDepth(5);

    this.scene.launch('HUDScene', { gameScene: this });
    this.hud = this.scene.get('HUDScene');

    this._spawnInitialShooters();
    this._spawnNextTarget();

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this._onTick,
      callbackScope: this,
      loop: true,
    });

    audioManager.playWorldMusic(this.worldId);
    this._addCRT();
    this.cameras.main.fadeIn(300, 0, 0, 0);
    this._showLevelIntro();
  }

  _buildBackground() {
    const W = this.W, H = this.H;
    const world = this.world;

    const sky = this.add.graphics();
    const skyC = world.skyColor;
    sky.fillStyle(skyC, 1);
    sky.fillRect(0, 0, W, H);

    if (this.worldId === 2 || this.worldId === 6) {
      sky.fillStyle(0x110033, 1);
      sky.fillRect(0, 0, W, H);
      sky.fillStyle(0x1a0033, 1);
      for (let i = 0; i < 12; i++) {
        const bw = Phaser.Math.Between(20, 50);
        const bh = Phaser.Math.Between(H * 0.3, H * 0.7);
        sky.fillRect(i * (W / 10) - 10, H - bh - 60, bw, bh);
      }
    }

    if (this.worldId >= 2) {
      for (let i = 0; i < 60; i++) {
        this.add.image(
          Phaser.Math.Between(0, W),
          Phaser.Math.Between(0, H * 0.6),
          'star'
        ).setAlpha(Math.random() * 0.8 + 0.1);
      }
    }

    const groundH = 60;
    const groundY = H - groundH;
    const groundTex = `ground_${Math.min(this.worldId, 6)}`;
    this._groundY = groundY;

    const tilesNeeded = Math.ceil(W / 64) + 2;
    this._groundTiles = [];
    for (let i = 0; i < tilesNeeded; i++) {
      const tile = this.add.image(i * 64, groundY, groundTex)
        .setOrigin(0, 0)
        .setDisplaySize(64, groundH);
      this._groundTiles.push(tile);
    }

    const gfx = this.add.graphics();
    gfx.fillStyle(world.groundColor, 1);
    gfx.fillRect(0, groundY + groundH - 4, W, 4);
    gfx.setDepth(3);
  }

  _setupControls() {
    const W = this.W, H = this.H;

    this._joystickActive = false;
    this._joystickOrigin = { x: 0, y: 0 };
    this._joystickDelta  = { x: 0, y: 0 };

    const leftZone = this.add.zone(0, 0, W * 0.55, H).setOrigin(0, 0).setInteractive();
    const rightZone = this.add.zone(W * 0.55, 0, W * 0.45, H).setOrigin(0, 0).setInteractive();

    rightZone.setDepth(100);
    leftZone.setDepth(100);

    this._beamBtnGfx = this.add.graphics().setDepth(50);
    this._drawBeamButton(false);

    this._joyBaseGfx  = this.add.graphics().setDepth(50).setAlpha(0.4);
    this._joyThumbGfx = this.add.graphics().setDepth(51).setAlpha(0.6);

    leftZone.on('pointerdown', (ptr) => this._joyStart(ptr));
    leftZone.on('pointermove', (ptr) => this._joyMove(ptr));
    leftZone.on('pointerup',   ()    => this._joyEnd());
    leftZone.on('pointerout',  ()    => this._joyEnd());

    rightZone.on('pointerdown', () => { this.ufo.beamActive = true; this._drawBeamButton(true); });
    rightZone.on('pointerup',   () => { this.ufo.beamActive = false; this._drawBeamButton(false); });
    rightZone.on('pointerout',  () => { this.ufo.beamActive = false; this._drawBeamButton(false); });
  }

  _drawBeamButton(active) {
    const W = this.W, H = this.H;
    const g = this._beamBtnGfx;
    g.clear();
    const bx = W * 0.78, by = H * 0.82;
    const r = Math.min(W * 0.1, 42);

    g.fillStyle(active ? 0x33ff99 : 0x113322, 0.85);
    g.fillCircle(bx, by, r);
    g.lineStyle(3, active ? 0xffffff : 0x33ff99, 1);
    g.strokeCircle(bx, by, r);

    g.fillStyle(active ? 0x001a00 : 0x33ff99, 1);
    g.fillTriangle(bx, by + r * 0.5, bx - r * 0.4, by - r * 0.3, bx + r * 0.4, by - r * 0.3);

    if (!this._beamBtnLabel) {
      this._beamBtnLabel = this.add.text(bx, by + r + 12, 'BEAM', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#33ff99',
      }).setOrigin(0.5).setDepth(51);
    }
  }

  _joyStart(ptr) {
    this._joystickActive = true;
    this._joystickOrigin = { x: ptr.x, y: ptr.y };
    this._joystickDelta  = { x: 0, y: 0 };

    this._joyBaseGfx.clear();
    this._joyBaseGfx.lineStyle(2, 0x33ff99, 0.5);
    this._joyBaseGfx.strokeCircle(ptr.x, ptr.y, 48);

    this._joyThumbGfx.clear();
    this._joyThumbGfx.fillStyle(0x33ff99, 0.6);
    this._joyThumbGfx.fillCircle(ptr.x, ptr.y, 20);
  }

  _joyMove(ptr) {
    if (!this._joystickActive) return;
    const dx = ptr.x - this._joystickOrigin.x;
    const dy = ptr.y - this._joystickOrigin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 48;
    const clamped = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    const tx = this._joystickOrigin.x + Math.cos(angle) * clamped;
    const ty = this._joystickOrigin.y + Math.sin(angle) * clamped;

    this._joystickDelta = {
      x: Math.cos(angle) * (clamped / maxDist),
      y: Math.sin(angle) * (clamped / maxDist),
    };

    this._joyThumbGfx.clear();
    this._joyThumbGfx.fillStyle(0x33ff99, 0.6);
    this._joyThumbGfx.fillCircle(tx, ty, 20);
  }

  _joyEnd() {
    this._joystickActive = false;
    this._joystickDelta  = { x: 0, y: 0 };
    this._joyBaseGfx.clear();
    this._joyThumbGfx.clear();
  }

  _showLevelIntro() {
    const W = this.W, H = this.H;
    const container = this.add.container(W / 2, H / 2).setDepth(200);

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.75);
    bg.fillRoundedRect(-160, -50, 320, 100, 12);
    container.add(bg);

    const worldText = this.add.text(0, -24, `WORLD ${this.worldId + 1} - ${this.world.name}`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#33ff99',
    }).setOrigin(0.5);
    container.add(worldText);

    const levelText = this.add.text(0, 4, `LEVEL ${this.levelId + 1}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(levelText);

    const quotaText = this.add.text(0, 34, `QUOTA: ${this.quota} ENERGY`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#aaffdd',
    }).setOrigin(0.5);
    container.add(quotaText);

    this.tweens.add({
      targets: container,
      alpha: { from: 0, to: 1 },
      duration: 400,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({ targets: container, alpha: 0, duration: 400,
            onComplete: () => container.destroy() });
        });
      },
    });
  }

  _buildSpawnQueue() {
    const queue = [];
    this.levelData.targets.forEach(cfg => {
      for (let i = 0; i < cfg.count; i++) queue.push(cfg.type);
    });
    return Phaser.Utils.Array.Shuffle(queue);
  }

  _spawnNextTarget() {
    if (!this.gameActive) return;
    if (this._spawnIdx >= this._spawnQ.length) {
      this._spawnQ = this._buildSpawnQueue();
      this._spawnIdx = 0;
    }
    const type = this._spawnQ[this._spawnIdx++];
    const typeDef = TARGET_TYPES[type];

    const x = Phaser.Math.Between(this.W * 0.05, this.W * 0.95);
    const y = this._groundY - typeDef.h / 2;

    const target = new Target(this, x, y, type);
    this.targets.add(target);

    const interval = this.levelData.spawnInterval + Phaser.Math.Between(-500, 500);
    this.time.delayedCall(Math.max(1500, interval), () => this._spawnNextTarget());
  }

  _spawnInitialShooters() {
    const count = this.levelData.enemyShooters || 0;
    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(40, this.W - 40);
      const y = this._groundY - 14;
      const shooter = new Shooter(this, x, y);
      this.shooters.add(shooter);
    }
  }

  _onTick() {
    if (!this.gameActive) return;
    this.timeLeft--;
    if (this.timeLeft <= 0) {
      this._failLevel();
    }
  }

  update(time, delta) {
    if (!this.gameActive) return;

    this.ufo.setInput(this._joystickDelta.x, this._joystickDelta.y);
    this.ufo.update(delta);

    this.targets.getChildren().forEach(t => t.update(delta));
    this.shooters.getChildren().forEach(s => s.update(delta));
    this.powerUps.getChildren().forEach(p => p.update(delta));

    this.bullets.getChildren().forEach(bullet => {
      if (!bullet.active) return;
      const dist = Phaser.Math.Distance.Between(
        bullet.x, bullet.y, this.ufo.x, this.ufo.y
      );
      if (dist < 24) {
        bullet.destroy();
        this._hitUFO();
      }
      if (bullet.y < -20 || bullet.x < -20 || bullet.x > this.W + 20) {
        bullet.destroy();
      }
    });

    this._updateBeam(delta);

    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    this._groundTiles.forEach(tile => {
      tile.x -= 0.3;
      if (tile.x + 64 < 0) tile.x += (Math.ceil(this.W / 64) + 2) * 64;
    });
  }

  _updateBeam(delta) {
    const g = this.beamGfx;
    g.clear();

    const ufoX = this.ufo.x;
    const ufoY = this.ufo.y + 20;
    const beamLevel = BEAM_LEVELS[this.beamLevel];

    if (!this.ufo.beamActive) {
      this.ufo.reeling = false;
      this.ufo.lockedTarget = null;
      return;
    }

    const beamW = beamLevel.width;
    const beamH = this.H - ufoY - 60;
    const beamColor = beamLevel.color;

    g.fillStyle(beamColor, 0.08);
    g.fillTriangle(
      ufoX, ufoY,
      ufoX - beamW * 0.8, ufoY + beamH,
      ufoX + beamW * 0.8, ufoY + beamH
    );

    g.fillStyle(beamColor, 0.2);
    g.fillTriangle(
      ufoX, ufoY,
      ufoX - beamW / 2, ufoY + beamH,
      ufoX + beamW / 2, ufoY + beamH
    );

    g.fillStyle(beamColor, 0.45);
    g.fillTriangle(
      ufoX, ufoY,
      ufoX - beamW * 0.2, ufoY + beamH,
      ufoX + beamW * 0.2, ufoY + beamH
    );

    const pulse = (Math.sin(this.time.now / 120) + 1) * 0.5;
    g.lineStyle(1, beamColor, 0.3 + pulse * 0.3);
    for (let i = 1; i <= 3; i++) {
      const py = ufoY + beamH * (i / 4);
      const pw = beamW * (i / 4) * 0.5;
      g.strokeRect(ufoX - pw, py - 1, pw * 2, 2);
    }

    let nearest = null;
    let nearestDist = Infinity;

    this.targets.getChildren().forEach(target => {
      if (!target.active || target.abducted) return;
      const typeDef = TARGET_TYPES[target.targetType];
      if (typeDef.weight > this.beamLevel) return;

      const tx = target.x;
      const ty = target.y;
      const dx = tx - ufoX;
      const dy = ty - ufoY;
      if (dy < 0) return;
      const beamHalfW = beamW / 2 * (dy / beamH);
      if (Math.abs(dx) > beamHalfW) return;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearest = target;
        nearestDist = dist;
      }
    });

    if (nearest && !this.ufo.reeling) {
      this.ufo.lockedTarget = nearest;

      g.lineStyle(2, 0xffff00, 0.8);
      g.strokeRect(nearest.x - nearest.displayWidth / 2 - 3,
                   nearest.y - nearest.displayHeight / 2 - 3,
                   nearest.displayWidth + 6,
                   nearest.displayHeight + 6);

      this.ufo.reeling = true;
      nearest.startReel();
    } else if (!nearest) {
      this.ufo.lockedTarget = null;
      this.ufo.reeling = false;
    }

    if (this.ufo.reeling && this.ufo.lockedTarget) {
      const t = this.ufo.lockedTarget;
      const speed = 180 + this.beamLevel * 30;

      t.y -= speed * (delta / 1000);
      t.x += (ufoX - t.x) * 0.1;

      if (Math.random() < 0.4) {
        this.beamParticles.emitParticleAt(
          t.x + Phaser.Math.Between(-10, 10),
          t.y + Phaser.Math.Between(-5, 5)
        );
      }

      if (t.y <= ufoY + 10) {
        this._collectTarget(t);
      }
    }
  }

  _collectTarget(target) {
    if (!target || !target.active) return;

    const typeDef = TARGET_TYPES[target.targetType];
    const energy  = typeDef.energy;
    const points  = typeDef.points;

    this.comboCount++;
    this.comboTimer = 5000;
    if (this.comboCount > this.maxCombo) this.maxCombo = this.comboCount;
    const comboMult = this._getComboMult();

    const earned = Math.round(points * comboMult);
    this.score += earned;

    this.energyGained += energy;
    this.abductEnergy += energy;
    this.abductCount++;
    SaveManager.addAbductions(1);

    this.particles.emitParticleAt(target.x, target.y, 12);
    audioManager.playAbduction();

    this._showFloatingText(target.x, target.y, `+${earned}`, '#ffdd00');
    if (comboMult > 1) {
      this._showFloatingText(target.x, target.y - 24, `x${comboMult.toFixed(1)} COMBO!`, '#ff8800');
    }

    this._showFloatingText(this.W / 2, this.H * 0.45, typeDef.label, '#aaffdd');

    target.destroy();
    this.ufo.reeling = false;
    this.ufo.lockedTarget = null;

    this._checkBeamUpgrade();

    if (this.energyGained >= this.quota) {
      this._completeLevel();
    }
  }

  _getComboMult() {
    if (this.comboCount >= 8) return 3.0;
    if (this.comboCount >= 5) return 2.5;
    if (this.comboCount >= 3) return 2.0;
    if (this.comboCount >= 2) return 1.5;
    return 1.0;
  }

  _checkBeamUpgrade() {
    if (this.beamLevel >= 10) return;
    const nextLevel = this.beamLevel + 1;
    if (this.abductEnergy >= BEAM_LEVELS[this.beamLevel].energyNeeded) {
      this.beamLevel = nextLevel;
      this.energyNeeded = BEAM_LEVELS[nextLevel]?.energyNeeded ?? 99999;
      audioManager.playBeamUpgrade();
      this._showLevelUpBanner(BEAM_LEVELS[nextLevel - 1].name, nextLevel - 1, BEAM_LEVELS[nextLevel].name, nextLevel);
    }
  }

  _showLevelUpBanner(oldName, oldLvl, newName, newLvl) {
    const W = this.W, H = this.H;
    const container = this.add.container(W / 2, H * 0.4).setDepth(300);

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.85);
    bg.fillRoundedRect(-180, -44, 360, 88, 14);
    bg.lineStyle(3, 0xffdd00, 1);
    bg.strokeRoundedRect(-180, -44, 360, 88, 14);
    container.add(bg);

    container.add(this.add.text(0, -26, 'BEAM UPGRADED!', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffdd00',
      fontStyle: 'bold',
    }).setOrigin(0.5));

    container.add(this.add.text(0, 4, `-> ${newName} (Lv.${newLvl})`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#33ff99',
    }).setOrigin(0.5));

    container.add(this.add.text(0, 26, 'Now abducting heavier objects!', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#aaffdd',
    }).setOrigin(0.5));

    this.tweens.add({
      targets: container,
      scaleX: { from: 0.2, to: 1 },
      scaleY: { from: 0.2, to: 1 },
      alpha:  { from: 0, to: 1 },
      duration: 300,
      ease: 'Back.out',
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: container,
            alpha: 0,
            y: container.y - 30,
            duration: 400,
            onComplete: () => container.destroy(),
          });
        });
      },
    });
  }

  _hitUFO() {
    if (!this.gameActive) return;
    audioManager.playDamage();
    this.cameras.main.shake(200, 0.01);
    this.cameras.main.flash(100, 255, 0, 0, false);

    this.lives--;
    this.comboCount = 0;

    if (this.ufo.reeling && this.ufo.lockedTarget) {
      const t = this.ufo.lockedTarget;
      if (t && t.active) {
        this.tweens.add({
          targets: t,
          y: this._groundY - TARGET_TYPES[t.targetType].h / 2,
          duration: 600,
          ease: 'Bounce.out',
        });
        t.abducted = false;
      }
      this.ufo.reeling = false;
      this.ufo.lockedTarget = null;
    }

    if (this.lives <= 0) {
      this._gameOver();
    }
  }

  _completeLevel() {
    if (!this.gameActive) return;
    this.gameActive = false;
    this.timerEvent.remove();
    audioManager.stopMusic();
    audioManager.playLevelClear();

    const timeBonus = this.timeLeft * 20;
    this.score += timeBonus;

    SaveManager.updateHighScore(this.worldId, this.levelId + 1, this.score);
    SaveManager.setLevelProgress(this.worldId, this.levelId + 1);

    if (this.levelId + 1 >= 10 && this.worldId + 1 < WORLDS.length) {
      SaveManager.unlockWorld(this.worldId + 1);
    }

    SaveManager.save();

    this.cameras.main.fadeOut(600, 255, 255, 255);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('HUDScene');
      this.scene.start('LevelClearScene', {
        worldId:   this.worldId,
        levelId:   this.levelId,
        score:     this.score,
        timeBonus,
        timeLeft:  this.timeLeft,
        lives:     this.lives,
        maxCombo:  this.maxCombo,
        abducted:  this.abductCount,
      });
    });
  }

  _failLevel() {
    if (!this.gameActive) return;
    this.gameActive = false;
    this.timerEvent.remove();
    audioManager.stopMusic();

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene', {
        worldId: this.worldId,
        levelId: this.levelId,
        score:   this.score,
        reason:  'TIME',
      });
    });
  }

  _gameOver() {
    if (!this.gameActive) return;
    this.gameActive = false;
    this.timerEvent.remove();
    audioManager.stopMusic();
    audioManager.playGameOver();

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene', {
        worldId: this.worldId,
        levelId: this.levelId,
        score:   this.score,
        reason:  'LIVES',
      });
    });
  }

  _showFloatingText(x, y, text, color) {
    const t = this.add.text(x, y, text, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(200);

    this.tweens.add({
      targets: t,
      y: y - 60,
      alpha: { from: 1, to: 0 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => t.destroy(),
    });
  }

  _addCRT() {
    const W = this.W, H = this.H;
    const crt = this.add.graphics().setDepth(999);
    crt.fillStyle(0x000000, 0.1);
    for (let y = 0; y < H; y += 3) crt.fillRect(0, y, W, 1);
  }
}
