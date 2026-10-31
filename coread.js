/* 321舊約導讀 · 一起共讀（投影到別人的手機）
   帶領者開房間 → 得到 6 位數共讀碼／連結／QR；弟兄姊妹打開後，畫面跟著帶領者翻到同一章、同一句。
   傳輸：WebRTC 點對點（PeerJS，信令走 PeerJS 公用伺服器），帶領者的手機就是房間主機。
   ES5。 */
(function () {
  var PEER_JS = ['https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js', 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js'];
  var QR_JS = ['https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js', 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.js', 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'];
  var PFX = 'ot321-co-', FOLLOW_COOL = 8000;
  var TX = {
    zh: { title: '一起共讀', desc: '開一個共讀房間，把共讀碼或連結傳給弟兄姊妹。他們打開後，手機畫面會跟著你翻到同一章、同一句；你朗讀或點一句，大家的畫面也會一起亮起來。', host: '開共讀房間（我來帶領）', join: '加入', codePH: '輸入 6 位數共讀碼', orJoin: '或加入別人的共讀', code: '共讀碼', people: '已有 {0} 人加入', waiting: '等待弟兄姊妹加入…', invite: '傳送邀請', copyLink: '複製連結', end: '結束共讀', leave: '離開共讀', inviteMsg: '📡 一起來共讀《321舊約導讀》！\n點連結加入：{0}\n或打開 App 按「📡 共讀」輸入共讀碼：{1}', following: '跟著帶領共讀', paused: '你自己捲動了 · 點這裡回到帶領處', connecting: '連線中…', hostChip: '共讀 {0} · {1} 人', ended: '共讀已結束', joined: '已加入共讀，畫面會跟著帶領者', noRtc: '這支手機的瀏覽器不支援共讀，請改用 Chrome 或 Safari', loadErr: '共讀功能載入失敗，請確認網路後再試', badCode: '請輸入 6 位數共讀碼', notFound: '找不到這個共讀房間，請確認共讀碼，或請帶領者重新開房間', hostOnly: '你正在帶領共讀', followOnly: '你正在跟著共讀', back2: '回到帶領處', tip: '提示：帶領者的手機請保持 App 開著、螢幕不要關，大家才會一直同步。', qrTip: '用手機相機掃描加入', btn: '共讀', joinedOne: '有一位弟兄姊妹加入共讀', hostLeft: '帶領者暫時離線，正在重新連線…' },
    zs: { title: '一起共读', desc: '开一个共读房间，把共读码或链接传给弟兄姊妹。他们打开后，手机画面会跟着你翻到同一章、同一句；你朗读或点一句，大家的画面也会一起亮起来。', host: '开共读房间（我来带领）', join: '加入', codePH: '输入 6 位数共读码', orJoin: '或加入别人的共读', code: '共读码', people: '已有 {0} 人加入', waiting: '等待弟兄姊妹加入…', invite: '发送邀请', copyLink: '复制链接', end: '结束共读', leave: '离开共读', inviteMsg: '📡 一起来共读《321旧约导读》！\n点链接加入：{0}\n或打开 App 按「📡 共读」输入共读码：{1}', following: '跟着带领共读', paused: '你自己滚动了 · 点这里回到带领处', connecting: '连线中…', hostChip: '共读 {0} · {1} 人', ended: '共读已结束', joined: '已加入共读，画面会跟着带领者', noRtc: '这支手机的浏览器不支持共读，请改用 Chrome 或 Safari', loadErr: '共读功能载入失败，请确认网络后再试', badCode: '请输入 6 位数共读码', notFound: '找不到这个共读房间，请确认共读码，或请带领者重新开房间', hostOnly: '你正在带领共读', followOnly: '你正在跟着共读', back2: '回到带领处', tip: '提示：带领者的手机请保持 App 开着、屏幕不要关，大家才会一直同步。', qrTip: '用手机相机扫描加入', btn: '共读', joinedOne: '有一位弟兄姊妹加入共读', hostLeft: '带领者暂时离线，正在重新连线…' },
    en: { title: 'Read together', desc: 'Open a reading room and send the room code or link to others. When they open it, their phones follow you to the same chapter and sentence; when you read aloud or tap a sentence, it lights up on everyone’s screen.', host: 'Open a room (I’ll lead)', join: 'Join', codePH: 'Enter the 6-digit room code', orJoin: 'Or join someone else’s room', code: 'Room code', people: '{0} joined', waiting: 'Waiting for others to join…', invite: 'Send invite', copyLink: 'Copy link', end: 'End session', leave: 'Leave', inviteMsg: '📡 Come read the Old Testament guide with me!\nTap to join: {0}\nOr open the app, tap “📡 Together” and enter code {1}', following: 'Following the leader', paused: 'You scrolled · tap to return to the leader', connecting: 'Connecting…', hostChip: 'Room {0} · {1}', ended: 'Reading session ended', joined: 'Joined — your screen will follow the leader', noRtc: 'This browser cannot join a reading room. Please use Chrome or Safari.', loadErr: 'Could not load reading-together. Check your connection and try again.', badCode: 'Please enter the 6-digit room code', notFound: 'Room not found. Check the code, or ask the leader to open a new room.', hostOnly: 'You are leading', followOnly: 'You are following', back2: 'Back to leader', tip: 'Tip: the leader should keep the app open with the screen on so everyone stays in sync.', qrTip: 'Scan with a phone camera to join', btn: 'Together', joinedOne: 'Someone joined the room', hostLeft: 'The leader is offline for a moment — reconnecting…' }
  };
  function X(k) { var l = (typeof L === 'function' ? L() : 'zh'), s = (TX[l] || TX.zh)[k] || TX.zh[k] || k; for (var i = 1; i < arguments.length; i++) s = s.replace('{' + (i - 1) + '}', arguments[i]); return s; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ss(k, v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || 'null'); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  var loaded = {};
  function loadJs(urls, test, cb) {
    if (test()) { cb(true); return; } var i = 0;
    (function nx() {
      if (i >= urls.length) { cb(false); return; } var u = urls[i++];
      if (loaded[u]) { setTimeout(function () { cb(test()); }, 0); return; }
      var s = document.createElement('script'); s.src = u; s.async = true;
      s.onload = function () { loaded[u] = 1; if (test()) cb(true); else nx(); }; s.onerror = function () { nx(); };
      document.head.appendChild(s);
    })();
  }
  function hasRtc() { return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection); }

  /* ---------- 狀態 ---------- */
  var C = { role: '', code: '', peer: null, conns: [], host: null, last: null, retry: 0, rt: null, manualAt: 0, ptEl: null, status: '', want: null };
  function joinUrl(code) { return (typeof appUrl === 'function' ? appUrl() : location.origin + location.pathname) + '#/join/' + code; }
  function newCode() { var c = ''; for (var i = 0; i < 6; i++) c += Math.floor(Math.random() * 10); return c.charAt(0) === '0' ? '1' + c.slice(1) : c; }
  function live() { var o = []; for (var i = 0; i < C.conns.length; i++) if (C.conns[i].open) o.push(C.conns[i]); return o; }

  /* ---------- 帶領者 ---------- */
  function host(code, quiet) {
    if (!hasRtc()) { toast(X('noRtc')); return; }
    loadJs(PEER_JS, function () { return !!window.Peer; }, function (ok) {
      if (!ok) { toast(X('loadErr')); return; }
      teardown(); C.role = 'host'; C.code = code || newCode(); C.status = 'connecting'; ss('cr321', { r: 'host', c: C.code }); chip();
      var p = C.peer = new Peer(PFX + C.code, { debug: 0 });
      p.on('open', function () { C.retry = 0; C.status = 'ok'; chip(); if (!quiet) sheet(); snap(); });
      p.on('connection', function (c) {
        C.conns.push(c);
        c.on('open', function () { chip(); toast(X('joinedOne')); paintSheetCount(); if (C.last) try { c.send(C.last); } catch (e) { } });
        c.on('close', function () { drop(c); }); c.on('error', function () { drop(c); });
      });
      p.on('disconnected', function () { if (C.role === 'host' && !p.destroyed) setTimeout(function () { try { p.reconnect(); } catch (e) { } }, 1500); });
      p.on('error', function (e) {
        if (C.role !== 'host') return;
        if (e && e.type === 'unavailable-id') { if (C.retry++ < 25) { C.status = 'connecting'; chip(); clearTimeout(C.rt); C.rt = setTimeout(function () { host(C.code, true); }, 3000); } else { toast(X('loadErr')); end(); } return; }
        if (e && (e.type === 'network' || e.type === 'server-error' || e.type === 'socket-error' || e.type === 'socket-closed')) { clearTimeout(C.rt); C.rt = setTimeout(function () { if (C.role === 'host') host(C.code, true); }, 4000); }
      });
    });
  }
  function drop(c) { var o = []; for (var i = 0; i < C.conns.length; i++) if (C.conns[i] !== c) o.push(C.conns[i]); C.conns = o; chip(); paintSheetCount(); }
  function bcast(m) { if (C.role !== 'host') return; m.t = 'st'; m.ts = Date.now(); C.last = m; var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send(m); } catch (e) { } }

  /* 把畫面上的一句換成「區塊＋句序」定位（不同語言也對得上） */
  function blkEl(e) { var n = e; while (n && n !== document) { if (n.getAttribute && n.getAttribute('data-b') && /(^|\s)blk(\s|$)/.test(String(n.className))) return n; n = n.parentNode; } return null; }
  function where(e, hl) {
    var lp = window.LCUR, b = blkEl(e); if (!lp || !b || !R || !R.page || R.page.t !== 'read') return null;
    var ss2 = b.querySelectorAll('.sent'), k = 0; for (var i = 0; i < ss2.length; i++) if (ss2[i] === e) { k = i; break; }
    var m = { n: lp.n, b: b.getAttribute('data-b'), s: k, k: ss2.length, hl: hl ? 1 : 0, lg: L() };
    if (b.className.indexOf('scr') >= 0) { var p = e; while (p && p.previousSibling) { p = p.previousSibling; if (p.className === 'vn') { m.v = p.textContent; break; } } }
    return m;
  }
  function snap() {
    if (C.role !== 'host') return; var pg = R && R.page; if (!pg || pg.t !== 'read' || !window.LCUR) return;
    var els = typeof sentList === 'function' ? sentList() : [], mid = (window.innerHeight || 600) * .42, best = null, bd = 1e9;
    for (var i = 0; i < els.length; i++) { var r = els[i].getBoundingClientRect(); if (r.bottom < 60 || r.top > (window.innerHeight || 600)) continue; var d = Math.abs((r.top + r.bottom) / 2 - mid); if (d < bd) { bd = d; best = els[i]; } }
    var m = best ? where(best, false) : { n: LCUR.n, b: '', s: 0, k: 0, hl: 0 };
    if (m) bcast(m);
  }
  var scT = null;
  window.addEventListener('scroll', function () {
    if (C.role === 'host') { if (typeof spk !== 'undefined' && spk.on && !spk.paused) return; clearTimeout(scT); scT = setTimeout(snap, 350); }
  }, { passive: true });
  function userMove() { if (C.role === 'follow') { C.manualAt = Date.now(); chip(); } }
  window.addEventListener('touchmove', userMove, { passive: true }); window.addEventListener('wheel', userMove, { passive: true });

  /* ---------- 跟隨者 ---------- */
  function join(code) {
    code = String(code || '').replace(/\D/g, ''); if (code.length !== 6) { toast(X('badCode')); return; }
    if (!hasRtc()) { toast(X('noRtc')); return; }
    loadJs(PEER_JS, function () { return !!window.Peer; }, function (ok) {
      if (!ok) { toast(X('loadErr')); return; }
      teardown(); C.role = 'follow'; C.code = code; C.status = 'connecting'; C.first = true; C.misses = 0; ss('cr321', { r: 'follow', c: code }); chip(); closeHSheet();
      var p = C.peer = new Peer({ debug: 0 });
      p.on('open', function () { dial(); });
      p.on('disconnected', function () { if (C.role === 'follow' && !p.destroyed) setTimeout(function () { try { p.reconnect(); } catch (e) { } }, 1500); });
      p.on('error', function (e) {
        if (C.role !== 'follow') return;
        if (e && e.type === 'peer-unavailable') { C.misses++; if (C.first && C.misses >= 3) { toast(X('notFound')); leave(true); return; } C.status = 'connecting'; chip(); redial(4000); return; }
        redial(4000);
      });
    });
  }
  function redial(ms) { clearTimeout(C.rt); C.rt = setTimeout(function () { if (C.role === 'follow') dial(); }, ms || 3000); }
  function dial() {
    var p = C.peer; if (!p || p.destroyed || C.role !== 'follow') return;
    if (p.disconnected) { try { p.reconnect(); } catch (e) { } redial(3000); return; }
    try { if (C.host) C.host.close(); } catch (e) { }
    var c = C.host = p.connect(PFX + C.code, { reliable: true });
    var to = setTimeout(function () { if (!c.open && C.role === 'follow' && C.host === c) { try { c.close(); } catch (e) { } redial(1000); } }, 12000);
    c.on('open', function () { clearTimeout(to); C.misses = 0; C.lastRx = Date.now(); C.status = 'ok'; if (C.first) { C.first = false; toast(X('joined')); } chip(); });
    c.on('data', function (m) { C.lastRx = Date.now(); if (C.status !== 'ok') { C.status = 'ok'; chip(); } if (!m) return; if (m.t === 'st') apply(m); else if (m.t === 'end') leave(); });
    c.on('close', function () { clearTimeout(to); if (C.role === 'follow' && C.host === c) { C.status = 'lost'; chip(); redial(2500); } });
    c.on('error', function () { });
  }
  function apply(m) {
    C.want = m;
    var pg = R && R.page;
    if (!pg || pg.t !== 'read' || pg.n !== m.n) { if (typeof stopAll === 'function') stopAll(); open_({ t: 'read', n: m.n }); return; }
    point();
  }
  function findSent(m) {
    var root = document.getElementById('lesson'); if (!root || !m || !m.b) return null;
    var b = root.querySelector('[data-b="' + m.b + '"]'); if (!b) return null; var ss2 = b.querySelectorAll('.sent'); if (!ss2.length) return null;
    if (m.k === ss2.length && (m.lg === L() || (m.lg !== 'en' && L() !== 'en'))) return ss2[Math.min(m.s, ss2.length - 1)];
    if (m.v) { var vs = b.querySelectorAll('sup.vn'); for (var i = 0; i < vs.length; i++) if (vs[i].textContent === m.v) { var nx = vs[i].nextSibling; while (nx && !(nx.className && String(nx.className).indexOf('sent') >= 0)) nx = nx.nextSibling; if (nx) return nx; } }
    return ss2[Math.min(ss2.length - 1, Math.round(m.k > 1 ? m.s / (m.k - 1) * (ss2.length - 1) : 0))];
  }
  function clearPt() { var o = document.querySelectorAll('.co-now'); for (var i = 0; i < o.length; i++) o[i].className = o[i].className.replace(/\s*co-now/g, ''); }
  function point(force) {
    var m = C.want; if (C.role !== 'follow' || !m) return; var e = findSent(m);
    clearPt(); if (!e) return; if (m.hl) e.className += ' co-now';
    C.ptEl = e;
    if (force || Date.now() - C.manualAt > FOLLOW_COOL) {
      C.manualAt = 0; C.autoScroll = true; try { e.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (x) { e.scrollIntoView(); }
      clearTimeout(C.asT); C.asT = setTimeout(function () { C.autoScroll = false; chip(); }, 900);
    }
    chip();
  }

  /* 心跳：帶領者每 5 秒報平安；跟隨者 15 秒沒收到就重新連線（帶領者重新整理、切出 App 之後也接得回來） */
  setInterval(function () {
    if (C.role === 'host') { var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send({ t: 'hb' }); } catch (e) { } }
    else if (C.role === 'follow' && C.host && C.lastRx && Date.now() - C.lastRx > 15000) { C.lastRx = 0; C.status = 'lost'; chip(); dial(); }
  }, 5000);
  window.addEventListener('pagehide', function () { if (C.role === 'host') { var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send({ t: 'hb' }); } catch (e) { } } });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && C.role === 'follow' && C.status !== 'ok') dial(); if (!document.hidden && C.role === 'host' && C.peer && C.peer.disconnected) try { C.peer.reconnect(); } catch (e) { } });

  /* ---------- 結束 ---------- */
  function teardown() { clearTimeout(C.rt); try { if (C.peer) C.peer.destroy(); } catch (e) { } C.peer = null; C.conns = []; C.host = null; C.want = null; clearPt(); }
  function end() { var cs = live(); for (var i = 0; i < cs.length; i++) try { cs[i].send({ t: 'end' }); } catch (e) { }
    setTimeout(endNow, cs.length ? 300 : 0); }
  function endNow() { teardown(); C.role = ''; C.code = ''; C.last = null; ss('cr321', null); chip(); closeHSheet(); toast(X('ended')); }
  function leave(quiet) { teardown(); C.role = ''; C.code = ''; ss('cr321', null); chip(); closeHSheet(); if (!quiet) toast(X('ended')); }

  /* ---------- 畫面 ---------- */
  function chip() {
    var el = document.getElementById('crchip');
    if (!C.role) { if (el) el.parentNode.removeChild(el); return; }
    if (!el) { el = document.createElement('button'); el.id = 'crchip'; el.className = 'crchip'; el.onclick = function () { if (C.role === 'follow' && C.manualAt && C.ptEl) { point(true); return; } sheet(); }; document.body.appendChild(el); }
    var t, cls = 'crchip';
    if (C.role === 'host') t = C.status === 'ok' ? X('hostChip', C.code, live().length) : X('connecting');
    else if (C.status !== 'ok') { t = C.status === 'lost' ? X('hostLeft') : X('connecting'); cls += ' wait'; }
    else if (C.manualAt) { t = X('paused'); cls += ' off'; }
    else t = X('following');
    el.className = cls + (C.role === 'host' ? ' host' : ''); el.innerHTML = '<span class="dot"></span>📡 ' + E(t);
  }
  function qrInto(id, text) {
    loadJs(QR_JS, function () { return typeof window.qrcode === 'function'; }, function (ok) {
      var box = document.getElementById(id); if (!box || !ok) { if (box) box.style.display = 'none'; return; }
      try { var q = qrcode(0, 'M'); q.addData(text); q.make(); box.innerHTML = q.createImgTag(5, 10); } catch (e) { box.style.display = 'none'; }
    });
  }
  function paintSheetCount() { var e = document.getElementById('crcount'); if (e) { var n = live().length; e.textContent = n ? X('people', n) : X('waiting'); } }
  function sheet() {
    var h = '<div class="sheet-title">📡 ' + E(X('title')) + '</div>';
    if (C.role === 'host') {
      var u = joinUrl(C.code);
      h += '<div class="cr-k">' + E(X('code')) + '</div><div class="cr-code">' + E(C.code.slice(0, 3) + ' ' + C.code.slice(3)) + '</div>' +
        '<div class="cr-qr" id="crqr"></div><div class="xs muted center">' + E(X('qrTip')) + '</div>' +
        '<div class="cr-count" id="crcount"></div>' +
        '<div class="sheet-acts cr-acts"><button class="btn pri" data-act="crinvite">↗ ' + E(X('invite')) + '</button><button class="btn" data-act="crcopy">⧉ ' + E(X('copyLink')) + '</button></div>' +
        '<div class="xs muted cr-tip">' + E(X('tip')) + '</div>' +
        '<div class="sheet-acts" style="margin-top:10px"><button class="btn" data-act="crend">■ ' + E(X('end')) + '</button><button class="btn" data-act="hclose">' + E(T('close')) + '</button></div>';
      openHSheet(h); paintSheetCount(); qrInto('crqr', u); return;
    }
    if (C.role === 'follow') {
      h += '<div class="cr-k">' + E(X('followOnly')) + '</div><div class="cr-code">' + E(C.code.slice(0, 3) + ' ' + C.code.slice(3)) + '</div>' +
        '<div class="sheet-acts cr-acts"><button class="btn pri" data-act="crback">' + E(X('back2')) + '</button><button class="btn" data-act="crleave">' + E(X('leave')) + '</button></div>' +
        '<div class="sheet-acts" style="margin-top:10px"><button class="btn" data-act="hclose">' + E(T('close')) + '</button></div>';
      openHSheet(h); return;
    }
    h += '<div class="hl-tip cr-desc">' + E(X('desc')) + '</div>' +
      '<button class="btn pri block big" data-act="crhost">📡 ' + E(X('host')) + '</button>' +
      '<div class="cr-k" style="margin-top:16px">' + E(X('orJoin')) + '</div>' +
      '<div class="cr-join"><input id="crin" type="tel" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="' + E(X('codePH')) + '"><button class="btn pri" data-act="crjoin">' + E(X('join')) + '</button></div>' +
      '<div class="sheet-acts" style="margin-top:12px"><button class="btn" data-act="hclose">' + E(T('close')) + '</button></div>';
    var m = openHSheet(h), inp = document.getElementById('crin');
    if (inp) inp.onkeydown = function (e) { if (e.keyCode === 13) join(inp.value); };
  }
  document.addEventListener('click', function (e) {
    var n = e.target; while (n && n !== document && !(n.getAttribute && n.getAttribute('data-act'))) n = n.parentNode; if (!n || n === document) return;
    var a = n.getAttribute('data-act');
    if (a === 'crhost') { closeHSheet(); host(); }
    else if (a === 'crjoin') { var i = document.getElementById('crin'); join(i ? i.value : ''); }
    else if (a === 'crinvite') { shareText(X('inviteMsg', joinUrl(C.code), C.code)); }
    else if (a === 'crcopy') { copyText(joinUrl(C.code)); }
    else if (a === 'crend') end();
    else if (a === 'crleave') leave();
    else if (a === 'crback') { closeHSheet(); point(true); }
  }, false);

  /* ---------- 給 app.js 呼叫的接口 ---------- */
  window.CR = {
    on: function () { return !!C.role; },
    role: function () { return C.role; },
    sheet: sheet, join: join, host: host, end: end, leave: leave,
    label: function () { return X('btn'); },
    /* 帶領者：朗讀走到哪一句、點了哪一句 */
    mark: function (el) { if (C.role !== 'host' || !el) return; var m = where(el, true); if (m) bcast(m); },
    /* 每次閱讀頁畫好之後 */
    rendered: function () { if (C.role === 'host') setTimeout(snap, 120); else if (C.role === 'follow') { setTimeout(function () { point(true); }, 80); } chip(); },
    /* 跟隨者自己點畫線、捲動 */
    manual: function () { if (C.role === 'follow') { C.manualAt = Date.now(); chip(); } }
  };
  /* 重新整理後自動回到原本的共讀 */
  var keep = ss('cr321');
  if (keep && keep.c) setTimeout(function () { if (keep.r === 'host') host(keep.c, true); else join(keep.c); }, 600);
})();
