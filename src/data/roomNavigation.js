import * as THREE from "three";
import { deskItems } from "./deskLayout.js";

// World coordinates include the room's -1.15 vertical offset.
export const objectViews = {
  projects: { target: [deskItems.monitor.x, 0.36, -2.589], direction: [0, 0, 1], width: 0.68, height: 0.43 },
  about: { target: [-3.56, 1.17, -2.72], direction: [1, 0, 0], width: 0.74, height: 0.88 },
  skills: { target: [-2.6, 0.63, -3.53], direction: [0, 0.02, 1], width: 1.82, height: 1.2 },
  education: { target: [1.55, 0.9, -3.4], direction: [0, 0.02, 1], width: 1.46, height: 1.04 },
  contact: { target: [deskItems.phone.x, -0.03, deskItems.phone.z], direction: [0.08, 1.1, 1], width: 0.86, height: 0.66 },
  cv: { target: [deskItems.folder.x, -0.135, deskItems.folder.z], direction: [0.05, 1.6, 1], width: 0.86, height: 0.58 },
};

export function getObjectFrame(sectionId, width, height) {
  const view = objectViews[sectionId];
  if (!view) return null;
  const aspect = width / Math.max(height, 1);
  const compact = width <= 760 || height <= 540;
  const fov = sectionId === "projects" ? 40 : 38;
  const tangent = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const center = new THREE.Vector3(...view.target);
  const direction = new THREE.Vector3(...view.direction).normalize();
  const fullView = sectionId === "projects";
  // Match .focused-panel: 52vw (max 860px) on desktop, bottom 62% on mobile.
  const panelLeft = width - Math.min(width * 0.52, 860) - 24;
  const area = fullView ? { x: 0, y: 0, width, height }
    : compact ? { x: 12, y: 12, width: width - 24, height: height * 0.38 - 24 }
      : { x: 24, y: 24, width: panelLeft - 48, height: height - 48 };
  const centerX = area.x + area.width / 2;
  const centerY = area.y + area.height / 2;
  const offset = new THREE.Vector2(0.5 - centerX / width, 0.5 - centerY / height);
  const fill = fullView ? 0.67 : 0.9;
  const distance = Math.max(
    view.height / (2 * tangent * (area.height / height) * fill),
    view.width / (2 * tangent * aspect * (area.width / width) * (fullView ? 0.76 : fill)),
  );
  const position = center.clone().addScaledVector(direction, distance);
  const target = center.clone();
  // An off-axis projection centers the object beside the panel without a sideways viewing angle.
  return { position, target, offset, area, fov, compact };
}

export function easeCameraTravel(progress) {
  const t = THREE.MathUtils.clamp(progress, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}
