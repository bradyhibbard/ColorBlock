export const COLORS = {
  UI_BG: 0x0a0a1a, UI_BORDER: 0x33ff99, UI_TEXT: 0x33ff99,
  UI_ACCENT: 0xff3366, UI_GOLD: 0xffdd00, UI_DARK: 0x001a0a,
  BEAM_SCAN: 0x3399ff, BEAM_LOCK: 0xffee00, BEAM_REEL: 0xffffff,
  SKY_COUNTRYSIDE: 0x87ceeb, SKY_SUBURB: 0xb0c4de, SKY_CITY: 0x0d0d2b,
  SKY_MILITARY: 0x5c5c3d, SKY_DESERT: 0xff8c42, SKY_ARCTIC: 0xe0ffff, SKY_SPACE: 0x000000,
  GROUND_COUNTRYSIDE: 0x2d8a2d, GROUND_SUBURB: 0x555555, GROUND_CITY: 0x222222,
  GROUND_MILITARY: 0x3d5c1a, GROUND_DESERT: 0xd4a055, GROUND_ARCTIC: 0xddeeff,
  WEIGHT_TINY: 0xaaffaa, WEIGHT_SMALL: 0x66ff66, WEIGHT_MEDIUM: 0xffff00,
  WEIGHT_HEAVY: 0xffaa00, WEIGHT_MASSIVE: 0xff6600, WEIGHT_COLOSSAL: 0xff0000,
};

export const BEAM_LEVELS = {
  1:  { name: 'STATIC SPARK',   maxWeight: 1, energyNeeded: 80,   color: 0x66aaff, width: 40 },
  2:  { name: 'MICRO BEAM',     maxWeight: 2, energyNeeded: 160,  color: 0x44ddff, width: 50 },
  3:  { name: 'STANDARD BEAM',  maxWeight: 3, energyNeeded: 300,  color: 0x33ff99, width: 65 },
  4:  { name: 'POWER BEAM',     maxWeight: 4, energyNeeded: 500,  color: 0xaaff00, width: 80 },
  5:  { name: 'SUPER BEAM',     maxWeight: 5, energyNeeded: 800,  color: 0xffdd00, width: 95 },
  6:  { name: 'MEGA BEAM',      maxWeight: 6, energyNeeded: 1200, color: 0xffaa00, width: 115 },
  7:  { name: 'ULTRA BEAM',     maxWeight: 7, energyNeeded: 1800, color: 0xff6600, width: 135 },
  8:  { name: 'HYPER BEAM',     maxWeight: 8, energyNeeded: 2600, color: 0xff3300, width: 160 },
  9:  { name: 'OMEGA BEAM',     maxWeight: 9, energyNeeded: 3600, color: 0xff00ff, width: 185 },
  10: { name: 'SINGULARITY',    maxWeight: 10,energyNeeded: 9999, color: 0xffffff, width: 220 },
};

export const TARGET_TYPES = {
  GNOME:      { weight: 1, energy: 5,   points: 50,   label: 'Garden Gnome',        color: 0xff4444, w: 16,  h: 20  },
  CAT:        { weight: 1, energy: 6,   points: 60,   label: 'Cat',                 color: 0xffaa66, w: 18,  h: 14  },
  CHICKEN:    { weight: 1, energy: 5,   points: 50,   label: 'Chicken',             color: 0xffee88, w: 16,  h: 16  },
  MAILBOX:    { weight: 1, energy: 4,   points: 40,   label: 'Mailbox',             color: 0x4488ff, w: 14,  h: 20  },
  DOG:        { weight: 2, energy: 12,  points: 100,  label: 'Dog',                 color: 0xcc8844, w: 24,  h: 18  },
  SHEEP:      { weight: 2, energy: 10,  points: 90,   label: 'Sheep',               color: 0xeeeedd, w: 26,  h: 20  },
  CHILD:      { weight: 2, energy: 14,  points: 120,  label: 'Kid',                 color: 0xffcc88, w: 14,  h: 22  },
  FARMER:     { weight: 3, energy: 20,  points: 200,  label: 'Farmer',              color: 0x88aa44, w: 16,  h: 28  },
  PERSON:     { weight: 3, energy: 18,  points: 180,  label: 'Person',              color: 0xffbb88, w: 16,  h: 28  },
  BICYCLE:    { weight: 3, energy: 15,  points: 150,  label: 'Bicycle',             color: 0x888888, w: 28,  h: 22  },
  COW:        { weight: 4, energy: 35,  points: 350,  label: 'Cow',                 color: 0xffffff, w: 40,  h: 28  },
  MOTORBIKE:  { weight: 4, energy: 30,  points: 300,  label: 'Motorbike',           color: 0x444444, w: 36,  h: 22  },
  MARKET:     { weight: 4, energy: 28,  points: 280,  label: 'Market Stall',        color: 0xff8844, w: 44,  h: 32  },
  CAR:        { weight: 5, energy: 55,  points: 550,  label: 'Car',                 color: 0x4466ff, w: 56,  h: 26  },
  TRUCK:      { weight: 5, energy: 50,  points: 500,  label: 'Truck',               color: 0xaa4422, w: 68,  h: 30  },
  VENDING:    { weight: 5, energy: 45,  points: 450,  label: 'Vending Machine',     color: 0xff2244, w: 22,  h: 40  },
  BUS:        { weight: 6, energy: 90,  points: 900,  label: 'Bus',                 color: 0xffdd00, w: 88,  h: 36  },
  JEEP:       { weight: 6, energy: 80,  points: 800,  label: 'Military Jeep',       color: 0x446622, w: 64,  h: 32  },
  TANK:       { weight: 7, energy: 140, points: 1400, label: 'Tank',                color: 0x556633, w: 80,  h: 38  },
  HELICOPTER: { weight: 7, energy: 150, points: 1500, label: 'Helicopter',          color: 0x888888, w: 80,  h: 32  },
  TRAIN:      { weight: 8, energy: 250, points: 2500, label: 'Train',               color: 0xaaaaaa, w: 160, h: 36  },
  BUILDING:   { weight: 8, energy: 220, points: 2200, label: 'Building',            color: 0x556677, w: 60,  h: 80  },
  SKYSCRAPER: { weight: 9, energy: 400, points: 4000, label: 'Skyscraper',          color: 0x334466, w: 70,  h: 130 },
  EIFFEL:     { weight: 10,energy: 800, points: 8000, label: 'Eiffel Tower',        color: 0xbbaa88, w: 60,  h: 160 },
  LIBERTY:    { weight: 10,energy: 800, points: 8000, label: 'Statue of Liberty',   color: 0x88bb99, w: 50,  h: 150 },
  SPHINX:     { weight: 10,energy: 700, points: 7000, label: 'The Sphinx',          color: 0xddbb88, w: 120, h: 70  },
};

export const WORLDS = [
  { id: 0, name: 'Countryside',    skyColor: 0x87ceeb, groundColor: 0x2d8a2d, unlocked: true,  levels: 10, targets: ['GNOME','CAT','CHICKEN','DOG','SHEEP','FARMER','COW','PERSON'] },
  { id: 1, name: 'Suburbia',       skyColor: 0xb0c4de, groundColor: 0x555555, unlocked: false, levels: 10, targets: ['CAT','DOG','CHILD','MAILBOX','BICYCLE','PERSON','CAR','MOTORBIKE'] },
  { id: 2, name: 'Downtown',       skyColor: 0x0d0d2b, groundColor: 0x222222, unlocked: false, levels: 10, targets: ['PERSON','BICYCLE','CAR','TRUCK','BUS','VENDING','BUILDING'] },
  { id: 3, name: 'Military Zone',  skyColor: 0x5c5c3d, groundColor: 0x3d5c1a, unlocked: false, levels: 10, targets: ['JEEP','TRUCK','TANK','HELICOPTER','PERSON','BUILDING'] },
  { id: 4, name: 'Desert / Area 51',skyColor:0xff8c42, groundColor: 0xd4a055, unlocked: false, levels: 10, targets: ['CAR','MOTORBIKE','TRUCK','JEEP','TANK','VENDING'] },
  { id: 5, name: 'Arctic',         skyColor: 0xe0ffff, groundColor: 0xddeeff, unlocked: false, levels: 10, targets: ['SHEEP','DOG','CAR','TRUCK','BUILDING','TRAIN'] },
  { id: 6, name: 'Mega City',      skyColor: 0x000000, groundColor: 0x222222, unlocked: false, levels: 10, targets: ['BUS','BUILDING','TRAIN','SKYSCRAPER','EIFFEL','LIBERTY','SPHINX'] },
];

export const GAME_WIDTH  = 390;
export const GAME_HEIGHT = 844;
