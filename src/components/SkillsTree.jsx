import React, { useMemo, useState } from "react";
import { skillPaths } from "../data/skillTree.js";
import { ConnectionMap } from "./ConnectionMap.jsx";
import { RetroSelect } from "./RetroSelect.jsx";

const crossLinks = [
  ["components", "3d"], ["apps", "integration"], ["apps", "services"],
  ["integration", "flows"], ["services", "flows"], ["flows", "llm"],
  ["integration", "llm"], ["flows", "metrics"], ["storage", "python"],
  ["apps", "deploy"], ["collaboration", "components"], ["practice", "flows"],
  ["async", "integration"],
];

export function SkillsTree() {
  const [selected, setSelected] = useState("web-base");
  const nodes = useMemo(() => skillPaths.flatMap((path, index) => path.nodes.map((node) => ({
    ...node, label: path.label, accent: ["#80caa1", "#85b7dd", "#dab879", "#b7a2d8", "#7dcac6", "#d69ba5"][index],
  }))), []);
  const edges = useMemo(() => [...nodes.filter((node) => node.parent).map((node) => ({ from: node.parent, to: node.id })), ...crossLinks.map(([from, to]) => ({ from, to }))], [nodes]);

  return (
    <section className="skills-network" aria-label="Red de sinergias entre habilidades">
      <nav className="network-routes" aria-label="Rutas de habilidades">
        {skillPaths.map((path) => <button type="button" key={path.id} aria-pressed={path.nodes.some((node) => node.id === selected)} data-sfx="tab" onClick={() => setSelected(path.nodes[0].id)}>{path.label}</button>)}
      </nav>
      <RetroSelect label="Habilidad" value={selected} onChange={setSelected} options={nodes.map((node) => ({ value: node.id, label: node.title }))} />
      <ConnectionMap nodes={nodes} edges={edges} selected={selected} onSelect={setSelected}
        label="Árbol de conexiones entre tecnologías" />
      <p className="edge-legend">Conexiones de aprendizaje y uso conjunto; no son requisitos académicos obligatorios.</p>
    </section>
  );
}
