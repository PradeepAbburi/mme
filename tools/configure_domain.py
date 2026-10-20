#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
import sys
root = Path(__file__).resolve().parents[1]
if len(sys.argv) != 2:
    raise SystemExit('Usage: python tools/configure_domain.py https://www.yourdomain.com')
domain=sys.argv[1].rstrip('/')
if not domain.startswith('https://'):
    raise SystemExit('Use a full HTTPS domain, for example https://www.yourdomain.com')
files=['index.html','about.html','products.html','quality.html','leadership.html','contact.html','privacy.html','terms.html']
urls=[]
for filename in files:
    p=root/filename
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    path='/' if filename=='index.html' else '/'+filename
    canonical=soup.head.find('link',rel='canonical')
    if canonical: canonical['href']=domain+path
    og=soup.head.find('meta',attrs={'property':'og:url'})
    if not og:
        og=soup.new_tag('meta',attrs={'property':'og:url','content':domain+path}); soup.head.append(og)
    else: og['content']=domain+path
    p.write_text(str(soup),encoding='utf-8')
    urls.append(domain+path)
xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in urls: xml.append(f'  <url><loc>{u}</loc></url>')
xml.append('</urlset>')
(root/'sitemap.xml').write_text('\n'.join(xml)+'\n',encoding='utf-8')
robots=(root/'robots.txt').read_text(encoding='utf-8').rstrip()+'\nSitemap: '+domain+'/sitemap.xml\n'
(root/'robots.txt').write_text(robots,encoding='utf-8')
print('Configured domain and generated sitemap:',domain)
