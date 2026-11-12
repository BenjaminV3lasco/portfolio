import assert from "node:assert/strict";
import { courses } from "./src/data/academic.js";

const ids = new Set(courses.map((course) => course.id));
assert.equal(ids.size, 45);
assert.equal(courses.length, 45);
const verifiedApprovals = [...Array.from({ length: 39 }, (_, index) => String(index + 1)), "45", "148", "157"];
assert.deepEqual(courses.filter((course) => course.status === "approved").map((course) => course.id).sort(), verifiedApprovals.sort());
assert.equal(courses.find((course) => course.id === "42").status, "regular");
assert.equal(courses.filter((course) => course.status === "ongoing").length, 2);
assert(!ids.has("40") && !ids.has("41"), "No duplicar las optativas aprobadas con espacios vacíos");
assert.deepEqual(courses.find((course) => course.id === "148").regular, ["34"]);
assert.deepEqual(courses.find((course) => course.id === "148").approved, ["31"]);
assert.deepEqual(courses.find((course) => course.id === "148").exam, ["34"]);
assert.deepEqual(courses.find((course) => course.id === "157").approved, ["23"]);
assert.equal(courses.filter((course) => course.status === "option").length, 0);
assert.deepEqual(courses.filter((course) => course.elective).map((course) => course.id), ["148", "157"]);
assert.equal(courses.filter((course) => course.year <= 3 && course.status === "approved").length, 28);
assert.deepEqual(courses.find((course) => course.id === "26").regular, ["18", "20"]);
assert.deepEqual(courses.find((course) => course.id === "26").approved, ["14", "17"]);
assert.deepEqual(courses.find((course) => course.id === "26").exam, ["18", "20"]);

function checkChain(id, ancestors = new Set()) {
  assert(!ancestors.has(id), `Ciclo de correlativas en ${id}`);
  const course = courses.find((item) => item.id === id);
  for (const prerequisite of new Set([...course.regular, ...course.approved, ...course.exam])) {
    assert(ids.has(prerequisite), `Correlativa desconocida: ${prerequisite}`);
    checkChain(prerequisite, new Set([...ancestors, id]));
  }
}
courses.forEach((course) => checkChain(course.id));
console.log("Datos académicos OK: 45 materias, 42 aprobaciones incluyendo las dos optativas, sin referencias inválidas ni ciclos.");
