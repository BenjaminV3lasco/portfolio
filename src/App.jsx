import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RetroRoom } from "./components/RetroRoom.jsx";
import { SkillsTree } from "./components/SkillsTree.jsx";
import { CursorCompanion } from "./components/CursorCompanion.jsx";
import { AcademicMap } from "./components/AcademicMap.jsx";
import { ProjectComputer } from "./components/ProjectComputer.jsx";
import { FocusedPanel } from "./components/FocusedPanel.jsx";
import { PhoneKeypad } from "./components/PhoneKeypad.jsx";
import { deskItems, phoneKeys } from "./data/deskLayout.js";
import { objectViews, getObjectFrame, easeCameraTravel } from "./data/roomNavigation.js";
import { menuItems, sections } from "./data/portfolio.js";
import * as THREE from "three";

export default function App() {
  const [mode, setMode] = useState("menu");
  const [activeSection, setActiveSection] = useState(null);
  const [viewReady, setViewReady] = useState(false);
  const computerSurface = useRef(null);
  const phoneSurface = useRef(null);
  const phoneInteraction = useRef({ hovered: null, focused: null, pressed: null });
  const phoneTone = useRef(null);
  const handleViewReady = useCallback(() => setViewReady(true), []);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, label: "", x: 0, y: 0 });
  const [classicSection, setClassicSection] = useState("about");
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [audioStatus, setAudioStatus] = useState("MÚSICA OFF");
  const [effectsEnabled, setEffectsEnabled] = useState(() => {
    try { return localStorage.getItem("portfolio-effects") !== "off"; } catch { return true; }
  });
  const effectsEnabledRef = useRef(effectsEnabled);
  const effectsGainRef = useRef(null);
  const lastSoundRef = useRef({ hover: -Infinity, action: -Infinity });
  const audioRef = useRef(null);
  const teddyAudioRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => () => {
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    effectsGainRef.current = null;
  }, []);

  const currentSection = useMemo(
    () => (activeSection ? sections[activeSection] : null),
    [activeSection],
  );
  const currentClassicSection = sections[classicSection] ?? sections.about;
  const canExploreObjects = mode === "explore" && !activeSection;
  const computerOpen = mode === "explore" && activeSection === "projects";

  useEffect(() => {
    if (!activeSection || (viewReady && currentSection)) return;
    function cancel(event) {
      if (event.key === "Escape") { closePanel(); playSfx("close"); }
    }
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [activeSection, viewReady, currentSection]);

  function finishEntering() {
    setMode(current => current === "entering" || current === "returning" ? "explore" : current);
  }

  useEffect(() => {
    document.body.classList.toggle("is-pointing", Boolean(hoveredSection));
    return () => document.body.classList.remove("is-pointing");
  }, [hoveredSection]);

  useEffect(() => {
    if (canExploreObjects) return;
    setHoveredSection(null);
    setTooltip((current) => ({ ...current, visible: false }));
  }, [canExploreObjects]);

  function selectMenuItem(itemId) {
    if (itemId === "start") {
      setActiveSection(null);
      setMode("entering");
      return;
    }

    setMode("classic");
    setActiveSection(null);
  }

  function showSection(sectionId) {
    if (!canExploreObjects) return;
    if (sectionId === "exit") {
      setViewReady(false);
      clearObjectHover();
      setActiveSection(null);
      setMode("menu");
      playSfx("close");
      return;
    }
    if (!objectViews[sectionId]) return;
    setViewReady(false);
    clearObjectHover();
    setActiveSection(sectionId);
    setMode("explore");
    playSfx("open");
  }

  function closePanel() {
    setActiveSection(null);
    setViewReady(false);
    setMode("returning");
  }

  function setObjectHover(sectionId, event, labelOverride) {
    if (!canExploreObjects) return;
    const section = sections[sectionId];
    setHoveredSection(sectionId);
    setTooltip({
      visible: true,
      label: labelOverride ?? section?.label ?? "",
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
    if (!canExploreObjects || !tooltip.visible) return;
    setTooltip((current) => ({
      ...current,
      x: event.clientX,
      y: event.clientY,
    }));
  }

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      effectsGainRef.current = audioContextRef.current.createGain();
      effectsGainRef.current.gain.value = effectsEnabledRef.current ? 1 : 0;
      effectsGainRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }

  async function playSfx(type) {
    if (!effectsEnabledRef.current) return;
    // Hover never unlocks audio: wait for an intentional interaction first.
    if (type === "hover" && audioContextRef.current?.state !== "running") return;
    const time = performance.now();
    const last = lastSoundRef.current;
    if (type === "hover" && (time - last.hover < 120 || time - last.action < 100)) return;
    if (type !== "hover" && time - last.action < 35) return;
    last[type === "hover" ? "hover" : "action"] = time;
    try {
      const context = getAudioContext();
      if (context.state === "suspended") await context.resume();
      if (!effectsEnabledRef.current || context.state !== "running") return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const settings = {
        hover: [520, 0.008, 0.025, 1.12],
        click: [220, 0.018, 0.05, 1.4],
        tab: [440, 0.016, 0.065, 1.5],
        next: [390, 0.018, 0.08, 1.6],
        previous: [620, 0.018, 0.08, 0.65],
        expand: [300, 0.016, 0.085, 1.8],
        collapse: [480, 0.014, 0.07, 0.6],
        link: [660, 0.018, 0.1, 1.3],
        download: [520, 0.02, 0.14, 2],
        open: [330, 0.022, 0.11, 1.7],
        close: [300, 0.018, 0.08, 0.5],
        start: [110, 0.028, 0.18, 3],
        teddy: [740, 0.028, 0.12, 1.7],
      }[type] ?? [260, 0.018, 0.07, 1.4];

      oscillator.type = type === "start" ? "square" : "triangle";
      oscillator.frequency.setValueAtTime(settings[0], now);
      oscillator.frequency.exponentialRampToValueAtTime(settings[0] * settings[3], now + settings[2]);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(settings[1], now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + settings[2]);
      oscillator.connect(gain);
      gain.connect(effectsGainRef.current);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(now);
      oscillator.stop(now + settings[2] + 0.02);
    } catch {
      // El feedback de audio es opcional y no debe bloquear la experiencia.
    }
  }

  async function playPhoneTone(digit) {
    const key = phoneKeys.find(item => item.digit === digit);
    if (!key || !effectsEnabledRef.current) return;
    try {
      const context = getAudioContext();
      if (context.state === "suspended") await context.resume();
      if (!effectsEnabledRef.current || context.state !== "running") return;
      const now = context.currentTime;
      phoneTone.current?.stop();
      const gain = context.createGain();
      gain.connect(effectsGainRef.current);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.008);
      gain.gain.setValueAtTime(0.025, now + 0.105);
      gain.gain.linearRampToValueAtTime(0, now + 0.14);
      const oscillators = key.frequencies.map(frequency => {
        const oscillator = context.createOscillator();
        oscillator.frequency.value = frequency;
        oscillator.type = "sine";
        oscillator.connect(gain);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        return oscillator;
      });
      const tone = { stop: () => {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.setTargetAtTime(0, context.currentTime, 0.005);
      } };
      phoneTone.current = tone;
      oscillators[0].onended = () => {
        oscillators.forEach(oscillator => oscillator.disconnect());
        gain.disconnect();
        if (phoneTone.current === tone) phoneTone.current = null;
      };
    } catch { /* Optional audio must not interrupt navigation. */ }
  }

  function toggleEffects() {
    const enabled = !effectsEnabledRef.current;
    effectsEnabledRef.current = enabled;
    setEffectsEnabled(enabled);
    try { localStorage.setItem("portfolio-effects", enabled ? "on" : "off"); } catch { /* Storage is optional. */ }
    if (effectsGainRef.current) effectsGainRef.current.gain.setTargetAtTime(enabled ? 1 : 0, audioContextRef.current.currentTime, 0.01);
    if (!enabled) teddyAudioRef.current?.pause();
    else playSfx("click");
  }

  function interactiveControl(target) {
    const control = target.closest?.("button, a[href], summary");
    if (!control || control.matches(":disabled, [aria-disabled='true']")) return null;
    return control;
  }

  function handleInterfaceClick(event) {
    const control = interactiveControl(event.target);
    if (!control || control.dataset.sfx === "none") return;
    if (control.getAttribute("aria-selected") === "true" || control.getAttribute("aria-current") === "page") return;
    if (control.closest(".company-selector") && control.getAttribute("aria-pressed") === "true") return;
    const type = control.tagName === "SUMMARY" ? (control.parentElement.open ? "collapse" : "expand")
      : control.tagName === "A" ? (control.hasAttribute("download") ? "download" : "link")
      : control.dataset.sfx ?? "click";
    playSfx(type);
  }

  function handleInterfaceHover(event) {
    const control = interactiveControl(event.target);
    if (!control || control.dataset.sfx === "none" || control.contains(event.relatedTarget)) return;
    if (event.type === "focus" && !control.matches(":focus-visible")) return;
    if (event.pointerType && event.pointerType !== "mouse") return;
    playSfx("hover");
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
    <main className="app-shell" onClickCapture={handleInterfaceClick} onPointerOver={handleInterfaceHover} onFocusCapture={handleInterfaceHover}>
      <audio ref={audioRef} loop preload="auto" src="/audio/ambient-loop.mp3" />
      <audio ref={teddyAudioRef} preload="auto" src="/audio/teddy-sound.mp3" />

      <Canvas
        style={{ pointerEvents: canExploreObjects ? "auto" : "none" }}
        camera={{ position: [3.45, 1.55, 4.35], fov: 50 }}
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: false }}
      >
        <color attach="background" args={["#171419"]} />
        <fog attach="fog" args={["#171419", 5, 13]} />
        <ambientLight intensity={0.48} />
        <hemisphereLight args={["#d2e0e4", "#51484a", 0.5]} />
        <directionalLight
          castShadow
          intensity={1.9}
          color="#fff0dc"
          position={[3.2, 5.2, 3.4]}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-normalBias={0.025}
          shadow-bias={-0.00015}
          shadow-radius={2.5}
        />
        <pointLight color="#c4dfce" intensity={2.8} position={[-2.7, 2.15, -2.2]} distance={4.8} />
        <MonitorFill focused={computerOpen} />
        <pointLight color="#bacfcb" intensity={1.2} position={[-0.34, 1.45, -2.9]} distance={3.2} />
        <pointLight color="#f5cd9d" intensity={3} position={[2.5, 1.7, 0.8]} distance={4.2} />
        <InspectionLight sectionId={activeSection} />

        <Suspense fallback={null}>
          <CameraRig mode={mode} activeSection={activeSection} onViewReady={handleViewReady} onRoomReady={finishEntering} computerSurface={computerSurface} />
          <RetroRoom
            phoneSurface={phoneSurface}
            phoneInteraction={phoneInteraction}
            proximityEnabled={canExploreObjects}
            activeSection={activeSection}
            hoveredSection={hoveredSection}
            onHoverSection={setObjectHover}
            onMovePointer={moveTooltip}
            onSelectSection={(sectionId) => {
              if (!canExploreObjects) return;
              showSection(sectionId);
            }}
            onTeddyPress={() => {
              if (!canExploreObjects || !effectsEnabledRef.current) return;
              const teddyAudio = teddyAudioRef.current;
              if (!teddyAudio) return;
              teddyAudio.currentTime = 0;
              teddyAudio.volume = 0.32;
              teddyAudio.play().catch(() => {
                playSfx("teddy");
              });
            }}
            onUnhoverSection={clearObjectHover}
          />
        </Suspense>
      </Canvas>

      {(mode === "menu" || mode === "entering") && (
        <section className={`start-screen ${mode === "entering" ? "leaving" : ""}`} aria-label="Menu inicial">
          <div className="title-block">
            <h1>PORTFOLIO 3D RETRO</h1>
            <p className="menu-subtitle">Benjamín Velasco  -  Full Stack Developer</p>
            <p className="press-start">PRESIONA INICIAR</p>
          </div>
          <nav className="main-menu" aria-label="Menu del portfolio">
            {menuItems.map((item) => (
              <button key={item.id} type="button" data-sfx={item.id === "start" ? "start" : "open"} onClick={() => selectMenuItem(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
        </section>
      )}

      {canExploreObjects && (
        <p className="explore-hint">Hacé clic en los objetos para explorar</p>
      )}

      {activeSection && !viewReady && (
        <button className="room-return" type="button" data-sfx="close" onClick={closePanel}>
          <span aria-hidden="true">←</span><span>Volver a la habitación</span>
        </button>
      )}

      {computerOpen && viewReady && (
        <ProjectComputer projects={sections.projects.projects} surfaceRef={computerSurface} onClose={() => { closePanel(); playSfx("close"); }} />
      )}

      {mode === "explore" && currentSection && !computerOpen && viewReady && (
        <FocusedPanel section={currentSection} sectionId={activeSection} onClose={closePanel}>
          <SectionDetails key={activeSection} section={currentSection} onSound={playSfx} />
        </FocusedPanel>
      )}

      {mode === "explore" && activeSection === "contact" && viewReady &&
        <PhoneKeypad surfaceRef={phoneSurface} interaction={phoneInteraction} onPress={playPhoneTone} />}

      {mode === "classic" && (
        <section className={`interface-panel classic-panel ${classicSection === "projects" ? "projects-panel" : ""} ${classicSection === "skills" ? "skills-panel" : ""}`} aria-live="polite">
          <button className="panel-close" type="button" data-sfx="close" onClick={() => setMode("menu")} aria-label="Cerrar panel">
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
                data-sfx="tab"
                aria-current={id === classicSection ? "page" : undefined}
                onClick={() => {
                  setClassicSection(id);
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
              {currentClassicSection.body && !currentClassicSection.experience && <p>{currentClassicSection.body}</p>}
              <SectionDetails key={classicSection} section={currentClassicSection} onSound={playSfx} />
            </article>
          </div>
        </section>
      )}

      {tooltip.visible && (
        <div className="object-tooltip" style={{ left: Math.max(0, Math.min(tooltip.x, window.innerWidth - 220)), top: Math.max(0, Math.min(tooltip.y, window.innerHeight - 85)), maxWidth: 180 }}>
          {tooltip.label}
        </div>
      )}

      {canExploreObjects && (
        <button className="classic-toggle" type="button" data-sfx="open" onClick={() => setMode("classic")}>
          MODO CLÁSICO
        </button>
      )}

      <div className="audio-controls" role="group" aria-label="Audio" style={{ display: activeSection ? "none" : undefined }}>
      <button className={`sound-toggle effects-toggle ${effectsEnabled ? "playing" : ""}`} type="button"
        data-sfx="none" aria-pressed={effectsEnabled} title="Efectos de interacción"
        aria-label={effectsEnabled ? "Desactivar efectos de sonido" : "Activar efectos de sonido"} onClick={toggleEffects}>
        <span className="speaker-icon" aria-hidden="true"><span /></span>
        <span>EFECTOS {effectsEnabled ? "ON" : "OFF"}</span>
      </button>
      <button
        className={`sound-toggle ${isMusicEnabled ? "playing" : ""}`}
        type="button"
        onClick={toggleMusic}
        aria-label={isMusicEnabled ? "Desactivar música" : "Activar música"}
        title={audioStatus}
        aria-pressed={isMusicEnabled}
      >
        <span className="speaker-icon" aria-hidden="true">
          <span />
        </span>
        <span>{audioStatus}</span>
      </button>
      </div>

      <div className="crt-overlay" aria-hidden="true" />
      {(canExploreObjects || mode === "classic") && <CursorCompanion interactive={hoveredSection} />}
    </main>
  );
}

function ProfileDetails({ section, onSound }) {
  const [view, setView] = useState("profile");
  const [company, setCompany] = useState(0);
  const tabs = [{ id: "profile", label: "Perfil" }, { id: "facts", label: "Datos" }, { id: "experience", label: "Experiencia" }];
  const job = section.experience[company];

  function navigateTabs(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    if (view !== tabs[next].id) onSound?.("tab");
    setView(tabs[next].id);
    event.currentTarget.parentElement.children[next].focus();
  }

  return (
    <div className="profile-details">
      <div className="profile-tabs" role="tablist" aria-label="Perfil profesional">
        {tabs.map((tab, index) => (
          <button key={tab.id} id={`profile-tab-${tab.id}`} role="tab" type="button" data-sfx="tab"
            aria-selected={view === tab.id} aria-controls="profile-content"
            tabIndex={view === tab.id ? 0 : -1}
            onKeyDown={(event) => navigateTabs(event, index)} onClick={() => setView(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div id="profile-content" className="profile-content" role="tabpanel" tabIndex={0} aria-labelledby={`profile-tab-${view}`}>
        {view === "profile" && <p>{section.body}</p>}
        {view === "facts" && <SectionDetails section={{ label: section.label, lines: [], facts: section.facts }} />}
        {view === "experience" && (
          <>
            <div className="company-selector" role="group" aria-label="Empresa">
              {section.experience.map((item, index) => (
                <button key={item.company} type="button" data-sfx="tab" aria-pressed={company === index} onClick={() => setCompany(index)}>{item.company}</button>
              ))}
            </div>
            <div className="job-detail">
              <p className="job-period">{job.period}</p>
              <h3>{job.role}</h3>
              <ul>{job.contributions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionDetails({ section, onSound }) {
  const [academicOpen, setAcademicOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 1100px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1100px)");
    const onResize = () => {
      setCompact(query.matches);
      setPage(0);
    };
    query.addEventListener("change", onResize);
    return () => query.removeEventListener("change", onResize);
  }, []);
  const pageSize = compact ? 1 : 3;
  const pageCount = Math.ceil((section.projects?.length ?? 0) / pageSize);

  if (section.experience) return <ProfileDetails section={section} onSound={onSound} />;

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
        <>
        <nav className="project-pagination" aria-label="Páginas de proyectos">
          <button type="button" data-sfx="previous" title="Proyectos anteriores" aria-label="Proyectos anteriores" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>&larr;</button>
          <span role="status">Página {page + 1} de {pageCount}</span>
          <button type="button" data-sfx="next" title="Proyectos siguientes" aria-label="Proyectos siguientes" disabled={page >= pageCount - 1} onClick={() => setPage((current) => current + 1)}>&rarr;</button>
        </nav>
        <div className="project-grid" aria-label="Misiones de proyecto">
          {section.projects.slice(page * pageSize, (page + 1) * pageSize).map((project) => (
            <article className="project-card" key={project.title}>
              {(project.video || project.image) && (
              <div className="project-preview" aria-hidden="true">
                <span>{project.code}</span>
                {project.video ? (
                  <video autoPlay loop muted playsInline preload="metadata" poster={project.image}>
                    <source src={project.video} type="video/mp4" />
                  </video>
                ) : project.image ? (
                  <img alt="" src={project.image} />
                ) : (
                  <div className="preview-window">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
              </div>
              )}
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
        </>
      )}

      {section.facts && (
        <div className="fact-grid" aria-label={`Datos de ${section.label}`}>
          {section.facts.map((fact) => (
            fact.label === "Carrera" && section === sections.education ? (
              <button type="button" className="fact-card degree-link" key={fact.label} data-sfx="open" onClick={() => setAcademicOpen(true)}>
                <span>{fact.label}</span><strong>{fact.value}</strong><small>Ver materias y correlativas ↗</small>
              </button>
            ) : <div className="fact-card" key={`${fact.label}-${fact.value}`}>
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
              {fact.detail && <small>{fact.detail}</small>}
            </div>
          ))}
        </div>
      )}

      {section.skillGroups && (
        <SkillsTree />
      )}

      {academicOpen && <AcademicMap onSound={onSound} onClose={() => setAcademicOpen(false)} />}

    </>
  );
}

function MonitorFill({ focused }) {
  const light = useRef();
  useFrame((_, delta) => {
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, focused ? 1.2 : 5.5, 3, Math.min(delta, 0.1));
  });
  return <pointLight ref={light} color="#b6dfc3" intensity={5.5} position={[0, 0.82, -2.25]} distance={2.85} />;
}

function InspectionLight({ sectionId }) {
  const light = useRef();
  const destination = useMemo(() => {
    const view = objectViews[sectionId];
    return view ? new THREE.Vector3(...view.target).addScaledVector(new THREE.Vector3(...view.direction).normalize(), 1.25).add(new THREE.Vector3(0, 0.5, 0)) : null;
  }, [sectionId]);
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1);
    if (destination) light.current.position.lerp(destination, 1 - Math.exp(-3 * step));
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, destination && sectionId !== "projects" ? 1.4 : 0, 3, step);
  });
  return <pointLight ref={light} position={[0, 1, 0]} intensity={0} color="#f1e5d2" distance={2.8} />;
}

function CameraRig({ mode, activeSection, onViewReady, onRoomReady, computerSurface }) {
  const { camera, size, scene } = useThree();
  const computerOpen = activeSection === "projects";
  const target = useRef(new THREE.Vector3(0, 0.15, -2.05));
  const framedPosition = useMemo(() => new THREE.Vector3(), []);
  const objectFrame = useMemo(() => getObjectFrame(activeSection, size.width, size.height), [activeSection, size.width, size.height]);
  const cornerA = useMemo(() => new THREE.Vector3(), []);
  const cornerB = useMemo(() => new THREE.Vector3(), []);
  const notified = useRef(false);
  const roomNotified = useRef(false);
  const travel = useRef({
    key: "", elapsed: 0, duration: 1.4,
    position: new THREE.Vector3(), target: new THREE.Vector3(), offset: new THREE.Vector2(), fov: 50,
  });

  const cameraProfile = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const isMobile = size.width < 620;
    const isTablet = size.width < 900;
    const isNotebook = size.width < 1280;
    const isWide = size.width >= 1600;

    if (isMobile) {
      return {
        menu: new THREE.Vector3(6, 1.6, 12.2),
        explore: new THREE.Vector3(5.6, 1.45, 11.2),
        menuTarget: new THREE.Vector3(-0.55, 0.08, -1.65),
        exploreTarget: new THREE.Vector3(-0.55, 0.18, -1.65),
        fov: 68,
      };
    }

    if (isTablet || aspect < 1.25) {
      return {
        menu: new THREE.Vector3(4.25, 1.8, 5.55),
        explore: new THREE.Vector3(3.65, 1.55, 4.85),
        menuTarget: new THREE.Vector3(-0.05, 0.16, -2.08),
        exploreTarget: new THREE.Vector3(-0.35, 0.25, -1.9),
        fov: 58,
      };
    }

    if (isNotebook) {
      return {
        menu: new THREE.Vector3(4.1, 1.72, 5.05),
        explore: new THREE.Vector3(3.15, 1.42, 4.2),
        menuTarget: new THREE.Vector3(0.24, 0.12, -2.0),
        exploreTarget: new THREE.Vector3(-0.38, 0.25, -1.9),
        fov: 54,
      };
    }

    if (isWide) {
      return {
        menu: new THREE.Vector3(3.2, 1.5, 4.1),
        explore: new THREE.Vector3(2.65, 1.32, 3.58),
        menuTarget: new THREE.Vector3(0, 0.15, -2.05),
        exploreTarget: new THREE.Vector3(-0.38, 0.25, -1.9),
        fov: 48,
      };
    }

    return {
      menu: new THREE.Vector3(3.45, 1.55, 4.35),
      explore: new THREE.Vector3(2.8, 1.35, 3.75),
      menuTarget: new THREE.Vector3(0, 0.15, -2.05),
      exploreTarget: new THREE.Vector3(-0.38, 0.25, -1.9),
      fov: 50,
    };
  }, [size.width, size.height]);

  useFrame((_, delta) => {
    const destination = mode === "menu" ? cameraProfile.menu : cameraProfile.explore;
    const lookTarget = objectFrame?.target ?? (mode === "menu" ? cameraProfile.menuTarget : cameraProfile.exploreTarget);
    framedPosition.copy(destination);
    if (mode !== "menu" && size.width >= 900) {
      framedPosition.lerp(lookTarget, 0.1);
    }
    let fov = cameraProfile.fov;
    if (objectFrame) {
      fov = objectFrame.fov;
      framedPosition.copy(objectFrame.position);
    }
    // Capture the current pose, including mid-flight reversals, before easing to a new view.
    const view = activeSection ?? (mode === "menu" ? "menu" : "room");
    const key = `${view}:${size.width}:${size.height}`;
    const motion = travel.current;
    if (motion.key !== key) {
      motion.key = key;
      motion.elapsed = 0;
      motion.duration = computerOpen ? 2.4 : activeSection ? 1.9 : 2;
      notified.current = false;
      roomNotified.current = false;
      motion.position.copy(camera.position);
      motion.target.copy(target.current);
      motion.fov = camera.fov;
      motion.offset.set(camera.view?.enabled ? camera.view.offsetX / camera.view.fullWidth : 0,
        camera.view?.enabled ? camera.view.offsetY / camera.view.fullHeight : 0);
    }
    motion.elapsed += Math.min(delta, 0.1);
    // Camera travel is an intentional navigation action, never a one-frame teleport.
    const progress = Math.min(motion.elapsed / motion.duration, 1);
    const eased = easeCameraTravel(progress);
    camera.position.lerpVectors(motion.position, framedPosition, eased);
    camera.fov = THREE.MathUtils.lerp(motion.fov, fov, eased);
    camera.setViewOffset(size.width, size.height,
      THREE.MathUtils.lerp(motion.offset.x, objectFrame?.offset.x ?? 0, eased) * size.width,
      THREE.MathUtils.lerp(motion.offset.y, objectFrame?.offset.y ?? 0, eased) * size.height,
      size.width, size.height);
    target.current.lerpVectors(motion.target, lookTarget, eased);
    camera.lookAt(target.current);
    if ((mode === "entering" || mode === "returning") && progress === 1 && !roomNotified.current) {
      roomNotified.current = true;
      onRoomReady();
    }
    if (activeSection && !notified.current && progress === 1) {
      notified.current = true;
      onViewReady(activeSection);
    }
    if (computerOpen && computerSurface.current && size.width > 760 && size.height > 540) {
      camera.updateMatrixWorld();
      cornerA.set(deskItems.monitor.x - 0.34, 0.575, -2.589).project(camera);
      cornerB.set(deskItems.monitor.x + 0.34, 0.145, -2.589).project(camera);
      const style = computerSurface.current.style;
      style.setProperty("--screen-left", `${(cornerA.x + 1) * size.width / 2}px`);
      style.setProperty("--screen-top", `${(1 - cornerA.y) * size.height / 2}px`);
      style.setProperty("--screen-width", `${(cornerB.x - cornerA.x) * size.width / 2}px`);
      style.setProperty("--screen-height", `${(cornerA.y - cornerB.y) * size.height / 2}px`);
    }
    if (scene.fog) {
      const distance = camera.position.distanceTo(target.current);
      scene.fog.near = Math.max(4, distance - 3);
      scene.fog.far = distance + 9;
    }
  });

  return null;
}
