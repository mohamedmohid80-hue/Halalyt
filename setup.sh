#!/usr/bin/env bash
# Installs the Halal YT video toolchain: FFmpeg (libass), faster-whisper, Remotion, Hyperframes.
set -euo pipefail
cd "$(dirname "$0")"
if ! ffmpeg -hide_banner -filters 2>/dev/null | grep -q " ass "; then
  apt-get update && apt-get install -y ffmpeg
fi
pip install -r requirements.txt
npm ci
npx hyperframes telemetry disable >/dev/null 2>&1 || true
echo "Toolchain ready."
