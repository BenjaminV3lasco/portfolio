import { useFrame } from "@react-three/fiber";
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { deskTop, deskItems, onDesk, phoneKeys, phoneKeySize } from "../data/deskLayout.js";

const ProximityContext = createContext(null);

// Small, deterministic textures preserve the pixelated look without external assets.
function surfaceTexture(kind, repeat) {
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const noise = ((x * 37 + y * 61 + x * y * 13) % 17) - 8;
      const grain = kind === "wood" ? Math.sin(y * 0.8 + Math.sin(x * 0.12)) * 7 : 0;
      const seam = kind === "floor" && (y % 16 === 0 || (x + Math.floor(y / 16) * 23) % 64 === 0);
      const weave = kind === "fabric" ? (x % 3 === 0 ? 4 : 0) + (y % 3 === 0 ? 3 : 0) : 0;
      const plaster = kind === "wall" ? Math.sin(x * 0.18) * Math.sin(y * 0.23) * 2 : 0;
      const fiber = kind === "paper" && (x * 11 + y * 7) % 29 === 0 ? 3 : 0;
      const grainStrength = kind === "plastic" ? 0.18 : kind === "wall" ? 0.28 : 0.5;
      const value = Math.max(0, Math.min(255, Math.round(247 + noise * grainStrength + grain + plaster - weave - fiber - (seam ? 19 : 0))));
      const offset = (y * size + x) * 4;
      pixels.set([value, value, value, 255], offset);
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const fabricTexture = surfaceTexture("fabric", 2);
const paperTexture = surfaceTexture("paper", 1);
const plasticTexture = surfaceTexture("plastic", 2);
const wallMaterial = new THREE.MeshStandardMaterial({ color: "#55565a", map: surfaceTexture("wall", 4), roughness: 1, flatShading: true });
const floorMaterial = new THREE.MeshStandardMaterial({ color: "#3c393a", map: surfaceTexture("floor", 4), roughness: 0.94, flatShading: true });
const woodMaterial = new THREE.MeshStandardMaterial({ color: "#76583c", map: surfaceTexture("wood", 2), roughness: 0.9, flatShading: true });
const plasticMaterial = new THREE.MeshStandardMaterial({ color: "#c7bda7", map: plasticTexture, roughness: 0.72, flatShading: true });
const darkMaterial = new THREE.MeshStandardMaterial({ color: "#15161a", roughness: 0.8, flatShading: true });
const skinMaterial = new THREE.MeshStandardMaterial({ color: "#c28b64", roughness: 0.85, flatShading: true });
const shirtMaterial = new THREE.MeshStandardMaterial({ color: "#274057", roughness: 0.9, flatShading: true });
const pantsMaterial = new THREE.MeshStandardMaterial({ color: "#202126", roughness: 0.95, flatShading: true });
const glowMaterial = new THREE.MeshStandardMaterial({
  color: "#63f28a",
  emissive: "#1e7c36",
  emissiveIntensity: 0.85,
  flatShading: true,
});

export function RetroRoom({
  phoneSurface,
  phoneInteraction,
  proximityEnabled = true,
  activeSection,
  hoveredSection,
  onHoverSection,
  onMovePointer,
  onSelectSection,
  onTeddyPress,
  onUnhoverSection,
}) {
  const proximity = useRef({ x: 0, y: 0, visible: false, enabled: false });
  proximity.current.enabled = proximityEnabled;
  useEffect(() => {
    function move(event) {
      proximity.current.visible = event.pointerType === "mouse" && event.target instanceof HTMLCanvasElement;
      proximity.current.x = event.clientX;
      proximity.current.y = event.clientY;
    }
    function hide() { proximity.current.visible = false; }
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);
  return (
    <ProximityContext.Provider value={proximity}>
    <group position={[0, -1.15, 0]}>
      <RoomShell />
      <Desk
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
      <SeatedPerson />
      <RoomProps />
      <LeftFurniture />
      <RedSofa onTeddyPress={onTeddyPress} />
      <Whiteboard
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
      <EducationDistrict
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
      <ProfileCard
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
      <Phone
        surfaceRef={phoneSurface}
        interaction={phoneInteraction}
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
      <Folder
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
      <Door
        hovered={hoveredSection === "exit"}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
    </group>
    </ProximityContext.Provider>
  );
}

function RoomShell() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 7.6, 4, 4]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>
      <mesh receiveShadow position={[0, 0.045, -3.66]}>
        <boxGeometry args={[7.48, 0.17, 0.06]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <mesh receiveShadow position={[-3.71, 0.045, 0]}>
        <boxGeometry args={[0.06, 0.17, 7.4]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <mesh receiveShadow position={[0, 1.8, -3.75]}>
        <boxGeometry args={[7.6, 3.7, 0.12, 4, 2, 1]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh receiveShadow position={[-3.8, 1.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[7.6, 3.7, 0.12, 4, 2, 1]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 3.55, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 7.6, 2, 2]} />
        <meshStandardMaterial color="#17171c" roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[-2.9, 2.45, -3.62]}>
        <boxGeometry args={[0.44, 0.18, 0.12]} />
        <meshStandardMaterial color="#253b32" emissive="#234c32" emissiveIntensity={0.5} roughness={0.8} flatShading />
      </mesh>
      <WallLight />
      <LeftWallSet />
    </group>
  );
}

function WallLight() {
  return (
    <group position={[-0.34, 2.68, -3.66]}>
      <mesh castShadow>
        <boxGeometry args={[0.66, 0.12, 0.08]} />
        <meshStandardMaterial color="#1d2520" roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[0.5, 0.045, 0.035]} />
        <meshStandardMaterial color="#9dffb5" emissive="#2f7d45" emissiveIntensity={0.45} roughness={0.72} flatShading />
      </mesh>
    </group>
  );
}

function ExitSign({ position = [3.08, 2.28, -3.66] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.24, 0.06]} />
        <meshStandardMaterial color="#18231e" roughness={0.86} flatShading />
      </mesh>
      <LabelPlane text="EXIT" color="#63f28a" width={0.44} height={0.14} position={[0, 0, 0.04]} />
    </group>
  );
}

function LabelPlane({ color = "#f2eadb", height, position, rotation = [0, 0, 0], text, width, square = false }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = square ? 96 : 256;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = color;
    const fontSize = square ? 72 : 58;
    context.font = `900 ${fontSize}px Trebuchet MS, Arial, sans-serif`;
    const fittedSize = Math.min(fontSize, Math.floor(fontSize * (canvas.width - 20) / Math.max(context.measureText(text).width, 1)));
    context.font = `900 ${fittedSize}px Trebuchet MS, Arial, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

    const labelTexture = new THREE.CanvasTexture(canvas);
    labelTexture.magFilter = THREE.NearestFilter;
    labelTexture.minFilter = THREE.NearestFilter;
    return labelTexture;
  }, [color, text, square]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function LeftWallSet() {
  return (
    <group rotation={[0, Math.PI / 2, 0]} position={[-3.72, 0, 0]}>
      <group position={[0, -0.34, 0]}>
      <mesh castShadow position={[0.88, 2.08, 0.08]}>
        <boxGeometry args={[0.95, 0.72, 0.055]} />
        <meshStandardMaterial color="#1d2530" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.88, 2.08, 0.12]}>
        <boxGeometry args={[0.78, 0.06, 0.035]} />
        <meshStandardMaterial color="#30495f" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.57, 1.86, 0.12]}>
        <boxGeometry args={[0.16, 0.28, 0.05]} />
        <meshStandardMaterial color="#5d6674" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.86, 1.95, 0.12]}>
        <boxGeometry args={[0.17, 0.42, 0.05]} />
        <meshStandardMaterial color="#7b715e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[1.15, 1.88, 0.12]}>
        <boxGeometry args={[0.2, 0.32, 0.05]} />
        <meshStandardMaterial color="#55705d" roughness={0.9} flatShading />
      </mesh>
      </group>
      <mesh castShadow position={[-1.62, 1.52, 0.08]}>
        <boxGeometry args={[0.68, 0.08, 0.12]} />
        <meshStandardMaterial color="#2d2522" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.78, 1.66, 0.12]}>
        <boxGeometry args={[0.12, 0.28, 0.16]} />
        <meshStandardMaterial color="#594e72" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.62, 1.66, 0.12]}>
        <boxGeometry args={[0.12, 0.32, 0.16]} />
        <meshStandardMaterial color="#87613e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.46, 1.66, 0.12]}>
        <boxGeometry args={[0.12, 0.25, 0.16]} />
        <meshStandardMaterial color="#46635a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.3, 1.45, 0.1]}>
        <boxGeometry args={[0.25, 0.22, 0.035]} />
        <meshStandardMaterial color="#d7b357" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.06, 1.32, 0.1]}>
        <boxGeometry args={[0.24, 0.2, 0.035]} />
        <meshStandardMaterial color="#7aa071" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function RoomProps() {
  return (
    <group>
      <group position={onDesk("mug")}>
      <mesh castShadow receiveShadow position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.11, 0.09, 0.28, 8]} />
        <meshStandardMaterial color="#b8c6cf" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 0.281, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.085, 8]} />
        <meshStandardMaterial color="#30251e" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.13, 0.15, 0]}>
        <torusGeometry args={[0.08, 0.025, 4, 8]} />
        <meshStandardMaterial color="#b8c6cf" roughness={0.8} flatShading />
      </mesh>
      <LabelPlane text="</>" color="#304d53" width={0.12} height={0.1} position={[0, 0.15, 0.105]} />
      </group>
      <FloppyDisk position={onDesk("diskB", 0.0125)} color="#27364a" />
      <FloppyDisk position={onDesk("diskA", 0.0125)} color="#4a2f3d" />
      <DevelopmentServer />
      <CircuitBoard />
      <mesh castShadow position={[-2.9, 2.48, -3.58]}>
        <boxGeometry args={[1.15, 0.22, 0.055]} />
        <meshStandardMaterial color="#1d252a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-2.9, 2.48, -3.53]}>
        <boxGeometry args={[0.82, 0.055, 0.035]} />
        <meshStandardMaterial color="#27372f" roughness={0.9} flatShading />
      </mesh>
      <LabelPlane text="SYSTEMS ENGINEERING" width={0.98} height={0.12} position={[-2.9, 2.48, -3.5]} color="#b7d9bd" />
    </group>
  );
}

function FloppyDisk({ position, color }) {
  return <group position={position}>
    <mesh castShadow receiveShadow><boxGeometry args={[0.28, 0.025, 0.28]} /><meshStandardMaterial color={color} map={plasticTexture} roughness={0.85} flatShading /></mesh>
    <mesh position={[0, 0.0145, 0.065]}><boxGeometry args={[0.21, 0.004, 0.12]} /><meshStandardMaterial color="#c9c7b8" map={paperTexture} /></mesh>
    <mesh position={[0, 0.0155, -0.09]}><boxGeometry args={[0.15, 0.006, 0.09]} /><meshStandardMaterial color="#718183" metalness={0.3} roughness={0.6} /></mesh>
  </group>;
}

function DevelopmentServer() {
  return <group position={onDesk("server")}>
    <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
      <boxGeometry args={[0.5, 0.12, 0.28]} /><meshStandardMaterial color="#30383c" map={plasticTexture} roughness={0.78} flatShading />
    </mesh>
    <LabelPlane text="DEV SERVER" color="#bfccbc" width={0.27} height={0.055} position={[-0.05, 0.065, 0.141]} />
    {["#91c99a", "#d7b967", "#7aa9c0"].map((color, index) => <mesh key={color} position={[-0.16 + index * 0.16, 0.123, -0.08]}>
      <boxGeometry args={[0.045, 0.006, 0.025]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} />
    </mesh>)}
    {[-0.14, -0.07, 0, 0.07, 0.14].map(x => <mesh key={x} position={[x, 0.121, 0.03]}>
      <boxGeometry args={[0.035, 0.002, 0.08]} /><primitive object={darkMaterial} attach="material" />
    </mesh>)}
  </group>;
}

function CircuitBoard() {
  return <group position={onDesk("board")} rotation={[0, deskItems.board.rotation, 0]}>
    <mesh castShadow receiveShadow position={[0, 0.012, 0]}>
      <boxGeometry args={[0.34, 0.024, 0.26]} /><meshStandardMaterial color="#265d45" roughness={0.82} flatShading />
    </mesh>
    <mesh castShadow position={[0, 0.039, 0]}><boxGeometry args={[0.12, 0.03, 0.1]} /><primitive object={darkMaterial} attach="material" /></mesh>
    {[-1, 1].flatMap(side => [-0.035, 0, 0.035].map(z => <mesh key={`${side}-${z}`} position={[side * 0.077, 0.028, z]}>
      <boxGeometry args={[0.034, 0.008, 0.012]} /><meshStandardMaterial color="#aeab8c" metalness={0.35} roughness={0.65} />
    </mesh>))}
    {[-0.12, 0.12].map(x => <mesh key={x} position={[x, 0.025, -0.04]}><boxGeometry args={[0.006, 0.002, 0.12]} /><meshStandardMaterial color="#a99355" /></mesh>)}
    <mesh position={[-0.12, 0.044, 0.08]}><boxGeometry args={[0.065, 0.04, 0.065]} /><meshStandardMaterial color="#8d999b" metalness={0.35} roughness={0.62} /></mesh>
    <LabelPlane text="GPIO" color="#d3dac0" width={0.07} height={0.04} position={[0.09, 0.0255, 0.08]} rotation={[-Math.PI / 2, 0, 0]} />
  </group>;
}

function LeftFurniture() {
  return (
    <group position={[-2.72, 0, -2.35]}>
      <mesh castShadow receiveShadow position={[0, 0.46, 0]}>
        <boxGeometry args={[0.92, 0.92, 0.42]} />
        <meshStandardMaterial color="#3a2a24" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0.78, 0.23]}>
        <boxGeometry args={[0.78, 0.055, 0.06]} />
        <meshStandardMaterial color="#6c4a2e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.28, 0.58, 0.24]}>
        <boxGeometry args={[0.12, 0.3, 0.08]} />
        <meshStandardMaterial color="#594e72" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.12, 0.6, 0.24]}>
        <boxGeometry args={[0.12, 0.34, 0.08]} />
        <meshStandardMaterial color="#87613e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.08, 0.57, 0.24]}>
        <boxGeometry args={[0.14, 0.28, 0.08]} />
        <meshStandardMaterial color="#46635a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 0.58, 0.24]}>
        <boxGeometry args={[0.18, 0.18, 0.08]} />
        <meshStandardMaterial color="#24272c" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 0.74, 0.25]}>
        <boxGeometry args={[0.22, 0.08, 0.035]} />
        <meshStandardMaterial color="#c7bda7" roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0.3, 0.84, 0.25]}>
        <boxGeometry args={[0.16, 0.12, 0.035]} />
        <meshStandardMaterial color="#27364a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.2, 0.23]}>
        <boxGeometry args={[0.74, 0.28, 0.08]} />
        <meshStandardMaterial color="#2a211f" roughness={0.95} flatShading />
      </mesh>
      <SoccerBall />
    </group>
  );
}

function SoccerBall() {
  return (
    <group position={[0.62, 0.16, 0.32]} rotation={[0.2, 0.5, -0.1]}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial color="#e8e0d1" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.115, 0.035]}>
        <circleGeometry args={[0.055, 5]} />
        <meshStandardMaterial color="#1c1d20" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.09, -0.02, 0.08]} rotation={[0.7, 0.2, 0]}>
        <circleGeometry args={[0.04, 5]} />
        <meshStandardMaterial color="#1c1d20" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.08, -0.06, 0.07]} rotation={[0.6, -0.3, 0]}>
        <circleGeometry args={[0.035, 5]} />
        <meshStandardMaterial color="#1c1d20" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

function RedSofa({ onTeddyPress }) {
  return (
    <group position={[-3.36, 0, 0.05]}>
      <mesh castShadow receiveShadow position={[0.18, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.3, 1.58]} />
        <meshStandardMaterial color="#8f2430" roughness={0.92} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.04, 0.66, 0]}>
        <boxGeometry args={[0.2, 0.72, 1.58]} />
        <meshStandardMaterial color="#641b25" map={fabricTexture} roughness={0.95} flatShading />
      </mesh>
      <SofaArm z={-0.9} />
      <SofaArm z={0.9} />
      <mesh castShadow position={[0.32, 0.49, -0.39]}>
        <boxGeometry args={[0.42, 0.12, 0.66]} />
        <meshStandardMaterial color="#a62c38" map={fabricTexture} roughness={0.98} flatShading />
      </mesh>
      <mesh castShadow position={[0.32, 0.49, 0.39]}>
        <boxGeometry args={[0.42, 0.12, 0.66]} />
        <meshStandardMaterial color="#a62c38" map={fabricTexture} roughness={0.98} flatShading />
      </mesh>
      <SofaLeg z={-0.58} />
      <SofaLeg z={0.58} />
      <TeddyBear onTeddyPress={onTeddyPress} />
    </group>
  );
}

function SofaArm({ z }) {
  return (
    <mesh castShadow receiveShadow position={[0.18, 0.44, z]}>
      <boxGeometry args={[0.58, 0.48, 0.16]} />
      <meshStandardMaterial color="#741f2a" roughness={0.94} flatShading />
    </mesh>
  );
}

function SofaLeg({ z }) {
  return (
    <mesh castShadow receiveShadow position={[0.38, 0.12, z]}>
      <boxGeometry args={[0.1, 0.24, 0.1]} />
      <meshStandardMaterial color="#2d1718" roughness={0.95} flatShading />
    </mesh>
  );
}

function TeddyBear({ onTeddyPress }) {
  return (
    <group position={[0.21, 0.63, 0.32]} rotation={[-0.14, Math.PI / 2, 0, "YXZ"]} scale={0.7}>
      <mesh castShadow position={[0, 0.08, 0]} scale={[1, 1.08, 0.78]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#8a5f3d" map={fabricTexture} roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.31, 0.02]} scale={[1, 0.95, 0.84]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#9b7048" map={fabricTexture} roughness={1} flatShading />
      </mesh>
      <TeddyEar x={-0.13} />
      <TeddyEar x={0.13} />
      <mesh position={[0, 0.27, 0.133]} scale={[1, 0.7, 0.38]}>
        <sphereGeometry args={[0.075, 8, 4]} /><meshStandardMaterial color="#c39d6e" roughness={1} flatShading />
      </mesh>
      <mesh position={[-0.055, 0.33, 0.13]}>
        <boxGeometry args={[0.035, 0.035, 0.025]} />
        <meshStandardMaterial color="#1b1514" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.055, 0.33, 0.13]}>
        <boxGeometry args={[0.035, 0.035, 0.025]} />
        <meshStandardMaterial color="#1b1514" roughness={0.9} flatShading />
      </mesh>
      <group
        position={[0, 0.28, 0.165]}
        onClick={(event) => {
          event.stopPropagation();
          onTeddyPress?.();
        }}
      >
        <mesh>
          <boxGeometry args={[0.065, 0.045, 0.025]} />
          <meshStandardMaterial color="#2d1b17" roughness={0.9} flatShading />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.075, 8, 6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      <mesh castShadow position={[-0.14, 0.06, 0.02]} rotation={[0, 0, 0.18]} scale={[0.7, 1.5, 0.8]}>
        <sphereGeometry args={[0.065, 7, 5]} />
        <meshStandardMaterial color="#7a5235" roughness={0.95} flatShading />
      </mesh>
      <mesh castShadow position={[0.14, 0.06, 0.02]} rotation={[0, 0, -0.18]} scale={[0.7, 1.5, 0.8]}>
        <sphereGeometry args={[0.065, 7, 5]} />
        <meshStandardMaterial color="#7a5235" roughness={0.95} flatShading />
      </mesh>
      <mesh castShadow position={[-0.08, -0.08, 0.075]} scale={[1, 0.7, 1.3]}>
        <sphereGeometry args={[0.065, 7, 5]} />
        <meshStandardMaterial color="#70482f" roughness={0.95} flatShading />
      </mesh>
      <mesh castShadow position={[0.08, -0.08, 0.075]} scale={[1, 0.7, 1.3]}>
        <sphereGeometry args={[0.065, 7, 5]} />
        <meshStandardMaterial color="#70482f" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

function TeddyEar({ x }) {
  return (
    <group position={[x, 0.43, 0.02]}>
      <mesh castShadow scale={[1, 1, 0.65]}>
        <sphereGeometry args={[0.062, 8, 6]} />
        <meshStandardMaterial color="#7a5235" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.035]} scale={[1, 1, 0.2]}>
        <sphereGeometry args={[0.036, 8, 4]} />
        <meshStandardMaterial color="#ba8b62" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function Desk({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  return (
    <group position={[0, 0.84, -2.5]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.65, 0.2, 1.14]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.16, 0.46]}>
        <boxGeometry args={[3.72, 0.24, 0.1]} />
        <meshStandardMaterial color="#4a321f" roughness={0.95} flatShading />
      </mesh>
      <Leg x={-1.52} z={-0.42} />
      <Leg x={1.52} z={-0.42} />
      <Leg x={-1.52} z={0.42} />
      <Leg x={1.52} z={0.42} />
      <Computer
        active={activeSection === "projects"}
        hovered={hoveredSection === "projects"}
        onClick={() => onSelectSection("projects")}
        onPointerMove={onMovePointer}
        onPointerOut={onUnhoverSection}
        onPointerOver={(event) => onHoverSection("projects", event)}
      />
    </group>
  );
}

function Leg({ x, z }) {
  return (
    <mesh castShadow position={[x, -0.47, z]}>
      <boxGeometry args={[0.14, 0.74, 0.14]} />
      <primitive object={woodMaterial} attach="material" />
    </mesh>
  );
}

function Computer({ active, hovered, onClick, onPointerMove, onPointerOut, onPointerOver }) {
  const screen = useRef();
  const casing = useRef();
  const localLight = useRef();
  const focusedColor = useMemo(() => new THREE.Color("#66736e"), []);
  const roomColor = useMemo(() => new THREE.Color("#c7bda7"), []);

  useFrame((_, delta) => {
    const blend = 1 - Math.exp(-3 * Math.min(delta, 0.1));
    screen.current.material.emissiveIntensity = THREE.MathUtils.lerp(screen.current.material.emissiveIntensity, active ? 0.15 : 0.55, blend);
    localLight.current.intensity = THREE.MathUtils.lerp(localLight.current.intensity, active ? 0.15 : 2.2, blend);
    casing.current.color.lerp(active ? focusedColor : roomColor, blend);
  });

  return (
    <group
      position={[deskItems.monitor.x, 0.45, -0.2]}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      onPointerOver={(event) => {
        event.stopPropagation();
        onPointerOver(event);
      }}
    >
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.88, 0.6, 0.16]} />
        <meshStandardMaterial ref={casing} color="#c7bda7" map={plasticTexture} roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.2, -0.2]}>
        <boxGeometry args={[0.8, 0.57, 0.32]} />
        <meshStandardMaterial color="#a8a49a" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0, -0.175, -0.02]}>
        <boxGeometry args={[0.18, 0.15, 0.16]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      <mesh ref={screen} position={[0, 0.22, 0.091]}>
        <boxGeometry args={[0.68, 0.43, 0.035]} />
        <meshStandardMaterial color="#10261a" emissive="#2be869" emissiveIntensity={1.1} flatShading />
      </mesh>
      {!active && <LabelPlane text="PROYECTOS" color="#d2e9d5" width={0.5} height={0.09} position={[0, 0.36, 0.116]} />}
      {!active && [0.25, 0.17, 0.09].map((y, index) => <mesh key={y} position={[-0.07, y, 0.115]}><boxGeometry args={[0.4 - index * 0.08, 0.018, 0.004]} /><meshBasicMaterial color="#a3d0ad" /></mesh>)}
      {!active && <mesh position={[-0.23, 0.05, 0.115]}><boxGeometry args={[0.06, 0.025, 0.004]} /><meshBasicMaterial color="#e3d58e" /></mesh>}
      <mesh position={[0.34, -0.1, 0.087]}>
        <boxGeometry args={[0.035, 0.018, 0.012]} />
        <meshStandardMaterial color="#8bcda0" emissive="#2d8050" emissiveIntensity={0.4} />
      </mesh>
      {[-0.29, -0.23, -0.17].map(x => <mesh key={`vent-${x}`} position={[x, -0.105, 0.083]}>
        <boxGeometry args={[0.035, 0.012, 0.005]} /><primitive object={darkMaterial} attach="material" />
      </mesh>)}
      <pointLight ref={localLight} color="#b3d2ba" intensity={2.2} position={[0, 0.16, 0.2]} distance={1.85} />
      <mesh castShadow receiveShadow position={[0, -0.30, 0.08]}>
        <boxGeometry args={[0.62, 0.1, 0.3]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      <mesh castShadow receiveShadow position={[deskItems.keyboard.x - deskItems.monitor.x, deskTop + 0.02 - 1.29, deskItems.keyboard.z - deskItems.monitor.z]}>
        <boxGeometry args={[0.82, 0.04, 0.22]} />
        <meshStandardMaterial color="#222328" roughness={0.9} flatShading />
      </mesh>
      {[0, 1, 2].flatMap(row => Array.from({ length: 10 }, (_, column) => (
        <mesh key={`key-${row}-${column}`} position={[deskItems.keyboard.x - deskItems.monitor.x - 0.34 + column * 0.07, deskTop + 0.046 - 1.29, deskItems.keyboard.z - deskItems.monitor.z - 0.065 + row * 0.065]}>
          <boxGeometry args={[0.052, 0.012, 0.045]} />
          <primitive object={plasticMaterial} attach="material" />
        </mesh>
      )))}
      <group position={[deskItems.mouse.x - deskItems.monitor.x, deskTop - 1.29, deskItems.mouse.z - deskItems.monitor.z]}>
        <mesh castShadow receiveShadow position={[0, 0.0225, 0]}><boxGeometry args={[0.16, 0.045, 0.2]} /><meshStandardMaterial color="#a6a99f" map={plasticTexture} roughness={0.78} /></mesh>
        <mesh position={[0, 0.047, -0.025]}><boxGeometry args={[0.006, 0.004, 0.125]} /><primitive object={darkMaterial} attach="material" /></mesh>
        <mesh position={[0, 0.052, -0.015]}><boxGeometry args={[0.025, 0.01, 0.04]} /><primitive object={darkMaterial} attach="material" /></mesh>
      </group>
      <LabelPlane text="RETRO PC" color="#46594d" width={0.25} height={0.045} position={[0.1, -0.065, 0.083]} />
      <StatusLight active={active || hovered} position={[0.41, 0.5, 0.12]} />
    </group>
  );
}

function Whiteboard({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  const isActive = activeSection === "skills";
  const isHovered = hoveredSection === "skills";

  return (
    <group
      position={[-2.6, 1.78, -3.65]}
      scale={isHovered ? 1.035 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelectSection("skills");
      }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverSection("skills", event);
      }}
    >
      <mesh castShadow position={[0, 0, 0.068]}>
        <boxGeometry args={[1.62, 1.02, 0.02]} />
        <meshStandardMaterial color={isActive || isHovered ? "#d8dfd4" : "#b7c5bc"} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0, -0.012]}>
        <boxGeometry args={[1.76, 1.14, 0.055]} />
        <meshStandardMaterial color="#24272c" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, -0.52, 0.08]}>
        <boxGeometry args={[1.65, 0.08, 0.08]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.4, 0.09]}>
        <boxGeometry args={[1.18, 0.08, 0.035]} />
        <meshStandardMaterial color="#273d39" roughness={0.85} flatShading />
      </mesh>
      <LabelPlane text="HABILIDADES" color="#e4e8d7" width={0.9} height={0.1} position={[0, 0.4, 0.15]} />
      {[-0.73, 0.73].flatMap(x => [-0.44, 0.44].map(y => <mesh key={`${x}-${y}`} position={[x, y, 0.085]}>
        <cylinderGeometry args={[0.025, 0.025, 0.009, 8]} /><meshStandardMaterial color="#65716c" metalness={0.3} roughness={0.7} />
      </mesh>))}
      <mesh position={[-0.48, -0.46, 0.13]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.22, 6]} /><meshStandardMaterial color="#252c32" /></mesh>
      <SkillBar y={0.26} width={0.82} color="#63f28a" />
      <SkillBar y={0.08} width={0.62} color="#ffce63" />
      <SkillBar y={-0.1} width={0.72} color="#8fb9ff" />
      <mesh position={[0.58, 0.24, 0.09]}>
        <boxGeometry args={[0.12, 0.18, 0.035]} />
        <meshStandardMaterial color="#63f28a" emissive="#174b27" emissiveIntensity={0.12} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.58, 0.02, 0.09]}>
        <boxGeometry args={[0.12, 0.28, 0.035]} />
        <meshStandardMaterial color="#ffce63" emissive="#4a2d12" emissiveIntensity={0.1} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.58, -0.22, 0.09]}>
        <boxGeometry args={[0.12, 0.2, 0.035]} />
        <meshStandardMaterial color="#8fb9ff" emissive="#1a2f4c" emissiveIntensity={0.1} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[-0.54, -0.3, 0.09]}>
        <boxGeometry args={[0.28, 0.2, 0.035]} />
        <meshStandardMaterial color="#d7b357" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[-0.16, -0.3, 0.09]}>
        <boxGeometry args={[0.28, 0.2, 0.035]} />
        <meshStandardMaterial color="#7aa071" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.22, -0.3, 0.09]}>
        <boxGeometry args={[0.28, 0.2, 0.035]} />
        <meshStandardMaterial color="#8f6d5d" roughness={0.8} flatShading />
      </mesh>
      <StatusLight active={isActive || isHovered} position={[0.64, 0.4, 0.1]} />
    </group>
  );
}

function SkillBar({ y, width, color }) {
  return (
    <group position={[-0.06, y, 0.09]}>
      <mesh position={[-0.36, 0, 0]}>
        <boxGeometry args={[0.24, 0.045, 0.03]} />
        <meshStandardMaterial color="#2d3337" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.86, 0.06, 0.03]} />
        <meshStandardMaterial color="#394044" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.31 + width / 2, 0, 0.02]}>
        <boxGeometry args={[width, 0.075, 0.035]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

function EducationDistrict({
  activeSection,
  hoveredSection,
  onHoverSection,
  onMovePointer,
  onSelectSection,
  onUnhoverSection,
}) {
  const isActive = activeSection === "education";
  const isHovered = hoveredSection === "education";

  return (
    <group
      position={[1.55, 2.08, -3.62]}
      scale={isHovered ? 0.92 : 0.9}
      onClick={(event) => {
        event.stopPropagation();
        onSelectSection("education");
      }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverSection("education", event);
      }}
    >
      <mesh castShadow receiveShadow position={[0, 0, -0.03]}>
        <boxGeometry args={[1.55, 1.02, 0.08]} />
        <meshStandardMaterial
          color={isActive || isHovered ? "#324353" : "#252b35"}
          roughness={0.9}
          flatShading
        />
      </mesh>

      <mesh castShadow position={[0, -0.42, 0.04]}>
        <boxGeometry args={[1.28, 0.08, 0.14]} />
        <meshStandardMaterial color="#2d2522" roughness={0.95} flatShading />
      </mesh>

      <UniversityFacade active={isActive || isHovered} />

      <StatusLight active={isActive || isHovered} position={[0.58, 0.36, 0.1]} />
    </group>
  );
}

function UniversityFacade({ active }) {
  return (
    <group position={[0, -0.03, 0.06]}>
      <mesh castShadow position={[0, -0.18, 0]}>
        <boxGeometry args={[1.05, 0.42, 0.16]} />
        <meshStandardMaterial color={active ? "#58636b" : "#39434b"} roughness={0.88} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.22, -0.01]}>
        <boxGeometry args={[1.1, 0.38, 0.14]} />
        <meshStandardMaterial color={active ? "#68747c" : "#465159"} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow position={[0, -0.44, 0.01]}>
        <boxGeometry args={[1.22, 0.07, 0.18]} />
        <meshStandardMaterial color="#6f7d86" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0, -0.12, 0.1]}>
        <boxGeometry args={[0.26, 0.36, 0.08]} />
        <meshStandardMaterial color="#24364d" emissive="#162338" emissiveIntensity={active ? 0.22 : 0.08} flatShading />
      </mesh>
      <mesh position={[-0.36, 0.23, 0.09]}>
        <boxGeometry args={[0.16, 0.16, 0.035]} />
        <meshStandardMaterial color="#3f80b6" emissive="#163650" emissiveIntensity={active ? 0.22 : 0.08} flatShading />
      </mesh>
      <mesh position={[-0.12, 0.23, 0.09]}>
        <boxGeometry args={[0.16, 0.16, 0.035]} />
        <meshStandardMaterial color="#3f80b6" emissive="#163650" emissiveIntensity={active ? 0.22 : 0.08} flatShading />
      </mesh>
      <mesh position={[0.12, 0.23, 0.09]}>
        <boxGeometry args={[0.16, 0.16, 0.035]} />
        <meshStandardMaterial color="#3f80b6" emissive="#163650" emissiveIntensity={active ? 0.22 : 0.08} flatShading />
      </mesh>
      <mesh position={[0.36, 0.23, 0.09]}>
        <boxGeometry args={[0.16, 0.16, 0.035]} />
        <meshStandardMaterial color="#3f80b6" emissive="#163650" emissiveIntensity={active ? 0.22 : 0.08} flatShading />
      </mesh>
      <mesh position={[-0.36, -0.12, 0.1]}>
        <boxGeometry args={[0.16, 0.18, 0.035]} />
        <meshStandardMaterial color="#6aa6d6" emissive="#163650" emissiveIntensity={active ? 0.2 : 0.08} flatShading />
      </mesh>
      <mesh position={[0.36, -0.12, 0.1]}>
        <boxGeometry args={[0.16, 0.18, 0.035]} />
        <meshStandardMaterial color="#6aa6d6" emissive="#163650" emissiveIntensity={active ? 0.2 : 0.08} flatShading />
      </mesh>
      <mesh position={[0, -0.55, 0.08]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.46, 0.04, 0.04]} />
        <meshStandardMaterial color="#3f80b6" roughness={0.8} flatShading />
      </mesh>
      {[-0.52, 0.52].map((x) => (
        <mesh key={`column-${x}`} castShadow position={[x, 0, 0.13]}>
          <boxGeometry args={[0.12, 0.85, 0.15]} />
          <meshStandardMaterial color="#d0d3cd" roughness={0.86} flatShading />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.46, 0.11]}>
        <boxGeometry args={[1.25, 0.12, 0.24]} />
        <meshStandardMaterial color="#c2c8c7" roughness={0.86} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.025, 0.2]}>
        <boxGeometry args={[0.96, 0.1, 0.17]} />
        <meshStandardMaterial color="#20292f" roughness={0.9} flatShading />
      </mesh>
      <LabelPlane text="UNViMe" width={0.62} height={0.085} position={[0, 0.025, 0.29]} />
      <mesh castShadow position={[0, 0.18, 0.25]}>
        <boxGeometry args={[0.98, 0.018, 0.025]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      {[-0.42, -0.21, 0, 0.21, 0.42].map((x) => (
        <mesh key={`rail-${x}`} castShadow position={[x, 0.12, 0.25]}>
          <boxGeometry args={[0.014, 0.14, 0.02]} />
          <primitive object={darkMaterial} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, -0.12, 0.145]}>
        <boxGeometry args={[0.014, 0.34, 0.015]} />
        <meshStandardMaterial color="#a4b4b9" roughness={0.8} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`step-${i}`} castShadow position={[0.31 + i * 0.06, 0.02 - i * 0.065, 0.3]}>
          <boxGeometry args={[0.095, 0.025, 0.17]} />
          <meshStandardMaterial color="#a2acaa" roughness={0.85} flatShading />
        </mesh>
      ))}
      <mesh castShadow position={[0.49, -0.035, 0.39]} rotation={[0, 0, -0.82]}>
        <boxGeometry args={[0.56, 0.018, 0.018]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      {[0, 3, 6].map((i) => (
        <mesh key={`stair-rail-${i}`} position={[0.31 + i * 0.06, 0.09 - i * 0.065, 0.39]}>
          <boxGeometry args={[0.012, 0.14, 0.012]} />
          <primitive object={darkMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function Phone({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection, surfaceRef, interaction }) {
  const isActive = activeSection === "contact";
  const isHovered = hoveredSection === "contact";
  const keys = useRef([]);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const keyColor = useMemo(() => new THREE.Color("#d2cbb3"), []);
  const litKeyColor = useMemo(() => new THREE.Color("#b6df9b"), []);
  const cord = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.32, 0.25, -0.13), new THREE.Vector3(-0.38, 0.18, -0.07),
    new THREE.Vector3(-0.4, 0.04, 0.08), new THREE.Vector3(-0.38, 0.01, 0.18),
    new THREE.Vector3(-0.33, 0.03, 0.2), new THREE.Vector3(-0.29, 0.1, 0.15),
  ]), []);

  useFrame(({ camera, size }, delta) => {
    const state = interaction.current;
    keys.current.forEach((key, index) => {
      if (!key) return;
      const digit = phoneKeys[index].digit;
      const lit = state.hovered === digit || state.focused === digit || state.pressed === digit;
      key.children[0].material.emissiveIntensity = THREE.MathUtils.damp(key.children[0].material.emissiveIntensity, lit ? 0.85 : 0, 14, Math.min(delta, 0.1));
      key.children[0].material.color.lerp(lit ? litKeyColor : keyColor, 1 - Math.exp(-14 * Math.min(delta, 0.1)));
      key.position.y = THREE.MathUtils.damp(key.position.y, phoneKeySize.centerY - (state.pressed === digit ? 0.006 : 0), 24, Math.min(delta, 0.1));
      const button = surfaceRef.current?.children[index];
      if (!button) return;
      key.updateWorldMatrix(true, false);
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
      // Project the four key corners: the accessible hit area follows the real 3D key.
      for (const x of [-1, 1]) for (const z of [-1, 1]) {
        projected.set(x * phoneKeySize.width / 2, phoneKeySize.height / 2 + 0.002, z * phoneKeySize.depth / 2)
          .applyMatrix4(key.matrixWorld).project(camera);
        const screenX = (projected.x + 1) * size.width / 2;
        const screenY = (1 - projected.y) * size.height / 2;
        left = Math.min(left, screenX); right = Math.max(right, screenX);
        top = Math.min(top, screenY); bottom = Math.max(bottom, screenY);
      }
      const transform = `translate(${left.toFixed(2)}px, ${top.toFixed(2)}px)`;
      if (button.style.transform !== transform) button.style.transform = transform;
      button.style.width = `${(right - left).toFixed(2)}px`;
      button.style.height = `${(bottom - top).toFixed(2)}px`;
      button.style.visibility = isActive ? "visible" : "hidden";
    });
  });

  return <group position={onDesk("phone")}
    onClick={event => { event.stopPropagation(); onSelectSection("contact"); }}
    onPointerMove={onMovePointer} onPointerOut={onUnhoverSection}
    onPointerOver={event => { event.stopPropagation(); onHoverSection("contact", event); }}>
    <mesh castShadow receiveShadow position={[0, 0.065, 0]}>
      <boxGeometry args={[0.68, 0.13, 0.48]} />
      <meshStandardMaterial color={isActive || isHovered ? "#a6b5b6" : "#8b9c9e"} map={plasticTexture} roughness={0.78} flatShading />
    </mesh>
    <mesh receiveShadow position={[0, 0.139, 0.025]}>
      <boxGeometry args={[0.56, 0.018, 0.36]} /><meshStandardMaterial color="#263330" map={plasticTexture} roughness={0.87} />
    </mesh>
    {[-0.26, 0.26].map(x => <group key={x}>
      <mesh castShadow position={[x, 0.18, -0.13]}><boxGeometry args={[0.11, 0.1, 0.14]} /><meshStandardMaterial color="#657975" roughness={0.8} /></mesh>
      <mesh castShadow position={[x, 0.255, -0.13]}><boxGeometry args={[0.17, 0.09, 0.19]} /><meshStandardMaterial color="#303b40" map={plasticTexture} roughness={0.7} /></mesh>
      {[-0.03, 0, 0.03].map(z => <mesh key={z} position={[x, 0.301, -0.13 + z]}><boxGeometry args={[0.075, 0.002, 0.009]} /><primitive object={darkMaterial} attach="material" /></mesh>)}
    </group>)}
    <mesh castShadow position={[0, 0.2775, -0.13]}>
      <boxGeometry args={[0.44, 0.065, 0.11]} /><meshStandardMaterial color="#303b40" map={plasticTexture} roughness={0.7} />
    </mesh>
    {phoneKeys.map(({ digit, x, z }, index) => <group key={digit} ref={node => { keys.current[index] = node; }} position={[x, phoneKeySize.centerY, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[phoneKeySize.width, phoneKeySize.height, phoneKeySize.depth]} />
        <meshStandardMaterial color="#d2cbb3" map={plasticTexture} emissive="#b2e29b" emissiveIntensity={0} roughness={0.77} />
      </mesh>
      <LabelPlane square text={digit} color="#263637" width={0.044} height={0.038} position={[0, phoneKeySize.height / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>)}
    <mesh castShadow position={[0.235, 0.151, 0.16]}><boxGeometry args={[0.04, 0.006, 0.035]} /><meshStandardMaterial color="#9bc7a5" emissive="#548a63" emissiveIntensity={0.2} /></mesh>
    <mesh><tubeGeometry args={[cord, 24, 0.009, 5, false]} /><meshStandardMaterial color="#202426" roughness={0.92} /></mesh>
    <LabelPlane text="CONTACTO" width={0.34} height={0.06} position={[0, 0.055, 0.241]} color="#182c31" />
    <StatusLight active={isActive || isHovered} position={[0.25, 0.165, 0.2]} />
  </group>;
}

function Folder({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  const isActive = activeSection === "cv";
  const isHovered = hoveredSection === "cv";

  return (
    <group
      position={onDesk("folder", 0.018)}
      rotation={[0, deskItems.folder.rotation, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelectSection("cv");
      }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverSection("cv", event);
      }}
    >
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[deskItems.folder.width, 0.036, 0.56]} />
        <meshStandardMaterial color={isActive || isHovered ? "#ffce63" : "#c88c3d"} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.24, 0, -0.31]}>
        <boxGeometry args={[0.26, 0.036, 0.13]} />
        <meshStandardMaterial color={isActive || isHovered ? "#ffdd7d" : "#d99b49"} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.015, 0.027, 0.01]} rotation={[0, -0.025, 0]}>
        <boxGeometry args={[0.64, 0.016, 0.48]} />
        <meshStandardMaterial color="#efe6cf" map={paperTexture} roughness={0.96} flatShading />
      </mesh>
      <mesh position={[0.01, 0.043, 0]} rotation={[0, 0.02, 0]}>
        <boxGeometry args={[0.63, 0.014, 0.47]} />
        <meshStandardMaterial color="#fff7df" map={paperTexture} roughness={0.96} flatShading />
      </mesh>
      <mesh position={[0, 0.06, 0.19]}>
        <boxGeometry args={[deskItems.folder.width, 0.024, 0.18]} />
        <meshStandardMaterial color="#c88c3d" roughness={0.88} flatShading />
      </mesh>
      <mesh position={[0, 0.035, 0.27]}>
        <boxGeometry args={[deskItems.folder.width, 0.034, 0.02]} />
        <meshStandardMaterial color="#bc873c" map={paperTexture} roughness={0.94} />
      </mesh>
      <mesh position={[-0.24, 0.019, -0.31]}>
        <boxGeometry args={[0.25, 0.004, 0.08]} />
        <meshStandardMaterial color="#273d39" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[-0.04, 0.052, -0.07]}>
        <boxGeometry args={[0.42, 0.003, 0.014]} />
        <meshStandardMaterial color="#9d9587" roughness={0.88} flatShading />
      </mesh>
      <mesh position={[-0.08, 0.052, -0.02]}>
        <boxGeometry args={[0.34, 0.003, 0.014]} />
        <meshStandardMaterial color="#9d9587" roughness={0.88} flatShading />
      </mesh>
      <mesh castShadow position={[-0.28, 0.055, -0.17]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.03, 0.012, 0.11]} />
        <meshStandardMaterial color="#c7bda7" metalness={0.25} roughness={0.62} flatShading />
      </mesh>
      <LabelPlane
        text="CV"
        width={0.22}
        height={0.1}
        position={[-0.24, 0.023, -0.31]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <LabelPlane text="CURRÍCULUM" color="#34413c" width={0.42} height={0.09} position={[0.03, 0.052, -0.16]} rotation={[-Math.PI / 2, 0, 0]} />
      <StatusLight active={isActive || isHovered} position={[0.32, 0.075, 0.2]} />
    </group>
  );
}

function ProfileCard({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  const isActive = activeSection === "about";
  const isHovered = hoveredSection === "about";

  return (
    <group
      position={[-3.66, 2.32, -2.72]}
      rotation={[0, Math.PI / 2, 0]}
      scale={isHovered ? 0.82 : 0.8}
      onClick={(event) => {
        event.stopPropagation();
        onSelectSection("about");
      }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverSection("about", event, "Perfil profesional");
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.86, 1.05, 0.08]} />
        <meshStandardMaterial color={isActive || isHovered ? "#344750" : "#222b32"} roughness={0.86} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[0.74, 0.9, 0.04]} />
        <meshStandardMaterial color="#c7bda7" map={paperTexture} roughness={0.92} flatShading />
      </mesh>
      <mesh position={[0, 0.18, 0.085]}>
        <boxGeometry args={[0.32, 0.32, 0.035]} />
        <meshStandardMaterial color="#263d4d" roughness={0.82} flatShading />
      </mesh>
      <mesh position={[0, 0.25, 0.12]}>
        <boxGeometry args={[0.16, 0.16, 0.06]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.34, 0.13]}>
        <boxGeometry args={[0.19, 0.07, 0.07]} />
        <meshStandardMaterial color="#231c1d" roughness={0.95} flatShading />
      </mesh>
      {[-0.04, 0.04].map(x => <mesh key={x} position={[x, 0.265, 0.154]}>
        <boxGeometry args={[0.019, 0.021, 0.009]} /><meshStandardMaterial color="#332727" />
      </mesh>)}
      <LabelPlane text="BENJAMÍN" color="#2d433d" width={0.57} height={0.085} position={[0, -0.1, 0.084]} />
      <mesh position={[0, 0.07, 0.12]}>
        <boxGeometry args={[0.24, 0.16, 0.055]} />
        <primitive object={shirtMaterial} attach="material" />
      </mesh>
      <mesh position={[0, -0.22, 0.09]}>
        <boxGeometry args={[0.5, 0.06, 0.035]} />
        <meshStandardMaterial color="#273d39" roughness={0.85} flatShading />
      </mesh>
      <LabelPlane text="PERFIL" color="#9acbae" width={0.54} height={0.13} position={[0, -0.22, 0.115]} />
      <mesh position={[-0.2, -0.37, 0.09]}>
        <boxGeometry args={[0.18, 0.04, 0.03]} />
        <meshStandardMaterial color="#3f80b6" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.08, -0.37, 0.09]}>
        <boxGeometry args={[0.28, 0.04, 0.03]} />
        <meshStandardMaterial color="#7aa071" roughness={0.85} flatShading />
      </mesh>
      <StatusLight active={isActive || isHovered} position={[0.34, 0.38, 0.1]} />
    </group>
  );
}

function Door({ hovered, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  return (
    <group position={[2.95, 0.99, -3.68]}
      onClick={(event) => { event.stopPropagation(); onSelectSection("exit"); }}
      onPointerOver={(event) => { event.stopPropagation(); onHoverSection("exit", event, "Volver al inicio"); }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
    >
      <ExitSign position={[0, 1.29, 0.02]} />
      <mesh position={[0, 0, -0.045]}>
        <boxGeometry args={[1.07, 2.15, 0.1]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.95, 2.05, 0.12]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.28, 0.07]}>
        <boxGeometry args={[0.52, 0.72, 0.035]} />
        <meshStandardMaterial color="#263a40" roughness={0.42} metalness={0.1} flatShading />
      </mesh>
      <mesh castShadow position={[0.3, -0.04, 0.095]}>
        <boxGeometry args={[0.08, 0.16, 0.045]} />
        <meshStandardMaterial color="#c08a45" roughness={0.72} metalness={0.15} flatShading />
      </mesh>
      <mesh castShadow position={[0.21, -0.04, 0.095]}>
        <boxGeometry args={[0.2, 0.055, 0.04]} />
        <meshStandardMaterial color="#a87434" roughness={0.75} metalness={0.12} flatShading />
      </mesh>
      <StatusLight active={hovered} position={[0.25, 1.29, 0.08]} strength={0.07} />
    </group>
  );
}

function SeatedPerson() {
  const group = useRef();
  const head = useMemo(() => new THREE.Vector3(0, 0.4, -1.5), []);
  const materials = useRef([]);
  useEffect(() => {
    const entries = [];
    group.current.traverse(mesh => {
      if (!mesh.isMesh) return;
      const original = mesh.material;
      const material = original.clone();
      material.transparent = true;
      mesh.material = material;
      entries.push({ mesh, original, material, castShadow: mesh.castShadow });
    });
    materials.current = entries;
    return () => {
      entries.forEach(({ mesh, original, material, castShadow }) => { mesh.material = original; mesh.castShadow = castShadow; material.dispose(); });
      materials.current = [];
    };
  }, []);
  useFrame(({ camera }) => {
    const opacity = THREE.MathUtils.smoothstep(camera.position.distanceTo(head), 0.9, 1.85);
    group.current.visible = opacity > 0.001;
    materials.current.forEach(({ material, mesh, castShadow }) => {
      material.opacity = opacity;
      material.depthWrite = opacity > 0.99;
      mesh.castShadow = castShadow && opacity > 0.99;
    });
  });
  return <group ref={group}><ChairAndPerson /></group>;
}

function ChairAndPerson() {
  return (
    <group position={[0, 0.08, -1.28]}>
      <mesh castShadow receiveShadow position={[0, 0.34, 0.03]}>
        <boxGeometry args={[0.78, 0.15, 0.68]} />
        <meshStandardMaterial color="#3a2f2c" roughness={0.95} flatShading />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.82, 0.34]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.8, 0.88, 0.13]} />
        <meshStandardMaterial color="#332b2c" roughness={0.95} flatShading />
      </mesh>
      <ChairLeg x={-0.28} z={-0.22} />
      <ChairLeg x={0.28} z={-0.22} />
      <ChairLeg x={-0.28} z={0.27} />
      <ChairLeg x={0.28} z={0.27} />

      <mesh castShadow position={[0, 0.86, -0.08]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[0.54, 0.62, 0.3]} />
        <primitive object={shirtMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[0, 1.3, -0.18]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[0, 1.48, -0.15]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.39, 0.16, 0.39]} />
        <meshStandardMaterial color="#231c1d" roughness={0.95} flatShading />
      </mesh>
      <LegPair />
      <Arm x={-0.34} />
      <Arm x={0.34} />
    </group>
  );
}

function ChairLeg({ x, z }) {
  return (
    <mesh castShadow position={[x, 0.13, z]}>
      <boxGeometry args={[0.09, 0.42, 0.09]} />
      <meshStandardMaterial color="#211a19" roughness={0.95} flatShading />
    </mesh>
  );
}

function Arm({ x }) {
  return (
    <mesh castShadow position={[x, 0.83, -0.44]} rotation={[1.16, 0, x > 0 ? -0.22 : 0.22]}>
      <boxGeometry args={[0.12, 0.52, 0.12]} />
      <primitive object={skinMaterial} attach="material" />
    </mesh>
  );
}

function LegPair() {
  return (
    <group>
      <mesh castShadow position={[-0.18, 0.42, -0.17]} rotation={[0.84, 0, -0.08]}>
        <boxGeometry args={[0.18, 0.48, 0.18]} />
        <primitive object={pantsMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[0.18, 0.42, -0.17]} rotation={[0.84, 0, 0.08]}>
        <boxGeometry args={[0.18, 0.48, 0.18]} />
        <primitive object={pantsMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[-0.2, 0.2, -0.44]} rotation={[1.14, 0, -0.05]}>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <primitive object={pantsMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[0.2, 0.2, -0.44]} rotation={[1.14, 0, 0.05]}>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <primitive object={pantsMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function StatusLight({ active, position, strength = 0.23 }) {
  const hint = useRef();
  const proximity = useContext(ProximityContext);
  const nearby = useRef(0);
  const materials = useRef([]);
  const center = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const tint = useMemo(() => new THREE.Color("#87dba3"), []);
  const marker = useRef();
  const halo = useRef();
  const orientation = useMemo(() => new THREE.Quaternion(), []);
  const reducedMotion = useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    const object = hint.current.parent;
    object.updateWorldMatrix(true, true);
    new THREE.Box3().setFromObject(object).getCenter(center);
    object.worldToLocal(center);
    const entries = [];
    object.traverse((mesh) => {
      if (!mesh.isMesh || mesh === marker.current || !mesh.material?.isMeshStandardMaterial) return;
      const original = mesh.material;
      const isolated = original.clone();
      mesh.material = isolated;
      entries.push({ mesh, original, isolated });
    });
    materials.current = entries;
    return () => {
      entries.forEach(({ mesh, original, isolated }) => {
        if (mesh.material === isolated) mesh.material = original;
        isolated.dispose();
      });
      materials.current = [];
    };
  }, [center]);

  useFrame(({ clock, camera, gl }, delta) => {
    if (!marker.current) return;

    const cursor = proximity?.current;
    hint.current.visible = Boolean(cursor?.enabled);
    let target = 0;
    if (cursor?.enabled && cursor.visible) {
      projected.copy(center);
      hint.current.parent.localToWorld(projected);
      projected.project(camera);
      const rect = gl.domElement.getBoundingClientRect();
      if (projected.z >= -1 && projected.z <= 1) {
        const x = rect.left + (projected.x + 1) * rect.width / 2;
        const y = rect.top + (1 - projected.y) * rect.height / 2;
        const distance = Math.hypot(cursor.x - x, cursor.y - y);
        target = 1 - THREE.MathUtils.smoothstep(distance, 35, Math.min(175, rect.width * 0.3));
      }
    }
    nearby.current = THREE.MathUtils.damp(nearby.current, target, 9, Math.min(delta, 0.05));
    materials.current.forEach(({ original, isolated }) => {
      isolated.color.copy(original.color);
      isolated.emissive.lerpColors(original.emissive, tint, nearby.current * strength);
      isolated.emissiveIntensity = original.emissiveIntensity;
    });

    const pulse = reducedMotion ? 0.5 : (Math.sin(clock.elapsedTime * 2) + 1) / 2;
    if (halo.current) {
      halo.current.parent.getWorldQuaternion(orientation);
      halo.current.quaternion.copy(orientation.invert()).multiply(camera.quaternion);
      halo.current.scale.setScalar(1 + pulse * 0.08 + nearby.current * 0.18);
      halo.current.material.opacity = active ? 0.7 : 0.18 + nearby.current * 0.48;
    }
    const scale = active ? 0.96 + pulse * 0.18 : 0.68 + pulse * 0.1;
    marker.current.scale.setScalar(scale);
    marker.current.material.emissiveIntensity = active ? 0.72 + pulse * 0.28 : 0.28 + nearby.current * 0.5;
  });

  return (
    <group ref={hint} name="interaction-hint" position={position}>
    <mesh ref={halo} raycast={() => null}>
      <ringGeometry args={[0.075, 0.084, 24]} />
      <meshBasicMaterial color={active ? "#ffce63" : "#9cecb6"} transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
    <mesh ref={marker}>
      <sphereGeometry args={[0.048, 8, 8]} />
      <meshStandardMaterial
        color={active ? "#ffce63" : "#63f28a"}
        emissive={active ? "#6a3f12" : "#174b27"}
        emissiveIntensity={active ? 0.82 : 0.34}
        opacity={active ? 1 : 0.94}
        transparent
        flatShading
      />
    </mesh>
    </group>
  );
}
