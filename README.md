# 321舊約導讀

國度321空中團契・舊約導讀 PWA。共 444 章：創世記至以斯帖記全部（創世記一章一課），加上約伯記 1–8 章。路得記、歷代志上下與約伯記取自團契頻道導讀影片的說明欄。利未記 27 章取自 YouTube 播放清單「舊約聖經導讀-利未記」影片說明。每章都連結國度321空中團契頻道的導讀影片（繁體介面放繁體版；簡體與英文介面放簡體版；只有一種版本時共用；data/videos.json）。外殼沿用《321真理點心》：逐句朗讀、畫線默想、問小智（十種回答對象、回答長度、慕道友信仰背景）、經文美圖、讀經樂測驗、讀經獎章、團契聚會卡、離線閱讀、自動更新。

目錄依「書卷 → 章」排列；右上角「繁｜简｜EN」切換。中文經文取自《321互動聖經》的和合本（繁／簡），導讀、上帝的教導、禱告與應用題目照原稿。英文版經文採用 World English Bible（WEB，公有領域），逐節取自官方 USFM 檔；英文導讀、教導、禱告與應用題目為翻譯。

## 上傳到 GitHub Pages

1. 在 GitHub（帳號 spch321-sudo）建立新的 repo，名稱：`321ot`。
2. 把這個資料夾裡的**全部檔案與 `data` 資料夾**原樣上傳到 repo 根目錄（Upload files → 整批拖進去）。
3. Settings → Pages → Branch 選 `main`、資料夾 `/ (root)` → Save。
4. 約 1～10 分鐘後即可開啟：`https://spch321-sudo.github.io/321ot/`

## 之後更新

每次更新把新版整批上傳覆蓋，特別是 `index.html`、`app.js`、`sw.js`、`version.json`。已安裝的手機打開或切回 App 就會自動換成新版；也可以到「我的 → 檢查更新」。

## 檔案說明

| 檔案 | 用途 |
|---|---|
| index.html | 外觀與版面 |
| app.js | 主程式（ES5，WPS／舊手機也能跑） |
| media.js | 美圖工作室的配樂、錄音、錄影、我的作品 |
| lang-zs.json | 簡體介面文字 |
| data/idx-zh.json、data/idx-zs.json、data/idx-en.json | 目錄（繁／簡／English）：[編號, 主題, 經文出處, 摘要, 書卷序, 章名] |
| data/zh-00…、data/zs-00…、data/en-00… | 全部章節內容（繁／簡／English），每 50 章一包 |
| lang-en.json | 英文介面 |
| sw.js、version.json | 離線與自動更新 |
| manifest.json、icon-*.png、apple-touch-icon*.png | 加到主畫面的圖示 |

詩歌庫沿用《321互動聖經》（同網域 `../bible/music.json`）。
