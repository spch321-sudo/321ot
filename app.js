/* 321舊約導讀 · 主程式（ES5，給 WPS／舊 WebView 也能跑） */
var APPVER = '2026.1102.164546-ws24';
var SVC = { xz: 'https://xiaozhi-proxy.spch321.workers.dev', tts: 'https://azure-tts.spch321.workers.dev', model: 'claude-sonnet-4-6' };
var VOICES = { zh: ['zh-TW-YunJheNeural', 'zh-CN-Yunfan:DragonHDLatestNeural', 'zh-CN-Xiaochen:DragonHDLatestNeural'], en: ['en-US-AndrewNeural', 'en-US-AvaNeural', 'en-US-BrianNeural'], zs: ['zh-CN-Yunfan:DragonHDLatestNeural', 'zh-CN-Xiaochen:DragonHDLatestNeural', 'zh-TW-YunJheNeural'] };
var EPOCH = [2026, 9, 31];
var LSK = 'ot321_v1';
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function now() { return new Date().getTime(); }
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function pad(n) { return pad2(n); }
function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function fmtDate(ts) { var d = new Date(ts); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
function defState() {
  return { lang: 'zh', set: { font: 1, theme: '', human: true, voice: 0, rate: 0, aud: 'adult' }, hl: {}, chat: [], fav: [], card: { tpl: 'navy', size: 't', border: 'classic', fs: 1, to: '', top: '', sign: '' }, read: {}, star: {}, note: {}, last: 0, medal: {}, seen: 0 };
}
var S = (function () {
  var d = defState(), x = null; try { x = JSON.parse(localStorage.getItem(LSK) || 'null'); } catch (e) { }
  if (!x || typeof x !== 'object') return d;
  for (var k in d) if (x[k] == null || typeof x[k] !== typeof d[k]) x[k] = d[k];
  for (var j in d.set) if (x.set[j] == null) x.set[j] = d.set[j];
  for (var c in d.card) if (x.card[c] == null) x.card[c] = d.card[c];
  if (x.lang !== 'zh' && x.lang !== 'zs' && x.lang !== 'en') x.lang = 'zh';
  if (!(x.chat instanceof Array)) x.chat = []; if (!(x.fav instanceof Array)) x.fav = [];
  return x;
})();
function save() { try { localStorage.setItem(LSK, JSON.stringify(S)); } catch (e) { } }
function L() { return S.lang || 'zh'; }
function dl() { return L() === 'zs' ? 'zs' : (L() === 'en' ? 'en' : 'zh'); }
var I18N = { zh: {"hlTitle":"這一句","hlColor":"顏色","hlSpan":"範圍","spanUnit":"{0} 句","spanP":"整段","hlNotePH":"寫下默想……","save":"儲存","makeCard":"做成美圖","readThis":"朗讀","copy":"複製","share":"分享","hlDel":"刪除畫線","spanIsP":"這一段已經整段畫起來了","spanDoneP":"已畫整段，共 {0} 句","hlAdded":"已畫線，再點一下可換色、寫默想、做美圖","noHl":"還沒有畫線。讀導讀時點一下任何一句就能畫線。","noFav":"還沒有收藏。小智的回答按 ★ 就能收藏。","ttsErr":"這台裝置不支援朗讀","ttsPaused":"已暫停","ttsFallback":"改用裝置內建語音","xzFormat":" 回答格式：需要並列或對照時可以用 markdown 表格；用簡短的小標題（####）與條列分段；請把最重要的一句用「> 」標成引言，那一句會被做成美圖。不要用程式碼區塊或念不出來的裝飾符號。若寫到禱告，結尾一律用「奉主耶穌的名禱告，阿們」。","thinking":"小智思考中……","favB":"收藏","chatErr":"小智暫時連不上，請稍後再試","xzReplied":"小智回覆了","xzExamples":"不知道問甚麼？看看範例","studioT":"經文美圖","saveImg":"存到相簿","cTpl":"版型","cSize":"尺寸","sz916":"直式 9:16","sz45":"直式 4:5","szSq":"方形","szWide":"橫式","cBorder":"邊框","bd_classic":"古典雙框","bd_corner":"雅緻角飾","bd_inline":"內斂細線","bd_dots":"珠鏈點框","bd_ornate":"華麗花角","bd_none":"無邊框","cFs":"字級","cfs0":"小一點","cfs1":"標準","cfs2":"大","cfs3":"特大","cfs4":"超大","cPhoto":"背景相片","pickPhoto":"從相簿選","pexels":"免費圖庫","noPhoto":"移除相片","cText":"經文／金句","cRef":"出處","cNote":"領受（可留空）","cNotePH":"寫下你的領受……","cTo":"送給（可留空）","cToPH":"例如：親愛的媽媽","cTop":"團體名稱","cSignL":"落款","photoBad":"這張相片讀不進來，換一張試試","holdT":"長按圖片存到相簿","holdS":"長按下面的圖片，選「加入照片」就會存進相簿。","close":"關閉","saveIOS":"在分享面板選「儲存影像」就會存進相簿","savedFile":"已下載圖片","pexelsT":"Pexels 免費圖庫","pxPH":"想找甚麼樣的畫面……","search":"搜尋","more":"再多一些","pxHint":"照片來自 Pexels，免費可商用。挑一張當背景，字會自動壓上一層遮罩。","pxNone":"找不到相符的照片，換個字試試","pxErr":"連不上圖庫","pxLoading":"下載照片中……","pxPicked":"已選好這張照片","tplNavy":"深藍聖夜","tplPaper":"素樸信箋","tplDawn":"晨曦盼望","tplGrace":"青草安歇","tplRose":"溫柔玫瑰","tplSky":"平安晴空","tplLinen":"素雅棉麻","tplNight":"深夜星光","tplPlain":"純白簡潔","hlTip":"點一下任何一句就能畫線；再點一次可換顏色、寫默想、問小智、朗讀或做成美圖。","fHl":"畫線","fFav":"收藏","favSaved":"已收藏","delHl":"刪除這條畫線？","cardBless":"願神賜福你！","fellowshipName":"國度321空中團契","lessonRef":"{0}〈{1}〉","makeCardV":"經文美圖","readPage":"從這裡朗讀","xzCtxChip":"正在上：{0}","xzAboutHl":"我在舊約導讀畫了這一句：\n{0}\n——{1}\n{2}請幫我更明白，並告訴我在生活中怎樣活出來。","foldMore":"展開全文 ▾","foldLess":"收合 ▴","foldAll":"把所有長回答收合起來","foldAllB":"收合","foldedAll":"已收合所有長回答","foldNone":"目前沒有需要收合的回答","updating":"更新到最新版本中…","hardUpd":"強制更新","say_1":"先來讀經文。","say_2":"接下來聽一段短講。","say_3":"接下來想一想。","say_4":"接下來開口說，一起禱告。","say_5":"最後，付諸行動。","xzGoOn":"（剛才的回答因字數上限中斷了。請從中斷的地方直接接著寫完，不要重複前面的內容，也不要加開場白或說明。）","xzCont":"小智還在接著寫…","appName":"321舊約導讀","back":"返回","copied":"已複製","retry":"再試一次","loading":"載入中……","loadErr":"內容讀不到，請確認網路後再試一次。","saved":"已儲存","reading":"朗讀中","tHome":"今日","tList":"目錄","tXz":"小智","tMe":"我的","fonts":"小|標準|大|特大|超大","fontB":"調整字級","gNight":"夜深了，願主賜你安睡","gMorning":"早安，願主今天與你同行","gNoon":"午安，停下來讀一章舊約導讀","gAfter":"午後好，讓神的話再充滿你","gEve":"晚安，用神的話為今天收尾","wdays":"星期日|星期一|星期二|星期三|星期四|星期五|星期六","dateFmt":"{0} 月 {1} 日・{2}","todaySnack":"今日導讀","noFmt":"第 {0} 章","readNow":"開始閱讀","listen":"朗讀","listenAll":"朗讀全章","readDone":"今天已讀","stRead":"已讀／共 {0} 章","stStreak":"連續天數","stStar":"收藏","stMedal":"獎章","contRead":"繼續讀下一章","randSnack":"隨機一章","askXzT":"問小智","myMarks":"我的畫線","creedH":"落實 321","creed3":"三個基礎：耶穌是我的榜樣・聖經是我的準則・聖靈是我的引導","creed2":"兩個核心：讓耶穌作王・讓耶穌得著一切的榮耀","creed1":"一個目的：建立屬神的體系","fTag":"每天線上同讀神的話，一起活出基督的生命","nextMeeting":"下一堂聚會","mtMorning":"晨讀321","mtNoon":"午修靈糧","mtNight":"晚禱","joinNow":"一鍵加入聚會（Zoom）","zoomId":"會議號碼 {0}　密碼 {1}","mtTimes":"聚會時間","monSat":"週一至週六","monFri":"週一至週五","twTime":"（台北時間）","localNote":"上方「下一堂聚會」已自動換算成你手機所在地的時間。","liveNow":"正在聚會，現在就能加入","cdFmt":"還有 {0}{1}開始","hrs":"{0} 小時 ","mins":"{0} 分鐘","giveT":"奉獻支持","giveNote":"感謝你用奉獻一同建立屬神的體系。以下是各地的奉獻帳戶：","giveCN":"中國地區請用微信支付，QR 碼在團契 App 的奉獻頁。","fApp":"團契 App","searchPH":"搜尋書卷、章、主題……","fullSearch":"全文搜尋","fAll":"全部","fUnread":"未讀","fRead":"已讀","fStar":"收藏","segAll":"全部書卷","nItems":"共 {0} 章","fullOn":"（含全文比對結果）","noMatch":"找不到相符的章，換個關鍵字試試。","typeFirst":"先輸入想找的字詞","searching":"正在搜尋全部內文……","fullDone":"全文搜尋完成，找到 {0} 章","askXz":"問小智","starB":"收藏","starred":"已收藏這一章","sScr":"經文","sMsg":"導讀","sApp":"上帝的教導","sMed":"應用題目","sPray":"一起禱告","sDecl":"信心宣告","sayScr":"先來讀今天的經文，{0}。","sayMsg":"接下來是這一章的導讀。","sayApp":"接下來，看看上帝在這段經文中的教導。","sayMed":"接下來，用應用題目來省察自己。","sayPray":"讓我們一起禱告。","sayDecl":"最後，憑信心一起宣告。","myAns":"寫下我的回應……（只存在這支手機）","declSay":"一起宣告","declLead":"請跟著一起，憑信心宣告：","markDone":"讀完了，記錄今天","readDoneAt":"已讀（{0}），再點一下可取消","undoDone":"要取消這一章的已讀記錄嗎？","doneToast":"記下來了！連續 {0} 天與神的話相遇","quizMe":"考考我：小智出題","quizT":"考考我","quizMaking":"小智正在依這一章出題……","quizErr":"小智暫時出不了題","quizScore":"答對 {0} / {1} 題","quizG":"太棒了！真理已經放進你心裡。","quizM":"很好！再讀一次會更清楚。","quizL":"沒關係，回去再讀一遍，神的話會越嚼越香。","quizAgain":"再出一組題目","backToL":"回到這一章","quizRight":"答對了！","quizWrong":"再想想，正確答案已標出來。","quizNext":"下一題","quizSee":"看成績","quizSys":"你是「小智」，國度321空中團契的聖經陪讀，要依照提供的靈修短文出單選題，幫助讀者記住真理並活出來。只回傳 JSON，不要任何說明或程式碼圍欄。格式：{\"q\":[{\"q\":\"題目\",\"o\":[\"選項A\",\"選項B\",\"選項C\",\"選項D\"],\"a\":正確選項序號(從0起),\"e\":\"一句解析\"}]}。出 4 題：題目清楚明確、一看就懂；答案必須能直接從經文或短文找到，不超出內容、不考冷僻細節；由易到難，涵蓋經文事實、神是怎樣的神，最後一題是生命應用；每題只問一件事；4 個選項長短相近、只有一個正確；一律用繁體中文。","quizAsk":"請依下面這一章舊約導讀出題：","medalT":"已讀 {0} 章，得到獎章！","medalAll":"全部讀完了！得勝者獎章","medalP0":"神的話是腳前的燈、路上的光，繼續一章一章讀下去！","medalP1":"一天一點，生命就一點一點被更新。","medalP2":"你正在被建造，越來越像耶穌！","amen":"阿們！","medalLock":"尚未得到","myNotes":"我的默想筆記","myStars":"收藏的章","myMedals":"讀經獎章","noNotes":"還沒有默想筆記。讀導讀時，在「應用題目」下面寫下回應就會出現在這裡。","setRead":"閱讀字級","setTheme":"外觀","themes":"自動|明亮|米黃護眼|深色","setLang":"語言","setVoice":"朗讀聲音","vHuman":"真人語音","vDevice":"手機內建","voiceWho":"選一位朗讀者","voiceNames":"雲哲（台灣）|雲帆|曉辰","voiceRate":"語速","rates":"很慢|慢|標準|快|很快","voiceTest":"試聽","voiceSample":"你們要先求他的國和他的義，這些東西都要加給你們了。","audT":"小智的回答對象","auds":"🧑 成人|🧒 青少年|🧸 兒童|🌱 慕道友|👴 長輩|👩‍👧 單親|🙋 單身|👨‍👩‍👧 父母|💑 夫妻|⛪ 牧者","audNow":"回答對象：{0}　▾","audSet":"小智會用「{0}」聽得懂的方式回答","audD_adult":"有深度，貼近工作、家庭與關係","audD_teen":"幽默風趣、不說教，用你的世界來比喻","audD_kid":"非常簡單好懂，像在聽故事","audD_seeker":"還沒信主也聽得懂，不說教，給實際的幫助","aud_adult":"【回答對象】成年讀者：口吻成熟、溫暖、真誠。","aud_teen":"【回答對象】青少年：像朋友聊天，幽默風趣，可以有一點梗，但不說教、不輕浮，也絕不拿神和聖經開玩笑。","aud_kid":"【回答對象】兒童（5–11 歲）：非常淺顯，短句，像說故事，一句只講一件事，不用艱深名詞。","aud_seeker":"【回答對象】慕道友（還沒信主的朋友）：從他的處境與疑問切入，再帶到經文；用最平常的話，不用「無己、作王、得勝、屬靈」等教會內部用語，必須用的詞立刻用生活說法解釋；誠實、尊重、不說教、不施壓、不要求現在就相信；清楚說出神是怎樣的神、耶穌為我們做了什麼；給一兩個這星期就能試的小步驟；禱告只當作「若你願意，可以這樣對神說」的邀請。","offT":"離線閱讀","offD":"把全部章節下載到手機，沒有網路也能讀。","offB":"下載全部章節","offDone":"全部章節都已存到手機，可離線閱讀","bkT":"備份與還原","bkOut":"匯出備份","bkIn":"從備份還原","bkDone":"已匯出備份檔","bkAsk":"要用這份備份取代目前手機上的畫線、筆記與閱讀記錄嗎？","bkBad":"這不是舊約導讀的備份檔","verT":"版本與更新","checkUpd":"檢查更新","newVer":"已有新版本，點這裡立即更新","upToDate":"已經是最新版本","netErr":"連不上網路，請稍後再試","installB":"加到主畫面","installHow":"iPhone：用 Safari 打開，點下方「分享」⬆，再選「加入主畫面」。\nAndroid：用 Chrome 打開，點右上「⋮」，選「安裝應用程式」或「加到主畫面」。","blankVerse":"你的話是我腳前的燈，是我路上的光。","blankRef":"詩篇 119:105","xz":"小智","t_xz_d":"陪你一起讀舊約的屬靈同伴","xzNew":"新對話","xzPh":"想問小智什麼？","send":"送出","xzHi":"平安！我是小智，陪你一章一章讀舊約。可以問我經文的背景、人物、神的心意，以及今天怎麼活出來，或請我陪你禱告。","xzNote":"小智是陪讀的小幫手，不是聖靈，也不取代教會的牧養；重要的事請和屬靈長輩一起禱告尋求。","xzOffline":"目前沒有網路，小智暫時無法回答。","xzFail":"小智連不上","delConfirm":"要清空這段對話嗎？","xzQuick":"神是怎樣的神？請用今天這章導讀告訴我|今天的經文，我舊人有己的地方會怎麼反應？|如果我讓耶穌作王，今天會怎麼做？|耶穌在這件事上給我怎樣的榜樣？|聖靈今天可能引導我跨出哪一小步？|我失敗的根源，是驕傲還是恐懼？|怎樣在關係中操練無己？|這章導讀可以用在我和誰的關係上？|這和主禱文「願你的國降臨」有什麼關聯？|請用一個比喻，說出今天這章的核心","askLesson":"請幫我更深明白舊約導讀〈{0}〉——{1}：這一章的核心是什麼？神在這裡顯明了什麼？我今天可以怎麼活出來？","xzCtx":"【讀者正在讀】舊約導讀・{0}〈{1}〉，經文：{2}。\n經文內容：{3}\n導讀摘要：{4}","xzSys":"你是「小智」，國度321空中團契的屬靈同伴與聖經陪讀，陪讀者細嚼「舊約導讀」每日靈修短文。以321理念回應：三個基礎（耶穌是我的榜樣、聖經是我的準則、聖靈是我的引導）、兩個核心（讓耶穌作王、讓耶穌得著一切的榮耀）、一個目的（建立屬神的體系）；幫助讀者看見舊人有己、以自己為中心的驕傲，經歷福音使人無己、讓耶穌在裡面活；由內而外改變觀念、生命、生活、關係、事工；焦點在耶穌，不在自己、別人或環境。深入淺出、善用比喻、條理清晰、溫暖真誠；引用聖經一律用和合本；回答簡明，一律用繁體中文。","prayRule":"\n【禱告的寫法（一定要照做）】回答裡凡要寫禱告，那一段的小標題一律寫「憑信心禱告」，不要寫「為你禱告」「我為你禱告」或「一起禱告」。禱告前先用一句話邀請讀者自己開口，例如「請你憑信心，親口向主這樣禱告：」。禱告本身要用讀者的第一人稱，寫成讀者自己向神說的話；不要寫成小智替讀者禱告，不要出現「這位」「他／她」等第三人稱。禱告要簡短、真誠、帶著信心交託與感恩，結尾一律用「奉主耶穌的名禱告，阿們。」","fu_adult":"💑 用在婚姻~請把你剛才的回答，用在夫妻關係裡，給我一個具體做法。|🏠 用在家庭~請把你剛才的回答，用在和家人的相處上。|💼 用在職場~請把你剛才的回答，用在職場與同事相處上。|💗 我的內心~如果我心裡還在掙扎，你剛才的回答可以怎樣幫助我？|🙏 帶我禱告~請依你剛才的回答，帶我憑信心禱告。","fu_teen":"🏫 在學校~把你剛才說的，用在學校和同學身上會怎樣？|👫 跟朋友~跟朋友相處時，我可以怎麼做？|📱 手機網路~這和我用手機、上網有什麼關係？|💪 今天挑戰~給我一個今天就能做的小挑戰。|🙏 一起禱告~請用簡單的話帶我禱告。","fu_kid":"🏠 在家裡~在家裡我可以怎麼做？|🏫 在學校~在學校我可以怎麼做？|📖 說個故事~可以用一個小故事告訴我嗎？|🙏 小禱告~教我一句小小的禱告。","fu_seeker":"🤔 我還有疑問~我還是有些疑問，可以再用平常的話解釋嗎？|🚶 下一步~如果我想多了解，這個星期可以先做什麼？|💭 人生意義~這和我人生的意義有什麼關係？|🙏 試著禱告~如果我想試著和神說話，可以怎麼說？","watchVid":"觀看這一集影片","findVid":"到 YouTube 看這一集","ymT":"建立影片對照表","ymD":"這個工具會讀取「舊約導讀」YouTube 播放清單裡的每一支影片，依影片標題中的「舊約導讀＋編號」自動配對到每一章。整個過程約 2～4 分鐘，請保持這個畫面開著。","ymGo":"開始建立","ymLoading":"正在讀取播放清單……","ymGot":"已讀到 {0} 支影片……","ymTitles":"正在核對影片標題，剩 {0} 支（已配對 {1} 章）……","ymErr":"讀不到播放清單，請確認網路後再試一次。","ymDone":"完成：共 {0} 支影片，配對到 {1} 章。","ymMiss":"還沒有影片的章號（{0} 章）：","ymSend":"請按「複製」，回到和 Claude 的對話貼上送出，影片就會永久加到每一章。","bkzs":"","bgKeys":"none|buddhism|folk|yiguandao|muslim|atheist","bgs":"🌱 沒有信仰|☸️ 佛教|🏮 民間信仰|🕯️ 一貫道|☪️ 穆斯林|🔬 無神論","bgNames":"沒有信仰|佛教|民間信仰|一貫道|穆斯林|無神論者","bgT":"信仰背景：","lenT":"長度：","lens":"簡要|適中|詳細","optSum":"{0}　·　{1}　·　{2}","optSumSk":"{0}　·　{1}　·　{2}","optTog":"回答選項","lenSet":"小智接著用「{0}」重新回答","lenSet2":"已改為「{0}」，下次提問就會照這個長度回答","bgSet":"小智接著以「{0}」的角度重新回答","bgSet2":"已改為「{0}」，下次提問就會照這個角度回答","lenSys_brief":"\n【回答長度：簡要】只用3～5句話，約150字：先給核心答案，加上一句經文或一個比喻，最後一句禱告或一個小步驟；不用表格，不列長清單。","lenSys_full":"\n【回答長度：詳細】約800～1200字：說明經文脈絡、關鍵字詞、相關經文對照，連結321應用與本週操練，最後寫禱告；可使用短小的標題。","skbg_none":"\n【信仰背景：沒有信仰】不預設任何宗教詞彙，從對方的生活處境（壓力、關係、意義、不安）切入；一次只講一個重點，用日常說法，避免「無己、作王、得勝」等內部用語。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到今天這章導讀。","skbg_buddhism":"\n【信仰背景：佛教】不貶低佛陀與修行，不使用「拜偶像、迷信」等字眼；先肯定佛教對苦、無常、慈悲的重視，再說明聖經所說有位格的創造主、白白的恩典（不靠功德）、一世生命而非輪迴；不亂用佛教名詞。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到今天這章導讀。","skbg_folk":"\n【信仰背景：民間信仰】尊重孝心與祭祖的心意，先肯定聖經本來就教導孝敬父母；再說明敬拜歸給獨一真神；關心拜拜背後對平安與保佑的需要，並溫和說明祭祖與追思的不同；不要求對方立刻改變家人的習慣。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到今天這章導讀。","skbg_yiguandao":"\n【信仰背景：一貫道】尊重吃素與重視倫理的生活，不批評師尊、道場與儀式，也不自己推斷教義細節；從對「天」的敬畏談起，再溫和說明約翰福音14:6，耶穌是通往天父的道路。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到今天這章導讀。","skbg_muslim":"\n【信仰背景：穆斯林】以最大的敬意對談，不辱罵、不嘲諷、不施壓勸對方改教（考慮其家庭與社群的代價）；從獨一的神，以及亞伯拉罕、摩西、大衛談起；只引用聖經；清楚說明基督徒信的不是三個神；可比較「靠行為得救」與「靠恩典得救」；避免使用與豬肉、酒有關的比喻。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到今天這章導讀。","skbg_atheist":"\n【信仰背景：無神論者】尊重理性與證據，不說「只要信就好」，不把對方的想法稻草人化；誠實承認對苦難與宗教歷史錯誤的質疑很有分量，也承認哪些事無法用科學證明；從道德直覺、人生意義、宇宙秩序與耶穌的歷史記載談起；語氣平等、好奇、不防衛。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到今天這章導讀。","q_sk_none":"我不信神，為什麼還要看這章？|這章對我的壓力有什麼幫助？|我怎麼知道神是真的？|耶穌到底是誰？|我可以先從哪一小步試試看？|人生的意義到底在哪裡？","q_sk_buddhism":"佛教講慈悲，和這章的愛有什麼相同？|基督徒怎麼看輪迴與因果？|為什麼說得救不靠功德？|基督教的神和佛有什麼不同？|我敬重佛法，也可以認識耶穌嗎？|這章對「苦」有什麼看法？","q_sk_folk":"拜拜和敬拜神有什麼不同？|基督徒可以孝敬祖先嗎？|不拜拜，平安從哪裡來？|家人拜拜，我可以怎麼相處？|這章怎麼談保佑與平安？|祭祖和追思差在哪裡？","q_sk_yiguandao":"吃素和信耶穌有衝突嗎？|這章怎麼談對天的敬畏？|耶穌為什麼說祂是道路？|我重視倫理，聖經怎麼說？|基督徒怎麼看修行？|我可以怎麼進一步認識聖經？","q_sk_muslim":"聖經和古蘭經對神有什麼相同看法？|基督徒信的是三個神嗎？|為什麼說耶穌是神的兒子？|得救是靠行為還是恩典？|這章如何談神的慈愛與公義？|我可以怎麼認識聖經裡的耶穌？","q_sk_atheist":"沒有科學證據，為什麼要信？|如果神是愛，世上為什麼有苦難？|宗教歷史上的錯誤怎麼看？|耶穌復活有什麼歷史根據？|道德從哪裡來？|這章有什麼可以用理性檢驗的地方？","audNowS":"回答對象：{0} ▾","audD_elder":"尊敬溫和、慢慢說，句子清楚好懂","audD_single_parent":"先接住你的辛苦，給做得到的小步驟與盼望","audD_single":"真誠平等，不催婚，談身分、等待與使命","audD_parent":"貼近養兒育女的日常：溝通、管教、陪伴與禱告","audD_couple":"夫妻同行：溝通、饒恕、同心與一起禱告","audD_pastor":"同工口吻：牧養、講道預備、團隊與不倦怠","aud_elder":"【回答對象】回答對象：長輩（約65歲以上）。請用尊敬、溫和、慢慢說的口吻，像晚輩敬重地陪長輩讀經；句子清楚、不拐彎，不用網路用語和英文縮寫；比喻取自一生的閱歷（田地、家人、歲月、病痛、孫子、老街坊）。重點先講，分成短段落，不要太長。肯定他們一生走過的路與在主裡的忠心，不說教、不指責、不用「你應該」。可以談健康與軟弱、孤單、放下與交託、把信仰傳給下一代、永恆的盼望與感恩。結尾給一件簡單、容易做到的小事（一句禱告、打電話問候家人、數算一件感謝）。若提到身體不適、孤單或失去親人，要先溫柔安慰，並鼓勵他和家人、教會關懷同工聯絡。","fu_elder":"🩺 健康~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在身體的軟弱與健康，並給我一個這個星期做得到的具體小步驟。|🤍 孤單~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在孤單與思念，並給我一個這個星期做得到的具體小步驟。|👨‍👩‍👧‍👦 兒孫~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在和兒孫、家人的關係，並給我一個這個星期做得到的具體小步驟。|🕊️ 交託~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在放下心中的牽掛、交託給主，並給我一個這個星期做得到的具體小步驟。|🌅 盼望~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在永恆的盼望與感恩，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，用簡單的話寫成一段短短的禱告，讓我可以慢慢念給主聽。","q_elder":"這段經文用最簡單的話，是在說什麼？|這段經文對年紀大的人有什麼安慰？|身體漸漸衰弱了，神怎麼看顧我？|我常常覺得孤單，這段經文能給我什麼？|我該怎麼把信仰傳給兒孫？|有些事放不下，這段經文怎麼教我交託？|我老了，還能為神做什麼？|請幫我寫一段簡短的禱告，我想念給主聽。","qs_elder":"風格：給長輩，字詞平實、句子清楚，題目不要繞、不要太冷僻，選項簡短；解析用一句溫和的話。","qr_elder":"沒關係，慢慢來，再讀一遍會更清楚。|很好！這一章的話您記得不少。|太好了！神的話已經住在您心裡。","aud_single_parent":"【回答對象】回答對象：單親爸爸或媽媽（一個人撐起一個家）。請先接住他的辛苦：他常常很累、有愧疚、有孤單，也有經濟、時間與教養的壓力。口吻溫暖、接納、不評斷，不追問過去的原因，不說「你應該再找個伴」，也不把單親說成缺憾。引用神的心意：神是孤兒的父、寡婦的伸冤者（詩篇68:5），祂與我們同在。再給盼望與實際：每一個小步驟都要在忙碌中做得到（五分鐘禱告、跟孩子的一個小儀式、開口向弟兄姊妹求助）。內容簡短、段落要短。結尾給一個這個星期做得到的小步驟。若他提到被暴力對待、疲憊到撐不下去或想傷害自己，要溫柔回應，並鼓勵他立刻聯絡信任的人、教會同工或專業協助。","fu_single_parent":"😮‍💨 疲累~請針對你剛才的回答，說明怎麼把它用在一個人撐家的疲累與內疚，並給我一個這個星期做得到的具體小步驟。|👧 孩子~請針對你剛才的回答，說明怎麼把它用在陪伴孩子與教養，並給我一個這個星期做得到的具體小步驟。|💰 經濟~請針對你剛才的回答，說明怎麼把它用在經濟與時間的壓力，並給我一個這個星期做得到的具體小步驟。|🤝 求助~請針對你剛才的回答，說明怎麼把它用在向弟兄姊妹或教會開口求助，並給我一個這個星期做得到的具體小步驟。|🌤️ 盼望~請針對你剛才的回答，說明怎麼把它用在在這個階段看見神的同在與盼望，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段我在忙碌中五分鐘內就能禱告完的短禱告。","q_single_parent":"這段經文對一個人撐起一個家的我，有什麼安慰？|我常常覺得累，也覺得對孩子有虧欠，神怎麼看？|神怎麼看顧孤兒和寡婦？這跟我有什麼關係？|經濟壓力很大，這段經文能給我什麼？|孩子在頂嘴、情緒很大，我該怎麼辦？|我不知道怎麼跟孩子說爸爸（或媽媽）不在身邊的事。|我真的很孤單，可以怎麼向教會或弟兄姊妹開口求助？|請幫我寫一段五分鐘內能禱告完的短禱告。","qs_single_parent":"風格：給單親爸媽，題目貼近日常的忙碌、教養與盼望；口氣溫暖，解析一句話帶出安慰。","qr_single_parent":"沒關係，您已經很努力了，有空再讀一遍就好。|不錯！在這麼忙的日子裡還記得這麼多。|太棒了！神的話正在托住您。","aud_single":"【回答對象】回答對象：單身的人（可能未婚、離婚、喪偶，或正在等候；不要預設他想結婚或不想結婚）。請不要把單身說成缺憾、「預備期」或「還沒到的人生」，也不要用催婚的口氣。談在基督裡的身分已經完整、被愛；談孤單時怎麼與神、與朋友、與團契連結；談時間、金錢與恩賜的運用與使命；談等待中的信靠；談感情與婚姻的智慧，以及在情感與身體上的聖潔，態度要尊重、不論斷。口吻真誠、平等、輕鬆。結尾給一個這個星期可以做的小步驟。若他提到孤單到想傷害自己，要溫柔回應並鼓勵他立刻聯絡信任的人或專業協助。","fu_single":"🫶 孤單~請針對你剛才的回答，說明怎麼把它用在孤單時怎麼與神、與朋友連結，並給我一個這個星期做得到的具體小步驟。|💝 身分~請針對你剛才的回答，說明怎麼把它用在我在基督裡的身分與價值，並給我一個這個星期做得到的具體小步驟。|⏳ 等待~請針對你剛才的回答，說明怎麼把它用在等待中的信靠，並給我一個這個星期做得到的具體小步驟。|💞 感情~請針對你剛才的回答，說明怎麼把它用在感情與交友的智慧，並給我一個這個星期做得到的具體小步驟。|🎯 使命~請針對你剛才的回答，說明怎麼把它用在把時間與恩賜用在神的使命上，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段簡短、真誠的禱告，讓我可以拿來禱告。","q_single":"單身的我，這段經文想對我說什麼？|我覺得孤單，這段經文能給我什麼？|在基督裡，我的身分和價值是什麼？|等待的時候，要怎麼信靠神？|感情的事，聖經給我什麼智慧？|單身的時間和精力，可以怎麼為神所用？|怎樣在教會和朋友中建立好的關係？|請幫我寫一段單身者的簡短禱告。","qs_single":"風格：給單身的朋友，題目貼近孤單、身分、等待、友誼與使命；口氣真誠平等，不催婚。","qr_single":"沒關係，慢慢來，再讀一遍就會更清楚。|不錯喔！你把這一章的重點抓到了。|太棒了！你很認真，神的話正在你裡面扎根。","aud_parent":"【回答對象】回答對象：正在養育孩子的父母（孩子可能從嬰幼兒到成年）。請站在父母的位置：他們常常疲累、擔心孩子、也常常內疚。口吻溫暖、貼近生活、不評斷；承認每個孩子與每個家庭都不同。談陪伴與榜樣、管教與恩典的平衡、親子溝通（怎麼聽、怎麼說）、為孩子禱告、夫妻同心、面對自己的軟弱與失敗；可用日常場景當比喻（吃飯、功課、手機、睡前）。結尾給一個這個星期可以做的具體小步驟（一句話、一個擁抱、一段睡前禱告）。若提到孩子遭受傷害、家庭暴力或孩子有自傷的念頭，要溫柔回應並鼓勵立刻尋求專業協助與信任的人。","fu_parent":"🗣️ 溝通~請針對你剛才的回答，說明怎麼把它用在跟孩子好好溝通（怎麼聽、怎麼說），並給我一個這個星期做得到的具體小步驟。|⚖️ 管教~請針對你剛才的回答，說明怎麼把它用在管教與恩典的平衡，並給我一個這個星期做得到的具體小步驟。|😔 內疚~請針對你剛才的回答，說明怎麼把它用在對孩子發脾氣或覺得虧欠的內疚，並給我一個這個星期做得到的具體小步驟。|💑 夫妻~請針對你剛才的回答，說明怎麼把它用在夫妻在教養上同心，並給我一個這個星期做得到的具體小步驟。|📖 信仰~請針對你剛才的回答，說明怎麼把它用在帶孩子認識神、一起親近神，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段我可以為孩子祝福的短禱告。","q_parent":"這段經文對養育孩子的我有什麼提醒？|孩子不聽話、情緒很大，我該怎麼回應？|管教和恩典要怎麼拿捏？|怎麼跟青春期的孩子好好說話？|我常常對孩子發脾氣，事後很內疚怎麼辦？|怎麼帶孩子認識神，而不只是去教會？|夫妻在教養上意見不同，這段經文怎麼說？|請幫我寫一段為孩子祝福的短禱告。","qs_parent":"風格：給養育孩子的父母，題目貼近親子溝通、管教、陪伴與為孩子禱告；口氣溫暖，解析一句話帶出提醒。","qr_parent":"沒關係，慢慢來，有空再讀一遍就會更清楚。|不錯！這一章的重點您已經抓到了。|太棒了！神的話正在您的家裡扎根。","aud_couple":"【回答對象】回答對象：夫妻（正在經營婚姻的丈夫與妻子，可能是新婚、有孩子的中年夫妻，或相伴多年的伴侶）。請站在夫妻同行的位置：口吻溫暖、真誠、不評斷，不偏袒任何一方；承認每段婚姻都有磨合、疲累與受傷的時候。談愛是決定與付出、彼此饒恕、傾聽與表達（怎麼說、怎麼聽）、尊重與同心、金錢與家務的分工、姻親與孩子的教養、一起禱告與一起讀經、在主裡成為一體；可用日常場景當比喻（飯桌、手牽手、吵完架之後、睡前）。結尾給一個這個星期兩個人就能一起做的具體小步驟（一句感謝的話、一段兩人的禱告、一次不看手機的散步）。不要教導妻子順服或丈夫掌權的單方面要求，要強調彼此相愛、彼此順服。若提到家庭暴力、外遇、對方的威脅或有自傷念頭，要溫柔回應，把安全放在第一位，並鼓勵立刻尋求專業協助與信任的人，不要勸人一味忍耐。","fu_couple":"🗣️ 溝通~請針對你剛才的回答，說明夫妻怎麼把它用在好好說、好好聽，並給我們一個這個星期兩個人做得到的具體小步驟。|🤝 饒恕~請針對你剛才的回答，說明夫妻怎麼把它用在彼此認錯與饒恕，並給我們一個這個星期兩個人做得到的具體小步驟。|💞 親密~請針對你剛才的回答，說明夫妻怎麼把它用在重新連結感情、表達愛與感謝，並給我們一個這個星期兩個人做得到的具體小步驟。|👨‍👩‍👧 同心~請針對你剛才的回答，說明夫妻怎麼把它用在金錢、家務與教養上同心，並給我們一個這個星期兩個人做得到的具體小步驟。|📖 同讀~請針對你剛才的回答，說明夫妻怎麼一起讀經、一起親近神，並給我們一個這個星期兩個人做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段夫妻可以一起禱告的短禱告。","q_couple":"這段經文對我們夫妻有什麼提醒？|我們吵架之後總是冷戰，怎麼先伸出手？|怎麼把心裡的話好好說給另一半聽？|對方做錯事傷了我，我真的要饒恕嗎？|我們為金錢與家務的事常常意見不同，怎麼辦？|夫妻怎麼一起禱告、一起親近神？|忙碌的日子裡，夫妻感情變淡了，怎麼重新連結？|請幫我寫一段為我們婚姻祝福的短禱告。","qs_couple":"風格：給夫妻，題目貼近溝通、饒恕、同心、共同禱告與彼此相愛；口氣溫暖，解析一句話帶出提醒。","qr_couple":"沒關係，慢慢來，找個晚上兩個人再一起讀一遍。|不錯！這一章的重點你們抓到了。|太棒了！神的話正在你們的婚姻裡扎根。","aud_pastor":"【回答對象】回答對象：牧者與傳道同工（教會的牧師、傳道人、小組長與事奉的同工）。請站在同工的位置：他們常常肩負許多人的重擔，自己也會疲累、孤單、被誤解或灰心。口吻尊重、平等、真誠，像同工之間彼此扶持，不說教、不居高臨下。可以有適度的深度：點出經文脈絡、原文語境與關鍵字詞的意思，談牧養羊群與生命建造、預備講道與教導、帶領小組與門徒訓練、團隊同心與衝突、面對批評與孤單、屬靈爭戰、自己的靈命與家庭，以及不倦怠的安息與依靠；也可提供講章或查經的切入點、段落與應用建議，但要提醒最後仍須自己在神面前領受。結尾給一個這個星期可以做的具體小步驟（一段安靜親近神的時間、一通關心的電話、一次向同工的坦誠分享）。若提到極度疲憊、憂鬱、想放棄或有自傷念頭，要溫柔回應，並鼓勵立刻尋求信任的同工、屬靈長輩與專業協助。","fu_pastor":"📖 講道~請針對你剛才的回答，提供一個可用於講道或查經的架構（三個要點與一個應用），並提醒我自己先在神面前領受。|🐑 牧養~請針對你剛才的回答，說明怎麼把它用在牧養羊群與關心個別的人，並給我一個這個星期做得到的具體小步驟。|🤝 團隊~請針對你剛才的回答，說明怎麼把它用在帶領團隊、同工同心與處理衝突，並給我一個這個星期做得到的具體小步驟。|🕊️ 安息~請針對你剛才的回答，說明怎麼把它用在自己的疲累與靈命保守，並給我一個這個星期做得到的具體小步驟。|⚔️ 爭戰~請針對你剛才的回答，說明怎麼把它用在面對批評、孤單與屬靈爭戰，並給我一個這個星期做得到的具體小步驟。|🙏 代禱~請把你剛才說的重點，寫成一段我可以為教會與同工代求的短禱告。","q_pastor":"這段經文對事奉中的我有什麼提醒？|請幫我找這段經文的講道架構與切入點。|事奉很累、快要倦怠了，這段經文怎麼安慰我？|怎麼面對教會裡的批評與誤解？|帶領團隊與同工同心，這段經文怎麼說？|怎麼在忙碌的牧養中保守自己的靈命？|怎麼牧養軟弱、受傷或離開的羊？|請幫我寫一段為教會與同工代求的短禱告。","qs_pastor":"風格：給牧者與傳道同工，題目貼近牧養、講道預備、帶領團隊、面對疲累與屬靈爭戰；口氣尊重真誠，解析一句話帶出提醒。","qr_pastor":"沒關係，慢慢來，有空再讀一遍就會更清楚。|不錯！這一章的重點您已經抓到了。|太棒了！神的話先餵養了牧者，也必流向羊群。"}};
function T(k) {
  if (k === 'noFmt' && IDX) { var _it = idxGet(+arguments[1]); if (_it && _it[5]) return _it[5]; }
  var d = I18N[L()] || I18N.zh, s = d[k]; if (s == null) s = I18N.zh[k]; if (s == null) s = k;
  for (var i = 1; i < arguments.length; i++) s = String(s).split('{' + (i - 1) + '}').join(arguments[i]);
  return s;
}
function loadPack(l, cb) {
  if (l === 'zh' || I18N[l]) { cb(); return; }
  getJSON('lang-' + l + '.json', function (d) { if (d) I18N[l] = d; cb(); });
}
function getJSON(u, cb) {
  var x = new XMLHttpRequest(); try { x.open('GET', u + (u.indexOf('?') < 0 ? '?v=' : '&v=') + APPVER, true); } catch (e) { cb(null); return; }
  x.timeout = 30000;
  x.onload = function () { if (x.status >= 200 && x.status < 300) { try { cb(JSON.parse(x.responseText)); return; } catch (e) { } } cb(null); };
  x.onerror = x.ontimeout = function () { cb(null); }; x.send();
}
function toast(m) {
  var t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = m; t.className = 'toast on'; clearTimeout(toast.h); toast.h = setTimeout(function () { t.className = 'toast'; }, 2600);
}
function copyText(s) {
  var ok = false;
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(s); ok = true; } } catch (e) { }
  if (!ok) { var ta = document.createElement('textarea'); ta.value = s; ta.style.cssText = 'position:fixed;top:-99px;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } document.body.removeChild(ta); }
  toast(T('copied'));
}
function shareText(s) {
  if (navigator.share) { var p = navigator.share({ text: s, title: T('appName') }); if (p && p['catch']) p['catch'](function () { }); return; }
  copyText(s);
}
function appUrl() { return location.origin + location.pathname; }

/* ---------- 資料 ---------- */
var IDX = null, IDXL = '', CH = {}, LESS = null;
function getIdx(cb) {
  var l = dl(); if (IDX && IDXL === l) { cb(IDX); return; }
  getJSON('data/idx-' + l + '.json', function (d) { if (d) { IDX = d; IDXL = l; } cb(IDX); });
}
function chunkOf(n) { return Math.floor((n - 1) / 50); }
function getLesson(n, cb) {
  var key = dl() + chunkOf(n);
  var pick = function (arr) { if (!arr) return null; for (var i = 0; i < arr.length; i++) if (arr[i].n === n) return arr[i]; return null; };
  if (CH[key]) { cb(pick(CH[key])); return; }
  getJSON('data/' + dl() + '-' + pad2(chunkOf(n)) + '.json', function (d) { if (d) CH[key] = d; cb(pick(d)); });
}
function maxN() { var m = 0; if (IDX) for (var i = 0; i < IDX.length; i++) if (IDX[i][0] > m) m = IDX[i][0]; return m; }
function idxNums() { var a = []; if (IDX) for (var i = 0; i < IDX.length; i++) a.push(IDX[i][0]); return a; }
function idxGet(n) { if (IDX) for (var i = 0; i < IDX.length; i++) if (IDX[i][0] === n) return IDX[i]; return null; }
function todayNo() {
  var a = idxNums(); if (!a.length) return 0;
  var e = new Date(EPOCH[0], EPOCH[1], EPOCH[2]), t = new Date(); t.setHours(0, 0, 0, 0);
  var d = Math.round((t - e) / 86400000); d = ((d % a.length) + a.length) % a.length; return a[d];
}
function nextOf(n, dir) { var a = idxNums(), i = a.indexOf(n); if (i < 0) return 0; i += dir; return i >= 0 && i < a.length ? a[i] : 0; }
function nextUnread() {
  var a = idxNums(), s = S.last ? a.indexOf(S.last) : -1;
  for (var k = 1; k <= a.length; k++) { var n = a[(s + k + a.length) % a.length]; if (!S.read[n]) return n; }
  return 0;
}
function readCount() { var c = 0; for (var k in S.read) if (S.read[k]) c++; return c; }
function streak() {
  var days = {}, k; for (k in S.read) if (S.read[k]) days[String(S.read[k]).slice(0, 10)] = 1;
  var d = new Date(), c = 0; if (!days[dayKey(d)]) d.setDate(d.getDate() - 1);
  while (days[dayKey(d)]) { c++; d.setDate(d.getDate() - 1); }
  return c;
}

/* ---------- 路由 ---------- */
var R = { page: { t: 'home' }, sub: {} };
function parseHash() {
  var h = (location.hash || '').replace(/^#\/?/, ''), p = h.split('/');
  if (p[0] === 'read' && +p[1]) return { t: 'read', n: +p[1] };
  if (p[0] === 'quiz' && +p[1]) return { t: 'quiz', n: +p[1] };
  if (p[0] === 'join' && p[1]) return { t: 'join', code: p[1] };
  if (/^(list|me|marks|studio|set|notes|ytmap)$/.test(p[0])) return { t: p[0] };
  return { t: 'home' };
}
function hashOf(p) { return '#/' + (p.t === 'home' ? '' : p.t + (p.n ? '/' + p.n : '')); }
function open_(p) { var h = hashOf(p); if (location.hash === h) render(); else location.hash = h; }
function back() { if (history.length > 1 && R.page.t !== 'home') history.back(); else open_({ t: 'home' }); }
window.addEventListener('hashchange', function () { closeHSheet(); stopAll(); render(); });
function setApp(h, keep) { var a = $('#app'); a.innerHTML = h; if (!keep) window.scrollTo(0, 0); }
function coBtn() { return window.CR ? '<button class="ib cob" data-act="coread" aria-label="' + esc(CR.text('title')) + '">📡</button>' : ''; }
function topbar(title, bk, right) {
  return '<header class="tb">' + (bk ? '<button class="ib" onclick="back()" aria-label="' + esc(T('back')) + '">‹</button>' : '<div class="brand"><img src="icon-192.png" alt=""><span>' + esc(T('appName')) + '</span></div>') +
    (bk ? '<div class="tb-t">' + esc(title || '') + '</div>' : '<div class="grow"></div>') + (right || '') + coBtn() + langSw() + '</header>';
}
function langSw() { return '<div class="langswitch" id="langswitch"><button data-act="lang" data-lang="zh" class="' + (L() === 'zh' ? 'active' : '') + '">繁</button><button data-act="lang" data-lang="zs" class="' + (L() === 'zs' ? 'active' : '') + '">简</button><button data-act="lang" data-lang="en" class="' + (L() === 'en' ? 'active' : '') + '">EN</button></div>'; }
function tabbar() {
  var t = R.page.t, it = [['home', '🏠', T('tHome')], ['list', '📚', T('tList')], ['xz', '💬', T('tXz')], ['me', '👤', T('tMe')]], h = '<nav class="tabs">';
  eachA(it, function (x) { h += '<button class="tab' + (t === x[0] ? ' on' : '') + '" data-act="tab" data-t="' + x[0] + '"><span class="ti">' + x[1] + '</span><span>' + esc(x[2]) + '</span></button>'; });
  return h + '</nav>';
}
function applyChrome() {
  var h = document.documentElement;
  eachA(['fs-sm', 'fs-lg', 'fs-xl', 'fs-xxl'], function (c) { h.classList.remove(c); });
  var F = ['fs-sm', '', 'fs-lg', 'fs-xl', 'fs-xxl'][S.set.font]; if (F) h.classList.add(F);
  h.setAttribute('lang', L() === 'zs' ? 'zh-Hans' : (L() === 'en' ? 'en' : 'zh-Hant')); h.setAttribute('data-lang', L());
  if (S.set.theme) h.setAttribute('data-theme', S.set.theme); else h.removeAttribute('data-theme');
  document.title = T('appName');
}
function switchLang(l) { if (l === S.lang) return; stopAll(); S.lang = l; save(); BKM = {}; loadPack(l, function () { applyChrome(); render(); if (XZ.open) drawXz(); }); }
function cycleFont() { S.set.font = (S.set.font + 1) % 5; save(); applyChrome(); toast(T('fonts').split('|')[S.set.font]); }

var LCUR = null;
function render() {
  R.page = parseHash();
  if (R.page.t === 'join') { var jc = R.page.code; try { history.replaceState(null, '', location.pathname + '#/'); } catch (e) { } R.page = { t: 'home' }; setTimeout(function () { if (window.CR) CR.join(jc); }, 300); }
  BUSY = isBusy(); updIdle();
  var p = R.page;
  if (p.t !== 'studio' && window.MX && MX.leave) MX.leave();
  getIdx(function (idx) {
    if (!idx) { setApp(topbar('', false) + '<div class="empty">' + esc(T('loadErr')) + '<br><button class="btn pri" onclick="location.reload()">' + esc(T('retry')) + '</button></div>'); return; }
    if (p.t === 'read') vRead(p.n);
    else if (p.t === 'list') vList();
    else if (p.t === 'me') vMe();
    else if (p.t === 'marks') vMarks();
    else if (p.t === 'notes') vNotes();
    else if (p.t === 'studio') vStudio();
    else if (p.t === 'quiz') vQuiz(p.n);
    else if (p.t === 'ytmap') vYtMap();
    else vHome();
    var tb = $('#tabs'); if (tb) tb.innerHTML = /^(home|list|me|marks|notes)$/.test(p.t) ? tabbar() : '';
    document.body.className = 'pg-' + p.t;
  });
}

/* ---------- 首頁 ---------- */
function greet() { var h = new Date().getHours(); return T(h < 5 ? 'gNight' : h < 11 ? 'gMorning' : h < 14 ? 'gNoon' : h < 18 ? 'gAfter' : 'gEve'); }
function vHome() {
  var tn = todayNo(), it = idxGet(tn), d = new Date(), wk = T('wdays').split('|')[d.getDay()];
  var h = topbar('', false, '<button class="ib" data-act="font" aria-label="' + esc(T('fontB')) + '">Aa</button>');
  h += '<div class="wrap"><div class="greet"><div class="g1">' + esc(greet()) + '</div><div class="g2">' + esc(T('dateFmt', d.getMonth() + 1, d.getDate(), wk)) + '</div></div>';
  if (it) {
    h += '<div class="hero" data-act="go" data-n="' + tn + '"><div class="hero-img" role="img" aria-label="' + esc(T('appName')) + '"></div><div class="hero-in"><div class="hero-k">' + esc(T('todaySnack')) + '<span>' + esc(T('noFmt', tn)) + '</span></div>' +
      '<h2 class="hero-t">' + esc(it[1]) + '</h2><div class="hero-r">' + esc(it[2]) + '</div>' + (it[3] ? '<div class="hero-q">' + esc(it[3]) + '</div>' : '') +
      '<div class="hero-acts"><button class="btn gold" data-act="go" data-n="' + tn + '">' + esc(T('readNow')) + ' ›</button><button class="btn ghost" data-act="golisten" data-n="' + tn + '">🔊 ' + esc(T('listen')) + '</button>' + (S.read[tn] ? '<span class="donechip">✓ ' + esc(T('readDone')) + '</span>' : '') + '</div></div></div>';
  }
  var rc = readCount(), tot = IDX.length, st = streak(), pct = Math.round(rc * 100 / tot);
  h += '<div class="stats"><div class="st"><b>' + rc + '</b><span>' + esc(T('stRead', tot)) + '</span></div><div class="st"><b>' + st + '</b><span>' + esc(T('stStreak')) + '</span></div><div class="st"><b>' + cntKeys(S.star) + '</b><span>' + esc(T('stStar')) + '</span></div></div>' +
    '<div class="pbar"><i style="width:' + pct + '%"></i></div>';
  var nu = nextUnread(), ni = idxGet(nu);
  if (S.last && ni) h += '<div class="nextrow" data-act="go" data-n="' + nu + '"><div class="ri">📖</div><div class="rt"><b>' + esc(T('contRead')) + '</b><span>' + esc(T('noFmt', nu)) + '・' + esc(ni[1]) + '</span></div><span class="chev">›</span></div>';
  h += '<button class="cocard" data-act="coread"><span class="ci">📡</span><span class="ct"><b>' + esc(window.CR ? CR.text('title') : '') + '</b><span>' + esc(window.CR ? CR.text('cardSub') : '') + '</span></span><span class="chev">›</span></button>';
  h += '<div class="row2"><button class="tile" data-act="rand"><span>🎲</span>' + esc(T('randSnack')) + '</button><button class="tile" data-act="tab" data-t="xz"><span>💬</span>' + esc(T('askXzT')) + '</button><button class="tile" data-act="nav" data-t="marks"><span>🖍</span>' + esc(T('myMarks')) + '</button></div>';
  h += fellowCard();
  h += '<div class="creed"><div class="c-h">' + esc(T('creedH')) + '</div><div class="c-b">' + esc(T('creed3')) + '<br>' + esc(T('creed2')) + '<br>' + esc(T('creed1')) + '</div></div>';
  h += '<div class="foot xs muted">' + esc(T('fellowshipName')) + ' · v' + esc(APPVER) + '</div></div>';
  setApp(h); mtgTick(); medalCheck();
}
function cntKeys(o) { var c = 0; for (var k in o) if (o[k]) c++; return c; }

/* ---------- 團契聚會卡 ---------- */
var MTG = { tz: 'Asia/Taipei', list: [{ t: 'mtMorning', d: [1, 2, 3, 4, 5, 6], s: '06:00', e: '07:00' }, { t: 'mtNoon', d: [1, 2, 3, 4, 5], s: '12:10', e: '13:00' }, { t: 'mtNight', d: [1, 2, 3, 4, 5], s: '21:00', e: '22:00' }],
  zoom: 'https://zoom.us/j/8193972372?pwd=o3tuX9k87Lyhb3UEV7hgRtSUYVyI1Q.1', zid: '819 397 2372', zpw: '321', yt: 'https://www.youtube.com/@kingdom321air', home: 'https://spch321-sudo.github.io/321fellowship/',
  give: [['台灣', '社團法人中華活力全人關懷協會', '新光商業銀行 新埔分行', '(103) 0338101013000'], ['馬來西亞', '馬來西亞安提阿教會', 'Public Bank', '3178557627'], ['紐西蘭', 'Bin Lu', 'ASB Bank Auckland Branch', '12-3231-0055109-00'], ['新加坡', 'LEE CHEW YONG', 'DBS My Account', '275-153637-9']] };
var GIVE_EN = { '台灣': 'Taiwan', '馬來西亞': 'Malaysia', '紐西蘭': 'New Zealand', '新加坡': 'Singapore', '社團法人中華活力全人關懷協會': 'Vitality Holistic Care Association (R.O.C.)', '新光商業銀行 新埔分行': 'Shin Kong Bank, Xinpu Branch', '馬來西亞安提阿教會': 'Antioch Church Malaysia' };
function giveEn(g) { if (L() !== 'en') return g; return [GIVE_EN[g[0]] || g[0], GIVE_EN[g[1]] || g[1], GIVE_EN[g[2]] || g[2], g[3]]; }
/* 台北時間（UTC+8，無夏令時）換算成使用者手機的時間 */
function mtgNext() {
  var nowT = now(), best = null;
  for (var dd = 0; dd < 8; dd++) {
    eachA(MTG.list, function (m) {
      var base = new Date(nowT + 8 * 3600000); base.setUTCDate(base.getUTCDate() + dd);
      var wd = base.getUTCDay(); if (m.d.indexOf(wd) < 0) return;
      var y = base.getUTCFullYear(), mo = base.getUTCMonth(), da = base.getUTCDate(), s = m.s.split(':'), e = m.e.split(':');
      var st = Date.UTC(y, mo, da, +s[0], +s[1]) - 8 * 3600000, en = Date.UTC(y, mo, da, +e[0], +e[1]) - 8 * 3600000;
      if (en > nowT && (!best || st < best.st)) best = { m: m, st: st, en: en };
    });
    if (best) break;
  }
  return best;
}
function hm(ts) { var d = new Date(ts); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }
function fellowCard() {
  var b = mtgNext(), h = '<div class="fcard"><div class="f-h"><img src="icon-192.png" alt=""><div><b>' + esc(T('fellowshipName')) + '</b><span>' + esc(T('fTag')) + '</span></div></div>';
  if (b) h += '<div class="f-next"><div class="f-k">' + esc(T('nextMeeting')) + '</div><div class="f-t">' + esc(T(b.m.t)) + '　' + hm(b.st) + '–' + hm(b.en) + '</div><div class="f-cd" id="mtgcd"></div></div>';
  h += '<a class="btn gold block" href="' + MTG.zoom + '" target="_blank" rel="noopener">▶ ' + esc(T('joinNow')) + '</a>' +
    '<div class="f-id xs">' + esc(T('zoomId', MTG.zid, MTG.zpw)) + '</div>' +
    '<details class="f-more"><summary>🕒 ' + esc(T('mtTimes')) + '</summary><div class="f-list">';
  eachA(MTG.list, function (m) { h += '<div class="f-li"><b>' + esc(T(m.t)) + '</b><span>' + esc(T(m.d.length === 6 ? 'monSat' : 'monFri')) + '　' + m.s + '–' + m.e + esc(T('twTime')) + '</span></div>'; });
  h += '<div class="xs muted" style="margin-top:6px">' + esc(T('localNote')) + '</div></div></details>' +
    '<details class="f-more"><summary>💝 ' + esc(T('giveT')) + '</summary><div class="f-list"><div class="xs muted" style="margin-bottom:8px">' + esc(T('giveNote')) + '</div>';
  eachA(MTG.give, function (g, i) { g = giveEn(g); h += '<div class="f-give"><b>' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span><span>' + esc(g[2]) + '</span><span class="acct">' + esc(g[3]) + ' <button class="btn sm" data-act="copyacct" data-v="' + esc(g[3]) + '">' + esc(T('copy')) + '</button></span></div>'; });
  h += '<div class="xs muted">' + esc(T('giveCN')) + ' <a href="' + MTG.home + '" target="_blank" rel="noopener">' + esc(T('fApp')) + '</a></div></div></details>' +
    '<div class="f-links"><a href="' + MTG.home + '" target="_blank" rel="noopener">🏠 ' + esc(T('fApp')) + '</a><a href="' + MTG.yt + '" target="_blank" rel="noopener">▶ YouTube</a></div></div>';
  return h;
}
function mtgTick() {
  var el = $('#mtgcd'); if (!el) return; var b = mtgNext(); if (!b) return;
  var d = b.st - now();
  if (d <= 0) el.innerHTML = '<span class="livedot"></span>' + esc(T('liveNow'));
  else { var hh = Math.floor(d / 3600000), mm = Math.floor(d % 3600000 / 60000); el.textContent = T('cdFmt', hh ? T('hrs', hh) : '', T('mins', mm)); }
  clearTimeout(mtgTick.t); mtgTick.t = setTimeout(mtgTick, 30000);
}

/* ---------- 目錄 ---------- */
var LST = { q: '', f: 'all', seg: -1, full: false, hits: null };
function vList() {
  var h = topbar(T('tList'), false, '<button class="ib" data-act="font">Aa</button>') + '<div class="wrap">';
  h += '<div class="search"><input type="search" id="lq" value="' + esc(LST.q) + '" placeholder="' + esc(T('searchPH')) + '"><button class="btn sm" data-act="fulls">' + esc(T('fullSearch')) + '</button></div>';
  h += '<div class="chips">'; eachA([['all', T('fAll')], ['un', T('fUnread')], ['rd', T('fRead')], ['st', T('fStar')]], function (f) { h += '<button class="chip' + (LST.f === f[0] ? ' on' : '') + '" data-act="lf" data-v="' + f[0] + '">' + esc(f[1]) + '</button>'; }); h += '</div>';
  h += '<div class="chips segs"><button class="chip' + (LST.seg < 0 ? ' on' : '') + '" data-act="lseg" data-v="-1">' + esc(T('segAll')) + '</button>';
  var bks = []; eachA(IDX, function (it) { if (bks.indexOf(it[4]) < 0) bks.push(it[4]); }); eachA(bks, function (b) { var nm = ''; eachA(IDX, function (it) { if (!nm && it[4] === b) nm = it[5].replace(/\s*第?[0-9][0-9–-]*章?$/, ''); }); h += '<button class="chip' + (LST.seg === b ? ' on' : '') + '" data-act="lseg" data-v="' + b + '">' + esc(nm) + '</button>'; });
  h += '</div><div id="lrows"></div></div>';
  setApp(h, true); paintList();
  var q = $('#lq'); q.oninput = function () { LST.q = q.value; LST.hits = null; clearTimeout(q.t); q.t = setTimeout(paintList, 160); };
}
function normQ(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }
function paintList() {
  var box = $('#lrows'); if (!box) return; var q = normQ(LST.q), rows = [], h = '';
  eachA(IDX, function (it) {
    var n = it[0]; if (LST.seg >= 0 && it[4] !== LST.seg) return;
    if (LST.f === 'un' && S.read[n]) return; if (LST.f === 'rd' && !S.read[n]) return; if (LST.f === 'st' && !S.star[n]) return;
    if (q) { var hay = normQ(it[5] + ' ' + it[1] + ' ' + it[2] + ' ' + (it[3] || '')); if (hay.indexOf(q) < 0 && !(LST.hits && LST.hits[n])) return; }
    rows.push(it);
  });
  h += '<div class="xs muted lcount">' + esc(T('nItems', rows.length)) + (q && LST.hits ? '　' + esc(T('fullOn')) : '') + '</div>';
  if (!rows.length) h += '<div class="empty">' + esc(T('noMatch')) + '</div>';
  eachA(rows, function (it) {
    var n = it[0];
    h += '<button class="lrow' + (S.read[n] ? ' rd' : '') + '" data-act="go" data-n="' + n + '"><span class="ln ch">' + esc(it[5].replace(/^.*?(?:第|\s)(?=[0-9])|章$/g, '')) + '</span><span class="lt"><b>' + esc(it[1]) + '</b><span>' + esc(it[2]) + '</span></span><span class="lm">' + (S.star[n] ? '★' : '') + (S.read[n] ? '<i>✓</i>' : '') + '</span></button>';
  });
  box.innerHTML = h;
}
function fullSearch() {
  var q = trim(LST.q); if (!q) { toast(T('typeFirst')); return; }
  toast(T('searching')); var left = 0, hits = {}, total = Math.ceil(maxN() / 50), nq = normQ(q);
  for (var k = 0; k < total; k++) (function (k) {
    left++;
    var go = function (arr) {
      if (arr) eachA(arr, function (x) { var s = normQ(JSON.stringify([x.v, x.b, x.a, x.q, x.pr, x.dc])); if (s.indexOf(nq) >= 0) hits[x.n] = 1; });
      if (--left === 0) { LST.hits = hits; paintList(); toast(T('fullDone', cntKeys(hits))); }
    };
    if (CH[dl() + k]) go(CH[dl() + k]); else getJSON('data/' + dl() + '-' + pad2(k) + '.json', function (d) { if (d) CH[dl() + k] = d; go(d); });
  })(k);
}

/* ---------- 閱讀 ---------- */
function lessonCtx(x) {
  var vt = ''; eachA(x.v, function (v) { vt += v[1] + ' ' + v[2] + ' '; });
  return T('xzCtx', x.lab || x.n, x.t, x.ref, vt.slice(0, 700), x.b.join('').slice(0, 900));
}
function vRead(n) {
  getLesson(n, function (x) {
    if (!x) { setApp(topbar(T('noFmt', n), true) + '<div class="empty">' + esc(T('loadErr')) + '</div>'); return; }
    LCUR = { n: n, title: T('noFmt', n) + '〈' + x.t + '〉', x: x }; XZ.ctx = lessonCtx(x); S.last = n; save();
    var right = '<button class="ib ttsb" data-act="ttspage" aria-label="' + esc(T('listen')) + '">' + svgI('sound') + '</button><button class="ib" data-act="font" aria-label="' + esc(T('fontB')) + '">Aa</button>';
    var h = topbar(T('noFmt', n), true, right) + '<article class="lesson wrap" id="lesson">';
    h += '<div class="l-head"><div class="l-no">' + esc(T('appName')) + '・' + esc(T('noFmt', n)) + '</div>' + blk('h1', 'l-title', n, 't', x.ref, sentHtml(x.t, 0)) + '<div class="l-ref">' + esc(x.ref) + '</div>' +
      vidHtml(n) + '<div class="l-acts"><button class="pill" data-act="ttsfrom" data-top="1">🔊 ' + esc(T('listenAll')) + '</button><button class="pill" data-act="coread">📡 ' + esc(window.CR ? CR.label() : '') + '</button><button class="pill" data-act="askl">💬 ' + esc(T('askXz')) + '</button><button class="pill" data-act="cardl">🖼 ' + esc(T('makeCardV')) + '</button><button class="pill" data-act="star">' + (S.star[n] ? '★' : '☆') + ' ' + esc(T('starB')) + '</button><button class="pill" data-act="sharel">↗ ' + esc(T('share')) + '</button></div></div>';
    if (x.v.length) h += sec('v', '📖', T('sScr'), T('sayScr', x.ref), verseBlk(n, 'v', x.ref, x.v));
    var bh = ''; eachA(x.b, function (p, i) { bh += paraBlk(n, 'b' + i, x.ref, p, 'p', 'msg-p'); });
    h += sec('b', '✨', T('sMsg'), T('sayMsg'), bh);
    if (x.a.length) {
      var ah = x.ah ? '<p class="ap-sub">' + esc(x.ah) + '</p>' : '';
      eachA(x.a, function (a, i) { ah += '<div class="ap"><div class="ap-n">' + (i + 1) + '</div><div class="ap-b">' + (a[0] ? blk('h3', 'ap-h', n, 'ah' + i, x.ref, sentHtml(endDot(a[0]), 0)) : '') + (a[1] ? paraBlk(n, 'ad' + i, x.ref, a[1], 'p', 'ap-d') : '') + '</div></div>'; });
      h += sec('a', '🌱', T('sApp'), T('sayApp'), ah);
    }
    if (x.q.length) {
      var qh = '', nt = S.note[n] || {};
      eachA(x.q, function (q, i) { qh += '<div class="mq">' + paraBlk(n, 'q' + i, x.ref, q, 'p', 'mq-q') + '<textarea class="mq-ta" data-nq="' + i + '" placeholder="' + esc(T('myAns')) + '">' + esc(nt[i] || '') + '</textarea></div>'; });
      h += sec('q', '🤔', T('sMed'), T('sayMed'), qh);
    }
    if (x.pr) { var ph = ''; eachA(x.pr.split('\n'), function (p, i) { ph += paraBlk(n, 'p' + i, x.ref, p, 'p', 'pray'); }); h += sec('p', '🙏', T('sPray'), T('sayPray'), ph); }
    if (x.dc) h += sec('d', '🔥', T('sDecl'), T('sayDecl'), '<div class="decl">' + paraBlk(n, 'd', x.ref, x.dc, 'p', 'decl-t') + '<div class="decl-acts"><button class="btn sm" data-act="carddc">🖼 ' + esc(T('makeCard')) + '</button><button class="btn sm" data-act="saydc">🔊 ' + esc(T('declSay')) + '</button></div></div>');
    var pv = nextOf(n, -1), nx = nextOf(n, 1);
    h += '<div class="l-end"><button class="btn ' + (S.read[n] ? '' : 'pri') + ' block big" data-act="done">' + (S.read[n] ? '✓ ' + esc(T('readDoneAt', String(S.read[n]).slice(5, 10).replace('-', '/'))) : esc(T('markDone'))) + '</button>' +
      '<button class="btn block" data-act="quiz">🎯 ' + esc(T('quizMe')) + '</button>' +
      '<div class="pn">' + (pv ? '<button class="btn" data-act="go" data-n="' + pv + '">‹ ' + esc(T('noFmt', pv)) + '</button>' : '<span></span>') + (nx ? '<button class="btn" data-act="go" data-n="' + nx + '">' + esc(T('noFmt', nx)) + ' ›</button>' : '<span></span>') + '</div>' +
      '<div class="xs muted center">' + esc(T('hlTip')) + '</div></div></article>';
    setApp(h); paintHl(hlRoot()); if (window.CR) CR.rendered();
    eachA($$('.mq-ta'), function (ta) { ta.oninput = function () { var o = S.note[n] || (S.note[n] = {}); o[ta.getAttribute('data-nq')] = ta.value; o.ts = now(); clearTimeout(ta.t); ta.t = setTimeout(save, 400); }; });
    if (R.sub.autoplay) { R.sub.autoplay = 0; setTimeout(function () { ttsPage(hlRoot(), true, LCUR.title); }, 50); }
    prefetch(nx);
  });
}
function prefetch(n) { if (n && !CH[dl() + chunkOf(n)]) getLesson(n, function () { }); }
function endDot(s) { return /[。！？」]$/.test(s) ? s : s + (/[：:]$/.test(s) ? '' : ''); }
function sec(id, ic, t, say, inner) { return '<section class="sec s-' + id + '" data-say="' + esc(say) + '"><div class="lbl"><span class="k">' + ic + '</span><span>' + esc(t) + '</span><button class="lplay" data-act="ttssec" aria-label="' + esc(T('listen')) + '">🔊</button></div>' + inner + '</section>'; }
function lessonShare(x) {
  var s = T('appName') + '・' + T('noFmt', x.n) + '\n〈' + x.t + '〉\n' + x.ref + '\n\n';
  eachA(x.v, function (v) { s += v[1] + ' ' + v[2] + '\n'; });
  if (x.dc) s += '\n' + T('sDecl') + '：' + x.dc + '\n';
  return s + '\n—— ' + T('fellowshipName') + '\n' + appUrl() + '#/read/' + x.n;
}
function markDone(n) {
  if (S.read[n]) { if (!confirm(T('undoDone'))) return; delete S.read[n]; save(); render(); return; }
  S.read[n] = dayKey() + ' ' + pad2(new Date().getHours()); save(); toast(T('doneToast', streak())); medalCheck(); render();
}

/* ---------- 讀經獎章 ---------- */
var MEDALS = [1, 7, 21, 50, 100, 200, 300, 400, 500];
function medalCheck() {
  var c = readCount(), tot = IDX ? IDX.length : 9999, got = null, list = MEDALS.concat([tot]);
  eachA(list, function (m) { if (c >= m && !S.medal[m]) { S.medal[m] = now(); got = m; } });
  if (got) { save(); setTimeout(function () { medalShow(got, got === tot); }, 400); }
}
function medalShow(m, all) {
  var el = document.createElement('div'); el.className = 'rw-mask'; var conf = '';
  for (var i = 0; i < 36; i++) conf += '<i style="left:' + Math.round(Math.random() * 100) + '%;animation-delay:' + (Math.random() * 1.2).toFixed(2) + 's;background:' + ['#D4A65B', '#E58FA0', '#6C93D1', '#6FAE71', '#F2ECDD'][i % 5] + '"></i>';
  el.innerHTML = '<div class="rw-conf">' + conf + '</div><div class="rw-card"><svg viewBox="0 0 120 140" class="rw-medal"><path d="M38 0h18l14 40H52zM82 0H64L50 40h18z" fill="#2F5C93"/><circle cx="60" cy="88" r="44" fill="#D4A65B"/><circle cx="60" cy="88" r="36" fill="none" stroke="#F7EFDC" stroke-width="3"/><text x="60" y="' + (String(m).length > 2 ? 99 : 101) + '" text-anchor="middle" font-size="' + (String(m).length > 2 ? 28 : 34) + '" font-weight="700" fill="#fff" font-family="Georgia,serif">' + m + '</text></svg>' +
    '<h3>' + esc(all ? T('medalAll') : T('medalT', m)) + '</h3><p>' + esc(T('medalP' + (m % 3))) + '</p><button class="btn gold" onclick="this.parentNode.parentNode.remove()">' + esc(T('amen')) + '</button></div>';
  el.onclick = function (e) { if (e.target === el) el.parentNode.removeChild(el); };
  document.body.appendChild(el); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 14000);
}

/* ---------- 我的 ---------- */
function vMe() {
  var h = topbar(T('tMe'), false) + '<div class="wrap">';
  h += '<div class="stats"><div class="st"><b>' + readCount() + '</b><span>' + esc(T('stRead', IDX.length)) + '</span></div><div class="st"><b>' + streak() + '</b><span>' + esc(T('stStreak')) + '</span></div><div class="st"><b>' + cntKeys(S.medal) + '</b><span>' + esc(T('stMedal')) + '</span></div></div>';
  h += '<div class="menu"><button data-act="nav" data-t="marks">🖍 ' + esc(T('myMarks')) + '<span>›</span></button><button data-act="nav" data-t="notes">📝 ' + esc(T('myNotes')) + '<span>›</span></button><button data-act="lfstar">★ ' + esc(T('myStars')) + '<span>›</span></button><button data-act="medals">🏅 ' + esc(T('myMedals')) + '<span>›</span></button><button data-act="nav" data-t="studio" data-blank="1">🖼 ' + esc(T('studioT')) + '<span>›</span></button></div>';
  h += '<div class="card"><p class="eyebrow">' + esc(T('setRead')) + '</p>' + segRow(T('fonts').split('|'), S.set.font, 'setfont') +
    '<p class="eyebrow">' + esc(T('setTheme')) + '</p>' + segRow(T('themes').split('|'), ['', 'light', 'sepia', 'dark'].indexOf(S.set.theme), 'settheme') +
    '<p class="eyebrow">' + esc(T('setLang')) + '</p>' + segRow(['繁體中文', '简体中文', 'English'], L() === 'zs' ? 1 : (L() === 'en' ? 2 : 0), 'setlang') + '</div>';
  h += '<div class="card"><p class="eyebrow">' + esc(T('setVoice')) + '</p>' + segRow([T('vHuman'), T('vDevice')], S.set.human ? 0 : 1, 'sethuman') +
    (S.set.human ? '<p class="eyebrow">' + esc(T('voiceWho')) + '</p>' + segRow(T('voiceNames').split('|'), S.set.voice, 'setvoice') : '') +
    '<p class="eyebrow">' + esc(T('voiceRate')) + '</p>' + segRow(T('rates').split('|'), S.set.rate + 2, 'setrate') +
    '<button class="btn sm" data-act="voicetest" style="margin-top:10px">🔊 ' + esc(T('voiceTest')) + '</button></div>';
  h += '<div class="card"><p class="eyebrow">' + esc(T('audT')) + '</p>' + audGrid('setaud') + '<div class="xs muted" style="margin-top:8px">' + esc(T('audD_' + S.set.aud)) + '</div></div>';
  h += '<div class="card"><p class="eyebrow">' + esc(T('offT')) + '</p><div class="xs muted" style="margin-bottom:8px">' + esc(T('offD')) + '</div><button class="btn sm" data-act="offline">⬇ ' + esc(T('offB')) + '</button><span class="xs muted" id="offst"></span></div>';
  h += '<div class="card"><p class="eyebrow">' + esc(T('bkT')) + '</p><div class="row wrap2" style="gap:8px"><button class="btn sm" data-act="backup">⬇ ' + esc(T('bkOut')) + '</button><button class="btn sm" data-act="restore">⬆ ' + esc(T('bkIn')) + '</button><input type="file" id="bkfile" accept=".json,application/json" style="display:none"></div></div>';
  h += '<div class="card"><p class="eyebrow">' + esc(T('verT')) + '</p><div class="xs muted">v' + esc(APPVER) + '</div><div class="row wrap2" style="gap:8px;margin-top:8px"><button class="btn sm" data-act="chkupd">' + esc(T('checkUpd')) + '</button><button class="btn sm" data-act="hardupd">' + esc(T('hardUpd')) + '</button><button class="btn sm" data-act="install">📲 ' + esc(T('installB')) + '</button></div></div>';
  h += '<div class="creed"><div class="c-h">' + esc(T('creedH')) + '</div><div class="c-b">' + esc(T('creed3')) + '<br>' + esc(T('creed2')) + '<br>' + esc(T('creed1')) + '</div></div></div>';
  setApp(h);
  var f = $('#bkfile'); if (f) f.onchange = function () { restoreFile(this.files && this.files[0]); };
}
function segRow(labels, cur, act) { var h = '<div class="seg">'; eachA(labels, function (l, i) { h += '<button class="' + (i === cur ? 'on' : '') + '" data-act="' + act + '" data-i="' + i + '">' + esc(l) + '</button>'; }); return h + '</div>'; }
function vNotes() {
  var h = topbar(T('myNotes'), true) + '<div class="wrap">', arr = [];
  for (var k in S.note) { var o = S.note[k], has = false; for (var j in o) if (j !== 'ts' && trim(o[j])) has = true; if (has) arr.push([+k, o]); }
  arr.sort(function (a, b) { return (b[1].ts || 0) - (a[1].ts || 0); });
  if (!arr.length) h += '<div class="empty">' + esc(T('noNotes')) + '</div>';
  eachA(arr, function (e) {
    var it = idxGet(e[0]); h += '<div class="card note"><div class="nt-h" data-act="go" data-n="' + e[0] + '"><b>' + esc(T('noFmt', e[0])) + '</b>' + (it ? '　' + esc(it[1]) : '') + '<span class="xs muted">' + (e[1].ts ? fmtDate(e[1].ts) : '') + '</span></div>';
    for (var j in e[1]) if (j !== 'ts' && trim(e[1][j])) h += '<div class="nt-b">' + esc(e[1][j]) + '</div>';
    h += '</div>';
  });
  setApp(h + '</div>');
}
function vMarks() {
  var sub = R.sub.marks || 'hl';
  var h = topbar(T('fHl') + ' · ' + T('fFav'), true) + '<div class="wrap">';
  h += '<div class="seg"><button class="' + (sub === 'hl' ? 'on' : '') + '" onclick="R.sub.marks=\'hl\';render()">' + esc(T('fHl')) + '</button><button class="' + (sub === 'fav' ? 'on' : '') + '" onclick="R.sub.marks=\'fav\';render()">' + esc(T('fFav')) + '</button></div>';
  h += sub === 'hl' ? hlListHtml() : favListHtml();
  setApp(h + '</div>');
}
function medalList() {
  var h = '<div class="sheet-title">🏅 ' + esc(T('myMedals')) + '</div><div class="medals">', tot = IDX.length;
  eachA(MEDALS.concat([tot]), function (m) { var got = S.medal[m]; h += '<div class="md' + (got ? ' on' : '') + '"><b>' + m + '</b><span>' + (got ? fmtDate(got).split(' ')[0] : esc(T('medalLock'))) + '</span></div>'; });
  openHSheet(h + '</div><div class="sheet-acts" style="margin-top:12px"><button class="btn" data-act="hclose">' + esc(T('close')) + '</button></div>');
}
function backupOut() {
  var data = JSON.stringify({ app: 'ot321', v: APPVER, ts: now(), S: S });
  try { var b = new Blob([data], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'ot321-backup-' + dayKey() + '.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); toast(T('bkDone')); } catch (e) { copyText(data); }
}
function restoreFile(f) {
  if (!f) return; var rd = new FileReader();
  rd.onload = function () { try { var d = JSON.parse(rd.result); if (!d || d.app !== 'ot321' || !d.S) throw 0; if (!confirm(T('bkAsk'))) return; S = d.S; save(); location.reload(); } catch (e) { toast(T('bkBad')); } };
  rd.readAsText(f);
}
function offlineAll() {
  var total = Math.ceil(maxN() / 50), done = 0, st = $('#offst');
  for (var k = 0; k < total; k++) (function (k) { getJSON('data/' + dl() + '-' + pad2(k) + '.json', function (d) { if (d) CH[dl() + k] = d; done++; if (st) st.textContent = ' ' + done + '/' + total; if (done === total) toast(T('offDone')); }); })(k);
}

/* ---------- 回答對象 ---------- */
var AUD_KEYS = ['adult', 'teen', 'kid', 'seeker', 'elder', 'single_parent', 'single', 'parent', 'couple', 'pastor'];
function audIdx() { var i = AUD_KEYS.indexOf(S.set.aud); return i < 0 ? 0 : i; }
function audLabel() { return T('auds').split('|')[audIdx()]; }
function tk(k, d) { var v = T(k); return v === k ? d : v; }
function audQuick() { if (S.set.aud === 'seeker') return tk('q_sk_' + BG_KEYS[bgIdx()], T('xzQuick')); return tk('q_' + S.set.aud, T('xzQuick')); }
function audGrid(act) { var h = '<div class="audgrid">', L = T('auds').split('|'); eachA(AUD_KEYS, function (k, i) { h += '<button class="chip' + (i === audIdx() ? ' on' : '') + '" data-act="' + act + '" data-i="' + i + '">' + esc(L[i]) + '</button>'; }); return h + '</div>'; }
function audPick() { openHSheet('<div class="sheet-title">' + esc(T('audT')) + '</div>' + audGrid('setaud2') + '<div class="xs muted" style="margin-top:8px">' + esc(T('audD_' + S.set.aud)) + '</div><div class="sheet-acts" style="margin-top:12px"><button class="btn" data-act="hclose">' + esc(T('close')) + '</button></div>'); }
function audSys() { return T('aud_' + (S.set.aud || 'adult')); }

/* ---------- 小智回答選項：長度／慕道友信仰背景／可收合選項列（複製自321互動聖經） ---------- */
var LEN_KEYS = ['brief', 'mid', 'full'], BG_KEYS = ['none', 'buddhism', 'folk', 'yiguandao', 'muslim', 'atheist'];
function lenIdx() { var i = LEN_KEYS.indexOf(S.set.alen); return i < 0 ? 1 : i; }
function bgIdx() { var i = BG_KEYS.indexOf(S.set.skbg); return i < 0 ? 0 : i; }
function lenSys() { var k = LEN_KEYS[lenIdx()]; return k === 'mid' ? '' : T('lenSys_' + k); }
function bgSys() { return S.set.aud === 'seeker' ? T('skbg_' + BG_KEYS[bgIdx()]) : ''; }
function reAnswerLast(msg) {
  if (chatBusy || S.chat.length < 2) return false;
  var a = S.chat[S.chat.length - 1], u = S.chat[S.chat.length - 2];
  if (a.role === 'user' || a.wait || u.role !== 'user') return false;
  S.chat.splice(S.chat.length - 2, 2); chatCtx = u.src || null; save(); if (msg) toast(msg); sendChat(u.text); return true;
}
function optChips(arr, cur, act) { var h = ''; eachA(arr, function (l, i) { h += '<button class="chip' + (i === cur ? ' on' : '') + '" data-act="' + act + '" data-i="' + i + '">' + esc(l) + '</button>'; }); return h; }
function xzOptsHtml() {
  var L = T('auds').split('|'), ln = T('lens').split('|'), bn = T('bgNames').split('|'), sk = S.set.aud === 'seeker';
  var sum = L[audIdx()].replace(/^\S+\s/, '') + '　·　' + (sk ? bn[bgIdx()] + '　·　' : '') + ln[lenIdx()];
  var h = '<button class="opt-sum" data-act="xzopt"><span>⚙️ ' + esc(L[audIdx()].split(' ')[0]) + ' ' + esc(sum) + '</span><b>' + (XZ.opt ? '▲' : '▼') + '</b></button>';
  if (!XZ.opt) return h;
  h += '<div class="opt-body"><div class="optrow"><button class="qs-toggle aud-tog' + (XZ.audOpen ? ' on' : '') + '" data-act="audtog">' + esc(L[audIdx()].split(' ')[0]) + ' ' + esc(T('audNowS', L[audIdx()].replace(/^\S+\s/, ''))) + '</button><button class="qs-toggle' + (XZ.qsOpen ? ' on' : '') + '" data-act="qstog">💡 ' + esc(tk('xzExamples', '範例問題')) + '</button></div>';
  if (XZ.audOpen) h += audGrid('xzaud') + '<div class="xs muted" style="margin:6px 0 8px">' + esc(T('audD_' + S.set.aud)) + '</div>';
  if (XZ.qsOpen) { var qs = ''; eachA(audQuick().split('|'), function (q) { qs += '<button class="qs-chip" data-act="chatq">' + esc(q) + '</button>'; }); h += '<div class="qs-panel">' + qs + '</div>'; }
  h += '<div class="optline"><span class="optlab">' + esc(T('lenT')) + '</span>' + optChips(ln, lenIdx(), 'setlen') + '</div>';
  if (sk) h += '<div class="optline"><span class="optlab">' + esc(T('bgT')) + '</span>' + optChips(T('bgs').split('|'), bgIdx(), 'setbg') + '</div>';
  return h + '</div>';
}
function paintOpts() { var el = $('#xzOpts'); if (el) el.innerHTML = xzOptsHtml(); }


/* ---------- 讀經樂：考考我 ---------- */
var QZ = null;
function vQuiz(n) {
  var h = topbar(T('quizT'), true) + '<div class="wrap" id="qz"></div>'; setApp(h);
  getLesson(n, function (x) {
    if (!x) return; LCUR = { n: n, title: T('noFmt', n) + '〈' + x.t + '〉', x: x };
    if (!QZ || QZ.n !== n || QZ.lang !== L()) { QZ = { n: n, lang: L(), qs: null, i: 0, ok: 0, picked: -1 }; quizLoad(x); } else quizPaint();
  });
}
function quizLoad(x) {
  var box = $('#qz'); if (box) box.innerHTML = '<div class="card center"><span class="typing"><i></i><i></i><i></i></span><p>' + esc(T('quizMaking')) + '</p></div>';
  var src = x.ref + '\n'; eachA(x.v, function (v) { src += v[1] + ' ' + v[2] + '\n'; }); src += '\n' + x.b.join('\n') + '\n' + T('sApp') + '：'; eachA(x.a, function (a) { src += a[0] + ' ' + a[1] + '；'; });
  var payload = { model: SVC.model, max_tokens: 1400, system: T('quizSys') + '\n' + audSys() + tk('qs_' + S.set.aud, ''), messages: [{ role: 'user', content: T('quizAsk') + '\n\n' + src.slice(0, 3200) }] };
  (function att(k) {
    ajax('POST', SVC.xz, payload, null, function (st, txt) {
      var qs = null; if (st === 200) { try { qs = quizParse(extractReply(JSON.parse(txt))); } catch (e) { } }
      if (!qs && k < 2) { setTimeout(function () { att(k + 1); }, 900 * (k + 1)); return; }
      if (!qs) { var b = $('#qz'); if (b) b.innerHTML = '<div class="empty">' + esc(T('quizErr')) + (st ? '（http ' + st + '）' : '') + '<br><button class="btn pri" data-act="quizre">' + esc(T('retry')) + '</button></div>'; return; }
      QZ.qs = qs; QZ.i = 0; QZ.ok = 0; QZ.picked = -1; quizPaint();
    });
  })(0);
}
function quizParse(t) {
  t = String(t || '').replace(/```(?:json)?/g, ''); var a = t.indexOf('{'), b = t.lastIndexOf('}'); if (a < 0 || b < a) return null;
  var d = JSON.parse(t.slice(a, b + 1)), out = [];
  eachA(d.q || [], function (q) { if (q && q.q && q.o && q.o.length >= 3 && q.a >= 0 && q.a < q.o.length) out.push(q); });
  return out.length >= 2 ? out.slice(0, 5) : null;
}
function quizPaint() {
  var box = $('#qz'); if (!box || !QZ || !QZ.qs) return; var it = idxGet(QZ.n), h = '<div class="qz-h"><b>' + esc(T('noFmt', QZ.n)) + '</b>　' + esc(it ? it[1] : '') + '</div>';
  if (QZ.i >= QZ.qs.length) {
    var pct = Math.round(QZ.ok * 100 / QZ.qs.length), stars = pct >= 90 ? '★★★' : pct >= 60 ? '★★☆' : '★☆☆';
    h += '<div class="card center qz-end"><div class="qz-stars">' + stars + '</div><h3>' + esc(T('quizScore', QZ.ok, QZ.qs.length)) + '</h3><p>' + esc(tk('qr_' + S.set.aud, '') ? T('qr_' + S.set.aud).split('|')[pct >= 90 ? 2 : pct >= 60 ? 1 : 0] : T(pct >= 90 ? 'quizG' : pct >= 60 ? 'quizM' : 'quizL')) + '</p>' +
      '<div class="row wrap center" style="gap:8px"><button class="btn pri" data-act="quizre">' + esc(T('quizAgain')) + '</button><button class="btn" data-act="go" data-n="' + QZ.n + '">' + esc(T('backToL')) + '</button></div></div>';
    box.innerHTML = h; return;
  }
  var q = QZ.qs[QZ.i], ans = QZ.picked >= 0;
  h += '<div class="qz-prog">' + (QZ.i + 1) + ' / ' + QZ.qs.length + '</div><div class="card"><div class="qz-q">' + esc(q.q) + '</div>';
  eachA(q.o, function (o, i) { var cls = ans ? (i === q.a ? ' ok' : (i === QZ.picked ? ' bad' : '')) : ''; h += '<button class="qz-o' + cls + '" data-act="qzpick" data-i="' + i + '"' + (ans ? ' disabled' : '') + '>' + 'ABCD'.charAt(i) + '. ' + esc(o) + '</button>'; });
  if (ans) h += '<div class="qz-e">' + (QZ.picked === q.a ? '✅ ' + esc(T('quizRight')) : '💡 ' + esc(T('quizWrong'))) + (q.e ? '<br>' + esc(q.e) : '') + '</div><button class="btn pri block" data-act="qznext">' + esc(T(QZ.i + 1 < QZ.qs.length ? 'quizNext' : 'quizSee')) + '</button>';
  box.innerHTML = h + '</div>';
}

/* ---------- 小智追問 ---------- */
function fuHtml() { var a = T('fu_' + (S.set.aud || 'adult')).split('|'), h = '<div class="fu">'; eachA(a, function (x) { var p = x.split('~'); h += '<button class="fu-chip" data-act="fu" data-q="' + esc(p[1] || p[0]) + '">' + esc(p[0]) + '</button>'; }); return h + '</div>'; }

/* ---------- 語音設定給 ext.js 用 ---------- */
function voiceName() { var v = VOICES[dl()] || VOICES.zh; return v[S.set.voice] || v[0]; }
function rateAttr() { var r = S.set.rate * 10; return (r >= 0 ? '+' : '') + r + '%'; }
function isBusy() { return !!((window.CR && CR.on()) || (typeof spk !== 'undefined' && spk.on) || (typeof sayKey !== 'undefined' && sayKey) || (typeof chatBusy !== 'undefined' && chatBusy) || (window.MX && MX.busy && MX.busy()) || $('#hsheet') || $('.rw-mask')); }

/* ---------- 安裝提示 ---------- */
var DEFER_IP = null;
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); DEFER_IP = e; });
function installApp() {
  if (DEFER_IP) { DEFER_IP.prompt(); DEFER_IP = null; return; }
  openHSheet('<div class="sheet-title">📲 ' + esc(T('installB')) + '</div><div class="hl-tip" style="white-space:pre-line">' + esc(T('installHow')) + '</div><div class="sheet-acts" style="margin-top:12px"><button class="btn" data-act="hclose">' + esc(T('close')) + '</button></div>');
}

/* ---------- 每一集的 YouTube 影片 ---------- */
var YT_LIST = 'PLid55ck_AyA26gNybAlSVfPZPZd9eg7hF', YT_CH = 'https://www.youtube.com/@kingdom321air';
var VID = {};
function loadVids() { getJSON('data/videos.json', function (d) { if (d && typeof d === 'object') { VID = d; if (R.page.t === 'read' && !$('.vid')) { var a = $('.l-acts'); if (a && VID[R.page.n]) a.insertAdjacentHTML('beforebegin', vidHtml(R.page.n)); } } }); }
function vidHtml(n) {
  var v = VID[n], z = L() !== 'zh', id = (v && typeof v === 'object') ? (z ? (v.s || v.t) : (v.t || v.s)) : v;
  if (!id) return '';
  var h = '<div class="vid" data-act="playvid" data-id="' + esc(id) + '" style="background-image:url(https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg)"><span class="vplay">▶</span><span class="vlab">' + esc(T('watchVid')) + '</span></div>';
  if (v && v.x && v.x.length) {
    h += '<div class="vmore">';
    eachA(v.x, function (e) { var vid2 = z ? (e[1].s || e[1].t) : (e[1].t || e[1].s); if (vid2) h += '<button class="pill" data-act="playvid" data-id="' + esc(vid2) + '">🎬 ' + esc(isEN() ? ('Chapter ' + e[0]) : (z ? '第' + e[0] + '章' : '第' + e[0] + '章')) + '</button>'; });
    h += '</div>';
  }
  return h;
}
function playVid(el) {
  stopAll(); var id = el.getAttribute('data-id');
  var f = document.createElement('iframe'); f.className = 'vidf'; f.setAttribute('allowfullscreen', ''); f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
  f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&playsinline=1&rel=0';
  if (el.className.indexOf('pill') >= 0) { var box = el.parentNode.parentNode, cur = box && (box.querySelector('.vidf') || box.querySelector('.vid')); if (cur) { cur.parentNode.replaceChild(f, cur); f.scrollIntoView({ block: 'center' }); return; } }
  el.parentNode.replaceChild(f, el);
}
/* 建立影片對照表（只需由同工做一次）：讀播放清單的影片 → 逐支查標題 → 依「真理點心＋編號」配對 */
var YM = null;
function vYtMap() {
  setApp(topbar(T('ymT'), true) + '<div class="wrap"><div class="card"><p>' + esc(T('ymD')) + '</p><button class="btn pri" data-act="ymgo">' + esc(T('ymGo')) + '</button><div id="ymst" class="xs muted" style="margin-top:10px"></div></div><div id="ymbox"></div><div id="ymplayer" style="width:2px;height:2px;overflow:hidden;opacity:.01"></div></div>');
}
function ymSt(t) { var e = $('#ymst'); if (e) e.textContent = t; }
function ymStart() {
  if (YM && YM.busy) return; YM = { busy: true, ids: [], map: {}, bad: [] }; ymSt(T('ymLoading'));
  var boot = function () {
    var seen = {}, rounds = 0, pl;
    var grab = function () {
      var a = pl.getPlaylist && pl.getPlaylist(); var add = 0;
      if (a) for (var i = 0; i < a.length; i++) if (!seen[a[i]]) { seen[a[i]] = 1; YM.ids.push(a[i]); add++; }
      ymSt(T('ymGot', YM.ids.length));
      if (add && rounds++ < 20) { pl.cuePlaylist({ list: YT_LIST, listType: 'playlist', index: YM.ids.length }); setTimeout(grab, 2500); }
      else ymTitles();
    };
    pl = new YT.Player('ymplayer', { height: '2', width: '2', playerVars: { listType: 'playlist', list: YT_LIST }, events: { onReady: function () { setTimeout(grab, 2500); }, onError: function () { ymSt(T('ymErr')); YM.busy = false; } } });
  };
  if (window.YT && YT.Player) boot();
  else { window.onYouTubeIframeAPIReady = boot; var sc = document.createElement('script'); sc.src = 'https://www.youtube.com/iframe_api'; sc.onerror = function () { ymSt(T('ymErr')); YM.busy = false; }; document.body.appendChild(sc); }
}
function ymTitles() {
  var i = 0, live = 0, N = YM.ids.length;
  var one = function (id, cb) {
    var u = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id);
    getJSON2(u, function (d) { if (d && d.title) return cb(d.title); getJSON2('https://noembed.com/embed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id), function (e) { cb(e && e.title || ''); }); });
  };
  var next = function () {
    while (live < 6 && i < N) (function (id) {
      live++; i++;
      one(id, function (t) {
        live--; var m = /真理[點点]心\s*0*(\d{1,4})/.exec(t || '');
        if (m) { var n = +m[1]; if (!YM.map[n]) YM.map[n] = id; } else YM.bad.push(id + ' ' + (t || '?'));
        ymSt(T('ymTitles', N - i + live, cntKeys(YM.map)));
        if (i >= N && !live) ymDone(); else next();
      });
    })(YM.ids[i]);
  };
  if (!N) { ymSt(T('ymErr')); YM.busy = false; return; } next();
}
function getJSON2(u, cb) { var x = new XMLHttpRequest(); try { x.open('GET', u, true); } catch (e) { cb(null); return; } x.timeout = 15000; x.onload = function () { try { cb(JSON.parse(x.responseText)); } catch (e) { cb(null); } }; x.onerror = x.ontimeout = function () { cb(null); }; x.send(); }
function ymDone() {
  YM.busy = false; var have = cntKeys(YM.map), miss = []; eachA(IDX, function (it) { if (!YM.map[it[0]]) miss.push(it[0]); });
  VID = YM.map; var js = JSON.stringify(YM.map);
  var b = $('#ymbox'); if (!b) return;
  b.innerHTML = '<div class="card"><p class="eyebrow">' + esc(T('ymDone', YM.ids.length, have)) + '</p>' + (miss.length ? '<div class="xs muted">' + esc(T('ymMiss', miss.length)) + miss.slice(0, 80).join('、') + (miss.length > 80 ? '…' : '') + '</div>' : '') +
    '<p>' + esc(T('ymSend')) + '</p><textarea id="ymjson" class="mq-ta" style="min-height:120px" readonly>' + esc(js) + '</textarea><button class="btn pri block" data-act="ymcopy">' + esc(T('copy')) + '</button></div>';
  ymSt('');
}

/* 321教會生活 · 移植自《321屬靈生活》v2.3b：逐句跟讀朗讀、畫線面板、小智美編排版、經文美圖工作室 (ES5) */
var PEXELS_KEY = 'ofCQ7i2mqaEddrACvvmzdgfrpZ90Z8gVOI9D6vYVf7uxWXCCtzQbj9yR';
function isEN() { return L() === 'en'; }
function isZS() { return L() === 'zs'; }
function trim(s) { return String(s || '').replace(/^\s+|\s+$/g, ''); }
function qa(sel, root) { return $$(sel, root); }
function eachA(a, f) { for (var i = 0; i < a.length; i++) f(a[i], i); }
function Q(s) { return isEN() ? '“' + s + '”' : '「' + s + '」'; }
function ajax(method, url, body, type, cb, headers) {
  var x = new XMLHttpRequest();
  try { x.open(method, url, true); } catch (e) { cb(0, null); return; }
  if (type) x.responseType = type;
  x.timeout = type === 'arraybuffer' || type === 'blob' ? 25000 : 45000;
  if (body) x.setRequestHeader('Content-Type', 'application/json');
  if (headers) for (var h in headers) x.setRequestHeader(h, headers[h]);
  x.onload = function () { cb(x.status, type ? x.response : x.responseText); };
  x.onerror = function () { cb(0, null); }; x.ontimeout = function () { cb(-1, null); };
  try { x.send(body ? JSON.stringify(body) : null); } catch (e) { cb(0, null); }
}
var IC2 = { chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>', sound: '<path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>', pause: '<path d="M8 5v14M16 5v14"/>', play: '<path d="M7 4.5v15l12-7.5z"/>' };
function svgI(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;vertical-align:-4px">' + IC2[n] + '</svg>'; }
(function () { var d = defState(); if (!S.hl) S.hl = {}; if (!S.chat) S.chat = []; if (!S.fav) S.fav = []; if (!S.card) S.card = { tpl: 'navy', size: 't', border: 'classic', fs: 1, to: '', top: '', sign: '' }; })();

/* ---------- 切句 ---------- */
var SENT_END_ZH = '。！？', CLOSERS = '」』）〕”’';
function splitS(text) {
  text = String(text || ''); var out = [], cur = '', i;
  if (isEN()) {
    var re = /[^.!?]*[.!?]+["'”’\)\]]*(\s+|$)/g, m, last = 0;
    while ((m = re.exec(text)) !== null) { if (trim(m[0])) out.push(m[0]); last = re.lastIndex; if (re.lastIndex === m.index) re.lastIndex++; }
    if (last < text.length && trim(text.slice(last))) out.push(text.slice(last)); return out.length ? out : [text];
  }
  for (i = 0; i < text.length; i++) {
    cur += text.charAt(i);
    if (SENT_END_ZH.indexOf(text.charAt(i)) >= 0) { while (i + 1 < text.length && CLOSERS.indexOf(text.charAt(i + 1)) >= 0) { cur += text.charAt(++i); } out.push(cur); cur = ''; }
  }
  if (cur) out.push(cur); return out;
}
function sentHtml(text, start) { var ss = splitS(text), h = '', k = start || 0; eachA(ss, function (s) { h += '<span class="sent" data-s="' + (k++) + '">' + esc(s) + '</span>'; }); sentHtml.n = k; return h; }
/* 一個可畫線區塊：data-l 課號、data-b 區塊代號、data-rf 出處標籤 */
function blk(tag, cls, lidv, b, rf, inner) { return '<' + tag + ' class="blk' + (cls ? ' ' + cls : '') + '" data-l="' + lidv + '" data-b="' + b + '" data-rf="' + esc(rf || '') + '">' + inner + '</' + tag + '>'; }
function verseBlk(lidv, b, rl, text) {
  var h = '', k = 0, multi = text.length > 1 && text[0][0] !== text[text.length - 1][0];
  eachA(text, function (v) { if (!v[2]) return; h += '<sup class="vn" data-c="' + v[0] + '">' + (multi ? v[0] + ':' : '') + v[1] + '</sup>' + sentHtml(v[2], k); k = sentHtml.n; });
  return blk('div', 'scr', lidv, b, rl, h);
}
function paraBlk(lidv, b, rf, text, tag, cls) { return blk(tag || 'p', cls || '', lidv, b, rf, sentHtml(text, 0)); }
function verseNoOf(el) { var n = el; while (n) { if (n.className === 'vn') { var t = n.textContent; return t.indexOf(':') > 0 ? t : +t; } n = n.previousSibling; } return 0; }

/* ---------- 畫線 ---------- */
var HL_COLORS = ['gold', 'green', 'blue', 'pink', 'purple', 'maroon', 'brown', 'charcoal'];
var HL_SWATCH = { gold: '#D9B168', green: '#6FAE71', blue: '#6C93D1', pink: '#E58FA0', purple: '#A48AC9', maroon: '#8C4A4E', brown: '#8A6740', charcoal: '#54534E' };
function hlRoot() { return $('#lesson') || $('#app'); }
function blkOf(el) { var n = el; while (n && n !== document) { if (n.className && String(n.className).indexOf('blk') >= 0 && n.getAttribute && n.getAttribute('data-b')) return n; n = n.parentNode; } return null; }
function hlKeyOf(el) { var b = blkOf(el); if (!b) return null; return L() + '|' + b.getAttribute('data-l') + '|' + b.getAttribute('data-b') + '|' + el.getAttribute('data-s'); }
function sentList(root) { return qa('.sent', root || hlRoot()); }
function hlRef(els) {
  var b = blkOf(els[0]); if (!b) return ''; var rf = b.getAttribute('data-rf') || '';
  if (b.className.indexOf('scr') >= 0) {
    var v1 = verseNoOf(els[0]), v2 = verseNoOf(els[els.length - 1]);
    var head = rf.replace(/\d+(:\d+)?([–-][\d:]+)?(,\s*[\d:]+)*$/, '');
    var ch = (rf.match(/(\d+):/) || [0, ''])[1];
    if (String(v1).indexOf(':') > 0) return head + v1 + (v2 !== v1 ? '–' + v2 : '');
    return head + ch + ':' + v1 + (v2 > v1 ? '–' + v2 : '');
  }
  return rf;
}
function hlText(els) { var t = ''; eachA(els, function (e) { t += e.textContent + (isEN() ? ' ' : ''); }); return trim(t.replace(/\s+/g, ' ')); }
function spanApply(list, el, h, n) { var i = list.indexOf(el); if (i < 0) return h; n = Math.max(1, Math.min(n, list.length - i)); var part = list.slice(i, i + n); h.sp = n; h.t = hlText(part); h.ref = hlRef(part); return h; }
function onSentTap(el) {
  if (el.getAttribute('data-op') != null) { var own = findOwner(el); if (own) return openHlSheet(own); }
  var k = hlKeyOf(el); if (!k) return;
  if (!S.hl[k]) {
    var b = blkOf(el), list = sentList();
    var h = { c: 'gold', n: '', sp: 1, t: '', ref: '', l: b.getAttribute('data-l'), b: b.getAttribute('data-b'), s: +el.getAttribute('data-s'), lang: L(), ts: now() };
    spanApply(list, el, h, 1); S.hl[k] = h; save(); paintHl(hlRoot()); toast(T('hlAdded'));
  } else openHlSheet(el);
}
function findOwner(el) { var list = sentList(), i = list.indexOf(el), k = el.getAttribute('data-op'); for (var j = i; j >= 0; j--) { if (hlKeyOf(list[j]) === k) return list[j]; } return null; }
function paintHl(root) {
  if (!root) return; var list = sentList(root), cover = [];
  eachA(list, function (el, i) { var k = hlKeyOf(el), h = k && S.hl[k]; if (!h) return; var n = Math.max(1, +h.sp || 1); for (var d = 0; d < n && i + d < list.length; d++) cover[i + d] = { h: h, head: d === 0, k: k }; });
  eachA(list, function (el, i) {
    var o = cover[i];
    if (o) { el.setAttribute('data-hl', '1'); el.setAttribute('data-color', o.h.c); if (o.head) el.removeAttribute('data-op'); else el.setAttribute('data-op', o.k); }
    else { el.removeAttribute('data-hl'); el.removeAttribute('data-color'); el.removeAttribute('data-op'); }
  });
  eachA(qa('.hl-note', root), function (n) { n.parentNode.removeChild(n); });
  var lastBlk = null, after = null;
  eachA(list, function (el, i) {
    var o = cover[i]; if (!o || !o.head || !o.h.n) return; var b = blkOf(el); if (!b) return;
    if (b !== lastBlk) { lastBlk = b; after = b; }
    var d = document.createElement('div'); d.className = 'hl-note'; d.setAttribute('data-color', o.h.c); d.setAttribute('data-hk', o.k); d.textContent = o.h.n;
    if (after.nextSibling) after.parentNode.insertBefore(d, after.nextSibling); else after.parentNode.appendChild(d); after = d;
  });
}
function closeHSheet() { var m = $('#hsheet'); if (m) m.parentNode.removeChild(m); }
function openHSheet(html) { closeHSheet(); var m = document.createElement('div'); m.id = 'hsheet'; m.className = 'sheet-mask'; m.innerHTML = '<div class="sheet-card">' + html + '</div>'; document.body.appendChild(m); m.onclick = function (e) { if (e.target === m) closeHSheet(); }; return m; }
var hlCur = null;
function openHlSheet(el) {
  var k = hlKeyOf(el), h = S.hl[k]; if (!h) return; hlCur = { el: el, k: k, h: h };
  var sw = ''; eachA(HL_COLORS, function (c) { sw += '<button class="hlswatch' + (h.c === c ? ' on' : '') + '" data-act="hlc" data-c="' + c + '" style="background:' + HL_SWATCH[c] + '" aria-label="' + c + '"></button>'; });
  openHSheet('<div class="sheet-title">' + T('hlTitle') + '<span class="sheet-ref" id="hlRef">' + esc(h.ref) + '</span></div>' +
    '<span class="sheet-quote" id="hlQuote">' + esc(h.t) + '</span>' +
    '<div class="sheet-row"><span class="sheet-lab">' + T('hlColor') + '</span><div class="swatches">' + sw + '</div></div>' +
    '<div class="sheet-row"><span class="sheet-lab">' + T('hlSpan') + '</span><div class="spanrow"><button class="spanbtn" data-act="hlsp" data-d="-1">－</button><span class="spannum" id="hlNum">' + T('spanUnit', h.sp) + '</span><button class="spanbtn" data-act="hlsp" data-d="1">＋</button><button class="spanbtn wide" data-act="hlsp" data-d="p">' + T('spanP') + '</button></div></div>' +
    '<textarea class="sheet-ta" id="hlNote" placeholder="' + esc(T('hlNotePH')) + '">' + esc(h.n || '') + '</textarea>' +
    '<div class="sheet-acts"><button class="btn pri" data-act="hlsave">' + T('save') + '</button><button class="btn" data-act="hlask">' + svgI('chat') + ' ' + T('askXz') + '</button></div>' +
    '<div class="sheet-acts2"><button class="btn sm gold" data-act="hlcard">' + svgI('img') + ' ' + T('makeCard') + '</button><button class="btn sm" data-act="hlread">' + svgI('sound') + ' ' + T('readThis') + '</button><button class="btn sm" data-act="hlcopy">' + T('copy') + '</button><button class="btn sm" data-act="hlshare">' + T('share') + '</button><button class="btn sm" style="color:var(--bad)" data-act="hldel">' + T('hlDel') + '</button></div>');
}
function hlNoteGrab() { var ta = $('#hlNote'); if (ta && hlCur) { hlCur.h.n = trim(ta.value); save(); } }
function hlSpan(d) {
  if (!hlCur) return; var list = sentList(), h = hlCur.h, el = hlCur.el, n;
  if (d === 'p') { var b = blkOf(el), i = list.indexOf(el); n = 1; while (i + n < list.length && blkOf(list[i + n]) === b) n++; toast(n === h.sp ? T('spanIsP') : T('spanDoneP', n)); }
  else n = (h.sp || 1) + (+d);
  spanApply(list, el, h, n); save(); paintHl(hlRoot()); $('#hlQuote').textContent = h.t; $('#hlNum').textContent = T('spanUnit', h.sp); $('#hlRef').textContent = h.ref;
}
function hlShareText(h) { return Q(h.t) + '\n—— ' + h.ref + (h.n ? '\n\n' + h.n : '') + '\n\n' + T('appName') + ' · ' + T('fellowshipName'); }
function hlListHtml() {
  var arr = [], h = ''; for (var k in S.hl) { var x = S.hl[k]; if ((x.lang || 'zh') === L()) arr.push([k, x]); }
  arr.sort(function (a, b) { return b[1].ts - a[1].ts; });
  if (!arr.length) return '<div class="empty">' + esc(T('noHl')) + '<br><span class="xs">' + esc(T('hlTip')) + '</span></div>';
  h = '<div class="card" style="padding:4px 16px">';
  eachA(arr, function (e) {
    var x = e[1];
    h += '<div class="hitem"><div class="q" data-c="' + x.c + '">' + esc(x.t) + '</div>' + (x.n ? '<div class="n">' + esc(x.n) + '</div>' : '') +
      '<div class="m"><span>' + esc(x.ref) + '</span><span><button data-act="hlgo" data-l="' + x.l + '">↗</button><button data-act="hlcard2" data-k="' + esc(e[0]) + '">' + svgI('img') + '</button><button data-act="hldel2" data-k="' + esc(e[0]) + '">✕</button></span></div></div>';
  });
  return h + '</div>';
}
function favListHtml() {
  if (!S.fav.length) return '<div class="empty">' + esc(T('noFav')) + '</div>'; var h = '<div class="card" style="padding:4px 16px">';
  eachA(S.fav.slice().reverse(), function (f, i) { h += '<div class="hitem"><div class="md">' + mdToHtml(f.text) + '</div><div class="m"><span>' + (f.ts ? fmtDate(f.ts) : '') + '</span><span><button data-act="favcard" data-i="' + (S.fav.length - 1 - i) + '">' + svgI('img') + '</button><button data-act="favdel" data-i="' + (S.fav.length - 1 - i) + '">✕</button></span></div></div>'; });
  return h + '</div>';
}
function vMarks_ext() {
  var sub = R.sub.marks || 'hl';
  var h = topbar(T('fHl') + ' · ' + T('fFav'), true);
  h += '<div class="seg"><button class="' + (sub === 'hl' ? 'on' : '') + '" onclick="R.sub.marks=\'hl\';render()">' + esc(T('fHl')) + '</button><button class="' + (sub === 'fav' ? 'on' : '') + '" onclick="R.sub.marks=\'fav\';render()">' + esc(T('fFav')) + '</button></div>';
  h += sub === 'hl' ? hlListHtml() : favListHtml();
  setApp(h);
}

/* ---------- 朗讀（逐句跟讀標示） ---------- */
var TTS_RETRY = [800, 1600], TTS_LOOK = 2, RA_COOL = 4000;
var spk = { on: false, items: [], idx: 0, cache: {}, native: false, abort: false }, raManualAt = 0, ttsEl = null, ttsUnlocked = false, ttsLastErr = '', sayKey = null, wakeLock = null;
/* 多音字：照上下文改成同音字再送語音（只影響聲音，不影響畫面）。先長詞、後短詞；繁簡兩組。
   建置時要跑多音字盤點（技能第 8 節），把內容裡新出現的詞補進來。 */
var TTS_FIX = [
  [/(與主|與神|與祂|與他|與你|與我|一起|彼此|和主|跟主|同心)同行/g, '$1同形'], [/(与主|与神|与祂|与他|与你|与我|一起|彼此|和主|跟主|同心)同行/g, '$1同形'],
  [/重生/g, '蟲生'], [/重擔/g, '眾擔'], [/重担/g, '众担'],
  [/差遣/g, '拆遣'], [/差派/g, '拆派'], [/差役/g, '拆役'],
  [/背起/g, '揹起'], [/背負/g, '揹負'], [/背负/g, '揹负'], [/背著/g, '揹著'], [/背着/g, '揹着'],
  [/得著/g, '得着'], [/數算/g, '鼠算'], [/数算/g, '鼠算'], [/朝拜/g, '潮拜'], [/朝見/g, '潮見'], [/朝见/g, '潮见'],
  [/長老/g, '掌老'], [/長子/g, '掌子'], [/家長/g, '家掌'], [/長大/g, '掌大'], [/長執/g, '掌執'], [/長進/g, '掌進'], [/成長/g, '成掌'], [/生長/g, '生掌'], [/年長/g, '年掌'], [/長輩/g, '掌輩'], [/師長/g, '師掌'], [/兄長/g, '兄掌'],
  [/长老/g, '掌老'], [/长子/g, '掌子'], [/长大/g, '掌大'], [/长执/g, '掌执'], [/长进/g, '掌进'], [/成长/g, '成掌'], [/生长/g, '生掌'], [/年长/g, '年掌'], [/长辈/g, '掌辈'], [/师长/g, '师掌'], [/兄长/g, '兄掌'],
  [/行為/g, '行圍'], [/為大/g, '圍大'], [/行为/g, '行围'], [/为大/g, '围大'], [/中了/g, '衷了'], [/中間/g, '衷間'], [/中间/g, '衷间'],
  [/教會/g, '叫會'], [/教会/g, '叫会'], [/傳道/g, '船道'], [/传道/g, '船道'], [/傳記/g, '賺記'], [/传记/g, '赚记'],
  [/應當/g, '英當'], [/應許/g, '英許'], [/应当/g, '英当'], [/应许/g, '英许'], [/相應/g, '相映'], [/相应/g, '相映'],
  [/([組组團团校部首夫牧區区會会社])長/g, '$1掌'], [/([組组團团校部首夫牧區区會会社])长/g, '$1掌'], [/長出/g, '掌出'], [/长出/g, '掌出'], [/長者/g, '掌者'], [/长者/g, '掌者'],
  [/行傳/g, '行賺'], [/行传/g, '行赚'], [/數到/g, '鼠到'], [/数到/g, '鼠到'], [/數一數/g, '鼠一鼠'], [/数一数/g, '鼠一鼠'], [/(主|神|祂|祢|他|她)差(人|我|你|他|她|祂)/g, '$1拆$2'],
  [/看守/g, '刊守'], [/種子/g, '腫子'], [/种子/g, '肿子'], [/年少/g, '年紹'], [/好施/g, '耗施']
];
var SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';
var BK_ZH = '亞:撒迦利亞書|代上:歷代志上|代下:歷代志下|以弗所:以弗所書|以弗所書|以斯帖:以斯帖記|以斯帖記|以斯拉:以斯拉記|以斯拉記|以西結:以西結書|以西結書|以賽亞:以賽亞書|以賽亞書|伯:約伯記|但:但以理書|但以理:但以理書|但以理書|何:何西阿書|何西阿:何西阿書|何西阿書|使徒行傳|來:希伯來書|俄:俄巴底亞書|俄巴底亞:俄巴底亞書|俄巴底亞書|傳:傳道書|傳道書|出:出埃及記|出埃及:出埃及記|出埃及記|列王紀上|列王紀下|利:利未記|利未記|創:創世記|創世記|加:加拉太書|加拉太:加拉太書|加拉太書|可:馬可福音|哀:耶利米哀歌|哈:哈巴谷書|哈巴谷:哈巴谷書|哈巴谷書|哈該書|哥林多前:哥林多前書|哥林多前書|哥林多後:哥林多後書|哥林多後書|啟:啟示錄|啟示錄|士:士師記|士師記|多:提多書|太:馬太福音|尼:尼希米記|尼希米:尼希米記|尼希米記|希伯來:希伯來書|希伯來書|帖前:帖撒羅尼迦前書|帖後:帖撒羅尼迦後書|帖撒羅尼迦前:帖撒羅尼迦前書|帖撒羅尼迦前書|帖撒羅尼迦後:帖撒羅尼迦後書|帖撒羅尼迦後書|弗:以弗所書|彌:彌迦書|彌迦書|彼前:彼得前書|彼後:彼得後書|彼得前:彼得前書|彼得前書|彼得後:彼得後書|彼得後書|徒:使徒行傳|得:路得記|拉:以斯拉記|拿:約拿書|提前:提摩太前書|提多書|提後:提摩太後書|提摩太前:提摩太前書|提摩太前書|提摩太後:提摩太後書|提摩太後書|摩:阿摩司書|撒上:撒母耳記上|撒下:撒母耳記下|撒母耳記上|撒母耳記下|撒迦利亞:撒迦利亞書|撒迦利亞書|斯:以斯帖記|書:約書亞記|林前:哥林多前書|林後:哥林多後書|歌:雅歌|歌羅西:歌羅西書|歌羅西書|歷代志上|歷代志下|民:民數記|民數記|猶:猶大書|猶大書|王上:列王紀上|王下:列王紀下|珥:約珥書|瑪:瑪拉基書|瑪拉基:瑪拉基書|瑪拉基書|申:申命記|申命記|番:西番雅書|箴:箴言|箴言|約:約翰福音|約一:約翰一書|約三:約翰三書|約二:約翰二書|約亞:約書亞記|約伯記|約參:約翰三書|約壹:約翰一書|約拿書|約書亞記|約珥書|約翰一:約翰一書|約翰一書|約翰三:約翰三書|約翰三書|約翰二:約翰二書|約翰二書|約翰福音|約貳:約翰二書|結:以西結書|羅:羅馬書|羅馬書|耶:耶利米書|耶利米:耶利米書|耶利米哀歌|耶利米書|腓:腓立比書|腓利門:腓利門書|腓利門書|腓立比:腓立比書|腓立比書|西:歌羅西書|西番雅:西番雅書|西番雅書|詩:詩篇|詩篇|該:哈該書|賽:以賽亞書|路:路加福音|路加福音|路得記|那鴻書|門:腓利門書|阿摩司:阿摩司書|阿摩司書|雅:雅各書|雅各書|雅歌|馬可福音|馬太福音|鴻:那鴻書';
/* 简体书名表放在 lang-zs.json 的 bkzs（建置時由 app/bk_zs.txt 寫入），主檔省空間 */
var BKM = {};
function bookMap() { var k = isZS() ? 'zs' : 'zh'; if (BKM[k]) return BKM[k]; var m = {}; eachA((k === 'zs' ? T('bkzs') : BK_ZH).split('|'), function (p) { var a = p.split(':'); m[a[0]] = a[1] || a[0]; }); return (BKM[k] = m); }
/* 出處唸成全名：「創 1:26」→「創世記1章26節」、「詩 23:1-3」→「詩篇23篇1到3節」；前面若黏著別的中文字，只取最長的書名後綴；找不到書名就原樣不動（避免「大約 3:2」被唸成經文） */
function ttsRef(x) {
  return String(x || '').replace(/([^\s\d:：，。、；（）「」！？]{1,12}|[1-3]?\s?[A-Z][a-z]+\.?(?: of [A-Z][a-z]+)?)\s?(\d+)[:：](\d+)(?:\s*[–\-~～至]\s*(\d+))?/g, function (m, bk, c, v, v2) {
    if (isEN()) return bk.replace(/\.$/, '') + ' chapter ' + c + (v2 ? ' verses ' + v + ' to ' + v2 : ' verse ' + v);
    var mp = bookMap(), pre = null, full = '';
    for (var k = 0; k < bk.length; k++) { var suf = bk.slice(k); if (mp[suf]) { pre = bk.slice(0, k); full = mp[suf]; break; } }
    if (pre === null) return m;
    var ps = /^詩篇$|^诗篇$/.test(full); return pre + full + c + (ps ? '篇' : '章') + v + (v2 ? '到' + v2 : '') + (isZS() ? '节' : '節');
  });
}
/* 表情符號、箭頭、裝飾符號不唸（ES5 不能用 \u{}，用代理對範圍） */
var EMOJI_RE = /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF]|[←-⇿⌀-⏿■-➿⬀-⯿☀-⛿︎️‍⃣〰〽™ℹ]/g;
/* 括號裡只有經文出處（可帶「參／見／另見／cf./see」）就整段不唸：「…（林前12:27）」「(John 3:16; Rom 5:8)」 */
var REF_ONE = /^\s*(?:(?:參|参|見|见|另見|另见|參看|参看|參考|参考|cf\.?|see|See)\s*)?(?:(?:[1-3一二三]\s?)?[一-鿿]{1,6}|(?:[1-3]\s?)?[A-Z][a-z]+\.?(?:\s(?:of\s)?[A-Z][a-z]+)*)?\s*\d+(?:\s*[:：]\s*\d+(?:\s*[-–—~～至]\s*\d+)?)?(?:\s*[章節节篇])?(?:\s*[-–—~～至]\s*\d+(?:\s*[:：]\s*\d+)?)?\s*$/;
function isRefParen(inner) { var ps = String(inner).split(/[；;、，,]/), ok = 0; for (var i = 0; i < ps.length; i++) { if (!trim(ps[i])) continue; if (!REF_ONE.test(ps[i])) return false; ok++; } return ok > 0; }
function dropRefParens(x) { return x.replace(/([，,]?\s*(?:參|参|見|见|see|cf\.?)\s*)?[（(]([^（）()]{1,80})[）)]/g, function (m, lead, inner) { return isRefParen(inner) ? '' : m; }); }
function ttsPrep(s) {
  var x = dropRefParens(String(s || '')).replace(/〔[^〕]*〕/g, '').replace(/\[[^\]]*\]/g, '').replace(EMOJI_RE, '');
  x = ttsRef(x);
  if (isEN()) return trim(x.replace(/[*#>`_~|]/g, '').replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1'));
  x = x.replace(/[「」『』（）()〔〕\[\]《》〈〉*#>`_~|]/g, '').replace(/[—－]{1,2}/g, '，').replace(/321/g, '三二一').replace(/920/g, '九二零').replace(/235/g, '二三五');
  eachA(TTS_FIX, function (f) { x = x.replace(f[0], f[1]); }); return trim(x.replace(/[ \t]{2,}/g, ' '));
}
function ttsAudio() { if (!ttsEl) { ttsEl = new Audio(); ttsEl.preload = 'auto'; try { ttsEl.setAttribute('playsinline', ''); } catch (e) { } } return ttsEl; }
function ttsUnlock() { if (ttsUnlocked) return; try { var a = ttsAudio(); a.src = SILENT_WAV; var p = a.play(); if (p && p.then) p.then(function () { ttsUnlocked = true; }, function () { }); else ttsUnlocked = true; } catch (e) { } }
function ttsFetch(text, cb, tries) {
  tries = tries || 0;
  if (!S.set.human || navigator.onLine === false) { cb(null); return; }
  ajax('POST', SVC.tts, { voice: voiceName(), rate: rateAttr(), sil: 140, silc: 140, sile: 260, text: text }, 'arraybuffer', function (st, buf) {
    if (st === 200 && buf && buf.byteLength > 128) { cb(URL.createObjectURL(new Blob([buf], { type: 'audio/mpeg' }))); return; }
    ttsLastErr = st ? 'http ' + st : 'network';
    if (tries < TTS_RETRY.length) setTimeout(function () { ttsFetch(text, cb, tries + 1); }, TTS_RETRY[tries]); else cb(null);
  });
}
function keepAwake(on) { try { if (on && navigator.wakeLock && !wakeLock) { navigator.wakeLock.request('screen').then(function (w) { wakeLock = w; }, function () { }); } else if (!on && wakeLock) { wakeLock.release(); wakeLock = null; } } catch (e) { } }
function mediaSession(title) {
  try {
    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: title || T('appName'), artist: T('fellowshipName'), artwork: [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }] });
      navigator.mediaSession.setActionHandler('pause', function () { ttsPause(); }); navigator.mediaSession.setActionHandler('play', function () { ttsResume(); }); navigator.mediaSession.setActionHandler('stop', function () { stopAll(); });
      try { navigator.mediaSession.setActionHandler('previoustrack', function () { spkSkip(-1); }); navigator.mediaSession.setActionHandler('nexttrack', function () { spkSkip(1); }); } catch (e) { }
    }
  } catch (e) { }
}
/* 跨進新段落時，先用自然口吻帶一句（「接下來是〈想〉」「如果想更多一點…」），再唸內文 */
function secOf(e) { var n = e; while (n && n !== document) { if (n.className && /(^|\s)sec(\s|$)/.test(String(n.className))) return n; n = n.parentNode; } return null; }
function secLead(sec) {
  var say = sec && sec.getAttribute && sec.getAttribute('data-say'); if (say && !/^say_/.test(say)) return say;
  var l = sec && sec.querySelector && sec.querySelector('.lbl'); if (!l) return ''; var sp = l.querySelectorAll('span:not(.k)'), t = trim((sp.length ? sp[sp.length - 1].textContent : l.textContent).replace(/🔊.*$/, '').replace(EMOJI_RE, '')); if (!t) return '';
  if (/想更多|延伸|多想|再想|深思|Think (more|further)|Going deeper/i.test(t)) return isEN() ? 'If you want to think further, consider this. ' : '如果想更多一點，可以這樣想。';
  if (/禱告|祷告|Pray/i.test(t)) return isEN() ? 'Let us pray together. ' : '讓我們一起禱告。';
  return isEN() ? 'Next: ' + t + '. ' : '接下來是「' + t + '」。';
}
function buildQueue(root, fromTop) {
  var els = sentList(root), from = 0, lastSec = null;
  if (!fromTop) for (var i = 0; i < els.length; i++) { if (els[i].getBoundingClientRect().bottom > 60) { from = i; break; } }
  els = els.slice(from); var items = [], cur = { text: '', segs: [], lens: [], at: -1 }, MAX = isEN() ? 320 : 130;
  eachA(els, function (e) {
    var sc = secOf(e), lead = (sc && sc !== lastSec) ? secLead(sc) : ''; lastSec = sc;
    var t = e.textContent; if ((lead || cur.text.length + t.length > MAX) && cur.text) { items.push(cur); cur = { text: '', segs: [], lens: [], at: -1 }; }
    cur.text += lead + t + (isEN() ? ' ' : ''); cur.segs.push(e); cur.lens.push(Math.max(1, ttsPrep(lead + t).length));
  });
  if (cur.text) items.push(cur); var out = []; eachA(items, function (it) { if (ttsPrep(it.text)) out.push(it); }); return out;
}
function raClear() { eachA(qa('.tts-reading'), function (e) { e.className = e.className.replace(/\s*tts-reading/g, ''); }); }
function raSeg(item, k) {
  if (!item || !item.segs.length) return; k = Math.max(0, Math.min(k, item.segs.length - 1));
  if (item.at === k && document.querySelector('.tts-reading')) return; item.at = k; raClear(); var e = item.segs[k]; if (!e || !e.parentNode) return;
  e.className += ' tts-reading'; if (window.CR) CR.mark(e); if (now() - raManualAt > RA_COOL) { try { e.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (x) { } }
}
function raProgress(item, ratio) {
  if (!item || item.lens.length < 2 || !(ratio >= 0)) return; var tot = 0, acc = 0, k = 0, j; for (j = 0; j < item.lens.length; j++) tot += item.lens[j];
  var tg = Math.min(ratio, 1) * tot; for (j = 0; j < item.lens.length; j++) { acc += item.lens[j]; k = j; if (tg < acc) break; } raSeg(item, k);
}
function ttsBtnState(st) { eachA(qa('.ttsb'), function (b) { b.setAttribute('data-state', st || ''); b.innerHTML = svgI(st === 'playing' || st === 'loading' ? 'pause' : (st === 'paused' ? 'play' : 'sound')); }); drawSpk(); }
/* 暫停／繼續：暫停時記住正在唸的段落與句子；繼續時從原處接著唸，唸完自動往下一段 */
function ttsPause() {
  if (!spk.on || spk.paused) return; spk.paused = true; spk.pausedAt = now();
  try { if (ttsEl && !spk.native) ttsEl.pause(); } catch (e) { }
  if (spk.native) { spk.nId = (spk.nId || 0) + 1; try { speechSynthesis.cancel(); } catch (e) { } }
  try { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'; } catch (e) { }
  keepAwake(false); ttsBtnState('paused');
}
function ttsResume() {
  if (!spk.on || !spk.paused) return; spk.paused = false; ttsUnlock(); keepAwake(true); raManualAt = 0;
  try { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing'; } catch (e) { }
  var i = spk.idx, it = spk.items[i]; if (!it) { stopAll(); return; }
  if (!spk.native && ttsEl && spk.cache[i] && ttsEl.src === spk.cache[i] && !ttsEl.ended) {
    ttsBtnState('playing'); var p = ttsEl.play(); if (p && p['catch']) p['catch'](function () { if (spk.on && !spk.paused) ttsPlayFrom(i); }); return;
  }
  if (spk.native) { ttsNativeFrom(i, Math.max(0, it.at)); return; }
  ttsPlayFrom(i);
}
function ttsToggle() { if (!spk.on) return; if (spk.paused) ttsResume(); else ttsPause(); }
/* root：要朗讀的範圍；fromTop：從範圍開頭（否則從畫面可見處） */
function ttsPage(root, fromTop, title) {
  if (spk.on) { ttsToggle(); return; } ttsUnlock();
  var items = buildQueue(root || hlRoot(), fromTop); if (!items.length) return;
  spk = { on: true, paused: false, items: items, idx: 0, cache: {}, native: false, abort: false, title: title || '' }; ttsBtnState('loading'); keepAwake(true); mediaSession(title); ttsPlayFrom(0);
}
function ttsSec(btn) { var sec = btn; while (sec && !(sec.className && String(sec.className).indexOf('sec') >= 0)) sec = sec.parentNode; ttsPage(sec || hlRoot(), true, (window.LCUR && LCUR.title) || ''); }
function ttsPrefetch(i, cb) { var it = spk.items[i]; if (!it || spk.cache[i] !== undefined) { if (cb) cb(); return; } spk.cache[i] = 0; ttsFetch(ttsPrep(it.text), function (u) { spk.cache[i] = u; if (cb) cb(); }); }
function ttsPlayFrom(i) {
  if (!spk.on || spk.abort || spk.paused) return; if (i >= spk.items.length) { stopAll(); return; }
  spk.idx = i; spk.items[i].at = -1; raSeg(spk.items[i], 0); drawSpk();
  var go2 = function () {
    for (var k = i + 1; k <= i + TTS_LOOK; k++) ttsPrefetch(k); if (!spk.on || spk.abort || spk.paused || spk.idx !== i) return; var url = spk.cache[i];
    if (!url) { ttsNativeFrom(i); return; }
    ttsBtnState('playing'); var a = ttsAudio(); a.onended = null; a.onerror = null; a.ontimeupdate = null; a.src = url;
    a.ontimeupdate = function () { if (!spk.on || spk.idx !== i) return; var d = a.duration; if (d && isFinite(d)) raProgress(spk.items[i], a.currentTime / d); };
    a.onended = function () { a.ontimeupdate = null; if (spk.on && !spk.abort && !spk.paused) ttsPlayFrom(i + 1); };
    a.onerror = function () { if (spk.on && !spk.abort) ttsNativeFrom(i); };
    var p = a.play(); if (p && p['catch']) p['catch'](function () { if (spk.on && !spk.abort && !spk.paused) ttsNativeFrom(i); });
  };
  if (spk.cache[i] === undefined) ttsPrefetch(i, go2); else if (spk.cache[i] === 0) { var w = setInterval(function () { if (spk.cache[i] !== 0 || !spk.on) { clearInterval(w); go2(); } }, 120); } else go2();
}
function nativeLang() { return isEN() ? 'en-US' : (isZS() ? 'zh-CN' : 'zh-TW'); }
function ttsNativeFrom(i, fromSeg) {
  if (!('speechSynthesis' in window)) { toast(T('ttsErr')); stopAll(); return; }
  if (!spk.native) { spk.native = true; if (S.set.human) toast(T('ttsFallback') + (ttsLastErr ? '（' + ttsLastErr + '）' : '')); }
  if (spk.paused) return; if (!spk.on || spk.abort || i >= spk.items.length) { stopAll(); return; }
  var it = spk.items[i], f = fromSeg > 0 ? Math.min(fromSeg, it.segs.length - 1) : 0, id = spk.nId = (spk.nId || 0) + 1;
  spk.idx = i; it.at = -1; raSeg(it, f); ttsBtnState('playing');
  var src = it.text; if (f > 0) { src = ''; for (var j = f; j < it.segs.length; j++) src += it.segs[j].textContent + (isEN() ? ' ' : ''); }
  var off = 0; if (f > 0) for (var j2 = 0; j2 < f; j2++) off += it.lens[j2];
  var tot = 0; eachA(it.lens, function (l) { tot += l; });
  var say = ttsPrep(src), u = new SpeechSynthesisUtterance(say); u.lang = nativeLang(); u.rate = .95 + S.set.rate * .05;
  u.onboundary = function (e) { if (spk.on && spk.idx === i && id === spk.nId && say.length) raProgress(it, f > 0 ? (off + (e.charIndex || 0)) / tot : (e.charIndex || 0) / say.length); };
  u.onend = function () { if (spk.on && !spk.abort && !spk.paused && id === spk.nId) ttsNativeFrom(i + 1); }; u.onerror = u.onend;
  try { speechSynthesis.speak(u); } catch (e) { stopAll(); }
}
/* 單段朗讀（小智回答、畫線、試聽） */
function speakText(text, key, onEnd) {
  stopAll(); ttsUnlock(); sayKey = key || 'x'; paintSay(); keepAwake(true); drawSpk();
  var clean = ttsPrep(text).slice(0, 1500); if (!clean) { stopAll(); return; }
  var done = function () { if (sayKey === (key || 'x')) { sayKey = null; paintSay(); keepAwake(false); drawSpk(); } if (onEnd) onEnd(); };
  ttsFetch(clean, function (url) {
    if (sayKey !== (key || 'x')) return;
    if (url) { var a = ttsAudio(); a.onended = done; a.onerror = done; a.ontimeupdate = null; a.src = url; var p = a.play(); if (p && p['catch']) p['catch'](function () { nat(); }); }
    else nat();
  });
  function nat() { if ('speechSynthesis' in window) { var u = new SpeechSynthesisUtterance(clean); u.lang = nativeLang(); u.onend = done; u.onerror = done; speechSynthesis.speak(u); } else { toast(T('ttsErr')); done(); } }
}
function speak(text, title) { speakText(text, 'x'); }
function paintSay() { eachA(qa('[data-act="msgtts"]'), function (b) { var on = sayKey === 'm' + b.getAttribute('data-i'); b.className = 'msg-act' + (on ? ' on' : ''); b.innerHTML = on ? '⏸' : '🔊'; }); }
function stopAll() {
  spk.on = false; spk.abort = true; spk.paused = false; sayKey = null; try { if (ttsEl) { ttsEl.pause(); } } catch (e) { }
  try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } raClear(); ttsBtnState(''); paintSay(); keepAwake(false); drawSpk();
}
function stopSpeak() { stopAll(); }
function drawSpk() {
  var el = $('#spk'), on = spk.on || !!sayKey;
  if (!on) { if (el) el.parentNode.removeChild(el); return; }
  if (!el) { el = document.createElement('div'); el.id = 'spk'; el.className = 'spk'; document.body.appendChild(el); }
  var prog = spk.on && spk.items.length ? ' · ' + (spk.idx + 1) + '/' + spk.items.length : '';
  if (spk.on && spk.paused) prog += ' · ' + T('ttsPaused');
  el.innerHTML = '<span class="t">🔊 ' + esc(spk.title || T('reading')) + prog + '</span>' + (spk.on ? '<button onclick="spkSkip(-1)" aria-label="prev">⏮</button><button class="pp" onclick="ttsToggle()" aria-label="' + (spk.paused ? 'resume' : 'pause') + '">' + (spk.paused ? '▶' : '⏸') + '</button><button onclick="spkSkip(1)" aria-label="next">⏭</button>' : '') + '<button onclick="stopAll()" aria-label="stop">■</button>';
}
function spkSkip(n) { if (!spk.on) return; spk.paused = false; spk.nId = (spk.nId || 0) + 1; keepAwake(true); var k = Math.max(0, Math.min(spk.items.length - 1, spk.idx + n)); try { if (ttsEl) { ttsEl.onended = null; ttsEl.pause(); } if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } raManualAt = 0; ttsPlayFrom(k); }
window.addEventListener('touchmove', function () { raManualAt = now(); }, { passive: true });
window.addEventListener('wheel', function () { raManualAt = now(); }, { passive: true });

/* ---------- 小智（美編排版） ---------- */
var chatBusy = false, chatPending = null, chatCtx = null, XZ = { open: false, ctx: '' };
function tbRow(x) { return /^\s*\|.*\|\s*$/.test(x); }
function tbSep(x) { return /^\s*\|[\s:|\-]+\|\s*$/.test(x) && x.indexOf('-') >= 0; }
function tbCells(x) { var a = trim(x).replace(/^\||\|$/g, '').split('|'), o = []; eachA(a, function (c) { o.push(trim(c)); }); return o; }
function mdTableMap(src, fmt) {
  var Ls = String(src || '').split('\n'), out = [], i = 0;
  while (i < Ls.length) {
    if (tbRow(Ls[i]) && i + 1 < Ls.length && tbSep(Ls[i + 1])) { var head = tbCells(Ls[i]); i += 2; var rows = []; while (i < Ls.length && tbRow(Ls[i])) { rows.push(tbCells(Ls[i])); i++; } out.push(rows.length ? fmt(head, rows) : head.join(' ')); continue; }
    out.push(Ls[i]); i++;
  }
  return out.join('\n');
}
function mdStrip(x) {
  return trim(mdTableMap(String(x || ''), function (head, rows) { var ls = [], hh = []; eachA(head, function (c) { if (c) hh.push(c); }); if (hh.length) ls.push(hh.join(' → ')); eachA(rows, function (r) { var r2 = []; eachA(r, function (c) { if (c) r2.push(c); }); ls.push('・' + r2.join(' → ')); }); return ls.join('\n'); })
    .replace(/^#{1,6} /gm, '').replace(/\*\*([\s\S]+?)\*\*/g, '$1').replace(/\*([\s\S]+?)\*/g, '$1').replace(/\*/g, '')
    .replace(/^> ?/gm, '').replace(/^---+$/gm, '').replace(/^[-*] /gm, '・').replace(/`+/g, '').replace(/\n{3,}/g, '\n\n'));
}
/* 小智回答說成自然的口語。先把整篇切成區塊、看前後文再決定怎麼帶入：
   小標題輪替「先談／再來看／接下來談／最後談」；條列依內容選方式——短詞併成一句、
   有粗體標籤用「首先是X／再來是X／最後是X」、步驟或編號用「第一、第二」（照原編號，中間隔說明段也不重來）、
   一般句子用「首先／另外／還有／最後」，只有一項就不加；已自帶連接詞不重複。表情符號與出處括號都不唸 */
var NUMZH = ['第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十'], NUMEN = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
var CNUM = '一二三四五六七八九十';
function endP(t) { t = trim(t); return !t ? '' : (/[。！？.!?：:」』”]$/.test(t) ? t : t + (isEN() ? '.' : '。')); }
function mdTok(t) {
  var m, b = t.match(/^\*\*([^*]+)\*\*[：:]?$/), u = b ? trim(b[1]) : t;
  if ((m = u.match(/^(\d{1,2})[.、）)．]\s*(.+)$/)) || (m = u.match(/^[（(]?([一二三四五六七八九十])[)）、.．]\s*(.+)$/))) {
    var n = /\d/.test(m[1]) ? +m[1] : CNUM.indexOf(m[1]) + 1; return { k: 'li', n: n, t: m[2], hd: !!b };
  }
  if ((m = t.match(/^(?:[-*+]\s+|・\s*|•\s*)(.+)$/))) return { k: 'li', n: 0, t: m[1] };
  return { k: 'p', t: t };
}
var LEADW = /^(首先|其次|另外|還有|还有|再來|再来|最後|最后|第[一二三四五六七八九十]|一方面|另一方面|同時|同时|此外|所以|因此|First|Second|Third|Also|Next|Finally|Then|Another)/i;
var STEPW = /步驟|步骤|方法|做法|行動|行动|怎麼做|怎么做|如何|操練|操练|練習|练习|(兩|两|二|三|四|五|六|七|幾|几)(個|个|件|點|点|步|方面|種|种)|steps?|ways|how to|practices|things/i;
function mdSpeak(md) {
  var zh = !isEN(), nq = 0, SP = zh ? '' : ' ';
  var src = mdTableMap(String(md || '').replace(/(\d)️?⃣/g, '$1. ').replace(EMOJI_RE, ''), function (head, rows) {
    var out = [zh ? '我們用一個對照來整理。' : 'Let us lay this out side by side.'];
    eachA(rows, function (r, ri) {
      var p = [], lead = trim(r[0] || '');
      for (var j = 1; j < r.length; j++) { var c = trim(r[j] || ''), hd = trim(head[j] || ''); if (c) p.push(hd ? (zh ? hd + '是' + c : hd + ' is ' + c) : c); }
      var pre = rows.length > 1 && ri === rows.length - 1 ? (zh ? '最後，' : 'Finally, ') : '';
      out.push(endP(pre + (lead ? lead + (zh ? '：' : ': ') : '') + p.join(zh ? '，' : '; ')));
    });
    return '\u0001' + out.join('\n\u0001');
  });
  /* 1. 切成區塊 */
  var tk = [];
  eachA(src.split('\n'), function (ln) {
    var t = trim(ln), m;
    if (!t || /^---+$/.test(t)) { tk.push({ k: 'gap' }); return; }
    if (t.charAt(0) === '\u0001') { tk.push({ k: 'raw', t: t.slice(1) }); return; }
    if ((m = t.match(/^#{1,6}\s*(.+)$/))) { tk.push({ k: 'h', t: trim(m[1].replace(/[*_`]/g, '').replace(/[：:]$/, '')) }); return; }
    if ((m = t.match(/^>\s?(.*)$/))) { tk.push({ k: 'q', t: trim(m[1]) }); return; }
    tk.push(mdTok(t));
  });
  /* 2. 小標題：數一般標題，輪替帶入語 */
  var hs = [], i, j;
  for (i = 0; i < tk.length; i++) if (tk[i].k === 'h' && !/想更多|延伸|多想|再想|深思|Think (more|further)|Going deeper|禱告|祷告|Pray/i.test(tk[i].t)) hs.push(i);
  /* 3. 條列分組：中間空行不斷；有編號的清單中間夾說明段也算同一組 */
  var grp = [], cur = null, numG = null, nCnt = 0;
  for (i = 0; i < tk.length; i++) if (tk[i].k === 'li' && tk[i].n) nCnt++;
  for (i = 0; i < tk.length; i++) {
    var x = tk[i];
    if (x.k === 'gap') continue;
    if (x.k === 'h') { cur = numG = null; continue; }
    if (x.k === 'li' && x.n) {
      if (!numG || x.n !== numG.last + 1) { numG = { items: [], intro: introOf(i), num: true }; grp.push(numG); }
      numG.items.push(i); numG.last = x.n; x.g = numG; cur = null; continue;
    }
    if (x.k === 'li') {
      if (!cur || cur.lastI !== prevNonGap(i)) { cur = { items: [], intro: introOf(i), num: false }; grp.push(cur); }
      cur.items.push(i); cur.lastI = i; x.g = cur; continue;
    }
    cur = null;
  }
  function prevNonGap(k) { for (k--; k >= 0; k--) if (tk[k].k !== 'gap') return k; return -1; }
  function introOf(k) { var q = prevNonGap(k); return q >= 0 && tk[q].k !== 'li' ? tk[q].t || '' : ''; }
  eachA(grp, function (g) {
    var n = g.items.length, short = true, lab = 0, scr = 0;
    eachA(g.items, function (k) {
      var t = tk[k].t, plain = mdStrip(t);
      if (plain.length > (zh ? 14 : 48) || /[。！？.!?；;，,]/.test(plain.slice(0, -1))) short = false;
      if (/^\*\*[^*]+\*\*/.test(t) || tk[k].hd) lab++;
      if (/\d+\s*[:：]\s*\d+|[「『“]/.test(t)) scr++;
    });
    g.mode = g.num && nCnt > 1 ? 'ord' : n < 2 ? 'one' : scr === n ? 'plain' : (g.num || STEPW.test(g.intro)) ? 'ord' : lab * 2 >= n ? 'lab' : short ? 'enum' : 'conn';
    g.n = n;
  });
  /* 4. 說出來 */
  var res = [], CZ = ['首先，', '另外，', '還有，', '再來，', '同時，'], CE = ['First, ', 'Also, ', 'Next, ', 'On top of that, ', 'Then, '];
  for (i = 0; i < tk.length; i++) {
    var y = tk[i], t = y.t;
    if (y.k === 'gap') continue;
    if (y.k === 'raw') { res.push(t); continue; }
    if (y.k === 'h') {
      if (/想更多|延伸|多想|再想|深思|Think (more|further)|Going deeper/i.test(t)) res.push(zh ? '如果想更多一點，可以這樣想。' : 'If you want to think further, consider this.');
      else if (/禱告|祷告|Pray/i.test(t)) res.push(zh ? '讓我們一起禱告。' : 'Let us pray together.');
      else {
        var hi = hs.indexOf(i), hl = hs.length, w;
        if (hl === 1) w = zh ? '我們來談「' + t + '」。' : 'Let us talk about ' + t + '.';
        else if (hi === 0) w = zh ? '先談「' + t + '」。' : 'Let us start with ' + t + '.';
        else if (hi === hl - 1 && hl > 2) w = zh ? '最後談「' + t + '」。' : 'Finally, ' + t + '.';
        else w = zh ? ['接下來談「', '再來看「', '我們再看「'][(hi - 1) % 3] + t + '」。' : ['Next, let us look at ', 'Then, ', 'Now consider '][(hi - 1) % 3] + t + '.';
        res.push(w);
      }
      continue;
    }
    if (y.k === 'q') {
      if (!t) continue;
      var sc = /[「『“"]/.test(t) || /\d+\s*[:：]\s*\d+/.test(t);
      res.push((zh ? (sc ? '聖經說：' : (nq++ ? '還有一句：' : '有一句話特別要記住：')) : (sc ? 'Scripture says: ' : (nq++ ? 'And another: ' : 'Here is the line to remember: '))) + endP(t));
      continue;
    }
    if (y.k === 'li' && y.g) {
      var g = y.g, ix = g.items.indexOf(i), last = ix === g.n - 1 && g.n > 1, has = LEADW.test(mdStrip(t));
      if (g.mode === 'enum') {
        if (ix === 0) {
          var ws = []; eachA(g.items, function (k) { ws.push(mdStrip(tk[k].t).replace(/[。.]$/, '')); });
          res.push(endP(zh ? (g.n === 2 ? ws.join('和') : ws.slice(0, -1).join('、') + '，還有' + ws[ws.length - 1]) : (g.n === 2 ? ws.join(' and ') : ws.slice(0, -1).join(', ') + ', and ' + ws[ws.length - 1])));
        }
        continue;
      }
      var pre = '';
      if (!has && g.mode === 'ord') { var on = (y.n || ix + 1) - 1; pre = on < 10 ? (zh ? NUMZH[on] + '，' : NUMEN[on] + ', ') : ''; }
      else if (!has && g.mode === 'lab') {
        var lm = t.match(/^\*\*([^*]+?)\*\*\s*[：:—–-]?\s*(.*)$/) || [0, mdStrip(t), ''];
        var L = trim(lm[1]).replace(/[：:]$/, ''), body = trim(lm[2]);
        res.push(endP((zh ? (ix === 0 ? '首先是' : last ? '最後是' : '再來是') + '「' + L + '」' : (ix === 0 ? 'First, ' : last ? 'Finally, ' : 'Next, ') + L) + (body ? (zh ? '，' : ': ') + body : '')));
        continue;
      }
      else if (!has && g.mode === 'conn') pre = last ? (zh ? '最後，' : 'Finally, ') : (zh ? CZ : CE)[ix % 5];
      res.push(endP(pre + t)); continue;
    }
    res.push(endP(t));
  }
  return mdStrip(res.join('\n'));
}
function mdToHtml(s) {
  var h = esc(s);
  h = mdTableMap(h, function (head, rows) { var t = '\n\n<table class="mdtb"><thead><tr>'; eachA(head, function (c) { t += '<th>' + c + '</th>'; }); t += '</tr></thead><tbody>'; eachA(rows, function (r) { t += '<tr>'; eachA(r, function (c) { t += '<td>' + c + '</td>'; }); t += '</tr>'; }); return t + '</tbody></table>\n\n'; });
  h = h.replace(/^#{5,6} (.*)$/gm, '<h5>$1</h5>').replace(/^#{1,4} (.*)$/gm, '<h4>$1</h4>');
  h = h.replace(/\*\*([\s\S]+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<i>$2</i>');
  h = h.replace(/^&gt; ?(.*)$/gm, '<blockquote>$1</blockquote>').replace(/<\/blockquote>\n<blockquote>/g, '<br>');
  h = h.replace(/^---+$/gm, '<hr>');
  h = h.replace(/^(\d+)[.、] (.*)$/gm, '<li class="ol" data-n="$1">$2</li>');
  h = h.replace(/^[-*・] (.*)$/gm, '<li>$1</li>');
  h = h.replace(/((?:<li[^>]*>[\s\S]*?<\/li>\n?)+)/g, function (m) { return (m.indexOf('class="ol"') >= 0 ? '<ol>' : '<ul>') + m.replace(/\n/g, '') + (m.indexOf('class="ol"') >= 0 ? '</ol>' : '</ul>'); });
  h = h.replace(/(\d+:\d+(?:[–-]\d+)?)/g, '<span class="vref">$1</span>');
  var parts = h.split(/\n{2,}/), o = ''; eachA(parts, function (p) { o += /^\s*<(h\d|ul|ol|blockquote|hr|table)/.test(p) ? p : '<p>' + trim(p).replace(/\n/g, '<br>') + '</p>'; }); return o;
}
function sysPrompt() { return xzSystem() + T('xzFormat') + '\n' + audSys() + bgSys() + lenSys() + T('prayRule'); }
function xzSystem() { return T('xzSys') + (XZ.ctx ? '\n\n' + XZ.ctx : ''); }
function extractReply(d) { if (!d) return ''; if (typeof d === 'string') return d; var t = ''; if (d.content && d.content.length) { for (var i = 0; i < d.content.length; i++) if (d.content[i].type === 'text' || d.content[i].text) t += d.content[i].text || ''; if (t) return t; } return d.reply || d.text || d.message || (d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content : '') || ''; }
function isFav(t) { for (var i = 0; i < S.fav.length; i++) if (S.fav[i].text === t) return true; return false; }
/* 小智回答收合：長回答可收成幾行；新回答進來時，較早的長回答自動收合，只留最新一則展開 */
function msgLong(m) { return m && m.role !== 'user' && mdStrip(m.text || '').length > (isEN() ? 420 : 200); }
function foldOld() { for (var k = 0; k < S.chat.length - 1; k++) if (msgLong(S.chat[k])) S.chat[k].fold = true; }
function msgFold(i, keep) {
  var m = S.chat[i]; if (!m) return; m.fold = !m.fold; save();
  var el = $('#msg' + i); if (!el) { paintChat(); return; }
  el.className = 'msg ai' + (m.fold ? ' fold' : '');
  var b = el.querySelector('.msg-more'); if (b) b.textContent = T(m.fold ? 'foldMore' : 'foldLess');
  if (m.fold && !keep) { try { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { } }
}
function foldAll() { var n = 0; eachA(S.chat, function (m) { if (msgLong(m) && !m.fold) { m.fold = true; n++; } }); save(); paintChat(); toast(T(n ? 'foldedAll' : 'foldNone')); }
function chatLogHtml() {
  if (!S.chat.length) return '<div class="empty" style="text-align:left">' + esc(T('xzHi')) + '<br><span class="xs">' + esc(T('xzNote')) + '</span></div>'; var h = '';
  eachA(S.chat, function (m, i) {
    if (m.role === 'user') { h += '<div class="msg user">' + esc(m.text) + '</div>'; return; }
    var lg = !m.wait && !m.cont && msgLong(m), fd = lg && m.fold;
    h += '<div class="msg ai' + (fd ? ' fold' : '') + '" id="msg' + i + '"><div class="msg-body">' + (m.wait ? '<span class="typing"><i></i><i></i><i></i></span> ' + esc(T('thinking')) : mdToHtml(m.text)) + (m.cont ? '<p class="xs"><span class="typing"><i></i><i></i><i></i></span> ' + esc(T('xzCont')) + '</p>' : '') + '</div>' +
      (lg ? '<button class="msg-more" data-act="msgfold" data-i="' + i + '">' + esc(T(fd ? 'foldMore' : 'foldLess')) + '</button>' : '') +
      (m.wait || m.cont ? '' : '<div class="msg-actions"><button class="msg-act' + (isFav(m.text) ? ' on' : '') + '" data-act="msgfav" data-i="' + i + '">★ ' + T('favB') + '</button><button class="msg-act" data-act="msgshare" data-i="' + i + '">↗ ' + T('share') + '</button><button class="msg-act" data-act="msgcard" data-i="' + i + '">🖼 ' + T('makeCard') + '</button><button class="msg-act" data-act="msgcopy" data-i="' + i + '">⧉ ' + T('copy') + '</button><button class="msg-act" data-act="msgtts" data-i="' + i + '">🔊</button><button class="msg-act" data-act="msgdel" data-i="' + i + '">✕</button></div>' + (i === S.chat.length - 1 && m.ok && !chatBusy ? fuHtml() : '')) + '</div>';
  });
  return h;
}
function openXz(q, ctx, src) { XZ.open = true; if (ctx) XZ.ctx = ctx; if (src) chatCtx = src; drawXz(); if (q) sendChat(q); }
function closeXz() { XZ.open = false; drawXz(); }
function drawXz() {
  var el = $('#xz');
  if (!el) { el = document.createElement('div'); el.id = 'xz'; el.className = 'xz'; document.body.appendChild(el); }
  el.className = 'xz' + (XZ.open ? ' on' : ''); if (!XZ.open) { el.innerHTML = ''; return; }
  if (XZ.opt === undefined) XZ.opt = false; var qs = '', qq = audQuick().split('|'); eachA(qq, function (q) { qs += '<button class="qs-chip" data-act="chatq">' + esc(q) + '</button>'; });
  var cur = window.LCUR && R.page && R.page.t === 'read' ? LCUR.title : '';
  el.innerHTML = '<div class="hd"><button class="ib" onclick="closeXz()" aria-label="close">✕</button><img src="icon-192.png" alt="" style="width:36px;height:36px;border-radius:10px"><div class="grow"><b>' + esc(T('xz')) + '</b><div class="xs muted">' + esc(T('t_xz_d')) + '</div></div><button class="ib xzfs" data-act="xzfs" aria-label="Aa">A</button><button class="btn sm" data-act="chatfoldall" title="' + esc(T('foldAll')) + '">' + esc(T('foldAllB')) + '</button><button class="btn sm" data-act="chatclear">' + esc(T('xzNew')) + '</button></div>' +
    '<div class="bd" id="xzb">' + (cur ? '<div class="chatctx">' + esc(T('xzCtxChip', cur)) + '</div>' : '') +
    '<div id="xzOpts">' + xzOptsHtml() + '</div>' +
    '<div class="chatlog" id="chatlog">' + chatLogHtml() + '</div></div>' +
    '<div class="ft"><textarea id="chatIn" rows="1" style="min-height:46px" placeholder="' + esc(T('xzPh')) + '"></textarea><button class="btn pri" data-act="chatsend">' + esc(T('send')) + '</button></div>';
  var inp = $('#chatIn'); if (inp) inp.onkeydown = function (e) { if (e.keyCode === 13 && !e.shiftKey) { e.preventDefault(); sendChat(inp.value); } };
  paintSay(); var bd = $('#xzb'); if (bd) bd.scrollTop = bd.scrollHeight;
}
function paintChat() { var log = $('#chatlog'); if (!log) return; log.innerHTML = chatLogHtml(); paintSay(); var bd = $('#xzb'); if (bd) setTimeout(function () { var l = S.chat[S.chat.length - 1], ms = log.querySelectorAll('.msg'), e = ms[ms.length - 1]; if (l && l.role !== 'user' && !l.wait && !l.cont && e && e.scrollIntoView && (l.text || '').length > 160) e.scrollIntoView({ block: 'start' }); else bd.scrollTop = bd.scrollHeight; }, 30); }
function sendChat(text) {
  text = trim(text); if (!text || chatBusy) return; var inp = $('#chatIn'); if (inp) inp.value = '';
  if (navigator.onLine === false) { S.chat.push({ role: 'user', text: text, ts: now() }); S.chat.push({ role: 'ai', text: T('xzOffline'), ts: now() }); save(); paintChat(); return; }
  S.chat.push({ role: 'user', text: text, src: chatCtx, ts: now() }); var src = chatCtx; chatCtx = null;
  S.chat.push({ role: 'ai', text: '', wait: true, src: src }); if (S.chat.length > 60) S.chat = S.chat.slice(-60); chatBusy = true; XZ.opt = false; XZ.qsOpen = false; XZ.audOpen = false; paintOpts(); paintChat();
  var msgs = []; eachA(S.chat, function (m) { if (!m.wait && m.text) msgs.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }); }); msgs = msgs.slice(-12);
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  /* 回答被字數上限截斷時（stop_reason=max_tokens，或沒有結束標點）自動接著問，最多再接 4 次，接好的部分邊收邊顯示 */
  var acc = '', last = S.chat[S.chat.length - 1];
  function done(r, st) {
    last.wait = false; last.cont = false; foldOld(); last.fold = false; last.ok = !!r; last.text = r || T('xzFail') + (st ? '（http ' + st + '）' : ''); last.ts = now();
    chatBusy = false; save(); if (XZ.open) paintChat(); else toast(T('xzReplied'));
  }
  (function round(k) {
    var ms = msgs.slice(); if (k) { ms.push({ role: 'assistant', content: acc }); ms.push({ role: 'user', content: T('xzGoOn') }); }
    var payload = { model: SVC.model, max_tokens: 1600, system: sysPrompt(), messages: ms };
    (function attempt(n) {
      ajax('POST', SVC.xz, payload, null, function (st, txt) {
        var r = '', d = null;
        if (st === 200) { try { d = JSON.parse(txt); r = extractReply(d); } catch (e) { r = txt; } }
        if (!r && n < 2) { setTimeout(function () { attempt(n + 1); }, 900 * (n + 1)); return; }
        if (!r) { done(acc, acc ? 0 : st); return; }
        acc = k ? joinCont(acc, r) : r;
        if (k < 4 && cutOff(d, acc)) { last.wait = false; last.cont = true; last.text = acc; if (XZ.open) paintChat(); round(k + 1); return; }
        done(acc, st);
      });
    })(0);
  })(0);
}
function cutOff(d, t) {
  var sr = d && (d.stop_reason || d.finish_reason || (d.choices && d.choices[0] && d.choices[0].finish_reason));
  if (sr) return sr === 'max_tokens' || sr === 'length';
  t = trim(mdStrip(t)); return t.length > 300 && !/[。！？.!?」』”)）阿們men]$/.test(t);
}
function joinCont(a, b) {
  b = String(b).replace(/^\s*(好的|好|接續|繼續|继续|Continuing)[，,:：。.!！]?\s*/, '');
  for (var n = Math.min(80, a.length, b.length); n >= 6; n--) if (a.slice(-n) === b.slice(0, n)) return a + b.slice(n);
  var nl = /^(#|>|-|\*|\d+[.、]|\|)/.test(trim(b)) && !/\n$/.test(a);
  return a + (nl ? '\n\n' : '') + b;
}
function cardText(md) {
  var LIM = isEN() ? 300 : 140, raw = String(md || ''), m = raw.match(/^> ?(.+)$/m);
  if (m) { var q = mdStrip(m[1]); if (q.length >= 12 && q.length <= LIM + 60) return q; }
  var lines = mdStrip(raw).split('\n'), body = []; eachA(lines, function (l) { if (trim(l) && !/^・/.test(trim(l))) body.push(trim(l)); }); var b = body.join(isEN() ? ' ' : '');
  if (b.length <= LIM) return b; var cut = b.slice(0, LIM), k = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('！'), cut.lastIndexOf('. ')); return (k > 40 ? cut.slice(0, k + 1) : cut) + '…';
}
function msgShare(m) { var src = m.src, head = src ? Q(src.t) + '\n—— ' + src.ref + '\n\n' : ''; shareText(head + mdStrip(m.text) + '\n\n—— ' + T('fellowshipName')); }

/* ---------- 經文美圖工作室 ---------- */
var CARD_TPL = {
  navy: { n: 'tplNavy', bg: ['#123F92', '#0D3988', '#071A42'], glow: 'rgba(212,166,91,.30)', ink: '#F2ECDD', accent: '#F7EFDC', gold: '#D4A65B', sub: '#BBA98A', frame: 'rgba(212,166,91,.42)' },
  paper: { n: 'tplPaper', bg: ['#FBF8F1', '#F4EFE3', '#EDE6D6'], glow: 'rgba(212,166,91,.45)', ink: '#3A3122', accent: '#23211C', gold: '#A9762F', sub: '#8A7C63', frame: 'rgba(169,118,47,.34)' },
  dawn: { n: 'tplDawn', bg: ['#FFF6EC', '#FBE9D2', '#F6D9B8'], glow: 'rgba(255,214,150,.6)', ink: '#3A2A1A', accent: '#8A4B16', gold: '#C97A22', sub: '#8A6A4A', frame: 'rgba(181,101,29,.30)' },
  grace: { n: 'tplGrace', bg: ['#F2F7F1', '#E4EFE6', '#D6E7DA'], glow: 'rgba(160,200,170,.5)', ink: '#1C2E26', accent: '#255943', gold: '#3C8A64', sub: '#5C7A6A', frame: 'rgba(46,106,80,.28)' },
  rose: { n: 'tplRose', bg: ['#FCF5F3', '#F6E7E3', '#EFD8D2'], glow: 'rgba(220,160,150,.45)', ink: '#33221E', accent: '#8A3D2E', gold: '#B36A54', sub: '#8A6A62', frame: 'rgba(154,74,58,.28)' },
  sky: { n: 'tplSky', bg: ['#F1F7FB', '#DFEEF6', '#CFE4F0'], glow: 'rgba(150,200,230,.5)', ink: '#1B2A33', accent: '#1E5270', gold: '#2E7DA0', sub: '#5A7684', frame: 'rgba(37,96,128,.28)' },
  linen: { n: 'tplLinen', bg: ['#F7F4EE', '#EFEAE0', '#E6DFD2'], glow: 'rgba(200,190,170,.4)', ink: '#2A2620', accent: '#4A4234', gold: '#8A7A5A', sub: '#7A7263', frame: 'rgba(90,80,64,.26)' },
  night: { n: 'tplNight', bg: ['#101E1B', '#16302A', '#0E2420'], glow: 'rgba(232,201,122,.26)', ink: '#EDEAE0', accent: '#E8C97A', gold: '#E8C97A', sub: '#9FB0AA', frame: 'rgba(232,201,122,.34)' },
  plain: { n: 'tplPlain', bg: ['#FFFFFF', '#FFFFFF', '#FFFFFF'], glow: 'rgba(0,0,0,0)', ink: '#23211C', accent: '#0D3988', gold: '#A9762F', sub: '#6B6255', frame: 'rgba(13,57,136,.22)' }
};
var CARD_ORDER = ['navy', 'paper', 'dawn', 'grace', 'rose', 'sky', 'linen', 'night', 'plain'];
var CARD_SIZES = { p: [1080, 1920, 'sz916'], t: [1080, 1350, 'sz45'], s: [1080, 1080, 'szSq'], w: [1920, 1080, 'szWide'] };
var CARD_BORDERS = ['classic', 'corner', 'inline', 'dots', 'ornate', 'none'];
var CARD_FS = [[0.9, 'cfs0'], [1, 'cfs1'], [1.2, 'cfs2'], [1.45, 'cfs3'], [1.7, 'cfs4']];
var studio = null, photoImg = null, photoBy = '', cardImg = null;
var NO_START = '，。、；：？！）」』】》〉·…—％', NO_END = '（「『【《〈';
function cardSerif() { return isZS() ? '"Noto Serif SC","Songti SC","STSong","SimSun",Georgia,serif' : (isEN() ? 'Georgia,"Times New Roman",serif' : '"Noto Serif TC","Songti TC","PMingLiU",Georgia,serif'); }
function cardSans() { return isZS() ? '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif' : (isEN() ? '-apple-system,"Segoe UI",Roboto,Arial,sans-serif' : '"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif'); }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function wrapText(ctx, text, maxW) {
  var out = [];
  eachA(String(text || '').split('\n'), function (par) {
    if (!par) { out.push(''); return; } var line = '';
    if (isEN()) { eachA(par.split(/\s+/), function (w) { if (!w) return; var pr = line ? line + ' ' + w : w; if (ctx.measureText(pr).width > maxW && line) { out.push(line); line = w; } else line = pr; }); out.push(line); return; }
    for (var i = 0; i < par.length; i++) {
      var ch = par.charAt(i);
      if (ctx.measureText(line + ch).width > maxW && line) {
        if (NO_START.indexOf(ch) >= 0) { line += ch; continue; }
        var carry = ''; while (line.length > 1 && NO_END.indexOf(line.charAt(line.length - 1)) >= 0) { carry = line.charAt(line.length - 1) + carry; line = line.slice(0, -1); }
        out.push(line); line = carry + ch;
      } else line += ch;
    }
    out.push(line);
  });
  return out;
}
function coverDraw(ctx, img, x, y, w, h) { var ir = img.width / img.height, r = w / h, sw, sh, sx, sy; if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; sy = 0; } else { sw = img.width; sh = sw / r; sx = 0; sy = (img.height - sh) / 2; } ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h); }
function drawBorder(ctx, W, H, pad, F, Tp) {
  var B = S.card.border; if (B === 'none') return;
  var line = Tp.frame, line2 = Tp.frame.replace(/[\d.]+\)$/, '0.55)'), gold = Tp.gold, m = pad * .5, x = m, y = m, w = W - m * 2, h = H - m * 2, Rr = Math.round(18 * F);
  if (B === 'classic') {
    ctx.strokeStyle = line; ctx.lineWidth = Math.max(2, W * .0022); rr(ctx, x, y, w, h, Rr); ctx.stroke();
    ctx.strokeStyle = line2; ctx.lineWidth = Math.max(1, W * .0009); rr(ctx, x + 9 * F, y + 9 * F, w - 18 * F, h - 18 * F, Math.round(12 * F)); ctx.stroke();
    ctx.fillStyle = gold; eachA([[x, y], [x + w, y], [x, y + h], [x + w, y + h]], function (p) { ctx.beginPath(); ctx.arc(p[0], p[1], Math.round(5 * F), 0, 7); ctx.fill(); });
  } else if (B === 'corner') {
    ctx.strokeStyle = gold; ctx.lineWidth = Math.max(2, W * .003); ctx.lineCap = 'round'; var Lg = Math.round(56 * F);
    var seg = function (cx, cy, dx, dy) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + dx * Lg, cy); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + dy * Lg); ctx.stroke(); };
    seg(x, y, 1, 1); seg(x + w, y, -1, 1); seg(x, y + h, 1, -1); seg(x + w, y + h, -1, -1); ctx.lineCap = 'butt';
  } else if (B === 'inline') { ctx.strokeStyle = line2; ctx.lineWidth = Math.max(1, W * .0013); rr(ctx, x + 6 * F, y + 6 * F, w - 12 * F, h - 12 * F, Math.round(14 * F)); ctx.stroke(); }
  else if (B === 'dots') {
    ctx.fillStyle = line2; var r0 = Math.max(2, W * .0026), gap = Math.round(26 * F), ex = x + 6 * F, ey = y + 6 * F, ew = w - 12 * F, eh = h - 12 * F, px2, py2;
    var dot = function (a, b) { ctx.beginPath(); ctx.arc(a, b, r0, 0, 7); ctx.fill(); };
    for (px2 = ex; px2 <= ex + ew; px2 += gap) { dot(px2, ey); dot(px2, ey + eh); } for (py2 = ey; py2 <= ey + eh; py2 += gap) { dot(ex, py2); dot(ex + ew, py2); }
  } else if (B === 'ornate') {
    ctx.strokeStyle = line; ctx.lineWidth = Math.max(2, W * .0022); rr(ctx, x, y, w, h, Rr); ctx.stroke();
    ctx.strokeStyle = gold; ctx.lineWidth = Math.max(1.5, W * .0016); ctx.lineCap = 'round'; var L2 = Math.round(34 * F), o = Math.round(16 * F);
    var flo = function (cx, cy, dx, dy) { ctx.beginPath(); ctx.moveTo(cx + dx * o, cy + dy * o); ctx.lineTo(cx + dx * (o + L2), cy + dy * o); ctx.moveTo(cx + dx * o, cy + dy * o); ctx.lineTo(cx + dx * o, cy + dy * (o + L2)); ctx.stroke(); ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(cx + dx * o, cy + dy * o, Math.round(4.5 * F), 0, 7); ctx.fill(); };
    flo(x, y, 1, 1); flo(x + w, y, -1, 1); flo(x, y + h, 1, -1); flo(x + w, y + h, -1, -1); ctx.lineCap = 'butt';
  }
}
function drawCard(cv, c, W, H) {
  var ctx = cv.getContext('2d'); cv.width = W; cv.height = H;
  var Tp = CARD_TPL[S.card.tpl] || CARD_TPL.navy, F = W / 1080, pad = Math.round(W * .085), iw = W - pad * 2, sans = cardSans(), serif = cardSerif(), FB = Math.min(1.8, Math.max(.85, +S.card.fs || 1));
  var g = ctx.createLinearGradient(0, 0, W * .3, H); g.addColorStop(0, Tp.bg[0]); g.addColorStop(.55, Tp.bg[1]); g.addColorStop(1, Tp.bg[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (photoImg) {
    coverDraw(ctx, photoImg, 0, 0, W, H); var hx = Tp.bg[1].replace('#', ''), R0 = parseInt(hx.slice(0, 2), 16), G0 = parseInt(hx.slice(2, 4), 16), B0 = parseInt(hx.slice(4, 6), 16);
    var sc = ctx.createLinearGradient(0, 0, 0, H), rgb = 'rgba(' + R0 + ',' + G0 + ',' + B0 + ','; sc.addColorStop(0, rgb + '0.46)'); sc.addColorStop(.5, rgb + '0.66)'); sc.addColorStop(1, rgb + '0.56)'); ctx.fillStyle = sc; ctx.fillRect(0, 0, W, H);
  }
  var rg = ctx.createRadialGradient(W * .84, H * .10, 10, W * .84, H * .10, W * .75); rg.addColorStop(0, Tp.glow); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  drawBorder(ctx, W, H, pad, F, Tp);
  var grp = trim(S.card.top) || T('fellowshipName'), grpSz = Math.round(30 * F * FB), grpY = pad + Math.round(30 * F) + grpSz;
  while (grpSz > Math.round(16 * F)) { ctx.font = '600 ' + grpSz + 'px ' + sans; if (ctx.measureText(grp).width <= iw - 80 * F) break; grpSz -= 2; }
  ctx.textAlign = 'center'; ctx.fillStyle = Tp.sub; ctx.font = '600 ' + grpSz + 'px ' + sans; var gw = ctx.measureText(grp).width; ctx.fillText(grp, W / 2, grpY);
  ctx.strokeStyle = Tp.frame.replace(/[\d.]+\)$/, '0.6)'); ctx.lineWidth = Math.max(1, 1.5 * F);
  eachA([[W / 2 - gw / 2 - 28 * F, -1], [W / 2 + gw / 2 + 28 * F, 1]], function (a) { ctx.beginPath(); ctx.moveTo(a[0], grpY - 9 * F); ctx.lineTo(a[0] + a[1] * 30 * F, grpY - 9 * F); ctx.stroke(); });
  var toName = trim(S.card.to);
  if (toName) { var ts2 = Math.round(40 * F * FB); ctx.fillStyle = Tp.ink; while (ts2 > Math.round(22 * F * FB)) { ctx.font = '600 ' + ts2 + 'px ' + serif; if (ctx.measureText(toName).width <= iw) break; ts2 -= Math.round(2 * F); } ctx.font = '600 ' + ts2 + 'px ' + serif; ctx.fillText(toName, W / 2, grpY + Math.round(80 * F)); }
  var botRoom0 = pad + Math.round(40 * F) + Math.round(30 * F * FB), topRoom = grpY + Math.round((toName ? 120 : 46) * F), botRoom = botRoom0, room = H - topRoom - botRoom;
  var raw = trim(String(c.t || '').replace(/\s+/g, isEN() ? ' ' : '')).replace(/[，、；：,;]+$/, '');
  var verse = isEN() ? ((/^[“"']/.test(raw) ? '' : '“') + raw + (/[”"']$/.test(raw) ? '' : '”')) : ((/^[「『]/.test(raw) ? '' : '「') + raw + (/[」』]$/.test(raw) ? '' : '」'));
  if (c.plain) verse = raw;
  var note = trim(c.n || ''), vs = Math.round(58 * F * FB), vl;
  while (true) { ctx.font = '600 ' + vs + 'px ' + serif; vl = wrapText(ctx, verse, iw); if (vl.length <= (isEN() ? 9 : 7) || vs <= Math.round(28 * F)) break; vs -= Math.round(3 * F); }
  var fixed = vs * .9 + vl.length * vs * 1.52 + Math.round(64 * F) + (note ? Math.round(86 * F) : 0), ns = Math.round(38 * F * FB), nl = [];
  if (note) { while (true) { ctx.font = ns + 'px ' + sans; nl = wrapText(ctx, note, iw); if (fixed + nl.length * ns * 1.76 <= room || ns <= Math.round(21 * F)) break; ns -= Math.round(2 * F); } }
  var total = fixed + (note ? nl.length * ns * 1.76 : 0), y = topRoom + Math.max(0, (room - total) / 2);
  ctx.fillStyle = Tp.accent; ctx.font = '600 ' + vs + 'px ' + serif; y += vs * .9; eachA(vl, function (l) { ctx.fillText(l, W / 2, y); y += vs * 1.52; });
  if (c.ref) { ctx.font = Math.round(30 * F) + 'px ' + sans; ctx.fillStyle = Tp.accent; ctx.fillText(c.ref, W / 2, y); } y += Math.round(64 * F);
  if (note) {
    ctx.fillStyle = Tp.gold; ctx.beginPath(); ctx.arc(W / 2, y, Math.round(5 * F), 0, 7); ctx.fill(); ctx.strokeStyle = Tp.gold; ctx.lineWidth = 2.5 * F;
    ctx.beginPath(); ctx.moveTo(W / 2 - 52 * F, y); ctx.lineTo(W / 2 - 16 * F, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W / 2 + 16 * F, y); ctx.lineTo(W / 2 + 52 * F, y); ctx.stroke();
    y += Math.round(44 * F) + ns; ctx.textAlign = 'left'; ctx.fillStyle = Tp.ink; ctx.font = ns + 'px ' + sans; eachA(nl, function (l) { ctx.fillText(l, pad, y); y += ns * 1.76; }); ctx.textAlign = 'center';
  }
  var sign = trim(S.card.sign) || T('cardBless'), ss = Math.round(30 * F * FB); ctx.fillStyle = Tp.sub;
  while (ss > Math.round(15 * F * FB)) { ctx.font = '600 ' + ss + 'px ' + sans; if (ctx.measureText(sign).width <= iw) break; ss -= 2; }
  ctx.fillText(sign, W / 2, H - pad * .72 - Math.round(18 * F));
  if (photoBy) { ctx.font = Math.round(16 * F) + 'px ' + sans; ctx.globalAlpha = .7; ctx.fillText('Photo: ' + photoBy + ' / Pexels', W / 2, H - pad * .38); ctx.globalAlpha = 1; }
}
function chipRow(act, list, cur, attr) { var b = '<div class="chips" style="flex-wrap:wrap">'; eachA(list, function (x) { b += '<button class="chip' + (String(cur) === String(x[0]) ? ' on' : '') + '" data-act="' + act + '" data-' + attr + '="' + x[0] + '">' + x[1] + '</button>'; }); return b + '</div>'; }

/* ===== 完整美圖工作室：直接開互動聖經的工作室（嵌入模式 iframe，9版型／4尺寸／相片模式／Pexels／AI生圖／配樂／錄影／我的作品…全部功能） ===== */
var STUDIO_URL = window.K321_BIBLE_STUDIO || 'https://spch321-sudo.github.io/bible/?embed=studio#/studio';
function closeStudioEmb() { var ov = document.getElementById('studioOv'); if (ov && ov.parentNode) ov.parentNode.removeChild(ov); document.body.style.overflow = ''; }
function openStudio(c) {
  if (navigator.onLine === false) { openStudioLite(c); return; }
  stopAll(); closeHSheet(); if (XZ.open) closeXz(); closeStudioEmb();
  var lg = L();
  try { localStorage.setItem('ib_card_in', JSON.stringify({ ts: +new Date(), item: { t: c.t || '', ref: c.ref || '', n: c.n || '' }, lang: lg === 'zs' ? 'zs' : (lg === 'en' ? 'en' : 'zh') })); } catch (e) {}
  var ov = document.createElement('div'); ov.id = 'studioOv'; ov.className = 'studioov';
  ov.innerHTML = '<div class="sohd"><button class="ib" id="soX" aria-label="close">✕</button><b>' + esc(T('studioT')) + '</b><button class="btn sm" id="soLite">' + esc(tk('studioLite', '簡易版')) + '</button></div>' +
    '<iframe id="studioFr" name="k321studio" src="' + STUDIO_URL + '" allow="camera *; microphone *; autoplay *; clipboard-read *; clipboard-write *; display-capture *; fullscreen *"></iframe>';
  document.body.appendChild(ov); document.body.style.overflow = 'hidden';
  $('#soX').onclick = closeStudioEmb;
  $('#soLite').onclick = function () { closeStudioEmb(); openStudioLite(c); };
}
window.addEventListener('message', function (e) { var d = e.data; if (d && d.k321 === 'studioClose') closeStudioEmb(); });

/* ===== VPICK321：從小智回答找出經文章節，取互動聖經站的和合本／WEB原文，做成美圖 ===== */
var VPICK = (function () {
  var BASE = (window.K321_BIBLE_BASE || 'https://spch321-sudo.github.io/bible/'), TOC = null, SH = {};
  function get(u, cb) { var x = new XMLHttpRequest(); x.open('GET', u); x.onload = function () { if (x.status === 200) { try { cb(JSON.parse(x.responseText)); return; } catch (e) {} } cb(null); }; x.onerror = function () { cb(null); }; x.timeout = 12000; x.ontimeout = x.onerror; x.send(); }
  function lang(md) {
    if ((document.documentElement.getAttribute('lang') || '').slice(0, 2) === 'en') return 'en';
    var zs = (md.match(/[们这让愿说为经圣书节]/g) || []).length, zt = (md.match(/[們這讓願說為經聖書節]/g) || []).length;
    return zs > zt ? 'zs' : 'zh';
  }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function findRef(md, lg, toc) {
    var names = [], i, b, k, keys = lg === 'en' ? ['en', 'aen'] : (lg === 'zs' ? ['zs', 'azs', 'zh', 'azh'] : ['zh', 'azh', 'zs', 'azs']);
    for (i = 0; i < toc.length; i++) for (k = 0; k < keys.length; k++) { var nm = toc[i][keys[k]]; if (nm) names.push({ n: nm, b: toc[i] }); }
    if (lg === 'en') { names.push({ n: 'Psalm', b: toc[18] }); names.push({ n: 'Psalms', b: toc[18] }); names.push({ n: 'Song of Songs', b: toc[21] }); }
    else { names.push({ n: '詩', b: toc[18] }); names.push({ n: '诗', b: toc[18] }); }
    names.sort(function (a, b) { return b.n.length - a.n.length; });
    var lines = md.split(/\n/), order = [], q = [], o = [];
    for (i = 0; i < lines.length; i++) (/^\s*>/.test(lines[i]) ? q : o).push(lines[i]);
    order = [q.join('\n'), o.join('\n')];
    for (var p = 0; p < order.length; p++) {
      var txt = order[p], best = null;
      for (i = 0; i < names.length; i++) {
        var re = lg === 'en' ? new RegExp('(?:^|[^A-Za-z])' + esc(names[i].n) + '\\s*(\\d+)\\s*:\\s*(\\d+)(?:\\s*[-–—]\\s*(\\d+))?', 'g')
          : new RegExp(esc(names[i].n) + '\\s*(?:第)?\\s*(\\d+)\\s*(?:[:：章篇])\\s*(\\d+)\\s*(?:節|节)?(?:\\s*[-–~—到至]\\s*(\\d+))?', 'g');
        var m = re.exec(txt);
        if (m && (!best || m.index < best.idx)) best = { idx: m.index, b: names[i].b, ch: +m[1], v: +m[2], v2: m[3] ? +m[3] : +m[2] };
      }
      if (best) return best;
    }
    return null;
  }
  function clean(s) {
    s = s.replace(/〔[^〕]*〕/g, '');
    var pairs = [['「', '」'], ['『', '』'], ['“', '”'], ['‘', '’']], i;
    for (i = 0; i < pairs.length; i++) { var o = s.split(pairs[i][0]).length - 1, c = s.split(pairs[i][1]).length - 1; if (o !== c) { s = s.split(pairs[i][0]).join('').split(pairs[i][1]).join(''); } }
    return s.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  }
  function pick(md, cb) {
    var lg = lang(md);
    function go(toc) {
      var r = findRef(md, lg, toc); if (!r) { cb(null); return; }
      var key = lg + '.' + r.b.shard;
      function use(sh) {
        var ch = sh && sh[r.b.id] && sh[r.b.id][r.ch - 1]; if (!ch) { cb(null); return; }
        if (r.v2 < r.v || r.v2 - r.v > 5) r.v2 = r.v + (r.v2 < r.v ? 0 : 5);
        var cur = 0, out = '', pi, j;
        for (pi = 0; pi < ch.length; pi++) for (j = 1; j < ch[pi].length; j += 2) { if (ch[pi][j] > 0) cur = ch[pi][j]; if (cur >= r.v && cur <= r.v2) out += (lg === 'en' ? ' ' : '') + ch[pi][j + 1]; }
        out = clean(out); if (!out) { cb(null); return; }
        var nm = r.b[lg === 'en' ? 'en' : lg], ref = nm + ' ' + r.ch + ':' + r.v + (r.v2 > r.v ? '-' + r.v2 : '');
        cb({ t: out, ref: ref });
      }
      if (SH[key]) use(SH[key]); else get(BASE + 'bible.' + key + '.json', function (d) { if (d) SH[key] = d; use(d); });
    }
    if (TOC) go(TOC); else get(BASE + 'toc.json', function (d) { if (!d) { cb(null); return; } TOC = d; go(d); });
  }
  function card(md, open, fb) { try { pick(md, function (r) { if (r) open({ t: r.t, ref: r.ref, n: '' }); else open(fb); }); } catch (e) { open(fb); } }
  return { pick: pick, card: card };
})();

function openStudioLite(c) { stopAll(); closeHSheet(); if (XZ.open) closeXz(); studio = { t: c.t || '', ref: c.ref || '', n: c.n || '', n0: c.n || '', plain: !!c.plain }; if (R.page && R.page.t === 'studio') render(); else open_({ t: 'studio' }); }
function vStudio() {
  if (!studio) return back();
  var c = studio, b = topbar(T('studioT'), true) + '<div class="cardpv" id="cardPv"></div>' +
    '<div class="row" style="gap:8px"><button class="btn pri grow" data-act="csave">' + T('saveImg') + '</button><button class="btn grow" data-act="cshare">' + T('share') + '</button></div><div class="card">';
  var tp = []; eachA(CARD_ORDER, function (k) { tp.push([k, T(CARD_TPL[k].n)]); });
  b += '<p class="eyebrow">' + T('cTpl') + '</p>' + chipRow('ctpl', tp, S.card.tpl, 'v');
  b += '<p class="eyebrow">' + T('cSize') + '</p>' + chipRow('csize', [['p', T('sz916')], ['t', T('sz45')], ['s', T('szSq')], ['w', T('szWide')]], S.card.size, 'v');
  var bd = []; eachA(CARD_BORDERS, function (k) { bd.push([k, T('bd_' + k)]); }); b += '<p class="eyebrow">' + T('cBorder') + '</p>' + chipRow('cborder', bd, S.card.border, 'v');
  var fs = []; eachA(CARD_FS, function (f) { fs.push([f[0], T(f[1])]); }); b += '<p class="eyebrow">' + T('cFs') + '</p>' + chipRow('cfs', fs, S.card.fs, 'v');
  b += '<p class="eyebrow">' + T('cPhoto') + '</p><div class="row wrap" style="gap:8px"><button class="btn sm" data-act="cphoto">' + T('pickPhoto') + '</button><button class="btn sm" data-act="cpexels">' + T('pexels') + '</button>' + (photoImg ? '<button class="btn sm" style="color:var(--bad)" data-act="cnophoto">' + T('noPhoto') + '</button>' : '') + '<input type="file" id="cphotoIn" accept="image/*" style="display:none"></div></div><div class="card">';
  b += '<div class="q"><label>' + T('cText') + '</label><textarea data-c="t">' + esc(c.t) + '</textarea></div>';
  b += '<div class="q"><label>' + T('cRef') + '</label><input type="text" data-c="ref" value="' + esc(c.ref) + '"></div>';
  b += '<div class="q"><label>' + T('cNote') + '</label><textarea data-c="n" placeholder="' + esc(T('cNotePH')) + '">' + esc(c.n) + '</textarea><div id="mxNote"></div></div>';
  b += '<div class="q"><label>' + T('cTo') + '</label><input type="text" data-cs="to" value="' + esc(S.card.to) + '" placeholder="' + esc(T('cToPH')) + '"></div>';
  b += '<div class="q"><label>' + T('cTop') + '</label><input type="text" data-cs="top" value="' + esc(S.card.top) + '" placeholder="' + esc(T('fellowshipName')) + '"></div>';
  b += '<div class="q"><label>' + T('cSignL') + '</label><input type="text" data-cs="sign" value="' + esc(S.card.sign) + '" placeholder="' + esc(T('cardBless')) + '"></div></div><div id="mxBox"></div>';
  var y = window.scrollY; setApp(b); window.scrollTo(0, y); renderCard(); loadMedia();
  eachA(qa('[data-c],[data-cs]', $('#app')), function (e) { e.oninput = function () { var k = e.getAttribute('data-c'); if (k) studio[k] = e.value; else { S.card[e.getAttribute('data-cs')] = e.value; save(); } clearTimeout(vStudio._t); vStudio._t = setTimeout(renderCard, 250); }; });
  $('#cphotoIn').onchange = function () { var f = this.files && this.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { var im = new Image(); im.onload = function () { photoImg = im; photoBy = ''; render(); }; im.onerror = function () { toast(T('photoBad')); }; im.src = rd.result; }; rd.readAsDataURL(f); };
}
function loadMedia() {
  if (window.MX) return MX.paint(); if (loadMedia.on) return; loadMedia.on = 1;
  var sc = document.createElement('script'); sc.src = 'media.js?v=' + APPVER; sc.onload = function () { if (window.MX && $('#mxBox')) MX.paint(); }; sc.onerror = function () { loadMedia.on = 0; }; document.body.appendChild(sc);
}
function renderCard() { var sz = CARD_SIZES[S.card.size] || CARD_SIZES.t, cv = document.createElement('canvas'); drawCard(cv, studio, sz[0], sz[1]); try { cardImg = cv.toDataURL('image/png'); } catch (e) { cardImg = null; toast(T('photoBad')); } var box = $('#cardPv'); if (box && cardImg) box.innerHTML = '<img src="' + cardImg + '" alt="">'; }
function cardBlob(url) { var b = atob(url.split(',')[1]), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return new Blob([a], { type: 'image/png' }); }
function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function holdSave() { openHSheet('<div class="sheet-title">' + T('holdT') + '</div><div class="hl-tip">' + T('holdS') + '</div><div class="holdpv"><img src="' + cardImg + '" alt=""></div><div class="sheet-acts" style="margin-top:12px"><button class="btn" data-act="hclose">' + T('close') + '</button></div>'); }
function shareFile() { var f; try { f = new File([cardBlob(cardImg)], '321-card.png', { type: 'image/png' }); } catch (e) { return false; } if (navigator.canShare && navigator.canShare({ files: [f] })) { var p = navigator.share({ files: [f], title: T('appName') }); if (p && p['catch']) p['catch'](function () { }); return true; } return false; }
function cardSave() { if (!cardImg) return; if (isIOS()) { if (!shareFile()) holdSave(); else toast(T('saveIOS')); return; } var a = document.createElement('a'); a.href = cardImg; a.download = '321-ot-' + now() + '.png'; document.body.appendChild(a); a.click(); document.body.removeChild(a); toast(T('savedFile')); }
function cardShare() { if (!cardImg) return; if (!shareFile()) cardSave(); }
var px = { q: '', page: 1, items: [], busy: false, end: false };
var PX_PRE = { zh: [['風景', 'landscape'], ['日出', 'sunrise'], ['天空', 'sky'], ['海', 'ocean'], ['山', 'mountain'], ['花', 'flowers'], ['光', 'light rays'], ['樹', 'tree'], ['教堂', 'church'], ['小路', 'path'], ['麥田', 'wheat field'], ['水', 'calm water'], ['雲', 'clouds'], ['晨霧', 'morning mist'], ['星空', 'starry sky'], ['十字架', 'cross'], ['手', 'hands together'], ['餐桌', 'family table']],
  en: [['Landscape', 'landscape'], ['Sunrise', 'sunrise'], ['Sky', 'sky'], ['Ocean', 'ocean'], ['Mountain', 'mountain'], ['Flowers', 'flowers'], ['Light', 'light rays'], ['Tree', 'tree'], ['Church', 'church'], ['Path', 'path'], ['Wheat', 'wheat field'], ['Water', 'calm water'], ['Clouds', 'clouds'], ['Mist', 'morning mist'], ['Stars', 'starry sky'], ['Cross', 'cross'], ['Hands', 'hands together'], ['Table', 'family table']] };
var ZS_PX = { '風景': '风景', '樹': '树', '麥田': '麦田', '雲': '云', '晨霧': '晨雾', '餐桌': '餐桌' };
function pxOrient() { var s = S.card.size; return s === 'w' ? 'landscape' : (s === 's' ? 'square' : 'portrait'); }
function openPexels() {
  var pre = PX_PRE[isEN() ? 'en' : 'zh'], chips = ''; eachA(pre, function (p) { chips += '<button class="chip" data-act="pxq" data-q="' + esc(p[1]) + '">' + esc(isZS() ? (ZS_PX[p[0]] || p[0]) : p[0]) + '</button>'; });
  openHSheet('<div class="sheet-title">' + T('pexelsT') + '</div><div class="row" style="gap:8px;margin-bottom:10px"><input type="text" id="pxQ" value="' + esc(px.q) + '" placeholder="' + esc(T('pxPH')) + '"><button class="btn sm" data-act="pxgo">' + T('search') + '</button></div><div class="chips pxchips" style="flex-wrap:wrap">' + chips + '</div><div class="pxgrid" id="pxGrid"></div><div class="sheet-acts2" style="margin-top:12px"><button class="btn sm" data-act="pxmore" id="pxMore">' + T('more') + '</button><button class="btn sm" data-act="hclose">' + T('close') + '</button></div><div class="xs muted" style="margin-top:8px">' + T('pxHint') + '</div>');
  pxRun(true);
}
function pxPaint() {
  var g = $('#pxGrid'); if (!g) return; if (!px.items.length) { g.innerHTML = '<div class="empty" style="grid-column:1/-1">' + (px.busy ? T('loading') : T('pxNone')) + '</div>'; return; }
  var h = ''; eachA(px.items, function (p, i) { h += '<button class="pxcell" data-act="pxpick" data-i="' + i + '"><img src="' + esc(p.src && (p.src.tiny || p.src.small) || '') + '" alt="" loading="lazy"><span>' + esc(p.photographer || '') + '</span></button>'; }); g.innerHTML = h;
  var mb = $('#pxMore'); if (mb) mb.style.display = px.end ? 'none' : '';
}
function pxRun(reset) {
  if (px.busy) return; px.busy = true; if (reset) { px.page = 1; px.items = []; px.end = false; } pxPaint();
  var q = trim(px.q), url = (q ? 'https://api.pexels.com/v1/search?query=' + encodeURIComponent(q) + '&orientation=' + pxOrient() + '&' : 'https://api.pexels.com/v1/curated?') + 'per_page=24&page=' + px.page;
  ajax('GET', url, null, null, function (st, txt) {
    px.busy = false; if (st !== 200) { toast(T('pxErr') + ' (' + st + ')'); pxPaint(); return; }
    try { var d = JSON.parse(txt), got = d.photos || []; px.items = px.items.concat(got); px.end = got.length < 24; px.page++; } catch (e) { } pxPaint();
  }, { Authorization: PEXELS_KEY });
}
function pxPick(i) {
  var p = px.items[i]; if (!p) return; toast(T('pxLoading')); var url = p.src && (p.src.large2x || p.src.large || p.src.original);
  ajax('GET', url, null, 'blob', function (st, blob) {
    if (st !== 200 || !blob) { toast(T('photoBad')); return; } var u = URL.createObjectURL(blob), im = new Image();
    im.onload = function () { photoImg = im; photoBy = p.photographer || ''; closeHSheet(); render(); toast(T('pxPicked')); }; im.onerror = function () { toast(T('photoBad')); }; im.src = u;
  });
}

/* ---------- 事件委派 ---------- */
document.addEventListener('click', function (e) {
  var t = e.target;
  if (t && t.className && String(t.className).indexOf('sent') >= 0 && blkOf(t) && !$('#hsheet')) { if (window.CR) { CR.mark(t); CR.manual(); } onSentTap(t); return; }
  var n = t; while (n && n !== document && !(n.getAttribute && n.getAttribute('data-act'))) n = n.parentNode;
  if (!n || n === document) { if (t && t.className === 'hl-note') { var hk = t.getAttribute('data-hk'), list = sentList(); for (var q = 0; q < list.length; q++) if (hlKeyOf(list[q]) === hk) { openHlSheet(list[q]); break; } } return; }
  var a = n.getAttribute('data-act'), i;
  if (a === 'hlc') { if (!hlCur) return; hlCur.h.c = n.getAttribute('data-c'); hlNoteGrab(); save(); paintHl(hlRoot()); eachA(qa('.hlswatch'), function (b) { b.className = 'hlswatch' + (b === n ? ' on' : ''); }); }
  else if (a === 'hlsp') hlSpan(n.getAttribute('data-d'));
  else if (a === 'hlsave') { hlNoteGrab(); closeHSheet(); paintHl(hlRoot()); toast(T('saved')); }
  else if (a === 'hlask') { hlNoteGrab(); var h = hlCur.h; closeHSheet(); openXz(T('xzAboutHl', Q(h.t), h.ref, h.n ? '我的默想：' + h.n + '\n' : ''), XZ.ctx, { t: h.t, ref: h.ref }); }
  else if (a === 'hlcard') { hlNoteGrab(); var h2 = hlCur.h; openStudio({ t: h2.t, ref: h2.ref, n: h2.n }); }
  else if (a === 'hlread') { speakText(hlCur.h.t, 'hl'); }
  else if (a === 'hlcopy') { copyText(hlShareText(hlCur.h)); }
  else if (a === 'hlshare') { hlNoteGrab(); shareText(hlShareText(hlCur.h)); }
  else if (a === 'hldel') { if (confirm(T('delHl'))) { delete S.hl[hlCur.k]; save(); closeHSheet(); paintHl(hlRoot()); } }
  else if (a === 'hlgo') { open_({ t: 'read', n: +n.getAttribute('data-l') }); }
  else if (a === 'hlcard2') { var x = S.hl[n.getAttribute('data-k')]; if (x) openStudio({ t: x.t, ref: x.ref, n: x.n }); }
  else if (a === 'hldel2') { if (confirm(T('delHl'))) { delete S.hl[n.getAttribute('data-k')]; save(); render(); } }
  else if (a === 'favdel') { S.fav.splice(+n.getAttribute('data-i'), 1); save(); render(); }
  else if (a === 'favcard') { var fv = S.fav[+n.getAttribute('data-i')]; if (fv) VPICK.card(fv.text, openStudio, { t: cardText(fv.text), ref: '', n: '', plain: true }); }
  else if (a === 'hclose') closeHSheet();
  else if (a === 'chatsend') sendChat(($('#chatIn') || {}).value);
  else if (a === 'chatq') { sendChat(n.textContent); var qp = $('#qsPanel'); if (qp) qp.style.display = 'none'; }
  else if (a === 'qstog') { XZ.qsOpen = !XZ.qsOpen; if (XZ.qsOpen) XZ.audOpen = false; paintOpts(); }
  else if (a === 'chatclear') { if (!S.chat.length || confirm(T('delConfirm'))) { S.chat = []; XZ.ctx = ''; save(); paintChat(); } }
  else if (a === 'msgfav') { i = +n.getAttribute('data-i'); var mt = S.chat[i].text; if (isFav(mt)) { for (var j = 0; j < S.fav.length; j++) if (S.fav[j].text === mt) { S.fav.splice(j, 1); break; } } else { S.fav.push({ text: mt, ts: now() }); toast(T('favSaved')); } save(); paintChat(); }
  else if (a === 'msgfold') msgFold(+n.getAttribute('data-i'));
  else if (a === 'chatfoldall') foldAll();
  else if (a === 'msgshare') msgShare(S.chat[+n.getAttribute('data-i')]);
  else if (a === 'msgcard') { var mm = S.chat[+n.getAttribute('data-i')]; if (mm.src) openStudio({ t: mm.src.t, ref: mm.src.ref, n: cardText(mm.text) }); else VPICK.card(mm.text, openStudio, { t: cardText(mm.text), ref: '', plain: true }); }
  else if (a === 'msgcopy') copyText(mdStrip(S.chat[+n.getAttribute('data-i')].text));
  else if (a === 'msgtts') { i = n.getAttribute('data-i'); if (sayKey === 'm' + i) stopAll(); else speakText(mdSpeak(S.chat[+i].text), 'm' + i); }
  else if (a === 'msgdel') { i = +n.getAttribute('data-i'); S.chat.splice(i, 1); if (S.chat[i - 1] && S.chat[i - 1].role === 'user' && (!S.chat[i] || S.chat[i].role === 'user')) S.chat.splice(i - 1, 1); save(); paintChat(); }
  else if (a === 'ttspage') ttsPage(hlRoot(), false, (window.LCUR && R.page && R.page.t === 'read') ? LCUR.title : '');
  else if (a === 'ttssec') ttsSec(n);
  else if (a === 'ctpl') { S.card.tpl = n.getAttribute('data-v'); save(); render(); }
  else if (a === 'csize') { S.card.size = n.getAttribute('data-v'); save(); render(); }
  else if (a === 'cborder') { S.card.border = n.getAttribute('data-v'); save(); render(); }
  else if (a === 'cfs') { S.card.fs = +n.getAttribute('data-v'); save(); render(); }
  else if (a === 'cphoto') $('#cphotoIn').click();
  else if (a === 'cnophoto') { photoImg = null; photoBy = ''; render(); }
  else if (a === 'cpexels') openPexels();
  else if (a === 'pxq') { px.q = n.getAttribute('data-q'); var pq = $('#pxQ'); if (pq) pq.value = px.q; pxRun(true); }
  else if (a === 'pxgo') { px.q = ($('#pxQ') || {}).value || ''; pxRun(true); }
  else if (a === 'pxmore') pxRun(false);
  else if (a === 'pxpick') pxPick(+n.getAttribute('data-i'));
  else if (a === 'csave') cardSave();
  else if (a === 'cshare') cardShare();
  else if (a === 'mkcard') { var mc = window.CARDSRC && CARDSRC[n.getAttribute('data-k')]; if (mc) openStudio(mc); }
}, false);

/* ---------- 自動更新（ES5）----------
   三道保險：① version.json 輪詢（不吃快取）② Service Worker 更新事件 ③ 新 SW 啟用時通知／重新導向舊頁面。
   正在上課、朗讀、錄影（BUSY）時不打斷，只顯示更新條；空閒下來自動套用。
   防無限重整：同一個新版本最多自動重整一次，仍拿到舊檔就清快取硬更新一次，再不行只顯示更新條。 */
var BUSY = false;
var UPD = { reg: null, target: '', pending: false };
function ssGet(k) { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }
function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } }
function verFetch(ok, fail) {
  var x = new XMLHttpRequest();
  x.open('GET', 'version.json?t=' + now(), true);
  try { x.setRequestHeader('Cache-Control', 'no-cache'); } catch (e) { }
  x.timeout = 15000;
  x.onload = function () { if (x.status >= 200 && x.status < 300) { try { return ok(JSON.parse(x.responseText)); } catch (e) { } } if (fail) fail(); };
  x.onerror = x.ontimeout = function () { if (fail) fail(); };
  x.send();
}
function updBar(on) {
  var b = $('#updbar');
  if (!on) { if (b) b.parentNode.removeChild(b); return; }
  if (!b) { b = document.createElement('div'); b.id = 'updbar'; b.className = 'updbar'; b.onclick = function () { applyUpdate(false); }; document.body.appendChild(b); }
  b.textContent = T('newVer');
}
function reloadFresh() { if (window.__reloading) return; window.__reloading = 1; location.replace(location.pathname + '?u=' + now() + location.hash); }
function applyUpdate(hard) {
  updBar(false); toast(T('updating'));
  ssSet('updTry', UPD.target || 'x');
  if (!hard && navigator.serviceWorker && UPD.reg) {
    try { if (UPD.reg.waiting) UPD.reg.waiting.postMessage('skip'); UPD.reg.update(); } catch (e) { }
    setTimeout(reloadFresh, 900); return;
  }
  ssSet('updHard', UPD.target || 'x');
  var done = 0, fin = function () { if (!done) { done = 1; reloadFresh(); } };
  try {
    if (window.caches && caches.keys) caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('ot321-') === 0; }).map(function (k) { return caches['delete'](k); })); })['catch'](function () { });
    if (UPD.reg) UPD.reg.unregister().then(function () { setTimeout(fin, 300); }, fin);
  } catch (e) { }
  setTimeout(fin, 1500);
}
/* 發現新版：閒著就套用；忙著就先掛更新條，等 BUSY 解除（render 會呼叫 updIdle）。
   同一版第二次遇到 → 硬更新；硬更新過仍是舊檔（CDN 尚未生效）→ 只提示。 */
function onNewVersion(v) {
  if (!v || v === APPVER) return;
  UPD.target = v;
  if (BUSY) { UPD.pending = true; updBar(true); return; }
  if (ssGet('updHard') === v) { updBar(true); return; }
  applyUpdate(ssGet('updTry') === v);
}
function updIdle() { if (UPD.pending && !BUSY) { UPD.pending = false; onNewVersion(UPD.target); } }
function checkUpdate(manual) {
  if (navigator.onLine === false) { if (manual) toast(T('netErr')); return; }
  try { if (UPD.reg) UPD.reg.update(); } catch (e) { }
  verFetch(function (j) {
    if (j && j.v && j.v !== APPVER) onNewVersion(j.v);
    else if (manual) toast(T('upToDate'));
  }, function () { if (manual) toast(T('netErr')); });
}
function initUpdate() {
  if (!/^https?:/.test(location.protocol)) return;
  if (/[?&]u=\d+/.test(location.search) && history.replaceState) { try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { } }
  if ('serviceWorker' in navigator) {
    var sw = navigator.serviceWorker;
    sw.register('sw.js', { updateViaCache: 'none' }).then(function (reg) {
      UPD.reg = reg;
      var track = function (w) { if (w) w.addEventListener('statechange', function () { if (w.state === 'installed' && sw.controller) checkUpdate(0); }); };
      track(reg.installing); track(reg.waiting);
      reg.addEventListener('updatefound', function () { track(reg.installing); });
    })['catch'](function () { });
    sw.addEventListener('message', function (e) { var d = e.data || {}; if (d.t === 'sw-updated' && d.v && d.v !== APPVER) onNewVersion(d.v); });
    sw.addEventListener('controllerchange', function () { if (UPD.target && !BUSY) reloadFresh(); });
  }
  setTimeout(function () { checkUpdate(0); }, 2500);
  setInterval(function () { checkUpdate(0); }, 30 * 60 * 1000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') checkUpdate(0); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) checkUpdate(0); });
  window.addEventListener('online', function () { checkUpdate(0); });
}

/* ---------- 主程式事件（ext.js 處理畫線、小智、美圖；這裡處理頁面） ---------- */
document.addEventListener('click', function (e) {
  var n = e.target; while (n && n !== document && !(n.getAttribute && n.getAttribute('data-act'))) n = n.parentNode;
  if (!n || n === document) return;
  var a = n.getAttribute('data-act'), v = n.getAttribute('data-v'), i = +n.getAttribute('data-i'), x = LCUR && LCUR.x;
  if (a === 'tab') { var t = n.getAttribute('data-t'); if (t === 'xz') { openXz('', LCUR && R.page.t === 'read' ? XZ.ctx : ''); } else open_({ t: t }); }
  else if (a === 'go') { e.stopPropagation(); open_({ t: 'read', n: +n.getAttribute('data-n') }); }
  else if (a === 'golisten') { e.stopPropagation(); ttsUnlock(); R.sub.autoplay = 1; open_({ t: 'read', n: +n.getAttribute('data-n') }); }
  else if (a === 'rand') { var ar = idxNums(); open_({ t: 'read', n: ar[Math.floor(Math.random() * ar.length)] }); }
  else if (a === 'nav') { if (n.getAttribute('data-blank')) studio = { t: T('blankVerse'), ref: T('blankRef'), n: '', n0: '' }; open_({ t: n.getAttribute('data-t') }); }
  else if (a === 'font') cycleFont();
  else if (a === 'lang') switchLang(n.getAttribute('data-lang'));
  else if (a === 'lf') { LST.f = v; vList(); }
  else if (a === 'lfstar') { LST.f = 'st'; LST.seg = -1; open_({ t: 'list' }); }
  else if (a === 'lseg') { LST.seg = +v; vList(); }
  else if (a === 'fulls') fullSearch();
  else if (a === 'ttsfrom') { stopAll(); ttsPage(hlRoot(), true, LCUR ? LCUR.title : ''); }
  else if (a === 'coread') { if (window.CR) CR.sheet(); }
  else if (a === 'askl' && x) openXz(T('askLesson', x.lab || x.n, x.t), XZ.ctx);
  else if (a === 'cardl' && x) { var vt = ''; eachA(x.v.slice(0, 2), function (q) { vt += q[2]; }); openStudio({ t: vt, ref: x.ref, n: x.dc || '' }); }
  else if (a === 'carddc' && x) openStudio({ t: x.dc, ref: T('appName') + '・' + T('noFmt', x.n), n: '', plain: true });
  else if (a === 'saydc' && x) speakText(T('declLead') + x.dc + '。' + x.dc, 'dc');
  else if (a === 'star' && x) { if (S.star[x.n]) delete S.star[x.n]; else { S.star[x.n] = now(); toast(T('starred')); } save(); n.innerHTML = (S.star[x.n] ? '★' : '☆') + ' ' + esc(T('starB')); }
  else if (a === 'sharel' && x) shareText(lessonShare(x));
  else if (a === 'done' && x) markDone(x.n);
  else if (a === 'quiz' && x) open_({ t: 'quiz', n: x.n });
  else if (a === 'quizre') { QZ = null; render(); }
  else if (a === 'qzpick') { if (QZ.picked >= 0) return; QZ.picked = i; if (i === QZ.qs[QZ.i].a) QZ.ok++; quizPaint(); }
  else if (a === 'qznext') { QZ.i++; QZ.picked = -1; quizPaint(); window.scrollTo(0, 0); }
  else if (a === 'setfont') { S.set.font = i; save(); applyChrome(); render(); }
  else if (a === 'settheme') { S.set.theme = ['', 'light', 'sepia', 'dark'][i]; save(); applyChrome(); render(); }
  else if (a === 'setlang') switchLang(['zh', 'zs', 'en'][i]);
  else if (a === 'sethuman') { S.set.human = !i; save(); render(); }
  else if (a === 'setvoice') { S.set.voice = i; save(); render(); }
  else if (a === 'setrate') { S.set.rate = i - 2; save(); render(); }
  else if (a === 'voicetest') speakText(T('voiceSample'), 'vt');
  else if (a === 'setaud') { S.set.aud = AUD_KEYS[i]; save(); render(); toast(T('audSet', T('auds').split('|')[i])); }
  else if (a === 'setaud2') { S.set.aud = AUD_KEYS[i]; save(); closeHSheet(); if (XZ.open) drawXz(); toast(T('audSet', T('auds').split('|')[i])); }
  else if (a === 'audpick') audPick();
  else if (a === 'xzfs') { S.set.font = ((S.set.font == null ? 1 : S.set.font) + 1) % 5; save(); applyChrome(); toast(T('fonts').split('|')[S.set.font]); }
  else if (a === 'xzopt') { XZ.opt = !XZ.opt; paintOpts(); }
  else if (a === 'audtog') { XZ.audOpen = !XZ.audOpen; if (XZ.audOpen) XZ.qsOpen = false; paintOpts(); }
  else if (a === 'xzaud') { S.set.aud = AUD_KEYS[i]; save(); XZ.audOpen = false; paintOpts(); toast(T('audSet', T('auds').split('|')[i].replace(/^\S+\s/, ''))); }
  else if (a === 'setlen') { S.set.alen = LEN_KEYS[i]; save(); paintOpts(); var ln = T('lens').split('|')[i]; if (!reAnswerLast(T('lenSet', ln))) toast(T('lenSet2', ln)); }
  else if (a === 'setbg') { S.set.skbg = BG_KEYS[i]; save(); paintOpts(); var bn = T('bgNames').split('|')[i]; if (!reAnswerLast(T('bgSet', bn))) toast(T('bgSet2', bn)); }
  else if (a === 'offline') offlineAll();
  else if (a === 'backup') backupOut();
  else if (a === 'restore') $('#bkfile').click();
  else if (a === 'chkupd') checkUpdate(1);
  else if (a === 'hardupd') applyUpdate(true);
  else if (a === 'install') installApp();
  else if (a === 'copyacct') copyText(v);
  else if (a === 'medals') medalList();
  else if (a === 'fu') sendChat(n.getAttribute('data-q'));
  else if (a === 'playvid') playVid(n);
  else if (a === 'ymgo') ymStart();
  else if (a === 'ymcopy') { var ta = $('#ymjson'); copyText(ta.value); ta.select(); }
}, false);
window.addEventListener('scroll', function () { var t = $('.tb'); if (t) t.classList.toggle('sh', window.scrollY > 4); }, { passive: true });
setInterval(function () { BUSY = isBusy(); updIdle(); }, 20000);

/* ---------- 多音字補強（依本 App 內容盤點） ---------- */
TTS_FIX.push([/降服/g, '祥服'], [/朝著/g, '潮著'], [/朝着/g, '潮着'], [/臉朝/g, '臉潮'], [/脸朝/g, '脸潮'], [/省察/g, '醒察'], [/反省/g, '反醒'], [/自省/g, '自醒'], [/相稱/g, '相趁'], [/相称/g, '相趁'], [/曾孫/g, '增孫'], [/曾孙/g, '增孙'], [/便雅憫/g, '變雅憫'], [/便雅悯/g, '变雅悯']);

/* ---------- 開機 ---------- */
(function boot() {
  applyChrome();
  loadPack(L(), function () { applyChrome(); render(); });
  initUpdate();
  loadVids();
  setTimeout(function () { if (S.set.human && navigator.onLine !== false) ajax('POST', SVC.tts, { voice: voiceName(), rate: '+0%', sil: 0, silc: 0, sile: 0, text: '。' }, 'arraybuffer', function () { }); }, 1200);
})();
