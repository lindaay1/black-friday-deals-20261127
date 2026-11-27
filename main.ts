// Deal Hound — the hand-in program (Node 22, standard library only).
//
// The site is the plain static files in app/ beside this file: index.html,
// style.css and the modules that render the deals. This program copies app/
// and screenshots/ into the output directory and writes dossier.json there,
// the summary the judge reads, using the vendored make.fun library.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Outside the grader MAKEFUN_OUTPUT_DIR stands in for /output. The program
// runs twice and must write the same bytes both times, so it writes nothing
// with a timestamp in it: the dossier library hashes the files as they are.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The repository root is the directory this file sits in.
const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Hand the site in: the whole app/ tree, then the screenshots, then the
// dossier the library builds from exactly those files.
mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), {
    recursive: true,
  });
}

// The caps are the scorer's own: at most 4 screenshots of 256 KiB, at most
// 993 files and 16 MiB under app/, and the dossier text capped at 160 KiB.
// buildDossier refuses anything past them, so a bad hand-in fails loudly
// here instead of silently at the gate.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
