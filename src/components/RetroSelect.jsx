import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function RetroSelect({ label, value, options, onChange }) {
  const id = useId();
  const trigger = useRef(null);
  const popup = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({});
  const selected = options.findIndex((option) => String(option.value) === String(value));
  const typeahead = useRef({ text: "", time: 0 });

  useEffect(() => {
    if (!open) return;
    function place() {
      const rect = trigger.current.getBoundingClientRect();
      const height = Math.min(260, options.length * 48 + 12);
      const below = innerHeight - rect.bottom - 12;
      const above = below < height && rect.top > below;
      setPosition({ position: "fixed", left: Math.max(8, Math.min(rect.left, innerWidth - rect.width - 8)), width: Math.min(rect.width, innerWidth - 16), maxHeight: Math.max(80, Math.min(height, above ? rect.top - 16 : below)), ...(above ? { bottom: innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }) });
    }
    function outside(event) {
      if (!trigger.current.contains(event.target) && !popup.current?.contains(event.target)) setOpen(false);
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open, options.length]);

  useEffect(() => {
    const list = popup.current;
    const option = list?.children[active];
    if (!open || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  }, [active, open]);

  function choose(index) {
    if (!options[index]) return;
    onChange(String(options[index].value));
    setOpen(false);
    trigger.current.focus({ preventScroll: true });
  }
  return <div className="retro-select">
    <span className="retro-select-label">{label}</span>
    <button ref={trigger} type="button" role="combobox" aria-label={label}
      aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="listbox"
      aria-activedescendant={open ? id + "-" + active : undefined}
      onClick={() => { setActive(Math.max(0, selected)); setOpen(!open); }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); return; }
        if (event.key === "Tab") { setOpen(false); return; }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          setOpen(true);
          setActive(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : !open ? Math.max(0, selected) : (active + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
        } else if ((event.key === "Enter" || event.key === " ") && open) { event.preventDefault(); choose(active); }
        else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== " ") {
          const now = Date.now();
          typeahead.current.text = (now - typeahead.current.time > 700 ? "" : typeahead.current.text) + event.key.toLowerCase();
          typeahead.current.time = now;
          const index = options.findIndex((option) => option.label.toLowerCase().startsWith(typeahead.current.text));
          if (index >= 0) { event.preventDefault(); setOpen(true); setActive(index); }
        }
      }}>
      <span>{options[selected]?.label ?? "Seleccionar"}</span><i aria-hidden="true" />
    </button>
    {open && createPortal(<div ref={popup} id={id} role="listbox" aria-label={label} className="retro-options" style={{ position: "fixed", visibility: position.width ? "visible" : "hidden", ...position }}>
      {options.map((option, index) => <button key={option.value} id={id + "-" + index} type="button" role="option" tabIndex={-1}
        aria-selected={index === selected} data-active={index === active}
        onPointerMove={() => setActive(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}>
        {option.label}<span aria-hidden="true">{index === selected ? "✓" : ""}</span>
      </button>)}
    </div>, trigger.current.closest("dialog") ?? document.body)}
  </div>;
}
