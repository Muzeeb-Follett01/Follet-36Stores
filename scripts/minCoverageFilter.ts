/**
 * minCoverageFilter.ts
 *
 * Reads output/courseData.json and produces output/courseDataMinCoverage.json
 * using a greedy set-cover algorithm: picks the minimum number of courses
 * whose textbooks collectively cover every unique (format × type) purchase option.
 *
 * Usage:
 *   npx ts-node --transpile-only scripts/minCoverageFilter.ts [inputFile] [outputFile]
 */

import * as fs from "fs";
import * as path from "path";

const INPUT_FILE =
  process.argv[2] ?? path.join(__dirname, "..", "output", "courseData.json");
const OUTPUT_FILE =
  process.argv[3] ??
  path.join(__dirname, "..", "output", "courseDataMinCoverage.json");

// ── Types (mirrors courseDataFetch flat output) ──────────────────────────────

interface FlatTextbook {
  name: string;
  format: string;
  condition: string;
}

interface CourseRecord {
  term: string;
  department: string;
  course: string;
  section: string;
  textbooks: FlatTextbook[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function typeKey(tb: FlatTextbook): string {
  return `${tb.format}|${tb.condition}`;
}

function courseTypeSet(course: CourseRecord): Set<string> {
  const types = new Set<string>();
  for (const tb of course.textbooks) {
    types.add(typeKey(tb));
  }
  return types;
}

// ── Greedy set-cover ─────────────────────────────────────────────────────────
// Each iteration: pick the course that covers the most not-yet-covered types.
// Ties broken by fewest textbooks (prefer compact courses).

function greedySetCover(courses: CourseRecord[]): CourseRecord[] {
  const allTypes = new Set<string>();
  const courseSets = courses.map((c) => ({
    course: c,
    types: courseTypeSet(c),
  }));

  for (const { types } of courseSets) {
    for (const t of types) allTypes.add(t);
  }

  console.log(`\nAll purchase-option types to cover (${allTypes.size}):`);
  for (const t of [...allTypes].sort())
    console.log(`  · ${t || "(empty type)"}`);

  const covered = new Set<string>();
  const selected: CourseRecord[] = [];
  const pool = [...courseSets];

  while (covered.size < allTypes.size && pool.length > 0) {
    let bestIdx = -1;
    let bestNew = -1;
    let bestBooks = Infinity;

    for (let i = 0; i < pool.length; i++) {
      const { course, types } = pool[i];
      let newCount = 0;
      for (const t of types) {
        if (!covered.has(t)) newCount++;
      }
      // Prefer most new types; break ties by fewest textbooks
      if (
        newCount > bestNew ||
        (newCount === bestNew && course.textbooks.length < bestBooks)
      ) {
        bestNew = newCount;
        bestIdx = i;
        bestBooks = course.textbooks.length;
      }
    }

    if (bestIdx === -1 || bestNew === 0) break;

    const { course, types } = pool.splice(bestIdx, 1)[0];
    selected.push(course);
    for (const t of types) covered.add(t);

    const newTypes = [...types].filter(
      (t) =>
        !(
          [...covered].filter((ct) => ct !== t && covered.has(ct)).length >=
          covered.size - 1
        ),
    );
    console.log(
      `\n  ✓ Selected: dept=${course.department} course=${course.course} section=${course.section}` +
        ` (${course.textbooks.length} textbook(s), +${bestNew} new type(s))`,
    );
    console.log(`    Types now covered: ${covered.size}/${allTypes.size}`);
  }

  const missing = [...allTypes].filter((t) => !covered.has(t));
  if (missing.length > 0) {
    console.log(`\n  ⚠ Unable to cover: ${missing.join(", ")}`);
  }

  return selected;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const raw: CourseRecord[] = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

const selected = greedySetCover(raw);
const totalBooks = selected.reduce((s, c) => s + c.textbooks.length, 0);
const coveredTypes = new Set<string>();
for (const c of selected) {
  for (const t of courseTypeSet(c)) coveredTypes.add(t);
}

console.log(`\n── Summary ───────────────────────────────────────────────`);
console.log(`  Courses selected : ${selected.length}`);
console.log(`  Textbooks total  : ${totalBooks}`);
console.log(`  Types covered    : ${coveredTypes.size}`);
console.log(`    ${[...coveredTypes].sort().join("\n    ")}`);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(selected, null, 2), "utf-8");
console.log(`\nOutput: ${OUTPUT_FILE}`);
