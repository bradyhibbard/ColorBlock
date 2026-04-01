import Phaser from 'phaser';

// TODO: Implement HUD overlay (score, timer, beam level, health)
// Launched in parallel with GameScene via this.scene.launch('HUDScene')
export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
  }

  create() {
    // Placeholder — will display score, timer, beam level, health bar
  }
}
