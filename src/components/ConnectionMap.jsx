import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const NODE_W = 260, NODE_H = 164, GAP_X = 28, GAP_Y = 90;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Each course has one main branch. Additional prerequisite links become references,
// so every real relation remains navigable without crossing other branches.
function makeTree(nodes, edges) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  edges.forEach((edge) => {
    if (!byId.has(edge.from) || !byId.has(edge.to) || edge.from === edge.to) return;
    if (!outgoing.get(edge.from).some((other) => other.to === edge.to)) {
      outgoing.get(edge.from).push(edge);
      incoming.get(edge.to).push(edge);
    }
  });
  const depths = new Map();
  function depth(id, visited = new Set()) {
    if (visited.has(id)) return 0;
    if (depths.has(id)) return depths.get(id);
    const next = new Set(visited).add(id);
    const value = Math.max(0, ...incoming.get(id).map((edge) => depth(edge.from, next) + 1));
    depths.set(id, value);
    return value;
  }
  const parents = new Map();
  nodes.forEach((node) => {
    const candidates = incoming.get(node.id);
    const parent = node.parent ?? [...candidates].sort((a, b) => depth(b.from) - depth(a.from))[0]?.from;
    if (parent) parents.set(node.id, parent);
  });
  return { byId, incoming, outgoing, parents, roots: nodes.filter((node) => !parents.has(node.id)) };
}

export function ConnectionMap({ nodes, edges, selected, onSelect, label, academic = false, yearView = null, onExplore }) {
  const viewport = useRef(null);
  const pending = useRef(null);
  const internalSelection = useRef(null);
  const previousSelection = useRef({ selected, nodes, edges });
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const dragStart = useRef(null);
  const dragged = useRef(false);
  const model = useMemo(() => makeTree(nodes, edges), [nodes, edges]);
  const [expanded, setExpanded] = useState(() => new Set());
  const [otherRoots, setOtherRoots] = useState(false);
  const [camera, setCamera] = useState({ x: 24, y: 24, zoom: 0.85 });

  const layout = useMemo(() => {
    if (academic && yearView !== null) {
      const placed = [], headings = [];
      let y = 0;
      [1, 2].forEach((term) => {
        const subjects = nodes.filter((node) => node.year === yearView && node.term === term);
        headings.push({ label: `${yearView}° año · ${term}° cuatrimestre`, y });
        subjects.forEach((node, index) => placed.push({ id: node.id, key: node.id, reference: false, x: (index % 4) * (NODE_W + GAP_X), y: y + 44 + Math.floor(index / 4) * (NODE_H + 24) }));
        y += 44 + Math.ceil(subjects.length / 4) * (NODE_H + 24) + 30;
      });
      return { nodes: placed, links: [], headings, width: NODE_W * 4 + GAP_X * 3, height: y };
    }
    const placed = [], links = [];
    function branch(id, reference = false, parentId = "") {
      const children = !reference && expanded.has(id)
        ? model.outgoing.get(id).map((edge) => branch(edge.to, model.parents.get(edge.to) !== id, id)) : [];
      return { id, reference, key: reference ? parentId + "->" + id : id, children,
        width: Math.max(NODE_W, children.reduce((sum, child) => sum + child.width, 0) + Math.max(0, children.length - 1) * GAP_X) };
    }
    function place(tree, left, top) {
      const node = { ...tree, x: left + (tree.width - NODE_W) / 2, y: top };
      placed.push(node);
      let childLeft = left;
      tree.children.forEach((child) => {
        const target = place(child, childLeft, top + NODE_H + GAP_Y);
        links.push({ from: node, to: target });
        childLeft += child.width + GAP_X;
      });
      return node;
    }
    let left = 0;
    model.roots.filter((node) => !academic || otherRoots || node.year === 1).forEach((node) => {
      const tree = branch(node.id);
      place(tree, left, 0);
      left += tree.width + 64;
    });
    return { nodes: placed, links, width: Math.max(NODE_W, left - 64), height: Math.max(NODE_H, ...placed.map((node) => node.y + NODE_H)) };
  }, [model, expanded, academic, otherRoots, yearView, nodes]);

  useLayoutEffect(() => {
    if (yearView !== null) {
      pending.current = null;
      const host = viewport.current;
      const zoom = host.clientWidth >= 800 ? Math.min(0.85, (host.clientWidth - 48) / layout.width, (host.clientHeight - 48) / layout.height) : 0.65;
      setCamera({ x: 24, y: 24, zoom });
    }
  }, [yearView]);

  function reveal(id) {
    const ancestors = [];
    let parent = model.parents.get(id);
    while (parent && !ancestors.includes(parent)) { ancestors.push(parent); parent = model.parents.get(parent); }
    setOtherRoots(true);
    setExpanded((old) => new Set([...old, ...ancestors, id]));
    pending.current = id;
  }

  useEffect(() => {
    const previous = previousSelection.current;
    if (previous.selected === selected && previous.nodes === nodes && previous.edges === edges) return;
    previousSelection.current = { selected, nodes, edges };
    if (yearView !== null) return;
    if (internalSelection.current === selected) { internalSelection.current = null; return; }
    if (model.byId.has(selected)) reveal(selected);
  }, [selected, model, yearView]);

  useLayoutEffect(() => {
    const host = viewport.current;
    if (!host || !pending.current) return;
    if (pending.current === "fit") {
      const zoom = clamp(Math.min((host.clientWidth - 48) / layout.width, (host.clientHeight - 48) / layout.height), 0.005, 1);
      setCamera({ zoom, x: (host.clientWidth - layout.width * zoom) / 2, y: 24 });
    } else {
      const node = layout.nodes.find((item) => item.key === pending.current);
      if (node) setCamera((old) => ({ ...old, x: host.clientWidth / 2 - (node.x + NODE_W / 2) * old.zoom, y: 36 - node.y * old.zoom }));
    }
    pending.current = null;
  }, [layout]);

  function zoomAt(factor, x, y) {
    setCamera((old) => {
      const zoom = clamp(old.zoom * factor, 0.005, 2);
      return { zoom, x: x - (x - old.x) * zoom / old.zoom, y: y - (y - old.y) * zoom / old.zoom };
    });
  }
  useEffect(() => {
    const host = viewport.current;
    function wheel(event) {
      event.preventDefault();
      const rect = host.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? host.clientHeight : 1);
      zoomAt(Math.exp(-delta * 0.0015), event.clientX - rect.left, event.clientY - rect.top);
    }
    host.addEventListener("wheel", wheel, { passive: false });
    return () => host.removeEventListener("wheel", wheel);
  }, []);

  function activate(item) {
    if (yearView !== null) { onExplore?.(); onSelect(item.id); reveal(item.id); return; }
    internalSelection.current = item.id;
    onSelect(item.id);
    if (item.reference) { reveal(item.id); return; }
    pending.current = item.id;
    setExpanded((old) => {
      const next = new Set(old);
      if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
      return next;
    });
  }
  function pointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    // Panning must never start native text selection or HTML dragging.
    event.preventDefault();
    const selection = window.getSelection();
    if (selection?.anchorNode && event.currentTarget.contains(selection.anchorNode)) selection.removeAllRanges();
    event.currentTarget.dataset.dragging = "false";
    dragged.current = false;
    dragStart.current = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gesture.current = null;
    if (!event.target.closest("button")) event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 2) {
      dragged.current = true;
      event.currentTarget.dataset.dragging = "true";
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      const rect = viewport.current.getBoundingClientRect();
      if (gesture.current) zoomAt(distance / gesture.current, (points[0].x + points[1].x) / 2 - rect.left, (points[0].y + points[1].y) / 2 - rect.top);
      gesture.current = distance;
    } else if (dragStart.current && (dragged.current || Math.hypot(event.clientX - dragStart.current.x, event.clientY - dragStart.current.y) > 5)) {
      dragged.current = true;
      event.currentTarget.dataset.dragging = "true";
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
      setCamera((old) => ({ ...old, x: old.x + event.clientX - previous.x, y: old.y + event.clientY - previous.y }));
    }
  }
  function release(event) {
    pointers.current.delete(event.pointerId);
    gesture.current = null;
    if (!pointers.current.size) {
      dragStart.current = null;
      event.currentTarget.dataset.dragging = "false";
    }
  }

  const current = model.byId.get(selected);
  return <section className="explorable-tree">
    <div className="tree-tools" role="group" aria-label="Controles del árbol">
      <button type="button" aria-label="Alejar árbol" title="Alejar" onClick={() => zoomAt(0.8, viewport.current.clientWidth / 2, viewport.current.clientHeight / 2)}>−</button>
      <output aria-label="Nivel de zoom">{Math.round(camera.zoom * 100)} %</output>
      <button type="button" aria-label="Acercar árbol" title="Acercar" onClick={() => zoomAt(1.25, viewport.current.clientWidth / 2, viewport.current.clientHeight / 2)}>+</button>
      <button type="button" title="Mostrar todas las ramas" onClick={() => { onExplore?.(); pending.current = "fit"; setOtherRoots(true); setExpanded(new Set(nodes.map((node) => node.id))); }}>Expandir todo</button>
      <button type="button" title="Volver al inicio del árbol" onClick={() => { pending.current = null; setOtherRoots(false); setExpanded(new Set()); setCamera({ x: 24, y: 24, zoom: 0.85 }); }}>Contraer todo</button>
      <button type="button" title="Centrar toda la vista" onClick={() => { const host = viewport.current; const zoom = clamp(Math.min((host.clientWidth - 48) / layout.width, (host.clientHeight - 48) / layout.height), 0.005, 1); setCamera({ zoom, x: (host.clientWidth - layout.width * zoom) / 2, y: 24 }); }}>Vista general</button>
    </div>
    <div ref={viewport} className="tree-canvas" role="region" tabIndex={0} aria-label={label}
      onDragStart={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
      onClickCapture={(event) => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={(event) => { if (event.target === event.currentTarget) release(event); }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        const directions = { ArrowLeft: [60,0], ArrowRight: [-60,0], ArrowUp: [0,60], ArrowDown: [0,-60] };
        if (directions[event.key]) { event.preventDefault(); const [x,y] = directions[event.key]; setCamera((old) => ({...old,x:old.x+x,y:old.y+y})); }
        if (event.key === "+" || event.key === "-") { event.preventDefault(); zoomAt(event.key === "+" ? 1.25 : 0.8, viewport.current.clientWidth/2, viewport.current.clientHeight/2); }
      }}>
      <svg className="tree-landscape" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path fill="#161d2a" d="M0 0H1200V700H0Z" />
        <path fill="#25273a" d="M0 390L180 220L360 430L610 260L850 450L1080 230L1200 370V700H0Z" />
        <path fill="#303048" d="M0 390L180 220L140 470Z M360 430L610 260L530 500Z M850 450L1080 230L1040 510Z" />
        <path fill="#1b3436" d="M0 500L260 370L470 510L760 390L1040 530L1200 430V700H0Z" />
        <path fill="#244044" d="M0 500L260 370L190 590Z M470 510L760 390L690 610Z M1040 530L1200 430V620Z" />
        <path fill="#18282b" d="M0 640L190 590L470 660L690 610L1040 650L1200 620V700H0Z" />
      </svg>
      <div className="tree-world" style={{ width: layout.width, height: layout.height, transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})` }}>
        {layout.headings?.map((heading) => <h4 className="semester-heading" key={heading.label} style={{ top: heading.y }}>{heading.label}</h4>)}
        <svg className="tree-lines" width={layout.width} height={layout.height} aria-hidden="true">
          {layout.links.map(({ from, to }) => {
            const x1=from.x+NODE_W/2, y1=from.y+NODE_H, x2=to.x+NODE_W/2, y2=to.y;
            const mid=y1+GAP_Y/2;
            return <g key={to.key} className={to.reference ? "reference-line" : ""}><path d={`M${x1} ${y1} V${mid} H${x2} V${y2-8}`} /><path d={`M${x2-4} ${y2-14} L${x2} ${y2-8} L${x2+4} ${y2-14}`} /></g>;
          })}
        </svg>
        {layout.nodes.map((item) => {
          const node=model.byId.get(item.id), count=model.outgoing.get(item.id).length;
          return <button type="button" key={item.key} data-node-id={item.id} data-reference={item.reference} data-sfx="tab"
            draggable={false}
            className={`branch-node ${node.status ?? ""} ${selected === item.id ? "selected" : ""} ${item.reference ? "reference" : ""}`}
            style={{ left:item.x, top:item.y, width:NODE_W, height:NODE_H, "--node-accent": node.accent }} aria-expanded={count && !item.reference ? expanded.has(item.id) : undefined}
            title={node.title} onClick={() => activate(item)}
            onFocus={() => { if (document.activeElement?.matches(":focus-visible")) setCamera((old) => ({...old,x:viewport.current.clientWidth/2-(item.x+NODE_W/2)*old.zoom,y:40-item.y*old.zoom})); }}>
            <span>{academic ? `${node.year}° año · ${node.term}° cuatrimestre` : node.label}</span>
            <strong>{node.title}</strong>
            <small className={academic ? "node-status" : "node-technologies"}>{node.statusLabel ?? (item.reference ? "↗ Ver rama compartida" : node.skills?.slice(0,3).join(" · "))}</small>
            <b>{item.reference ? "↗" : count ? (expanded.has(item.id) ? "−" : "+") + " " + count : "●"}</b>
          </button>;
        })}
      </div>
    </div>
    {!academic && current && <section className="tree-selection" aria-live="polite">
      <h3>{current.title}</h3>
      {current.description && <p>{current.description}</p>}
      {current.skills && <div className="tech-tags">{current.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>}
    </section>}
  </section>;
}
