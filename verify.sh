#!/usr/bin/env bash
# Pre-flight check. Run before pushing.
set -e
fail=0
echo "Soft Ground — pre-flight"
for f in index.html manifest.webmanifest sw.js README.md LICENSE .nojekyll \
         clinical/index.html icons/icon-192.png icons/icon-512.png \
         icons/icon-maskable-512.png icons/apple-touch-icon.png; do
  if [ -f "$f" ]; then echo "  ok    $f"; else echo "  MISS  $f"; fail=1; fi
done
python3 -c "import json;json.load(open('manifest.webmanifest'))" && echo "  ok    manifest is valid JSON"
if command -v node >/dev/null; then node --check sw.js && echo "  ok    sw.js parses"; fi
grep -q 'rel="manifest"' index.html && echo "  ok    index links the manifest" || { echo "  MISS  manifest link"; fail=1; }
grep -q "serviceWorker" index.html && echo "  ok    index registers the service worker" || { echo "  MISS  sw registration"; fail=1; }
grep -q "13 11 14" index.html && echo "  ok    crisis numbers present" || { echo "  MISS  crisis numbers"; fail=1; }
v=$(grep -o "VERSION = '[^']*'" sw.js | head -1)
echo "  note  service worker $v  (bump this after editing the app)"
# the failure mode that actually bites: uploading the folder instead of its contents
if [ ! -f index.html ]; then
  echo ""
  echo "  index.html is not here. If you are in a repository, the files were"
  echo "  probably uploaded inside a folder. GitHub Pages will show only your"
  echo "  README until index.html sits at the top level. See DEPLOY.md."
  fail=1
fi
[ $fail -eq 0 ] && echo "PASS" || { echo "FAIL"; exit 1; }
