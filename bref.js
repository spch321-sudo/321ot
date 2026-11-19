/* 經文連結（bref.js，ES5）：課程內文與小智回答裡的經文出處（約翰福音 3:16、馬太福音 16:24–28、John 3:16…）
   自動變成連結，點一下在 App 內打開 321互動聖經，直接看那一章並用金色標明那一節（範圍整段標色）。
   「我的」頁有開關（預設開）。供 321truth／321soul／321ot 共用。 */
(function () {
  'use strict';
  if (window.BREF) return;
  var BOOKS = [["Genesis",50,["Kejadian","Genesis","Gen","창세기","创世记","創世記","Kej","창","创","創"]],["Exodus",40,["Keluaran","出エジプト記","Exodus","Exodo","出埃及記","출애굽기","出埃及记","Exo","Kel","Ex","出","출"]],["Leviticus",27,["Leviticus","Levitico","Imamat","利未记","レビ記","利未記","레위기","Lev","Im","레","利","レ"]],["Numbers",36,["Bilangan","Numbers","Numeros","民数記","Num","民数记","民數記","Bil","민수기","民","민"]],["Deuteronomy",34,["Deuteronomio","Deuteronomy","Ulangan","Deut","Deu","신명기","申命記","申命记","Ul","申","신"]],["Joshua",24,["Joshua","Yosua","ヨシュア記","Josue","约书亚记","Josh","여호수아","約書亞記","Yos","Jos","ヨシュ","수","書","书"]],["Judges",21,["Mga Maghuhukom","Hakim-hakim","Judges","Judg","Hak","사사기","士師記","士师记","Mag","삿","士"]],["Ruth",4,["Ruth","路得记","ルツ記","Rut","路得記","ルツ","룻기","룻","得"]],["1Samuel",31,["1 Samuel","1Samuel","サムエル記上","撒母耳记上","1 Sam","撒母耳記上","사무엘상","1Sam","サム上","撒上","삼상"]],["2Samuel",24,["2 Samuel","2Samuel","サムエル記下","2 Sam","撒母耳记下","撒母耳記下","사무엘하","2Sam","サム下","撒下","삼하"]],["1Kings",22,["1 Raja-raja","1Raja-raja","1 Mga Hari","1Mga Hari","1 Kings","1Kings","1 Har","1 Kgs","1 Raj","1Har","列王纪上","1Kgs","열왕기상","1Raj","列王紀上","왕상","王上"]],["2Kings",25,["2 Raja-raja","2Raja-raja","2 Mga Hari","2Mga Hari","2 Kings","2Kings","2 Raj","2 Kgs","2 Har","열왕기하","2Kgs","列王紀下","2Har","列王纪下","2Raj","王下","왕하"]],["1Chronicles",29,["1 Mga Cronica","1Mga Cronica","1 Chronicles","1Chronicles","1 Tawarikh","1Tawarikh","1 Cro","1 Taw","1 Chr","歴代志上","1Chr","历代志上","1Taw","歷代志上","1Cro","역대상","代上","대상"]],["2Chronicles",36,["2 Mga Cronica","2Mga Cronica","2 Chronicles","2Chronicles","2 Tawarikh","2Tawarikh","2 Chr","2 Taw","2 Cro","2Taw","2Cro","历代志下","歴代志下","歷代志下","2Chr","역대하","대하","代下"]],["Ezra",10,["Esdras","Ezra","以斯拉記","以斯拉记","エズラ記","Esd","Ezr","에스라","エズ","拉","스"]],["Nehemiah",13,["Nehemias","Nehemiah","Nehemia","ネヘミヤ記","尼希米记","느헤미야","尼希米記","Neh","ネヘ","느","尼"]],["Esther",10,["Esther","エステル記","Ester","以斯帖记","以斯帖記","에스더","Est","エス","斯","에"]],["Job",42,["Ayub","ヨブ記","約伯記","约伯记","Ayb","Job","욥기","ヨブ","욥","伯"]],["Psalms",150,["Mga Salmo","Psalms","Mazmur","Psalm","Mzm","Sal","Psa","Ps","시편","詩篇","诗篇","시","詩","诗"]],["Proverbs",31,["Mga Panultihon","Proverbs","Amsal","Prov","Ams","Pan","箴言","잠언","箴","잠"]],["Ecclesiastes",12,["Ecclesiastes","Pengkhotbah","Magwawali","伝道の書","Eccl","Magw","Pkh","전도서","传道书","傳道書","傳","전","伝","传"]],["SongofSolomon",8,["Song of Solomon","Awit ni Solomon","Song of Songs","Kidung Agung","Song","Awit","Kid","아가","雅歌","아","歌","雅"]],["Isaiah",66,["Isaias","Yesaya","Isaiah","以賽亞書","以赛亚书","イザヤ書","Isa","Yes","이사야","イザ","賽","사","赛"]],["Jeremiah",52,["Jeremiah","Jeremias","Yeremia","エレミヤ書","耶利米书","예레미야","耶利米書","Jer","Yer","エレ","렘","耶"]],["Lamentations",5,["Mga Pagbangotan","Lamentations","Ratapan","예레미야애가","耶利米哀歌","Pag","Lam","Rat","哀歌","哀","애"]],["Ezekiel",48,["Yehezkiel","Ezequiel","Ezekiel","エゼキエル書","Ezek","以西结书","以西結書","Eze","Yeh","에스겔","エゼ","겔","結","结"]],["Daniel",12,["Daniel","ダニエル書","但以理書","但以理书","다니엘","Dan","ダニ","但","단"]],["Hosea",14,["Oseas","Hosea","ホセア書","何西阿书","何西阿書","Hos","Ose","호세아","ホセ","何","호"]],["Joel",3,["Joel","Yoel","ヨエル書","约珥书","約珥書","요엘","Yl","ヨエ","珥","욜"]],["Amos",9,["Amos","阿摩司书","アモス書","阿摩司書","아모스","Amo","アモ","Am","암","摩"]],["Obadiah",1,["Obadias","Obadiah","俄巴底亚书","オバデヤ書","俄巴底亞書","Obaja","Obad","오바댜","Oba","Ob","オバ","옵","俄"]],["Jonah",4,["Yunus","Jonah","Jonas","ヨナ書","Yun","約拿書","Jon","约拿书","ヨナ","요나","욘","拿"]],["Micah",7,["Miqueas","Mikha","Micah","弥迦书","Mic","彌迦書","ミカ書","Miq","미가","Mi","ミカ","弥","미","彌"]],["Nahum",3,["Nahum","ナホム書","那鴻書","Nah","那鸿书","ナホ","나훔","鸿","鴻","나"]],["Habakkuk",3,["Habakkuk","Habakuk","ハバクク書","哈巴谷書","哈巴谷书","Hab","하박국","ハバ","哈","합"]],["Zephaniah",3,["Zephaniah","Zefanias","Zefanya","ゼパニヤ書","西番雅书","西番雅書","Zeph","스바냐","Zef","ゼパ","습","番"]],["Haggai",2,["Haggai","Hageo","Hagai","ハガイ書","Hag","哈該書","哈该书","학개","ハガ","학","該","该"]],["Zechariah",14,["Zechariah","Zakharia","Zacarias","撒迦利亞書","撒迦利亚书","ゼカリヤ書","Zech","스가랴","Zac","Za","ゼカ","亞","亚","슥"]],["Malachi",4,["Malaquias","Maleakhi","Malachi","瑪拉基書","玛拉基书","マラキ書","말라기","Mal","マラ","말","瑪","玛"]],["Matthew",28,["マタイによる福音書","Matthew","Matius","Mateo","마태복음","馬太福音","Matt","马太福音","マタイ","Mat","マタ","太","마"]],["Mark",16,["マルコによる福音書","Markus","Marcos","마가복음","馬可福音","Mark","马可福音","Mar","マルコ","Mrk","マコ","막","可"]],["Luke",24,["ルカによる福音書","Lukas","Lucas","Luke","누가복음","路加福音","Luc","Luk","ルカ","路","눅"]],["John",21,["ヨハネによる福音書","Yohanes","約翰福音","John","요한복음","Juan","约翰福音","ヨハネ","Yoh","ヨハ","요","約","约"]],["Acts",28,["Kisah Para Rasul","Mga Buhat","Acts","사도행전","使徒行傳","使徒行伝","使徒行传","Kis","Buh","행","徒","使"]],["Romans",16,["ローマ人への手紙","Romans","Roma","로마서","ローマ","羅馬書","Rom","罗马书","ロマ","羅","롬","罗"]],["1Corinthians",16,["1 Corinthians","1Corinthians","コリント人への第一の手紙","1 Korintus","1 Corinto","1Korintus","1Corinto","哥林多前书","哥林多前書","고린도전서","1 Cor","1 Kor","コリント","1Kor","1Cor","1コリ","고전","林前"]],["2Corinthians",13,["2 Corinthians","コリント人への第二の手紙","2Corinthians","2 Korintus","2 Corinto","2Korintus","2Corinto","고린도후서","哥林多後書","2 Cor","哥林多后书","2 Kor","2Kor","2Cor","2コリ","林後","林后","고후"]],["Galatians",6,["ガラテヤ人への手紙","Galatians","Galacia","Galatia","갈라디아서","加拉太书","ガラテヤ","加拉太書","Gal","ガラ","갈","加"]],["Ephesians",6,["Ephesians","エペソ人への手紙","Efesus","Efeso","以弗所书","에베소서","以弗所書","Eph","エペソ","Efe","エペ","Ef","弗","엡"]],["Philippians",4,["Philippians","ピリピ人への手紙","Filipos","Filipi","Filip","腓立比书","Phil","빌립보서","腓立比書","Flp","ピリピ","ピリ","빌","腓"]],["Colossians",4,["Colossians","コロサイ人への手紙","Colosas","Kolose","歌羅西書","골로새서","コロサイ","歌罗西书","Kol","Col","コロ","西","골"]],["1Thessalonians",5,["1 Thessalonians","1Thessalonians","テサロニケ人への第一の手紙","1 Tesalonika","1 Tesalonica","1Tesalonika","1Tesalonica","帖撒罗尼迦前书","1 Thess","데살로니가전서","帖撒羅尼迦前書","1Thess","テサロニケ","1 Tes","1Tes","1テサ","살전","帖前"]],["2Thessalonians",3,["2 Thessalonians","2Thessalonians","テサロニケ人への第二の手紙","2 Tesalonika","2 Tesalonica","2Tesalonika","2Tesalonica","2 Thess","데살로니가후서","帖撒羅尼迦後書","帖撒罗尼迦后书","2Thess","2 Tes","2Tes","2テサ","帖後","살후","帖后"]],["1Timothy",6,["1 Timotius","テモテへの第一の手紙","1Timotius","1 Timoteo","1 Timothy","1Timothy","1Timoteo","1 Tim","提摩太前書","디모데전서","提摩太前书","1Tim","1テモ","딤전","提前"]],["2Timothy",4,["テモテへの第二の手紙","2 Timotius","2Timotius","2 Timoteo","2 Timothy","2Timoteo","2Timothy","提摩太後書","디모데후서","提摩太后书","2 Tim","2Tim","2テモ","提后","提後","딤후"]],["Titus",3,["テトスへの手紙","Titus","Tito","디도서","Tit","提多書","提多书","テト","딛","多"]],["Philemon",1,["ピレモンへの手紙","Philemon","Filemon","Filem","Phlm","腓利门书","빌레몬서","腓利門書","Flm","ピレ","门","몬","門"]],["Hebrews",13,["ヘブル人への手紙","Hebrews","Hebreo","Ibrani","히브리서","希伯来书","希伯來書","ヘブル","Heb","Ibr","ヘブ","히","來","来"]],["James",5,["Santiago","Yakobus","ヤコブの手紙","James","Sant","야고보서","Yak","雅各書","雅各书","Jas","ヤコ","약","雅"]],["1Peter",5,["ペテロの第一の手紙","1 Petrus","1 Peter","1Petrus","1 Pedro","1Peter","1Pedro","1 Ped","베드로전서","1 Ptr","1 Pet","彼得前书","1Ped","1Pet","彼得前書","1Ptr","1ペテ","彼前","벧전"]],["2Peter",3,["ペテロの第二の手紙","2 Petrus","2 Peter","2Petrus","2 Pedro","2Pedro","2Peter","베드로후서","2 Pet","2 Ped","2 Ptr","2Pet","彼得後書","2Ped","彼得后书","2Ptr","2ペテ","彼后","彼後","벧후"]],["1John",5,["ヨハネの第一の手紙","1 Yohanes","1Yohanes","1 John","1 Juan","1John","1 Yoh","1Juan","约翰一书","約翰一書","요한일서","1Yoh","1 Jn","1Jn","1ヨハ","요일","约一","約一"]],["2John",1,["2 Yohanes","ヨハネの第二の手紙","2Yohanes","2 Juan","2 John","2Juan","2John","2 Yoh","約翰二書","요한이서","约翰二书","2 Jn","2Yoh","2ヨハ","2Jn","约二","約二","요이"]],["3John",1,["3 Yohanes","ヨハネの第三の手紙","3Yohanes","3 Juan","3 John","3 Yoh","3John","3Juan","3 Jn","約翰三書","约翰三书","3Yoh","요한삼서","3Jn","3ヨハ","約三","요삼","约三"]],["Jude",1,["ユダの手紙","Judas","Yudas","Jude","犹大书","유다서","Yud","Jud","猶大書","ユダ","猶","犹","유"]],["Revelation",22,["Revelation","Pinadayag","ヨハネの黙示録","요한계시록","Wahyu","Pin","啟示錄","Why","启示录","Rev","啟","黙","启","계"]]];
  var BIBLE = '/bible/';
  var KEY = 'xzbref.' + (location.pathname.replace(/[^A-Za-z0-9]+/g, '') || 'app');
  var SEL = '#lesson, .msg.ai .msg-body, .msg.ai .body';
  var TX = {
    zh: { t: '經文連結', d: '點課程與小智回答裡的經文出處，直接在互動聖經看那一節（並用顏色標明）。', on: '開', off: '關', open: '在互動聖經開啟', close: '關閉' },
    zs: { t: '经文链接', d: '点课程与小智回答里的经文出处，直接在互动圣经看那一节（并用颜色标明）。', on: '开', off: '关', open: '在互动圣经打开', close: '关闭' },
    en: { t: 'Scripture links', d: 'Tap a Bible reference in a lesson or Xiaozhi answer to read that verse in the Interactive Bible (highlighted).', on: 'On', off: 'Off', open: 'Open in Interactive Bible', close: 'Close' }
  };
  function L() { var l = (document.documentElement.getAttribute('data-lang') || document.documentElement.getAttribute('lang') || '').toLowerCase(); if (l === 'zs' || l === 'zh-hans') return 'zs'; if (l.slice(0, 2) === 'en') return 'en'; return 'zh'; }
  function T(k) { return (TX[L()] || TX.zh)[k]; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function isOn() { try { return localStorage.getItem(KEY) !== '0'; } catch (e) { return true; } }
  function setOn(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { } }

  var NAME = {}, list = [];
  BOOKS.forEach(function (b) { b[2].forEach(function (n) { if (!NAME[n]) { NAME[n] = b; list.push(n); } }); });
  list.sort(function (a, b) { return b.length - a.length; });
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var NUM = '(\\d{1,3})', SEP = '\\s*[:：]\\s*', RNG = '(?:\\s*[-–—~～至到]\\s*(\\d{1,3}))?';
  var RE = new RegExp('(' + list.map(reEsc).join('|') + ')\\s*(?:第\\s*)?' + NUM + '(?:' + SEP + NUM + RNG + '|\\s*(?:章|篇)(?:\\s*(?:第\\s*)?(\\d{1,3})\\s*(?:節|节)' + RNG + ')?)', 'g');
  var LATIN = /[A-Za-z]/, WORDC = /[A-Za-z0-9À-ɏ]/, OKPRE = /[\s(（\[「『【〔,，、;；:：.。—\-]/;
  var SKIP = 'a,button,textarea,input,select,code,pre,svg,.bref,.xzref,.lbl,.l-no,.topbar';

  function linkify(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), nodes = [], n;
    while ((n = w.nextNode())) { var p = n.parentNode; if (p && !(p.closest && p.closest(SKIP))) nodes.push(n); }
    nodes.forEach(function (t) {
      var s = t.nodeValue, m, last = 0, frag = null; RE.lastIndex = 0;
      while ((m = RE.exec(s))) {
        var name = m[1], b = NAME[name], pre = m.index > 0 ? s.charAt(m.index - 1) : '';
        if (!b) continue;
        if (LATIN.test(name.charAt(0)) && pre && WORDC.test(pre)) continue;
        if (name.length === 1 && pre && !OKPRE.test(pre) && !(m[3] && /[㐀-鿿가-힯]/.test(pre))) continue;
        var ch = +m[2], v = +(m[3] || m[5] || 0);
        if (!(ch >= 1 && ch <= b[1])) continue;
        if (b[1] === 1 && !m[3] && !m[5]) continue;
        if (!m[3] && !m[5] && !/[章篇]$/.test(m[0])) continue;
        if (!frag) frag = document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var a = document.createElement('a'); a.className = 'bref'; a.href = 'javascript:void 0';
        a.setAttribute('data-b', b[0]); a.setAttribute('data-c', ch); if (v) a.setAttribute('data-v', v);
        var v2 = +(m[4] || m[6] || 0); if (v && v2 > v && v2 - v < 60) a.setAttribute('data-v2', v2);
        a.textContent = m[0]; frag.appendChild(a); last = m.index + m[0].length;
      }
      if (frag) { if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last))); t.parentNode.replaceChild(frag, t); }
    });
  }
  function unlink() {
    var as = document.querySelectorAll('a.bref'), i, p;
    for (i = 0; i < as.length; i++) { p = as[i].parentNode; if (!p) continue; p.replaceChild(document.createTextNode(as[i].textContent), as[i]); p.normalize(); }
    var cs = document.querySelectorAll('[data-bref]'); for (i = 0; i < cs.length; i++) cs[i].removeAttribute('data-bref');
  }
  var busy = false, tm = 0, mo = null;
  function scan() {
    tm = 0; if (!isOn()) return;
    var cs = document.querySelectorAll(SEL); busy = true;
    try {
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i]; if (c.querySelector('.typing')) continue;
        var sig = c.textContent.length + ':' + c.childNodes.length;
        if (c.getAttribute('data-bref') === sig) continue;
        linkify(c); c.setAttribute('data-bref', c.textContent.length + ':' + c.childNodes.length);
      }
    } catch (e) { }
    busy = false;
  }
  function later() { if (busy || tm) return; tm = setTimeout(scan, 350); }

  var CSS = '.l-ref a.bref::before{content:"📖 "}' + 'a.bref{color:var(--accent,#1E3F8F);text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;cursor:pointer;font-weight:600}' +
    '#brMask{position:fixed;inset:0;z-index:2147482000;background:rgba(10,20,40,.45);display:flex;align-items:flex-end;justify-content:center}' +
    '#brMask .br-sh{width:100%;max-width:720px;height:calc(100% - 46px - env(safe-area-inset-top,0px));background:var(--page,#fff);border-radius:18px 18px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -8px 30px rgba(0,0,0,.25)}' +
    '#brMask .br-hd{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(0,0,0,.08);font-weight:800;font-size:17px;color:var(--ink,#1D1F24)}' +
    '#brMask .br-hd b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#brMask .br-hd a,#brMask .br-hd button{font-size:14px;font-weight:700;padding:7px 11px;border-radius:999px;border:1px solid rgba(0,0,0,.12);background:transparent;color:inherit;text-decoration:none;white-space:nowrap}' +
    '#brMask iframe{flex:1;width:100%;border:0;background:#fff}';
  function css() { if (document.getElementById('brcss')) return; var s = document.createElement('style'); s.id = 'brcss'; s.appendChild(document.createTextNode(CSS)); document.head.appendChild(s); }
  function closeSheet() { var m = document.getElementById('brMask'); if (m && m.parentNode) m.parentNode.removeChild(m); }
  function openRef(a) {
    var b = a.getAttribute('data-b'), c = a.getAttribute('data-c'), v = a.getAttribute('data-v'), v2 = a.getAttribute('data-v2');
    var l = L(), url = BIBLE + '?lang321=' + (l === 'zs' ? 'zs' : (l === 'en' ? 'en' : 'zh')) + (v ? '&hl=1' + (v2 ? '&hv2=' + v2 : '') : '') + '#/read/' + b + '/' + c + (v ? '/' + v : '');
    closeSheet(); css();
    var m = document.createElement('div'); m.id = 'brMask';
    m.innerHTML = '<div class="br-sh" role="dialog" aria-modal="true"><div class="br-hd"><b>📖 ' + esc(a.textContent) + '</b><a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(T('open')) + ' ↗</a><button type="button" data-br="close">' + esc(T('close')) + '</button></div><iframe src="' + esc(url) + '" title="' + esc(a.textContent) + '" allow="autoplay; clipboard-write"></iframe></div>';
    m.addEventListener('click', function (e) { if (e.target === m || (e.target.getAttribute && e.target.getAttribute('data-br') === 'close')) closeSheet(); });
    document.body.appendChild(m);
  }
  window.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a.bref') : null;
    if (a) { e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); openRef(a); return; }
    var sw = e.target && e.target.closest ? e.target.closest('[data-brset]') : null;
    if (sw) {
      e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      var on = sw.getAttribute('data-brset') === '1'; setOn(on);
      var bs = document.querySelectorAll('[data-brset]'); for (var i = 0; i < bs.length; i++) bs[i].className = ((bs[i].getAttribute('data-brset') === '1') === on) ? 'on' : '';
      if (on) scan(); else unlink();
    }
  }, true);

  function settingHtml() {
    var on = isOn();
    return '<div class="card" id="brCard"><p class="eyebrow">' + esc(T('t')) + '</p><div class="xs muted" style="margin-bottom:8px">' + esc(T('d')) + '</div>' +
      '<div class="seg"><button class="' + (on ? 'on' : '') + '" data-brset="1">' + esc(T('on')) + '</button><button class="' + (on ? '' : 'on') + '" data-brset="0">' + esc(T('off')) + '</button></div></div>';
  }
  function start() {
    try { mo = new MutationObserver(function () { if (!busy) later(); }); mo.observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (e) { }
    later();
  }
  window.BREF = { settingHtml: settingHtml, scan: scan, isOn: isOn, linkify: linkify, RE: RE, NAME: NAME };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
