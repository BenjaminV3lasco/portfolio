import assert from "node:assert/strict";
import { deskTop, deskBounds, deskItems, onDesk, phoneKeys, phoneKeySize } from "./src/data/deskLayout.js";

const boxes = Object.entries(deskItems).map(([id, item]) => {
  const rotation = item.rotation ?? 0;
  const points = [];
  for (const x of [-(item.left ?? item.width / 2), item.right ?? item.width / 2]) {
    for (const z of [-(item.back ?? item.depth / 2), item.front ?? item.depth / 2]) {
      points.push([item.x + x * Math.cos(rotation) + z * Math.sin(rotation), item.z - x * Math.sin(rotation) + z * Math.cos(rotation)]);
    }
  }
  const box = { id, left: Math.min(...points.map(p => p[0])), right: Math.max(...points.map(p => p[0])), back: Math.min(...points.map(p => p[1])), front: Math.max(...points.map(p => p[1])) };
  assert.ok(box.left >= deskBounds.left && box.right <= deskBounds.right && box.back >= deskBounds.back && box.front <= deskBounds.front, `${id} overhangs the desk`);
  assert.equal(onDesk(id, 0.02)[1] - 0.02, deskTop);
  return box;
});
for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
  const one = boxes[a], two = boxes[b];
  assert.ok(one.right <= two.left || two.right <= one.left || one.front <= two.back || two.front <= one.back, `${one.id} intersects ${two.id}`);
}
assert.equal(phoneKeys.length, 12);
assert.equal(new Set(phoneKeys.map(key => key.digit)).size, 12);
assert.equal(new Set(phoneKeys.map(key => key.frequencies.join(":"))).size, 12);
assert.ok(Math.abs(phoneKeySize.centerY - phoneKeySize.height / 2 - 0.148) < 0.00001, "keys must rest on the faceplate");
for (const key of phoneKeys) assert.ok(key.frequencies.every(frequency => frequency >= 697 && frequency <= 1477));
console.log(`${boxes.length} desk footprints verified: no overlap or overhang; 12 supported telephone keys with distinct tone pairs.`);
