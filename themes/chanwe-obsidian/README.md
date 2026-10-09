# Chanwe Obsidian

CHANWE's dark editor theme for Positron and VS Code. It is Nord Deep with the hues
moved toward the brand: the same soft contrast and the same syntax balance, obsidian
greys instead of Nord's blue-grey, and the one orange as the accent.

## How it is built

`build.mjs` reads the installed Nord Deep theme (`marlosirapuan.nord-deep`, MIT) and
rewrites every colour through a map, so the structure and the 125 token rules stay
Nord's. The map is the whole design:

| Nord role | Nord | Chanwe Obsidian |
|---|---|---|
| Editor, side bar, panels | `#232731` | `#1C2029` (a touch deeper, blue removed) |
| Activity bar, status bar | `#292D38` | `#232A35` (`ink-light`, brand) |
| Tabs, hover, current line | `#3B4252` | `#2E3542` |
| Selection, buttons, guides | `#434C5E` | `#3B4453` |
| Line numbers, borders | `#4C566A` | `#4A5567` |
| Body text | `#D8DEE9` | `#CBD2DB` (near `rule-cool`) |
| UI accent: badges, active tab, progress, find | `#88C0D0` | `#FD3810` (`primary`) |
| Function names (Nord reuses the accent) | `#88C0D0` | `#8FB4D4` (muted sky, set after the map) |
| Markdown and Quarto headings | `#88C0D0` | `#FD3810`, bold |
| Keywords, control flow | `#81A1C1` | `#E8876B` (soft orange) |
| Functions, types | `#8FBCBB` | `#8CBFBA` (muted teal) |
| Operators, terminators, tag punctuation | `#81A1C1` | `#9AA8BA` (quiet slate, set after the map) |
| Strings | `#A3BE8C` | `#9FC291` |
| Numbers | `#D08770` | `#D9906F` |
| Classes, attributes | `#EBCB8B` | `#E6C994` |
| Errors, deletions | `#BF616A` | `#D4706A` |
| Regex, special | `#B48EAD` | `#B596C7` |

Cursor, links and list highlights are set to the orange after the map; the heavier
orange fills (selection, list focus, peek matches) are thinned, and the terminal keeps a
teal cyan. Alpha suffixes carry over, so Nord's translucent fills keep their weight.

## Install

From the repository root:

```bash
./themes/install.sh
```

The script packages a `.vsix` with `vsce` and installs it through the Positron and VS Code
CLIs. Reload the window and choose **Chanwe Obsidian** under *Preferences: Color Theme*
(the tracked `settings.json` already does).

## Edit

Change the map in `build.mjs`, run `node themes/chanwe-obsidian/build.mjs`, bump
`version` in `package.json` and run `themes/install.sh` again. Do not edit the generated JSON by hand.
