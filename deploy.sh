#!/usr/bin/env bash
# deploy.sh — Install the custom startpage to LibreWolf or Firefox
# ════════════════════════════════════════════════════════════════════
# Supports Linux, macOS, and Windows (Git Bash / MSYS2 / Cygwin).
# Works with LibreWolf and Firefox — whichever is found first.
# Re-running is safe — it just overwrites existing files.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Detect OS ─────────────────────────────────────────────────────────────
case "$(uname -s)" in
  Linux*)               OS=linux   ;;
  Darwin*)              OS=mac     ;;
  CYGWIN*|MINGW*|MSYS*) OS=windows ;;
  *)
    echo "Unsupported OS: $(uname -s)" >&2
    exit 1 ;;
esac

# ── Paths ─────────────────────────────────────────────────────────────────
STARTPAGE_DIR="$HOME/Documents/startpage"
BACKUP_DIR="$HOME/.config/startpage-config"

case "$OS" in
  linux)
    for dir in \
        /usr/lib/librewolf \
        /usr/lib64/librewolf \
        /opt/librewolf \
        /usr/lib/firefox \
        /usr/lib64/firefox \
        /usr/lib/firefox-esr; do
      [[ -d "$dir" ]] && { BROWSER_DIR="$dir"; break; }
    done
    if [[ -z "${BROWSER_DIR:-}" ]]; then
      echo "Could not find LibreWolf or Firefox." >&2
      echo "Checked: /usr/lib, /usr/lib64, /opt" >&2
      echo "Set BROWSER_DIR manually and re-run." >&2
      exit 1
    fi
    FILE_URL="file://$STARTPAGE_DIR/index.html"
    SUDO=sudo
    ;;

  mac)
    for dir in \
        "/Applications/LibreWolf.app/Contents/Resources" \
        "$HOME/Applications/LibreWolf.app/Contents/Resources" \
        "/Applications/Firefox.app/Contents/Resources" \
        "$HOME/Applications/Firefox.app/Contents/Resources"; do
      [[ -d "$dir" ]] && { BROWSER_DIR="$dir"; break; }
    done
    if [[ -z "${BROWSER_DIR:-}" ]]; then
      echo "Could not find LibreWolf.app or Firefox.app in /Applications or ~/Applications." >&2
      exit 1
    fi
    FILE_URL="file://$STARTPAGE_DIR/index.html"
    SUDO=sudo
    ;;

  windows)
    echo ""
    echo "  Note: run this script from a Git Bash terminal launched as Administrator"
    echo "  so it can write to Program Files."
    # cygpath converts Windows paths to Unix-style; available in Git Bash / MSYS2 / Cygwin
    PF="$(cygpath "$PROGRAMFILES" 2>/dev/null || echo "/c/Program Files")"
    for dir in \
        "$PF/LibreWolf" \
        "${PF} (x86)/LibreWolf" \
        "$PF/Mozilla Firefox" \
        "${PF} (x86)/Mozilla Firefox"; do
      [[ -d "$dir" ]] && { BROWSER_DIR="$dir"; break; }
    done
    if [[ -z "${BROWSER_DIR:-}" ]]; then
      echo "Could not find LibreWolf or Firefox in Program Files." >&2
      echo "Set BROWSER_DIR manually and re-run." >&2
      exit 1
    fi
    # Build a file:///C:/... URL from the Git Bash path
    WIN_PATH="$(cygpath -m "$STARTPAGE_DIR" 2>/dev/null \
      || echo "$STARTPAGE_DIR" | sed 's|^/\([a-zA-Z]\)/|\1:/|')"
    FILE_URL="file:///$WIN_PATH/index.html"
    SUDO=""
    ;;
esac

# ── 1. Copy startpage files ───────────────────────────────────────────────
echo ""
echo "▶ Copying startpage to $STARTPAGE_DIR"
mkdir -p "$STARTPAGE_DIR"
cp "$SCRIPT_DIR/startpage/index.html" "$STARTPAGE_DIR/"
cp "$SCRIPT_DIR/startpage/config.css" "$STARTPAGE_DIR/"
cp "$SCRIPT_DIR/startpage/config.js"  "$STARTPAGE_DIR/"
cp "$SCRIPT_DIR/startpage/logo.png"   "$STARTPAGE_DIR/"
echo "  Done."

# ── 2. Generate config files with the correct URL ─────────────────────────
echo ""
echo "▶ Preparing browser config (URL: $FILE_URL)"
mkdir -p "$BACKUP_DIR"
sed "s|STARTPAGE_URL|$FILE_URL|g" "$SCRIPT_DIR/system/librewolf.cfg" \
  > "$BACKUP_DIR/librewolf.cfg"
cp "$SCRIPT_DIR/system/autoconfig.js" "$BACKUP_DIR/autoconfig.js"
echo "  Saved to $BACKUP_DIR"

# ── 3. Apply config to browser ────────────────────────────────────────────
echo ""
echo "▶ Applying config to browser at $BROWSER_DIR"
$SUDO mkdir -p "$BROWSER_DIR/defaults/pref"
$SUDO cp "$BACKUP_DIR/autoconfig.js" "$BROWSER_DIR/defaults/pref/autoconfig.js"
$SUDO cp "$BACKUP_DIR/librewolf.cfg" "$BROWSER_DIR/librewolf.cfg"
echo "  Applied."

# ── 4. Pacman hook (Arch Linux only) ──────────────────────────────────────
if [[ "$OS" == "linux" ]] && command -v pacman &>/dev/null; then
  HOOK_DIR="/etc/pacman.d/hooks"
  echo ""
  echo "▶ Installing pacman hook (Arch Linux)"
  sudo mkdir -p "$HOOK_DIR"
  sudo tee "$HOOK_DIR/librewolf-startpage.hook" > /dev/null << HOOK
[Trigger]
Operation = Upgrade
Type = Package
Target = librewolf
Target = firefox
Target = firefox-esr

[Action]
Description = Re-applying custom startpage config after browser update...
When = PostTransaction
Exec = /bin/sh -c 'cp $BACKUP_DIR/autoconfig.js $BROWSER_DIR/defaults/pref/autoconfig.js && cp $BACKUP_DIR/librewolf.cfg $BROWSER_DIR/librewolf.cfg'
HOOK
  echo "  Hook installed at $HOOK_DIR/librewolf-startpage.hook"
fi

echo ""
echo "✓ All done. Restart your browser to see your startpage."
echo ""
