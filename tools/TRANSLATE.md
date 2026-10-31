# 英文版補譯規則（給每日英文翻譯排程）

`tools/pending_en.json` 列出還沒有英文的課號 n。這些課在 `data/en-XX.json`（XX = (n-1)//50，兩位數）裡暫時放簡體中文，並標有 `"pending": 1`。

每一課：
1. 以 `data/zh-XX.json` 同一個 n 的繁體版為原文。
2. 把 `t`、`b`（每段）、`ah`、`a`（每組 [標題, 說明]）、`q`（每題）、`pr`、`dc` 翻成自然、溫暖、清楚的英文，寫回 `data/en-XX.json` 那一課；`n`、`ref`、`lab`、`bk`、`v`（WEB 經文）不要動；刪掉 `pending`。
3. 段落數、題數、`pr` 的換行數都和原文一致；空字串保持空字串。
4. 用語照 World English Bible：耶和華 → the LORD（句首 The LORD）；上帝／神 → God；稱呼神的「祢／您」→ You（大寫）；人名地名用 WEB 拼法（Job, Eliphaz, Bildad, Zophar, David, Solomon…）。經文出處寫成 "2 Chronicles 33:12"。禱告結尾「奉主耶穌基督的名禱告，阿們」→ "In the name of the Lord Jesus Christ we pray. Amen."（我／我們照原文）。
5. 標題 t 用英文標題大小寫；若原標題是「某卷 第N章導讀」就寫 "Guide to <Book> N"。
6. 更新 `data/idx-en.json` 中該課那一列：第 2 欄換成英文標題，第 4 欄換成英文第一段的第一句。
7. 全部完成後把 `tools/pending_en.json` 改成 `[]`，執行 `python3 tools/bump.py`，然後 commit 並 push 到 main。
