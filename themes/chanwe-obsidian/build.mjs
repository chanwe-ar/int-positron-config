// Generates themes/chanwe-obsidian-color-theme.json from the installed Nord Deep
// theme (marlosirapuan.nord-deep, MIT) by remapping its palette. The theme stays
// Nord Deep in structure and softness; only the hues move toward CHANWE:
// obsidian greys for the surfaces, the one orange as the UI accent and for
// keywords, slate for the text. Run: node themes/chanwe-obsidian/build.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const extRoots = [join(homedir(), ".positron/extensions"), join(homedir(), ".vscode/extensions")];
let nordPath;
for (const root of extRoots) {
  try {
    const dir = readdirSync(root).find((d) => d.startsWith("marlosirapuan.nord-deep-"));
    if (dir) { nordPath = join(root, dir, "themes/nord-deep-color-theme.json"); break; }
  } catch { /* root missing */ }
}
if (!nordPath) throw new Error("Nord Deep is not installed; install marlosirapuan.nord-deep first");

// Nord hex (upper-case, no alpha) -> CHANWE hex. Alpha suffixes are carried over.
const MAP = {
  // surfaces: Nord's polar night -> obsidian greys (ink-light is the brand token)
  "#232731": "#1C2029", // editor, side bar, panels: a touch deeper than Nord, blue removed
  "#292D38": "#232A35", // activity bar, status bar: ink-light (brand)
  "#3B4252": "#2E3542", // tabs, hover, line highlight
  "#434C5E": "#3B4453", // selection, buttons, indent guides
  "#4C566A": "#4A5567", // line numbers, borders
  // text: snow storm -> slate / paper
  "#D8DEE9": "#CBD2DB", // body text (near rule-cool)
  "#E5E9F0": "#DDE2EA",
  "#ECEFF4": "#EEF1F5", // brightest text, used sparingly
  "#FFF": "#F8FAFC",
  "#78849B": "#7E899C", // muted text
  "#616E88": "#6B7689", // comments (alpha kept)
  // the UI accent: Nord's frost cyan -> the one orange
  "#88C0D0": "#FD3810", // badges, active tab line, progress, find match (alpha kept)
  // syntax: keep Nord's balance, warm the keywords, nudge the rest toward the brand
  "#81A1C1": "#E8876B", // keywords, control flow, operators: soft orange
  "#5E81AC": "#C97A62", // deeper blue -> deeper soft orange
  "#8FBCBB": "#8CBFBA", // functions, types: muted teal (chart-teal, desaturated)
  "#EBCB8B": "#E6C994", // classes, attributes: warm sand, as Nord
  "#D08770": "#D9906F", // numbers
  "#A3BE8C": "#9FC291", // strings
  "#BF616A": "#D4706A", // errors, deletions (toward chart-red)
  "#B48EAD": "#B596C7", // regex, special (toward violet)
};

const src = readFileSync(nordPath, "utf8");
const nord = new Function(`return (${src})`)(); // JSONC with trailing commas
const remap = (v) => {
  if (typeof v !== "string") return v;
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v);
  if (!m) return v;
  const base = `#${m[1].toUpperCase()}`;
  const to = MAP[base];
  return to ? to + (m[2] ?? "") : v;
};
const walk = (x) => Array.isArray(x) ? x.map(walk) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, walk(v)])) : remap(x);

const theme = walk(nord);
theme.name = "Chanwe Obsidian";
theme.type = "dark";
// Keep the cursor and a few accent roles where orange would shout.
Object.assign(theme.colors, {
  "editorCursor.foreground": "#FD3810",
  "focusBorder": "#FD381080",
  "textLink.foreground": "#E8876B",
  "textLink.activeForeground": "#FD3810",
  "list.highlightForeground": "#FD3810",
  "editorSuggestWidget.highlightForeground": "#FD3810",
  "pickerGroup.foreground": "#E8876B",
  "button.background": "#3B4453",
  "button.hoverBackground": "#4A5567",
  "terminalCursor.foreground": "#FD3810",
});
// Second pass: soften the fills where full orange is heavy, and keep the terminal's
// cyan a cyan (ls, paths, prompts rely on it).
Object.assign(theme.colors, {
  "selection.background": "#FD381066",
  "list.focusBackground": "#FD381055",
  "list.dropBackground": "#FD381055",
  "peekViewResult.matchHighlightBackground": "#FD381066",
  "inputValidation.infoBackground": "#2E3542",
  "inputValidation.infoBorder": "#E8876B",
  "terminal.ansiCyan": "#8CBFBA",
  "terminal.ansiBrightCyan": "#A3D1CC",
  "terminal.ansiBlue": "#E8876B",
  "terminal.ansiBrightBlue": "#F2A08A",
});
// Operators, terminators and tag punctuation stay quiet (Nord paints them like
// keywords; in orange that is too loud): a cool slate between text and comments.
const QUIET = "#9AA8BA";
const quietScopes = new Set([
  "keyword.operator", "punctuation.terminator", "punctuation.definition.variable",
  "punctuation.definition.tag", "punctuation.section.embedded.begin", "punctuation.section.embedded.end",
  "source.diff punctuation.definition.separator", "source.properties punctuation.separator.key-value.ini",
  "punctuation.separator.pointer-access.c", "source.css punctuation.definition.keyword",
]);
for (const rule of theme.tokenColors) {
  const scopes = [].concat(rule.scope ?? []);
  if (scopes.length && scopes.every((s) => quietScopes.has(s))) rule.settings.foreground = QUIET;
}
// Nord uses its frost cyan both for the UI accent and for function names. The
// accent is the orange; function names get a muted sky so code is not all orange.
// Markdown headings keep the orange, bold: the brand's heading on a dark page.
const FUNCTION = "#8FB4D4";
for (const rule of theme.tokenColors) {
  const scopes = [].concat(rule.scope ?? []);
  if (rule.settings.foreground === "#FD3810") {
    if (scopes.includes("markup.heading")) rule.settings.fontStyle = "bold";
    else rule.settings.foreground = FUNCTION;
  }
}
// Keys Nord leaves to the defaults, and two the map cannot get right.
Object.assign(theme.colors, {
  "activityBarBadge.foreground": "#FFFFFF",
  "badge.foreground": "#FFFFFF",
  "editorInfo.foreground": FUNCTION,
  "editorOverviewRuler.infoForeground": FUNCTION,
  "gitDecoration.addedResourceForeground": "#9FC291",
  "diffEditor.insertedTextBackground": "#9FC29126",
  "diffEditor.removedTextBackground": "#D4706A33",
  "breadcrumb.foreground": "#CBD2DB99",
  "breadcrumb.focusForeground": "#CBD2DB",
  "breadcrumb.activeSelectionForeground": "#E8876B",
});
const out = join(here, "themes/chanwe-obsidian-color-theme.json");
writeFileSync(out, JSON.stringify(theme, null, 2) + "\n");
const missing = new Set();
for (const v of JSON.stringify(nord).matchAll(/#[0-9a-fA-F]{6}(?![0-9a-fA-F])/g)) if (!MAP[v[0].toUpperCase()] && !/^#(FD3810|F8FAFC)/i.test(v[0])) missing.add(v[0].toUpperCase());
console.log(`wrote ${out}`);
if (missing.size) console.log("unmapped Nord colours:", [...missing].join(" "));
