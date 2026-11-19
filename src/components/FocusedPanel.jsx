import React, { useEffect, useRef, useState } from "react";
import { CursorCompanion } from "./CursorCompanion.jsx";

export function FocusedPanel({ section, sectionId, onClose, children }) {
  const dialog = useRef(null);
  const closeTimer = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (sectionId === "contact") element.show();
    else element.showModal();
    return () => { clearTimeout(closeTimer.current); element.close(); };
  }, [sectionId]);

  useEffect(() => {
    if (sectionId !== "contact") return;
    function escape(event) {
      if (event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); leave(); }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [sectionId]);

  function leave() {
    if (closeTimer.current !== null) return;
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 240);
  }

  return (
    <dialog ref={dialog} className={`interface-panel focused-panel focused-${sectionId}${closing ? " is-closing" : ""}`}
      aria-labelledby="focused-title" aria-modal={sectionId !== "contact"} onCancel={event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        leave();
      }}>
      <header className="focused-heading">
        <p className="eyebrow">{section.label}</p>
        <button className="panel-close" type="button" data-sfx="close" onClick={leave}
          title="Volver a la habitación" aria-label="Volver a la habitación">×</button>
        <h1 id="focused-title">{section.title}</h1>
        {section.subtitle && <h2>{section.subtitle}</h2>}
      </header>
      <div className="focused-content">
        {section.body && !section.experience && <p className="focused-intro">{section.body}</p>}
        {children}
      </div>
      <CursorCompanion />
    </dialog>
  );
}
