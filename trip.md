# ECCV 2026 旅程簡報

> 給後續 agent 的精簡背景資料。最後同步：2026-09-05。
> 旅程日期為 2026-09-06 至 2026-09-19；網站介面使用繁體中文。

## 每日行程地圖 GPS 即時定位小藍點與多平台支援（2026-09-05）

- **每日路線地圖 Google Maps 風格 GPS 定位藍點（`site/js/pages/day.js`、`site/css/styles.css`）**：
  - 於每日行程頁面互動路線地圖（Leaflet）右上角加入一鍵定位按鈕（⌖）。
  - 點擊按鈕直接觸發裝置原生 W3C Geolocation API（`navigator.geolocation.getCurrentPosition`），免用任何第三方付費或外部 API。
  - **高質感藍點視覺**：在 Leaflet 地圖上繪製 Google Maps 風格的實心藍點、白邊陰影、外圍脈衝呼吸光環（`gps-pulse` 動畫）與半透明精確度半徑圓（`L.circle`）。
  - **智慧距離偵測與視野回航**：當定位座標距離今日行程超過 50 公里時（如出發前在台灣測試），地圖平滑平移至目前位置並浮現「📍 已定位（距離今日行程約 X 公里）」與「回到今日行程」捷徑按鈕，點擊可秒級縮放回當日路線。
  - **獨立圖層維護**：將使用者 GPS 標記維護在獨立的 `userLocationLayer`，切換同一天不同路線分組（如備援方案 A／方案 B）時，小藍點持續保留不被清除。
  - **全平台原生支援**：Android APK（已具備 `ACCESS_FINE_LOCATION` 與 `ACCESS_COARSE_LOCATION` 權限）、iPhone Safari / PWA 與桌面瀏覽器全數相容。
- **全站快取升級**：PWA 快取版本提升至 `eccv-guide-v20260905-13`，全站 19 份 HTML 檔案、`site/sw.js` 與工具頁版本資訊同步更新。

## 歐洲急難救助整合、Android 定位權限與手機邊界白邊修復（2026-09-05）

- **Android 定位權限配置（修復 APK 天氣 GPS 功能）**：
  - 於 `android/app/src/main/AndroidManifest.xml` 補齊 `android.permission.ACCESS_FINE_LOCATION` 與 `android.permission.ACCESS_COARSE_LOCATION`。
  - 宣告 `android.hardware.location.gps`（`required="false"`），確保各類型 Android 裝置皆能安裝並正常於 App 內取得 GPS 定位即時天氣。
- **歐洲急難救助與駐外代表處卡片（`site/logistics.html`）**：
  - 交通頁頂部導覽列新增「🚨 急難救助 (3國)」獨立分類分頁與快速統計徽章。
  - **歐盟通用 112 橫幅**：全螢幕高對比紅色警戒橫幅，提供一鍵直撥 `112` 功能（瑞典、丹麥、法國全境通用，免解鎖免 SIM 卡皆可撥打）。
  - **三國在地緊急專線**：瑞典（112 / 114 14 / 1177）、丹麥（112 / 114 / 1813 首都圈就醫分流）、法國（112 / 15 SAMU 急救 / 17 報警 / 18 消防），所有號碼皆具備一鍵撥號按鈕。
  - **駐外代表處 24 小時急難專線**：完整列出駐法國台北代表處（巴黎）、駐瑞典台北代表處（斯德哥爾摩）、駐丹麥台北代表處（哥本哈根）與台灣外交部緊急聯絡中心之實體地址、地鐵站點、總機電話與 24H 急難求助電話。
  - **護照遺失處理 SOP**：4 步處理流程，直接串聯托運行李箱內已打包備援之「2 吋照片 2 張、中華民國身分證影本、護照影本」，提供報案證明取得、申請入國證明書與航空公司票務通報指引。
  - **信用卡客服與海外額度緊急救援（國泰世華）**：新增「信用卡客服與額度緊急救援」區塊，包含國泰世華 24H 海外緊急直撥專線（`+886-2-2383-1000`）、台灣市話免付費專線（`0800-818-001`）與 Visa / Mastercard 全球急難支援電話；並附帶臨時調高額度、遭擋刷解除與 CUBE App 帳務即時溢繳救援指引。
  - **全站搜尋索引同步**：搜尋框支援「急難」、「報警」、「警察」、「救護車」、「代表處」、「112」、「護照遺失」、「國泰世華」、「信用卡」、「刷爆」、「臨時調額」等關鍵字即時搜尋直達。
- **手機頂部挖孔遮蔽與底部白邊徹底修復**：
  - 全站 19 份 HTML `<meta name="viewport">` 補齊 `viewport-fit=cover`，支援現代手機全螢幕滿版無黑白邊渲染。
  - 樣式表 `html` 設定 `background: var(--paper)`，解決彈性滾動（rubber-banding）與手勢導航外框露出白色預設底色問題。
  - `.site-header` 與搜尋結果選單適配 `env(safe-area-inset-top)`，避開 Samsung S23 等裝置之頂部前鏡頭挖孔與系統狀態列圖示。
  - `body`、`.mobile-nav` 與 `.site-footer` 適配 `env(safe-area-inset-bottom)`，並在 `capacitor.config.json` 加入 `"backgroundColor": "#f5f2ea"` 及 `android/app/src/main/res/values/styles.xml` 加入系統導覽列背景色彩 `#f5f2ea`，徹底消除手機螢幕下半部白邊。
  - 補充 `<meta name="mobile-web-app-capable" content="yes" />`，消除現代行動瀏覽器之過期警告。
- **GPS 即時定位天氣按鈕（小工具頁與首頁）**：
  - 小工具頁（`site/tools.html`）歐洲天氣分頁新增「🧭 GPS 定位」第 4 分頁與面板，並配置「取得 GPS 定位」操作按鈕。
  - 點擊按鈕即時呼叫 `navigator.geolocation.getCurrentPosition()`，觸發 Android 系統定位授權彈窗；取得經緯度後自動比對最近城市並向 Open-Meteo 查詢即時氣溫、體感、降雨機率與 5 天預報。
  - 完整防禦處理：針對定位授權遭拒、地下室訊號不良、逾時等情境提供清楚的繁體中文引導與重試機制。
  - 首頁頂部工具列加入「📍 GPS 定位天氣」直達錨點（`tools.html#weather-gps`）。
- **App 版本更新與強制清除快取重啟機制**：
  - 小工具頁（`site/tools.html`）新增「版本更新與離線維護」區塊，包含「🔄 清除快取並關閉 App」、「📥 下載最新 APK 安裝檔」與「🌐 開啟線上最新網頁版」功能。
  - Android 原生層新增 `AppUpdaterPlugin`，點擊清除快取時精確呼叫 `webView.clearCache(true)` 清除本機磁碟與記憶體快取，**嚴格保留 `localStorage`（不清除行李清單勾選狀態、自訂項目與翻譯設定）**，並調用 `finishAffinity()` 安全關閉 App，方便重新開啟時載入最新編譯資源。
  - 清楚說明離線 APK 架構特性：單純關閉 App 無法隔空取得 GitHub 雲端新程式碼；若有新功能釋出，使用者可點擊直連按鈕一鍵下載最新 APK 覆蓋升級。
- **全站快取升級**：PWA 快取版本提升至 `eccv-guide-v20260905-09`，全站 19 份 HTML 檔案與 `site/sw.js` 同步更新。

## 行李清單 QR Code 分享與相機掃描還原（2026-09-05）

- **匯出全面 QR Code 化（移除 Base64 文字方塊）**：
  - 行李準備清單頁（`site/packing.html`）同步彈窗「匯出與分享」改為直接展示高解析度向量 SVG QR Code，畫面極簡乾淨，不再顯示冗長 Base64 文字框。
  - Payload 大幅精簡優化：預設項目僅編碼勾選清單，大幅降低字元數，讓 QR 碼在手機與筆電螢幕上皆呈現寬鬆、秒級對焦辨識之密度。
  - 保留「🔗 複製同步連結」與「📤 分享 (AirDrop)」，兼顧 AirDrop 與相機掃描等多種跨裝置分享習慣。
- **相機掃描即時還原（Camera QR Scanner）**：
  - 「掃描與匯入」分頁導入相機取景器（`navigator.mediaDevices.getUserMedia`），支援硬體加速 `BarcodeDetector` 與輕量純前端 `jsQR` 備援。
  - 鏡頭對準 iPhone／MacBook 螢幕上的 QR Code 即可秒級掃描識別，解析後跳出確認對話框（顯示總物品數與勾選進度），確認後即時套用並覆蓋清單。
  - 關閉彈窗或切換分頁時自動釋放鏡頭資源（停止 track 串流），確保省電與隱私。
  - 保留折疊式手動貼上備用選項，即使裝置無相機或未授權鏡頭亦能手動輸入還原。
- **純離線運作與 PWA 快取升級**：
  - 引入純客戶端離線模組 `site/vendor/qr/qrcode.min.js` 與 `site/vendor/qr/jsqr.min.js`，完全不依賴外部第三方 API。
  - PWA 快取版本提升至 `eccv-guide-v20260905-07`，全站 19 份 HTML 檔案與 `site/sw.js` 同步更新。

## 全站文字去 AI 化與 PWA 快取升級（2026-09-05）

- **繁體中文語感優化與去 AI 模式**：
  - 全站清除破折號（`—` 與 `–`），改採自然連接詞（`到`、`至`、`-`）與標準全形標點符號。
  - 移除「標誌著」、「至關重要」、「充當」、「充滿活力」、「這不僅僅是…更是…」等機械化 AI 句型，改以流暢俐落的在地繁體中文敘事。
  - 完整保留所有日期、航班、座位、票號、價格、交通與行李規範等客觀事實。
  - 經手機（390 × 844）與電腦（1280 × 800）雙重視口驗證，無水平溢出且版面排版緊湊易讀。
- **全站快取升級**：PWA 快取版本提升至 `eccv-guide-v20260905-06`，全站 19 份 HTML 檔案與 `site/sw.js` 同步更新。

## 前端邏輯模組化拆分與 PWA 快取升級（2026-09-05）

- **架構模組化拆分（維持零打包靜態架構）**：
  - 將原先單檔 4,600 行的 `site/js/app.js` 拆分為 Android 原生硬體層、全站核心共用層、安全憑證層與 6 個獨立頁面邏輯模組，提升多 Agent 並行維護效率並降低 Git Conflict 機率。
  - `site/js/android.js`：封裝 Samsung S23 Knox 指紋外掛、Android 離線翻譯外掛與原生返回鍵堆疊。
  - `site/js/core.js`：處理主題切換、搜尋系統、手勢換頁與全站版面骨架。
  - `site/js/tickets.js`：處理 Web Crypto AES-256 GCM 票券解密、PDF.js 動態載入與出示 Modal。
  - `site/js/pages/`：`home.js`、`day.js`、`places.js`、`logistics.js`、`packing.js`、`tools.js` 各自獨立運作。
  - `site/js/app.js`：精簡為純調度器，依 `body.dataset.page` 執行渲染。
- **全站快取升級**：PWA 快取版本提升至 `eccv-guide-v20260905-05`，全站 19 份 HTML 檔案同步更新載入標籤與快取版本號。

## Android App 原生 Knox 指紋與跨平台 WebAuthn 生物辨識保險箱（2026-09-05）

- **20 碼高強度密碼重新加密與 GitHub Pages 部署防護**：
  - 票券加密全面更新為 20 碼高強度隨機密碼（含英數大小寫與特殊符號），透過 600,000 次 PBKDF2-HMAC-SHA256 疊代計算衍生 256 位元金鑰，並由 AES-256-GCM 進行驗證加密。
  - `.gitignore` 解除 `site/assets/tickets/*.enc` 限制，使加密票券得以安全部署於 GitHub Pages 提供靜態線上開啟；本地端原始機密檔（`pdf/`、`raw_tickets/` 與 `*.pdf`）嚴格維持本機忽略，確保公開倉儲絕無原始明文洩漏。
  - 即便攻擊者自公開 GitHub Pages 下載 `.enc` 檔案，在 600,000 次 PBKDF2 運算成本下，20 碼高強度隨機密碼於數學上無法被現代算力在旅程期間暴力破譯。
- **雙軌生物辨識快速出示支援**：
  - **Android 原生 App（Samsung Knox）**：由 Android Keystore 與硬體安全晶片（TEE）生成硬體綁定金鑰，強制活體指紋授權驗證（BiometricPrompt CryptoObject）。
  - **Apple 與現代瀏覽器（WebAuthn）**：支援 MacBook Touch ID、iPhone Face ID / Touch ID 透過安全隔離區（Apple Secure Enclave）生成平台認證金鑰，以 PBKDF2 + AES-256-GCM 本機加密保管票券密碼，達成全平台指紋／臉部感應快速出示。
  - **動態設備適配介面**：彈窗與啟用提示卡片依裝置自動呈現專屬標題與圖示（如「MacBook Touch ID 快速出示」、「Apple Face ID / Touch ID 快速出示」與「Samsung S23 指紋快速出示」）。
- **APK 與本機資安防護架構**：
  - **APK 零寫死密鑰**：APK 安裝檔、JavaScript 與 Java 原始碼中均不包含密碼或解密金鑰，無法藉由反編譯（decompile）取得通關密碼。
  - **Samsung Knox 硬體安全隔離**：首次由使用者在 App 內手動輸入正確密碼並成功解密後，使用者可自主選擇綁定指紋；密碼由 Android 系統 Keystore 在獨立安全晶片（TEE / Knox Secure Processor）內生成專屬 AES-256-GCM 硬體金鑰加密後存放於應用程式私有目錄，金鑰無法被匯出。
  - **硬體強制生物辨識驗證（`setUserAuthenticationRequired(true)`）**：Keystore 在硬體底層強制要求真實指紋授權驗證（BiometricPrompt CryptoObject），方允許執行解密運算；即便裝置遭 Root 或私有資料被複製，無活體指紋授權將直接被晶片拒絕解密。
  - **系統防篡改自毀機制（`setInvalidatedByBiometricEnrollment(true)`）**：若在 Android 系統設定中新增或變更其他指紋，Keystore 金鑰將自動永久作廢，系統自動清除儲存密文並退回手動輸入密碼，防止藉由新增指紋破解。
- **全站快取升級**：PWA 快取版本提升至 `eccv-guide-v20260905-12`，全站 19 份 HTML 檔案與 `site/sw.js` 同步更新。

## TPE 至 CPH 全程官方雙段電子登機證整合（2026-09-05）

- **去程兩段真實登機證全數取得入庫**：
  - 本機正式存檔為 `pdf/2026-09-06_to_09-07_EK367-EK151_TPE-DXB-CPH_boarding-passes.pdf`（雙頁包含完整 2D 條碼與核驗序號）。
  - 第 1 段 EK 367（台北桃園 TPE → 杜拜 DXB）：座位 `49C`，Group 6，托運截止 22:20，登機門 23:05 開放。
  - 第 2 段 EK 151（杜拜 DXB → 哥本哈根 CPH）：座位 `25H`，Group 4，安檢截止 07:20，登機門 07:20 開放。
- **替換暫存之官方電子機票**：
  - 隱藏原僅作為備查的「阿聯酋航空電子機票」（`emirates-flights`），全面改由真實官方雙段登機證（`ek367-boarding-pass`）接軌 09/06 與 09/07 每日時間軸。
  - 交通頁（`site/logistics.html`）有效票券清單收斂為 9 張真實票證，過濾已隱藏之備用憑證。
  - 09/07 杜拜轉機時段（04:35–08:20）直接關聯 EK 151 登機證，出示即可直接掃碼轉機登機。
- **全站快取升級**：PWA 快取版本提升至 `eccv-guide-v20260905-11`。

## PDF 雙指手勢縮放與票券彈窗優化（2026-09-05）

- **雙指縮放（Pinch-to-zoom）與平移**：PDF 畫布與 QR 碼容器實作原生觸控手勢監聽，支援雙指縮放（1.0x 到 4.0x），並在放大狀態下支援單指拖曳平移；雙指縮放與拖曳時自動鎖定邊界，防止畫布飛出視窗。
- **雙擊快速縮放（Double-tap zoom）**：在票券視窗內快速雙擊可於 2.2x 局部放大與 1.0x 預設全頁之間切換，簡化單手查驗條碼與座位資訊流程。
- **直覺縮放控制列**：票券頂部新增緊湊型縮放工具列，提供「＋（放大）」、「－（縮小）」、「重設（回到 100%）」按鈕與即時縮放百分比數值顯示，手機與桌機皆可一鍵點擊縮放。
- **防誤觸導覽隔離**：滑動換日導覽手勢中排除票券彈窗與縮放視窗區域，避免在票券上放大檢視或平移時誤觸全站日期切換。

## K7 文化通行證適用日程收斂與票券介面語意優化（2026-09-05）

- **K7 文化通行證（Week 37）適用日程精確收斂**：
  - K7 數位通行證（青年通行證）雖然有效期間為整週（2026/09/07 到 09/13），但僅於實際參訪 K7 合作館點的日期（`09/08` Malmö Museum、`09/11` Rosenborg 城堡）顯示票券橫幅與出示捷徑。
  - 於 ECCV 研討會全日或無 K7 景點的日程（如 `09/10`），隱藏 K7 票券區塊，保持行程介面乾淨。
- **去除冗餘技術術語**：
  - 交通頁（`site/logistics.html`）與每日行程頁（`site/days/*.html`）移除「加密安全區」、「安全加密」、「解密出示」等字眼。
  - 區塊標題由 `票券與入場憑證 (加密安全區)` 調整為 `票券與入場憑證`（`TICKETS & PASSES`）。
  - 狀態標籤由 `🔒 X 張加密票證` 調整為 `🎫 X 張票券憑證`。
  - 按鈕文字由 `🔒 輸入密碼出示 QR` / `🔒 出示 QR 票券` 統一為 `🎫 出示票券憑證`。
  - 密碼驗證彈窗文案精簡為「票券驗證」與「出示憑證與 QR 碼」，去除長篇演算法技術說明。
- **09/08 瑞典 Malmö Museum 關聯**：Malmö Museum（包含 Malmöhus 城堡、水族館、藝術館與科技海事館）為 K7 Week 37 合作館，18 到 27 歲青年出示 K7 通行證享免費入場；時間軸各站點直接關聯 K7 票券按鈕，滿 28 歲同行者現場購買 Kombibiljett（100 SEK）。
- **09/11 丹麥 Rosenborg 城堡關聯**：依官方公告，Rosenborg 城堡在 K7 活動期間開放青年免費入場，時間軸相應關聯 K7 通行證按鈕，同行者維持持學生票（100 DKK）。
- **排隊／安檢按鈕去重**：針對 09/12 Nyhavn 3 候船、09/14 Sainte-Chapelle 集合安檢、09/16 凱旋門地下安檢與羅浮宮金字塔排隊、09/17 凡爾賽宮安檢等排隊等候項目，移除重複的「出示 QR 票券」按鈕；票券按鈕唯一呈現在實際入館參觀的主項目上。

## 小工具推薦 App 與交通快速導航（2026-09-04）

- 小工具頁（`site/tools.html`）底部依旅程時間順序提供 4 款出國交通與登機必備官方 App，每款皆附 iOS App Store 與 Android Google Play 下載連結、官方網站及單行描述：
  1. **瑞典公車與跨海鐵路**（09/07 到 09/12 Malmö & 跨海火車）：`Skånetrafiken`（Malmö 市區公車 Bus 9 與跨海鐵路 Øresundståg 購票搭乘必備，同行享聯票折扣）。
  2. **丹麥地鐵與交通規劃**（09/09, 09/11 到 09/12 哥本哈根）：`Rejseplanen`（丹麥官方大眾運輸即時動態與轉乘規劃，涵蓋哥本哈根地鐵 M1 到 M4、S-tog 與公車路網）。
  3. **廉航登機與報到**（09/12 哥本哈根 CPH 到巴黎博韋 BVA）：`Ryanair`（09/12 航班 FR9267 必備，出發前 24 小時線上 Check-in 下載電子登機證，避免機場臨櫃費用）。
  4. **法國巴黎地鐵交通**（09/13 到 09/18 巴黎）：`Bonjour RATP`（巴黎 Metro、RER 即時路網動態、轉乘導航，並支援手機 NFC 感應加值 Navigo 數位交通票）。
- 頁首導覽列包含 4 欄並列（天氣、匯率、翻譯、推薦 App），點擊平滑滾動至推薦卡片區；支援手機單欄與桌機雙欄排版，相容淺色與深色模式。

## 原始 PDF 票券加密保護與即時出示（2026-09-04）

- 移除手繪或合成之假 QR code，全面採用本機 `pdf/` 原始官方憑證二進位檔直接加密：包含阿聯酋航空官方電子機票、09/12 Stromma 運河船、09/12 救主堂螺旋塔、09/12 瑞安航空 FR9267、09/14 聖徒禮拜堂 4 人門票、09/16 凱旋門 4 人門票、09/16 羅浮宮 4 人門票，以及 09/17 凡爾賽宮全區 Passport 門票等 8 份真實憑證。
- 加密安全標準：採用 Web Crypto AES-256-GCM 演算法與 PBKDF2（600,000 次 SHA-256 疊代加鹽金鑰衍生），解密密碼由個人安全保險箱與本機環境變數管理，不提交於公開儲存庫；前端介面全面移除密碼提示，確保存放於本機或快取的 `.enc` 密文無金鑰無法解讀。
- 純記憶體即時解密與原生 PDF 檢視：點擊票券後於瀏覽器記憶體內解密，透過暫時性 Blob URL 於彈窗中安全檢視真實 PDF（含官方可掃描之原始 QR code），並提供新分頁開啟與下載備份；關閉彈窗即刻銷毀 Blob URL，不留磁碟暫存。
- 手機解密自動全螢幕檢視：輸入正確密碼後，手機直向螢幕自動擴展為全螢幕檢視模式，標題列提供縮放切換鈕與快速關閉鈕，方便現場海關安檢或博物館驗票閘門掃描。
- Android WebView 與跨平台 PDF.js 離線高解析渲染：本機內建 Mozilla PDF.js 引擎（`site/vendor/pdfjs/`），解密後的二進位資料可直接以 2x 到 3x Retina DPR 渲染至 HTML5 Canvas，解決 Android WebView 無法以 iframe 內嵌 PDF 的相容性問題；若 PDF.js 載入異常亦具備 iframe 降級備援。
- Android 返回手勢原生相容：利用 `pushState` 與 `popstate` 監聽，Android 用戶在全螢幕檢視票券時輕觸系統返回鍵或返回手勢即可關閉彈窗並銷毀暫存，避免直接退出 App。
- 交通頁（`site/logistics.html`）與每日行程時間軸（09-06、09-07、09-12、09-14、09-16、09-17、09-18、09-19 等）連結對應官方憑證。

## 開發流程與專案記憶規範（2026-09-05）

- 任何 Agent 開始規劃、實作功能或修改程式碼前，**必須主動讀取 `trip.md` 與本機專案記憶 `/memories/repo/workflow.md`**，無需使用者額外提醒。
- `site/` 同時提供靜態網頁與 Capacitor Android App（`com.kevin.eccvtrip`）使用。
- 本機除錯與 Playwright 瀏覽器測試固定使用 Port `8080`（`http://localhost:8080`）。
- 介面以手機版面優先（寬度 390px 底部導覽），電腦版面（雙欄對齊與頂部導覽）在每次變更前亦須完成視覺檢查。
- 每個頁面功能修改完成後，須執行視覺檢查、`git diff --check`、格式化 commit 並推送至遠端 `origin`。

## 行李清單全包款結構化分組與順序調整（2026-09-04）

- **隨身小包（13 項，劃分 3 組）**：
  - **證件／財物**（5 項）：護照、主要信用卡、歐元現金、錢包、房卡／住宿鑰匙。
  - **隨身 3C**（2 項）：手機、行動電源（依航空安全規範客艙隨身、嚴禁托運）。
  - **個人日用**（6 項）：袖珍包衛生紙 ×2、摺疊傘、保溫瓶、原子筆、口罩、環保餐具。
- **後背包（16 項，劃分 4 組）**：
  - **3C／電器**（6 項）：MacBook、iPad、Sony WH-1000XM6 耳機、3.5 mm 飛機耳機線、多孔 GaN 充電器、轉接頭。
  - **藥品／工具**（4 項）：普拿疼、過敏藥、腸胃藥、剪刀（剪刀刀刃長度須在 6 cm 內且為圓頭／安全剪刀）。
  - **機上／保暖**（4 項）：旅行頸枕、遮光眼罩、發熱衣 ×1、保暖外套。
  - **個人備援**（2 項）：備用眼鏡、備用信用卡。
- **托運行李箱（38 項，劃分 6 組）**：
  - **衣物**（9 項）：短袖 ×7、發熱衣 ×1、長褲 ×4、正式衣服一套、內褲 ×5、襪子 ×7、睡衣 ×3、防風防水外套、藍白拖。
  - **盥洗**（6 項）：牙刷、牙膏、洗髮精、沐浴乳、刮鬍刀、梳子。
  - **洗衣／日用**（7 項）：塑膠袋／環保袋、洗衣袋、洗衣精、毛巾、晾衣繩、晾衣架、S 掛鉤。
  - **電器**（6 項）：延長線 ×2、轉接頭 ×3、備用豆腐頭 ×2、無線充電盤、熱水瓶、吹風機。
  - **文件／備援**（4 項）：護照影本、保險影本、身分證影本、2 寸照片。
  - **行李／其他**（6 項）：指甲剪、行李電子秤、行李束帶、姓名牌、時鐘、自拍棒。
- 全站行李清單 67 項全數具備分類標題（Group），在手機與電腦版面上皆以獨立區塊呈現，方便逐區點收。

## 行李清單自訂編輯與本機快取儲存（2026-09-04）

- 行李準備清單頁面（`site/packing.html`）提供「編輯清單」模式，支援在手機與電腦版面上直接修改現有項目名稱、刪除不需要的項目、於各包款新增物品，以及新增行李箱自訂分類群組。
- 所有編輯操作、新增項目與刪除異動皆即時儲存至瀏覽器本機快取（`localStorage` 的 `eccv-packing-custom-v1`），重新整理頁面後自訂內容完整保留。
- 勾選進度追蹤（`eccv-packing-checklist-v1`）同步支援自訂物品的狀態存取，刪除項目時自動清除對應勾選紀錄；工具列提供「重設勾選」與「恢復預設」復原機制。
- PWA 快取版本升級至 `v20260904-01`，確保各頁面資源即時載入最新版邏輯。

## 行李清單跨裝置同步與 AirDrop 原生分享（2026-09-04）

- 行李準備清單頁（`site/packing.html`）工具列提供「⇄ 同步／匯出」功能，實作 iPhone 與 MacBook 純前端無伺服器雙向同步。
- 支援完整 UTF-8 編碼（`TextEncoder` 與 `TextDecoder`），即使使用者自訂繁體中文物品名稱（如伴手禮、常用藥物）或自訂分類群組，皆能穩定編碼為 URL-safe Base64，無亂碼問題。
- **匯出與分享**：點擊開啟同步彈窗，產生包含目前所有自訂項目結構與勾選狀態的同步碼；提供「📋 複製代碼」、「🔗 複製同步連結」與「📤 分享 (AirDrop)」（透過 Web Share API 喚起原生 AirDrop 與分享面板）。
- **貼上匯入**：提供代碼／連結貼上輸入框，支援即時驗證與物品／勾選統計預覽，確認後一鍵寫入本機快取並重繪清單。
- **網址自動同步（URL Hash）**：透過 AirDrop 或瀏覽器直接開啟帶有 `#sync=<Base64>` 的網址時，頁面自動偵測並彈窗提示同步摘要，確認後立即套用並自動清理網址 hash，不破壞既有錨點導覽。

## 本機旅程文件歸檔（2026-09-04）

- 本次維護**沒有更動旅程順序、日期或路線**；整理本機 `pdf/` 文件，依實際旅遊日期、時間、地點與文件種類重新命名，索引在 `pdf/00_INDEX.md`。
- 已從 Gmail 補存正式入場憑證：09/14 Sainte-Chapelle 4 張 QR 票、09/16 Arc de Triomphe 4 張 QR 票、Emirates 官方電子機票，以及 K7 week 37 手機錢包票證。
- 票面、座位與時間軸已正式核對同步（2026-09-04）：
  - **阿聯酋機票座位**：依官方 Manage Booking 確認，EK 367 為 49C（Preferred）、EK 151 為 25H（Regular）、EK 074 為 62C（Regular，原誤植 59C）、EK 366 為 47H（Preferred），已全數更正同步。
  - **羅浮宮入場時間**：官方 4 人預約憑證確認為 09/16 16:30，時間軸已修正為 15:15 到 15:55 杜樂麗花園周邊咖啡甜點小憩、16:00 抵達金字塔預約隊伍報到安檢、16:30 依票面入場看展至 20:30。
  - **馬爾默城堡開館順延**：09/08 出發時間由 09:30 順延 20 分鐘至 09:50，約 10:55 抵達城堡，吻合 11:00 開館買聯票入場。

## 小工具自訂連線與 Model ID 設定（2026-09-03）

- 小工具頁（`site/tools.html`）的線上翻譯連線區支援手動輸入「API Base URL / Endpoint」、「Model ID」與「API Key」，並以 3 欄並列排版（手機自動單欄堆疊）。
- 輸入支援 Chat Completions endpoint（如 `https://example.com/v1/chat/completions`）或 Base URL（如 `https://api.openai.com/v1`），由前端自動正規化解析。
- Model ID 支援自訂模型代碼（如 `gpt-4o-mini`、`qwen3.6-35b-a3b-gmi-ray` 等）；未填寫時自動套用系統預設模型。
- Base URL／Endpoint、Model ID 與 API Key 皆會安全快取於裝置本機的 `localStorage`，重新開啟網站或 App 時自動帶入，亦有一鍵清除功能。

## 小工具 API 連線驗證與離線備援反饋（2026-09-05）

- 小工具頁（`tools.html`）的旅行翻譯連線設定提供主動「驗證連線」機制：
  - 未填寫時按鈕維持停用；填入 Base URL 與 API Key 後按鈕顯示為「驗證連線」，狀態徽章顯示「待驗證連線」。
  - 點擊「驗證連線」時會實際向 API 發送極短測試請求（Hello -> 繁體中文），驗證伺服器、金鑰與 Model ID 是否能正常回應。
  - 驗證成功後自動儲存至本機 `localStorage`，按鈕切換為綠色「✓ 連線成功」，狀態標籤顯示「✓ 已驗證連線（Model ID）」，並顯示測試回應耗時。
  - 驗證失敗時給予具體錯誤提示（如 HTTP 401 金鑰無效、HTTP 404 找不到模型、HTTP 429 額度用盡、連線逾時、CORS 或 Android 未加密 HTTP 限制），按鈕切換為「重新驗證連線」。
  - 當修改任何連線輸入欄位時，狀態自動退回為「待驗證連線」，按鈕恢復為「驗證連線」。
- 捕捉手機 Android App 退回離線模型之狀態：
  - 若線上連線失敗改用離線模型，翻譯結果與狀態列會標示「Android 離線模型 · 線上失敗備援（錯誤原因）」，讓使用者清楚掌握當前使用的模型與連線狀況。

## 小工具 API 金鑰安全修正（2026-09-03）

- 小工具頁不在 `site/js/data.js`、公開網站或 Android 打包內容內附帶 VLM API endpoint／API key；使用者在翻譯區自行輸入完整 Chat Completions endpoint 與 API key。
- endpoint 與 key 按下「儲存到這台裝置」後，會存入該瀏覽器 origin 或 Android App WebView 的本機 `localStorage`，下次開啟自動帶入；亦可用「清除設定」立即移除。這個快取是裝置本機明文儲存，不應在共用裝置保存私人金鑰。
- PWA cache 版本已更新，舊的靜態資產快取會在新版 service worker 啟用時刪除；線上 API 回應及使用者輸入的連線資訊不由 service worker 快取。
- Android 裝置端 ML Kit 離線翻譯維持不變；未設定線上 API 時，Android App 仍可使用已下載完成的離線語言包。
- 本機 Git 歷史已重建為只含目前乾淨快照的單一 root／initial commit，並清除舊本機 refs、reflogs 與不可達物件；乾淨快照已推送至新的 `eccv_trip_app_guide` 遠端。
- GitHub Pages 發佈工作流除了 `main` push 自動部署，也支援從 Actions 頁面的「Run workflow」手動執行；手動執行時可填寫選用備註，並會顯示在該次工作名稱中。
- 先前公開的 key 仍必須在供應商端撤銷／輪替；即便重寫遠端歷史，也無法使已曝光的憑證恢復安全。

## Android App 離線翻譯備援（2026-09-01）

- Android App 直接載入包在 App 內的 `site/`，因此行程、工具介面與已打包圖片在完全沒有網路時仍可開啟。一般網站／PWA 的部署方式不變。
- 旅行翻譯維持有網路時先使用主要／備援 VLM；Android App 若偵測斷網，或線上模型失敗，會自動改用原生 Google ML Kit 裝置端備援。
- 離線文字流程：裝置端語言辨識 → 裝置端翻譯；離線照片流程：ML Kit 拉丁字母 OCR → 語言辨識 → 逐行翻譯。以較小、較穩定的專用模型處理英文、法文、丹麥文、瑞典文與芬蘭文的菜單、告示及交通資訊；手寫、模糊照片與特殊字型仍可能失敗。
- Android App 的翻譯區會顯示「下載離線語言包」；出發前連上 Wi-Fi 按一次，預先下載英文、法文、丹麥文、瑞典文、芬蘭文及中文模型，總量約 180 MB。下載完成後可開飛航模式實測文字與照片；未事先下載時無法在無網路現場補裝模型。
- ML Kit 中文翻譯結果在 Android 10 以上會以系統 ICU 轉為繁體；較舊 Android 若系統不支援該轉換，可能保留簡體字。線上 VLM 的繁體中文行為不變。
- Android 離線翻譯結果旁顯示官方 `Powered by Google Translate` attribution，工具頁亦提供 Google Translate 連結與自動翻譯免責聲明。

## 手機底部導覽圖示（2026-09-01）

- 手機固定底部導覽的「總覽／景點／交通／行李／小工具」使用 27 px 的線條圖示（房屋、地點、交通工具、行李箱與扳手），並將文字標籤設定為 11 px。
- 底部列高度與每一項的可點範圍加大；每日行程頁的「回到旅程總覽」共用清楚的房屋圖示。

## 首頁聚焦「今天的旅程」（2026-09-01）

- 首頁首屏保留一張「今天的旅程」主卡。
- 主卡依日期自動選擇行程，也可用單一日期選單切換；畫面顯示日期／城市、當日主題、前三個時間點與「開啟當日行程」主要按鈕。
- 即時天氣、匯率與翻譯保留在「小工具」頁；HackMD 共同筆記保留為首頁次要連結。
- 首頁下半部保留 14 天日期入口，每張卡顯示日期、城市、當日主題與「查看當日路線」。

## 每日行程卡片導覽化（2026-09-01）

- 每日頁的時間軸改為旅行途中可快速掃讀的卡片：左側使用語意 emoji，右側第一列顯示時間，下一列為地點／行動標題與簡短下一步指示。
- 時間軸不再顯示「優先購票」、「聯票」等小型狀態標籤；已確認／需購票等狀態保留在資料、票務筆記與卡片邊線語意中。
- 用餐使用叉匙 `🍴`；交通、住宿、會議、教堂、城堡、花園、船班與票券也依用途使用容易辨識的圖示。
- 景點卡提供入口、移動、集合、離開時間或下一站等操作提示；完整特色、停留時間與票務資料保留於下方「地點筆記」。
- 有對應地點筆記的行程卡皆可點擊，平滑捲動到同頁下方的相關卡片並顯示焦點外框；手機版維持至少 54 px 的圖示與完整可點區域。

## 深色模式淺色元件對比修正（2026-08-31）

- Quick Look 卡片的 `.button-on-dark` 使用深色字 `#10252c`，滑過狀態維持可讀。
- 修正金色底的 ECCV registration status mark 與行程焦點 badge，並將深色模式的主要珊瑚色操作按鈕調整為 `#b64d37`（滑過 `#a84430`），使白字達到足夠對比。涵蓋首頁 CTA、景點票務、主要操作、分類頁籤與每日頁底部導覽。

## 09/14 巴黎雙路線與預約提醒更新（2026-08-31）

- 09/14 調整為由南向北的單向主線：飯店 → RER B → Jardin du Luxembourg → Panthéon 外觀 → Sorbonne／Latin Quarter → 提早午餐 → Île de la Cité。
- 13:00 到 14:30 分成兩組：**A 組**先進 Conciergerie（古監獄），13:20 左右入館、14:25 離館；**B 組**留在 Île de la Cité／Saint-Michel 一帶喝咖啡並逛 Place Dauphine／花市周邊。兩組於 **14:30 在 Sainte-Chapelle 遊客入口（10 Boulevard du Palais）集合**。
- 共同下午主線：14:30 司法宮安檢 → **15:00 Sainte-Chapelle 指定時段** → 16:05 步行至 Notre-Dame → **16:30 左右 Notre-Dame 官方免費預約** → Saint-Michel-Notre-Dame 搭 RER B 回 Gare du Nord。Sainte-Chapelle 與 Notre-Dame 目前皆為目標時段，尚未標為已取得門票／預約。
- A 組購買 Conciergerie＋Sainte-Chapelle 聯票，B 組只買 Sainte-Chapelle 單館票；兩種票都選同一個 15:00 禮拜堂時段。古監獄留約 65 分鐘重點參觀。
- Notre-Dame 教堂本體免費且不強制預約；官方免費時段通常在前一兩天或當天釋出。網站在 **09/11、09/12、09/13 每日頁的行程開頭**各顯示一次官方免費預約提醒；不購買第三方普通入場票。
- 09/14 每日頁在手機上先呈現共同時間軸，再以兩張垂直堆疊的 A／B 分流卡說明 13:00 到 14:30，最後以 14:30 集合條收束。互動路線地圖提供「A 古監獄路線」與「B 咖啡路線」兩個可切換分頁，站點編號、線條與 Google Maps 按鈕隨分頁同步更新。
- PWA 的 HTML 與帶版本號 JS／CSS 使用 network-first、離線回快取。圖片、字型與地圖資源維持 cache-first。

## 首頁智慧儀表板與即時天氣更新（2026-08-30）

- 首頁採用手機優先、高資訊密度的「旅程智慧儀表板（Dashboard Hero）」。
- 儀表板整合「即時天氣（支援 GPS 定位、網路 IP 定位、行程自動切換與 5 日天氣預報）」與「今日行程焦點（自動焦點、時間軸與當日行程連結）」，首頁第一屏即可掌握當前溫度、天氣狀況、體感溫度、降雨機率與 5 日預報。
- 首頁天氣卡片採用與小工具（`tools.html`）一致的設計，包含大天氣圖示、即時溫度、體感、降雨機率徽章，以及下方 5 天每日氣溫與降雨預報。
- 首頁操作列整合「搜尋整趟旅程」、「ECCV 筆記 (HackMD)」外連與「小工具」，並優化按鈕寬度、欄位對齊與城市標籤單列排版。
- `site/js/data.js` 的 `links.hackmd` 與 `links.denmarkHackmd` 統一標示為「ECCV 筆記 (HackMD)」，涵蓋整趟會議與旅程。
- 專案維持手機優先的緊湊排版，在桌機上維持對齊雙欄佈局；修復深色模式下 TRAVEL MODE 等區塊背景色彩變數。
- 行李準備清單頁（`site/packing.html`）採用緊湊的「行李準備儀表板」；上方提供即時進度條與「隨身小包」、「日用後背包」、「托運行李箱」三包快速跳轉卡片，進入頁面即可直接檢視清單與 Ryanair 登機規則。
- 景點快速查找頁（`site/places.html`）採用「景點快速查找導覽區」；提供國家與城市篩選標籤（「全部」、「瑞典 · Malmö」、「丹麥 · 哥本哈根」、「法國 · 巴黎」、「已排入行程」、「未排入備選」），支援即時地點數量統計與一鍵快速篩選；重構「購票／官方票務」按鈕（`.ticket-button`）採用珊瑚橘色（`--coral`）與清晰向量票券 SVG 圖示，使用「官方線上購票」、「官方開放時間與票價」、「官方預約登塔」等直覺文案。
- 小工具頁（`site/tools.html`）旅行換匯結果卡（`.exchange-result-panel`）與即時翻譯結果區（`.translate-result-panel`）的明暗主題切換：淺色模式下維持白底／米白底卡片與珊瑚色數據，深色模式下切換為深色底板配合金色數值與文字高對比呈現。
- 交通與旅程資訊頁（`site/logistics.html`）採用手機優先「交通資訊導覽列」；頂部提供「全部」、「✈ 航班 (5)」、「⌂ 住宿 (3)」、「✓ ECCV 註冊」、「📱 交通 App (3)」、「🕒 時區對照」快速篩選標籤，精簡重構 ECCV 註冊完成卡與各區塊間距，第一屏即可直接切換查閱航班座位、行李託運與住宿地址。

## 全日時間軸與路線地圖更新（2026-08-30）

- 09/08 到 09/17 的旅遊順序以「目前採用的每日行程」為唯一正式版本。
- 每日詳細頁同時顯示：真實時間軸、交通／步行緩衝、依第一站到最後一站編號的互動路線地圖，以及 Google Maps 多站開啟按鈕。
- 首頁行程、每日時間軸、地圖站點、交通步驟與快速摘要中的慣用外文地名，統一顯示為「原名（繁體中文）」，例如 `Musée du Louvre（羅浮宮）`；航班編號與 Metro／RER 線號不硬翻。
- 首頁操作列提供共同筆記連結，標示為「ECCV 行程筆記（HackMD）」並開新分頁：<https://hackmd.io/vrq7Y5dQT7-yv2MgBgezgg>。
- 地圖線條代表旅程先後與交通類型，不宣稱是即時道路或軌道幾何；精確月台、道路、臨時改道與即時班次以官方 App／Google Maps 當下導航為準。
- 09/08 購買 Malmö Museum 一日 Kombibiljett，當天完成 Malmöhus Castle／Aquarium／Art Museum 與 Teknikens och Sjöfartens hus；2026/09/08 週二官方開放 11:00 到 17:00，一日聯票成人 100 SEK、學生 50 SEK；出發時間順延至 09:50，約 10:55 抵達吻合 11:00 開館。
- 09/09 為子明學長的個人主行程：First Camp → Götgatan → Hyllie → København H → Hellerup → Experimentarium（約 5 小時）→ Malmö C → Turning Torso／Västra Hamnen 與朋友會合；Disgusting Food Museum 與 Malmö Saluhall 不放進個人當日路線。
- 09/11 改為 Malmö C → København H → Rosenborg（10:15 到 12:15）→ Torvehallerne 午餐 → Rundetaarn（13:40 到 14:25）→ Strøget（Hay House／Illums Bolighus）／Christiansborg 周邊 → 快速晚餐 → 約 17:30 Tivoli → Malmö。Rosenborg 官方學生票目前 100 DKK（有效學生證、指定時段）；Rundetaarn 學生票 40 DKK、現場購票。Tivoli 已確認購買約 17:30 入園票以避開 18:00 後較高票價，實際入場依票面 QR code。
- 09/12 改為退房 → Malmö C → CPH P4／P7A 機場寄放（方案 B，主方案）→ Marmorkirken → 12:00 Amalienborg 衛兵交接 → Nyhavn／Kongens Nytorv 午餐 → 15:00 到 16:00 Stromma Classic Canal Tour → 16:00 到 16:30 前往 Christianshavn → 16:30 到 17:15 救主堂螺旋塔 → 17:15 到 18:00 搭 M2 直達 CPH 取行李 → 18:00 前完成 bag drop → FR9267。ENIGMA 保留在景點總覽供參考；Experimentarium 已移到 09/09 個人主行程；機場櫃位尺寸／容量、15:00 船班與 Metro 狀況仍需出發前確認，中央站方案 A 作為備援。
- 09/13 的「Check-in」定義為先到 Paris 飯店寄行李／若房間已準備好就入住；正式入住時間為 15:00 後。SNCF Connect 於 2026/08/30 查到 09/13 07:44 到 08:59 的 Beauvais → Paris Nord 直達 TER C17，作為目標班次，出發前一日複查。
- 09/15 晚餐為 Francette 19:00 訂位；當天順序為 Musée de l’Armée → Musée Rodin／《沉思者》→ Eiffel Tower → Francette。
- 09/16 凱旋門門票時間為 10:50、羅浮宮為 16:30 入場（16:00 報到）；採 09:40 出發 → 10:20 左右抵達入口報到 → 10:50 入場 → Champs-Élysées → Place de la Concorde → Tuileries（15:15 到 15:55 咖啡甜點小憩）→ 16:00 金字塔報到排隊 → 16:30 到 20:30 Louvre 看展 → Cour Napoléon 夜景的單向路線。
- 09/17 為 Versailles 全日，Palace 為 10:00 指定時段入場；Cité des sciences 降為未排入景點資料。

## 專案維護約定

- 每次修改專案，同步檢查並更新 `trip.md` 與 `site/` 下的網站內容；不只改單邊。
- 完成修改後必須驗證、提交 commit，並將目前分支推送到指定的遠端。
- 專案層級的完整 agent 規則寫在 `AGENTS.md`。

## 資料來源與更新原則

- 先讀本檔掌握旅程目的、偏好、固定預訂與目前路線。
- 網站的完整結構化內容在 `site/js/data.js`；每日頁、交通頁、景點頁與行李頁皆由其產生。
- `pdf/` 內是機票、住宿、餐廳與 ECCV 等原始訂單，固定預訂若有衝突以原始訂單為準。
- 班次、票價、施工、營業時間、入口與行李規則為變動資訊；更新網站前重新查證官方來源。
- 若更動核心行程、航班、住宿或旅行偏好，同步更新本檔與 `site/js/data.js`。

## 最近一次票務更新（2026-08-29）

- Copenhagen 到 Paris Beauvais 的 FR9267 票務資料已確認。
- 這段航班共有 4 位同行者；每人皆有 1 件 20 kg 託運行李（Check-in Bag）。
- 座位對照：20A、20B、21A、21B（同行 4 位相鄰座位）。
- 網站已在 `site/js/data.js` 加入旅客座位配置，在 `site/js/app.js` 的 FR9267 航班卡顯示座位與行李明細；`site/css/styles.css` 加入桌機與手機版排版。

## ECCV 註冊／進場確認（2026-08-29）

- ECCV `My Stuff` 頁面顯示 `Registration History → 2026 → Status = Paid`。
- `Sessions` 顯示 `Full Passport / Author Registration`，屬於實體作者註冊；Full Passport 涵蓋 2026/09/08 到 2026/09/12，主會議為 9/10 到 9/12，Workshops & Tutorials 為 9/8 到 9/9。
- `Presentation History` 已連結論文 **Fast and Compact 3D Gaussian Splatting with Polarized Opacity Prior**：Poster #137、Poster Session 1、10:30 AM CEST。
- 實際進場憑證是到會場 check-in 後領取的 physical conference badge。網站標示為「Registration: Completed／Paid；Badge: Pick up at conference venue」。
- `My Stuff` 上的紅色 `WARNING` 為帳號時區 Asia/Taipei 與實體會議所在地時區不同的提醒，並非付款失敗或票券無效。
- 對外網站只保留上述狀態、票種、日期、地點與發表資訊；不公開 Confirmation Number。對應網站資料在 `site/js/data.js` 的 `registration`，由 `site/js/app.js` 顯示於首頁與交通資訊頁。

## 景點快速查找與票務同步（2026-08-30）

- `site/places.html` 為全部景點的快速查找頁，不顯示朋友行程或兩份行程比較，也不在此頁展示住宿推薦；住宿資料集中於交通資訊頁。
- 景點依個人每日行程日期排序；已排入行程的卡片顯示日期並連結對應 `site/days/*` 頁，同一景點跨兩天會顯示兩個日期。未排入個人行程的景點統一放在最後並標示「未排入每日行程」。
- 個人正式行程只由 `site/js/data.js` 的 `days` 與 `site/days/*` 顯示；景點總覽不建立替代行程。
- 景點卡保留「為什麼推薦」、票務狀態、官方票務入口與 Google Maps；票務資訊集中在 `site/js/data.js` 的 `placeDetails`，畫面由 `site/js/app.js` 產生。
- Copenhagen 景點資料包含 Rosenborg、Torvehallerne、Rundetaarn、Strøget、Christiansborg、Amalienborg、Marmorkirken、Nyhavn、Kongens Nytorv、運河遊船、救主堂與已排入 09/09 個人行程的 Experimentarium；ENIGMA 保留作未排入每日行程的參考。Paris 景點資料包含 Sainte-Chapelle、Pont de Bir-Hakeim、Sacré-Cœur／Montmartre、Grand Palais、Le Marais、Le Bon Marché。
- Disneyland 已從網站資料、景點頁、9/17 每日頁說明與圖片資產完全移除；不再作為備選。
- 票務優先級：Eiffel Tower、Louvre、Palais Garnier、Sainte-Chapelle 與 Versailles 指定時段優先處理；Rosenborg、Tivoli、Stromma 運河遊船、Musée de l’Armée 與 Musée Rodin 建議日期確定後先買；Experimentarium 可先買線上票；Rundetaarn、Marmorkirken 教堂本體與 Sacré-Cœur 圓頂適合現場處理。
- Notre-Dame 教堂本體免費，官方免費時段接近參觀日才釋出；不購買第三方普通入場票。Amalienborg 廣場與衛兵交接免費，博物館需票。Marmorkirken 教堂本體免費，圓頂最多 15 人且不可預訂。
- Cité des sciences 的 Argonaute 潛水艇在 **2026/09/01 到 09/30** 關閉；09/17 已改排 Versailles，因此科學館只保留為未排入的景點資料。
- 景點卡底部動作區固定貼齊卡片底部，確保 Google Maps 按鈕在同一列對齊；需購票的景點在地圖按鈕上方顯示官方票務按鈕。景點頁的說明、日期、票務與按鈕文字整體放大；「票務」區塊的狀態與說明採 17px、較深文字色、1.75 行距與 18px 內距，桌機與手機皆以易讀為優先。
- 每張景點卡顯示可直接貼到地圖 App 的位置文字，並提供「複製位置」按鈕；按鈕先使用瀏覽器剪貼簿，失敗時改用內建備援複製流程。
- 景點的中文名、英文正式名與常見別名集中在 `site/js/data.js` 的 `placeSearchNames`，只供全站搜尋使用，不堆在景點卡上。

## 網站識別圖示（2026-08-30）

- 新增原創 `site/assets/eccv-mark.png`，以指南針、路線弧線與星芒構成，使用深 teal、coral 與金色；已套用到全站 favicon 與 header brand mark。

## 總覽與每日行程整合（2026-08-30）

- 全站桌機與手機導覽移除獨立「每日行程」項目；日期詳細頁 `site/days/*` 完整保留，從總覽的日期卡片點入。
- 總覽首頁焦點區塊下方直接接 14 天每日行程卡片與城市篩選。
- 搜尋快速入口、首頁主按鈕、景點頁的「每日行程」入口與底部提示，均導向總覽的 `#itinerary`；日期卡片仍可開啟該日詳細頁。
- 日期詳細頁在導覽列中視為「總覽」的一部分，手機底部導覽維持五項。

## 這趟旅程的設計方向

- 核心目的：參加 Malmö 的 ECCV 2026，並順遊 Malmö、Copenhagen、Beauvais、Paris。
- 興趣排序：**科技／互動體驗 > 美食 > 城市地標 > 傳統博物館 > 自然／海景**。
- 節奏：休閒、偏輕度；每天約 2 到 3 個重點，把通勤與休息算進去。
- 交通原則：**少轉一次車，比省約 10 分鐘更重要**；避免折返與跨城來回。
- 步行：一般以每日約 10,000 到 15,000 步較舒服，盡量不超過 20,000 步。
- 怕熱；行程保留室內、喝水與休息空間。
- Copenhagen 從 Malmö 往返最多安排兩天，避免跨海通勤過多。
- ECCV 為投稿後的體驗，以 9/10 為固定主會議日。
- Tivoli 重點是園區氣氛、燈光、拍照與餐飲，不以刺激設施為主。
- 餐飲條件：優先能刷 Visa／Mastercard，排除只收現金或只收當地支付的店。
- 偏好肉類（牛排、牛肉、豬肉），海鮮次之。平常輕鬆吃，整趟安排 1 到 2 餐特別聚餐即可。

## 人數與已確認事項

- 9/12 的 FR9267 有 4 位同行者，每人 1 件 20 kg 托運行李；座位分配見上方記錄。
- Francette 已預約 4 位。
- ECCV 註冊已付款：Full Passport / Author Registration；實際進場需到會場領 physical conference badge。
- 發表資料：Poster #137、Poster Session 1、10:30 CEST。
- 除上列項目外，其他景點依實際購票狀態為準；Tivoli 約 17:30 入園票已記錄。

## 固定航班

所有時間均為航點當地時間。

| 日期 | 航班 | 路線 | 時間 | 目前資料 |
| --- | --- | --- | --- | --- |
| 09/06-09/07 | EK 367 | 台北 T2 → 杜拜 T3 | 23:50 → 04:35 | 49C，經濟艙（Preferred） |
| 09/07 | EK 151 | 杜拜 T3 → Copenhagen T3 | 08:20 → 13:15 | 25H，經濟艙（Regular）；抵達後前往 Malmö |
| 09/12 | FR9267 | Copenhagen T2 → Beauvais-Tillé | 20:05 → 22:00 | 4 人；20A／20B／21A／21B；每人 20 kg 托運行李 |
| 09/18-09/19 | EK 74 | Paris CDG T2C → 杜拜 T3 | 15:35 → 01:10 | 62C，經濟艙（Regular） |
| 09/19 | EK 366 | 杜拜 T3 → 台北 T2 | 04:05 → 16:35 | 47H，經濟艙（Preferred） |

## 固定住宿與預約

| 日期 | 城市 | 住宿／預約 | 關鍵資訊 |
| --- | --- | --- | --- |
| 09/07-09/12 | Malmö | First Camp Sibbarp-Malmö | Strandgatan 101；09/12 11:00 前退房 |
| 09/12-09/13 | Beauvais | Hostellerie Saint Vincent Beauvais Aéroport | 241 Rue de Clermont；抵達法國後住一晚 |
| 09/13-09/18 | Paris | Sure Hotel by Best Western Paris Gare du Nord | 224 Rue du Faubourg Saint-Denis；Gare du Nord 為主要交通基地 |
| 09/15 19:00 | Paris | Francette | 1 Port de Suffren；4 位，已預約 |

## 目前採用的每日行程

這是網站最後一致的版本；早期 Copenhagen 日期配置與不相關的樂園備選都已被取代。

| 日期 | 地點 | 主行程 |
| --- | --- | --- |
| 09/06 | 台北 → 杜拜 | 23:50 搭 EK 367，純移動日 |
| 09/07 | Copenhagen → Malmö | 13:15 抵達；CPH → Hyllie → First Camp；不排景點 |
| 09/08 | Malmö | 09:50 出發 → Malmöhus Castle／Aquarium／Art Museum（11:00 開館）→ 午餐 → Teknikens och Sjöfartens hus → Slottsträdgården；使用一日聯票 |
| 09/09 | Malmö → Copenhagen → Malmö | 個人 Experimentarium 全日 → Malmö C → Turning Torso／Västra Hamnen 與朋友會合 |
| 09/10 | Malmö | ECCV 2026 主會議、Expo；10:30 Poster Session 1／Poster #137 |
| 09/11 | Copenhagen | Malmö C → København H → Rosenborg → Torvehallerne 午餐 → Rundetaarn → Strøget／Christiansborg 周邊 → 快速晚餐 → 約 17:30-21:45 Tivoli → Malmö |
| 09/12 | Copenhagen → Beauvais | 退房 → Malmö C → CPH P4／P7A 寄行李（方案 B）→ Marmorkirken → 12:00 Amalienborg 衛兵交接 → Nyhavn／Kongens Nytorv 午餐 → 15:00-16:00 運河遊船 → 16:30-17:15 救主堂螺旋塔 → 17:15-18:00 M2 → CPH 取行李 → 18:00 前 bag drop → FR9267 |
| 09/13 | Beauvais → Paris | 07:44 直達 TER → Paris Nord → 飯店寄行李／可入住就入住 → Palais Garnier → Sacré-Cœur／Montmartre |
| 09/14 | Paris | RER B → Luxembourg／Panthéon／Latin Quarter → A 古監獄／B 咖啡分流 → 15:00 Sainte-Chapelle → 16:30 Notre-Dame |
| 09/15 | Paris | Musée de l’Armée → Musée Rodin／《沉思者》→ Eiffel Tower → 19:00 Francette |
| 09/16 | Paris | 10:50 Arc de Triomphe 門票 → Champs-Élysées → Place de la Concorde → Tuileries（15:15 咖啡小憩）→ 16:00 金字塔報到排隊 → 16:30-20:30 Louvre → Cour Napoléon 夜景 |
| 09/17 | Paris | Versailles Palace → Gardens → Estate of Trianon 全日 |
| 09/18 | Paris → CDG | 不排景點；約 10:30 離開飯店，約 12:00 抵 CDG T2C，15:35 搭 EK 74（座位 62C） |
| 09/19 | 杜拜 → 台北 | EK 366，16:35 抵達台灣 |

### 09/17 特別狀態

- 正式主行程是 Versailles Palace／Gardens／Trianon 全日；建議購買含 10:00 Palace 指定時段的 Passport。
- Palace 09:00 到 18:30、Trianon 12:00 到 18:30；園區範圍很大，下午移動可依體力使用園區小火車或接駁。
- Cité des sciences 與 Musée des Arts et Métiers 不排入當日，只留在景點總覽供未來參考。
- Disneyland Paris 維持完全移除，不再列為備選。

## 已決定的交通邏輯

### Malmö 與 Copenhagen

- First Camp 的日常軸線：步行至 Götgatan → Bus 9 → Hyllie。
- Hyllie 是 Malmö 市區、ECCV、Copenhagen 與 CPH Airport 之間的核心轉運點。
- 09/08 09:50 從 First Camp 出發，步行至 Götgatan 搭 Bus 9 轉火車至 Malmö C，約 10:55 步行到 Malmöhus 吻合 11:00 開館；一日聯票先走 Castle／Aquarium／Art Museum，再到相鄰的 Teknikens och Sjöfartens hus，閉館後逛 Slottsträdgården。
- 09/09 個人主線為 First Camp → Götgatan → Bus 9 → Hyllie → Øresundståg → København H → S-tog → Hellerup → Experimentarium；下午原路回 København H → Malmö C，17:30 在 Turning Torso 與朋友會合，再走 Västra Hamnen。Hellerup → Experimentarium 優先搭 Bus 164，步行是備援；不再加 Copenhagen 市中心觀光。
- 09/10 搭 Bus 9 到 Hyllie，再步行至 Malmö Arena／Malmömässan。
- 09/11 以 Malmö C → København H 的 09:00 到 09:45 Øresundståg 為主；Rosenborg 10:15 抵達、目標 10:30 Student 時段，午餐 60 分鐘、Rundetaarn 45 分鐘，接著走 Strøget → Christiansborg、快速晚餐，約 17:30 入 Tivoli，22:00 從 København H 回 Malmö。實際價格、適用範圍、末班車與工程仍需用 Skånetrafiken 複查。
- 09/11 Tivoli 本次票面抓約 17:30 入園（較便宜時段），可提早參觀花園與晚餐；9/11 另有 Friday Rock（Dizzy Mizz Lizzy 22:00）與 22:30 Illuminations，目前時間軸 21:45 離園，若要看完整演出必須主動延後回程並重新確認跨海列車。
- 09/12 帶 20 kg 行李，已選方案 B：目前查到的 09/12（週六）Re 1041 為 Malmö C 09:05 → CPH Airport 09:35，目標 08:45 離開住宿，先到 CPH P4／P7A 寄放四件托運箱，再搭 M2／M3／M4 回 Marmorkirken。CPH 機場寄放的 checked-in 尺寸櫃與現場可用數量要出發前確認；若四件行李無法相容或櫃位不足，才改用中央站方案 A。
- 09/12 10:45 Marmorkirken、11:50 到 Amalienborg 站位、12:00 看衛兵交接，之後步行到 Nyhavn／Kongens Nytorv 午餐；15:00 到 16:00 搭 Nyhavn 3 的 Stromma Classic Canal Tour，16:00 到 16:30 前往 Christianshavn，16:30 到 17:15 再去救主堂螺旋塔，最晚 17:15 離塔銜接 M2。
- 09/12 方案 B 的下午段為 Christianshavn → M2 直達 Lufthavnen → P4／P7A 取行李 → T2；目標 18:00 前抵達機場並完成 bag drop，保留約 2 小時至 20:05 起飛。方案 A 只在機場寄放不可用時啟用，屆時由中央站取件後視情況叫車，預估約 18:15 抵達 CPH。

### Beauvais 與 Paris

- 09/13 不繞回 Beauvais Airport 搭 Aérobus；06:30 起床／早餐、07:05 左右叫車到 Beauvais SNCF，搭 07:44 到 08:59 的直達 TER C17 到 Paris Nord。
- Paris 住宿靠近 Gare du Nord；每天按同一區域／同一交通軸線安排，避免反覆橫越巴黎。
- 09/13 先到飯店寄行李／若有房就入住，再搭 M7 到 Opéra；Palais Garnier 後從 Madeleine 搭 M12 到 Abbesses，最後由 Anvers 搭 M2 到 La Chapelle 回住宿。
- 09/14 去程由 Gare du Nord 搭 RER B 直達 Luxembourg，上午從花園、Panthéon 外觀與 Sorbonne 向北走；13:00 在 Île de la Cité 分成 A 古監獄／B 咖啡，14:30 重新集合，15:00 Sainte-Chapelle、16:30 Notre-Dame，最後由 Saint-Michel-Notre-Dame 搭 RER B 直達 Gare du Nord。
- 09/15 M4 → Strasbourg-Saint-Denis → M8 到 La Tour-Maubourg；Musée de l’Armée、Musée Rodin、Eiffel Tower 與 Francette 由東向西步行串聯。
- 09/16 09:40 從住宿出發搭 M2 到 Charles de Gaulle-Étoile，10:20 左右走地下通道到凱旋門入口，依 10:50 門票時間入場；之後沿 Champs-Élysées、Place de la Concorde 與 Tuileries 一路向東，15:15 到 15:55 在杜樂麗花園周邊咖啡甜點小憩，16:00 到 Louvre 玻璃金字塔指定隊伍報到安檢、16:30 入館、20:30 清場後看 Cour Napoléon 夜景，再用 M1＋M4 回住宿。
- 09/17 以 10:00 Palace 入場為時間錨點，從 Gare du Nord 搭 RER B 到 Saint-Michel-Notre-Dame，再轉 RER C 到 Versailles Château-Rive Gauche；回程原線返回，預計 19:30 前回到飯店。
- 09/18 從 Gare du Nord 搭 RER B 到 Aéroport Charles de Gaulle 2 TGV，再走到 T2C；需買機場專用票。

## 主要 App 與行李限制

- Skånetrafiken：Malmö、Hyllie、Bus 9、Øresund 跨海交通。
- SNCF Connect：Beauvais → Paris Nord 的 TER。
- Bonjour RATP／Île-de-France Mobilités：Paris Metro、RER 與即時工程資訊。
- FR9267 免費隨身件目前按 40 × 30 × 20 cm 規劃；貼身小包在登機口前收進後背包。
- FR9267 托運上限為每人 20 kg；封箱目標 18 kg，保留餘量。
- 打包原則：護照、付款工具、藥品、剪刀（小於 6 cm 安全剪刀）、電腦、平板與行動電源一律放身上／後背包，不放托運；其中行動電源依航空規則不得托運。
- 完整 67 項互動式行李清單在網站的行李頁；本檔只保留分裝決策與維護規則。

## 行李分裝與網站狀態（2026-09-04）

三大包款皆劃分清楚的子群組，方便快速點收；以下記錄目前實際打算攜帶的品項：

- **① 隨身小包（13 項，分 3 組）**（每天出門會背，重要＋隨時會用）：
  - **證件／財物**：護照、主要信用卡、歐元現金、錢包、房卡／住宿鑰匙。現金與卡片放身上，不放托運箱。
  - **隨身 3C**：手機、行動電源。行動電源依航空規定必須隨身客艙攜帶、嚴禁托運；搭 FR9267 到登機口前，整個小包收進後背包。
  - **個人日用**：袖珍包衛生紙 ×2、摺疊傘、保溫瓶、原子筆、口罩、環保餐具。
- **② 後背包（16 項，分 4 組）**（飛機、機場、火車、飯店會用，或貴重不能托運）：
  - **3C／電器**：MacBook、iPad、Sony WH-1000XM6 耳機、3.5 mm 飛機耳機線、多孔 GaN 充電器、轉接頭。
  - **藥品／工具**：普拿疼、過敏藥、腸胃藥、剪刀。藥品與剪刀隨身（剪刀刀刃長度須在 6 cm 以內且為圓頭／安全剪刀，符合航空安檢規範）。
  - **機上／保暖**：旅行頸枕、遮光眼罩、發熱衣 ×1、保暖外套。
  - **個人備援**：備用眼鏡、備用信用卡。備用信用卡隨身不放托運；這是 FR9267 唯一免費隨身件，裝滿後需符合 40 × 30 × 20 cm。
- **③ 托運行李箱（38 項，分 6 組）**（衣服、生活用品、電器集中處）：
  - **衣物**：短袖 7 件、發熱衣 1 件、長褲 4 條、正式衣服一套、內褲 5 件、襪子 7 雙、睡衣 3 套、防風防水外套、藍白拖。
  - **盥洗**：牙刷、牙膏、洗髮精、沐浴乳、刮鬍刀、梳子。
  - **洗衣／日用**：塑膠袋／環保袋、洗衣袋、洗衣精、毛巾、晾衣繩、晾衣架、S 掛鉤。
  - **電器**：延長線 2 條、轉接頭 3 顆、備用豆腐頭 2 顆、無線充電盤、熱水瓶、吹風機。
  - **文件／備援**：護照影本、保險影本、身分證影本、2 寸照片。
  - **行李／其他**：指甲剪、行李電子秤、行李束帶、姓名牌、時鐘、自拍棒。自拍棒在第一次辦理托運前放入箱內；封箱目標 18 kg、FR9267 上限 20 kg，以 9/12 Ryanair 為打包約束。
- **出發穿著**：主力走路鞋、長褲、短袖與薄中層直接穿上；防水外套放手邊，減少箱內體積。

- 航空限制為變動資訊，官方頁面於 2026/09/02 再次確認：Ryanair 免費小型個人物品為 40 × 30 × 20 cm、放前座下方；本次訂位已含每人 20 kg 托運行李（官方政策也列出 20 kg 托運選項，見 [Ryanair 行李規則](https://help.ryanair.com/hc/en-me/articles/12888036565521-Ryanair-s-Bag-Policy)）。Emirates 行動電源限 1 顆、最多 100 Wh、只能放客艙且機上不可使用或充電（[Emirates 危險物品規則](https://www.emirates.com/english/before-you-fly/travel/dangerous-goods-policy/)）。行動電源不可托運；Poster #137 不假設海報筒可作為 Ryanair 免費第三件，選可折布質海報或出發前確認當地印製方案。

網站目前的行李頁（`site/packing.html`）有 67 項可勾選清單：① 隨身小包（3 組）、② 後背包（4 組）、③ 托運行李箱（6 組）全數支援分組顯示與編輯；勾選狀態存在瀏覽器 `localStorage` 的 `eccv-packing-checklist-v1`，只提供「全部／還沒收」篩選。全站 header 提供亮／暗模式按鈕，偏好存在 `eccv-trip-theme`，並在手機窄版驗證過：無橫向溢出、Ryanair 流程垂直堆疊、清單與篩選可操作、兩種色彩模式均可切換。`site/index.html` 的同步標記更新為 `2026-09-05`。

## 小工具頁（2026-08-30）

- 新增 `site/tools.html`「小工具」頁，集中顯示台北、Malmö、Copenhagen、Paris 的即時時鐘，以及目前天氣、攝氏溫度、今日最高降雨機率與未來五天預報。
- 四張卡分別使用 `Asia/Taipei`、`Europe/Stockholm`、`Europe/Copenhagen`、`Europe/Paris` IANA 時區；Malmö 與 Copenhagen 在本次旅程期間同為 CEST／UTC+2，但保留各自的城市天氣，Paris 卡也代表 Beauvais 的同時區。
- 小工具預設焦點為 09/06 台北出發日；黃色「行程焦點」依 `site/js/data.js` 的 `days` 日期／城市與每日 schedule 判斷，不使用 GPS 或定位權限。首頁 `site/index.html` 顯示自動焦點、前三項 schedule，並提供日期切換；第一個選項為「自動（Day 0：09/06）」並可一鍵回到自動焦點。
- 首頁行程焦點區保留日期切換與自動回復按鈕；手機版以日期控制優先並維持滿寬易點擊。
- 小工具頁保留全站 header／footer／手機導覽與時鐘、天氣、焦點提示；頁面直接進入工具卡片，日期切換集中在首頁。
- 時間與天氣數值在小工具頁採較大的易讀字級；深色模式使用高對比文字，避免時間與溫度融入背景。
- 天氣在瀏覽器端向 Open-Meteo 即時請求，不把變動預報寫死在旅程資料；若網路或 API 暫時不可用，時鐘與行程焦點仍可使用，天氣卡提供重試。
- 小工具頁第二個「匯率換算」工具，預設為 EUR → TWD，主要用來把法國當地消費換算成台幣；並可切換 DKK、SEK 與按交換按鈕反向換算。頁面明確提示法國用 EUR、丹麥／瑞典主要用 DKK／SEK。匯率來自 ExchangeRate-API 的公開參考資料，未計入刷卡、提款或換現金費用。
- 小工具頁第三個「旅行翻譯」工具，預設翻成繁體中文，可翻譯貼上的文字或圖片中的可見文字；使用者在翻譯區輸入完整 Chat Completions endpoint 與 API key 後使用，system prompt 固定寫在 `site/js/data.js`。手機版把圖片來源拆成「開啟相機拍照」與「上傳圖片」：相機使用頁面內的後鏡頭即時預覽與拍攝，相簿／檔案則使用一般圖片上傳。兩種方式都會顯示預覽並開始翻譯，圖片先在瀏覽器端縮放再送往指定翻譯服務；所有 HTML 也替 `data.js` 加上與 `app.js` 相同的 cache version。
- 2026-09-01 小工具頁首屏：最上方加入「天氣／匯率／翻譯」三個快速前往按鈕；四個城市的天氣卡在桌面採 2 × 2 版面。天氣卡加入城市色彩、時間／天氣分區與清晰視覺層級；平板與手機為單欄，快速按鈕三等分且無水平溢出。
- 2026-09-04 雙時區與歐洲三地天氣整合：
  - 由於 Malmö、哥本哈根、巴黎三地在 2026 年 9 月皆共用 CEST（UTC+2）歐洲夏令時間，整合成兩大核心卡片：①「台北」（台灣 CST UTC+8 時間與出發/返台天氣）、②「歐洲旅程目的地」（歐洲當地時間 CEST UTC+2，單一 live 時鐘，慢台北 6 小時）。
  - 歐洲卡片內整合三地即時天氣切換分頁（瑞典 Malmö、丹麥 哥本哈根、法國 巴黎），分頁按鈕呈現各城市即時氣溫與天氣圖示，點擊切換 5 天詳細預報；並依行程日期自動聚焦當天所在城市。
  - 電腦版形成左右對稱雙欄，手機版垂直堆疊，節省手機螢幕滾動高度。

## Android 離線 APK 與離線快取（2026-08-30）

- 專案已配置 Capacitor Android 專案，將 `site/` 全部靜態資源直接打包進 APK 內部（`android/app/src/main/assets/public/`）。
- **離線架構**：App 執行時由 Android 本機資源載入（`https://localhost/`），**不依賴 GitHub Pages 遠端網路**；即使在歐洲無網路環境下，14 天每日行程、航班、住宿、景點、行李清單與當地時鐘皆可離線開啟與操作。
- **匯率離線快取**：`site/js/app.js` 加入 `eccv-exchange-cache` 本機快取機制；有網路時更新最新匯率，無網路時自動讀取最後快取匯率繼續換算。
- **權限與圖示**：已配置相機權限（供小工具翻譯拍照使用）與網路權限，App 圖示已由 `site/assets/eccv-mark.png` 產製各解析度 mipmap launcher icons。
- **建置指令與 CI**：`package.json` 提供 `npm run build:apk`（同步資源並透過 Gradle 編譯 Debug APK）；`.github/workflows/build-apk.yml` 在推送至 `main` 時自動在 GitHub Actions 編譯並產出 APK 下載產物。

## PWA 離線快取與 iOS 支援（2026-08-30）

- 專案已加入 PWA（Progressive Web App）支援：`site/manifest.webmanifest`、`site/sw.js`（Service Worker 離線快取）與全站 Apple Touch Icon / Web App 標籤。
- **iOS 體驗**：iPhone 使用者透過 Safari 開啟網站並點擊「加入主畫面」，即可獲得全螢幕體驗（無 Safari 網址列）。
- **離線預快取**：Service Worker 在首次載入時快取全站 14 天每日頁面、核心資料、樣式表與景點圖片；在無網路環境下可離線運作。
- **雙軌相容**：網頁版與 PWA 由 Service Worker 負責快取，Android APK 則由 Capacitor 本機 AssetLoader 載入，兩者互不衝突且維持單一資料源（`site/js/data.js`）。

## 出發前必須再查

- 09/09 查看 [Experimentarium 官方參觀資訊](https://www.experimentarium.dk/plan-your-visit/) 與 [官方交通頁](https://www.experimentarium.dk/find-vej-experimentarium/) 的當日開放時間、票務與 science demo；目前官方頁為每日 09:30 到 17:00、線上票省 10%，並列出 Hellerup → Bus 164。Construction Site 自 9/9 起因搬遷關閉兩週，Interactive Film Theatre 目前整修中，兩者不排入；館內 SMASK 位於 1 樓，熱食供應時間以當日公告為準。
- 09/08 晚上與 09/09 早上查 Skånetrafiken／Rejseplanen 的 Malmö 到 Copenhagen 往返；[Öresundståg 官方工程公告](https://www.oresundstag.se/reseinfo/planerade-banarbeten) 已列 09/06 到 09/11 晚間、夜間與清晨工程，部分班次改點、取消或以巴士替代。Hyllie → København H、Hellerup → Experimentarium 與回程皆作為目標窗口。
- 09/11 Malmö 到 Copenhagen 的 Øresundståg 工程、取消班次與替代路線；Rosenborg 10:30 Student 時段與 Tivoli 指定日期動態票價。
- 09/12 CPH P4／P7A 行李寄存的當日可用櫃位、尺寸、支付方式與價格；主方案是機場寄放（方案 B），若四件 20 kg 行李無法相容，再改用 [DSB København H Bagagecenter](https://www.dsb.dk/find-produkter-og-services/bagagecenter/)；參考 [CPH 行李寄存](https://www.cph.dk/en/practical/baggage/baggage-deposit)。
- 09/11 出發前確認 Tivoli 約 17:30 入園票的 QR code 已載入手機，並於 17:15 左右抵達入口；若要看 22:00 Friday Rock，需重新確認離園與返 Malmö 班次。09/12 Stromma Nyhavn 15:00 班次是否已購買；救主堂 16:30 時段是否預約，並於 17:15 前離塔銜接 M2。
- 09/13 Beauvais → Paris Nord 的 07:44 到 08:59 TER C17 是否維持運行，並向 Paris 飯店確認上午可寄放行李。
- Paris Metro／RER 工程，尤其 09/13 與 09/18。
- 各景點當日營業時間、入場時段與是否已購票；優先確認 Palais Garnier、09/14 15:00 Sainte-Chapelle（A 組聯票／B 組單館票）、09/14 16:30 左右 Notre-Dame 官方免費預約、Eiffel Tower、Louvre 與 Versailles 的指定時段。
- 航班航廈、登機門、報到截止時間及最新行李／電池規則。

## 網頁內容守則

- 明確標示「已預訂」、「主方案」、「彈性選項」與「需再確認」，不把建議寫成已完成的預訂。
- 每日頁先顯示今天真正需要的 2 到 3 件事，再顯示詳細交通；避免過多資訊干擾旅行中的可讀性。
- 每日頁的時間軸必須包含移動、排隊／安檢與緩衝；路線地圖的編號與線條必須和時間軸先後一致。
- 每日行程出現有慣用中文譯名的外文地點時，直接在旁邊加繁體中文，不要求使用者額外查詢。
- 地圖底圖需網路時必須保留離線可讀的站點順序；線條只表達順序與交通類型，不誤稱為即時道路／軌道路線。
- 行程調整時優先保留科技與已預約項目；先刪自然景點、繞路打卡點或額外博物館。
- 任何修改皆維持「少轉乘、少折返、有緩衝」的核心邏輯。
