import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { RetroRoom } from "./components/RetroRoom.jsx";
import { menuItems, sections } from "./data/portfolio.js";
import * as THREE from "three";

export default function App() {
  const [mode, setMode] = useState("menu");
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, label: "", x: 0, y: 0 });
  const [classicSection, setClassicSection] = useState("about");
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [audioStatus, setAudioStatus] = useState("MÚSICA OFF");
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  const currentSection = useMemo(
    () => (activeSection ? sections[activeSection] : null),
    [activeSection],
  );
  const currentClassicSection = sections[classicSection] ?? sections.about;

  useEffect(() => {
    if (mode !== "entering") return undefined;

    const finishTimer = setTimeout(() => {
      setMode("explore");
      playSfx("open");
    }, 950);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [mode]);

  useEffect(() => {
    document.body.classList.toggle("is-pointing", Boolean(hoveredSection));
    return () => document.body.classList.remove("is-pointing");
  }, [hoveredSection]);

  function selectMenuItem(itemId) {
    if (itemId === "start") {
      playSfx("start");
      setActiveSection(null);
      setMode("entering");
      return;
    }

    playSfx("open");
    setMode("classic");
    setActiveSection(null);
  }

  function showSection(sectionId) {
    setActiveSection(sectionId);
    setMode("explore");
    playSfx("open");
  }

  function closePanel() {
    setActiveSection(null);
    playSfx("close");
  }

  function setObjectHover(sectionId, event) {
    const section = sections[sectionId];
    setHoveredSection(sectionId);
    setTooltip({
      visible: true,
      label: section?.label ?? "",
      x: event?.clientX ?? 0,
      y: event?.clientY ?? 0,
    });
    playSfx("hover");
  }

  function clearObjectHover() {
    setHoveredSection(null);
    setTooltip((current) => ({ ...current, visible: false }));
  }

  function moveTooltip(event) {
    if (!tooltip.visible) return;
    setTooltip((current) => ({
      ...current,
      x: event.clientX,
      y: event.clientY,
    }));
  }

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }

  function playSfx(type) {
    try {
      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const settings = {
        hover: [520, 0.018, 0.035],
        click: [220, 0.03, 0.07],
        open: [330, 0.035, 0.11],
        close: [150, 0.025, 0.08],
        start: [110, 0.045, 0.18],
      }[type] ?? [260, 0.025, 0.07];

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(settings[0], now);
      oscillator.frequency.exponentialRampToValueAtTime(settings[0] * 1.7, now + settings[2]);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(settings[1], now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + settings[2]);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + settings[2] + 0.02);
    } catch {
      // El feedback de audio es opcional y no debe bloquear la experiencia.
    }
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicEnabled) {
      audio.pause();
      setIsMusicEnabled(false);
      setAudioStatus("MÚSICA OFF");
      return;
    }

    try {
      audio.volume = 0.34;
      await audio.play();
      setIsMusicEnabled(true);
      setAudioStatus("MÚSICA ON");
    } catch {
      setAudioStatus("AGREGAR MÚSICA");
    }
  }

  return (
    <main className="app-shell">
      <audio ref={audioRef} loop preload="auto" src="/audio/ambient-loop.mp3" />

      <Canvas
        camera={{ position: [3.45, 1.55, 4.35], fov: 50 }}
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#171419"]} />
        <fog attach="fog" args={["#171419", 5, 13]} />
        <ambientLight intensity={0.68} />
        <directionalLight
          castShadow
          intensity={1.65}
          position={[3.2, 5.2, 3.4]}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight color="#63f28a" intensity={12} position={[-2.7, 2.15, -2.2]} distance={4.8} />
        <pointLight color="#75ff9d" intensity={24} position={[0, 0.82, -2.25]} distance={2.65} />
        <pointLight color="#ffce63" intensity={4.5} position={[2.5, 1.7, 0.8]} distance={4.2} />

        <Suspense fallback={null}>
          <CameraRig mode={mode} />
          <RetroRoom
            activeSection={activeSection}
            hoveredSection={hoveredSection}
            onHoverSection={setObjectHover}
            onMovePointer={moveTooltip}
            onSelectSection={(sectionId) => {
              playSfx("click");
              showSection(sectionId);
            }}
            onUnhoverSection={clearObjectHover}
          />
        </Suspense>
      </Canvas>

      {(mode === "menu" || mode === "entering") && (
        <section className={`start-screen ${mode === "entering" ? "leaving" : ""}`} aria-label="Menu inicial">
          <div className="title-block">
            <p className="eyebrow">Portfolio retro 3D</p>
            <h1>PORTFOLIO 3D RETRO</h1>
            <p className="menu-subtitle">Benjamín Velasco</p>
            <p className="press-start">PRESIONA INICIAR</p>
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

      {mode === "explore" && !currentSection && (
        <p className="explore-hint">Hacé clic en los objetos para explorar</p>
      )}

      {mode === "explore" && currentSection && (
        <section className={`interface-panel ${activeSection === "projects" ? "projects-panel" : ""}`} aria-live="polite">
          <button className="panel-close" type="button" onClick={closePanel} aria-label="Cerrar panel">
            X
          </button>
          <p className="eyebrow">{currentSection.label}</p>
          <h1>{currentSection.title}</h1>
          <h2>{currentSection.subtitle}</h2>
          {currentSection.body && <p>{currentSection.body}</p>}
          <SectionDetails section={currentSection} />
      </section>
      )}

      {mode === "classic" && (
        <section className="interface-panel classic-panel" aria-live="polite">
          <button className="panel-close" type="button" onClick={() => setMode("menu")} aria-label="Cerrar panel">
            X
          </button>
          <p className="eyebrow">Modo clásico</p>
          <h1>VISTA RÁPIDA</h1>
          <nav className="classic-tabs" aria-label="Secciones rápidas">
            {Object.entries(sections).map(([id, section]) => (
              <button
                className={id === classicSection ? "active" : ""}
                key={id}
                type="button"
                onClick={() => {
                  setClassicSection(id);
                  playSfx("click");
                }}
              >
                {section.label}
              </button>
            ))}
          </nav>
          <div className="classic-list">
            <article>
              <h2>{currentClassicSection.title}</h2>
              <p>{currentClassicSection.subtitle}</p>
              {currentClassicSection.body && <p>{currentClassicSection.body}</p>}
              <SectionDetails section={currentClassicSection} />
            </article>
          </div>
        </section>
      )}

      {tooltip.visible && (
        <div className="object-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.label}
        </div>
      )}

      {mode === "explore" && (
        <button className="classic-toggle" type="button" onClick={() => setMode("classic")}>
          MODO CLÁSICO
        </button>
      )}

      <button
        className={`sound-toggle ${isMusicEnabled ? "playing" : ""}`}
        type="button"
        onClick={toggleMusic}
        aria-label={isMusicEnabled ? "Desactivar música" : "Activar música"}
        title={audioStatus}
      >
        <span className="speaker-icon" aria-hidden="true">
          <span />
        </span>
        <span>{audioStatus}</span>
      </button>

      <div className="crt-overlay" aria-hidden="true" />
    </main>
  );
}

function SectionDetails({ section }) {
  return (
    <>
      {section.lines.length > 0 && (
        <ul>
          {section.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {section.links && (
        <div className="social-links" aria-label={`Enlaces de ${section.label}`}>
          {section.links.map((link) => (
            <a
              download={link.download}
              href={link.href}
              key={link.href}
              rel={link.download ? undefined : "noreferrer"}
              target={link.download ? undefined : "_blank"}
            >
              <span className={`social-icon ${link.icon}`} aria-hidden="true" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {section.projects && (
        <div className="project-grid" aria-label="Misiones de proyecto">
          {section.projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-preview" aria-hidden="true">
                <span>{project.code}</span>
                {project.image ? (
                  <img alt="" src={project.image} />
                ) : (
                  <div className="preview-window">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
              </div>
              <div className="project-content">
                <div className="project-heading">
                  <span>{project.code}</span>
                  <span>{project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-tags">
                  {project.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className="project-actions">
                  {project.actions.map((action) =>
                    action.href ? (
                      <a href={action.href} key={action.label} rel="noreferrer" target="_blank">
                        {action.label.toLowerCase() === "github" && (
                          <span className="social-icon github" aria-hidden="true" />
                        )}
                        {action.label}
                      </a>
                    ) : (
                      <button disabled={action.disabled} key={action.label} type="button">
                        {action.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {section.facts && (
        <div className="fact-grid" aria-label={`Datos de ${section.label}`}>
          {section.facts.map((fact) => (
            <div className="fact-card" key={`${fact.label}-${fact.value}`}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      )}

      {section.skillGroups && (
        <div className="skill-groups" aria-label="Habilidades técnicas">
          {section.skillGroups.map((group) => (
            <details className="skill-group" key={group.title}>
              <summary>
                <span>{group.title}</span>
                <span>{group.items.length} ítems</span>
              </summary>
              <div className="skill-group-content">
                {group.items.map((skill) => (
                  <div className="skill-row" key={skill.name}>
                    <div className="skill-meta">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-track" aria-hidden="true">
                      <span className={`skill-fill ${getSkillTone(skill.level)}`} style={{ width: `${skill.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

function getSkillTone(level) {
  if (level >= 70) return "high";
  if (level >= 50) return "mid";
  if (level >= 25) return "low";
  return "danger";
}

function CameraRig({ mode }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.15, -2.05));
  const menuPosition = useMemo(() => new THREE.Vector3(3.45, 1.55, 4.35), []);
  const explorePosition = useMemo(() => new THREE.Vector3(2.8, 1.35, 3.75), []);

  useFrame(() => {
    const destination = mode === "menu" ? menuPosition : explorePosition;
    const lookTarget = mode === "menu" ? new THREE.Vector3(0, 0.15, -2.05) : new THREE.Vector3(0, 0.35, -2.28);
    camera.position.lerp(destination, mode === "entering" ? 0.035 : 0.08);
    target.current.lerp(lookTarget, 0.08);
    camera.lookAt(target.current);
  });

  return null;
}
