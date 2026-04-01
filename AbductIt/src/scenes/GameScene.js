import Phaser from 'phaser';
import { COLORS, WORLDS, TARGET_TYPES, BEAM_LEVELS } from '../data/Constants.js';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';
import { UFO } from '../entities/UFO.js';
import { Target } from '../entities/Target.js';
import { Shooter } from '../entities/Shooter.js';
import { PowerUp } from '../entities/PowerUp.js';

const LEVEL_TIME       = 90;       // seconds per level
const MAX_TARGETS      = 8;
const REEL_BASE_SPEED  = 115;      // px/s base reel speed
const BEAM_SCAN_TICK   = 1200;     // ms between scan sounds
const PU_INTERVAL_MIN  = 14000;    // ms min between power-up spawns
const PU_INTERVAL_MAX  = 24000;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.worldId = data.worldId ?? 0;
    this.level   = data.level   ?? 1;
  }

  create() {
    const { width, height } = this.scale;

    // ── Public properties read by entity classes ─────────────────────────────
    this.W         = width;
    this._groundY  = height * 0.82;
    this.beamLevel = 1;            // effective beam level (read by Target)
    this.ufo       = null;         // set below (read by Shooter, PowerUp)
    this.bullets   = this.physics.add.group();  // read by Shooter

    // ── Game state ───────────────────────────────────────────────────────────
    this._score          = 0;
    this._energy         = 0;
    this._lives          = 3;
    this._timer          = LEVEL_TIME;
    this._combo          = 0;
    this._baseBeamLevel  = 1;
    this._gameOver       = false;
    this._levelCleared   = false;
    this._invincibleTimer = 0;

    // ── Beam state ───────────────────────────────────────────────────────────
    this._beamOn         = false;
    this._kbBeam         = false;
    this._touchBeamOn    = false;
    this._lockedTarget   = null;
    this._beamScanTimer  = 0;

    // ── Power-up state ───────────────────────────────────────────────────────
    this._shielded       = false;
    this._megabeamTimer  = 0;
    this._frozenTimer    = 0;
    this._magnetTimer    = 0;
    this._puSpawnTimer   = Phaser.Math.Between(PU_INTERVAL_MIN, PU_INTERVAL_MAX);

    // ── Touch tracking ───────────────────────────────────────────────────────
    this._movePointerId  = null;
    this._beamPointerId  = null;
    this._moveOrigin     = { x: 0, y: 0 };
    this._touchInput     = { dx: 0, dy: 0 };

    // ── Entity arrays ────────────────────────────────────────────────────────
    this._targets  = [];
    this._shooters = [];
    this._powerUps = [];

    this._buildWorld();
    this._buildUFO();
    this._buildInput();

    // Spawn initial targets and shooters
    const tCount = Math.min(4 + this.level, MAX_TARGETS);
    for (let i = 0; i < tCount; i++) this._spawnTarget();

    const sCount = Math.max(0, Math.min(this.level - 1, 4));
    for (let i = 0; i < sCount; i++) this._spawnShooter();

    // ── Drawing layers ───────────────────────────────────────────────────────
    this._beamGfx      = this.add.graphics().setDepth(9);
    this._joystickGfx  = this.add.graphics().setDepth(30);
    this._beamBtnGfx   = this.add.graphics().setDepth(25);
    this._beamBtnLabel = this.add.text(
      width * 0.78, height * 0.88, 'BEAM',
      { fontFamily: 'monospace', fontSize: '18px', color: '#224433' }
    ).setOrigin(0.5).setDepth(26);

    this.scene.launch('HUDScene');
    audioManager.resume();
    audioManager.playWorldMusic(this.worldId);
  }

  // ─── World Setup ───────────────────────────────────────────────────────────

  _buildWorld() {
    const { width, height } = this.scale;
    const world = WORLDS[this.worldId] ?? WORLDS[0];

    this.add.rectangle(width / 2, height / 2, width, height, world.skyColor);

    // Stars for dark sky worlds
    if (world.skyColor < 0x555566) {
      for (let i = 0; i < 60; i++) {
        this.add.rectangle(
          Phaser.Math.Between(0, width),
          Phaser.Math.Between(0, this._groundY * 0.95),
          Phaser.Math.Between(1, 2), Phaser.Math.Between(1, 2),
          0xffffff, Phaser.Math.FloatBetween(0.2, 0.85)
        );
      }
    }

    // Ground
    this.add.rectangle(width / 2, this._groundY + 20, width, 40, world.groundColor);
    this.add.rectangle(width / 2, this._groundY, width, 3, 0xffffff, 0.08);

    // Level info text (fades out)
    const info = this.add.text(width / 2, height * 0.12,
      `${world.name.toUpperCase()}  —  LEVEL ${this.level}`,
      { fontFamily: 'monospace', fontSize: '13px', color: '#557766' }
    ).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: info, alpha: 0, delay: 2500, duration: 800,
      onComplete: () => info.destroy() });
  }

  _buildUFO() {
    this.ufo = new UFO(this, this.W / 2, this._groundY * 0.28);
    this.ufo.setInput(0, 0);
  }

  // ─── Input Setup ───────────────────────────────────────────────────────────

  _buildInput() {
    this.input.on('pointerdown', this._onPointerDown, this);
    this.input.on('pointermove', this._onPointerMove, this);
    this.input.on('pointerup',   this._onPointerUp,   this);

    this._cursors  = this.input.keyboard.createCursorKeys();
    this._wasd     = this.input.keyboard.addKeys('W,A,S,D');
    this._spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  _onPointerDown(ptr) {
    if (ptr.x < this.W / 2) {
      if (this._movePointerId === null) {
        this._movePointerId = ptr.id;
        this._moveOrigin    = { x: ptr.x, y: ptr.y };
        this._touchInput    = { dx: 0, dy: 0 };
      }
    } else {
      if (this._beamPointerId === null) {
        this._beamPointerId = ptr.id;
        this._touchBeamOn   = true;
      }
    }
  }

  _onPointerMove(ptr) {
    if (ptr.id !== this._movePointerId) return;
    const dx  = (ptr.x - this._moveOrigin.x) / 55;
    const dy  = (ptr.y - this._moveOrigin.y) / 55;
    const len = Math.sqrt(dx * dx + dy * dy);
    this._touchInput = len > 1 ? { dx: dx / len, dy: dy / len } : { dx, dy };
  }

  _onPointerUp(ptr) {
    if (ptr.id === this._movePointerId) {
      this._movePointerId = null;
      this._touchInput    = { dx: 0, dy: 0 };
    }
    if (ptr.id === this._beamPointerId) {
      this._beamPointerId = null;
      this._touchBeamOn   = false;
    }
  }

  // ─── Main Update Loop ──────────────────────────────────────────────────────

  update(time, delta) {
    if (this._gameOver || this._levelCleared) return;

    this._handleKeyboardInput();
    this.ufo.update(delta);

    this._targets.forEach(t => t.update(delta));

    if (this._frozenTimer > 0) {
      this._frozenTimer -= delta;
    } else {
      this._shooters.forEach(s => s.update(delta));
    }

    this._powerUps = this._powerUps.filter(p => p.active);
    this._powerUps.forEach(p => p.update(delta));

    this._updatePowerUpTimers(delta);
    this._updateBeam(delta);
    this._checkBullets();
    this._updateTimer(delta);

    this._drawBeam();
    this._drawJoystick();
    this._drawBeamButton();

    this._maybeSpawnTarget();
    this._maybeSpawnPowerUp(delta);

    // Invincibility flash
    if (this._invincibleTimer > 0) {
      this._invincibleTimer -= delta;
      this.ufo.sprite.setAlpha(Math.floor(this._invincibleTimer / 110) % 2 === 0 ? 1 : 0.25);
    } else {
      this.ufo.sprite.setAlpha(1);
    }
  }

  _handleKeyboardInput() {
    let dx = 0, dy = 0;
    if (this._cursors.left.isDown  || this._wasd.A.isDown) dx = -1;
    if (this._cursors.right.isDown || this._wasd.D.isDown) dx =  1;
    if (this._cursors.up.isDown    || this._wasd.W.isDown) dy = -1;
    if (this._cursors.down.isDown  || this._wasd.S.isDown) dy =  1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      this.ufo.setInput(dx / len, dy / len);
    } else {
      this.ufo.setInput(this._touchInput.dx, this._touchInput.dy);
    }

    this._kbBeam  = this._spaceKey.isDown;
    this._beamOn  = this._kbBeam || this._touchBeamOn;
  }

  // ─── Beam Mechanic ─────────────────────────────────────────────────────────

  _updateBeam(delta) {
    const effectLevel = this._megabeamTimer > 0 ? 10 : this._baseBeamLevel;
    this.beamLevel     = effectLevel;   // entities read this
    const bw           = BEAM_LEVELS[effectLevel].width;
    const beamActive   = this._beamOn || this._magnetTimer > 0;

    this.ufo.beamActive = beamActive;

    if (!beamActive) {
      this._dropLockedTarget();
      this.ufo.reeling = false;
      return;
    }

    if (this._lockedTarget && this._lockedTarget.active) {
      // ── Reel in ──────────────────────────────────────────────────────────
      this.ufo.reeling   = true;
      const dt           = delta / 1000;
      const speed        = REEL_BASE_SPEED + effectLevel * 14;
      this._lockedTarget.y -= speed * dt;
      // Gently pull X toward UFO centre
      this._lockedTarget.x = Phaser.Math.Linear(
        this._lockedTarget.x, this.ufo.x, 0.07
      );
      this._lockedTarget.sprite.setPosition(
        this._lockedTarget.x, this._lockedTarget.y
      );

      if (this._lockedTarget.y <= this.ufo.y + 30) {
        this._onAbduction(this._lockedTarget);
      }
    } else {
      // ── Scan for a target in beam cone ───────────────────────────────────
      this.ufo.reeling   = false;
      this._lockedTarget = null;

      this._beamScanTimer -= delta;
      if (this._beamScanTimer <= 0) {
        audioManager.playBeamScan();
        this._beamScanTimer = BEAM_SCAN_TICK;
      }

      const halfW = bw / 2;
      const magnet = this._magnetTimer > 0;
      let best = null, bestDist = Infinity;

      for (const t of this._targets) {
        if (!t.active || t.abducted) continue;
        const def = TARGET_TYPES[t.targetType];
        if (def.weight > effectLevel) continue;
        if (t.y <= this.ufo.y) continue;
        const xDist = Math.abs(t.x - this.ufo.x);
        if (!magnet && xDist > halfW) continue;
        const d = xDist + Math.abs(t.y - this.ufo.y);
        if (d < bestDist) { bestDist = d; best = t; }
      }

      if (best) {
        this._lockedTarget = best;
        best.startReel();
        audioManager.playBeamLock();
        this._beamScanTimer = BEAM_SCAN_TICK;
      }
    }
  }

  _dropLockedTarget() {
    if (!this._lockedTarget) return;
    const t   = this._lockedTarget;
    const def = TARGET_TYPES[t.targetType];
    t.abducted = false;
    t.y        = this._groundY - def.h / 2;
    t.sprite.setPosition(t.x, t.y);
    this._lockedTarget = null;
  }

  // ─── Abduction ─────────────────────────────────────────────────────────────

  _onAbduction(target) {
    const def        = TARGET_TYPES[target.targetType];
    this._combo++;
    const multiplier = Math.min(this._combo, 8);
    this._score     += def.points * multiplier;
    this._energy    += def.energy;
    SaveManager.addAbductions(1);

    if (this._combo > 1) audioManager.playCombo(this._combo);
    else                 audioManager.playAbduction();

    if (this._combo > 1) {
      this._showFlash(
        COLORS.UI_GOLD,
        `COMBO x${multiplier}!`,
        this.scale.height * 0.45
      );
    }

    // Beam upgrade check
    const bl = BEAM_LEVELS[this._baseBeamLevel];
    if (this._energy >= bl.energyNeeded && this._baseBeamLevel < 10) {
      this._energy -= bl.energyNeeded;
      this._baseBeamLevel++;
      if (this._megabeamTimer <= 0) this.beamLevel = this._baseBeamLevel;
      audioManager.playBeamUpgrade();
      this._showFlash(
        BEAM_LEVELS[this._baseBeamLevel].color,
        `BEAM LV.${this._baseBeamLevel}!`,
        this.scale.height * 0.38
      );
    }

    target.destroy();
    this._targets      = this._targets.filter(t => t !== target);
    this._lockedTarget = null;
    this.ufo.reeling   = false;
  }

  // ─── Bullets & Hit Detection ───────────────────────────────────────────────

  _checkBullets() {
    const { width, height } = this.scale;
    this.bullets.getChildren().forEach(b => {
      if (!b.active) return;
      if (b.x < -30 || b.x > width + 30 || b.y < -30 || b.y > height + 30) {
        b.destroy();
        return;
      }
      if (this._invincibleTimer > 0) return;
      const dist = Phaser.Math.Distance.Between(b.x, b.y, this.ufo.x, this.ufo.y);
      if (dist < 26) { b.destroy(); this._onUFOHit(); }
    });
  }

  _onUFOHit() {
    if (this._shielded) {
      this._shielded = false;
      audioManager.playShieldBreak();
      this._showFlash(0x4488ff, 'SHIELD BROKEN!');
      return;
    }
    this._lives--;
    this._combo         = 0;
    this._invincibleTimer = 2000;
    this._dropLockedTarget();
    audioManager.playDamage();
    this.cameras.main.shake(180, 0.012);
    if (this._lives <= 0) this._onGameOver();
  }

  // ─── Timer ─────────────────────────────────────────────────────────────────

  _updateTimer(delta) {
    const prev    = this._timer;
    this._timer  -= delta / 1000;
    // Tick warning sound each whole second in final 10s
    if (this._timer <= 10 && this._timer > 0) {
      if (Math.floor(prev) !== Math.floor(this._timer)) audioManager.playTimerWarn();
    }
    if (this._timer <= 0) { this._timer = 0; this._onLevelClear(); }
  }

  // ─── Power-ups ─────────────────────────────────────────────────────────────

  _applyPowerUp(type) {
    switch (type) {
      case 'megabeam':
        this._megabeamTimer = 8000;
        this.beamLevel      = 10;
        this._showFlash(BEAM_LEVELS[10].color, 'MEGA BEAM!');
        break;
      case 'shield':
        this._shielded = true;
        this._showFlash(0x4488ff, 'SHIELD ON!');
        break;
      case 'freeze':
        this._frozenTimer = 4000;
        this._showFlash(0x88eeff, 'FREEZE!');
        break;
      case 'time':
        this._timer = Math.min(this._timer + 20, LEVEL_TIME);
        this._showFlash(COLORS.UI_GOLD, '+20 SECONDS!');
        break;
      case 'gravity':
        this.bullets.clear(true, true);
        this._shooters.forEach(s => { s.active = false; });
        this.time.delayedCall(3000, () => {
          this._shooters.forEach(s => { s.active = true; });
        });
        this._showFlash(0xcc44ff, 'GRAVITY BOMB!');
        break;
      case 'magnet':
        this._magnetTimer = 6000;
        this._showFlash(0xff4444, 'MAGNET!');
        break;
    }
  }

  _updatePowerUpTimers(delta) {
    if (this._megabeamTimer > 0) {
      this._megabeamTimer -= delta;
      if (this._megabeamTimer <= 0) {
        this._megabeamTimer = 0;
        this.beamLevel      = this._baseBeamLevel;
      }
    }
    if (this._magnetTimer > 0) this._magnetTimer -= delta;
  }

  // ─── Spawning ──────────────────────────────────────────────────────────────

  _spawnTarget() {
    const world = WORLDS[this.worldId] ?? WORLDS[0];
    const type  = world.targets[Phaser.Math.Between(0, world.targets.length - 1)];
    const def   = TARGET_TYPES[type];
    const x     = Phaser.Math.Between(44, this.W - 44);
    const y     = this._groundY - def.h / 2;
    this._targets.push(new Target(this, x, y, type));
  }

  _spawnShooter() {
    const x = Phaser.Math.Between(60, this.W - 60);
    this._shooters.push(new Shooter(this, x, this._groundY - 19));
  }

  _maybeSpawnTarget() {
    const alive = this._targets.filter(t => t.active).length;
    const max   = Math.min(4 + this.level, MAX_TARGETS);
    if (alive < max) this._spawnTarget();
  }

  _maybeSpawnPowerUp(delta) {
    this._puSpawnTimer -= delta;
    if (this._puSpawnTimer <= 0 && this._powerUps.length === 0) {
      const types = ['megabeam', 'shield', 'freeze', 'time', 'gravity', 'magnet'];
      const type  = types[Phaser.Math.Between(0, types.length - 1)];
      const x     = Phaser.Math.Between(60, this.W - 60);
      this._powerUps.push(new PowerUp(this, x, this._groundY - 64, type));
      this._puSpawnTimer = Phaser.Math.Between(PU_INTERVAL_MIN, PU_INTERVAL_MAX);
    }
  }

  // ─── End Conditions ────────────────────────────────────────────────────────

  _onLevelClear() {
    if (this._levelCleared || this._gameOver) return;
    this._levelCleared = true;
    audioManager.stopMusic();
    audioManager.playLevelClear();
    SaveManager.setLevelProgress(this.worldId, this.level);
    SaveManager.updateHighScore(this.worldId, this.level, this._score);
    SaveManager.updateBestCombo(this._combo);
    if (this.level >= 10 && this.worldId < 6) SaveManager.unlockWorld(this.worldId + 1);
    this.time.delayedCall(700, () => {
      this.scene.stop('HUDScene');
      this.scene.start('LevelClearScene', {
        worldId: this.worldId, level: this.level, score: this._score,
      });
    });
  }

  _onGameOver() {
    if (this._gameOver || this._levelCleared) return;
    this._gameOver = true;
    audioManager.stopMusic();
    audioManager.playGameOver();
    SaveManager.updateHighScore(this.worldId, this.level, this._score);
    this.time.delayedCall(900, () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene', {
        worldId: this.worldId, level: this.level, score: this._score,
      });
    });
  }

  // ─── Drawing ───────────────────────────────────────────────────────────────

  _drawBeam() {
    this._beamGfx.clear();
    const beamActive = this._beamOn || this._magnetTimer > 0;
    if (!beamActive) return;

    const effectLevel = this._megabeamTimer > 0 ? 10 : this._baseBeamLevel;
    const bw    = BEAM_LEVELS[effectLevel].width;
    const color = this._lockedTarget
      ? (this.ufo.reeling ? COLORS.BEAM_REEL : COLORS.BEAM_LOCK)
      : COLORS.BEAM_SCAN;

    const ux = this.ufo.x;
    const uy = this.ufo.y + 22;
    const gY = this._groundY;

    this._beamGfx.fillStyle(color, 0.05);
    this._beamGfx.fillTriangle(ux - bw * 1.5, uy, ux + bw * 1.5, uy, ux, gY);
    this._beamGfx.fillStyle(color, 0.13);
    this._beamGfx.fillTriangle(ux - bw,        uy, ux + bw,        uy, ux, gY);
    this._beamGfx.fillStyle(color, 0.30);
    this._beamGfx.fillTriangle(ux - bw * 0.3,  uy, ux + bw * 0.3,  uy, ux, gY);
  }

  _drawJoystick() {
    this._joystickGfx.clear();
    if (this._movePointerId === null) return;
    const ox = this._moveOrigin.x, oy = this._moveOrigin.y;
    const { dx, dy } = this._touchInput;
    this._joystickGfx.fillStyle(0xffffff, 0.07);
    this._joystickGfx.fillCircle(ox, oy, 55);
    this._joystickGfx.lineStyle(1, 0xffffff, 0.18);
    this._joystickGfx.strokeCircle(ox, oy, 55);
    this._joystickGfx.fillStyle(0xffffff, 0.24);
    this._joystickGfx.fillCircle(ox + dx * 55, oy + dy * 55, 22);
  }

  _drawBeamButton() {
    this._beamBtnGfx.clear();
    const bx    = this.W * 0.78;
    const by    = this.scale.height * 0.88;
    const color = BEAM_LEVELS[this.beamLevel].color;
    const active = this._beamOn || this._magnetTimer > 0;

    if (active) {
      this._beamBtnGfx.fillStyle(color, 0.14);
      this._beamBtnGfx.fillCircle(bx, by, 60);
      this._beamBtnGfx.lineStyle(2, color, 0.55);
      this._beamBtnGfx.strokeCircle(bx, by, 60);
      this._beamBtnLabel.setColor(`#${color.toString(16).padStart(6, '0')}`);
    } else {
      this._beamBtnGfx.lineStyle(1, 0x225544, 0.4);
      this._beamBtnGfx.strokeCircle(bx, by, 58);
      this._beamBtnLabel.setColor('#224433');
    }
    this._beamBtnLabel.setPosition(bx, by);
  }

  _showFlash(color, msg, y) {
    const { width, height } = this.scale;
    const yPos = y ?? height * 0.40;
    const hex  = `#${color.toString(16).padStart(6, '0')}`;
    const txt  = this.add.text(width / 2, yPos, msg, {
      fontFamily: 'monospace', fontSize: '22px',
      color: hex, stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({
      targets: txt, y: yPos - 55, alpha: 0, duration: 1300,
      ease: 'Power2', onComplete: () => txt.destroy(),
    });
  }
}
