// Baseline-aware targeted check: existing project errors must not hide new
// diagnostics in edited files. Uses the same strict project compiler settings.
import ts from "typescript";
import path from "node:path";
import { execFileSync } from "node:child_process";

const tracked = execFileSync("git", ["diff", "--name-only", "HEAD"], { encoding: "utf8" }).trim().split("\n");
const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { encoding: "utf8" }).trim().split("\n");
const edited = [...new Set([...tracked, ...untracked])].filter(p => /\.(ts|tsx)$/.test(p));
const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd());
const options = { ...parsed.options, incremental: false, noEmit: true };
const originals = new Map(edited.map(file => {
  try { return [path.resolve(file), execFileSync("git", ["show", `HEAD:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })]; }
  catch { return [path.resolve(file), undefined]; }
}));
function diagnostics(baseline) {
  const host = ts.createCompilerHost(options);
  const read = host.readFile.bind(host);
  host.readFile = file => baseline && originals.has(path.resolve(file)) ? originals.get(path.resolve(file)) : read(file);
  const roots = [...new Set([...parsed.fileNames, ...edited.map(p => path.resolve(p))])]
    .filter(file => !baseline || !originals.has(file) || originals.get(file) !== undefined);
  const program = ts.createProgram(roots, options, host);
  return ts.getPreEmitDiagnostics(program);
}
const key = d => `${d.file?.fileName}:${d.code}:${ts.flattenDiagnosticMessageText(d.messageText, "\n")}`;
const baseline = new Set(diagnostics(true).map(key));
const current = diagnostics(false);
const newErrors = current.filter(d => !baseline.has(key(d)));
if (newErrors.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(newErrors, {
    getCurrentDirectory: () => process.cwd(), getCanonicalFileName: f => f, getNewLine: () => "\n",
  }));
  process.exitCode = 1;
} else {
  console.log(`PASS strict targeted type-check: ${edited.length} edited TypeScript files, no new diagnostics.`);
  console.log(`${current.length} pre-existing project diagnostics remain; no unrelated type fixes applied.`);
}