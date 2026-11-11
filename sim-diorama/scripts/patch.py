import sys,re
F=sys.argv[1]
s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: print('MISS',n,repr(a[:90])); sys.exit(1)
    s=s.replace(a,b)
def cut(start,end,new):
    """replace from start marker through end marker (inclusive)"""
    global s
    i=s.find(start); j=s.find(end,i)
    if i<0 or j<0: print('CUTMISS',repr(start[:60]),repr(end[:60]),i,j); sys.exit(1)
    s=s[:i]+new+s[j+len(end):]
exec(open(sys.argv[2]).read())
open(F,'w').write(s)
print('ok')
