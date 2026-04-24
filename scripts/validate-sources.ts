import fs from "node:fs";
import path from "node:path";
import { LEGAL_SOURCES } from "../lib/legal-sources";
import { TASKS } from "../lib/tasks";

const taskIds = new Set(TASKS.map((t) => t.id));
const errors: string[] = [];

for (const s of LEGAL_SOURCES) {
  const filePath = path.join("public/legal-sources", `${s.slug}.pdf`);
  if (!fs.existsSync(filePath)) errors.push(`missing file: ${filePath}`);
  for (const m of s.moduleIds) {
    if (!taskIds.has(m)) errors.push(`source "${s.slug}" references unknown moduleId: ${m}`);
  }
}

const dir = fs.readdirSync("public/legal-sources").filter((f) => f.endsWith(".pdf"));
const catalog = new Set(LEGAL_SOURCES.map((s) => `${s.slug}.pdf`));
for (const f of dir) {
  if (!catalog.has(f)) errors.push(`file not in catalog: ${f}`);
}

if (errors.length) {
  console.error("VALIDATION FAILED:");
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
console.log(`OK: ${LEGAL_SOURCES.length} sources, ${dir.length} files, ${taskIds.size} tasks.`);
