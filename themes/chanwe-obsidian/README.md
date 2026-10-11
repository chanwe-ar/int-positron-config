# Chanwe Obsidian

Nord-inspired dark theme for Positron and VS Code. Chanwe obsidian anchors the
window, light obsidian separates controls, and slate supports readable selections.
Primary orange `#FD3810` marks focus, active tabs, cursors, and primary actions.

## Palette and assessment

The previous theme used orange for titles and selected text, including orange text
on warm selection fills. Comments inherited Nord's translucent foreground and
became too faint. Positron-specific controls also fell back to unrelated defaults.
Version 0.5.0 addresses these roles explicitly rather than applying one global hue swap.
Version 0.5.3 unifies the outer window bars, activity bar, and tab strip with
the sidebar and embedded chat background. Badge numbers are white.

| Role | Color | Treatment |
|---|---|---|
| Window chrome and activity bar | `#202630` | Matches sidebar and chat |
| Sidebar and chat | `#202630` | Intermediate obsidian surface |
| Editor and console | `#191E27` | Cool, restrained Nord-inspired surface |
| Headers and controls | `#232A35` / `#2E3542` | Raised surfaces |
| Selection | `#373F4E` / `#434D5D` | Slate, paper foreground |
| Titles and headings | `#F8FAFC` | Paper; Markdown headings bold |
| Body | `#D8DEE9` | Nord snow text |
| Secondary text and comments | `#8A94A6` | Opaque slate |
| Active indicators and primary actions | `#FD3810` | Exact Chanwe primary |
| Links and search labels | `#FF9478` | Accessible orange tint |
| Functions / types | `#8FB4D4` / `#8CBFBA` | Nord-inspired sky / teal |

Orange buttons and count badges use white text. Titles use paper, with orange underlines and heading markers
providing the brand signature. Syntax preserves distinct string, number, diagnostic,
and type colors; terminal blue and cyan retain their expected meanings.

Measured sRGB contrast ratios for the specified solid pairs:

| Pair | Ratio |
|---|---:|
| Paper title on light obsidian | 13.80:1 |
| Body on editor | 12.37:1 |
| Comments on editor | 5.47:1 |
| Selected paper text on slate | 10.12:1 |
| White button text on primary orange | 3.66:1 |
| White badge text on primary orange | 3.66:1 |
| Orange-tint links on raised surface | 5.73:1 |

These are palette checks, not a claim that every extension or embedded webview is
accessible. Positron Console, Variables, Data Explorer, grid selections, action bars,
Packages, Plots, and default dialog buttons have explicit theme roles.

## Install

From the repository root:

```bash
./themes/install.sh
```

The script packages a VSIX and installs it into Positron and VS Code. Reload the
window and select **Chanwe Obsidian** in *Preferences: Color Theme*.

## Edit

`build.mjs` reads installed Nord Deep (`marlosirapuan.nord-deep`, MIT), remaps its
palette, then applies role-specific contrast and Positron overrides. Preserve the
original Nord syntax scopes when tuning colors.

```bash
node themes/chanwe-obsidian/build.mjs
./themes/install.sh
```

Bump `package.json` for each release. Do not edit generated theme JSON by hand.
