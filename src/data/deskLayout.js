export const deskTop = 0.94;
export const deskBounds = { left: -1.825, right: 1.825, back: -3.07, front: -1.93 };

// Footprints include handles, tabs and cables, not just the main boxes.
export const deskItems = {
  monitor: { x: -0.25, z: -2.7, width: 0.88, back: 0.36, front: 0.23 },
  keyboard: { x: -0.34, z: -2.08, width: 0.82, depth: 0.22 },
  mouse: { x: -0.98, z: -2.09, width: 0.16, depth: 0.2 },
  mug: { x: -1.53, z: -2.83, left: 0.11, right: 0.24, depth: 0.22 },
  server: { x: -0.99, z: -2.83, width: 0.5, depth: 0.28 },
  board: { x: -1.5, z: -2.32, width: 0.34, depth: 0.26, rotation: 0.16 },
  diskA: { x: 0.67, z: -2.91, width: 0.28, depth: 0.28 },
  diskB: { x: 1.02, z: -2.91, width: 0.28, depth: 0.28 },
  folder: { x: 0.6, z: -2.28, width: 0.74, back: 0.375, front: 0.28, rotation: -0.06 },
  phone: { x: 1.43, z: -2.3, left: 0.415, right: 0.36, depth: 0.48 },
};

export function onDesk(id, centerHeight = 0) {
  const item = deskItems[id];
  return [item.x, deskTop + centerHeight, item.z];
}

export const phoneKeys = Array.from("123456789*0#", (digit, index) => ({
  digit,
  x: -0.12 + (index % 3) * 0.12,
  z: -0.01 + Math.floor(index / 3) * 0.06,
  frequencies: [[697, 770, 852, 941][Math.floor(index / 3)], [1209, 1336, 1477][index % 3]],
}));

export const phoneKeySize = { width: 0.065, height: 0.022, depth: 0.048, centerY: 0.159 };
