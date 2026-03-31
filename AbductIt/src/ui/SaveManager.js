const SAVE_KEY = 'abductit_save';

const DEFAULT_SAVE = {
  highScores: {},
  worldProgress: [0],
  levelProgress: {},
  totalAbductions: 0,
  achievements: {},
  unlockedSkins: ['default'],
  activeSkin: 'default',
  muteAudio: false,
  bestCombo: 0,
};

export const SaveManager = {
  data: { ...DEFAULT_SAVE },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) this.data = { ...DEFAULT_SAVE, ...JSON.parse(raw) };
    } catch (e) {
      this.data = { ...DEFAULT_SAVE };
    }
  },

  save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) {}
  },

  getHighScore(world, level) { return this.data.highScores[`${world}_${level}`] || 0; },

  updateHighScore(world, level, score) {
    const key = `${world}_${level}`;
    if (score > (this.data.highScores[key] || 0)) {
      this.data.highScores[key] = score;
      this.save();
    }
  },

  unlockWorld(worldId) {
    if (!this.data.worldProgress.includes(worldId)) {
      this.data.worldProgress.push(worldId);
      this.save();
    }
  },

  isWorldUnlocked(worldId) { return this.data.worldProgress.includes(worldId); },

  setLevelProgress(worldId, level) {
    const current = this.data.levelProgress[worldId] || 0;
    if (level > current) {
      this.data.levelProgress[worldId] = level;
      this.save();
    }
  },

  getLevelProgress(worldId) { return this.data.levelProgress[worldId] || 0; },
  addAbductions(count) { this.data.totalAbductions += count; this.save(); },

  unlockAchievement(id) {
    if (!this.data.achievements[id]) {
      this.data.achievements[id] = Date.now();
      this.save();
      return true;
    }
    return false;
  },

  hasAchievement(id) { return !!this.data.achievements[id]; },

  updateBestCombo(combo) {
    if (combo > this.data.bestCombo) {
      this.data.bestCombo = combo;
      this.save();
    }
  },

  reset() {
    this.data = { ...DEFAULT_SAVE };
    localStorage.removeItem(SAVE_KEY);
  },
};
