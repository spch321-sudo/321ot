#!/usr/bin/env python3
"""321舊約導讀 · 每日自動更新

讀取 YouTube 播放清單「旧约导读」（最新的影片排在最前面）：
  1. 已有的章節：把影片連到 data/videos.json（繁體影片放 t、簡體影片放 s）。
  2. 還沒有的章節：從影片說明欄取出導讀文字，做成繁／簡兩版新課（經文用和合本），
     英文版先放簡體文字，記到 tools/pending_en.json，等英文翻譯排程補上。
有任何變動就更新 version.json、sw.js、app.js 的版本號，讓已安裝的手機自動換新版。
只用 Python 標準函式庫。
"""
import gzip, json, os, re, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(ROOT, 'tools')
D = os.path.join(ROOT, 'data')
PLAYLIST = 'PLid55ck_AyA35mHv8utiFplYcccBDIzk0'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
      'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8', 'Cookie': 'CONSENT=YES+1; SOCS=CAI'}

BOOKS = json.load(open(os.path.join(T, 'books.json'), encoding='utf-8'))  # [繁, 简, English, CUVkey, WEBcode]
Z = json.load(open(os.path.join(T, 'zhmap.json'), encoding='utf-8'))

def t2s(s): return ''.join(Z['t2s'].get(c, c) for c in s)
def s2t(s):
    out = []
    for i, c in enumerate(s):
        nx = s[i + 1] if i + 1 < len(s) else ''; pv = s[i - 1] if i else ''
        out.append(Z['bi'].get(c + nx) or Z['bp'].get(pv + c) or Z['s2t'].get(c, c))
    return ''.join(out)

CN = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9}
def cnum(s):
    if s.isdigit(): return int(s)
    if '十' in s:
        a, b = s.split('十'); return (CN[a] if a else 1) * 10 + (CN[b] if b else 0)
    return CN[s]

def get(url, data=None, headers=None):
    h = dict(UA); h.update(headers or {})
    req = urllib.request.Request(url, data=data, headers=h)
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r: return r.read().decode('utf-8')
        except Exception as e:
            if i == 2: raise
            time.sleep(3)

def rj(p, default=None):
    try: return json.load(open(p, encoding='utf-8'))
    except Exception: return default
def wj(p, o, pretty=False):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(o, f, ensure_ascii=False, **({'indent': 1} if pretty else {'separators': (',', ':')}))

# ---------------- YouTube ----------------
def playlist_videos():
    h = get('https://www.youtube.com/playlist?list=' + PLAYLIST + '&hl=zh-TW')
    m = re.search(r'var ytInitialData = (\{.+?\});</script>', h, re.S)
    d = json.loads(m.group(1)); vids, seen = [], set()
    def walk(o):
        if isinstance(o, dict):
            if 'playlistVideoRenderer' in o:
                r = o['playlistVideoRenderer']; t = r.get('title', {})
                t = (t.get('runs') or [{'text': t.get('simpleText', '')}])[0]['text']
                if r['videoId'] not in seen: seen.add(r['videoId']); vids.append((r['videoId'], t))
                return
            l = o.get('lockupViewModel')
            if l and l.get('contentType') == 'LOCKUP_CONTENT_TYPE_VIDEO':
                try: t = l['metadata']['lockupMetadataViewModel']['title']['content']
                except Exception: t = ''
                if l['contentId'] not in seen: seen.add(l['contentId']); vids.append((l['contentId'], t))
                return
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(d)
    return vids

def description(vid):
    h = get('https://www.youtube.com/watch?v=' + vid + '&hl=zh-TW')
    m = re.search(r'ytInitialPlayerResponse\s*=\s*(\{.+?\});(?:var|</script>)', h, re.S)
    if not m: return '', ''
    d = json.loads(m.group(1)).get('videoDetails', {})
    return d.get('title', ''), d.get('shortDescription', '')

def classify(title):
    """影片標題 -> (書卷序, 章, 't'|'s')；無法辨識回傳 None"""
    t = re.sub(r'\s+', '', title)
    bi, sc = -1, ''
    for i, b in enumerate(BOOKS):
        if b[0] in t: bi, sc = i, 't'; break
    if bi < 0:
        for i, b in enumerate(BOOKS):
            if b[1] in t: bi, sc = i, 's'; break
    if bi < 0: return None
    if re.search(r'简|簡', t): sc = 's'
    if '繁' in t: sc = 't'
    m = re.search(r'第?(\d+)[-–~至](\d+)章?', t) or re.search(r'第([0-9一二三四五六七八九十]+)章', t)
    if not m: return None
    return bi, cnum(m.group(1)), sc

# ---------------- Bible text ----------------
_CUV = {}
def cuv(lang):
    if lang not in _CUV:
        d = {}
        for part in ('law', 'hist', 'poet', 'proph'):
            d.update(json.loads(get('https://spch321-sudo.github.io/bible/bible.%s.%s.json' % (lang, part))))
        _CUV[lang] = d
    return _CUV[lang]

def cuv_verses(lang, bi, c):
    book = cuv(lang)[BOOKS[bi][3]]; out = []
    if c - 1 >= len(book): return out
    for para in book[c - 1]:
        for k in range(1, len(para) - 1, 2):
            if isinstance(para[k], int): out.append([c, para[k], para[k + 1]])
    return out

_WEB = None
def web_verses(bi, c):
    global _WEB
    if _WEB is None:
        with gzip.open(os.path.join(T, 'web_ot.json.gz'), 'rt', encoding='utf-8') as f: _WEB = json.load(f)
    ch = _WEB.get(BOOKS[bi][3], {}).get(str(c), {})
    return [[c, int(v), ch[v]] for v in sorted(ch, key=int)]

# ---------------- Guide text parsing (same rules as the original build) ----------------
HEAD_TEACH = re.compile(r'^(上帝|神|主).{0,14}(教導|教导|啟示|提醒|告訴|告诉|說什麼|要我們)')
HEAD_PRAY = re.compile(r'(一起|一同|讓我們|让我们).{0,4}(禱告|祷告)|^(禱告|祷告|結束禱告)[：:]?$')
HEAD_APP = re.compile(r'^(應用|应用|反思|默想|思考|討論|讨论|生活應用|個人應用).{0,6}(題目|题目|問題|问题|題|应用|應用)?[：:]?$')
HEAD_DECL = re.compile(r'^(信心)?(宣告|宣言)[：:]?$')
NUM = re.compile(r'^\s*(?:\d+\\?[\.、．)，,]|[（(]?[一二三四五六七八九十]+[、．.)）]|[①②③④⑤⑥⑦⑧⑨])\s*')

def clean(s):
    return re.sub(r'\s+$', '', s.replace('　', ' ').replace('⬤', '').replace('​', '').replace('\\.', '.')).strip()

def split_head(line):
    m = re.match(r'^(.{2,30}?)[：:]\s*(.*)$', line)
    return (m.group(1).strip(), m.group(2).strip()) if m else (line, '')

def guide_from_description(desc):
    """說明欄 -> 去掉標題、經文、#標籤、開頭殘句 後的導讀行"""
    L = desc.replace('\r', '').split('\n')
    body = [l for i, l in enumerate(L) if i > 0 and not re.match(r'^\s*\d+:\d+', l) and not re.match(r'^\s*#', l)]
    while body and (not body[0].strip() or (len(body[0].strip()) < 40 and not re.search(r'[。！？：:]$', body[0].strip()))):
        body = body[1:]
    return body

def parse(lines):
    body = [clean(l) for l in lines]
    def tc(l):
        nt = sum(1 for c in l if t2s(c) != c); ns = sum(1 for c in l if s2t(c) != c)
        return s2t(l) if ns > nt else l
    body = [tc(l) for l in body]
    sec = 'b'; out = {'b': [], 'a': [], 'q': [], 'pr': [], 'dc': [], 'ah': ''}
    for l in body:
        if not l: continue
        if len(l) < 14 and l.startswith('「') and l.endswith('」'): l = l[1:-1]
        bare = re.sub(r'[：:]$', '', l)
        if (len(l) < 30 and HEAD_TEACH.search(l) and (l.endswith('：') or l.endswith(':') or len(l) < 20)) or \
           (sec == 'b' and len(l) < 40 and re.search(r'(啟示|重點|訊息|資訊|學到|傳達|教導).{0,20}[：:]$', l)):
            sec = 'a'; out['ah'] = bare; continue
        if sec == 'b' and len(l) > 20 and re.search(r'(如下|以下.{0,18})[：:]$', l):
            out['b'].append(l); sec = 'a'; continue
        if len(l) < 20 and HEAD_PRAY.search(l): sec = 'pr'; continue
        if len(l) < 16 and HEAD_APP.search(l): sec = 'q'; continue
        if len(l) < 10 and HEAD_DECL.search(l): sec = 'dc'; continue
        if re.match(r'^《?[^\s，。]{2,6}》?第.{1,4}章\s*(導讀|导读)?$', l): continue
        out[sec].append(l)
    items = []
    for l in out['a']:
        if NUM.match(l):
            h, d = split_head(NUM.sub('', l))
            if not d and len(h) > 18: h, d = '', h
            items.append([h, d])
        elif items:
            items[-1][1] = (items[-1][1] + l) if not items[-1][1] else items[-1][1] + '\n' + l
        else:
            out['b'].append(l)
    a = []
    for h, d in items:
        if not h and '\n' in d: h, d = d.split('\n', 1)
        a.append([h.rstrip('。'), d])
    out['a'] = a
    qs = []
    for l in out['q']:
        if NUM.match(l): qs.append(NUM.sub('', l))
        elif qs and len(qs[-1]) >= 16 and re.search(r'[？?。]$', qs[-1]) and (re.search(r'[？?]$', l) or (len(l) < 18 and not re.search(r'[？?。]$', l))):
            qs.append(l)
        elif qs:
            qs[-1] = qs[-1] + ('' if re.search(r'[：:]$', qs[-1]) else '：') + l if len(qs[-1]) < 24 and not re.search(r'[？?。]$', qs[-1]) else qs[-1] + ('\n' if len(qs[-1]) < 16 else ' ') + l
        else: qs.append(l)
    out['q'] = qs
    out['pr'] = '\n'.join(out['pr']); out['dc'] = '\n'.join(out['dc'])
    if not out['q'] and out['pr']:
        pl = out['pr'].split('\n')
        if re.search(r'[？?]\s*$', pl[-1]): out['q'] = [pl[-1]]; out['pr'] = '\n'.join(pl[:-1])
    return out

def theme(x):
    for h, d in x['a']:
        h = re.sub(r'[。！!]$', '', h)
        if 2 <= len(h) <= 18: return h
    for q in x['q']:
        h = split_head(q)[0]
        if h != q and 2 <= len(h) <= 16: return h
    return ''

# ---------------- data files ----------------
def chunk_path(lang, n): return os.path.join(D, '%s-%02d.json' % (lang, (n - 1) // 50))

def add_lesson(bi, c, x, n):
    th = theme(x)
    for lang in ('zh', 'zs', 'en'):
        cv = t2s if lang == 'zs' else (lambda s: s)
        if lang == 'en':
            vs = web_verses(bi, c); name = BOOKS[bi][2]
            lab = '%s %d' % (name, c); ref = '%s %d:1–%d' % (name, c, vs[-1][1] if vs else 1)
            e = {'n': n, 't': t2s(th) if th else 'Guide to ' + lab, 'ref': ref, 'lab': lab, 'bk': bi, 'v': vs,
                 'b': [t2s(p) for p in x['b']], 'ah': t2s(x['ah']), 'a': [[t2s(h), t2s(d)] for h, d in x['a']],
                 'q': [t2s(q) for q in x['q']], 'pr': t2s(x['pr']), 'dc': t2s(x['dc']), 'pending': 1}
        else:
            vs = cuv_verses(lang, bi, c); name = BOOKS[bi][0 if lang == 'zh' else 1]
            lab = '%s 第%d章' % (name, c); ref = '%s %d:1–%d' % (name, c, vs[-1][1] if vs else 1)
            e = {'n': n, 't': cv(th) if th else lab + ('導讀' if lang == 'zh' else '导读'), 'ref': ref, 'lab': lab, 'bk': bi, 'v': vs,
                 'b': [cv(p) for p in x['b']], 'ah': cv(x['ah']), 'a': [[cv(h), cv(d)] for h, d in x['a']],
                 'q': [cv(q) for q in x['q']], 'pr': cv(x['pr']), 'dc': cv(x['dc'])}
        p = chunk_path(lang, n); arr = rj(p, []) or []
        arr = [y for y in arr if y['n'] != n] + [e]; wj(p, arr)
        idx = rj(os.path.join(D, 'idx-%s.json' % lang), [])
        hook = e['b'][0] if e['b'] else ''
        m = re.match(r'^(.{8,60}?[。！？])', hook) if lang != 'en' else re.match(r'^(.{20,160}?[.!?。！？])(\s|$)', hook)
        hook = m.group(1) if m else hook[:60]
        row = [n, e['t'], ref, hook, bi, lab]
        idx = [r for r in idx if r[0] != n]
        pos = len(idx)
        for i, r in enumerate(idx):  # keep book/chapter order in the table of contents
            rc = int(re.search(r'(\d+)', r[5].split(' ')[-1]).group(1))
            if (r[4], rc) > (bi, c): pos = i; break
        idx.insert(pos, row); wj(os.path.join(D, 'idx-%s.json' % lang), idx)

def bump_version():
    v = time.strftime('%Y.%m%d.%H%M%S', time.gmtime(time.time() + 8 * 3600))
    wj(os.path.join(ROOT, 'version.json'), {'v': v})
    for fn, pats in (('sw.js', [(r"var V = 'ot321-[^']*'", "var V = 'ot321-%s'" % v), (r"var VER = '[^']*'", "var VER = '%s'" % v)]),
                     ('app.js', [(r"APPVER = '[^']*'", "APPVER = '%s'" % v)]),
                     ('index.html', [(r'\.js\?v=[0-9.]+', '.js?v=%s' % v)])):
        p = os.path.join(ROOT, fn); s = open(p, encoding='utf-8').read()
        for a, b in pats: s = re.sub(a, b, s, count=0 if fn == 'index.html' else 1)
        open(p, 'w', encoding='utf-8').write(s)
    return v

def main():
    idx = rj(os.path.join(D, 'idx-zh.json'), [])
    have = {}
    for r in idx:
        c = int(re.search(r'第(\d+)', r[5]).group(1)); have[(r[4], c)] = r[0]
    videos = rj(os.path.join(D, 'videos.json'), {})
    known = set()
    for v in videos.values():
        for k in ('t', 's'):
            if v.get(k): known.add(v[k])
        for e in v.get('x', []):
            for k in ('t', 's'):
                if e[1].get(k): known.add(e[1][k])
    skip = set(rj(os.path.join(T, 'skip.json'), []))
    pending = rj(os.path.join(T, 'pending_en.json'), [])
    vids = playlist_videos()
    print('playlist videos:', len(vids))
    if not vids: sys.exit('ERROR: playlist returned no videos (YouTube may have blocked the request)')
    changed, log = False, []
    for vid, title in vids:
        if vid in known or vid in skip: continue
        cl = classify(title)
        if not cl: log.append('skip (title) %s %s' % (vid, title)); continue
        bi, c, sc = cl
        n = have.get((bi, c))
        if n:
            v = videos.setdefault(str(n), {})
            if not v.get(sc):
                v[sc] = vid; changed = True; log.append('linked %s %d -> lesson %d (%s)' % (BOOKS[bi][0], c, n, sc))
            continue
        _, desc = description(vid)
        lines = guide_from_description(desc)
        x = parse(lines)
        if not x['b'] or not (x['a'] or x['q'] or x['pr']):
            log.append('no guide text yet %s %s' % (vid, title)); continue
        n = max([r[0] for r in idx] + [0]) + 1
        add_lesson(bi, c, x, n)
        idx = rj(os.path.join(D, 'idx-zh.json'), [])
        have[(bi, c)] = n
        videos[str(n)] = {sc: vid}
        pending.append(n); changed = True
        log.append('NEW lesson %d: %s %d (%s)' % (n, BOOKS[bi][0], c, vid))
    if changed:
        wj(os.path.join(D, 'videos.json'), videos)
        wj(os.path.join(T, 'pending_en.json'), sorted(set(pending)), pretty=True)
        log.append('version ' + bump_version())
    print('\n'.join(log) or 'no changes')
    with open(os.environ.get('GITHUB_STEP_SUMMARY', os.devnull), 'a', encoding='utf-8') as f:
        f.write('\n'.join(log) or 'no changes')

if __name__ == '__main__':
    main()
