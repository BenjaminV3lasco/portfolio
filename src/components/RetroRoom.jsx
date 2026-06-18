import { useFrame } from "@react-three/fiber";
import React from "react";
import { useRef } from "react";
import * as THREE from "three";

const wallMaterial = new THREE.MeshStandardMaterial({ color: "#5c5146", roughness: 1, flatShading: true });
const floorMaterial = new THREE.MeshStandardMaterial({ color: "#2d2725", roughness: 1, flatShading: true });
const woodMaterial = new THREE.MeshStandardMaterial({ color: "#6c4a2e", roughness: 0.9, flatShading: true });
const plasticMaterial = new THREE.MeshStandardMaterial({ color: "#c7bda7", roughness: 0.75, flatShading: true });
const darkMaterial = new THREE.MeshStandardMaterial({ color: "#15161a", roughness: 0.8, flatShading: true });
const glowMaterial = new THREE.MeshStandardMaterial({
  color: "#63f28a",
  emissive: "#1e7c36",
  emissiveIntensity: 1.4,
  flatShading: true,
});

export function RetroRoom({ activeSection, onSelectSection }) {
  return (
    <group position={[0, -1.15, 0]}>
      <RoomShell />
      <Desk onSelectSection={onSelectSection} activeSection={activeSection} />
      <Whiteboard onSelectSection={onSelectSection} activeSection={activeSection} />
      <Poster onSelectSection={onSelectSection} activeSection={activeSection} />
      <Phone onSelectSection={onSelectSection} activeSection={activeSection} />
      <Folder onSelectSection={onSelectSection} activeSection={activeSection} />
      <Door onSelectSection={onSelectSection} activeSection={activeSection} />
    </group>
  );
}

function RoomShell() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.6, 7.6, 4, 4]} />
        <primitive object={floorMaterial} attach="material" />
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
    </group>
  );
}

function Desk({ activeSection, onSelectSection }) {
  return (
    <group position={[0, 0.55, -2.45]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.22, 1.15]} />
        <primitive object={woodMaterial} attach="material" />
      </mesh>
      <Leg x={-1.35} z={-0.42} />
      <Leg x={1.35} z={-0.42} />
      <Leg x={-1.35} z={0.42} />
      <Leg x={1.35} z={0.42} />
      <Computer active={activeSection === "projects"} onClick={() => onSelectSection("projects")} />
    </group>
  );
}

function Leg({ x, z }) {
  return (
    <mesh castShadow position={[x, -0.5, z]}>
      <boxGeometry args={[0.16, 1, 0.16]} />
      <primitive object={woodMaterial} attach="material" />
    </mesh>
  );
}

function Computer({ active, onClick }) {
  const screen = useRef();

  useFrame(({ clock }) => {
    screen.current.material.emissiveIntensity = active ? 1.8 : 1 + Math.sin(clock.elapsedTime * 4) * 0.15;
  });

  return (
    <group position={[0, 0.48, -0.05]} onClick={onClick}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.95, 0.72, 0.16]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      <mesh ref={screen} position={[0, 0.22, 0.091]}>
        <boxGeometry args={[0.7, 0.46, 0.035]} />
        <meshStandardMaterial color="#10261a" emissive="#2be869" emissiveIntensity={1.1} flatShading />
      </mesh>
      <mesh castShadow position={[0, -0.28, 0.02]}>
        <boxGeometry args={[0.62, 0.12, 0.38]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      <Marker active={active} position={[0, 0.76, 0.13]} />
    </group>
  );
}

function Whiteboard({ activeSection, onSelectSection }) {
  return (
    <group position={[-2.75, 1.75, -3.65]} onClick={() => onSelectSection("skills")}>
      <mesh castShadow>
        <boxGeometry args={[1.35, 0.85, 0.08]} />
        <meshStandardMaterial color={activeSection === "skills" ? "#e9e1c6" : "#bfb7a2"} roughness={0.7} flatShading />
      </mesh>
      <Marker active={activeSection === "skills"} position={[0, 0.02, 0.07]} />
    </group>
  );
}

function Poster({ activeSection, onSelectSection }) {
  return (
    <group position={[2.25, 1.85, -3.66]} onClick={() => onSelectSection("about")}>
      <mesh castShadow>
        <boxGeometry args={[1.05, 1.25, 0.06]} />
        <meshStandardMaterial color={activeSection === "about" ? "#c95f42" : "#7e3d35"} roughness={0.95} flatShading />
      </mesh>
      <Marker active={activeSection === "about"} position={[0, 0.05, 0.06]} />
    </group>
  );
}

function Phone({ activeSection, onSelectSection }) {
  return (
    <group position={[-2.5, 0.54, -1.15]} onClick={() => onSelectSection("contact")}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.24, 0.42]} />
        <meshStandardMaterial color={activeSection === "contact" ? "#3f6f62" : "#243d38"} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[0.42, 0.12, 0.18]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <Marker active={activeSection === "contact"} position={[0, 0.52, 0]} />
    </group>
  );
}

function Folder({ activeSection, onSelectSection }) {
  return (
    <group position={[1.35, 0.74, -2.05]} rotation={[0, -0.18, 0]} onClick={() => onSelectSection("cv")}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.09, 0.55]} />
        <meshStandardMaterial color={activeSection === "cv" ? "#ffce63" : "#c88c3d"} roughness={0.95} flatShading />
      </mesh>
      <Marker active={activeSection === "cv"} position={[0, 0.18, 0]} />
    </group>
  );
}

function Door({ activeSection, onSelectSection }) {
  return (
    <group position={[3.08, 1.05, -3.68]} onClick={() => onSelectSection("education")}>
      <mesh castShadow>
        <boxGeometry args={[0.95, 2.05, 0.12]} />
        <meshStandardMaterial color={activeSection === "education" ? "#7a5430" : "#51371f"} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.28, 0, 0.08]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      <Marker active={activeSection === "education"} position={[0, 1.25, 0.08]} />
    </group>
  );
}

function Marker({ active, position }) {
  return (
    <mesh position={position} scale={active ? 1.2 : 1}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial
        color={active ? "#ffce63" : "#63f28a"}
        emissive={active ? "#6a3f12" : "#174b27"}
        emissiveIntensity={active ? 1.2 : 0.65}
        flatShading
      />
    </mesh>
  );
}
