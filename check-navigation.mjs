import assert from "node:assert/strict";
import { PerspectiveCamera, Vector3 } from "three";
import { objectViews, getObjectFrame, easeCameraTravel } from "./src/data/roomNavigation.js";

const sizes = [[2560, 1080], [1920, 1080], [1856, 904], [1812, 914], [1366, 768], [1024, 768], [768, 1024], [390, 844], [320, 568], [844, 390]];
let checked = 0;
for (const [width, height] of sizes) {
  for (const [id, view] of Object.entries(objectViews)) {
    const frame = getObjectFrame(id, width, height);
    assert.ok([...frame.position, ...frame.target, frame.fov].every(Number.isFinite), `${id}: invalid pose`);
    const camera = new PerspectiveCamera(frame.fov, width / height, 0.1, 100);
    camera.position.copy(frame.position);
    camera.lookAt(frame.target);
    camera.setViewOffset(width, height, frame.offset.x * width, frame.offset.y * height, width, height);
    camera.updateMatrixWorld();
    const center = new Vector3(...view.target).project(camera);
    assert.ok(Math.abs(center.x) < 1 && Math.abs(center.y) < 1 && center.z < 1, `${id}: object outside viewport`);
    const { area } = frame;
    const pixelX = (center.x + 1) * width / 2;
    const pixelY = (1 - center.y) * height / 2;
    assert.ok(Math.abs(pixelX - area.x - area.width / 2) < 0.01, `${id}: horizontally off-center`);
    assert.ok(Math.abs(pixelY - area.y - area.height / 2) < 0.01, `${id}: vertically off-center`);
    const direction = new Vector3(...view.direction).normalize();
    const right = new Vector3(direction.z, 0, -direction.x).normalize();
    const up = new Vector3().crossVectors(direction, right).normalize();
    for (const x of [-1, 1]) for (const y of [-1, 1]) {
      const corner = new Vector3(...view.target).addScaledVector(right, view.width * x / 2).addScaledVector(up, view.height * y / 2).project(camera);
      assert.ok(Math.abs(corner.x) <= 1 && Math.abs(corner.y) <= 1, `${id} at ${width}x${height}: cropped frame`);
      const xPixel = (corner.x + 1) * width / 2;
      const yPixel = (1 - corner.y) * height / 2;
      assert.ok(xPixel >= area.x && xPixel <= area.x + area.width && yPixel >= area.y && yPixel <= area.y + area.height,
        `${id} at ${width}x${height}: object overlaps panel or margins`);
    }
    checked++;
  }
}
assert.equal(getObjectFrame("missing", 1366, 768), null);
assert.equal(getObjectFrame("teddy", 1366, 768), null, "the teddy sound must not have a camera destination");
assert.equal(easeCameraTravel(0), 0);
assert.equal(easeCameraTravel(1), 1);
assert.equal(easeCameraTravel(0.5), 0.5);
assert.ok(easeCameraTravel(0.1) < 0.02, "travel must start gently");
assert.ok(easeCameraTravel(0.9) > 0.98, "travel must finish gently");
for (let step = 1; step <= 100; step++) assert.ok(easeCameraTravel(step / 100) >= easeCameraTravel((step - 1) / 100));
console.log(`${checked} camera frames verified; easing is continuous and monotonic.`);
