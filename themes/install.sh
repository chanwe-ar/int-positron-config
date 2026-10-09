#!/usr/bin/env bash
# Packages the Chanwe Obsidian theme as a .vsix and installs it into Positron and
# VS Code through their CLIs, so the editors register it like any extension.
# Re-run after `node themes/chanwe-obsidian/build.mjs` and a version bump.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
theme_dir="$here/chanwe-obsidian"
version="$(node -p "require('$theme_dir/package.json').version")"
vsix="$(mktemp -d)/chanwe-obsidian-$version.vsix"

(cd "$theme_dir" && npx -y @vscode/vsce@latest package --allow-missing-repository --skip-license -o "$vsix" >/dev/null)

for cli in \
  "/Applications/Positron.app/Contents/Resources/app/bin/code" \
  "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"; do
  [ -x "$cli" ] || continue
  "$cli" --install-extension "$vsix" --force 2>&1 | grep -v -e DeprecationWarning -e trace-deprecation || true
done

echo "Installed Chanwe Obsidian $version. Reload the window (Developer: Reload Window) if the editor is open."
