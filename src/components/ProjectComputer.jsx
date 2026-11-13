import React, { useEffect, useRef, useState } from "react";
import { CursorCompanion } from "./CursorCompanion.jsx";

export function ProjectComputer({ projects, surfaceRef, onClose }) {
  const dialog = useRef(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [closing, setClosing] = useState(false);
  const exitTimer = useRef(null);
  const opener = useRef(null);
  const backButton = useRef(null);
  const visibleProjects = projects.filter(project => project.title.toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => { clearTimeout(exitTimer.current); element.close(); surfaceRef.current = null; };
  }, [surfaceRef]);

  useEffect(() => {
    if (selected) backButton.current?.focus();
    else Array.from(dialog.current?.querySelectorAll(".computer-folder") ?? []).find(button => button.dataset.project === opener.current)?.focus();
  }, [selected]);

  function back() { setSelected(null); }

  function leaveComputer() {
    if (exitTimer.current !== null) return;
    setClosing(true);
    dialog.current.querySelectorAll("video").forEach(video => video.pause());
    exitTimer.current = setTimeout(onClose, 280);
  }

  return (
    <dialog className={`computer-desktop${closing ? " is-closing" : ""}`} aria-labelledby="computer-title"
      ref={element => { dialog.current = element; surfaceRef.current = element; }}
      onCancel={event => { event.preventDefault(); if (closing) return; if (selected) back(); else leaveComputer(); }}>
      <header className="computer-titlebar">
        <span className="desktop-drive" aria-hidden="true" />
        <h2 id="computer-title">Mis proyectos</h2>
        <button type="button" className="computer-exit" data-sfx="none" onClick={leaveComputer} aria-label="Volver a la habitación" title="Volver a la habitación">×</button>
      </header>
      <nav className="computer-address" aria-label="Ubicación actual">
        <button type="button" ref={backButton} disabled={!selected} onClick={back} data-sfx="previous" aria-label="Volver a las carpetas" title="Volver a las carpetas">←</button>
        <span>Mi PC / Proyectos{selected ? ` / ${selected.title}` : ""}</span>
      </nav>
      {selected ? (
        <article className="computer-file" key={selected.title} aria-label={selected.title}>
          <div className="computer-media">
            {selected.video ? (
              <video controls playsInline muted preload="metadata" poster={selected.image} aria-label={`Video de ${selected.title}`}>
                <source src={selected.video} type="video/mp4" />
                Tu navegador no puede reproducir este video.
              </video>
            ) : selected.image ? <img src={selected.image} alt={`Captura de ${selected.title}`} /> : (
              <div className="computer-file-cover"><span className="desktop-folder" aria-hidden="true" /><strong>{selected.title}</strong></div>
            )}
          </div>
          <div className="computer-description">
            <p className="computer-file-status">{selected.status}</p>
            <h3>{selected.title}</h3>
            <p>{selected.description}</p>
            <ul className="computer-tech" aria-label="Tecnologías">{selected.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
            <div className="project-actions">
              {selected.actions.map(action => action.href ? (
                <a href={action.href} key={action.label} rel="noreferrer" target="_blank">
                  {action.label.toLowerCase() === "github" && <span className="social-icon github" aria-hidden="true" />}
                  {action.label}<span aria-hidden="true"> ↗</span>
                </a>
              ) : <span className="computer-private" key={action.label}>{action.label}</span>)}
            </div>
          </div>
        </article>
      ) : (
        <section className="computer-explorer" aria-label="Carpetas de proyectos">
          <label className="computer-search"><span>Buscar proyecto</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nombre del proyecto" /></label>
          <div className="computer-folders">
            {visibleProjects.map(project => <button className="computer-folder" key={project.title} type="button" data-sfx="open" data-project={project.title}
              onClick={() => { opener.current = project.title; setSelected(project); }}>
              <span className="desktop-folder" aria-hidden="true" />
              <strong>{project.title}</strong>
              <small>{project.status}</small>
            </button>)}
            {!visibleProjects.length && <p className="computer-empty">No se encontraron proyectos con ese nombre.</p>}
          </div>
        </section>
      )}
      <footer className="computer-statusbar">
        <span>{selected ? selected.title : `${visibleProjects.length} carpetas`}</span>
        <button type="button" data-sfx="none" onClick={leaveComputer}>↩ Volver a la habitación</button>
      </footer>
      <CursorCompanion />
    </dialog>
  );
}
