"""Check required premium assets, PNG dimensions, local imports and JS syntax."""
from pathlib import Path
import json, re, shutil, struct, subprocess, sys
root = Path(__file__).resolve().parents[1]
required = ['index.html', 'manifest.webmanifest', 'sw.js', 'css/styles.css', 'css/base.css', 'css/screens.css', 'css/tour.css']
required += ['js/' + name + '.js' for name in ['config', 'icons', 'utils', 'store', 'actions', 'app', 'ui/components', 'ui/intro', 'ui/onboarding', 'ui/main', 'ui/sheets']]
images = {'logo.png': (512,512), 'favicon-32.png': (32,32), 'apple-touch-icon.png': (180,180), 'icon-192.png': (192,192), 'og-image.png': (1200,630)}
required += ['assets/' + name for name in images]
errors = [f'Missing: {name}' for name in required if not (root/name).is_file()]
for name, size in images.items():
    path = root/'assets'/name
    if path.is_file():
        data = path.read_bytes()
        if len(data) < 24 or data[:8] != b'\x89PNG\r\n\x1a\n':
            errors.append(f'Not a valid PNG header: assets/{name}')
        elif struct.unpack('>II', data[16:24]) != size:
            errors.append(f'Unexpected dimensions: assets/{name}')
for name in ['index.html', 'css/styles.css']:
    path = root/name
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8')
    refs = re.findall(r'(?:src|href)=["\']([^"\']+)', text) if name.endswith('.html') else re.findall(r'@import\s+url\(["\']([^"\']+)', text)
    for ref in refs:
        if not ref.startswith(('https:', 'http:', 'data:', '#')) and not (path.parent/ref).is_file():
            errors.append(f'Broken local reference in {name}: {ref}')
node = shutil.which('node')
if node:
    for path in sorted((root/'js').rglob('*.js')):
        result = subprocess.run([node, '--check', str(path)], capture_output=True, text=True)
        if result.returncode:
            errors.append(result.stderr.strip())
print(json.dumps({'complete': not errors, 'errors': errors, 'node_syntax_checked': bool(node)}, indent=2))
sys.exit(1 if errors else 0)
