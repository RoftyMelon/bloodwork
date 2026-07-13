import re,sys
import os
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
s=open(os.path.join(root,'index.html'),encoding='utf-8').read()
css=s.split('<style>')[1].split('</style>')[0]
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
css=re.sub(r'@import[^\n]*\n','',css)          # the font URL contains ';', so match the whole line
bad=[]
if css.count('{')!=css.count('}'): bad.append(f"braces {css.count('{')}/{css.count('}')}")
depth=0; sel=''
for ch in css:
    if ch=='{':
        if depth==0:
            t=sel.strip()
            if not t: bad.append('EMPTY selector')
            elif '\n\n' in t: bad.append('MANGLED, spans a blank line: '+repr(t[:70]))
            else:
                for one in t.split(','):        # a LIST may repeat tokens; ONE selector may not
                    p=one.split()
                    if len(p)>1 and len(p)!=len(set(p)):
                        bad.append('MANGLED, repeats a token: '+repr(t[:70])); break
            sel=''
        depth+=1
    elif ch=='}': depth-=1; sel=''
    elif depth==0: sel+=ch
if sel.strip(): bad.append('DANGLING at end: '+repr(sel.strip()[:70]))
for blk in re.findall(r'\{([^{}]*)\}',css):
    for d in blk.split(';'):
        if d.strip() and ':' not in d: bad.append('VALUELESS: '+repr(d.strip()[:40]))
used=set(re.findall(r'var\((--[\w-]+)',css))
defn=set(re.findall(r'(--[\w-]+)\s*:',css))|set(re.findall(r"setProperty\('(--[\w-]+)'",s))
if used-defn: bad.append('UNDEFINED vars: '+str(sorted(used-defn)))
print('\n'.join('  ❌ '+b for b in bad) if bad else '  ✅ CSS clean')
sys.exit(1 if bad else 0)
