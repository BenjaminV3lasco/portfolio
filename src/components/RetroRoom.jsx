import { useFrame } from "@react-three/fiber";
import React from "react";
import { useRef } from "react";
import * as THREE from "three";

const wallMaterial = new THREE.MeshStandardMaterial({ color: "#5c5146", roughness: 1, flatShading: true });
const floorMaterial = new THREE.MeshStandardMaterial({ color: "#2d2725", roughness: 1, flatShading: true });
const woodMaterial = new THREE.MeshStandardMaterial({ color: "#6c4a2e", roughness: 0.9, flatShading: true });
const plasticMaterial = new THREE.MeshStandardMaterial({ color: "#c7bda7", roughness: 0.75, flatShading: true });
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
  activeSection,
  hoveredSection,
  onHoverSection,
  onMovePointer,
  onSelectSection,
  onUnhoverSection,
}) {
  return (
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
      <ChairAndPerson />
      <RoomProps />
      <LeftFurniture />
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
      <Phone
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
        activeSection={activeSection}
        hoveredSection={hoveredSection}
        onHoverSection={onHoverSection}
        onMovePointer={onMovePointer}
        onSelectSection={onSelectSection}
        onUnhoverSection={onUnhoverSection}
      />
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
      <mesh castShadow position={[-2.9, 2.45, -3.62]}>
        <boxGeometry args={[0.44, 0.18, 0.12]} />
        <meshStandardMaterial color="#253b32" emissive="#234c32" emissiveIntensity={0.5} roughness={0.8} flatShading />
      </mesh>
      <LeftWallSet />
    </group>
  );
}

function LeftWallSet() {
  return (
    <group rotation={[0, Math.PI / 2, 0]} position={[-3.72, 0, 0]}>
      <mesh castShadow position={[-1.05, 2.35, 0.08]}>
        <boxGeometry args={[1.25, 0.28, 0.055]} />
        <meshStandardMaterial color="#1d252a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.05, 2.35, 0.12]}>
        <boxGeometry args={[0.9, 0.055, 0.035]} />
        <meshStandardMaterial color="#63f28a" emissive="#174b27" emissiveIntensity={0.28} flatShading />
      </mesh>
      <mesh castShadow position={[0.88, 2.08, 0.08]}>
        <boxGeometry args={[0.95, 0.72, 0.055]} />
        <meshStandardMaterial color="#1d2530" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.88, 2.08, 0.12]}>
        <boxGeometry args={[0.78, 0.06, 0.035]} />
        <meshStandardMaterial color="#30495f" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.6, 1.86, 0.12]}>
        <boxGeometry args={[0.18, 0.28, 0.05]} />
        <meshStandardMaterial color="#5d6674" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.88, 1.95, 0.12]}>
        <boxGeometry args={[0.2, 0.42, 0.05]} />
        <meshStandardMaterial color="#7b715e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[1.16, 1.88, 0.12]}>
        <boxGeometry args={[0.24, 0.32, 0.05]} />
        <meshStandardMaterial color="#55705d" roughness={0.9} flatShading />
      </mesh>
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
      <mesh position={[-0.3, 1.72, 0.1]}>
        <boxGeometry args={[0.25, 0.22, 0.035]} />
        <meshStandardMaterial color="#d7b357" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0.06, 1.58, 0.1]}>
        <boxGeometry args={[0.24, 0.2, 0.035]} />
        <meshStandardMaterial color="#7aa071" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function RoomProps() {
  return (
    <group>
      <mesh castShadow position={[1.58, 1.01, -2.44]} rotation={[0, -0.14, 0]}>
        <boxGeometry args={[0.28, 0.18, 0.28]} />
        <meshStandardMaterial color="#57423a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[1.58, 1.15, -2.44]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.018, 5, 10]} />
        <meshStandardMaterial color="#2f2321" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0.92, 1.01, -2.68]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[0.28, 0.025, 0.3]} />
        <meshStandardMaterial color="#27364a" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0.55, 1.01, -2.68]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.28, 0.025, 0.3]} />
        <meshStandardMaterial color="#4a2f3d" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[-0.84, 1.02, -2.66]}>
        <boxGeometry args={[0.54, 0.12, 0.3]} />
        <meshStandardMaterial color="#24272c" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.02, 1.11, -2.66]}>
        <boxGeometry args={[0.06, 0.03, 0.035]} />
        <meshStandardMaterial color="#63f28a" emissive="#174b27" emissiveIntensity={0.45} flatShading />
      </mesh>
      <mesh position={[-0.84, 1.11, -2.66]}>
        <boxGeometry args={[0.06, 0.03, 0.035]} />
        <meshStandardMaterial color="#ffce63" emissive="#4a2d12" emissiveIntensity={0.35} flatShading />
      </mesh>
      <mesh position={[-0.66, 1.11, -2.66]}>
        <boxGeometry args={[0.06, 0.03, 0.035]} />
        <meshStandardMaterial color="#8fb9ff" emissive="#1a2f4c" emissiveIntensity={0.35} flatShading />
      </mesh>
      <mesh castShadow position={[-1.52, 1.02, -2.48]} rotation={[0, 0.28, 0]}>
        <boxGeometry args={[0.34, 0.035, 0.26]} />
        <meshStandardMaterial color="#1f6c3d" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.62, 1.05, -2.38]}>
        <boxGeometry args={[0.04, 0.025, 0.03]} />
        <meshStandardMaterial color="#d8d2b8" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[-1.5, 1.05, -2.38]}>
        <boxGeometry args={[0.04, 0.025, 0.03]} />
        <meshStandardMaterial color="#d8d2b8" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[-1.38, 1.05, -2.38]}>
        <boxGeometry args={[0.04, 0.025, 0.03]} />
        <meshStandardMaterial color="#d8d2b8" roughness={0.8} flatShading />
      </mesh>
      <mesh castShadow position={[-2.9, 2.48, -3.58]}>
        <boxGeometry args={[1.15, 0.22, 0.055]} />
        <meshStandardMaterial color="#1d252a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-2.9, 2.48, -3.53]}>
        <boxGeometry args={[0.82, 0.055, 0.035]} />
        <meshStandardMaterial color="#63f28a" emissive="#174b27" emissiveIntensity={0.3} flatShading />
      </mesh>
    </group>
  );
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
    <mesh castShadow position={[x, -0.64, z]}>
      <boxGeometry args={[0.14, 1.28, 0.14]} />
      <primitive object={woodMaterial} attach="material" />
    </mesh>
  );
}

function Computer({ active, hovered, onClick, onPointerMove, onPointerOut, onPointerOver }) {
  const screen = useRef();

  useFrame(({ clock }) => {
    screen.current.material.emissiveIntensity = active ? 1.8 : 1 + Math.sin(clock.elapsedTime * 4) * 0.15;
  });

  return (
    <group
      position={[0, 0.45, -0.2]}
      scale={hovered ? 1.04 : 1}
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
        <boxGeometry args={[0.95, 0.7, 0.16]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      <mesh ref={screen} position={[0, 0.22, 0.091]}>
        <boxGeometry args={[0.68, 0.43, 0.035]} />
        <meshStandardMaterial color="#10261a" emissive="#2be869" emissiveIntensity={1.1} flatShading />
      </mesh>
      <pointLight color="#6dff96" intensity={10} position={[0, 0.16, 0.2]} distance={1.85} />
      <mesh castShadow position={[0, -0.27, 0.08]}>
        <boxGeometry args={[0.62, 0.1, 0.3]} />
        <primitive object={plasticMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[0, -0.46, 0.35]}>
        <boxGeometry args={[0.82, 0.04, 0.22]} />
        <meshStandardMaterial color="#222328" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0.58, -0.45, 0.33]}>
        <boxGeometry args={[0.2, 0.045, 0.28]} />
        <meshStandardMaterial color="#202126" roughness={0.9} flatShading />
      </mesh>
      <StatusLight active={active} position={[0.41, 0.5, 0.12]} />
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
      <mesh castShadow>
        <boxGeometry args={[1.62, 1.02, 0.08]} />
        <meshStandardMaterial color={isActive || isHovered ? "#e7dfc2" : "#b7b09f"} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[1.76, 1.14, 0.055]} />
        <meshStandardMaterial color="#24272c" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, -0.52, 0.08]}>
        <boxGeometry args={[1.65, 0.08, 0.08]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <SkillBar y={0.26} width={0.82} color="#63f28a" />
      <SkillBar y={0.08} width={0.62} color="#ffce63" />
      <SkillBar y={-0.1} width={0.72} color="#8fb9ff" />
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
      position={[0.95, 2.02, -3.62]}
      scale={isHovered ? 0.94 : 0.9}
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
        <meshStandardMaterial color={active ? "#d6d8d6" : "#9da4a6"} roughness={0.88} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.22, -0.01]}>
        <boxGeometry args={[1.1, 0.38, 0.14]} />
        <meshStandardMaterial color={active ? "#eff1ee" : "#b5bcbe"} roughness={0.85} flatShading />
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
    </group>
  );
}

function Phone({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  const isActive = activeSection === "contact";
  const isHovered = hoveredSection === "contact";

  return (
    <group
      position={[-0.98, 1.015, -2.42]}
      rotation={[0, 0.12, 0]}
      scale={isHovered ? 1.08 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelectSection("contact");
      }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverSection("contact", event);
      }}
    >
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.58, 0.16, 0.43]} />
        <meshStandardMaterial color={isActive || isHovered ? "#3f6f62" : "#273d39"} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.18, -0.04]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[0.5, 0.12, 0.16]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>
      <mesh castShadow position={[-0.14, 0.08, 0.12]}>
        <boxGeometry args={[0.09, 0.035, 0.06]} />
        <meshStandardMaterial color="#c7bda7" roughness={0.75} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.08, 0.12]}>
        <boxGeometry args={[0.09, 0.035, 0.06]} />
        <meshStandardMaterial color="#c7bda7" roughness={0.75} flatShading />
      </mesh>
      <mesh castShadow position={[0.14, 0.08, 0.12]}>
        <boxGeometry args={[0.09, 0.035, 0.06]} />
        <meshStandardMaterial color="#c7bda7" roughness={0.75} flatShading />
      </mesh>
      <mesh position={[0.33, 0.08, -0.08]} rotation={[0, 0.7, 0]}>
        <torusGeometry args={[0.13, 0.012, 5, 10, Math.PI]} />
        <meshStandardMaterial color="#15161a" roughness={0.9} flatShading />
      </mesh>
      <StatusLight active={isActive || isHovered} position={[0.24, 0.19, 0.18]} />
    </group>
  );
}

function Folder({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  const isActive = activeSection === "cv";
  const isHovered = hoveredSection === "cv";

  return (
    <group
      position={[0.94, 1.015, -2.42]}
      rotation={[0, -0.1, 0]}
      scale={isHovered ? 1.08 : 1}
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
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.86, 0.07, 0.56]} />
        <meshStandardMaterial color={isActive || isHovered ? "#ffce63" : "#c88c3d"} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.26, 0.055, -0.2]}>
        <boxGeometry args={[0.32, 0.08, 0.17]} />
        <meshStandardMaterial color={isActive || isHovered ? "#ffdd7d" : "#d99b49"} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.08, 0.055, 0.02]} rotation={[0, 0, -0.03]}>
        <boxGeometry args={[0.62, 0.025, 0.42]} />
        <meshStandardMaterial color="#efe6cf" roughness={0.88} flatShading />
      </mesh>
      <mesh position={[0.13, 0.085, 0.03]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.54, 0.024, 0.36]} />
        <meshStandardMaterial color="#d9d1bf" roughness={0.88} flatShading />
      </mesh>
      <StatusLight active={isActive || isHovered} position={[0.32, 0.11, 0.2]} />
    </group>
  );
}

function Door({ activeSection, hoveredSection, onHoverSection, onMovePointer, onSelectSection, onUnhoverSection }) {
  const isActive = activeSection === "about";
  const isHovered = hoveredSection === "about";

  return (
    <group
      position={[3.08, 0.92, -3.68]}
      scale={isHovered ? 1.03 : 1}
      onClick={(event) => {
        event.stopPropagation();
        onSelectSection("about");
      }}
      onPointerMove={onMovePointer}
      onPointerOut={onUnhoverSection}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHoverSection("about", event);
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.95, 2.05, 0.12]} />
        <meshStandardMaterial color={isActive || isHovered ? "#7a5430" : "#51371f"} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 0.28, 0.07]}>
        <boxGeometry args={[0.52, 0.72, 0.035]} />
        <meshStandardMaterial color="#2d2520" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.28, 0, 0.08]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      <StatusLight active={isActive || isHovered} position={[0, 1.25, 0.08]} />
    </group>
  );
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

function StatusLight({ active, position }) {
  return (
    <mesh position={position} scale={active ? 1 : 0.76}>
      <sphereGeometry args={[0.042, 6, 6]} />
      <meshStandardMaterial
        color={active ? "#ffce63" : "#63f28a"}
        emissive={active ? "#6a3f12" : "#174b27"}
        emissiveIntensity={active ? 0.85 : 0.28}
        flatShading
      />
    </mesh>
  );
}
