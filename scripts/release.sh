#!/usr/bin/env bash
# Publishes a release of int-positron-config: tag vX.Y.Z on main, and a GitHub release with the
# CHANGELOG notes for X.Y.Z and two downloads:
#   int-positron-config-vX.Y.Z.zip   the whole repository (settings, shortcuts, extensions, the theme)
#   chanwe-obsidian-X.Y.Z.vsix       the Chanwe Obsidian theme, ready for --install-extension
# The version is the theme's (themes/chanwe-obsidian/package.json).
#
#   scripts/release.sh 0.6.0
set -euo pipefail
version=${1:?usage: scripts/release.sh X.Y.Z}
[[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "not a X.Y.Z version: $version" >&2; exit 1; }
tag="v$version"; name=int-positron-config
cd "$(git rev-parse --show-toplevel)"
[ "$(git branch --show-current)" = main ] || { echo "release from main" >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "the working tree has uncommitted changes" >&2; exit 1; }
git fetch -q origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] || { echo "main is not the same as origin/main" >&2; exit 1; }
! git rev-parse -q --verify "refs/tags/$tag" >/dev/null || { echo "$tag already exists; never move a published tag" >&2; exit 1; }
[ "$(node -p "require('./themes/chanwe-obsidian/package.json').version")" = "$version" ] || { echo "themes/chanwe-obsidian/package.json is not at $version" >&2; exit 1; }
notes=$(mktemp)
awk -v h="## $version " 'index($0,h)==1{f=1;next} f&&/^## /{exit} f' CHANGELOG.md > "$notes"
grep -q '[^[:space:]]' "$notes" || { echo "CHANGELOG.md has no notes under ## $version - YYYY-MM-DD" >&2; exit 1; }
out=$(mktemp -d)
git archive --format=zip --prefix="$name/" -o "$out/$name-$tag.zip" HEAD -- ':(exclude)**/.DS_Store'
(cd themes/chanwe-obsidian && npx -y @vscode/vsce@latest package --allow-missing-repository --skip-license -o "$out/chanwe-obsidian-$version.vsix" >/dev/null)
git tag -a "$tag" -m "Chanwe Obsidian $version"
git push -q origin "$tag"
gh release create "$tag" "$out/$name-$tag.zip" "$out/chanwe-obsidian-$version.vsix" --title "Chanwe Obsidian $version" --notes-file "$notes"
echo "released $tag · $name-$tag.zip · sha256 $(shasum -a 256 "$out/$name-$tag.zip" | cut -d' ' -f1)"
