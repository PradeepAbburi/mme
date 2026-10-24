#!/usr/bin/env python3
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
html_files = sorted(root.glob('*.html'))

targets = [
    'shrimp-exports-india.html',
    'export-markets.html',
    'india-seafood-sourcing.html'
]

for p in html_files:
    content = p.read_text(encoding='utf-8')
    nav_match = re.search(r'(<nav[^>]*>)(.*?)(</nav>)', content, re.DOTALL)
    if not nav_match:
        continue
    
    start_tag, nav_inner, end_tag = nav_match.groups()
    new_nav_inner = nav_inner
    for target in targets:
        pattern = rf'\s*<a[^>]*href=["\']{re.escape(target)}["\'][^>]*>.*?</a>'
        new_nav_inner = re.sub(pattern, '', new_nav_inner, flags=re.IGNORECASE)
    
    # Format cleanly
    lines = [line.strip() for line in new_nav_inner.strip().splitlines() if line.strip()]
    formatted_inner = '\n' + '\n'.join(lines) + '\n'
    new_nav = start_tag + formatted_inner + end_tag
    
    content = content[:nav_match.start()] + new_nav + content[nav_match.end():]
    p.write_text(content, encoding='utf-8')
    print(f'Updated {p.name}')

print('Navbar update complete.')
