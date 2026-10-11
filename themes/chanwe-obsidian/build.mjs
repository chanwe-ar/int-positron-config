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
  "#232731": "#191E27", // editor, side bar, panels: a touch deeper than Nord, blue removed
  "#292D38": "#232A35", // activity bar, status bar: ink-light (brand)
  "#3B4252": "#2E3542", // tabs, hover, line highlight
  "#434C5E": "#3B4453", // selection, buttons, indent guides
  "#4C566A": "#4A5567", // line numbers, borders
  // text: snow storm -> slate / paper
  "#D8DEE9": "#D8DEE9", // body text (near rule-cool)
  "#E5E9F0": "#DDE2EA",
  "#ECEFF4": "#EEF1F5", // brightest text, used sparingly
  "#FFF": "#F8FAFC",
  "#78849B": "#7E899C", // muted text
  "#616E88": "#8A94A6", // comments (alpha kept)
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
// Headings receive paper text and orange markers in the role-specific pass below.
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
// Role-specific contrast: brand orange marks actions; paper carries titles.
Object.assign(theme.colors, {
  "activityBar.background": "#202630",
  "activityBar.foreground": "#F8FAFC",
  "activityBar.inactiveForeground": "#8A94A6",
  "sideBar.background": "#202630",
  "sideBar.foreground": "#C6CDD6",
  "sideBarTitle.foreground": "#F8FAFC",
  "sideBarSectionHeader.background": "#232A35",
  "sideBarSectionHeader.foreground": "#F8FAFC",
  "sideBarSectionHeader.border": "#434D5D",
  "titleBar.activeBackground": "#202630",
  "titleBar.activeForeground": "#F8FAFC",
  "titleBar.inactiveBackground": "#202630",
  "titleBar.inactiveForeground": "#8A94A6",
  "editorGroupHeader.tabsBackground": "#202630",
  "tab.activeBackground": "#191E27",
  "tab.activeForeground": "#F8FAFC",
  "tab.activeBorderTop": "#FD3810",
  "tab.activeBorder": "#191E27",
  "tab.inactiveBackground": "#202630",
  "tab.inactiveForeground": "#AAB4C3",
  "tab.unfocusedActiveForeground": "#D8DEE9",
  "panel.background": "#191E27",
  "panelTitle.activeForeground": "#F8FAFC",
  "panelTitle.inactiveForeground": "#AAB4C3",
  "panelTitle.activeBorder": "#FD3810",
  "notificationCenterHeader.foreground": "#F8FAFC",
  "statusBar.background": "#202630",
  "statusBar.foreground": "#C6CDD6",
  "statusBar.noFolderBackground": "#202630",
  "statusBar.debuggingBackground": "#202630",
  "statusBar.debuggingForeground": "#F8FAFC",
  "button.background": "#FD3810",
  "button.foreground": "#FFFFFF",
  "button.hoverBackground": "#FF542F",
  "button.secondaryBackground": "#3B4453",
  "button.secondaryForeground": "#F8FAFC",
  "button.secondaryHoverBackground": "#4A5567",
  "badge.foreground": "#FFFFFF",
  "activityBarBadge.foreground": "#FFFFFF",
  "focusBorder": "#FD3810",
  "list.activeSelectionBackground": "#373F4E",
  "list.activeSelectionForeground": "#F8FAFC",
  "list.focusBackground": "#2E3542",
  "list.focusForeground": "#F8FAFC",
  "list.focusOutline": "#FD3810",
  "list.highlightForeground": "#FF9478",
  "list.focusHighlightForeground": "#FF9478",
  "editorSuggestWidget.selectedForeground": "#F8FAFC",
  "editorSuggestWidget.highlightForeground": "#FF9478",
  "editorSuggestWidget.focusHighlightForeground": "#FF9478",
  "textLink.foreground": "#FF9478",
  "textLink.activeForeground": "#FF9478",
  "editorLink.activeForeground": "#FF9478",
  "notificationLink.foreground": "#FF9478",
  "selection.background": "#434D5D80",
  "editor.selectionBackground": "#434D5D",
  "editor.inactiveSelectionBackground": "#434D5D80",
  "editor.lineHighlightBackground": "#232A3566",
  "editor.lineHighlightBorder": "#232A3500",
  "editor.wordHighlightBackground": "#8FB4D41A",
  "editor.wordHighlightStrongBackground": "#8FB4D42A",
  "editor.findMatchBackground": "#FD381026",
  "editor.findMatchBorder": "#FD3810",
  "editor.findMatchHighlightBackground": "#FD381014",
  "editor.findMatchHighlightBorder": "#FD381080",
  "editor.findRangeHighlightBackground": "#FD38100A",
  "editorLineNumber.foreground": "#8A94A6",
  "editorLineNumber.activeForeground": "#F8FAFC",
  "editorCodeLens.foreground": "#8A94A6",
  "descriptionForeground": "#AAB4C3",
  "disabledForeground": "#8A94A6",
  "input.placeholderForeground": "#AAB4C3",
  "input.border": "#434D5D",
  "inputOption.activeBackground": "#FD381026",
  "inputOption.activeBorder": "#FD3810",
  "inputOption.activeForeground": "#F8FAFC",
  "inputValidation.errorBackground": "#35232B",
  "inputValidation.errorForeground": "#F8FAFC",
  "inputValidation.warningBackground": "#342E24",
  "inputValidation.warningForeground": "#F8FAFC",
  "terminal.ansiBlue": "#8FB4D4",
  "terminal.ansiBrightBlue": "#B4CEE5",
  "terminal.foreground": "#D8DEE9",
  "terminal.background": "#191E27",
  "editorIndentGuide.background1": "#434D5D80",
  "editorIndentGuide.activeBackground1": "#8A94A6",
  "breadcrumb.foreground": "#AAB4C3",
  "breadcrumb.focusForeground": "#F8FAFC",
});
for (const rule of theme.tokenColors) {
  const scopes = [].concat(rule.scope ?? []);
  if (scopes.some((scope) => scope.includes("comment") || scope === "markup.quote" || scope.endsWith("markup.quote"))) {
    if (rule.settings.foreground?.startsWith("#8A94A6")) rule.settings.foreground = "#8A94A6";
  }
  if (scopes.includes("markup.heading")) rule.settings = { foreground: "#F8FAFC", fontStyle: "bold" };
}
theme.tokenColors.push({
  name: "Chanwe heading markers",
  scope: ["punctuation.definition.heading.markdown", "punctuation.definition.heading.quarto"],
  settings: { foreground: "#FD3810", fontStyle: "bold" },
});

// Positron registers these independently of the VS Code workbench palette.
Object.assign(theme.colors, {
  "positronActionBar.background": "#232A35",
  "positronActionBar.foreground": "#F8FAFC",
  "positronActionBar.disabledForeground": "#8A94A6",
  "positronActionBar.border": "#434D5D",
  "positronActionBar.textInputBackground": "#191E27",
  "positronActionBar.textInputBorder": "#434D5D",
  "positronConsole.background": "#191E27",
  "positronConsole.foreground": "#D8DEE9",
  "positronConsole.errorBackground": "#35232B",
  "positronConsole.errorForeground": "#F0A09B",
  "positronVariables.background": "#191E27",
  "positronVariables.foreground": "#D8DEE9",
  "positronVariables.headerBackground": "#232A35",
  "positronVariables.border": "#434D5D",
  "positronVariables.rowHoverBackground": "#232A35",
  "positronVariables.rowHoverForeground": "#F8FAFC",
  "positronVariables.activeSelectionBackground": "#373F4E",
  "positronVariables.activeSelectionForeground": "#F8FAFC",
  "positronVariables.inactiveSelectionBackground": "#2E3542",
  "positronVariables.inactiveSelectionForeground": "#D8DEE9",
  "positronDataExplorer.background": "#191E27",
  "positronDataExplorer.contrastBackground": "#232A35",
  "positronDataExplorer.foreground": "#D8DEE9",
  "positronDataExplorer.border": "#434D5D",
  "positronDataExplorer.selectionBackground": "#373F4E",
  "positronDataExplorer.sparklineStroke": "#8FB4D4",
  "positronDataExplorer.sparklineHover": "#FD3810",
  "positronDataGrid.foreground": "#D8DEE9",
  "positronDataGrid.contrastBackground": "#232A35",
  "positronDataGrid.border": "#434D5D",
  "positronDataGrid.cursorBorder": "#FD3810",
  "positronDataGrid.selectionBorder": "#FD3810",
  "positronDataGrid.selectionBackground": "#434D5D80",
  "positronPackages.background": "#191E27",
  "positronPackages.foreground": "#D8DEE9",
  "positronPackages.border": "#434D5D",
  "positronPlots.background": "#191E27",
  "positronModalDialog.titleBarForeground": "#F8FAFC",
  "positronModalDialog.titleBarBackground": "#202630",
  "positronModalDialog.defaultButtonBackground": "#FD3810",
  "positronModalDialog.defaultButtonHoverBackground": "#FF542F",
  "positronModalDialog.defaultButtonForeground": "#FFFFFF",
});
for (const [key, value] of Object.entries(theme.colors)) {
  if (key.startsWith("terminal.ansi")) theme.colors[key.replace("terminal.", "positronConsole.")] = value;
}

const out = join(here, "themes/chanwe-obsidian-color-theme.json");
writeFileSync(out, JSON.stringify(theme, null, 2) + "\n");
const missing = new Set();
for (const v of JSON.stringify(nord).matchAll(/#[0-9a-fA-F]{6}(?![0-9a-fA-F])/g)) if (!MAP[v[0].toUpperCase()] && !/^#(FD3810|F8FAFC)/i.test(v[0])) missing.add(v[0].toUpperCase());
console.log(`wrote ${out}`);
if (missing.size) console.log("unmapped Nord colours:", [...missing].join(" "));
