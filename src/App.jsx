import { Canvas } from "@react-three/fiber";
import React from "react";
import { Suspense, useMemo, useState } from "react";
import { RetroRoom } from "./components/RetroRoom.jsx";
import { menuItems, sections } from "./data/portfolio.js";

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  const currentSection = useMemo(
    () => sections[activeSection] ?? sections.about,
    [activeSection],
  );

  function selectMenuItem(itemId) {
    if (itemId === "start") {
      setHasStarted(true);
      return;
    }

    setHasStarted(true);
    setActiveSection(itemId);
  }

  return (
    <main className="app-shell">
      <Canvas
        camera={{ position: [4.5, 3.1, 5.4], fov: 46 }}
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#171419"]} />
        <fog attach="fog" args={["#171419", 5, 13]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          castShadow
          intensity={2.35}
          position={[3.5, 5.5, 4]}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight color="#63f28a" intensity={28} position={[-2.6, 2.4, -1.6]} distance={6} />

        <Suspense fallback={null}>
          <RetroRoom
            activeSection={activeSection}
            onSelectSection={setActiveSection}
          />
        </Suspense>
      </Canvas>

      {!hasStarted && (
        <section className="start-screen" aria-label="Menu inicial">
          <div className="title-block">
            <p className="eyebrow">Retro 3D portfolio</p>
            <h1>BENJA DEV WORLD</h1>
            <p>PRESS START</p>
          </div>
          <nav className="main-menu" aria-label="Menu del portfolio">
            {menuItems.map((item) => (
              <button key={item.id} type="button" onClick={() => selectMenuItem(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
        </section>
      )}

      {hasStarted && (
        <section className="interface-panel" aria-live="polite">
          <p className="eyebrow">{currentSection.label}</p>
          <h1>{currentSection.title}</h1>
          <h2>{currentSection.subtitle}</h2>
          <p>{currentSection.body}</p>
          <ul>
            {currentSection.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <nav className="section-tabs" aria-label="Secciones del portfolio">
            {Object.entries(sections).map(([id, section]) => (
            <button
              className={id === activeSection ? "active" : ""}
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </section>
      )}

      <div className="crt-overlay" aria-hidden="true" />
    </main>
  );
}
