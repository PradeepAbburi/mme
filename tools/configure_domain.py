#!/usr/bin/env python3
"""
Domain configuration tool for Mahadev Marine Exports website.
Updates canonical URLs, Open Graph / Twitter image URLs, sitemap.xml, robots.txt, and llms.txt.
Uses only standard library (no external dependencies required).
"""
import sys
import re
from pathlib import Path
from datetime import date

root = Path(__file__).resolve().parents[1]

if len(sys.argv) != 2:
    raise SystemExit('Usage: python tools/configure_domain.py https://mahadevmarineexports.com')

domain = sys.argv[1].rstrip('/')
if not domain.startswith('https://'):
    raise SystemExit('Use a full HTTPS domain, for example https://mahadevmarineexports.com')

files_config = [
    ('index.html', '/', '1.00', 'weekly'),
    ('shrimp-exports-india.html', '/shrimp-exports-india.html', '0.95', 'weekly'),
    ('export-markets.html', '/export-markets.html', '0.95', 'weekly'),
    ('india-seafood-sourcing.html', '/india-seafood-sourcing.html', '0.95', 'weekly'),
    ('products.html', '/products.html', '0.90', 'weekly'),
    ('buyer-enquiry.html', '/buyer-enquiry.html', '0.90', 'weekly'),
    ('about.html', '/about.html', '0.85', 'monthly'),
    ('quality.html', '/quality.html', '0.85', 'monthly'),
    ('contact.html', '/contact.html', '0.85', 'monthly'),
    ('leadership.html', '/leadership.html', '0.80', 'monthly'),
    ('privacy.html', '/privacy.html', '0.30', 'yearly'),
    ('terms.html', '/terms.html', '0.30', 'yearly'),
]

today = date.today().isoformat()

for filename, path, priority, freq in files_config:
    p = root / filename
    if not p.exists():
        continue
    content = p.read_text(encoding='utf-8')
    full_url = domain + path

    # Update canonical
    content = re.sub(
        r'<link\s+href="[^"]*"\s+rel="canonical"\s*\/?>',
        f'<link href="{full_url}" rel="canonical"/>',
        content,
        flags=re.IGNORECASE
    )

    # Update og:url
    if re.search(r'<meta\s+content="[^"]*"\s+property="og:url"\s*\/?>', content, flags=re.IGNORECASE):
        content = re.sub(
            r'<meta\s+content="[^"]*"\s+property="og:url"\s*\/?>',
            f'<meta content="{full_url}" property="og:url"/>',
            content,
            flags=re.IGNORECASE
        )
    else:
        content = re.sub(
            r'(<meta\s+content="[^"]*"\s+property="og:image"\s*\/?>)',
            f'\\1\n<meta content="{full_url}" property="og:url"/>',
            content,
            flags=re.IGNORECASE
        )

    # Update alternates (hreflang)
    content = re.sub(
        r'<link\s+href="https?://[^"]*"\s+hreflang="([^"]*)"\s+rel="alternate"\s*\/?>',
        f'<link href="{full_url}" hreflang="\\1" rel="alternate"/>',
        content,
        flags=re.IGNORECASE
    )

    p.write_text(content, encoding='utf-8')

# Generate sitemap.xml
xml_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    '  <!-- Homepage -->',
    '  <url>',
    f'    <loc>{domain}/</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.00</priority>',
    '  </url>',
    '',
    '  <!-- High-Value Strategic Regional & Shrimp Export Hubs -->',
    '  <url>',
    f'    <loc>{domain}/shrimp-exports-india.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.95</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/export-markets.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.95</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/india-seafood-sourcing.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.95</priority>',
    '  </url>',
    '',
    '  <!-- Products & Sourcing Portals -->',
    '  <url>',
    f'    <loc>{domain}/products.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.90</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/buyer-enquiry.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.90</priority>',
    '  </url>',
    '',
    '  <!-- Company, Quality, Leadership & Contact -->',
    '  <url>',
    f'    <loc>{domain}/about.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.85</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/quality.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.85</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/contact.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.85</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/leadership.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.80</priority>',
    '  </url>',
    '',
    '  <!-- Legal & Compliance -->',
    '  <url>',
    f'    <loc>{domain}/privacy.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>yearly</changefreq>',
    '    <priority>0.30</priority>',
    '  </url>',
    '  <url>',
    f'    <loc>{domain}/terms.html</loc>',
    f'    <lastmod>{today}</lastmod>',
    '    <changefreq>yearly</changefreq>',
    '    <priority>0.30</priority>',
    '  </url>',
    '',
    '</urlset>',
    ''
]
(root / 'sitemap.xml').write_text('\n'.join(xml_lines), encoding='utf-8')

# Update robots.txt cleanly without duplicate Sitemap entries
robots_file = root / 'robots.txt'
if robots_file.exists():
    lines = [l for l in robots_file.read_text(encoding='utf-8').splitlines() if not l.strip().startswith('Sitemap:')]
    lines.append(f'Sitemap: {domain}/sitemap.xml')
    robots_file.write_text('\n'.join(lines) + '\n', encoding='utf-8')

print(f'Successfully configured domain to {domain} and updated sitemap.xml and robots.txt')
