import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { courses, academicStatuses } from "../data/academic.js";
import { RetroSelect } from "./RetroSelect.jsx";
import { ConnectionMap } from "./ConnectionMap.jsx";
import { CursorCompanion } from "./CursorCompanion.jsx";

export function AcademicMap({ onClose, onSound }) {
  const dialog = useRef(null);
  const returnFocus = useRef(document.activeElement);
  const [selected, setSelected] = useState("1");
  const [yearView, setYearView] = useState(1);
  const [query, setQuery] = useState("");
  const course = courses.find((item) => item.id === selected);
  const titleEarned = courses.filter((item) => item.year <= 3).every((item) => item.status === "approved");
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const matches = query.trim() ? courses.filter((item) => normalize(item.title + " " + item.code).includes(normalize(query))).slice(0, 8) : [];

  useEffect(() => {
    dialog.current.showModal();
    return () => { requestAnimationFrame(() => returnFocus.current?.focus()); };
  }, []);

  const { nodes, edges } = useMemo(() => {
    const visible = courses;
    const nodes = visible.map((item) => ({ ...item, label: item.code, statusLabel: academicStatuses[item.status] }));
    const edges = visible.flatMap((item) => [...item.regular.map((from) => ({ from, to: item.id, kind: "regular" })), ...item.approved.map((from) => ({ from, to: item.id, kind: "approved" }))]);
    return { nodes, edges };
  }, []);

  function select(id) {
    setYearView(null);
    setSelected(id);
    setQuery("");
  }


  return createPortal(
    <dialog ref={dialog} className="academic-dialog" aria-labelledby="academic-title" onCancel={(event) => { event.preventDefault(); onSound?.("close"); onClose(); }}>
      <header className="academic-header">
        <div><p className="university-name">Universidad Nacional de Villa Mercedes<strong>UNViMe</strong></p><h2 id="academic-title">Ingeniería en Sistemas de Información</h2></div>
        <button type="button" className="map-close" data-sfx="close" aria-label="Cerrar árbol académico" autoFocus onClick={onClose}>×</button>
      </header>
      <div className="academic-progress">
        <span className="progress-approved"><strong>{courses.filter((item) => item.status === "approved").length}</strong> materias aprobadas</span>
        <span className="progress-regular"><strong>{courses.filter((item) => item.status === "regular").length}</strong> regularizada</span><span className="progress-ongoing"><strong>{courses.filter((item) => item.status === "ongoing").length}</strong> en curso</span>
        <span className="degree-milestone">{titleEarned ? "✓" : "○"} Analista Universitario en Sistemas</span>
      </div>
      <div className="academic-toolbar">
        <RetroSelect label="Ir al año" value={yearView ?? course.year} onChange={(value) => { setSelected(courses.find((item) => item.year === Number(value)).id); setYearView(Number(value)); setQuery(""); }} options={["Primero", "Segundo", "Tercero", "Cuarto", "Quinto"].map((label, index) => ({ value: String(index + 1), label }))} />
        <label className="academic-search">Materia<input type="search" placeholder="Buscar materia o código" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      </div>
      {query.trim() && <div className="academic-results" aria-label="Resultados de materias">{matches.length ? matches.map((item) => <button type="button" key={item.id} data-sfx="tab" onClick={() => select(item.id)}>{item.code} · {item.title}</button>) : <p>No hay materias que coincidan.</p>}</div>}
      <div className="academic-layout">
        <div className="academic-chart">
          <ConnectionMap academic yearView={yearView} onExplore={() => setYearView(null)} nodes={nodes} edges={edges} selected={selected} onSelect={select} label="Árbol de materias y correlativas" />
        </div>
        <aside className="academic-inspector" aria-label="Detalle de la materia" aria-live="polite">
          <p className={`academic-status ${course.status}`}>{academicStatuses[course.status]} · {course.code}</p>
          <h3>{course.title}</h3><p>{course.year}° año · {course.term}° cuatrimestre</p>
          {course.note && <p className="academic-note">{course.note}</p>}
        </aside>
      </div>
      <CursorCompanion />
    </dialog>, document.body,
  );
}
