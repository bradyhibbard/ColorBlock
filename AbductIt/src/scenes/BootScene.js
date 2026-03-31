import Phaser from 'phaser';
import { audioManager } from '../audio/AudioManager.js';
import { SaveManager } from '../ui/SaveManager.js';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    // Generate all textures procedurally — no external files
    this._generateTextures();
  }

  create() {
    // Init audio (must be after user interaction on iOS — we init on first touch)
    audioManager.init();

    // Init save data
    SaveManager.load();

    // Unlock audio on first touch
    this.input.once('pointerdown', () => {
      audioManager.resume();
    });

    this.scene.start('TitleScene');
  }

  _generateTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // UFO
    this._drawUFO(g);

    // Beam segments
    g.clear();
    g.fillStyle(0x33aaff, 0.3);
    g.fillRect(0, 0, 60, 8);
    g.generateTexture('beam_seg', 60, 8);

    // Targets — draw all types
    this._drawTargets(g);

    // Ground tiles per world
    this._drawGroundTiles(g);

    // Enemy shooter (farmer with gun)
    this._drawShooter(g);

    // Explosion particle
    g.clear();
    g.fillStyle(0xff6600, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle_exp', 8, 8);

    g.clear();
    g.fillStyle(0x33ff99, 1);
    g.fillCircle(2, 2, 2);
    g.generateTexture('particle_beam', 4, 4);

    // Collectible energy orb
    g.clear();
    g.fillStyle(0xffdd00, 1);
    g.fillCircle(6, 6, 6);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(4, 4, 2);
    g.generateTexture('energy_orb', 12, 12);

    // Power-up icons
    this._drawPowerUps(g);

    // Stars for background
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(1, 1, 1);
    g.generateTexture('star', 2, 2);

    g.destroy();
  }

  _drawUFO(g) {
    g.clear();
    const W = 64, H = 36;
    // Body — saucer shape
    g.fillStyle(0x888888, 1);
    g.fillEllipse(W / 2, H / 2 + 4, W, 20);
    // Dome
    g.fillStyle(0x44ddff, 1);
    g.fillEllipse(W / 2, H / 2 - 2, 30, 18);
    // Dome shine
    g.fillStyle(0xaaffff, 0.7);
    g.fillEllipse(W / 2 - 4, H / 2 - 6, 10, 8);
    // Rim lights
    const rimColors = [0xff4444, 0x44ff44, 0xffff44, 0x4444ff];
    for (let i = 0; i < 4; i++) {
      g.fillStyle(rimColors[i], 1);
      g.fillCircle(W / 2 - 18 + i * 12, H / 2 + 8, 3);
    }
    // Engine glow
    g.fillStyle(0x66aaff, 0.6);
    g.fillEllipse(W / 2, H - 4, 24, 8);
    g.generateTexture('ufo', W, H);
  }

  _drawTargets(g) {
    // Gnome
    g.clear();
    g.fillStyle(0xee4444, 1); g.fillRect(4, 0, 8, 10);   // hat
    g.fillStyle(0xffcc88, 1); g.fillRect(3, 8, 10, 8);    // face
    g.fillStyle(0x3333cc, 1); g.fillRect(3, 16, 10, 10);  // body
    g.generateTexture('target_GNOME', 16, 26);

    // Cat
    g.clear();
    g.fillStyle(0xffaa66, 1);
    g.fillRect(2, 4, 14, 8);   // body
    g.fillRect(5, 0, 8, 6);    // head
    g.fillTriangle(5, 2, 2, -2, 5, -2);   // ear left
    g.fillTriangle(11, 2, 14, -2, 11, -2); // ear right
    g.fillStyle(0x66aa66, 1); g.fillRect(7, 2, 2, 2); // eyes
    g.generateTexture('target_CAT', 18, 14);

    // Chicken
    g.clear();
    g.fillStyle(0xffee88, 1); g.fillEllipse(9, 9, 14, 12); // body
    g.fillStyle(0xffee88, 1); g.fillEllipse(9, 3, 8, 8);   // head
    g.fillStyle(0xff6622, 1); g.fillRect(8, 4, 6, 3);       // beak
    g.fillStyle(0xff3333, 1); g.fillRect(7, 2, 4, 2);       // comb
    g.generateTexture('target_CHICKEN', 18, 16);

    // Dog
    g.clear();
    g.fillStyle(0xcc8844, 1);
    g.fillRect(2, 6, 18, 10);  // body
    g.fillRect(6, 2, 10, 8);   // head
    g.fillRect(0, 10, 4, 6);   // front leg
    g.fillRect(18, 10, 4, 6);  // back leg
    g.fillStyle(0x885522, 1); g.fillRect(8, 4, 3, 2); // eye
    g.fillStyle(0xff8888, 1); g.fillRect(10, 8, 4, 2); // nose area
    g.generateTexture('target_DOG', 24, 18);

    // Sheep
    g.clear();
    g.fillStyle(0xeeeedd, 1); g.fillEllipse(13, 8, 22, 14); // fluffy body
    g.fillStyle(0xbbbbaa, 1); g.fillEllipse(13, 6, 18, 10); // more fluff
    g.fillStyle(0x888877, 1); g.fillRect(5, 12, 4, 8); // legs
    g.fillRect(18, 12, 4, 8);
    g.fillStyle(0xeeeedd, 1); g.fillEllipse(5, 8, 10, 9); // head
    g.fillStyle(0x222222, 1); g.fillRect(3, 6, 2, 2); // eye
    g.generateTexture('target_SHEEP', 26, 20);

    // Child
    g.clear();
    g.fillStyle(0xffcc88, 1); g.fillCircle(7, 6, 6);    // head
    g.fillStyle(0xff6688, 1); g.fillRect(4, 12, 9, 11); // body
    g.fillStyle(0x4488ff, 1); g.fillRect(4, 20, 4, 8);  // legs
    g.fillRect(9, 20, 4, 8);
    g.generateTexture('target_CHILD', 16, 28);

    // Mailbox
    g.clear();
    g.fillStyle(0x4488ff, 1); g.fillRect(2, 2, 12, 10); g.fillRect(2, 0, 12, 4);
    g.fillStyle(0x888888, 1); g.fillRect(6, 12, 4, 8);
    g.generateTexture('target_MAILBOX', 16, 20);

    // Bicycle
    g.clear();
    g.fillStyle(0x888888, 1);
    g.strokeStyle = 0x888888;
    g.lineStyle(2, 0x888888, 1);
    g.strokeCircle(6, 14, 6);
    g.strokeCircle(22, 14, 6);
    g.strokeRect(6, 8, 16, 2);
    g.fillStyle(0xcc4422, 1); g.fillRect(10, 4, 8, 4);  // frame
    g.generateTexture('target_BICYCLE', 28, 22);

    // Farmer
    g.clear();
    g.fillStyle(0xffdd44, 1); g.fillRect(3, 0, 10, 6);   // straw hat
    g.fillStyle(0xffcc88, 1); g.fillCircle(8, 8, 5);     // head
    g.fillStyle(0x5588aa, 1); g.fillRect(3, 14, 12, 14); // overalls
    g.fillStyle(0xffcc88, 1); g.fillRect(1, 14, 4, 10);  // arms
    g.fillRect(13, 14, 4, 10);
    g.fillStyle(0x3333aa, 1); g.fillRect(4, 26, 4, 8);   // legs
    g.fillRect(9, 26, 4, 8);
    g.generateTexture('target_FARMER', 16, 34);

    // Person (generic civilian)
    g.clear();
    g.fillStyle(0xffcc88, 1); g.fillCircle(8, 6, 5);
    g.fillStyle(0x44aa44, 1); g.fillRect(3, 12, 12, 12);
    g.fillStyle(0x334466, 1); g.fillRect(3, 22, 5, 8);
    g.fillRect(9, 22, 5, 8);
    g.generateTexture('target_PERSON', 16, 30);

    // Cow
    g.clear();
    g.fillStyle(0xffffff, 1); g.fillEllipse(20, 16, 36, 22);
    g.fillStyle(0x222222, 1);
    g.fillRect(4,  10, 8, 8);
    g.fillRect(22, 8,  8, 8);
    g.fillRect(8,  18, 8, 8);
    g.fillStyle(0xffffff, 1); g.fillEllipse(5, 12, 12, 10); // head
    g.fillStyle(0x222222, 1); g.fillRect(2, 10, 2, 2); // eye
    g.fillStyle(0xff8888, 1); g.fillRect(1, 14, 6, 3);  // snout
    g.fillStyle(0xffffff, 1); g.fillRect(8, 26, 4, 8); // legs
    g.fillRect(16, 26, 4, 8);
    g.fillRect(24, 26, 4, 8);
    g.fillRect(32, 26, 4, 8);
    g.generateTexture('target_COW', 40, 34);

    // Motorbike
    g.clear();
    g.fillStyle(0x444444, 1);
    g.lineStyle(3, 0x444444, 1);
    g.strokeCircle(8, 16, 8); g.strokeCircle(28, 16, 8);
    g.fillStyle(0xff2222, 1); g.fillRect(10, 6, 16, 10); // body
    g.fillStyle(0x888888, 1); g.fillRect(12, 4, 6, 4);   // seat
    g.generateTexture('target_MOTORBIKE', 36, 22);

    // Market stall
    g.clear();
    g.fillStyle(0xff8844, 1); g.fillRect(0, 0, 44, 6);   // awning
    g.fillStyle(0xffdd88, 1); g.fillRect(2, 6, 40, 20);  // stall body
    g.fillStyle(0x44aa44, 1); g.fillRect(4, 8, 8, 8);    // produce
    g.fillStyle(0xff4444, 1); g.fillRect(16, 8, 8, 8);
    g.fillStyle(0xffff44, 1); g.fillRect(28, 8, 8, 8);
    g.fillStyle(0x888844, 1); g.fillRect(0, 24, 4, 8); g.fillRect(40, 24, 4, 8); // legs
    g.generateTexture('target_MARKET', 44, 32);

    // Car
    g.clear();
    g.fillStyle(0x4466ff, 1); g.fillRect(4, 10, 56, 16); // body
    g.fillStyle(0x6688ff, 1); g.fillRect(12, 4, 36, 12);  // roof
    g.fillStyle(0x88aaff, 0.8);
    g.fillRect(14, 6, 14, 8); g.fillRect(32, 6, 14, 8);  // windows
    g.fillStyle(0x222222, 1);
    g.fillCircle(12, 26, 7); g.fillCircle(48, 26, 7);    // wheels
    g.generateTexture('target_CAR', 56, 26);

    // Truck
    g.clear();
    g.fillStyle(0xaa4422, 1); g.fillRect(0, 8, 68, 22);  // cargo
    g.fillStyle(0xcc5533, 1); g.fillRect(50, 2, 18, 20); // cab
    g.fillStyle(0x88aaff, 0.7); g.fillRect(54, 4, 10, 8); // window
    g.fillStyle(0x222222, 1);
    g.fillCircle(12, 30, 8); g.fillCircle(34, 30, 8); g.fillCircle(56, 30, 8);
    g.generateTexture('target_TRUCK', 68, 30);

    // Vending machine
    g.clear();
    g.fillStyle(0xff2244, 1); g.fillRect(0, 0, 22, 40);
    g.fillStyle(0x222222, 1); g.fillRect(2, 2, 18, 20);   // screen area
    g.fillStyle(0xffdd00, 1); g.fillRect(4, 24, 14, 4);   // buttons
    g.fillStyle(0xaaaaaa, 1); g.fillRect(8, 30, 6, 4);    // slot
    g.generateTexture('target_VENDING', 22, 40);

    // Bus
    g.clear();
    g.fillStyle(0xffdd00, 1); g.fillRect(0, 4, 88, 32);
    g.fillStyle(0x88aaff, 0.8);
    for (let i = 0; i < 5; i++) g.fillRect(8 + i * 16, 8, 10, 12);
    g.fillStyle(0xffdd00, 1); g.fillRect(0, 4, 8, 32); g.fillRect(80, 4, 8, 32);
    g.fillStyle(0x222222, 1);
    g.fillCircle(16, 36, 9); g.fillCircle(40, 36, 9); g.fillCircle(72, 36, 9);
    g.generateTexture('target_BUS', 88, 36);

    // Military Jeep
    g.clear();
    g.fillStyle(0x446622, 1); g.fillRect(0, 8, 64, 24);
    g.fillStyle(0x558833, 1); g.fillRect(8, 2, 40, 16);
    g.fillStyle(0x88aaff, 0.5); g.fillRect(14, 4, 14, 8); g.fillRect(34, 4, 14, 8);
    g.fillStyle(0x222222, 1);
    g.fillCircle(12, 32, 8); g.fillCircle(52, 32, 8);
    // Machine gun on top
    g.fillStyle(0x333333, 1); g.fillRect(28, 0, 8, 6);
    g.generateTexture('target_JEEP', 64, 32);

    // Tank
    g.clear();
    g.fillStyle(0x556633, 1); g.fillRect(4, 14, 80, 24);  // body
    g.fillStyle(0x446622, 1); g.fillRect(8, 6, 50, 16);   // turret base
    g.fillStyle(0x557733, 1); g.fillRect(14, 8, 40, 14);  // turret
    g.fillStyle(0x446622, 1); g.fillRect(50, 10, 30, 5);  // barrel
    g.fillStyle(0x222222, 1);
    for (let i = 0; i < 4; i++) g.fillCircle(10 + i * 18, 38, 7); // wheels
    g.generateTexture('target_TANK', 80, 38);

    // Helicopter
    g.clear();
    g.fillStyle(0x888888, 1); g.fillEllipse(40, 18, 60, 22); // body
    g.fillStyle(0x666666, 1); g.fillRect(70, 14, 12, 8);      // tail
    g.fillStyle(0xaaaaaa, 1); g.fillRect(10, 6, 60, 4);       // main rotor
    g.fillStyle(0x666666, 1); g.fillRect(78, 8, 14, 3);       // tail rotor
    g.fillStyle(0x88ccff, 0.7); g.fillRect(28, 12, 18, 10);   // cockpit
    g.generateTexture('target_HELICOPTER', 80, 32);

    // Train
    g.clear();
    g.fillStyle(0xaaaaaa, 1); g.fillRect(0, 4, 160, 32);
    g.fillStyle(0x888888, 1); g.fillRect(0, 4, 40, 32); // engine
    g.fillStyle(0xff4444, 1); g.fillRect(2, 8, 36, 4);  // stripe
    g.fillStyle(0x88ccff, 0.8);
    for (let i = 0; i < 6; i++) g.fillRect(50 + i * 18, 8, 12, 14); // windows
    g.fillStyle(0x222222, 1);
    for (let i = 0; i < 6; i++) g.fillCircle(14 + i * 26, 36, 8);
    g.generateTexture('target_TRAIN', 160, 36);

    // Building
    g.clear();
    g.fillStyle(0x556677, 1); g.fillRect(0, 0, 60, 80);
    g.fillStyle(0xffeeaa, 0.7);
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 3; col++)
        g.fillRect(6 + col * 18, 8 + row * 14, 10, 8);
    g.fillStyle(0x334455, 1); g.fillRect(20, 64, 20, 16); // door
    g.generateTexture('target_BUILDING', 60, 80);

    // Skyscraper
    g.clear();
    g.fillStyle(0x334466, 1); g.fillRect(0, 0, 70, 130);
    g.fillStyle(0x88aacc, 0.4); g.fillRect(2, 2, 66, 126); // glass
    g.fillStyle(0xffeeaa, 0.6);
    for (let row = 0; row < 8; row++)
      for (let col = 0; col < 3; col++)
        g.fillRect(6 + col * 20, 8 + row * 14, 12, 8);
    g.fillStyle(0x556688, 1); g.fillRect(28, 0, 14, 10); // antenna
    g.generateTexture('target_SKYSCRAPER', 70, 130);

    // Eiffel Tower
    g.clear();
    g.fillStyle(0xbbaa88, 1);
    g.fillTriangle(30, 0, 0, 160, 60, 160);
    g.fillStyle(0x000000, 0.3);
    g.fillRect(10, 60, 40, 4);
    g.fillRect(5, 100, 50, 4);
    g.fillRect(0, 130, 60, 4);
    g.fillStyle(0xffdd44, 1); g.fillCircle(30, 4, 4); // top light
    g.generateTexture('target_EIFFEL', 60, 160);

    // Statue of Liberty
    g.clear();
    g.fillStyle(0x88bb99, 1);
    g.fillRect(16, 80, 18, 70);      // base pedestal
    g.fillRect(14, 60, 22, 30);      // robe
    g.fillRect(18, 30, 14, 36);      // upper body
    g.fillCircle(25, 22, 12);        // head
    g.fillRect(32, 18, 6, 24);       // torch arm
    g.fillStyle(0xffee44, 1); g.fillCircle(36, 14, 6); // torch flame
    g.generateTexture('target_LIBERTY', 50, 150);

    // Sphinx
    g.clear();
    g.fillStyle(0xddbb88, 1);
    g.fillRect(0, 40, 120, 30);       // body
    g.fillEllipse(60, 30, 80, 30);    // back
    g.fillRect(90, 20, 30, 50);       // head pillar
    g.fillCircle(105, 20, 20);        // head
    g.fillStyle(0xccaa77, 1);
    g.fillRect(88, 12, 36, 14);       // headdress
    g.fillStyle(0x886644, 1); g.fillRect(102, 18, 2, 2); // eye
    g.generateTexture('target_SPHINX', 120, 70);

    // Enemy shooter (base)
    g.clear();
    g.fillStyle(0xcc4422, 1); g.fillRect(2, 0, 12, 14);  // body
    g.fillStyle(0xffcc88, 1); g.fillCircle(8, 20, 6);     // head
    g.fillStyle(0x666666, 1); g.fillRect(14, 8, 16, 4);   // gun barrel
    g.generateTexture('shooter', 30, 28);
  }

  _drawGroundTiles(g) {
    // Countryside
    g.clear();
    g.fillStyle(0x2d8a2d, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0x228822, 1);
    for (let i = 0; i < 8; i++) g.fillCircle(i * 8 + 4, 2, 3);
    g.generateTexture('ground_0', 64, 40);

    // Suburban
    g.clear();
    g.fillStyle(0x555555, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0x444444, 1); g.fillRect(0, 20, 64, 4);
    g.generateTexture('ground_1', 64, 40);

    // City
    g.clear();
    g.fillStyle(0x222222, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0x333333, 1); g.fillRect(0, 30, 64, 4);
    g.generateTexture('ground_2', 64, 40);

    // Military
    g.clear();
    g.fillStyle(0x3d5c1a, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0x4a7022, 1);
    for (let i = 0; i < 4; i++) g.fillRect(i * 16, 0, 8, 40);
    g.generateTexture('ground_3', 64, 40);

    // Desert
    g.clear();
    g.fillStyle(0xd4a055, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0xc8943a, 1);
    for (let i = 0; i < 8; i++) g.fillRect(i * 8 + 2, 15 + Math.sin(i) * 5, 4, 6);
    g.generateTexture('ground_4', 64, 40);

    // Arctic
    g.clear();
    g.fillStyle(0xddeeff, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0xffffff, 1);
    for (let i = 0; i < 6; i++) g.fillEllipse(i * 12, 8, 20, 12);
    g.generateTexture('ground_5', 64, 40);

    // Space/Mega City
    g.clear();
    g.fillStyle(0x111122, 1); g.fillRect(0, 0, 64, 40);
    g.fillStyle(0x222233, 1); g.fillRect(0, 20, 64, 2);
    g.generateTexture('ground_6', 64, 40);
  }

  _drawShooter(g) {
    g.clear();
    g.fillStyle(0xcc4422, 1); g.fillRect(2, 0, 12, 14);
    g.fillStyle(0xffcc88, 1); g.fillCircle(8, -4, 5);
    g.fillStyle(0x666666, 1); g.fillRect(14, 2, 16, 3);
    g.generateTexture('shooter', 32, 20);
  }

  _drawPowerUps(g) {
    // Mega beam
    g.clear();
    g.fillStyle(0xffdd00, 1); g.fillRect(6, 0, 4, 20);
    g.fillStyle(0xff8800, 1); g.fillRect(2, 6, 12, 4);
    g.fillStyle(0xffff88, 1); g.fillCircle(8, 8, 4);
    g.generateTexture('powerup_megabeam', 16, 20);

    // Shield
    g.clear();
    g.fillStyle(0x4488ff, 1); g.fillRect(2, 0, 12, 16);
    g.fillStyle(0x88aaff, 1); g.fillRect(4, 2, 8, 12);
    g.fillStyle(0xaaccff, 1); g.fillRect(6, 4, 4, 8);
    g.generateTexture('powerup_shield', 16, 16);

    // Freeze
    g.clear();
    g.fillStyle(0x88ddff, 1);
    g.fillRect(7, 0, 2, 16);
    g.fillRect(0, 7, 16, 2);
    g.fillRect(3, 3, 2, 2); g.fillRect(11, 3, 2, 2);
    g.fillRect(3, 11, 2, 2); g.fillRect(11, 11, 2, 2);
    g.generateTexture('powerup_freeze', 16, 16);

    // Time warp
    g.clear();
    g.lineStyle(2, 0xffcc44, 1);
    g.strokeCircle(8, 8, 7);
    g.strokeRect(7, 2, 2, 7);
    g.strokeRect(7, 8, 4, 2);
    g.generateTexture('powerup_time', 16, 16);

    // Gravity bomb
    g.clear();
    g.fillStyle(0xff3366, 1); g.fillCircle(8, 8, 8);
    g.fillStyle(0x000000, 0.5); g.fillCircle(8, 8, 4);
    g.fillStyle(0xffffff, 1); g.fillCircle(8, 8, 2);
    g.generateTexture('powerup_gravity', 16, 16);

    // Magnet
    g.clear();
    g.fillStyle(0xff4444, 1);
    g.fillRect(4, 0, 4, 10);
    g.fillRect(8, 0, 4, 10);
    g.fillStyle(0xaaaaaa, 1);
    g.fillRect(0, 8, 16, 4);
    g.fillStyle(0x4444ff, 1);
    g.fillRect(4, 0, 4, 4);
    g.generateTexture('powerup_magnet', 16, 16);
  }
}
