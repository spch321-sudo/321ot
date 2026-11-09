/* 321舊約導讀 Service Worker —— 自動更新版
   ‧ 每次發佈 V 都不同 → 瀏覽器偵測到 sw.js 位元組改變就安裝新 SW
   ‧ install：skipWaiting；預載用 cache:'reload' 繞過 HTTP 快取（GitHub Pages 會快取 10 分鐘）
   ‧ activate：刪舊快取、clients.claim，並通知所有頁面；背景中的舊頁面直接重新導向成新版
     （連「沒有更新程式碼的舊版頁面」也能被帶到新版）
   ‧ fetch：HTML／JS／JSON 網路優先（no-cache），離線才用快取；圖片快取優先；影音不攔截（Range 請求） */
var V = 'ot321-2026.1102.164546-ws24-xz1103-au1103-xzm1103-rf1105-cs1109-ub1109-nv1109';
var PFX = 'ot321-';
var VER = '2026.1102.164546-ws24-xz1103-au1103-xzm1103-rf1105-cs1109-ub1109-nv1109';
var SHELL = ['./', './index.html', './app.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './hero.jpg', './lang-zs.json', './lang-en.json', './media.js', './cpar.js', './coread.js', './data/idx-zh.json', './data/idx-zs.json', './data/idx-en.json', "./xz2.js", "./xzm.js"];
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return fetch(new Request(u, { cache: 'reload' })).then(function (r) { if (r && r.ok) return c.put(u, r); })['catch'](function () { }); }));
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf(PFX) === 0 && k !== V; }).map(function (k) { return caches['delete'](k); }));
  }).then(function () { return self.clients.claim(); }).then(function () {
    return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  }).then(function (cs) {
    cs.forEach(function (c) {
      try { if (c.url.indexOf(self.registration.scope) === 0) c.postMessage({ t: 'sw-updated', v: VER }); } catch (x) { }
      if (c.visibilityState === 'hidden' && c.navigate) { try { c.navigate(c.url); } catch (x) { } }
    });
  }));
});
self.addEventListener('message', function (e) { if (e.data === 'skip') self.skipWaiting(); });

/* 網路優先，但慢網路不讓人乾等：網路請求與 SHELL_WAIT 毫秒計時賽跑，超過就先用快取開（網路那份繼續下載並更新快取）。
   只有導覽請求才可以退回 index.html（程式檔退回 HTML 會變成 SyntaxError） */
var SHELL_WAIT = 1000;
function shellFetch(e, r, u, p, key, nav) {
  var netP = fetch(nav ? u.origin + p + u.search : r.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (resp) {
    if (resp && resp.ok) { var cp = resp.clone(); caches.open(V).then(function (c) { c.put(key, cp); }); }
    return resp;
  });
  e.waitUntil(netP['catch'](function () { }));
  var fromCache = function () {
    return caches.match(key, { ignoreSearch: true }).then(function (h) {
      return h || (nav ? caches.match('./index.html') : caches.match(r, { ignoreSearch: true }));
    });
  };
  return new Promise(function (resolve) {
    var settled = false;
    var timer = setTimeout(function () { fromCache().then(function (h) { if (h && !settled) { settled = true; resolve(h); } }); }, SHELL_WAIT);
    netP.then(function (resp) { clearTimeout(timer); if (!settled) { settled = true; resolve(resp); } }, function () {
      clearTimeout(timer); if (!settled) fromCache().then(function (h) { settled = true; resolve(h || Response.error()); });
    });
  });
}
/* 閒置預存課文檔：目前語言 9 個檔，已在快取的跳過，總量上限 4MB，失敗就算了 */
var PREFETCH_BUDGET = 4 * 1024 * 1024;
function prefetchLang(lang) {
  if (!/^(zh|zs|en)$/.test(lang)) return Promise.resolve();
  var left = PREFETCH_BUDGET, ks = ['idx']; for (var i = 0; i < 9; i++) ks.push(i);
  return caches.open('otdata321').then(function (c) {
    return ks.reduce(function (pr, k) {
      return pr.then(function () {
        if (left <= 0) return;
        var url = new URL('data/' + (k === 'idx' ? 'idx-' + lang : lang + '-' + (k < 10 ? '0' : '') + k) + '.json', self.registration.scope).href;
        return c.match(url).then(function (h) {
          if (h) return;
          return fetch(url, { cache: 'no-cache' }).then(function (resp) { if (resp && resp.ok) { var n = +resp.headers.get('content-length') || 200000; left -= n; return c.put(url, resp); } })['catch'](function () { });
        });
      });
    }, Promise.resolve());
  });
}
self.addEventListener('message', function (e) { if (e.data && e.data.t === 'prefetch') e.waitUntil(prefetchLang(e.data.lang)); });
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url); if (u.origin !== self.location.origin) return;
  var p = u.pathname;
  if (/\.(mp3|m4a|aac|wav|ogg|opus|mp4|mov|webm)$/i.test(p) || r.headers.get('range')) return;
  if (/version\.json$/.test(p)) { e.respondWith(fetch(p + '?t=' + Date.now(), { cache: 'no-store' })['catch'](function () { return new Response('{}', { headers: { 'Content-Type': 'application/json' } }); })); return; }
  if (/\/data\/[^/]+\.json$/.test(p)) {
    var dk = u.origin + p;
    e.respondWith(caches.open('otdata321').then(function (c) {
      return c.match(dk).then(function (h) {
        var net = fetch(u.origin + p + u.search, { cache: 'no-cache' }).then(function (resp) { if (resp && resp.ok) c.put(dk, resp.clone()); return resp; });
        if (h) { net['catch'](function () { }); return h; }
        /* 這個 otdata321 沒有：先找預快取（idx-*.json 在 SHELL），再等網路 */
        return caches.match(dk).then(function (h2) { if (h2) { net['catch'](function () { }); return h2; } return net; });
      });
    }));
    return;
  }
  var nav = r.mode === 'navigate' || /\.html$/.test(p) || /\/$/.test(p);
  var key = nav ? './index.html' : (/\.(json|js)$/.test(p) ? u.origin + p : r);
  if (nav || /\.(json|js|css)$/.test(p)) { e.respondWith(shellFetch(e, r, u, p, key, nav)); return; }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (h) {
    return h || fetch(r).then(function (resp) { if (resp && resp.ok) { var cp = resp.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); } return resp; });
  }));
});
