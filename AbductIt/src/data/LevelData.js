// Level configs for all 7 worlds x 10 levels = 70 levels
export const LEVEL_DATA = [
  // WORLD 0: Countryside
  { world: 0, level: 1,  quota: 40,   timeLimit: 90,  spawnInterval: 6000, enemyShooters: 0,  targets: [{ type: 'GNOME', count: 5 }, { type: 'CAT', count: 3 }], tutorial: 'Tap BEAM to abduct! Fill the energy bar to level up!' },
  { world: 0, level: 2,  quota: 60,   timeLimit: 90,  spawnInterval: 5500, enemyShooters: 0,  targets: [{ type: 'GNOME', count: 4 }, { type: 'CAT', count: 4 }, { type: 'CHICKEN', count: 4 }] },
  { world: 0, level: 3,  quota: 80,   timeLimit: 85,  spawnInterval: 5000, enemyShooters: 1,  targets: [{ type: 'CHICKEN', count: 5 }, { type: 'MAILBOX', count: 4 }, { type: 'DOG', count: 3 }] },
  { world: 0, level: 4,  quota: 100,  timeLimit: 85,  spawnInterval: 4500, enemyShooters: 1,  targets: [{ type: 'CAT', count: 4 }, { type: 'DOG', count: 4 }, { type: 'SHEEP', count: 4 }] },
  { world: 0, level: 5,  quota: 130,  timeLimit: 80,  spawnInterval: 4000, enemyShooters: 2,  targets: [{ type: 'DOG', count: 4 }, { type: 'SHEEP', count: 4 }, { type: 'FARMER', count: 3 }], special: 'stampede' },
  { world: 0, level: 6,  quota: 160,  timeLimit: 80,  spawnInterval: 4000, enemyShooters: 2,  targets: [{ type: 'SHEEP', count: 4 }, { type: 'FARMER', count: 4 }, { type: 'PERSON', count: 3 }] },
  { world: 0, level: 7,  quota: 200,  timeLimit: 75,  spawnInterval: 3800, enemyShooters: 3,  targets: [{ type: 'FARMER', count: 4 }, { type: 'PERSON', count: 4 }, { type: 'COW', count: 2 }] },
  { world: 0, level: 8,  quota: 240,  timeLimit: 75,  spawnInterval: 3500, enemyShooters: 3,  targets: [{ type: 'PERSON', count: 4 }, { type: 'COW', count: 4 }, { type: 'FARMER', count: 3 }], special: 'stealth' },
  { world: 0, level: 9,  quota: 300,  timeLimit: 70,  spawnInterval: 3200, enemyShooters: 4,  targets: [{ type: 'COW', count: 5 }, { type: 'FARMER', count: 4 }, { type: 'PERSON', count: 4 }, { type: 'SHEEP', count: 3 }] },
  { world: 0, level: 10, quota: 400,  timeLimit: 90,  spawnInterval: 2800, enemyShooters: 5,  targets: [{ type: 'COW', count: 6 }, { type: 'FARMER', count: 6 }, { type: 'PERSON', count: 4 }, { type: 'SHEEP', count: 4 }, { type: 'DOG', count: 4 }, { type: 'CAT', count: 4 }], special: 'boss_countryside', bossType: 'COMBINE' },

  // WORLD 1: Suburbia
  { world: 1, level: 1,  quota: 80,   timeLimit: 90,  spawnInterval: 5000, enemyShooters: 1,  targets: [{ type: 'MAILBOX', count: 5 }, { type: 'CAT', count: 4 }, { type: 'DOG', count: 3 }] },
  { world: 1, level: 2,  quota: 110,  timeLimit: 90,  spawnInterval: 4800, enemyShooters: 2,  targets: [{ type: 'DOG', count: 4 }, { type: 'CHILD', count: 4 }, { type: 'BICYCLE', count: 3 }] },
  { world: 1, level: 3,  quota: 140,  timeLimit: 85,  spawnInterval: 4500, enemyShooters: 2,  targets: [{ type: 'CHILD', count: 4 }, { type: 'BICYCLE', count: 4 }, { type: 'PERSON', count: 3 }] },
  { world: 1, level: 4,  quota: 180,  timeLimit: 85,  spawnInterval: 4200, enemyShooters: 3,  targets: [{ type: 'BICYCLE', count: 4 }, { type: 'PERSON', count: 4 }, { type: 'MOTORBIKE', count: 3 }] },
  { world: 1, level: 5,  quota: 220,  timeLimit: 80,  spawnInterval: 4000, enemyShooters: 3,  targets: [{ type: 'PERSON', count: 4 }, { type: 'MOTORBIKE', count: 4 }, { type: 'CAR', count: 2 }], special: 'stampede' },
  { world: 1, level: 6,  quota: 270,  timeLimit: 80,  spawnInterval: 3800, enemyShooters: 3,  targets: [{ type: 'MOTORBIKE', count: 4 }, { type: 'CAR', count: 3 }, { type: 'PERSON', count: 4 }] },
  { world: 1, level: 7,  quota: 320,  timeLimit: 75,  spawnInterval: 3600, enemyShooters: 4,  targets: [{ type: 'CAR', count: 4 }, { type: 'MOTORBIKE', count: 4 }, { type: 'CHILD', count: 3 }] },
  { world: 1, level: 8,  quota: 380,  timeLimit: 75,  spawnInterval: 3400, enemyShooters: 4,  targets: [{ type: 'CAR', count: 5 }, { type: 'TRUCK', count: 2 }, { type: 'PERSON', count: 4 }], special: 'stealth' },
  { world: 1, level: 9,  quota: 450,  timeLimit: 70,  spawnInterval: 3200, enemyShooters: 5,  targets: [{ type: 'TRUCK', count: 4 }, { type: 'CAR', count: 4 }, { type: 'PERSON', count: 4 }] },
  { world: 1, level: 10, quota: 600,  timeLimit: 90,  spawnInterval: 2800, enemyShooters: 6,  targets: [{ type: 'TRUCK', count: 4 }, { type: 'CAR', count: 6 }, { type: 'MOTORBIKE', count: 4 }, { type: 'PERSON', count: 6 }], special: 'boss_suburb', bossType: 'GENERAL' },

  // WORLD 2: Downtown
  { world: 2, level: 1,  quota: 150,  timeLimit: 90,  spawnInterval: 4500, enemyShooters: 2,  targets: [{ type: 'PERSON', count: 6 }, { type: 'BICYCLE', count: 4 }, { type: 'VENDING', count: 3 }] },
  { world: 2, level: 2,  quota: 200,  timeLimit: 90,  spawnInterval: 4200, enemyShooters: 3,  targets: [{ type: 'VENDING', count: 4 }, { type: 'CAR', count: 4 }, { type: 'PERSON', count: 4 }] },
  { world: 2, level: 3,  quota: 260,  timeLimit: 85,  spawnInterval: 4000, enemyShooters: 3,  targets: [{ type: 'CAR', count: 5 }, { type: 'TRUCK', count: 3 }, { type: 'PERSON', count: 4 }] },
  { world: 2, level: 4,  quota: 320,  timeLimit: 85,  spawnInterval: 3800, enemyShooters: 4,  targets: [{ type: 'TRUCK', count: 4 }, { type: 'BUS', count: 2 }, { type: 'CAR', count: 4 }] },
  { world: 2, level: 5,  quota: 400,  timeLimit: 80,  spawnInterval: 3600, enemyShooters: 4,  targets: [{ type: 'BUS', count: 4 }, { type: 'TRUCK', count: 4 }, { type: 'PERSON', count: 4 }], special: 'stampede' },
  { world: 2, level: 6,  quota: 480,  timeLimit: 80,  spawnInterval: 3400, enemyShooters: 5,  targets: [{ type: 'BUS', count: 4 }, { type: 'BUILDING', count: 2 }, { type: 'TRUCK', count: 4 }] },
  { world: 2, level: 7,  quota: 560,  timeLimit: 75,  spawnInterval: 3200, enemyShooters: 5,  targets: [{ type: 'BUILDING', count: 3 }, { type: 'BUS', count: 4 }, { type: 'CAR', count: 4 }] },
  { world: 2, level: 8,  quota: 650,  timeLimit: 75,  spawnInterval: 3000, enemyShooters: 6,  targets: [{ type: 'BUILDING', count: 4 }, { type: 'BUS', count: 4 }, { type: 'TRUCK', count: 3 }], special: 'stealth' },
  { world: 2, level: 9,  quota: 750,  timeLimit: 70,  spawnInterval: 2800, enemyShooters: 6,  targets: [{ type: 'BUILDING', count: 5 }, { type: 'BUS', count: 4 }, { type: 'TRUCK', count: 4 }] },
  { world: 2, level: 10, quota: 900,  timeLimit: 90,  spawnInterval: 2600, enemyShooters: 8,  targets: [{ type: 'BUILDING', count: 6 }, { type: 'BUS', count: 6 }, { type: 'TRUCK', count: 4 }, { type: 'CAR', count: 6 }], special: 'boss_city', bossType: 'ARCHITECT' },

  // WORLD 3: Military Zone
  { world: 3, level: 1,  quota: 250,  timeLimit: 90,  spawnInterval: 4000, enemyShooters: 3,  targets: [{ type: 'JEEP', count: 4 }, { type: 'PERSON', count: 6 }, { type: 'TRUCK', count: 3 }] },
  { world: 3, level: 2,  quota: 320,  timeLimit: 90,  spawnInterval: 3800, enemyShooters: 4,  targets: [{ type: 'JEEP', count: 5 }, { type: 'TRUCK', count: 4 }, { type: 'TANK', count: 2 }] },
  { world: 3, level: 3,  quota: 400,  timeLimit: 85,  spawnInterval: 3600, enemyShooters: 4,  targets: [{ type: 'TANK', count: 3 }, { type: 'HELICOPTER', count: 2 }, { type: 'JEEP', count: 4 }] },
  { world: 3, level: 4,  quota: 500,  timeLimit: 85,  spawnInterval: 3400, enemyShooters: 5,  targets: [{ type: 'HELICOPTER', count: 4 }, { type: 'TANK', count: 4 }, { type: 'JEEP', count: 3 }] },
  { world: 3, level: 5,  quota: 620,  timeLimit: 80,  spawnInterval: 3200, enemyShooters: 5,  targets: [{ type: 'TANK', count: 5 }, { type: 'HELICOPTER', count: 4 }, { type: 'BUILDING', count: 2 }], special: 'stampede' },
  { world: 3, level: 6,  quota: 750,  timeLimit: 80,  spawnInterval: 3000, enemyShooters: 6,  targets: [{ type: 'BUILDING', count: 3 }, { type: 'TANK', count: 5 }, { type: 'HELICOPTER', count: 4 }] },
  { world: 3, level: 7,  quota: 900,  timeLimit: 75,  spawnInterval: 2800, enemyShooters: 6,  targets: [{ type: 'BUILDING', count: 4 }, { type: 'HELICOPTER', count: 5 }, { type: 'TANK', count: 4 }] },
  { world: 3, level: 8,  quota: 1050, timeLimit: 75,  spawnInterval: 2600, enemyShooters: 7,  targets: [{ type: 'BUILDING', count: 5 }, { type: 'HELICOPTER', count: 5 }, { type: 'TANK', count: 4 }], special: 'stealth' },
  { world: 3, level: 9,  quota: 1200, timeLimit: 70,  spawnInterval: 2400, enemyShooters: 8,  targets: [{ type: 'BUILDING', count: 6 }, { type: 'TANK', count: 6 }, { type: 'HELICOPTER', count: 5 }] },
  { world: 3, level: 10, quota: 1500, timeLimit: 90,  spawnInterval: 2200, enemyShooters: 10, targets: [{ type: 'BUILDING', count: 6 }, { type: 'TANK', count: 6 }, { type: 'HELICOPTER', count: 6 }, { type: 'JEEP', count: 4 }], special: 'boss_military', bossType: 'ZEUS' },

  // WORLD 4: Desert / Area 51
  { world: 4, level: 1,  quota: 400,  timeLimit: 90,  spawnInterval: 3800, enemyShooters: 4,  targets: [{ type: 'CAR', count: 5 }, { type: 'MOTORBIKE', count: 5 }, { type: 'TRUCK', count: 3 }] },
  { world: 4, level: 2,  quota: 500,  timeLimit: 85,  spawnInterval: 3600, enemyShooters: 5,  targets: [{ type: 'JEEP', count: 5 }, { type: 'TRUCK', count: 5 }, { type: 'TANK', count: 3 }] },
  { world: 4, level: 3,  quota: 650,  timeLimit: 85,  spawnInterval: 3400, enemyShooters: 5,  targets: [{ type: 'TANK', count: 4 }, { type: 'JEEP', count: 5 }, { type: 'VENDING', count: 4 }] },
  { world: 4, level: 4,  quota: 800,  timeLimit: 80,  spawnInterval: 3200, enemyShooters: 6,  targets: [{ type: 'TANK', count: 6 }, { type: 'JEEP', count: 5 }, { type: 'BUS', count: 3 }] },
  { world: 4, level: 5,  quota: 1000, timeLimit: 80,  spawnInterval: 3000, enemyShooters: 7,  targets: [{ type: 'TANK', count: 6 }, { type: 'HELICOPTER', count: 4 }, { type: 'BUILDING', count: 3 }], special: 'stampede' },
  { world: 4, level: 6,  quota: 1200, timeLimit: 75,  spawnInterval: 2800, enemyShooters: 7,  targets: [{ type: 'HELICOPTER', count: 5 }, { type: 'BUILDING', count: 4 }, { type: 'TANK', count: 5 }] },
  { world: 4, level: 7,  quota: 1400, timeLimit: 75,  spawnInterval: 2600, enemyShooters: 8,  targets: [{ type: 'BUILDING', count: 5 }, { type: 'HELICOPTER', count: 5 }, { type: 'TANK', count: 5 }] },
  { world: 4, level: 8,  quota: 1700, timeLimit: 70,  spawnInterval: 2400, enemyShooters: 8,  targets: [{ type: 'BUILDING', count: 6 }, { type: 'TANK', count: 6 }, { type: 'HELICOPTER', count: 5 }], special: 'stealth' },
  { world: 4, level: 9,  quota: 2000, timeLimit: 70,  spawnInterval: 2200, enemyShooters: 10, targets: [{ type: 'BUILDING', count: 7 }, { type: 'TANK', count: 7 }, { type: 'HELICOPTER', count: 6 }] },
  { world: 4, level: 10, quota: 2500, timeLimit: 90,  spawnInterval: 2000, enemyShooters: 12, targets: [{ type: 'BUILDING', count: 6 }, { type: 'TANK', count: 8 }, { type: 'HELICOPTER', count: 6 }, { type: 'JEEP', count: 4 }], special: 'boss_desert', bossType: 'AGENT_ZERO' },

  // WORLD 5: Arctic
  { world: 5, level: 1,  quota: 600,  timeLimit: 90,  spawnInterval: 3600, enemyShooters: 4,  targets: [{ type: 'TRUCK', count: 5 }, { type: 'BUILDING', count: 3 }, { type: 'PERSON', count: 5 }] },
  { world: 5, level: 2,  quota: 800,  timeLimit: 85,  spawnInterval: 3400, enemyShooters: 5,  targets: [{ type: 'BUILDING', count: 5 }, { type: 'TRUCK', count: 5 }, { type: 'TRAIN', count: 2 }] },
  { world: 5, level: 3,  quota: 1000, timeLimit: 85,  spawnInterval: 3200, enemyShooters: 6,  targets: [{ type: 'TRAIN', count: 3 }, { type: 'BUILDING', count: 5 }, { type: 'TRUCK', count: 4 }] },
  { world: 5, level: 4,  quota: 1300, timeLimit: 80,  spawnInterval: 3000, enemyShooters: 7,  targets: [{ type: 'TRAIN', count: 4 }, { type: 'HELICOPTER', count: 4 }, { type: 'BUILDING', count: 4 }] },
  { world: 5, level: 5,  quota: 1600, timeLimit: 80,  spawnInterval: 2800, enemyShooters: 7,  targets: [{ type: 'TRAIN', count: 5 }, { type: 'HELICOPTER', count: 5 }, { type: 'BUILDING', count: 4 }], special: 'stampede' },
  { world: 5, level: 6,  quota: 1900, timeLimit: 75,  spawnInterval: 2600, enemyShooters: 8,  targets: [{ type: 'SKYSCRAPER', count: 2 }, { type: 'TRAIN', count: 5 }, { type: 'BUILDING', count: 5 }] },
  { world: 5, level: 7,  quota: 2300, timeLimit: 75,  spawnInterval: 2400, enemyShooters: 9,  targets: [{ type: 'SKYSCRAPER', count: 3 }, { type: 'TRAIN', count: 5 }, { type: 'HELICOPTER', count: 5 }] },
  { world: 5, level: 8,  quota: 2800, timeLimit: 70,  spawnInterval: 2200, enemyShooters: 10, targets: [{ type: 'SKYSCRAPER', count: 4 }, { type: 'TRAIN', count: 5 }, { type: 'BUILDING', count: 5 }], special: 'stealth' },
  { world: 5, level: 9,  quota: 3300, timeLimit: 70,  spawnInterval: 2000, enemyShooters: 11, targets: [{ type: 'SKYSCRAPER', count: 5 }, { type: 'TRAIN', count: 6 }, { type: 'BUILDING', count: 5 }] },
  { world: 5, level: 10, quota: 4000, timeLimit: 90,  spawnInterval: 1800, enemyShooters: 12, targets: [{ type: 'SKYSCRAPER', count: 6 }, { type: 'TRAIN', count: 6 }, { type: 'BUILDING', count: 6 }, { type: 'HELICOPTER', count: 4 }], special: 'boss_arctic', bossType: 'BLIZZARD' },

  // WORLD 6: Mega City
  { world: 6, level: 1,  quota: 1000, timeLimit: 90,  spawnInterval: 3200, enemyShooters: 6,  targets: [{ type: 'SKYSCRAPER', count: 3 }, { type: 'BUILDING', count: 6 }, { type: 'TRAIN', count: 4 }] },
  { world: 6, level: 2,  quota: 1500, timeLimit: 85,  spawnInterval: 3000, enemyShooters: 7,  targets: [{ type: 'SKYSCRAPER', count: 4 }, { type: 'BUILDING', count: 6 }, { type: 'EIFFEL', count: 1 }] },
  { world: 6, level: 3,  quota: 2000, timeLimit: 85,  spawnInterval: 2800, enemyShooters: 8,  targets: [{ type: 'EIFFEL', count: 2 }, { type: 'SKYSCRAPER', count: 4 }, { type: 'TRAIN', count: 5 }] },
  { world: 6, level: 4,  quota: 2600, timeLimit: 80,  spawnInterval: 2600, enemyShooters: 9,  targets: [{ type: 'LIBERTY', count: 2 }, { type: 'EIFFEL', count: 2 }, { type: 'SKYSCRAPER', count: 4 }] },
  { world: 6, level: 5,  quota: 3200, timeLimit: 80,  spawnInterval: 2400, enemyShooters: 10, targets: [{ type: 'SPHINX', count: 2 }, { type: 'LIBERTY', count: 2 }, { type: 'EIFFEL', count: 2 }, { type: 'SKYSCRAPER', count: 3 }], special: 'stampede' },
  { world: 6, level: 6,  quota: 4000, timeLimit: 75,  spawnInterval: 2200, enemyShooters: 11, targets: [{ type: 'SPHINX', count: 3 }, { type: 'LIBERTY', count: 2 }, { type: 'EIFFEL', count: 2 }, { type: 'SKYSCRAPER', count: 4 }] },
  { world: 6, level: 7,  quota: 5000, timeLimit: 75,  spawnInterval: 2000, enemyShooters: 12, targets: [{ type: 'SPHINX', count: 3 }, { type: 'LIBERTY', count: 3 }, { type: 'EIFFEL', count: 3 }, { type: 'SKYSCRAPER', count: 4 }] },
  { world: 6, level: 8,  quota: 6000, timeLimit: 70,  spawnInterval: 1800, enemyShooters: 13, targets: [{ type: 'SPHINX', count: 4 }, { type: 'LIBERTY', count: 3 }, { type: 'EIFFEL', count: 3 }, { type: 'SKYSCRAPER', count: 5 }], special: 'stealth' },
  { world: 6, level: 9,  quota: 7500, timeLimit: 70,  spawnInterval: 1600, enemyShooters: 14, targets: [{ type: 'SPHINX', count: 4 }, { type: 'LIBERTY', count: 4 }, { type: 'EIFFEL', count: 4 }, { type: 'SKYSCRAPER', count: 5 }] },
  { world: 6, level: 10, quota: 9999, timeLimit: 120, spawnInterval: 1400, enemyShooters: 16, targets: [{ type: 'SPHINX', count: 5 }, { type: 'LIBERTY', count: 4 }, { type: 'EIFFEL', count: 4 }, { type: 'SKYSCRAPER', count: 6 }, { type: 'BUILDING', count: 8 }], special: 'final_boss', bossType: 'THE_ARCHIVE' },
];

export function getLevelData(world, level) {
  return LEVEL_DATA.find(d => d.world === world && d.level === level) || LEVEL_DATA[0];
}
