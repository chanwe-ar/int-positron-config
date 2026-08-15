# Positron configuration

This repository is a reproducible snapshot of Alejandro's user-level Positron configuration on macOS. It tracks editor settings, keyboard shortcuts, and the active extension set without storing credentials or Positron workspace state.

## Configuration files

| File | Positron source | Purpose |
|---|---|---|
| `settings.json` | `~/Library/Application Support/Positron/User/settings.json` | User settings for the editor, R, Quarto, notebooks, Git, and extensions |
| `keyboard_shortcut.json` | `~/Library/Application Support/Positron/User/keybindings.json` | Custom keyboard shortcuts |
| `extensions.txt` | Positron CLI extension inventory | Active extension IDs pinned to their installed versions |

The snapshot was refreshed on 2026-08-15. The Snowflake setting contains only the local path to `connections.toml`; the connection file and its credentials are not tracked.

## Software versions

| Software | Version | Notes |
|---|---:|---|
| macOS | 26.5.2 (arm64) | Host operating system |
| Positron | 2026.08.0, build 331 | Based on Code OSS 1.124.0 |
| Quarto, bundled with Positron | 1.10.18 | Selected by `quarto.useBundledQuartoInPositron` |
| Quarto, standalone CLI | 1.9.37 | Installed in the user Applications directory |
| R | 4.5.2 | Native R runtime |
| Python | 3.14.4 | CPython installed through Homebrew |
| Docker | 29.3.0 | Docker CLI; the engine was not running during the snapshot |
| Git | 2.50.1 (Apple Git-155) | Source control CLI |
| Node.js | 25.6.1 | Managed through `nvm` |
| pnpm | 10.33.0 | JavaScript package manager |
| uv | 0.10.2 | Python project and package manager |
| GitHub CLI | 2.88.1 | GitHub command-line client |

## Restore on macOS

Back up any existing Positron user configuration first. From this repository, copy the settings and shortcuts into Positron's user directory:

```bash
cp settings.json "$HOME/Library/Application Support/Positron/User/settings.json"
cp keyboard_shortcut.json "$HOME/Library/Application Support/Positron/User/keybindings.json"
```

Install the pinned extensions with Positron's bundled CLI:

```bash
while IFS= read -r extension; do
  /Applications/Positron.app/Contents/Resources/app/bin/code \
    --install-extension "$extension"
done < extensions.txt
```

Restart Positron after restoring the files and extensions.

## Refresh the snapshot

After changing Positron settings, shortcuts, or extensions, run these commands from the repository root:

```bash
cp "$HOME/Library/Application Support/Positron/User/settings.json" settings.json
cp "$HOME/Library/Application Support/Positron/User/keybindings.json" keyboard_shortcut.json
/Applications/Positron.app/Contents/Resources/app/bin/code \
  --list-extensions --show-versions | sort > extensions.txt
```

Review the diff before committing so credentials or machine-specific secrets are never added.

## Chanwe dependencies

This configuration repository does not use the Chanwe Quarto extension or the `chanwer` R package. Those dependencies belong in the individual report or analysis repositories that need them.
