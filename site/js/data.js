window.TRIP = {
  title: "ECCV 2026 歐洲旅程",
  subtitle: "北歐到巴黎的每日旅行導覽",
  dates: "2026.09.06 - 2026.09.19",
  links: {
    hackmd: { label: "ECCV 筆記 (HackMD)", url: "https://hackmd.io/vrq7Y5dQT7-yv2MgBgezgg" },
    denmarkHackmd: { label: "ECCV 筆記 (HackMD)", url: "https://hackmd.io/vrq7Y5dQT7-yv2MgBgezgg" }
  },
  packing: {
    lastChecked: "2026/09/05",
    bags: [
      {
        id: "tiny",
        number: "①",
        label: "隨身小包",
        shortLabel: "小包",
        headline: "每天出門隨身攜帶，重要證件與隨時取用品",
        rule: "日常貼身攜帶；搭乘 FR9267 登機前，整個小包收進後背包。",
        capacity: "每天出門隨身攜帶",
        items: [
          { id: "passport", group: "證件／財物", name: "護照" },
          { id: "primary-card", group: "證件／財物", name: "主要信用卡" },
          { id: "cash", group: "證件／財物", name: "歐元現金" },
          { id: "wallet", group: "證件／財物", name: "錢包" },
          { id: "room-key", group: "證件／財物", name: "房卡／住宿鑰匙" },
          { id: "phone", group: "隨身 3C", name: "手機" },
          { id: "power-bank", group: "隨身 3C", name: "行動電源" },
          { id: "pocket-tissues", group: "個人日用", name: "袖珍包衛生紙 ×2" },
          { id: "umbrella", group: "個人日用", name: "摺疊傘" },
          { id: "thermos", group: "個人日用", name: "保溫瓶" },
          { id: "pen", group: "個人日用", name: "原子筆" },
          { id: "mask", group: "個人日用", name: "口罩" },
          { id: "reusable-cutlery", group: "個人日用", name: "環保餐具" }
        ]
      },
      {
        id: "backpack",
        number: "②",
        label: "後背包",
        shortLabel: "後背包",
        headline: "飛機、機場、火車、飯店使用，或貴重不可托運物品",
        rule: "此為 FR9267 唯一免費隨身件；裝滿後需符合 40 × 30 × 20 cm。",
        capacity: "飛機・機場・火車・飯店",
        items: [
          { id: "macbook", group: "3C／電器", name: "MacBook" },
          { id: "ipad", group: "3C／電器", name: "iPad" },
          { id: "xm6", group: "3C／電器", name: "Sony WH-1000XM6 耳機" },
          { id: "airplane-cable", group: "3C／電器", name: "3.5 mm 飛機耳機線" },
          { id: "gan-charger", group: "3C／電器", name: "多孔 GaN 充電器" },
          { id: "eu-adapter-one", group: "3C／電器", name: "轉接頭" },
          { id: "pain-fever", group: "藥品／工具", name: "普拿疼" },
          { id: "allergy-medicine", group: "藥品／工具", name: "過敏藥" },
          { id: "medicine-gi", group: "藥品／工具", name: "腸胃藥" },
          { id: "scissors", group: "藥品／工具", name: "剪刀" },
          { id: "neck-pillow", group: "機上／保暖", name: "旅行頸枕" },
          { id: "eye-mask", group: "機上／保暖", name: "遮光眼罩" },
          { id: "thermal-wear-cabin", group: "機上／保暖", name: "發熱衣 ×1" },
          { id: "warm-coat", group: "機上／保暖", name: "保暖外套" },
          { id: "glasses", group: "個人備援", name: "備用眼鏡" },
          { id: "backup-card", group: "個人備援", name: "備用信用卡" }
        ]
      },
      {
        id: "suitcase",
        number: "③",
        label: "托運行李箱",
        shortLabel: "行李箱",
        headline: "衣物、生活用品、電器集中處",
        rule: "托運大宗物品集中放置；封箱目標 18 kg，FR9267 上限 20 kg。",
        capacity: "衣物・生活用品・電器",
        items: [
          { id: "tees", group: "衣物", name: "短袖 ×7" },
          { id: "thermal-wear", group: "衣物", name: "發熱衣 ×1" },
          { id: "pants", group: "衣物", name: "長褲 ×4" },
          { id: "neat-outfit", group: "衣物", name: "正式衣服一套" },
          { id: "underwear", group: "衣物", name: "內褲 ×5" },
          { id: "socks", group: "衣物", name: "襪子 ×7" },
          { id: "sleepwear", group: "衣物", name: "睡衣 ×3" },
          { id: "rain-shell", group: "衣物", name: "防風防水外套" },
          { id: "blue-slippers", group: "衣物", name: "藍白拖" },
          { id: "toothbrush", group: "盥洗", name: "牙刷" },
          { id: "toothpaste", group: "盥洗", name: "牙膏" },
          { id: "shampoo", group: "盥洗", name: "洗髮精" },
          { id: "body-wash", group: "盥洗", name: "沐浴乳" },
          { id: "razor", group: "盥洗", name: "刮鬍刀" },
          { id: "comb", group: "盥洗", name: "梳子" },
          { id: "plastic-bags", group: "洗衣／日用", name: "塑膠袋／環保袋" },
          { id: "laundry-bag", group: "洗衣／日用", name: "洗衣袋" },
          { id: "laundry-detergent", group: "洗衣／日用", name: "洗衣精" },
          { id: "towel", group: "洗衣／日用", name: "毛巾" },
          { id: "clothesline", group: "洗衣／日用", name: "晾衣繩" },
          { id: "clothes-hangers", group: "洗衣／日用", name: "晾衣架" },
          { id: "s-hooks", group: "洗衣／日用", name: "S 掛鉤" },
          { id: "extension", group: "電器", name: "延長線 ×2" },
          { id: "eu-adapter-two", group: "電器", name: "轉接頭 ×3" },
          { id: "spare-charger", group: "電器", name: "備用豆腐頭 ×2" },
          { id: "wireless-charger", group: "電器", name: "無線充電盤" },
          { id: "hot-water-bottle", group: "電器", name: "熱水瓶" },
          { id: "hairdryer", group: "電器", name: "吹風機" },
          { id: "passport-copy", group: "文件／備援", name: "護照影本" },
          { id: "insurance-copy", group: "文件／備援", name: "保險影本" },
          { id: "id-copy", group: "文件／備援", name: "身分證影本" },
          { id: "passport-photos", group: "文件／備援", name: "2 寸照片" },
          { id: "nail-clipper", group: "行李／其他", name: "指甲剪" },
          { id: "luggage-scale", group: "行李／其他", name: "行李電子秤" },
          { id: "luggage-strap", group: "行李／其他", name: "行李束帶" },
          { id: "luggage-tag", group: "行李／其他", name: "姓名牌" },
          { id: "clock", group: "行李／其他", name: "時鐘" },
          { id: "selfie-stick", group: "行李／其他", name: "自拍棒" }
        ]
      }
    ],
    sources: [
      { label: "Ryanair 行李規則", url: "https://help.ryanair.com/hc/en-me/articles/12888036565521-Ryanair-s-Bag-Policy" },
      { label: "Ryanair 電池規則", url: "https://help.ryanair.com/hc/en-us/articles/12890774807569-What-items-are-permitted-on-board" },
      { label: "Emirates 危險物品／行動電源", url: "https://www.emirates.com/english/before-you-fly/travel/dangerous-goods-policy/" }
    ]
  },
  souvenirs: {
    lastUpdated: "2026/09/05",
    intro: "精選北歐與法國代表性伴手禮，分為「精選主題禮包（適合一人一份）」與「團隊零食分享包（適合公用桌分食）」，均附實物相片、預算估計與採買建議。",
    notice: "⚠️ 提醒：瑞典牙膏型魚子醬（Kalles Kaviar）官方保存條件為 2～8°C，9/12 離開瑞典後還需在巴黎待至 9/18，常溫攜帶極易變質爆管，強烈不建議作為長途伴手禮帶回台灣（建議在瑞典小木屋早餐品嚐，或回台至 IKEA 瑞典食品超市購買冷藏版）。",
    premium: [
      {
        id: "lakrids-bulow",
        theme: "極黑工藝・精品甘草",
        name: "Lakrids by Bülow 巧克力甘草球雙罐組",
        localName: "Lakrids by Bülow (Dark & Sea Salt / Passion Fruit)",
        origin: "🇩🇰 丹麥設計製造",
        budget: "約 220～260 DKK（約 NT$1,000～1,200）",
        place: "哥本哈根中央車站專櫃、Strøget 旗艦店或哥本哈根機場（CPH 免稅店）",
        image: "assets/souvenirs/lakrids-bulow.webp",
        bagTip: "隨身或托運皆可（常溫陰涼處保存）",
        features: [
          "丹麥知名甘草品牌，黑金霧面圓罐包裝。",
          "外層為比利時黑巧克力與海鹽焦糖，內層為軟質甜甘草，口感溫和不刺鼻。",
          "適合想嘗試北歐甘草甜點但排斥傳統刺鼻風味的人，包裝便於送禮。"
        ]
      },
      {
        id: "laeso-salt",
        theme: "主廚工藝・傳統海鹽",
        name: "Læsø Salt 丹麥百年柴燒手工海鹽禮袋",
        localName: "Læsø Salt (Håndsyndet Salt i lærredspose)",
        origin: "🇩🇰 丹麥萊斯島",
        budget: "約 180～250 DKK（約 NT$850～1,150）",
        place: "哥本哈根 Torvehallerne 市集、伴手禮選品店，或巴黎食品館 Guérande 鹽之花",
        image: "assets/souvenirs/laeso-salt.webp",
        bagTip: "需防潮封口，建議放入托運行李箱",
        features: [
          "保留中世紀柴燒蒸發傳統工法，常被北歐餐廳與料理人選用。",
          "復古麻布袋包裝，海鹽結晶薄脆且帶微燻香氣。",
          "適合搭配牛排、沙拉與日常調味，適合作為下廚愛好者的特色禮物。"
        ]
      },
      {
        id: "kay-bojesen",
        theme: "療癒設計・國寶木偶",
        name: "Kay Bojesen 丹麥設計木偶／經典萌物",
        localName: "Kay Bojesen Denmark (Wooden Monkey / Songbird / Viking Duck)",
        origin: "🇩🇰 丹麥經典設計",
        budget: "約 260～350 DKK（約 NT$1,200～1,600）",
        place: "哥本哈根 Illums Bolighus 百貨、Strøget 紀念品專賣店或馬爾默設計選品店",
        image: "assets/souvenirs/kay-bojesen.webp",
        bagTip: "精緻木器，建議以衣物包裹保護放入托運行李箱或隨身攜帶",
        features: [
          "丹麥設計師 Kay Bojesen 於 1951 年設計的木製玩具，為丹麥經典設計代表作。",
          "天然橡木或柚木打磨，手腳關節可轉動調整姿勢，適合擺在書桌或層架。",
          "線條簡潔且帶幽默感，是長青的北歐居家擺飾。"
        ]
      },
      {
        id: "coffee-collective",
        theme: "世界冠軍・精品咖啡",
        name: "The Coffee Collective 產地烘焙精品咖啡豆組",
        localName: "The Coffee Collective (Specialty Coffee Beans / Roast)",
        origin: "🇩🇰 丹麥哥本哈根",
        budget: "約 240～300 DKK（約 NT$1,100～1,400，雙包裝）",
        place: "哥本哈根 Nørre Voldgade 門市、Torvehallerne 分店或中央車站外帶吧",
        image: "assets/souvenirs/coffee-collective.webp",
        bagTip: "單向排氣閥原裝袋，常溫乾燥存放，隨身或托運皆可",
        features: [
          "由 WBC 冠軍與世界杯測賽雙料冠軍創立的哥本哈根精品烘豆品牌。",
          "主打北歐淺焙風格，強調產區乾淨果酸與明亮風味。",
          "提供手沖單品與義式配方豆，適合送給喜愛精品咖啡或自行沖煮的朋友。"
        ]
      }
    ],
    shared: [
      {
        id: "ahlgrens-bilar",
        tag: "國民軟糖・老少咸宜",
        name: "Ahlgrens Bilar 經典小車棉花糖軟糖",
        localName: "Ahlgrens Bilar Original (125g / 160g)",
        origin: "🇸🇪 瑞典國民零食",
        budget: "約 18～22 SEK／包（約 NT$55～68）",
        place: "馬爾默 ICA Maxi、Coop 等各大超市，零食糖果貨架極易找到",
        image: "assets/souvenirs/ahlgrens-bilar.webp",
        bagTip: "輕量包裝，托運或後背包皆可攜帶",
        features: [
          "包裝印有「瑞典最暢銷的車（Sveriges mest köpta bil）」，為當地經典車型軟糖。",
          "粉紅、白、綠三色，口感介於棉花糖與小熊軟糖之間，微酸微甜。",
          "放在辦公室公用桌或茶水間隨手拿取，大眾接受度高。"
        ]
      },
      {
        id: "marabou-chocolate",
        tag: "皇室御用・熱量補給",
        name: "Marabou 牛奶巧克力大片裝（海鹽焦糖限定版）",
        localName: "Marabou Mjölkchoklad Havssalt (185g / 200g)",
        origin: "🇸🇪 瑞典皇室御用品牌",
        budget: "約 25～32 SEK／片（約 NT$78～100）",
        place: "馬爾默超市巧克力專區，或哥本哈根超市／免稅店",
        image: "assets/souvenirs/marabou-chocolate.webp",
        bagTip: "避免高溫曝曬，建議放於行李箱陰涼衣物中避免壓碎",
        features: [
          "瑞典常見的代表性大眾巧克力，具備瑞典皇室認證標章（Kunglig Hovleverantör）。",
          "海鹽焦糖（Havssalt）或 Daim 脆片口味甜中帶鹹，奶香濃郁。",
          "大片裝方便掰開分食，適合放在辦公室作為會議或工作間歇點心。"
        ]
      },
      {
        id: "ballerina-kex",
        tag: "傳統 Fika・茶水間首選",
        name: "Ballerina 雙層榛果可可夾心餅乾",
        localName: "Göteborgs Kex Ballerina Original (190g / 205g)",
        origin: "🇸🇪 瑞典百年餅乾廠",
        budget: "約 18～24 SEK／筒（約 NT$55～75）",
        place: "馬爾默 ICA / Coop 餅乾零食專區",
        image: "assets/souvenirs/ballerina-kex.webp",
        bagTip: "圓筒包裝稍具厚度，可直立放於托運行李箱四周固定",
        features: [
          "瑞典 1960 年代推出的經典夾心餅乾，為當地常見的 Fika 下午茶點心。",
          "奶油圓餅夾入榛果可可內餡，中央為鏤空圓孔造型。",
          "適合搭配黑咖啡或熱茶，適合放在茶水間分食。"
        ]
      },
      {
        id: "djungelvral",
        tag: "文化震撼・大冒險道具",
        name: "Malaco Djungelvrål 經典鹹甘草猴子糖",
        localName: "Malaco Djungelvrål Supersalt Lakrits (80g)",
        origin: "🇸🇪 瑞典經典糖果品牌",
        budget: "約 14～18 SEK／包（約 NT$45～55）",
        place: "馬爾默超市收銀台旁或糖果專區",
        image: "assets/souvenirs/djungelvral.webp",
        bagTip: "體積極小，隨便塞在行李角落即可帶回",
        features: [
          "北歐經典的氯化銨（Salmiak）鹹甘草糖，外層裹有鹽粉。",
          "包裝為猴子圖案，入口鹹烈強勁，為北歐道地的重鹹甘草糖。",
          "可買一包放在團隊零食桌，供同事體驗北歐特殊的鹹甘草風味。"
        ]
      }
    ]
  },
  registration: {
    status: "Paid",
    label: "Registration: Paid",
    type: "Full Passport / Author Registration",
    conferenceDates: "2026/09/08 - 2026/09/12",
    location: "Malmö, Sweden",
    mainConference: "主會議 9/10 - 9/12；Workshops & Tutorials 9/8 - 9/9",
    badge: "到會場現場領取 conference badge",
    presentation: "Poster #137 · Poster Session 1 · 10:30 AM CEST"
  },
  transportApps: [
    { name: "Skånetrafiken", region: "瑞典／丹麥", text: "查 Malmö、Hyllie 與 Øresund 跨海列車，也可搭乘 Bus 9。" },
    { name: "SNCF Connect", region: "法國城際", text: "查 Beauvais 到 Paris Nord 的 TER 班次。" },
    { name: "Bonjour RATP", region: "巴黎市區", text: "查 Metro、RER 與即時路線；出發前確認工程異動。" },
    { name: "ECCV Guide (APK)", region: "Android 離線備援", text: "封裝為 Android 獨立安裝檔，無網路也能隨時查看行程、交通、景點、行李清單與快取匯率。" }
  ],
  emergency: {
    title: "歐洲急難救助與駐外代表處",
    headline: "遇竊、遺失護照、事故或突發急症離線應變指南",
    universal: {
      number: "112",
      label: "歐盟通用緊急電話 112",
      desc: "瑞典、丹麥、法國全境通用，免解鎖、免 SIM 卡均可撥打；自動轉接警察、救護車或消防隊。"
    },
    localServices: [
      {
        country: "瑞典 (Malmö)",
        flag: "🇸🇪",
        items: [
          { name: "歐盟通用緊急", phone: "112", note: "生命危險、現行犯罪、火警救護" },
          { name: "非緊急警察局", phone: "114 14", note: "失竊報案、筆錄證明、遺失物" },
          { name: "醫療諮詢專線", phone: "1177", note: "非緊急就醫建議、公立診所轉介" }
        ]
      },
      {
        country: "丹麥 (哥本哈根)",
        flag: "🇩🇰",
        items: [
          { name: "歐盟通用緊急", phone: "112", note: "重大事故、生命危險急救" },
          { name: "非緊急警察局", phone: "114", note: "遺失物、非現行失竊報案" },
          { name: "急診醫療諮詢", phone: "1813", note: "前往醫院急診前必須先致電分流 (首都圈)" }
        ]
      },
      {
        country: "法國 (Beauvais / 巴黎)",
        flag: "🇫🇷",
        items: [
          { name: "歐盟通用緊急", phone: "112", note: "多語緊急應變專線" },
          { name: "緊急醫療救護 (SAMU)", phone: "15", note: "突發重症、心肺急救、外傷急救" },
          { name: "報警與犯罪處理", phone: "17", note: "Police Secours 現行偷竊搶劫報警" },
          { name: "消防與救援", phone: "18", note: "火災、瓦斯外洩、交通事故" }
        ]
      }
    ],
    diplomatic: [
      {
        mission: "駐法國台北代表處",
        city: "巴黎 (Paris)",
        flag: "🇫🇷",
        address: "78 Rue de l'Université, 75007 Paris",
        metro: "M12 Solférino / RER C Musée d'Orsay",
        tel: "+33-1-4439-8830",
        emergencyTel: "+33-6-8007-4994",
        note: "境內直撥 06-8007-4994；專供重大急難求助"
      },
      {
        mission: "駐瑞典台北代表處",
        city: "斯德哥爾摩 (涵蓋 Malmö)",
        flag: "🇸🇪",
        address: "Wenner-Gren Center, Sveavägen 166, Stockholm",
        tel: "+46-8-728-8516",
        emergencyTel: "+46-70-675-5083",
        note: "境內直撥 070-675-5083；24 小時急難救助專線"
      },
      {
        mission: "駐丹麥台北代表處",
        city: "哥本哈根 (Copenhagen)",
        flag: "🇩🇰",
        address: "Amaliegade 5C, 1256 Copenhagen K",
        tel: "+45-3312-3505",
        emergencyTel: "+45-2076-0466",
        note: "境內直撥 2076-0466；緊鄰阿馬林堡宮，24 小時急難專線"
      },
      {
        mission: "外交部緊急聯絡中心",
        city: "全球免付費專線 (台灣)",
        flag: "🇹🇼",
        address: "台北市濟南路一段 2-2 號",
        tel: "+886-800-085-095",
        emergencyTel: "+886-3-398-2629",
        note: "國外付費請撥 +886-3-398-2629；旅外國人 24 小時專線"
      }
    ],
    passportLossSop: [
      { step: "1", title: "當地警察局報案取得證明", desc: "就近尋找警察局報案（法：Commissariat de Police / 瑞：Polis），取得正式報案證明（Déclaration de vol / Police Report），此單據為補辦證件與回國理賠必備。" },
      { step: "2", title: "調用行李箱備援文件", desc: "直接調用托運行李箱內已打包的「2 吋照片 2 張、中華民國身分證影本、護照影本」，連同返台機票證明備查。" },
      { step: "3", title: "聯絡代表處申請「入國證明書」", desc: "致電所在國駐外代表處急難專線，約定時間前往辦理「中華民國臺灣入國證明書」（臨時代替護照搭機返國）。" },
      { step: "4", title: "通報航空公司與信用卡掛失", desc: "若機票或信用卡隨錢包遺失，致電阿聯酋／瑞安航空客服更新旅行證件資訊，並透過網銀 App 凍結信用卡或撥打發卡行 24H 掛失專線。" }
    ],
    financial: [
      {
        bank: "國泰世華銀行 (Cathay United Bank)",
        role: "主力信用卡發卡行",
        flag: "💳",
        hotlines: [
          { label: "海外緊急致電", tel: "+886-2-2383-1000", desc: "海外直撥專線（付費電話，額度用罄臨時調額、海外擋刷解除、遭盜刷掛失）" },
          { label: "台灣境內免付費", tel: "0800-818-001", desc: "市話專線；手機請撥 02-2383-1000" }
        ],
        tips: "卡片刷爆求助：致電客服說明「人在歐洲旅遊，申請臨時調高額度」；或連上網路開啟國泰 CUBE App，透過銀行帳戶即時溢繳恢復可用額度。"
      },
      {
        bank: "國際發卡組織海外緊急支援 (GCAS)",
        role: "Visa / Mastercard 全球急難服務",
        flag: "🌐",
        hotlines: [
          { label: "Visa 全球緊急支援", tel: "+1-303-967-1090", desc: "海外緊急補發替代卡、緊急預借現金（可由當地受話端付費通話）" },
          { label: "Mastercard 全球緊急服務", tel: "+1-636-722-7111", desc: "24 小時卡片緊急掛失與救援" }
        ],
        tips: "若實體卡片遺失且無法補發，發卡組織可於 24 到 48 小時內於當地合作銀行或據點提供緊急現鈔或臨時替代卡。"
      }
    ]
  },
  timeZones: [
    { label: "台灣", cities: "台北", code: "CST", offset: "UTC+8", note: "全年固定" },
    { label: "杜拜", cities: "杜拜", code: "GST", offset: "UTC+4", note: "全年固定，非歐洲時間" },
    { label: "歐洲", cities: "哥本哈根・Malmö・Beauvais・巴黎", code: "CEST", offset: "UTC+2", note: "2026 年 9 月為夏令時間" }
  ],
  tools: {
    defaultFocusDay: "09-06",
    locations: [
      { id: "taipei", label: "台北", english: "Taipei", region: "台灣", timezone: "Asia/Taipei", latitude: 25.033, longitude: 121.5654, code: "CST", note: "全年 UTC+8", flag: "🇹🇼", stage: "出發與返抵" },
      { id: "malmo", label: "Malmö", english: "Malmö", region: "瑞典／ECCV 會場", timezone: "Europe/Stockholm", latitude: 55.605, longitude: 13.0038, code: "CEST", note: "2026 年 9 月 UTC+2", flag: "🇸🇪", stage: "09/07-12 ECCV" },
      { id: "copenhagen", label: "哥本哈根", english: "Copenhagen", region: "丹麥", timezone: "Europe/Copenhagen", latitude: 55.6761, longitude: 12.5683, code: "CEST", note: "2026 年 9 月 UTC+2", flag: "🇩🇰", stage: "09/09-12 丹麥" },
      { id: "paris", label: "巴黎", english: "Paris", region: "法國", timezone: "Europe/Paris", latitude: 48.8566, longitude: 2.3522, code: "CEST", note: "2026 年 9 月 UTC+2", flag: "🇫🇷", stage: "09/13-18 巴黎" }
    ],
    weather: {
      provider: "Open-Meteo",
      attributionUrl: "https://open-meteo.com/",
      note: "天氣為即時預報，出發前與當天再次確認。"
    },
    exchange: {
      endpoint: "https://open.er-api.com/v6/latest/TWD",
      provider: "ExchangeRate-API",
      attributionUrl: "https://www.exchangerate-api.com/docs/free",
      note: "參考匯率；實際刷卡、提款與換匯可能包含銀行或手續費。",
      defaultFrom: "EUR",
      defaultTo: "TWD"
    },
    currencies: [
      { code: "TWD", label: "新台幣", symbol: "NT$" },
      { code: "EUR", label: "歐元", symbol: "€", usedIn: "法國" },
      { code: "DKK", label: "丹麥克朗", symbol: "kr" },
      { code: "SEK", label: "瑞典克朗", symbol: "kr" }
    ],
    translator: {
      model: "qwen3.6-35b-a3b-gmi-ray",
      fallbackModel: "gemma-4-31b-it-gmi-ray",
      systemPrompt: "You are a precise travel translation assistant. Translate text or readable text in images faithfully. Preserve names, addresses, numbers, dates, times, currency, units, line breaks, and formatting. For images, transcribe and translate all readable text in natural reading order. Return only the translation in the requested target language, with no explanation or preamble. If an image has no readable text, say that no readable text was found.",
      defaultTarget: "zh-Hant",
      languages: [
        { code: "zh-Hant", label: "繁體中文" },
        { code: "en", label: "English" },
        { code: "fr", label: "Français" },
        { code: "da", label: "Dansk" },
        { code: "sv", label: "Svenska" },
        { code: "fi", label: "Suomi" }
      ]
    },
    recommendedApps: [
      {
        id: "skanetrafiken",
        stageBadge: "09/07-12 瑞典",
        category: "瑞典公車・跨海鐵路",
        name: "Skånetrafiken",
        badge: "SE",
        accent: "teal",
        desc: "Malmö 市區公車（Bus 9）與跨海鐵路（Øresundståg）購票搭乘必備，同行享聯票折扣。",
        iosUrl: "https://apps.apple.com/app/skanetrafiken/id1180539331",
        androidUrl: "https://play.google.com/store/apps/details?id=se.skanetrafiken.washington",
        webUrl: "https://www.skanetrafiken.se/"
      },
      {
        id: "rejseplanen",
        stageBadge: "09/09-12 丹麥",
        category: "丹麥地鐵・交通規劃",
        name: "Rejseplanen",
        badge: "DK",
        accent: "coral",
        desc: "丹麥官方大眾運輸即時動態與轉乘規劃，涵蓋哥本哈根地鐵 M1 到 M4、S-tog 與公車路網。",
        iosUrl: "https://apps.apple.com/app/rejseplanen/id317007942",
        androidUrl: "https://play.google.com/store/apps/details?id=de.hafas.android.rejseplanen",
        webUrl: "https://www.rejseplanen.dk/"
      },
      {
        id: "ryanair",
        stageBadge: "09/12 航班",
        category: "廉航登機・行李報到",
        name: "Ryanair",
        badge: "FL",
        accent: "gold",
        desc: "09/12 航班 FR9267 必備，出發前 24 小時線上 Check-in 下載電子登機證，避免機場臨櫃費用。",
        iosUrl: "https://apps.apple.com/app/ryanair/id504270602",
        androidUrl: "https://play.google.com/store/apps/details?id=com.ryanair.cheapflights",
        webUrl: "https://www.ryanair.com/"
      },
      {
        id: "bonjour-ratp",
        stageBadge: "09/13-18 巴黎",
        category: "法國巴黎地鐵交通",
        name: "Bonjour RATP",
        badge: "FR",
        accent: "blue",
        desc: "巴黎 Metro、RER 即時路網動態、轉乘導航，並支援手機 NFC 感應加值 Navigo 數位交通票。",
        iosUrl: "https://apps.apple.com/app/bonjour-ratp/id507107090",
        androidUrl: "https://play.google.com/store/apps/details?id=com.fabernovel.ratp",
        webUrl: "https://www.ratp.fr/apps/bonjour-ratp"
      }
    ]
  },
  flights: [
    {
      date: "09/06",
      route: "台北 T2 → 杜拜 T3",
      code: "EK 367",
      aircraft: "Airbus A380-800",
      seat: "49C",
      localTime: "台北 09/06 23:50 → 杜拜 09/07 04:35",
      localTimeZones: "台北 UTC+8 → 杜拜 GST UTC+4",
      taiwanTime: "台灣 09/06 23:50 → 09/07 08:35",
      duration: "約 8 小時 45 分",
      note: "阿聯酋航空經濟艙；座位 49C（走道，Preferred seat）"
    },
    {
      date: "09/07",
      route: "杜拜 T3 → 哥本哈根 T3",
      code: "EK 151",
      aircraft: "Boeing 777-300ER",
      seat: "25H",
      localTime: "杜拜 09/07 08:20 → 哥本哈根 09/07 13:15",
      localTimeZones: "杜拜 GST UTC+4 → 哥本哈根 CEST UTC+2",
      taiwanTime: "台灣 09/07 12:20 → 19:15",
      duration: "約 6 小時 55 分",
      note: "抵達後前往 Malmö；座位 25H（走道，Regular seat）"
    },
    {
      date: "09/12",
      route: "哥本哈根 T2 → Beauvais-Tillé",
      code: "FR9267",
      aircraft: "Ryanair／Malta Air",
      localTime: "哥本哈根 09/12 20:05 → Beauvais 09/12 22:00",
      localTimeZones: "哥本哈根／Beauvais CEST UTC+2",
      taiwanTime: "台灣 09/13 02:05 → 04:00",
      duration: "約 1 小時 55 分",
      note: "Ryanair／Malta Air 代碼共享；四位同行座位已確認；每人 1 件 20 kg 託運行李",
      passengers: [
        { name: "同行者 1", seat: "20A", bag: "20 kg Check-in Bag" },
        { name: "同行者 2", seat: "20B", bag: "20 kg Check-in Bag" },
        { name: "同行者 3", seat: "21A", bag: "20 kg Check-in Bag" },
        { name: "同行者 4", seat: "21B", bag: "20 kg Check-in Bag" }
      ]
    },
    {
      date: "09/18",
      route: "巴黎 CDG T2C → 杜拜 T3",
      code: "EK 74",
      aircraft: "Airbus A380-800",
      seat: "62C",
      localTime: "巴黎 09/18 15:35 → 杜拜 09/19 01:10",
      localTimeZones: "巴黎 CEST UTC+2 → 杜拜 GST UTC+4",
      taiwanTime: "台灣 09/18 21:35 → 09/19 05:10",
      duration: "約 7 小時 35 分",
      note: "回程第一段；座位 62C（走道，Regular seat）"
    },
    {
      date: "09/19",
      route: "杜拜 T3 → 台北 T2",
      code: "EK 366",
      aircraft: "Airbus A380-800",
      seat: "47H",
      localTime: "杜拜 09/19 04:05 → 台北 09/19 16:35",
      localTimeZones: "杜拜 GST UTC+4 → 台北 UTC+8",
      taiwanTime: "台灣 09/19 08:05 → 16:35",
      duration: "約 8 小時 30 分",
      note: "回到台灣；座位 47H（走道，Preferred seat）"
    }
  ],
  stays: [
    {
      city: "Malmö",
      date: "09/07 - 09/12",
      name: "First Camp Sibbarp-Malmö",
      address: "Strandgatan 101, Vaster, 216 11 Malmö",
      phone: "+46 40 15 51 65",
      bookingRef: "已遮蔽",
      note: "09/07 15:00 起入住（已約定 18:00-19:00 抵達），09/12 11:00 前退房；退房前須自行完成清潔或付費清潔；日常以 Götgatan 搭 Bus 9 接 Hyllie。",
      fit: "已確認住宿（4 位成人 1 棟 Cottage 獨立小木屋）。Sibbarp 靠海清靜，附小廚房、微波爐、露台與免費停車位；以 Bus 9 接 Hyllie 即可前往會場、市中心、哥本哈根與機場。"
    },
    { city: "Beauvais", date: "09/12 - 09/13", name: "Hostellerie Saint Vincent Beauvais Aéroport", address: "241 Rue de Clermont, Beauvais", note: "抵達 Beauvais 後住一晚，隔天以 Beauvais SNCF 進巴黎。", fit: "已確認住宿。22:00 抵達 BVA，先在 Beauvais 過夜避免深夜拖行李進巴黎；隔天叫車至 Beauvais SNCF 再搭 TER。" },
    { city: "Paris", date: "09/13 - 09/18", name: "Sure Hotel by Best Western Paris Gare du Nord", address: "224 Rue du Faubourg Saint-Denis, Paris", note: "靠近 Gare du Nord；巴黎市區行程都從這裡出發。", fit: "已確認住宿。主要優勢在於交通：搭乘 Beauvais TER 抵達 Paris Nord 後方便入住，回程亦可由 Gare du Nord 搭 RER B 直達 CDG。" }
  ],
  tickets: [
    {
      id: "ek367-boarding-pass",
      title: "阿聯酋官方電子登機證",
      subtitle: "台北 TPE → 杜拜 DXB → 哥本哈根 CPH (2 段雙頁完整憑證)",
      category: "flight",
      badge: "登機證",
      dateLabel: "09/06 23:50 起飛 · 09/07 13:15 抵達",
      targetDays: ["09-06", "09-07"],
      encFile: "ek367-boarding-pass.enc",
      qrHint: "桃機報到托運、EK 367 登機 (49C) 與杜拜轉機、EK 151 登機 (25H) 時出示",
      details: [
        { label: "去程第 1 段", value: "EK 367 (台北 23:50 → 杜拜 04:35+1 · 座位 49C · Group 6 · 23:05 登機)" },
        { label: "去程第 2 段", value: "EK 151 (杜拜 08:20 → 哥本哈根 13:15 · 座位 25H · Group 4 · 07:20 登機)" },
        { label: "搭乘旅客", value: "旅客本人" },
        { label: "訂位代號", value: "已遮蔽" },
        { label: "電子票號", value: "已遮蔽" },
        { label: "轉機時限", value: "杜拜轉機安檢截止 07:20 / 登機門關閉 08:05" },
        { label: "憑證格式", value: "官方電子登機證 (雙頁含兩段完整 2D 條碼)" }
      ]
    },
    {
      id: "emirates-flights",
      hidden: true,
      title: "阿聯酋航空電子機票",
      subtitle: "台北 ⇄ 歐洲 全程 4 段官方機票",
      category: "flight",
      badge: "電子機票",
      dateLabel: "09/06-07 去程 · 09/18-19 回程",
      targetDays: [],
      encFile: "emirates-flights.enc",
      qrHint: "機場櫃檯報到、托運或安檢時出示官方 PDF",
      details: [
        { label: "訂位代號", value: "已遮蔽" },
        { label: "電子票號", value: "已遮蔽" },
        { label: "旅客姓名", value: "已遮蔽" },
        { label: "去程航段", value: "EK 367 (49C) + EK 151 (25H)" },
        { label: "回程航段", value: "EK 74 (62C) + EK 366 (47H)" },
        { label: "票券格式", value: "Emirates 官方 e-Ticket 憑證" }
      ]
    },
    {
      id: "stromma-canal-tour",
      title: "哥本哈根經典運河遊船",
      subtitle: "Stromma Classic Canal Tour 門票",
      category: "attraction",
      badge: "遊船門票",
      dateLabel: "09/12 15:00 - 16:00",
      targetDays: ["09-12"],
      encFile: "stromma-canal-tour.enc",
      qrHint: "登船前於 Nyhavn 3 碼頭出示官方 QR 碼掃描",
      details: [
        { label: "預約時段", value: "2026/09/12 15:00-16:00 (14:45 報到)" },
        { label: "預約人數", value: "4 位成人 (Adults)" },
        { label: "登船地點", value: "Nyhavn 3, Copenhagen" },
        { label: "票券格式", value: "官方入場 QR-ticket PDF" }
      ]
    },
    {
      id: "church-our-saviour",
      title: "救主堂螺旋尖塔登頂門票",
      subtitle: "Church of Our Saviour 螺旋塔門票",
      category: "attraction",
      badge: "登頂門票",
      dateLabel: "09/12 16:30 - 17:15",
      targetDays: ["09-12"],
      encFile: "church-our-saviour.enc",
      qrHint: "入場登塔時出示官方 QR 碼掃描",
      details: [
        { label: "預約時段", value: "2026/09/12 16:30-17:15 (最後入場前 30 分)" },
        { label: "預約人數", value: "4 位學生 (Students)" },
        { label: "景點地址", value: "Sankt Annæ Gade 29, Copenhagen" },
        { label: "票券格式", value: "官方預約確認與 QR 碼憑證" }
      ]
    },
    {
      id: "ryanair-fr9267",
      title: "瑞安航空登機證 (FR9267)",
      subtitle: "哥本哈根 CPH → 巴黎博韋 BVA (4 人已劃位)",
      category: "flight",
      badge: "航班行程",
      dateLabel: "09/12 20:05 起飛",
      targetDays: ["09-12"],
      encFile: "ryanair-fr9267.enc",
      qrHint: "哥本哈根 T2 行李托運與登機口出示",
      details: [
        { label: "航班代號", value: "FR9267 (Ryanair / Malta Air)" },
        { label: "劃位座位", value: "20A, 20B, 21A, 21B (4 位旅客)" },
        { label: "行李額度", value: "每人 1 件 20 kg 托運行李 + 小型隨身包" },
        { label: "航線時間", value: "CPH 20:05 → BVA 22:00" },
        { label: "票券格式", value: "官方 Boarding Pass PDF" }
      ]
    },
    {
      id: "sainte-chapelle",
      title: "聖徒禮拜堂 4 人預約門票",
      subtitle: "Sainte-Chapelle 官方指定時段門票",
      category: "attraction",
      badge: "預約門票",
      dateLabel: "09/14 15:00 - 16:05",
      targetDays: ["09-14"],
      encFile: "sainte-chapelle.enc",
      qrHint: "司法宮安檢與禮拜堂入口出示 4 張官方 QR 碼",
      details: [
        { label: "預約時段", value: "2026/09/14 15:00" },
        { label: "預約人數", value: "4 位成人 (Adults)" },
        { label: "集合地點", value: "10 Boulevard du Palais, Paris" },
        { label: "票券格式", value: "4 份獨立官方 E-Ticket PDF" }
      ]
    },
    {
      id: "arc-de-triomphe",
      title: "巴黎凱旋門 4 人預約門票",
      subtitle: "Arc de Triomphe 官方指定時段門票",
      category: "attraction",
      badge: "預約門票",
      dateLabel: "09/16 10:50 - 12:00",
      targetDays: ["09-16"],
      encFile: "arc-de-triomphe.enc",
      qrHint: "地下通道入口排隊與驗票處出示 4 張 QR 碼",
      details: [
        { label: "預約時段", value: "2026/09/16 10:50 (10:20 抵達排隊)" },
        { label: "預約人數", value: "4 位成人 (Adults)" },
        { label: "景點位置", value: "Place Charles de Gaulle, Paris" },
        { label: "票券格式", value: "4 份獨立官方 E-Ticket PDF" }
      ]
    },
    {
      id: "louvre",
      title: "羅浮宮 4 人預約門票",
      subtitle: "Musée du Louvre 官方指定時段門票",
      category: "attraction",
      badge: "預約門票",
      dateLabel: "09/16 16:30 - 20:30",
      targetDays: ["09-16"],
      encFile: "louvre.enc",
      qrHint: "玻璃金字塔指定時段預約隊伍安檢時出示 4 張 QR 碼",
      details: [
        { label: "預約時段", value: "2026/09/16 16:30 (16:00 報到排隊)" },
        { label: "預約人數", value: "4 位成人 (Adults)" },
        { label: "開館時間", value: "週三夜間開放至 21:00 (20:30 清場)" },
        { label: "票券格式", value: "4 份獨立官方 E-Ticket PDF" }
      ]
    },
    {
      id: "versailles",
      title: "凡爾賽宮 Passport 全區門票",
      subtitle: "Château de Versailles Passport 門票",
      category: "attraction",
      badge: "全區門票",
      dateLabel: "09/17 10:00 入場",
      targetDays: ["09-17"],
      encFile: "versailles.enc",
      qrHint: "主宮 A 入口與特里亞農宮苑出示官方 QR 碼",
      details: [
        { label: "預約時段", value: "2026/09/17 10:00 (09:55 前抵達安檢)" },
        { label: "涵蓋範圍", value: "主宮殿 + 凡爾賽花園 + 特里亞農宮苑 (全區通行)" },
        { label: "景點地址", value: "Place d'Armes, Versailles" },
        { label: "票券格式", value: "官方 Passport E-Ticket PDF" }
      ]
    },
    {
      id: "k7-pass",
      title: "K7 文化通行證 (Week 37)",
      subtitle: "K7 WEEK 2026 青年免費通行證",
      category: "attraction",
      badge: "文化通行證",
      dateLabel: "09/07-09/13 (Week 37 全週有效)",
      targetDays: ["09-08", "09-11"],
      encFile: "k7-pass.enc",
      qrHint: "18 到 27 歲免費入場；Malmö Museum（城堡與科技館）、DAC、克里斯蒂安堡宮接待廳、圓塔等合作場館入場出示",
      details: [
        { label: "票券名稱", value: "K7 WEEK 2026 (Digital Pass)" },
        { label: "持票姓名", value: "已遮蔽" },
        { label: "有效期間", value: "2026/09/07 - 2026/09/13 (第 37 週)" },
        { label: "適用場館", value: "Malmö Museum、DAC @ BLOX、克里斯蒂安堡宮接待廳、圓塔等 250+ 館舍" },
        { label: "票券格式", value: "官方數位通行證 (含驗證 QR Code 與條碼)" }
      ]
    },
    {
      id: "first-camp",
      title: "First Camp Sibbarp 住宿確認單",
      subtitle: "馬爾默 5 晚小木屋預約憑證 (4 位成人)",
      category: "hotel",
      badge: "住宿憑證",
      dateLabel: "09/07 15:00 起 (約定 18:00-19:00) · 09/12 11:00 前",
      targetDays: ["09-07", "09-08", "09-09", "09-10", "09-11", "09-12"],
      encFile: "first-camp.enc",
      qrHint: "辦理入住、領取小木屋鑰匙或接待處確認時出示官方 PDF",
      details: [
        { label: "預訂編號", value: "已遮蔽" },
        { label: "預約期間", value: "2026/09/07 (週一) 15:00 起至 09/12 (週六) 11:00 前 (共 5 晚)" },
        { label: "抵達約定", value: "已確認於 18:00 - 19:00 間抵達辦理入住 (接待處)" },
        { label: "房型格局", value: "Cottage 獨立小木屋 (4 位成人，含露台、烹飪設備、微波爐、咖啡機、免費 WiFi 與 1 個車位)" },
        { label: "退房清潔", value: "退房前須自行清潔小屋或現場加購清潔費；垃圾與碗盤需收拾" },
        { label: "餐食規定", value: "房價不含餐點；早餐袋需提前預訂" },
        { label: "聯絡電話", value: "+46 40 15 51 65" },
        { label: "住宿地址", value: "Strandgatan 101, Vaster, 216 11 Malmö, Sweden" },
        { label: "憑證格式", value: "Booking.com 官方訂房確認更新單 PDF" }
      ]
    }
  ],
  places: {
    malmohus: { region: "Malmö", title: "Malmöhus Castle & Malmö Museums", local: "馬爾默城堡、博物館與水族館", kicker: "城堡・水族館・藝術・城市歷史", intro: "Malmöhus 是 Malmö Museum 一日聯票的主要館舍，城堡內包含城市歷史、自然史、水族館與 Malmö Art Museum。與科技海事館相距僅幾分鐘步行，可在同一天使用聯票參觀。", stay: "約 2 到 2.5 小時", accent: "plum" },
    tekniken: { region: "Malmö", title: "Teknikens och Sjöfartens hus", local: "科技與海事館", kicker: "科技・工程・交通", intro: "Malmö Museums 系統中著重科技與工程的一館，內容涵蓋交通工具、機械、航海與技術發展，很適合安排為 Malmö 的主要科技行程。", stay: "約 2 到 3 小時", accent: "teal" },
    saluhall: { region: "Malmö", title: "Malmö Saluhall", local: "馬爾默市場大廳", kicker: "美食・市場・城市生活", intro: "由舊貨運建築改造的美食市場，集合餐廳、烘焙、咖啡、熟食與各類小吃，適合在此用餐並體驗 Malmö 的日常市集風貌。", stay: "約 1 到 1.5 小時", accent: "coral" },
    lilla: { region: "Malmö", title: "Lilla Torg", local: "小廣場", kicker: "老城・街景・餐廳", intro: "Malmö 老城具代表性的歷史廣場，周圍聚集老建築、餐廳與咖啡館，適合散步、看街景與喝咖啡。", stay: "約 1 小時以上", accent: "gold" },
    disgusting: { region: "Malmö", title: "Disgusting Food Museum", local: "噁心食物博物館", kicker: "特殊體驗・飲食文化", intro: "以世界各地特殊食物為主題，探討不同文化對味道與食物的感受。展覽偏重互動，包含聞氣味與試吃體驗。", stay: "約 1 到 1.5 小時", accent: "plum" },
    turning: { region: "Malmö", title: "Turning Torso & Västra Hamnen", local: "旋轉大樓與西港區", kicker: "現代建築・城市設計・海港景觀", intro: "Turning Torso 是 Malmö 醒目的地標建築，外觀逐層旋轉。周邊 Västra Hamnen 為濱水新興社區，適合散步看建築與海港景致。", stay: "約 1 到 2 小時", accent: "teal" },
    eccv: { region: "Malmö", title: "ECCV 2026", local: "歐洲電腦視覺會議", kicker: "學術會議・展覽・海報發表", intro: "ECCV 2026 會議場地，位於 Hyllie 車站旁，包含 Malmö Arena 與 Malmömässan。", stay: "依議程而定", accent: "coral" },
    experimentarium: { region: "Copenhagen", title: "Experimentarium", local: "互動科學中心", kicker: "互動科技・物理體驗・動手操作", intro: "動手操作為主的互動科學中心，包含光學迷宮、身體探索、泡泡實驗室與頂樓互動展區，適合保留充足時間體驗。", stay: "約 4 到 5 小時", accent: "teal" },
    enigma: { region: "Copenhagen", title: "ENIGMA Museum of Communication", local: "通訊博物館", kicker: "通訊・科技史・互動展", intro: "展示通訊、郵政、電信與數位科技發展的互動博物館，展品精巧，適合輕鬆參觀。", stay: "約 1.5 到 2 小時", accent: "plum" },
    nyhavn: { region: "Copenhagen", title: "Nyhavn", local: "新港", kicker: "經典街景・運河港區・拍照", intro: "哥本哈根經典運河港區，兩側為彩色街屋與木造帆船，也是運河遊船的出發點。", stay: "約 1 到 1.5 小時", accent: "gold" },
    kongensnytorv: { region: "Copenhagen", title: "Kongens Nytorv", local: "國王新廣場", kicker: "古典廣場・皇家劇院・交通節點", intro: "新港旁的國王新廣場，連接 Strøget 步行街、皇家劇院與地鐵站，是市中心的重要交通與餐飲節點。", stay: "約 30 到 45 分鐘", accent: "gold" },
    stroget: { region: "Copenhagen", title: "Strøget", local: "步行購物街", kicker: "逛街・城市生活・設計", intro: "連接哥本哈根市中心多個廣場的步行街區，沿途有北歐設計品牌、書店、咖啡館與餐飲，適合散步逛街。", stay: "約 1 到 2 小時", accent: "gold" },
    tivoli: { region: "Copenhagen", title: "Tivoli Gardens", local: "趣伏里花園", kicker: "遊樂園・夜景・餐飲・氣氛", intro: "位於中央車站旁的歷史花園遊樂園。園內花園造景、經典老建築、餐廳與夜間燈光很有特色，適合傍晚入園漫步至夜晚。", stay: "約 4 到 6 小時", accent: "gold" },
    dac: { region: "Copenhagen", title: "Dansk Arkitektur Center (DAC @ BLOX)", local: "丹麥建築中心", kicker: "現代建築・巨型溜滑梯・海港展覽", intro: "位於 BLOX 大樓內的丹麥建築中心，展出港灣永續建築與城市設計，並設有 4 層樓高（15 公尺）的室內巨型旋轉溜滑梯（BLOX Slide）與港灣露台。", stay: "約 1.5 小時", accent: "teal" },
    rosenborg: { region: "Copenhagen", title: "Rosenborg Castle", local: "羅森堡城堡", kicker: "王室歷史・皇冠珠寶・城堡", intro: "十七世紀王室宮殿，地下寶庫珍藏丹麥皇冠與王室珠寶，展品集中，適合了解丹麥王室歷史。", stay: "約 1.5 到 2 小時", accent: "plum" },
    torvehallerne: { region: "Copenhagen", title: "TorvehallerneKBH", local: "托維哈勒恩市場", kicker: "市場・丹麥小吃・午餐", intro: "位於 Nørreport 旁的雙館市集，集合開放式三明治（smørrebrød）、烘焙、咖啡與熟食，適合當作市區行程的午餐站。", stay: "約 1 到 1.5 小時", accent: "coral" },
    roundtower: { region: "Copenhagen", title: "Rundetaarn", local: "圓塔", kicker: "螺旋斜坡・老城紅瓦屋頂・天文台", intro: "走平緩的螺旋斜坡通往頂樓觀景台，360 度俯瞰哥本哈根老城區紅瓦屋頂，憑 K7 通行證享青年免費入場。", stay: "約 1 小時", accent: "gold" },
    christiansborg: { region: "Copenhagen", title: "Christiansborg Palace", local: "克里斯蒂安堡宮", kicker: "皇家接待廳・編織壁毯・國會政治", intro: "丹麥國會與皇家接待場所所在地，可憑 K7 通行證免費參觀金碧輝煌的皇家接待廳（Great Hall）與現代編織壁毯。", stay: "約 1 到 1.5 小時", accent: "plum" },
    amalienborg: { region: "Copenhagen", title: "Amalienborg Palace", local: "阿馬林堡宮", kicker: "王宮建築・八角廣場・衛兵交接", intro: "由四座對稱宮殿圍繞的八角廣場，中午 12:00 有衛兵交接儀式。", stay: "約 45 到 60 分鐘", accent: "gold" },
    marmorkirken: { region: "Copenhagen", title: "Marmorkirken", local: "大理石教堂", kicker: "巴洛克圓頂・宗教建築", intro: "位於阿馬林堡宮旁的大理石圓頂教堂，內部挑高巴洛克圓頂十分典雅。", stay: "約 30 到 45 分鐘", accent: "teal" },
    canal: { region: "Copenhagen", title: "Stromma Classic Canal Tour", local: "經典運河遊船", kicker: "水上視角・港灣景致", intro: "從新港搭船遊覽哥本哈根運河與港灣，可從水上視角欣賞救主堂、歌劇院與黑鑽石圖書館。", stay: "約 1 小時", accent: "teal" },
    saviour: { region: "Copenhagen", title: "Church of Our Saviour", local: "救主堂", kicker: "螺旋尖塔・城市全景", intro: "以戶外金色螺旋尖塔聞名的巴洛克教堂，登頂 400 階可俯瞰哥本哈根全景。", stay: "約 45 到 60 分鐘", accent: "gold" },
    notre: { region: "Paris", title: "Cathédrale Notre-Dame de Paris", local: "巴黎聖母院", kicker: "哥德建築・西岱島地標", intro: "巴黎聖母院，座落於西岱島上，為法國哥德式建築經典代表。", stay: "約 1 小時", accent: "coral" },
    sainte: { region: "Paris", title: "Sainte-Chapelle", local: "聖徒禮拜堂", kicker: "彩繪玻璃・哥德建築", intro: "以十五扇高聳璀璨的哥德式彩繪玻璃窗聞名，午後光線穿透時特別明亮。", stay: "約 45 到 60 分鐘", accent: "plum" },
    latin: { region: "Paris", title: "Latin Quarter & Luxembourg", local: "拉丁區與盧森堡公園", kicker: "花園・先賢祠・大學區", intro: "巴黎左岸的歷史文教區，聚集盧森堡公園、先賢祠、索邦大學與各類書店、咖啡館。", stay: "約 2 到 3 小時", accent: "teal" },
    army: { region: "Paris", title: "Musée de l’Armée & Les Invalides", local: "軍事博物館與榮軍院", kicker: "軍事史・拿破崙墓・金色圓頂", intro: "位於榮軍院內，展示法國歷代軍事裝備與武器史料，圓頂教堂下安葬拿破崙一世。", stay: "約 2 到 2.5 小時", accent: "coral" },
    rodin: { region: "Paris", title: "Musée Rodin", local: "羅丹美術館", kicker: "沉思者・雕塑花園", intro: "展示羅丹雕塑作品的美術館，戶外花園內座落《沉思者》與《地獄之門》等代表作。", stay: "約 1.5 到 2 小時", accent: "plum" },
    eiffel: { region: "Paris", title: "Eiffel Tower", local: "艾菲爾鐵塔", kicker: "巴黎地標・城市全景", intro: "巴黎地標艾菲爾鐵塔，登塔可俯瞰戰神廣場與巴黎全景。", stay: "約 2 到 2.5 小時", accent: "teal" },
    birhakeim: { region: "Paris", title: "Pont de Bir-Hakeim", local: "比爾哈凱姆橋", kicker: "鋼構・高架地鐵・鐵塔視角", intro: "跨越塞納河的雙層鋼構橋樑，上層為地鐵 6 號線，下層為車道與人行步道，也是眺望鐵塔的絕佳視角。", stay: "約 30 到 45 分鐘", accent: "teal" },
    arc: { region: "Paris", title: "Arc de Triomphe", local: "凱旋門", kicker: "城市全景・歷史地標", intro: "座落於戴高樂星形廣場中央，十二條大道以此為中心呈放射狀延伸，登頂可欣賞巴黎城市軸線。", stay: "約 1 到 1.5 小時", accent: "coral" },
    champs: { region: "Paris", title: "Champs-Élysées", local: "香榭麗舍大道", kicker: "經典大道・購物・城市氣氛", intro: "從凱旋門延伸至協和廣場的林蔭大道，沿途聚集旗艦店、咖啡館與劇院。", stay: "約 1 到 2 小時", accent: "gold" },
    louvre: { region: "Paris", title: "Musée du Louvre", local: "羅浮宮", kicker: "藝術博物館・歷史・建築", intro: "世界代表性博物館，館藏涵蓋古典藝術、繪畫與雕塑，以《蒙娜麗莎》、勝利女神與米洛的維納斯為代表。", stay: "約 3 到 4 小時", accent: "plum" },
    versailles: { region: "Paris", title: "Palace of Versailles", local: "凡爾賽宮與花園", kicker: "王宮建築・鏡廳・法式花園", intro: "法國 17 世紀宮殿建築，包含鏡廳、國王套房、廣闊運河花園與特里亞農宮苑。", stay: "約 6 到 8 小時", accent: "gold" },
    tuileries: { region: "Paris", title: "Jardin des Tuileries", local: "杜樂麗花園", kicker: "法式花園・水池・散步", intro: "連接協和廣場與羅浮宮的對稱法式花園，林蔭步道與水池旁適合休息。", stay: "約 45 到 60 分鐘", accent: "teal" },
    palais: { region: "Paris", title: "Palais Royal", local: "巴黎皇家宮殿", kicker: "黑白條紋柱・安靜花園", intro: "鄰近羅浮宮的古典宮殿庭院，以 Buren 黑白條紋藝術圓柱與安靜拱廊聞名。", stay: "約 30 到 45 分鐘", accent: "plum" },
    sciences: { region: "Paris", title: "Cité des sciences et de l’industrie", local: "科學與工業城", kicker: "大型科學館・互動展・探索", intro: "位於拉維萊特公園的大型科學互動博物館，涵蓋太空、科技與工業主題。", stay: "約 3 到 4 小時", accent: "teal" },
    opera: { region: "Paris", title: "Palais Garnier", local: "加尼葉歌劇院", kicker: "新巴洛克・歌劇院・華麗裝飾", intro: "新巴洛克風格的巴黎歌劇院，內部裝飾細緻，大階梯與天花板壁畫為其特色。", stay: "約 1.5 到 2 小時", accent: "gold" },
    sacre: { region: "Paris", title: "Sacré-Cœur & Montmartre", local: "聖心堂與蒙馬特", kicker: "高地全景・街區・愛牆", intro: "座落於蒙馬特高地的白色羅馬拜占庭式大教堂，階梯前可俯瞰整個巴黎市區。", stay: "約 2 到 3 小時", accent: "coral" },
    grandpalais: { region: "Paris", title: "Grand Palais", local: "巴黎大皇宮", kicker: "玻璃穹頂・歷史展館", intro: "具備大型玻璃穹頂的歷史展覽館，舉辦各類藝術博覽會與文化活動。", stay: "約 1 到 2 小時", accent: "gold" },
    marais: { region: "Paris", title: "Le Marais", local: "瑪黑區", kicker: "歷史街區・獨立店・咖啡", intro: "充滿歷史氛圍的巴黎街區，聚集獨立小店、藝廊、咖啡館與猶太街區熟食。", stay: "約 2 到 3 小時", accent: "plum" },
    bonmarche: { region: "Paris", title: "Le Bon Marché", local: "樂蓬馬歇百貨", kicker: "百貨・美食館・伴手禮", intro: "巴黎左岸的百貨公司，鄰近的食品館販售多種法國在地食品與伴手禮。", stay: "約 1.5 到 2 小時", accent: "coral" },
    trocadero: { region: "Paris", title: "Place du Trocadéro", local: "特羅卡德羅廣場與夏樂宮露台", kicker: "鐵塔全景・大理石露台・華沙噴泉", intro: "位於艾菲爾鐵塔正對岸的高地廣場，中央大理石露台與夏樂宮花園階梯是眺望與拍攝艾菲爾鐵塔全貌的經典視角。", stay: "約 45 到 60 分鐘", accent: "gold" },
    cygnes: { region: "Paris", title: "Île aux Cygnes & Statue de la Liberté", local: "天鵝島與自由女神像", kicker: "塞納河中島・林蔭漫步・青銅自由女神", intro: "塞納河中央長達 850 公尺的狹長人工島嶼，中央為雙排林蔭步道（Allée des Cygnes），西南端矗立 1889 年法國贈予的原版縮小青銅自由女神像，面朝紐約方向。", stay: "約 45 到 60 分鐘", accent: "teal" },
    beaugrenelle: { region: "Paris", title: "Beaugrenelle Paris & Fnac", local: "博格內爾現代商場與 Fnac", kicker: "現代鋼構商場・Fnac 旗艦店・冷氣休憩", intro: "塞納河左岸的雙棟鋼構商場，設有採光天井、大型 Fnac（3C 與文化商品店）以及多家餐廳，適合作為午後採買與休息點。", stay: "約 1 到 1.5 小時", accent: "coral" },
    ballon: { region: "Paris", title: "Ballon de Paris Generali (Parc André Citroën)", local: "雪鐵龍公園・巴黎大氣球", kicker: "繫留氦氣球・150M 空中全景・空氣科學實驗室", intro: "雪鐵龍公園內的繫留式氦氣球，垂直升空至 150 公尺（約 50 層樓高），可於空中俯瞰巴黎市景；氣球同時搭載監測設備記錄空氣品質。免預約，現場視天候風速購票升空。", stay: "約 1 小時", accent: "teal" },
    francette: { region: "Paris", title: "Francette", local: "法蘭賽特水上餐廳", kicker: "塞納河船上餐廳・鐵塔景觀", intro: "停泊於艾菲爾鐵塔旁塞納河畔的景觀餐廳，可在水上近距離欣賞鐵塔夜景。", stay: "約 2 小時", accent: "coral" }
  },
  days: {
    "09-06": {
      date: "2026/09/06", weekday: "週日", city: "台北 → 杜拜", cityKey: "travel", title: "深夜啟程，飛往杜拜", summary: "晚上到桃園機場 T2 辦理報到、托運與安檢出境，23:50 搭乘阿聯酋航空 EK 367 跨夜飛往杜拜。", stay: "機上", tone: "coral",
      schedule: [
        { time: "20:50 - 22:20", icon: "✈", title: "抵達桃機 T2、阿聯酋報到與行李托運", detail: "20:50 抵達第二航廈，辦理報到手續與 20 kg 行李托運；托運櫃檯截止時間為 22:20。", tag: "報到", ticketId: "ek367-boarding-pass" },
        { time: "22:20 - 22:50", icon: "⌁", title: "安全檢查與證照查驗", detail: "完成出境安檢與通關，安檢截止時間為 22:50；提前前往登機門準備。", tag: "通關" },
        { time: "23:05 - 23:50", icon: "✈", title: "登機門開放與登機 (EK 367)", detail: "登機門 23:05 開放，出示電子登機證條碼登機；座位 49C（經濟艙 Preferred seat），23:50 準時起飛。", tag: "航班", ticketId: "ek367-boarding-pass" },
        { time: "飛行中", icon: "☾", title: "台北 TPE → 杜拜 DXB 跨夜飛行", detail: "飛行時間約 8 小時 45 分，機上休息；預計杜拜時間 09/07 04:35 抵達。", tag: "機上" }
      ],
      transport: { duration: "跨夜飛行約 8 小時 45 分", steps: ["桃園機場 T2", "阿聯酋航空 EK 367", "杜拜機場 T3"], note: "航點時間為當地時間；登機證條碼離線存於 App。" }, places: [], note: "登機證 49C 已入庫；第一段行程以長途飛行休息為主。"
    },
    "09-07": {
      date: "2026/09/07", weekday: "週一", city: "杜拜 → 哥本哈根 → Malmö", cityKey: "malmo", title: "抵達北歐，入住 Malmö", summary: "杜拜轉機後搭乘 EK 151 抵達哥本哈根，直接搭火車跨海前往 Malmö，搭 Bus 9 入住 First Camp Sibbarp。", stay: "First Camp Sibbarp-Malmö", tone: "teal",
      schedule: [
        { time: "04:35 - 08:20", icon: "✈", title: "杜拜 T3 轉機 (EK 151)", detail: "抵達杜拜 T3 後過轉機安檢，08:20 搭乘 EK 151 飛往哥本哈根；座位 25H（走道，Group 4，07:20 登機），出示電子登機證條碼登機。", tag: "轉機", ticketId: "ek367-boarding-pass" },
        { time: "13:15 - 14:15", icon: "⌖", title: "抵達哥本哈根機場 T3、入境與領行李", detail: "抵達 CPH T3 後辦理入境查驗並領取 20 kg 托運行李，順指標前往火車站月台。", tag: "入境" },
        { time: "14:15 - 14:35", icon: "🚆", title: "CPH Airport → Hyllie Station", detail: "使用 Skånetrafiken 購買跨境車票，搭乘 Øresundståg 跨越厄勒海峽大橋抵達瑞典 Hyllie。", tag: "跨海" },
        { time: "14:35 - 15:30", icon: "🚌", title: "Hyllie → Bus 9 → First Camp 周邊", detail: "Hyllie 車站外轉乘 Bus 9 直達營區附近（Götgatan），可先採買未來數日小木屋料理食材與生活用品。", tag: "公車" },
        { time: "18:00 - 19:00", icon: "⌂", title: "辦理入住與領取小木屋鑰匙 (First Camp)", detail: "已約定 18:00 - 19:00 抵達辦理入住（15:00 起開放接待）；出示預訂憑證領取小木屋鑰匙，安頓行李並熟悉廚房設施，傍晚可在 Sibbarp 水岸散步放鬆。", tag: "入住", ticketId: "first-camp" }
      ],
      transport: { duration: "轉機、飛行與跨海交通約 15 小時", steps: ["杜拜 T3 轉機", "EK 151 → 哥本哈根 T3", "Øresundståg → Hyllie", "Bus 9 → First Camp Sibbarp"], note: "跨海火車班次密集，出站後以 Skånetrafiken App 購票最方便。" }, places: [], note: "抵達日不排密集景點，以順利入住與調整時差為主。"
    },
    "09-08": {
      date: "2026/09/08", weekday: "週二", city: "Malmö", cityKey: "malmo", title: "馬爾默城堡、水族館與科技海事館", summary: "上午 09:50 出發，使用 K7 通行證與一日聯票參觀 Malmöhus Castle 與科技海事館，下午逛市場與城堡花園。", stay: "First Camp Sibbarp-Malmö", tone: "plum",
      schedule: [
        { time: "09:50 - 10:35", icon: "▸", title: "First Camp → Bus 9 → Malmö C", detail: "從住宿步行至 Götgatan 搭 Bus 9，前往 Malmö C，預留步行到城堡的時間。", tag: "出發" },
        { time: "10:35 - 11:00", icon: "→", title: "步行至 Malmöhus Castle", detail: "從車站步行約 14 分鐘抵達城堡入口，剛好銜接 11:00 開館。", tag: "步行" },
        { time: "11:00 - 13:00", icon: "♜", title: "Malmöhus Castle、水族館與美術館", detail: "出示 K7 通行證（18 到 27 歲免費）或購買 Kombibiljett（100 SEK），參觀城堡歷史展、水族館與藝術館。", tag: "景點", ticketId: "k7-pass" },
        { time: "13:00 - 14:00", icon: "🍴", title: "Malmö Saluhall 市場午餐", detail: "步行至市場大廳，各攤位自選午餐與咖啡，休息補充體力。", tag: "午餐" },
        { time: "14:05 - 16:30", icon: "⚙", title: "Teknikens och Sjöfartens hus (科技海事館)", detail: "使用同張一日聯票參觀科技館、交通工具、蒸氣機展與 U3 潛水艇。", tag: "景點", ticketId: "k7-pass" },
        { time: "16:35 - 17:30", icon: "♧", title: "Slottsträdgården 城堡花園散步", detail: "閉館後漫步於城堡外圍運河與風車花園，欣賞北歐園藝造景。", tag: "散步" },
        { time: "17:30 - 18:30", icon: "⌂", title: "返回 First Camp Sibbarp", detail: "從市中心搭乘 Bus 9 或原路返回住宿，準備明日行程。", tag: "回程" }
      ],
      transport: { duration: "市區參觀與交通約 8 小時；市區步行約 4 到 5 公里", steps: ["First Camp", "Bus 9 → Malmö C", "步行 → Malmöhus Castle", "步行 → Saluhall 午餐", "步行 → 科技海事館", "步行 → 城堡花園", "Bus 9 回住宿"], note: "Malmöhus 與科技館步行僅 5 分鐘，同一張聯票當日皆可進入。" }, places: ["malmohus", "tekniken", "saluhall", "lilla"], note: "18 到 27 歲可直接使用 K7 通行證免費入場，同行者現場購買 100 SEK 聯票。"
    },
    "09-09": {
      date: "2026/09/09", weekday: "週三", city: "Malmö → Copenhagen → Malmö", cityKey: "transfer", title: "Experimentarium 互動科學中心與西港區", summary: "個人主行程：上午跨海前往哥本哈根 Experimentarium 體驗互動科學，傍晚返回 Malmö 在旋轉大樓與西港區會合。", stay: "First Camp Sibbarp-Malmö", tone: "teal",
      schedule: [
        { time: "07:50 - 08:30", icon: "▸", title: "First Camp → Bus 9 → Hyllie Station", detail: "從住宿出發搭 Bus 9 前往 Hyllie 車站。", tag: "出發" },
        { time: "08:30 - 09:15", icon: "🚆", title: "Hyllie → Øresundståg → København H", detail: "搭乘跨海列車抵達哥本哈根中央車站。", tag: "跨海" },
        { time: "09:15 - 09:40", icon: "↔", title: "København H → S-tog → Hellerup Station", detail: "在中央車站轉乘 S-tog 前往 Hellerup。", tag: "S-tog" },
        { time: "09:40 - 09:55", icon: "🚌", title: "Hellerup → Bus 164／步行 → Experimentarium", detail: "轉乘公車或步行抵達互動科學中心。", tag: "接駁" },
        { time: "09:55 - 15:45", icon: "🔬", title: "Experimentarium 互動科技體驗", detail: "包含港口物流模擬、光之迷宮、人體探索、泡泡館與頂樓展區，中午於館內用餐。", tag: "體驗" },
        { time: "15:45 - 17:15", icon: "🚆", title: "Hellerup → København H → Malmö C", detail: "搭乘 S-tog 與跨海列車返回瑞典 Malmö C。", tag: "跨海" },
        { time: "17:30 - 18:15", icon: "🏙", title: "Turning Torso 旋轉大樓", detail: "在西港區與朋友會合，欣賞地標建築外觀。", tag: "會合" },
        { time: "18:15 - 19:00", icon: "🌊", title: "Västra Hamnen 濱水散步", detail: "沿海港長堤散步，欣賞當代住宅設計與夕陽海景。", tag: "散步" },
        { time: "19:00 - 20:30", icon: "🍴", title: "Malmö 市區晚餐", detail: "市區挑選餐廳聚餐，支持感應刷卡支付。", tag: "晚餐" },
        { time: "20:30 後", icon: "⌂", title: "返回 First Camp Sibbarp", detail: "搭乘公車或計程車返回營地，準備明日 ECCV 主會議。", tag: "回程" }
      ],
      transport: { duration: "跨國交通與市區移動約 13 小時", steps: ["Bus 9 → Hyllie", "Øresundståg → København H", "S-tog → Hellerup", "Bus 164 → Experimentarium", "原路返回 Malmö C", "步行至 Turning Torso／西港", "公車回住宿"], note: "出發前以 Skånetrafiken 複查跨海班次；Hellerup 到科學館步行約 15 分鐘。" }, places: ["experimentarium", "turning"], note: "此日為個人科學館主行程，傍晚接回團體步調節奏。"
    },
    "09-10": {
      date: "2026/09/10", weekday: "週四", city: "Malmö", cityKey: "malmo", title: "ECCV 2026：Poster #137 主會議日", summary: "今日重心為 ECCV 主會議、Expo 展區與 10:30 Poster Session 1 海報發表；早晨前往 Hyllie 領取實體識別證。", stay: "First Camp Sibbarp-Malmö", tone: "coral",
      schedule: [
        { time: "08:05 - 08:40", icon: "▸", title: "First Camp → Bus 9 → Hyllie 會場", detail: "搭乘 Bus 9 前往 Hyllie，步行至 Malmö Arena／Malmömässan 會場。", tag: "出發" },
        { time: "08:40 - 09:20", icon: "▣", title: "報到領取 Badge、確認 Poster #137 位置", detail: "現場櫃檯領取 physical badge，前往海報區確認 Poster #137 展板與設備。", tag: "報到" },
        { time: "09:20 - 10:15", icon: "✦", title: "Main Conference 主會議議程", detail: "參與開幕主題演講與論文口頭發表議程。", tag: "會議" },
        { time: "10:30 - 12:30", icon: "◎", title: "Poster Session 1・Poster #137 發表", detail: "Fast and Compact 3D Gaussian Splatting with Polarized Opacity Prior 海報解說與學術交流。", tag: "發表" },
        { time: "12:30 - 17:30", icon: "⚡", title: "午餐、Main Conference 與 Expo 展覽", detail: "會場交流、參觀產業贊助攤位與聆聽各主題 Oral/Poster session。", tag: "會議" },
        { time: "17:30 後", icon: "🍴", title: "晚餐與返回 First Camp", detail: "在 Hyllie 或市區晚餐，搭乘 Bus 9 回住宿休息。", tag: "回程" }
      ],
      transport: { duration: "住宿至會場約 25 到 35 分鐘", steps: ["First Camp", "Bus 9 → Hyllie", "步行至會場 Malmömässan", "Bus 9 原路返回"], note: "會場位於 Hyllie 車站步行 3 分鐘範圍。" }, places: ["eccv"], note: "Poster Session 1 於 10:30 CEST 開始，請攜帶海報與相關備份檔案。"
    },
    "09-11": {
      date: "2026/09/11", weekday: "週五", city: "Copenhagen", cityKey: "copenhagen", title: "DAC 建築中心、克里斯蒂安堡宮、圓塔與 Tivoli 週五夜", summary: "09:15 從馬爾默搭火車至哥本哈根中央車站，沿水岸走訪 DAC 與 BLOX Slide 巨型溜滑梯、克里斯蒂安堡宮與老城午餐，午後登圓塔俯瞰老城、漫步 Strøget 購物街，傍晚 18:30 進入 Tivoli 花園欣賞復古燈景與週五音樂派對。", stay: "First Camp Sibbarp-Malmö", tone: "gold",
      reservationReminder: { countdown: "距離 09/14 還有 3 天", title: "開始留意巴黎聖母院免費預約", detail: "官方免費時段通常在前一兩天或當天釋出；今日先確認官方預約入口，目標鎖定 16:30 左右時段。", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets", cta: "查看官方免費預約" },
      schedule: [
        { time: "09:15 - 10:00", icon: "🚆", title: "馬爾默 ➔ 哥本哈根中央車站", detail: "搭乘跨海火車抵達中央車站，出站後沿著水岸散步約 12 分鐘至 BLOX 大樓。", tag: "交通" },
        { time: "10:00 - 11:30", icon: "♜", title: "丹麥建築中心 (DAC @ BLOX)", detail: "憑 K7 通行證免費入場（0 元）：參觀丹麥港灣永續建築展、體驗 4 層樓高（15 公尺長）BLOX Slide 室內巨型溜滑梯、港灣露台拍照。", tag: "景點", ticketId: "k7-pass" },
        { time: "11:45 - 13:00", icon: "♜", title: "克里斯蒂安堡宮", detail: "憑 K7 通行證免費入場（0 元）：步行 5 分鐘過橋即達，參觀金碧輝煌的皇家接待廳（Great Hall）與現代編織壁毯。", tag: "景點", ticketId: "k7-pass" },
        { time: "13:00 - 14:15", icon: "🍴", title: "老城區午餐", detail: "於克里斯蒂安堡宮周邊享用傳統 Smørrebrød（如 1910 年百年老字號 Slotskælderen hos Gitte Kik）或前往圓塔旁的 Paludan Bog & Café 文藝咖啡館。", tag: "午餐" },
        { time: "14:30 - 15:30", icon: "◎", title: "圓塔 (Rundetaarn)", detail: "憑 K7 通行證免費入場（0 元）：走平緩的螺旋斜坡登頂，360 度俯瞰哥本哈根老城區紅瓦屋頂。", tag: "景點", ticketId: "k7-pass" },
        { time: "15:30 - 17:30", icon: "→", title: "Strøget 徒步街漫遊購物", detail: "從圓塔走回 Strøget：逛 HAY House、Illums Bolighus、LEGO 旗艦店，一路向西南漫步走向市政廳廣場。", tag: "逛街" },
        { time: "17:30 - 18:30", icon: "🍴", title: "市政廳廣場周邊晚餐 / 小歇", detail: "在市政廳廣場周邊享用晚餐與休息小歇，準備進入趣伏里，儲備夜晚體力。", tag: "晚餐" },
        { time: "18:30 - 21:45", icon: "✦", title: "趣伏里公園 (已購票)", detail: "步行過馬路即達：欣賞傍晚至天黑後 10 萬盞復古燈景，感受週五 Fredagsrock 露天音樂派對。", tag: "夜景" },
        { time: "22:00 - 22:45", icon: "🚆", title: "哥本哈根中央車站搭火車回馬爾默", detail: "出公園正門過馬路即進中央車站月台，搭乘跨海列車約 35 分鐘回住宿。", tag: "跨海" }
      ],
      transport: { duration: "日間行程約 13.5 小時；以中央車站為起迄形成逆時針精華環線", steps: ["Malmö C ➔ København H", "水岸散步 ➔ DAC @ BLOX", "過橋步行 ➔ 克里斯蒂安堡宮", "老城午餐 ➔ 圓塔", "Strøget 步行街 ➔ 市政廳廣場", "步行過馬路 ➔ 趣伏里公園", "中央車站火車回 Malmö"], note: "中央車站為起迄點；10:00 DAC、11:45 宮殿、14:30 圓塔、18:30 Tivoli 與 22:00 回程為關鍵時間節點。" }, places: ["dac", "christiansborg", "roundtower", "stroget", "tivoli"], note: "DAC、克里斯蒂安堡宮接待廳與圓塔均憑 K7 文化通行證免費入場；Tivoli 已購票預計 18:30 入園。"
    },
    "09-12": {
      date: "2026/09/12", weekday: "週六", city: "Copenhagen → Beauvais", cityKey: "transfer", title: "大理石教堂、衛兵交接、運河船與救主堂", summary: "退房後先將托運行李送至 CPH 機場寄放（方案 B），走訪大理石教堂、衛兵交接、新港與運河船，登救主堂後搭 M2 直達機場搭乘 FR9267。", stay: "Hostellerie Saint Vincent Beauvais Aéroport", tone: "plum",
      reservationReminder: { countdown: "距離 09/14 還有 2 天", title: "留意聖母院 16:30 免費時段釋出", detail: "官方可能開始釋出 09/14 名額；若有 16:15 到 16:45 之間的時段即可直接領取。", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets", cta: "前往官方免費預約" },
      schedule: [
        { time: "08:00 - 08:45", icon: "☼", title: "早餐、退房與行李整理", detail: "完成行李打包封箱；依訂房規定完成小木屋自行清潔（或付費清潔），11:00 前需退房，08:45 離開營區出發。", tag: "退房", ticketId: "first-camp" },
        { time: "08:45 - 09:05", icon: "↗", title: "First Camp → Malmö C", detail: "搭乘 Bus 9 或叫車前往 Malmö C。", tag: "交通" },
        { time: "09:05 - 09:35", icon: "🚆", title: "Malmö C → CPH Airport (直達)", detail: "搭乘 Re 1041 / Øresundståg 直達哥本哈根機場車站。", tag: "跨海" },
        { time: "09:35 - 10:15", icon: "▣", title: "CPH 機場行李寄放 (主方案 B)", detail: "於 Terminal 3 旁 P4/P7A 置物櫃寄放四件托運箱；隨身帶護照、電腦與小包。搭 M2 進市區轉 M3 到大理石教堂。", tag: "寄物" },
        { time: "10:45 - 11:35", icon: "♜", title: "Marmorkirken 大理石教堂", detail: "免費參觀巴洛克式挑高大圓頂與教堂內部，11:35 步行前往阿馬林堡宮。", tag: "景點" },
        { time: "11:50 - 12:30", icon: "✦", title: "Amalienborg Palace 衛兵交接", detail: "在八角廣場就位，觀賞 12:00 皇家衛兵交接儀式（免費觀賞）。", tag: "儀式" },
        { time: "12:45 - 14:15", icon: "🍴", title: "Nyhavn 新港 ＋ 國王新廣場午餐", detail: "新港運河邊欣賞彩色街屋，選餐廳享用午餐並拍照。", tag: "午餐" },
        { time: "14:15 - 15:00", icon: "→", title: "Nyhavn 3 號碼頭報到候船", detail: "步行至 Nyhavn 3 碼頭，14:45 前排隊準備登船。", tag: "報到" },
        { time: "15:00 - 16:00", icon: "≈", title: "Stromma Classic Canal Tour 運河遊船", detail: "出示票券 QR 碼登船，搭乘一小時經典航線遊覽市區運河景點。", tag: "遊船", ticketId: "stromma-canal-tour" },
        { time: "16:00 - 16:30", icon: "↗", title: "步行前往 Christianshavn 救主堂", detail: "下船後步行約 20 分鐘跨橋前往救主堂。", tag: "步行" },
        { time: "16:30 - 17:15", icon: "♜", title: "Church of Our Saviour 螺旋尖塔登頂", detail: "16:30 依預約時段登頂金色螺旋梯，俯瞰哥本哈根全景；最晚 17:15 離塔。", tag: "景點", ticketId: "church-our-saviour" },
        { time: "17:15 - 18:00", icon: "✈", title: "Christianshavn → M2 → CPH 取行李", detail: "從教堂步行至 Christianshavn 站，搭 M2 直達機場，至 P4/P7A 取件後前往 T2 辦理托運。", tag: "地鐵" },
        { time: "18:00 - 20:05", icon: "✈", title: "機場 Check-in、安檢 → FR9267 起飛", detail: "18:00 前抵達 T2 完成托運與安檢；FR9267 於 20:05 起飛、22:00 抵達 Beauvais。", tag: "航班", ticketId: "ryanair-fr9267" },
        { time: "22:00 - 22:45", icon: "⌂", title: "抵達 Beauvais、計程車入住旅館", detail: "領取托運行李後搭計程車前往 Hostellerie Saint Vincent，早起搭車進巴黎。", tag: "住宿" }
      ],
      transport: { duration: "全日交通與景點約 11 小時；下午由 Christianshavn 搭 M2 直達機場", steps: ["First Camp → Malmö C", "Re 1041 → CPH 機場寄放行李", "M2 → M3 → 大理石教堂", "步行 → 阿馬林堡宮", "步行 → 新港遊船", "步行 → 救主堂", "M2 直達 CPH 機場", "FR9267 飛往 Beauvais"], note: "方案 B 先在機場寄放行李，下午從救主堂搭 M2 直達機場，免回市中心折返。" }, places: ["marmorkirken", "amalienborg", "nyhavn", "kongensnytorv", "canal", "saviour"], note: "15:00 運河船後接 16:30 救主堂，最晚 17:15 離塔銜接 M2 與 20:05 航班。"
    },
    "09-13": {
      date: "2026/09/13", weekday: "週日", city: "Beauvais → Paris", cityKey: "paris", title: "TER 進巴黎，蒙馬特高地深度漫遊與聖心堂", summary: "搭乘 09:40 直達 TER 前往巴黎北站，飯店寄放行李後前往蒙馬特享用法式午餐，午後漫步愛牆、小丘廣場畫家村、聖心堂與後山葡萄園。", stay: "Sure Hotel by Best Western Paris Gare du Nord", tone: "plum",
      reservationReminder: { countdown: "明天 09/14 就要使用", title: "今日務必確認聖母院免費預約", detail: "抵達巴黎後檢查官方預約頁面，優先預約 16:30 左右時段；若無名額明天亦可現場排隊。", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets", cta: "檢查官方預約時段" },
      schedule: [
        { time: "08:30 - 09:05", icon: "☼", title: "退房與叫車出發", detail: "08:30 起床整理隨身物品並退房，09:05 叫車前往 Beauvais SNCF 火車站。", tag: "出發" },
        { time: "09:05 - 09:25", icon: "↗", title: "計程車 → Beauvais SNCF 車站", detail: "車程約 10 到 15 分鐘，09:25 前抵達月台準備搭車。", tag: "交通" },
        { time: "09:40 - 10:59", icon: "🚆", title: "TER C17 直達 Paris Nord (巴黎北站)", detail: "搭乘已購 09:40 直達 TER 火車進巴黎，約 1 小時 19 分抵達巴黎北站。", tag: "火車" },
        { time: "11:00 - 11:25", icon: "⌂", title: "巴黎飯店寄放行李／若有空房先入住", detail: "步行至 Sure Hotel 寄放四件行李，若房間已備妥則先辦理入住。", tag: "住宿" },
        { time: "11:30 - 13:00", icon: "🍴", title: "La Chapelle → M2 → Anvers 或周邊法式午餐", detail: "搭乘 M2 至 Anvers 站或於蒙馬特山腳／飯店周邊餐廳享用法式午餐，悠閒開啟巴黎首日行程。", tag: "午餐" },
        { time: "13:00 - 14:30", icon: "♧", title: "愛牆、穿牆人雕塑與小丘廣場畫家村", detail: "從 Abbesses 站旁愛牆（Le Mur des Je t'aime）漫步，走訪小丘廣場（Place du Tertre）街頭畫家村與藝術氛圍。", tag: "街區" },
        { time: "14:30 - 16:30", icon: "♜", title: "Sacré-Cœur 聖心堂參觀與階梯俯瞰全景", detail: "免費入內參觀聖心堂莊嚴穹頂與馬賽克壁畫，於教堂前階梯眺望巴黎市區開闊天際線。", tag: "景點" },
        { time: "16:30 - 17:30", icon: "◎", title: "蒙馬特後山葡萄園與粉紅之家漫步", detail: "漫步至聖心堂後方的蒙馬特葡萄園（Clos Montmartre）與知名的粉紅之家（La Maison Rose），享受悠閒的高地石板步道。", tag: "散步" },
        { time: "17:30 - 18:15", icon: "⌂", title: "Anvers → M2 → La Chapelle → 飯店", detail: "搭乘地鐵 M2 返回飯店，正式辦理 Check-in 入住房間整理休息。", tag: "回程" }
      ],
      transport: { duration: "Beauvais 至巴黎市區約 1 小時 20 分；市區搭乘 M2 直達", steps: ["Beauvais 飯店", "Taxi → Beauvais SNCF", "09:40 TER C17 → Paris Nord", "飯店寄行李", "M2 → Anvers / 蒙馬特", "愛牆・小丘廣場・聖心堂・後山葡萄園", "M2 回飯店"], note: "搭乘 09:40 TER 進巴黎，下午專注蒙馬特高地單一街區，動線順暢不趕場。" }, places: ["sacre"], note: "加尼葉歌劇院暫時取消內部參觀；聖心堂免費參觀，飯店上午先寄放行李。"
    },
    "09-14": {
      date: "2026/09/14", weekday: "週一", city: "Paris", cityKey: "paris", title: "拉丁區雙路線，聖徒禮拜堂與聖母院", summary: "上午從盧森堡公園向北漫步拉丁區；13:00 分為 A 古監獄與 B 咖啡兩組，14:30 集合參觀聖徒禮拜堂彩繪玻璃與巴黎聖母院。", stay: "Sure Hotel by Best Western Paris Gare du Nord", tone: "plum",
      schedule: [
        { time: "08:20 - 08:45", icon: "▸", title: "Gare du Nord → RER B → Luxembourg", detail: "從巴黎北站搭乘 RER B 直達盧森堡公園，全日一路向北漫步。", tag: "出發" },
        { time: "08:45 - 09:45", icon: "♧", title: "Jardin du Luxembourg 盧森堡公園", detail: "晨間漫步於法式幾何花園與綠蔭長椅間，感受左岸氛圍。", tag: "花園" },
        { time: "09:45 - 10:15", icon: "→", title: "步行至 Panthéon 先賢祠外觀", detail: "沿 Rue Soufflot 向東，欣賞先賢祠莊嚴新古典圓頂外觀。", tag: "外觀" },
        { time: "10:15 - 11:15", icon: "◎", title: "Latin Quarter：索邦大學與左岸街道", detail: "經索邦大學慢步走向 Saint-Michel，沿途探索書店與左岸巷弄。", tag: "街區" },
        { time: "11:15 - 12:15", icon: "🍴", title: "Latin Quarter 拉丁區午餐", detail: "於左岸小館享用午餐，12:15 前往西岱島。", tag: "午餐" },
        { time: "12:15 - 13:00", icon: "→", title: "Saint-Michel → Île de la Cité (西岱島)", detail: "跨越塞納河前往西岱島，確認分組動線與 15:00 門票。", tag: "集合準備" },
        { time: "13:00 - 14:30", icon: "⑂", title: "A 古監獄／B 咖啡 雙路線分流", detail: "A 組參觀 Conciergerie 古監獄（約 65 分鐘）；B 組於島上或河畔咖啡館休息。兩組於 14:30 回到禮拜堂入口集合。", tag: "雙路線" },
        { time: "14:30 - 15:00", icon: "票", title: "兩組會合與 Sainte-Chapelle 安檢排隊", detail: "於 10 Boulevard du Palais 遊客入口集合，排隊進行司法宮安檢。", tag: "安檢" },
        { time: "15:00 - 16:05", icon: "◇", title: "Sainte-Chapelle 聖徒禮拜堂", detail: "出示票券 QR 碼入場，登上二樓欣賞 15 扇高聳璀璨的彩繪玻璃窗。", tag: "景點", ticketId: "sainte-chapelle" },
        { time: "16:05 - 16:25", icon: "→", title: "步行前往 Notre-Dame de Paris (巴黎聖母院)", detail: "沿西岱島向東步行約 8 分鐘抵達聖母院正門廣場。", tag: "步行" },
        { time: "16:30 - 17:30", icon: "♜", title: "Cathédrale Notre-Dame de Paris 參觀", detail: "憑官方免費預約時段入場，參觀重建後的聖母院中殿與玫瑰窗。", tag: "景點" },
        { time: "17:30 - 18:05", icon: "↩", title: "Saint-Michel-Notre-Dame → RER B → Gare du Nord", detail: "從聖母院旁搭 RER B 直達巴黎北站返回住宿。", tag: "回程" }
      ],
      splitPlan: {
        title: "13:00 分兩組，14:30 同一入口集合",
        detail: "上午共同漫步拉丁區；下午短暫分開 90 分鐘，15:00 禮拜堂與 16:30 聖母院重新一同參觀。",
        meeting: "14:30・Sainte-Chapelle 遊客入口（10 Boulevard du Palais）",
        branches: [
          {
            id: "conciergerie", label: "A 路線", title: "Conciergerie", badge: "聯票待購", tone: "plum",
            steps: [
              { time: "13:00 - 13:20", title: "前往古監獄並完成安檢", detail: "抵達 Conciergerie 入口完成安檢進館。" },
              { time: "13:20 - 14:25", title: "古監獄重點參觀", detail: "約 65 分鐘參觀哥德式衛兵大廳與瑪麗王后囚室歷史展區。" },
              { time: "14:25 - 14:30", title: "離館步行至集合點", detail: "14:25 離館前往 Sainte-Chapelle 入口集合。" }
            ],
            note: "A 組購買 Conciergerie＋Sainte-Chapelle 聯票，選定 15:00 禮拜堂時段。",
            url: "https://www.sainte-chapelle.fr/en/visit/frequently-asked-questions", cta: "官方聯票規則"
          },
          {
            id: "coffee", label: "B 路線", title: "咖啡與 Île de la Cité", badge: "單館票待購", tone: "teal",
            steps: [
              { time: "13:00 - 13:50", title: "西岱島／Saint-Michel 咖啡館小憩", detail: "挑選舒適咖啡館坐下休息品嚐甜點。" },
              { time: "13:50 - 14:20", title: "多菲娜廣場與花市漫步", detail: "漫步 Place Dauphine 或巴黎花市，感受島上悠閒氣氛。" },
              { time: "14:20 - 14:30", title: "回到禮拜堂入口集合", detail: "提前回到 10 Boulevard du Palais 與 A 組會合。" }
            ],
            note: "B 組購買 Sainte-Chapelle 15:00 單館票；重點為放鬆休息。"
          }
        ]
      },
      transport: { duration: "市區步行約 5 到 6 公里；去回程皆搭乘 RER B", steps: ["Gare du Nord → RER B → Luxembourg", "步行 → 盧森堡公園 → 先賢祠 → 索邦大學", "拉丁區午餐 → 聖米歇爾 → 西岱島", "A：古監獄／B：島上咖啡 → 14:30 集合", "15:00 聖徒禮拜堂 → 16:30 巴黎聖母院", "Saint-Michel-Notre-Dame → RER B → 巴黎北站"], note: "由南向北單向步行；13:00 到 14:30 分流，14:30 集合後行程一致。" }, places: ["latin", "sainte", "notre"], note: "Sainte-Chapelle 目標 15:00 時段；聖母院 16:30 免費預約前一兩天確認。"
    },
    "09-15": {
      date: "2026/09/15", weekday: "週二", city: "Paris", cityKey: "paris", title: "軍事博物館分流、艾菲爾鐵塔全員合照、天鵝島與雪鐵龍公園熱氣球", summary: "上午分流：同行者參觀軍事博物館與拿破崙墓，個人逛樂蓬馬歇百貨；中午全員會合享用肉類午餐，午後同遊艾菲爾鐵塔、特羅卡德羅露台拍鐵塔全景，漫步鋼構橋至天鵝島看自由女神，逛博格內爾商場並搭乘雪鐵龍公園熱氣球，19:00 享用 Francette 景觀晚餐。", stay: "Sure Hotel by Best Western Paris Gare du Nord", tone: "teal",
      schedule: [
        { time: "08:45 - 09:45", icon: "▸", title: "飯店 → 分流出發（軍博組 M4＋M8／百貨組 M4）", detail: "同行者搭 M4 轉 M8 前往榮軍院（La Tour-Maubourg 站）；個人搭 M4 直達 Saint-Placide 站步行至樂蓬馬歇百貨。", tag: "出發" },
        { time: "10:00 - 12:15", icon: "♜", title: "分流時段：軍事博物館拿破崙墓 vs 樂蓬馬歇百貨鋼構中庭", detail: "同行者參觀軍事博物館古代盔甲與拿破崙一世陵墓；個人於樂蓬馬歇百貨欣賞 Eiffel 操刀的鋼構玻璃中庭、吹冷氣逛 La Grande Épicerie 頂級食品館。", tag: "分流" },
        { time: "12:30 - 13:45", icon: "🍴", title: "戰神廣場周邊全員會合與法式牛排午餐", detail: "兩組搭車至 École Militaire 站會合，於周邊法式餐館享用炙烤牛排／肉類排餐，避開海鮮，補充體力。", tag: "午餐" },
        { time: "13:45 - 15:15", icon: "✦", title: "Eiffel Tower 鐵塔地面合照 ➔ Place du Trocadéro 景觀露台", detail: "四人穿過戰神廣場，於鐵塔正下方仰拍鋼構力學細節（不登塔免排隊）；隨後步行穿過耶拿橋登上特羅卡德羅觀景露台，拍下無遮蔽的經典鐵塔全景大合照。", tag: "景點" },
        { time: "15:15 - 16:30", icon: "→", title: "Pont de Bir-Hakeim 鋼構橋 ➔ 天鵝島自由女神像", detail: "從特羅卡德羅向西南漫步至比爾哈凱姆雙層鋼架橋，走下天鵝島中央林蔭步道（Allée des Cygnes），散步至島端與 1889 年原版青銅自由女神像合照。", tag: "散步" },
        { time: "16:30 - 17:30", icon: "◎", title: "Beaugrenelle Paris 現代商場 ＋ Fnac 旗艦店", detail: "過格勒納勒橋直達現代綠能鋼構商場，全員於室內吹冷氣小憩，逛大型 Fnac 旗艦店挑選 3C 科技配件與設計選品。", tag: "商場" },
        { time: "17:30 - 18:30", icon: "✦", title: "Parc André Citroën・搭乘 Ballon de Paris 升空熱氣球", detail: "步行或搭 RER C 1 站前往雪鐵龍公園，搭乘全球最大繫留氦氣球垂直升空 150 公尺（約 50 層樓高），空中俯瞰巴黎全景與遠眺鐵塔（現場視天候風速購票，每人約 20 歐元）。", tag: "體驗" },
        { time: "18:30 - 19:00", icon: "🚆", title: "Pont du Garigliano → RER C → Champ de Mars（碼頭集合）", detail: "搭乘 RER C 直達 Champ de Mars Eiffel Tower 站（車程僅 6 分鐘），步行 5 分鐘抵達 Port de Suffren 碼頭。", tag: "交通" },
        { time: "19:00 - 21:00", icon: "🍴", title: "Francette 水上景觀餐廳晚餐", detail: "停泊於鐵塔旁的塞納河船上餐廳，已預訂 4 位，近距離欣賞鐵塔點燈夜景與塞納河水岸風光。", tag: "預約" },
        { time: "21:00 後", icon: "↗", title: "返回巴黎北站住宿", detail: "搭乘計程車或地鐵返回飯店休息。", tag: "回程" }
      ],
      transport: { duration: "市區漫步約 5 到 6 公里；搭配 RER C 與地鐵串聯", steps: ["巴黎北站出發分流（軍博組 M4+M8 / 百貨組 M4）", "12:30 戰神廣場周邊會合午餐", "步行 → 艾菲爾鐵塔 ➔ 特羅卡德羅露台（四人合照）", "步行 → 比爾哈凱姆橋 ➔ 天鵝島自由女神", "步行 → 博格內爾商場（Fnac 科技選品）", "步行／RER C → 雪鐵龍公園熱氣球", "RER C 直達 → Champ de Mars → 碼頭", "19:00 Francette 晚餐 → 計程車／地鐵回飯店"], note: "上午分流、中午會合；下午四人全程同行，由特羅卡德羅向西南一路延伸至雪鐵龍公園，19:00 Francette 晚餐為終點。" }, places: ["army", "bonmarche", "eiffel", "trocadero", "birhakeim", "cygnes", "beaugrenelle", "ballon", "francette"], note: "Francette 為固定泊靠於 Port de Suffren 的餐廳，已預約 19:00（4 位）。"
    },
    "09-16": {
      date: "2026/09/16", weekday: "週三", city: "Paris", cityKey: "paris", title: "凱旋門 10:50 登頂，香榭麗舍一路進羅浮宮", summary: "上午 10:50 登頂凱旋門，漫步香榭麗舍大道、協和廣場與杜樂麗花園；16:00 抵達金字塔報到排隊，16:30 依票面參觀羅浮宮至 20:30。", stay: "Sure Hotel by Best Western Paris Gare du Nord", tone: "gold",
      schedule: [
        { time: "09:40 - 10:20", icon: "▸", title: "飯店 → M2 → Charles de Gaulle-Étoile", detail: "搭乘地鐵 M2 直達戴高樂星形廣場站，走地下通道直通凱旋門入口。", tag: "出發" },
        { time: "10:20 - 10:50", icon: "票", title: "凱旋門地下入口報到與安檢", detail: "門票指定時間為 10:50；提前於地下入口排隊驗票與安檢。", tag: "安檢" },
        { time: "10:50 - 12:00", icon: "⌁", title: "Arc de Triomphe 凱旋門登頂", detail: "出示票券 QR 碼入場並登上頂樓，眺望十二條放射狀大道與巴黎城市軸線。", tag: "景點", ticketId: "arc-de-triomphe" },
        { time: "12:00 - 13:00", icon: "→", title: "Champs-Élysées 香榭麗舍大道漫步", detail: "沿大道向東漫步，欣賞經典街景與沿街旗艦店舖。", tag: "散步" },
        { time: "13:00 - 14:00", icon: "🍴", title: "香榭麗舍周邊午餐", detail: "於大道周邊餐館享用午餐，補充體力。", tag: "午餐" },
        { time: "14:00 - 14:30", icon: "◎", title: "Place de la Concorde 協和廣場", detail: "欣賞埃及盧克索方尖碑與噴泉，由西側進入杜樂麗花園。", tag: "地標" },
        { time: "14:30 - 15:15", icon: "♧", title: "Jardin des Tuileries 杜樂麗花園漫步", detail: "沿中軸線漫步，於綠色躺椅旁感受法式花園的開闊悠閒。", tag: "花園" },
        { time: "15:15 - 15:55", icon: "☕", title: "花園周邊咖啡甜點小憩", detail: "於花園或羅浮宮周邊享用咖啡與法式甜點，為晚間看展儲備體力。", tag: "休息" },
        { time: "16:00 - 16:30", icon: "票", title: "玻璃金字塔 16:00 報到排隊與安檢", detail: "票面預約為 16:30；16:00 準時抵達玻璃金字塔指定時段專用通道排隊安檢。", tag: "報到" },
        { time: "16:30 - 20:30", icon: "◇", title: "Musée du Louvre 羅浮宮晚間參觀", detail: "出示門票入場，週三延長開放至 21:00；參觀《蒙娜麗莎》、勝利女神、米洛維納斯與古典展廳，20:30 配合清場離館。", tag: "景點", ticketId: "louvre" },
        { time: "20:30 - 21:00", icon: "✦", title: "Cour Napoléon 拿破崙庭院與金字塔夜景", detail: "離館後在拿破崙庭院漫步，拍攝玻璃金字塔點燈夜景。", tag: "夜景" },
        { time: "21:00 後", icon: "↩", title: "回飯店與晚餐", detail: "搭乘地鐵 M1 到 Châtelet 轉 M4 返回巴黎北站住宿。", tag: "回程" }
      ],
      transport: { duration: "日間單向步行約 5 到 6 公里；晚間搭地鐵回程", steps: ["M2 → 凱旋門 (10:50 門票)", "步行 → 香榭麗舍大道", "步行 → 協和廣場 → 杜樂麗花園", "步行 → 羅浮宮 (16:30 門票)", "M1 轉 M4 回飯店"], note: "從凱旋門一路向東單向漫步至羅浮宮，不走回頭路。" }, places: ["arc", "champs", "tuileries", "louvre"], note: "凱旋門 10:50、羅浮宮 16:30 門票皆已確認，週三羅浮宮開放至 21:00。"
    },
    "09-17": {
      date: "2026/09/17", weekday: "週四", city: "Versailles", cityKey: "paris", title: "凡爾賽宮全日：主宮殿、花園與特里亞農宮苑", summary: "上午 10:00 依指定時段參觀凡爾賽主宮殿鏡廳與國王套房，午後漫步阿波羅噴泉花園與特里亞農宮苑。", stay: "Sure Hotel by Best Western Paris Gare du Nord", tone: "gold",
      schedule: [
        { time: "07:55 - 09:20", icon: "▸", title: "Gare du Nord → RER B＋RER C → 凡爾賽", detail: "07:55 出發，搭 RER B 到 Saint-Michel-Notre-Dame 轉 RER C 直達凡爾賽左岸站。", tag: "出發" },
        { time: "09:20 - 09:55", icon: "→", title: "步行至凡爾賽宮正門與排隊安檢", detail: "出站步行約 12 分鐘抵達 Place d’Armes，前往 10:00 指定時段通道排隊。", tag: "安檢" },
        { time: "10:00 - 12:30", icon: "♜", title: "Palace of Versailles 凡爾賽主宮殿參觀", detail: "出示 Passport 門票入場，依序參觀國王大套房、鏡廳（Hall of Mirrors）與王室禮拜堂。", tag: "景點", ticketId: "versailles" },
        { time: "12:30 - 13:30", icon: "🍴", title: "園區法式午餐", detail: "於宮殿或花園內餐飲區享用午餐，補充體力。", tag: "午餐" },
        { time: "13:30 - 15:30", icon: "♧", title: "Gardens of Versailles 凡爾賽花園漫步", detail: "沿大中軸線欣賞拉托娜噴泉、阿波羅噴泉與大運河風光。", tag: "花園" },
        { time: "15:30 - 17:30", icon: "♜", title: "Grand Trianon 與 Petit Trianon (特里亞農宮苑)", detail: "參觀大特里亞農宮粉紅大理石廊柱與小特里亞農宮；可搭乘園區小火車代步。", tag: "宮苑" },
        { time: "17:30 - 18:05", icon: "→", title: "返回 Versailles Château-Rive Gauche 車站", detail: "步行或搭乘接駁車離開園區，前往火車站。", tag: "回程" },
        { time: "18:05 - 19:30", icon: "↩", title: "RER C＋RER B → 返回巴黎北站住宿", detail: "搭乘 RER 返回巴黎市區，晚間於飯店周邊晚餐與整理行李。", tag: "回程" }
      ],
      transport: { duration: "單程車程約 1 小時 20 分；園區內步行範圍廣大", steps: ["Gare du Nord → RER B", "Saint-Michel-Notre-Dame → RER C", "凡爾賽宮左岸站", "步行 → 主宮殿 → 花園 → 特里亞農", "原路搭 RER 返回巴黎"], note: "凡爾賽園區廣闊，下午前往特里亞農宮苑可利用園區小火車節省體力。" }, places: ["versailles"], note: "已選定 Versailles 全日行程；含 10:00 指定入場時段之 Passport 全區門票。"
    },
    "09-18": {
      date: "2026/09/18", weekday: "週五", city: "Paris → CDG", cityKey: "transfer", title: "前往戴高樂機場，搭機返程", summary: "今日不安排市區景點，退房後搭乘 RER B 直達戴高樂機場 T2C，搭乘阿聯酋航空 EK 74 飛往杜拜。", stay: "機上", tone: "coral",
      schedule: [
        { time: "08:00 - 09:30", icon: "☼", title: "早餐與行李打包封箱", detail: "確認護照、免稅單據、機票資料與電子設備，完成行李打包。", tag: "準備" },
        { time: "10:30 - 11:00", icon: "↗", title: "退房出發前往巴黎北站", detail: "辦理退房手續，步行前往 Gare du Nord 火車站。", tag: "出發" },
        { time: "11:00 - 12:00", icon: "🚆", title: "Gare du Nord → RER B → CDG Airport T2", detail: "購買機場專用車票，搭乘 RER B 直達戴高樂機場第二航廈 TGV 站，步行至 Terminal 2C。", tag: "火車" },
        { time: "12:00 - 15:35", icon: "✈", title: "抵達 CDG T2C、退稅、托運與出境安檢", detail: "辦理海關退稅、行李托運與出境安檢；EK 74 於 15:35 起飛（起飛前 48 小時開放線上報到）。", tag: "報到" },
        { time: "15:35", icon: "✈", title: "EK 74 起飛前往杜拜 (座位 62C)", detail: "巴黎 CDG 15:35 起飛（台灣時間 21:35），飛行約 7 小時 35 分，預計 09/19 01:10 抵達杜拜。", tag: "航班" }
      ],
      transport: { duration: "市區至 CDG 機場約 1 小時", steps: ["飯店", "步行 → Gare du Nord", "RER B → Aéroport CDG 2 TGV", "步行至 Terminal 2C"], note: "需購買機場專用車票；提早 3.5 小時抵達以預留退稅與安檢時間。" }, places: [], note: "目標約 12:00 抵達機場航廈，預留充足退稅與托運緩衝。"
    },
    "09-19": {
      date: "2026/09/19", weekday: "週六", city: "回到台灣", cityKey: "travel", title: "杜拜轉機，平安返抵台北", summary: "杜拜轉機後搭乘阿聯酋航空 EK 366 飛回台灣桃園機場，圓滿完成 14 天北歐與巴黎旅程。", stay: "家中", tone: "coral",
      schedule: [
        { time: "01:10 - 04:05", icon: "✈", title: "杜拜 T3 轉機", detail: "抵達杜拜 T3 轉機區，前往 EK 366 登機門。", tag: "轉機" },
        { time: "04:05 - 16:35", icon: "✈", title: "EK 366 起飛飛往台北 (座位 47H)", detail: "杜拜 04:05 起飛（台灣時間 08:05），飛行約 8 小時 30 分，預計台灣時間 16:35 抵達桃園 T2。", tag: "航班" },
        { time: "16:35", icon: "⌂", title: "平安抵達台北桃園機場 T2", detail: "完成入境、領取托運行李與返家，旅程圓滿結束。", tag: "抵達" }
      ],
      transport: { duration: "轉機與飛行約 12 小時 30 分", steps: ["杜拜 T3 轉機", "EK 366", "桃園機場 T2"], note: "航點時間均為當地時間。" }, places: [], note: "旅程資料可持續儲存作為個人旅行紀錄與回憶。"
    }
  }
};

window.TRIP.placeDetails = {
  malmohus: { why: "城堡、水族館與藝術館都在同一館舍，配合同日的科技海事館最能完整使用 Malmö Museum 一日聯票。", booking: { state: "confirmed", label: "K7 通行證免費／現場聯票", note: "09/08 週二 11:00-17:00；18 到 27 歲出示 K7 通行證享全週免費入場。同行者現場購買 Kombibiljett（成人 100 SEK、學生 50 SEK），當日可進城堡、水族館、藝術館與科技館。", url: "https://malmo.se/Uppleva-och-gora/Konst-och-museer/Malmo-museum/Besok-Malmo-museum/Oppettider-och-entreavgifter.html", cta: "官方開放時間與票價" } },
  tekniken: { why: "科技、交通、U3 潛水艇與工程展項集中，是 Malmö 最符合科技偏好的一站，已包含在同日聯票。", booking: { state: "confirmed", label: "K7 通行證免費／包含於聯票", note: "09/08 週二 11:00-17:00；18 到 27 歲出示 K7 通行證免費入場；同行者使用同日 Kombibiljett。", url: "https://malmo.se/Uppleva-och-gora/Konst-och-museer/Malmo-museum/Besok-Malmo-museum/Oppettider-och-entreavgifter.html", cta: "官方開放時間與票價" } },
  saluhall: { why: "位在科技館往老城的步行軸線上，餐點選擇多，適合作為輕鬆午餐站。", booking: { state: "free", label: "免費入場", note: "市場不需門票，各攤位自選消費。" } },
  lilla: { why: "沒有固定參觀流程，能把抵達後的第一個下午留給咖啡、街景與放鬆。", booking: { state: "free", label: "免費・免預約", note: "公共廣場，可自由進出散步。" } },
  disgusting: { why: "將互動體驗、飲食文化與話題性結合，展覽形式特別。", booking: { state: "recommended", label: "門票・可先線上購票", note: "官方提供線上票，非強制預約，可現場或線上購買。", url: "https://disgustingfoodmuseum.com/buy-tickets-2/", cta: "官方線上購票" } },
  turning: { why: "以濱水散步欣賞 Malmö 當代地標建築與工業轉型社區。", booking: { state: "free", label: "外觀免費", note: "此行欣賞外觀與 Västra Hamnen 社區，不安排進塔。" } },
  eccv: { why: "本次旅程核心會議；9/10 專注主會議、Expo 與 Poster Session 發表。", booking: { state: "confirmed", label: "Registration: Paid", note: "Full Passport / Author Registration；實體 badge 於會場領取。" } },
  experimentarium: { why: "以動手操作與互動科學為核心，展區範圍較大，適合保留半天時間參觀。", booking: { state: "recommended", label: "門票・線上購票省 10%", note: "每日 09:30-17:00 開放；線上購票省 10%，指定日期有效，亦可現場購買。", url: "https://www.experimentarium.dk/plan-your-visit/", cta: "官方購票／開放時間" } },
  enigma: { why: "通訊、電信與數位社會主題集中，規模適合輕鬆參觀。", booking: { state: "onsite", label: "門票・可現場購票", note: "一般參觀無需事先預約，現場購票即可。", url: "https://www.enigma.dk/en/visit-enigma", cta: "官方票務資訊" } },
  nyhavn: { why: "容易與 Strøget、王宮區與運河遊船串接的哥本哈根經典地標。", booking: { state: "free", label: "免費・免預約", note: "港區散步免費；遊船搭乘請參考運河遊船票券。" } },
  kongensnytorv: { why: "鄰近新港，將午餐、皇家劇院與地鐵轉乘集中於同一節點。", booking: { state: "free", label: "免費・免預約", note: "公共廣場；周邊店家與地鐵依各自時間運作。" } },
  stroget: { why: "從市中心通往中央車站的步行街，沿途匯集北歐設計品牌與咖啡館。", booking: { state: "free", label: "免費・免預約", note: "公共步行街，各店舖依營業時間運作。" } },
  tivoli: { why: "以歷史花園、老式建築、10 萬盞復古燈景與週五 Fredagsrock 音樂會氣氛為主；鄰近中央車站方便返回 Malmö。", booking: { state: "confirmed", label: "已購・指定日入園票", note: "已購買 09/11 指定日入園票；預計 18:30 入園欣賞夜景與音樂派對，實際入場依票面 QR code，不含遊樂設施 Ride Pass。", url: "https://shop.tivoli.dk/en/billetter-og-tivolikort/entre?date=11-9-2026", cta: "官方指定日期購票" } },
  dac: { why: "憑 K7 通行證免費體驗 4 層樓高室內巨型溜滑梯（BLOX Slide）與港灣建築展，動線順路。", booking: { state: "confirmed", label: "K7 通行證免費", note: "09/11（週五）開放 10:00-18:00；18 到 27 歲青年出示 K7 通行證免費入場；體驗 BLOX Slide 與港灣露台。", url: "https://dac.dk/en/visit/", cta: "官方開放時間與參觀資訊" } },
  rosenborg: { why: "皇冠珠寶與王室宮殿集中在一座歷史城堡，適合了解丹麥王室歷史。", booking: { state: "confirmed", label: "K7 通行證免費／學生票 100 DKK", note: "09/11（週五）夏季開放 10:00-17:00；18 到 27 歲青年出示 K7 通行證享免費入場；同行者學生票為 100 DKK。", url: "https://denkongeligesamling.dk/en/rosenborg-castle/calendar/k7-seven-days-free-cultural-experiences-for-young-people", cta: "官方 K7 免費活動說明" } },
  torvehallerne: { why: "位於 Rosenborg 與圓塔附近，適合作為市中心散步路線的午餐站。", booking: { state: "free", label: "免費入場", note: "市場不需門票，各攤位自選消費。" } },
  roundtower: { why: "走平緩螺旋斜坡登頂 360 度俯瞰老城紅瓦屋頂，持 K7 通行證免費入場。", booking: { state: "confirmed", label: "K7 通行證免費", note: "09/11（週五）開放 10:00-20:00；18 到 27 歲青年出示 K7 通行證免費入場登頂（同行滿 28 歲者現場購買門票）。", url: "https://www.rundetaarn.dk/en/visit-us/", cta: "官方開放時間與規則" } },
  christiansborg: { why: "步行過橋即達，持 K7 通行證免費參觀金碧輝煌的皇家接待大廳與壁毯。", booking: { state: "confirmed", label: "K7 通行證免費", note: "09/11（週五）開放 10:00-17:00；18 到 27 歲青年出示 K7 通行證免費參觀皇家接待大廳（Royal Reception Rooms）。", url: "https://denkongeligesamling.dk/en/christiansborg-palace/plan-your-visit/", cta: "官方票務資訊" } },
  amalienborg: { why: "八角廣場、衛兵交接與大理石教堂形成完整的王宮景觀軸線。", booking: { state: "recommended", label: "廣場與交接免費・博物館需購票", note: "重點為八角廣場與 12:00 衛兵交接（免費）；進博物館參觀才需購票。", url: "https://denkongeligesamling.dk/en/amalienborg-museum/tickets/", cta: "博物館官方購票" } },
  marmorkirken: { why: "座落於阿馬林堡宮正對面，順路參觀巴洛克挑高圓頂建築。", booking: { state: "free", label: "教堂免費・不排圓頂導覽", note: "9/12（週六）開放 10:00-17:00；教堂本體免費參觀。", url: "https://www.marmorkirken.dk/admission", cta: "官方開放時間" } },
  canal: { why: "衛兵交接與午餐後乘船遊覽運河港灣，輕鬆欣賞哥本哈根水上景色。", booking: { state: "advance", label: "鎖定 09/12 15:00 班次", note: "Nyhavn 3 出發，15:00-16:00 Classic Canal Tour；票價依日期與早鳥浮動，依指定日期頁確認班次。", url: "https://www.stromma.com/en-dk/copenhagen/sightseeing/sightseeing-by-boat/grand-tour/", cta: "官方預約購票" } },
  saviour: { why: "以戶外金色螺旋階梯為特色，登頂可俯瞰哥本哈根全景。", booking: { state: "advance", label: "目標 09/12 16:30・學生票 53 DKK", note: "2026 每日開放 09:00-20:00，最後入場為關門前 30 分鐘；學生票 53 DKK。遇雨或強風會暫停開放。", url: "https://www.vorfrelserskirke.dk/taarn/tower/booking", cta: "官方預約登塔" } },
  notre: { why: "安排於 15:00 聖徒禮拜堂後，兩組會合後共同參觀，結束後搭 RER B 直達飯店。", booking: { state: "free", label: "目標 09/14 16:30・官方免費預約", note: "教堂本體免費；官方免費預約時段通常在前一兩天或當天釋出。", url: "https://resa.notredamedeparis.fr/en/reservationindividuelle/tickets", cta: "官方免費預約" } },
  sainte: { why: "15:00 時段光線充足，彩繪玻璃璀璨；A 組參觀古監獄、B 組喝咖啡，於同一入口集合。", booking: { state: "advance", label: "目標 09/14 15:00 指定時段", note: "熱門時段容易額滿；A 組買聯票、B 組買單館票，皆選定 15:00 時段。", url: "https://tickets.monuments-nationaux.fr/fr-FR/produits-seances?famille=2129033746020404157&site=2035141861660400306", cta: "官方線上購票" } },
  latin: { why: "搭乘 RER B 直達盧森堡公園，上午向北漫步花園、先賢祠與索邦大學，順路抵達西岱島分組。", booking: { state: "free", label: "街區與花園免費", note: "先賢祠維持外觀欣賞，把時間留給午後西岱島分組與禮拜堂參觀。" } },
  army: { why: "武器盔甲、近代戰爭史與拿破崙陵墓集中一處；與相鄰羅丹美術館有官方聯票。", booking: { state: "recommended", label: "門票・建議預先購買", note: "每日 10:00-18:00 開放；軍事博物館與羅丹美術館聯票目前為 26 EUR。", url: "https://www.musee-armee.fr/en/your-visit/opening-times-and-prices-1.html", cta: "官方聯票與購票" } },
  rodin: { why: "《沉思者》座落於雕塑花園，鄰近榮軍院；參觀後可直接步行穿過戰神廣場前往艾菲爾鐵塔。", booking: { state: "recommended", label: "門票・可買兩館聯票", note: "週二至週日 10:00-18:30 開放；與軍事博物館聯票目前為 26 EUR。", url: "https://www.musee-rodin.fr/en/plan-your-visit/plan-your-visit-musee-rodin", cta: "官方聯票與購票" } },
  eiffel: { why: "由榮軍院、羅丹美術館一路向西漫步至鐵塔，登塔後銜接 19:00 Francette 晚餐，動線順暢。", booking: { state: "advance", label: "登塔指定時段・預先購票", note: "目標 09/15 15:30 登塔；電梯票通常提前 60 天開賣，依實際票面時間順移。", url: "https://ticket.toureiffel.paris/en", cta: "官方線上購票" } },
  birhakeim: { why: "高架地鐵鋼構柱廊與鐵塔視野具備工程建築美感，鄰近鐵塔行程動線。", booking: { state: "free", label: "免費・免預約", note: "公共橋樑，散步時留意自行車動線與車流。" } },
  arc: { why: "登頂可眺望巴黎十二條放射狀大道的城市軸線，與香榭麗舍大道安排在同日最順路。", booking: { state: "confirmed", label: "已購・10:50 指定時段", note: "門票時間為 09/16 10:50；提前於地下通道入口排隊安檢，不穿越環島車道。", url: "https://www.paris-arc-de-triomphe.fr/en", cta: "官方參觀資訊" } },
  champs: { why: "由凱旋門向東單向漫步，將地標街景、林蔭大道與商店結合於同一路線。", booking: { state: "free", label: "免費・免預約", note: "公共大道，各店舖依自身營業時間運作。" } },
  louvre: { why: "週三夜間開放至 21:00，適合接在凱旋門與杜樂麗花園後，16:30 依票面入場參觀代表作至 20:30。", booking: { state: "confirmed", label: "已購・16:30 指定時段（16:00 報到）", note: "門票預約為 09/16 16:30；16:00 抵達玻璃金字塔專用通道排隊安檢，20:30 配合清場離館。", url: "https://ticket.louvre.fr/en", cta: "官方票務資訊" } },
  versailles: { why: "預留整天時間可同時參觀主宮殿、鏡廳、廣闊花園與特里亞農宮苑。", booking: { state: "advance", label: "Passport＋10:00 Palace 時段", note: "主宮 09:00-18:30、特里亞農 12:00-18:30；建議選購包含 10:00 主宮時段之 Passport 全區票券。", url: "https://en.chateauversailles.fr/plan-your-visit", cta: "官方線上購票" } },
  tuileries: { why: "從香榭麗舍向東漫步抵達，是進入羅浮宮前休息與享用咖啡點心的好去處。", booking: { state: "free", label: "免費・免預約", note: "公共花園，設有綠色躺椅與咖啡座。" } },
  palais: { why: "鄰近羅浮宮，Buren 黑白條紋柱與安靜拱廊適合作為午後短暫散步點。", booking: { state: "free", label: "庭院免費・免預約", note: "公共庭院與花園，可自由進出。" } },
  sciences: { why: "大型科學中心，保留為未排入行程的備選參考資料。", booking: { state: "recommended", label: "未排入每日行程", note: "Argonaute 潛水艇 2026/09/01-09/30 閉館維護。", url: "https://billetterie.cite-sciences.fr/", cta: "官方票務資訊" } },
  opera: { why: "因 09/13 改搭 09:40 TER 抵達巴黎北站較晚，歌劇院內部參觀暫時取消，保留作為未來行程備選。", booking: { state: "optional", label: "暫時取消・保留備選", note: "原預約 11:30 參觀，因交通時間延後暫時取消內部參觀。", url: "https://www.operadeparis.fr/en/visits/palais-garnier", cta: "歌劇院官方資訊" } },
  sacre: { why: "聖心堂、愛牆與蒙馬特街區可一次走訪，高地階梯前可俯瞰巴黎全景。", booking: { state: "onsite", label: "教堂免費・圓頂現場購票", note: "教堂本體免費；圓頂約 280 階且無電梯，僅現場購票。", url: "https://www.sacre-coeur-montmartre.com/en/info-and-visits/the-dome-tour/", cta: "圓頂參觀規則" } },
  grandpalais: { why: "鄰近香榭麗舍大道，若有感興趣之特展可安排入內欣賞玻璃穹頂建築。", booking: { state: "recommended", label: "外觀免費・展覽個別購票", note: "各展覽獨立售票，依官方節目表為準。", url: "https://www.grandpalais.fr/en", cta: "官方節目與票務" } },
  marais: { why: "歷史街區氛圍濃厚，獨立小店、藝廊與特色咖啡館林立。", booking: { state: "free", label: "街區免費・免預約", note: "個別店家與博物館依自身營業時間運作。" } },
  bonmarche: { why: "左岸氛圍悠閒，欣賞 Eiffel 鋼構挑高中庭，相鄰的美食館適合挑選伴手禮與在地食材。", booking: { state: "free", label: "免費入場", note: "百貨與美食館免門票，依營業時間開放。" } },
  trocadero: { why: "位於艾菲爾鐵塔正對岸的高地露台，午後順光適合拍攝鐵塔全景合照，免門票免排隊。", booking: { state: "free", label: "戶外廣場・免費", note: "公共觀景露台與夏樂宮花園，24 小時自由開放。" } },
  cygnes: { why: "塞納河中島林蔭步道通風遮陽，西南端可近距離欣賞 1889 年原版青銅自由女神像。", booking: { state: "free", label: "島上步道・免費", note: "天鵝島全天免費開放散步，由比爾哈凱姆橋中段階梯進出。" } },
  beaugrenelle: { why: "設有大型 Fnac 與餐飲店家，全室內空調適合作為午後避熱與採買據點。", booking: { state: "free", label: "商場免費入場", note: "一般營業至 20:30，內部有多家肉類餐飲與咖啡館。" } },
  ballon: { why: "繫留式氦氣球升空至 150 公尺高空俯瞰巴黎市區與鐵塔，同時具備空氣品質監測功能。", booking: { state: "onsite", label: "現場視天候購票", note: "每日 09:00-20:00；成人約 20 歐元，免事先預約，現場視當日風速天候燈號售票搭乘。", url: "https://ballondeparis.com/", cta: "官方天候與票務" } },
  francette: { why: "餐廳座落於艾菲爾鐵塔旁塞納河畔，已確認四人晚餐預約。", booking: { state: "confirmed", label: "已預約", note: "2026/09/15 19:00（4 位）；水上景觀餐廳。" } }
};

window.TRIP.placeSearchNames = {
  malmohus: ["馬爾默城堡", "馬爾默博物館", "馬爾默水族館", "Malmöhus Castle", "Malmö Museum", "Malmö Aquarium", "Malmö Art Museum"],
  tekniken: ["科技與海事館", "馬爾默科技博物館", "Teknikens och Sjöfartens hus", "Malmö Museums"],
  saluhall: ["馬爾默市場大廳", "馬爾默美食市場", "Malmö Saluhall"],
  lilla: ["小廣場", "馬爾默小廣場", "Lilla Torg"],
  disgusting: ["噁心食物博物館", "馬爾默噁心食物博物館", "Museum of Disgusting Food"],
  turning: ["旋轉大樓", "西港區", "Turning Torso", "Västra Hamnen"],
  eccv: ["歐洲電腦視覺會議", "歐洲計算機視覺會議", "ECCV 2026", "Malmömässan", "Malmö Arena"],
  experimentarium: ["互動科學中心", "哥本哈根科學館", "Experimentarium"],
  enigma: ["通訊博物館", "恩尼格瑪博物館", "ENIGMA Museum of Communication"],
  nyhavn: ["新港", "新港運河", "Nyhavn"],
  kongensnytorv: ["國王新廣場", "哥本哈根國王新廣場", "Kongens Nytorv", "King's New Square"],
  stroget: ["步行購物街", "哥本哈根步行街", "北歐設計店", "Hay House", "Illums Bolighus", "Strøget"],
  tivoli: ["趣伏里花園", "蒂沃利公園", "Tivoli Gardens"],
  dac: ["丹麥建築中心", "DAC", "BLOX", "BLOX Slide", "Dansk Arkitektur Center"],
  rosenborg: ["羅森堡城堡", "羅森堡宮", "Rosenborg Castle"],
  torvehallerne: ["托維哈勒恩市場", "哥本哈根市場", "Torvehallerne"],
  roundtower: ["圓塔", "哥本哈根圓塔", "Rundetaarn", "Round Tower"],
  christiansborg: ["克里斯蒂安堡宮", "哥本哈根國會", "Christiansborg Palace"],
  amalienborg: ["阿馬林堡宮", "阿美琳堡宮", "Amalienborg Palace"],
  marmorkirken: ["大理石教堂", "腓特烈教堂", "Marmorkirken", "Frederik's Church"],
  canal: ["哥本哈根運河遊船", "哥本哈根運河", "Canal Tour Copenhagen", "Classic Canal Tour"],
  saviour: ["救主堂", "救世主教堂", "Church of Our Saviour", "Vor Frelsers Kirke"],
  notre: ["巴黎聖母院", "聖母院", "Notre-Dame de Paris", "Notre Dame"],
  sainte: ["聖徒禮拜堂", "巴黎聖禮拜堂", "Sainte-Chapelle", "Sainte Chapelle"],
  latin: ["拉丁區", "巴黎拉丁區", "先賢祠", "盧森堡公園", "Quartier Latin", "Latin Quarter", "Panthéon", "Jardin du Luxembourg"],
  army: ["軍事博物館", "巴黎軍事博物館", "榮軍院", "拿破崙墓", "Musée de l’Armée", "Les Invalides", "Napoleon Tomb"],
  rodin: ["羅丹美術館", "沉思者", "Musée Rodin", "The Thinker", "Le Penseur"],
  eiffel: ["艾菲爾鐵塔", "巴黎鐵塔", "Eiffel Tower", "Trocadéro"],
  birhakeim: ["比爾哈凱姆橋", "比爾哈凱姆大橋", "Pont de Bir-Hakeim", "Inception bridge"],
  arc: ["凱旋門", "巴黎凱旋門", "Arc de Triomphe"],
  champs: ["香榭麗舍大道", "香榭麗舍", "Champs-Élysées", "Champs Elysees"],
  louvre: ["羅浮宮", "巴黎羅浮宮", "Louvre Museum", "Musée du Louvre"],
  versailles: ["凡爾賽", "凡爾賽宮", "凡爾賽花園", "Château de Versailles", "Palace of Versailles", "Trianon"],
  tuileries: ["杜樂麗花園", "杜伊勒里花園", "Tuileries Garden", "Jardin des Tuileries"],
  palais: ["皇家宮殿", "巴黎皇家宮殿", "Palais Royal"],
  sciences: ["科學與工業城", "巴黎科學館", "巴黎科學與工業城", "Cité des sciences", "City of Science and Industry"],
  opera: ["巴黎歌劇院", "加尼葉歌劇院", "老佛爺百貨", "Palais Garnier", "Galeries Lafayette"],
  sacre: ["聖心堂", "聖心大教堂", "蒙馬特", "愛牆", "Sacré-Cœur", "Montmartre", "Wall of Love"],
  grandpalais: ["巴黎大皇宮", "大皇宮", "Grand Palais"],
  marais: ["瑪黑區", "巴黎瑪黑區", "Le Marais"],
  bonmarche: ["樂蓬馬歇百貨", "巴黎左岸百貨", "Le Bon Marché", "La Grande Épicerie"],
  trocadero: ["特羅卡德羅廣場", "特羅卡德羅露台", "夏樂宮", "夏樂宮花園", "Place du Trocadéro", "Trocadéro", "Palais de Chaillot"],
  cygnes: ["天鵝島", "自由女神像", "巴黎自由女神", "Allée des Cygnes", "Île aux Cygnes", "Statue of Liberty Paris"],
  beaugrenelle: ["博格內爾商場", "Fnac 旗艦店", "Beaugrenelle", "Beaugrenelle Paris", "Fnac Beaugrenelle"],
  ballon: ["雪鐵龍公園熱氣球", "巴黎大氣球", "熱氣球", "Ballon de Paris", "Ballon Generali", "Parc André Citroën"],
  francette: ["艾菲爾鐵塔旁餐廳", "塞納河餐廳", "Francette Paris"]
};

window.TRIP.placeVisuals = {
  malmohus: {
    image: "assets/places/malmohus.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Malm%C3%B6hus_slott_2022.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Malmöhus Castle, Malmö"
  },
  tekniken: {
    image: "assets/places/tekniken.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Teknikens_och_Sj%C3%B6fartens_hus,_Malm%C3%B6,_augusti_2014.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Teknikens och Sjöfartens hus, Malmö"
  },
  saluhall: {
    image: "assets/places/saluhall.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Malm%C3%B6_Saluhall_Universitetsholmen.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Malmö Saluhall, Gibraltargatan 6, Malmö"
  },
  lilla: {
    image: "assets/places/lilla.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Lilla_torg,_Malm%C3%B6.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Lilla Torg, Malmö"
  },
  disgusting: {
    image: "assets/places/disgusting.jpg",
    credit: "https://www.eclectickim.com/museum-of-disgusting-foods/",
    creditLabel: "Eclectic Kim",
    mapQuery: "Disgusting Food Museum, Södra Förstadsgatan 2, Malmö"
  },
  turning: {
    image: "assets/places/turning.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Turning_torso_Malmo_Sweden.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Turning Torso, Malmö"
  },
  eccv: {
    image: "assets/places/eccv.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Malm%C3%B6m%C3%A4ssan,_Malm%C3%B6.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Malmömässan, Mässgatan 6, Malmö"
  },
  experimentarium: {
    image: "assets/places/experimentarium.jpg",
    credit: "https://www.experimentarium.dk/",
    creditLabel: "Experimentarium",
    mapQuery: "Experimentarium, Tuborg Havnevej 7, Hellerup"
  },
  enigma: {
    image: "assets/places/enigma.jpg",
    credit: "https://www.wonderfulcopenhagen.com/wonderful-copenhagen/international-press/press-kit-culture-art-events/re-opening-enigma-copenhagens-communication-museum",
    creditLabel: "Wonderful Copenhagen",
    mapQuery: "ENIGMA, Øster Allé 3, Copenhagen"
  },
  nyhavn: {
    image: "assets/places/nyhavn.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Nyhavn_copenhagen.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Nyhavn, Copenhagen"
  },
  kongensnytorv: {
    image: "assets/places/kongensnytorv.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Kongens_Nytorv_26_K%C3%B8benhavn.jpg",
    creditLabel: "Wikimedia Commons（Public domain）",
    mapQuery: "Kongens Nytorv, Copenhagen"
  },
  stroget: {
    image: "assets/places/stroget.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:K%C3%B8benhavn_Str%C3%B8get.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Strøget, Copenhagen"
  },
  tivoli: {
    image: "assets/places/tivoli.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Tivoligardens2.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Tivoli Gardens, Vesterbrogade 3, Copenhagen"
  },
  dac: {
    image: "assets/places/dac.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:BLOX.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Danish Architecture Center, Bryghuspladsen 10, Copenhagen"
  },
  rosenborg: {
    image: "assets/places/rosenborg.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Copenhagen,_view_from_Rundet%C3%A5rn_with_Rosenborg_Castle,_20220617_1004_6716.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Rosenborg Castle, Øster Voldgade 4A, Copenhagen"
  },
  torvehallerne: {
    image: "assets/places/torvehallerne.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Copenhagen_Torvehallerne_(30267894558).jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "TorvehallerneKBH, Frederiksborggade 21, Copenhagen"
  },
  roundtower: {
    image: "assets/places/roundtower.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Round_Tower_Copenhagen.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Rundetaarn, Købmagergade 52A, Copenhagen"
  },
  christiansborg: {
    image: "assets/places/christiansborg.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:2018_-_Christiansborg_from_the_Marble_Bridge.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Christiansborg Palace, Prins Jørgens Gård 5, Copenhagen"
  },
  amalienborg: {
    image: "assets/places/amalienborg.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Two_of_Kongelige_livgarde_Amalienborg_Copenhagen_Denmark.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Amalienborg Palace, Copenhagen"
  },
  marmorkirken: {
    image: "assets/places/marmorkirken.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Frederik%27s_Church,_Copenhagen,_20220617_0853_6680.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Marmorkirken, Frederiksgade 4, Copenhagen"
  },
  canal: {
    image: "assets/places/canal.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Canal_Tours_at_Christianshavn.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Canal Tours Copenhagen, Nyhavn 3, Copenhagen"
  },
  saviour: {
    image: "assets/places/saviour.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Church-of-Our-Saviour-Copenhagen.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Church of Our Saviour, Sankt Annæ Gade 29, Copenhagen"
  },
  notre: {
    image: "assets/places/notre.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_2013-07-24.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Notre-Dame de Paris"
  },
  sainte: {
    image: "assets/places/sainte.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Sainte_Chapelle_Interior_Stained_Glass.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Sainte-Chapelle, 10 Boulevard du Palais, Paris"
  },
  latin: {
    image: "assets/places/latin.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Latin_Quarter._Paris,_France.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Panthéon, Place du Panthéon, Paris"
  },
  army: {
    image: "assets/places/army.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:D%C3%B4me_des_Invalides_-_HDR.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Musée de l'Armée, 129 Rue de Grenelle, Paris"
  },
  rodin: {
    image: "assets/places/rodin.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Mus%C3%A9e_Rodin-The_thinker.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Musée Rodin, 77 Rue de Varenne, Paris"
  },
  eiffel: {
    image: "assets/places/eiffel.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Eiffel_tower_from_trocadero.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Eiffel Tower, Paris"
  },
  birhakeim: {
    image: "assets/places/birhakeim.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:15th_Arrondissement_of_Paris_as_seen_from_Pont_de_Bir-Hakeim_140507_1.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Pont de Bir-Hakeim, Paris"
  },
  arc: {
    image: "assets/places/arc.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Arc_Triomphe.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Arc de Triomphe, Paris"
  },
  champs: {
    image: "assets/places/champs.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Champs_Elysees_Paris_Wikimedia_Commons.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Champs-Élysées, Paris"
  },
  louvre: {
    image: "assets/places/louvre.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Louvre_Museum_-_entrance.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Louvre Museum, Paris"
  },
  versailles: {
    image: "assets/places/versailles.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Palace_of_Versailles_(courtyard).JPG",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Château de Versailles, Place d'Armes, Versailles"
  },
  tuileries: {
    image: "assets/places/tuileries.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Jardin_des_Tuileries.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Jardin des Tuileries, Paris"
  },
  palais: {
    image: "assets/places/palais.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Palais_Royal,_Paris_8_September_2019.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Palais Royal, Paris"
  },
  sciences: {
    image: "assets/places/sciences.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:La_cite_des_sciences_2.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Cité des sciences et de l'industrie, 30 Avenue Corentin Cariou, Paris"
  },
  opera: {
    image: "assets/places/opera.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:GarnierOperaParis.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Palais Garnier, Paris"
  },
  sacre: {
    image: "assets/places/sacre.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Sacré-Cœur, 35 Rue du Chevalier de la Barre, Paris"
  },
  grandpalais: {
    image: "assets/places/grandpalais.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Grand_Palais,_Paris_6_March_2016.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Grand Palais, 3 Avenue du Général Eisenhower, Paris"
  },
  marais: {
    image: "assets/places/marais.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:H%C3%B4tel_H%C3%A9rouet,_Le_Marais,_Paris_May_2017.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Le Marais, Paris"
  },
  bonmarche: {
    image: "assets/places/bonmarche.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Le_Bon_March%C3%A9,_Paris_27_May_2012.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Le Bon Marché, 24 Rue de Sèvres, Paris"
  },
  trocadero: {
    image: "assets/places/trocadero.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Eiffel_tower_from_trocadero.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Place du Trocadéro, Paris"
  },
  cygnes: {
    image: "assets/places/cygnes.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Statue_de_la_Libert%C3%A9_Paris_Pont_de_Grenelle.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Statue de la Liberté, Pont de Grenelle, Paris"
  },
  beaugrenelle: {
    image: "assets/places/beaugrenelle.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Centre_commercial_Beaugrenelle,_Paris_15e.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Beaugrenelle Paris, 12 Rue Linois, Paris"
  },
  ballon: {
    image: "assets/places/ballon.jpg",
    credit: "https://commons.wikimedia.org/wiki/File:Ballon_de_Paris_Parc_Andr%C3%A9_Citro%C3%ABn.jpg",
    creditLabel: "Wikimedia Commons",
    mapQuery: "Ballon de Paris Generali, Parc André Citroën, Paris"
  },
  francette: {
    image: "assets/places/francette.jpg",
    credit: "https://www.sortiraparis.com/hotel-restaurant/restaurant/articles/255122-francette-terrasse-sur-la-seine-et-caviste-sous-l-eau-le-nouveau-lieu-tendance-et-gourmand-a-paris",
    creditLabel: "Sortir à Paris",
    mapQuery: "Francette, 1 Port de Suffren, Paris"
  }
};

window.TRIP.routeMaps = {
  "09-06": {
    defaultGroup: "flight",
    groups: [{
      id: "flight", label: "跨夜飛行", note: "航線為示意弧線；機場動線以現場登機門為準。",
      stops: [
        { time: "23:50", label: "桃園機場 T2", detail: "EK 367 起飛", lat: 25.0797, lng: 121.2342, status: "fixed" },
        { time: "09/07 04:35", label: "杜拜機場 T3", detail: "抵達並轉機", lat: 25.2532, lng: 55.3657, status: "transfer" }
      ],
      legs: [{ mode: "flight", label: "EK 367・約 8 小時 45 分" }]
    }]
  },
  "09-07": {
    defaultGroup: "arrival",
    groups: [{
      id: "arrival", label: "抵達北歐", note: "跨海後以 Hyllie 為轉乘中繼站。",
      stops: [
        { time: "04:35", label: "杜拜機場 T3", detail: "EK 151 轉機", lat: 25.2532, lng: 55.3657, status: "transfer" },
        { time: "13:15", label: "Copenhagen Airport T3", detail: "領行李後前往火車站", lat: 55.6181, lng: 12.6561, status: "fixed" },
        { time: "約 14:35", label: "Hyllie Station", detail: "轉搭 Bus 9", lat: 55.5627, lng: 12.9759, status: "transfer" },
        { time: "15:00 後", label: "First Camp Sibbarp", detail: "入住與休息", lat: 55.5718, lng: 12.9087, status: "stay" }
      ],
      legs: [
        { mode: "flight", label: "EK 151" },
        { mode: "train", label: "Øresundståg" },
        { mode: "bus", label: "Bus 9＋步行" }
      ]
    }]
  },
  "09-08": {
    defaultGroup: "museum",
    groups: [{
      id: "museum", label: "一日聯票路線", note: "09:50 出發吻合 11:00 開館；兩館相距僅約 5 分鐘步行。",
      stops: [
        { time: "09:50", label: "First Camp Sibbarp", detail: "出發", lat: 55.5718, lng: 12.9087, status: "start" },
        { time: "約 10:35", label: "Malmö C", detail: "下車後步行 14 分鐘", lat: 55.6091, lng: 13.0007, status: "transfer" },
        { time: "11:00", label: "Malmöhus Castle", detail: "城堡／水族館／藝術館", lat: 55.6048, lng: 12.9868, status: "ticket" },
        { time: "14:05", label: "Teknikens och Sjöfartens hus", detail: "同一張 Kombibiljett", lat: 55.6048, lng: 12.9829, status: "ticket" },
        { time: "16:35", label: "Slottsträdgården", detail: "花園與城堡外圍", lat: 55.6035, lng: 12.9866, status: "planned" },
        { time: "18:30 前", label: "First Camp Sibbarp", detail: "原路返回住宿", lat: 55.5718, lng: 12.9087, status: "stay" }
      ],
      legs: [
        { mode: "transit", label: "Bus 9＋火車" },
        { mode: "walk", label: "步行" },
        { mode: "walk", label: "步行 5 分" },
        { mode: "walk", label: "步行" },
        { mode: "transit", label: "步行＋火車＋Bus 9" }
      ]
    }]
  },
  "09-09": {
    defaultGroup: "personal",
    groups: [{
      id: "personal", label: "Experimentarium 個人路線", note: "早上跨海到 Hellerup，下午返回 Malmö C，傍晚在 Turning Torso 與西港區會合。",
      stops: [
        { time: "07:50", label: "First Camp Sibbarp", detail: "出發，步行至 Götgatan", lat: 55.5718, lng: 12.9087, status: "start" },
        { time: "08:05", label: "Götgatan", detail: "搭乘 Bus 9", lat: 55.5763, lng: 12.9260, status: "transfer" },
        { time: "08:30", label: "Hyllie Station", detail: "確認車票與月台", lat: 55.5627, lng: 12.9759, status: "transfer" },
        { time: "09:15", label: "København H", detail: "抵達後轉乘 S-tog", lat: 55.6728, lng: 12.5647, status: "transfer" },
        { time: "09:40", label: "Hellerup Station", detail: "轉乘 Bus 164 或步行", lat: 55.7306, lng: 12.5669, status: "transfer" },
        { time: "09:55", label: "Experimentarium", detail: "互動科學中心", lat: 55.7265, lng: 12.5800, status: "ticket" },
        { time: "16:00", label: "København H", detail: "回程轉乘", lat: 55.6728, lng: 12.5647, status: "transfer" },
        { time: "17:15", label: "Malmö C", detail: "抵達後前往西港會合", lat: 55.6091, lng: 13.0007, status: "transfer" },
        { time: "17:30", label: "Turning Torso", detail: "與大家會合", lat: 55.6133, lng: 12.9763, status: "planned" },
        { time: "18:15", label: "Västra Hamnen", detail: "濱水區散步", lat: 55.6130, lng: 12.9745, status: "planned" },
        { time: "21:00 前", label: "First Camp Sibbarp", detail: "公車或計程車回住宿", lat: 55.5718, lng: 12.9087, status: "stay" }
      ],
      legs: [
        { mode: "walk", label: "步行 15 分" },
        { mode: "bus", label: "Bus 9" },
        { mode: "train", label: "Øresundståg" },
        { mode: "train", label: "S-tog" },
        { mode: "bus", label: "Bus 164／步行" },
        { mode: "transit", label: "回 Hellerup／København H" },
        { mode: "train", label: "Øresundståg" },
        { mode: "transit", label: "Malmö C → 西港" },
        { mode: "walk", label: "步行至 Västra Hamnen" },
        { mode: "transit", label: "公車／Taxi 回 First Camp" }
      ]
    }]
  },
  "09-10": {
    defaultGroup: "eccv",
    groups: [{
      id: "eccv", label: "會議日", note: "Poster、Main Conference 與 Expo 都在 Hyllie 步行範圍。",
      stops: [
        { time: "08:05", label: "First Camp Sibbarp", detail: "出發", lat: 55.5718, lng: 12.9087, status: "start" },
        { time: "08:30", label: "Hyllie Station", detail: "Bus 9 下車", lat: 55.5627, lng: 12.9759, status: "transfer" },
        { time: "08:40", label: "Malmö Arena／Malmömässan", detail: "領取 Badge、Poster #137、Expo", lat: 55.5671, lng: 12.9774, status: "fixed" },
        { time: "晚間", label: "First Camp Sibbarp", detail: "Bus 9 返回住宿", lat: 55.5718, lng: 12.9087, status: "stay" }
      ],
      legs: [
        { mode: "bus", label: "步行＋Bus 9" },
        { mode: "walk", label: "步行" },
        { mode: "bus", label: "步行＋Bus 9" }
      ]
    }]
  },
  "09-11": {
    defaultGroup: "copenhagen",
    groups: [{
      id: "copenhagen", label: "逆時針水岸老城環線與 Tivoli", note: "09:15 Malmö C 出發、10:00 DAC 溜滑梯、11:45 克里斯蒂安堡宮、14:30 圓塔、18:30 Tivoli 入園、22:00 København H 返回 Malmö。",
      stops: [
        { time: "09:15", label: "Malmö C", detail: "搭乘 Øresundståg 跨海火車", lat: 55.6091, lng: 13.0007, status: "transfer" },
        { time: "10:00", label: "København H", detail: "抵達後沿水岸散步 12 分鐘", lat: 55.6728, lng: 12.5647, status: "transfer" },
        { time: "10:00 - 11:30", label: "DAC @ BLOX", detail: "丹麥建築中心・室內巨型溜滑梯（憑 K7 免費）", lat: 55.6723, lng: 12.5794, status: "ticket" },
        { time: "11:45 - 13:00", label: "Christiansborg Palace", detail: "克里斯蒂安堡宮皇家接待廳（憑 K7 免費）", lat: 55.6762, lng: 12.5797, status: "ticket" },
        { time: "13:00 - 14:15", label: "老城區午餐", detail: "百年傳統三明治或文藝復古咖啡館", lat: 55.6780, lng: 12.5770, status: "planned" },
        { time: "14:30 - 15:30", label: "Rundetaarn", detail: "圓塔螺旋斜坡登頂（憑 K7 免費）", lat: 55.6814, lng: 12.5758, status: "ticket" },
        { time: "15:30 - 17:30", label: "Strøget 步行街", detail: "漫步購物：HAY House、Illums、LEGO", lat: 55.6787, lng: 12.5789, status: "planned" },
        { time: "17:30 - 18:30", label: "市政廳廣場", detail: "廣場周邊晚餐與小歇", lat: 55.6761, lng: 12.5683, status: "planned" },
        { time: "18:30 - 21:45", label: "Tivoli Gardens", detail: "趣伏里公園復古燈景與週五音樂派對", lat: 55.6734, lng: 12.5692, status: "fixed" },
        { time: "22:00", label: "København H", detail: "出公園過馬路搭 22:00 火車回 Malmö", lat: 55.6728, lng: 12.5647, status: "transfer" },
        { time: "22:35", label: "Malmö C", detail: "抵達 Malmö C 返回住宿", lat: 55.6091, lng: 13.0007, status: "stay" }
      ],
      legs: [
        { mode: "train", label: "Øresundståg・09:15 - 10:00" },
        { mode: "walk", label: "水岸散步 12 分" },
        { mode: "walk", label: "過橋步行 5 分" },
        { mode: "walk", label: "步行老城" },
        { mode: "walk", label: "步行至圓塔" },
        { mode: "walk", label: "Strøget 購物漫步" },
        { mode: "walk", label: "漫步至市政廳廣場" },
        { mode: "walk", label: "步行過馬路至 Tivoli" },
        { mode: "walk", label: "步行過馬路至車站" },
        { mode: "train", label: "Øresundståg・22:00" }
      ]
    }]
  },
  "09-12": {
    defaultGroup: "airport-locker",
    groups: [
      {
        id: "central-locker", label: "備援 A・中央站寄放", note: "僅於機場置物櫃不足時啟用；取件後視情況叫車前往機場。",
        stops: [
          { time: "08:45", label: "First Camp Sibbarp", detail: "退房後前往 Malmö C", lat: 55.5718, lng: 12.9087, status: "start" },
          { time: "09:05", label: "Malmö C", detail: "搭乘 09:05 Re 1041", lat: 55.6091, lng: 13.0007, status: "transfer" },
          { time: "09:44", label: "København H", detail: "抵達後寄放大行李", lat: 55.6728, lng: 12.5647, status: "transfer" },
          { time: "10:45", label: "Marmorkirken", detail: "教堂本體", lat: 55.6850, lng: 12.5896, status: "planned" },
          { time: "11:50", label: "Amalienborg", detail: "12:00 衛兵交接", lat: 55.6840, lng: 12.5932, status: "fixed" },
          { time: "12:45", label: "Nyhavn／Kongens Nytorv", detail: "午餐與散步", lat: 55.6808, lng: 12.5882, status: "planned" },
          { time: "15:00 - 16:00", label: "Stromma Classic Canal Tour", detail: "Nyhavn 3 出發／返回", lat: 55.6808, lng: 12.5882, status: "fixed" },
          { time: "16:30 - 17:15", label: "Church of Our Saviour", detail: "救主堂螺旋塔；最晚 17:15 離開", lat: 55.6738, lng: 12.5923, status: "planned" },
          { time: "17:45", label: "København H", detail: "取行李（備援 A）", lat: 55.6728, lng: 12.5647, status: "transfer" },
          { time: "18:15", label: "Copenhagen Airport T2", detail: "托運、安檢與候機", lat: 55.6181, lng: 12.6561, status: "planned" }
        ],
        legs: [
          { mode: "transit", label: "Bus 9／Taxi" },
          { mode: "train", label: "Øresundståg・09:05 - 09:44" },
          { mode: "metro", label: "M3" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "Nyhavn 3 報到／候船" },
          { mode: "boat", label: "Classic Canal Tour・15:00 - 16:00", path: [[55.6808, 12.5882], [55.6840, 12.6005], [55.6927, 12.5992], [55.6814, 12.6032], [55.6732, 12.5960], [55.6745, 12.5827], [55.6771, 12.5797], [55.6808, 12.5882]] },
          { mode: "transit", label: "步行至救主堂" },
          { mode: "transit", label: "Metro／取件" },
          { mode: "train", label: "直達列車" }
        ]
      },
      {
        id: "airport-locker", label: "方案 B・主方案：機場寄放", note: "早上先將行李送至 CPH P4/P7A；下午由 Christianshavn 搭 M2 直達機場取件，免去回中央站折返。",
        stops: [
          { time: "08:45", label: "First Camp Sibbarp", detail: "退房後前往 Malmö C", lat: 55.5718, lng: 12.9087, status: "start" },
          { time: "09:05", label: "Malmö C", detail: "搭乘 09:05 Re 1041 直達 CPH", lat: 55.6091, lng: 13.0007, status: "transfer" },
          { time: "09:35", label: "Copenhagen Airport P4／P7A", detail: "寄放四件托運箱", lat: 55.6181, lng: 12.6561, status: "transfer" },
          { time: "10:45", label: "Marmorkirken", detail: "M2 回市區轉 M3/M4 抵達教堂", lat: 55.6850, lng: 12.5896, status: "planned" },
          { time: "11:50", label: "Amalienborg", detail: "12:00 衛兵交接", lat: 55.6840, lng: 12.5932, status: "fixed" },
          { time: "12:45", label: "Nyhavn／Kongens Nytorv", detail: "午餐與散步", lat: 55.6808, lng: 12.5882, status: "planned" },
          { time: "15:00 - 16:00", label: "Stromma Classic Canal Tour", detail: "Nyhavn 3 出發／返回", lat: 55.6808, lng: 12.5882, status: "fixed" },
          { time: "16:30 - 17:15", label: "Church of Our Saviour", detail: "救主堂螺旋塔；最晚 17:15 離開", lat: 55.6738, lng: 12.5923, status: "planned" },
          { time: "18:00", label: "Copenhagen Airport T2", detail: "M2 直達機場取行李後前往 T2；18:00 前完成托運", lat: 55.6181, lng: 12.6561, status: "fixed" }
        ],
        legs: [
          { mode: "transit", label: "Bus 9／Taxi" },
          { mode: "train", label: "Re 1041／Øresundståg・09:05 - 09:35" },
          { mode: "metro", label: "M2 → Kongens Nytorv → M3／M4" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "Nyhavn 3 報到／候船" },
          { mode: "boat", label: "Classic Canal Tour・15:00 - 16:00", path: [[55.6808, 12.5882], [55.6840, 12.6005], [55.6927, 12.5992], [55.6814, 12.6032], [55.6732, 12.5960], [55.6745, 12.5827], [55.6771, 12.5797], [55.6808, 12.5882]] },
          { mode: "transit", label: "步行至救主堂" },
          { mode: "metro", label: "M2 直達機場" }
        ]
      },
      {
        id: "flight", label: "飛行與 Beauvais 入住", note: "22:00 抵達後前往飯店休息，不進巴黎。",
        stops: [
          { time: "20:05", label: "Copenhagen Airport T2", detail: "FR9267 起飛", lat: 55.6181, lng: 12.6561, status: "fixed" },
          { time: "22:00", label: "Beauvais-Tillé Airport", detail: "領取托運行李", lat: 49.4543, lng: 2.1117, status: "fixed" },
          { time: "約 22:40", label: "Hostellerie Saint Vincent", detail: "計程車前往飯店入住", lat: 49.4305, lng: 2.1179, status: "stay" }
        ],
        legs: [
          { mode: "flight", label: "FR9267・1 小時 55 分" },
          { mode: "taxi", label: "Taxi" }
        ]
      }
    ]
  },
  "09-13": {
    defaultGroup: "paris",
    groups: [
      {
        id: "transfer", label: "Beauvais → Paris", note: "搭乘 09:40 直達 TER 前往巴黎北站。",
        stops: [
          { time: "09:05", label: "Hostellerie Saint Vincent", detail: "退房叫車", lat: 49.4305, lng: 2.1179, status: "start" },
          { time: "09:25", label: "Gare de Beauvais", detail: "抵達月台", lat: 49.4264, lng: 2.0887, status: "transfer" },
          { time: "10:59", label: "Paris Gare du Nord", detail: "TER C17 抵達", lat: 48.8809, lng: 2.3553, status: "fixed" },
          { time: "11:20", label: "Paris 飯店", detail: "寄放行李／可入住先入住", lat: 48.8836, lng: 2.3594, status: "stay" }
        ],
        legs: [
          { mode: "taxi", label: "Taxi" },
          { mode: "train", label: "09:40 - 10:59 TER C17" },
          { mode: "walk", label: "步行" }
        ]
      },
      {
        id: "paris", label: "蒙馬特高地漫遊", note: "午餐後漫步愛牆、小丘廣場與聖心堂，最後回飯店正式辦理入住。",
        stops: [
          { time: "11:30", label: "Paris 飯店", detail: "寄放行李後出發", lat: 48.8836, lng: 2.3594, status: "start" },
          { time: "12:00", label: "蒙馬特山腳／Anvers", detail: "法式小館午餐", lat: 48.8828, lng: 2.3444, status: "planned" },
          { time: "13:30", label: "Le Mur des Je t'aime", detail: "愛牆與小丘廣場", lat: 48.8848, lng: 2.3387, status: "planned" },
          { time: "14:30", label: "Sacré-Cœur", detail: "聖心堂與階梯景觀", lat: 48.8868, lng: 2.3430, status: "fixed" },
          { time: "16:30", label: "Clos Montmartre", detail: "後山葡萄園與粉紅之家", lat: 48.8880, lng: 2.3400, status: "planned" },
          { time: "18:00 前", label: "Paris 飯店", detail: "Check-in 入住與休息", lat: 48.8836, lng: 2.3594, status: "stay" }
        ],
        legs: [
          { mode: "metro", label: "M2" },
          { mode: "walk", label: "漫步" },
          { mode: "walk", label: "登階" },
          { mode: "walk", label: "後山漫步" },
          { mode: "metro", label: "M2 回飯店" }
        ]
      }
    ]
  },
  "09-14": {
    defaultGroup: "conciergerie",
    groups: [
      {
        id: "conciergerie", label: "A 古監獄路線", note: "A 組 13:20 入館參觀古監獄、14:25 離館；14:30 與 B 組在 Sainte-Chapelle 入口集合。",
        stops: [
          { time: "08:20", label: "Paris 飯店", detail: "搭乘 RER B 出發", lat: 48.8836, lng: 2.3594, status: "start" },
          { time: "08:45", label: "Jardin du Luxembourg", detail: "盧森堡公園", lat: 48.8462, lng: 2.3372, status: "planned" },
          { time: "09:45", label: "Panthéon", detail: "先賢祠外觀與索邦大學", lat: 48.8462, lng: 2.3461, status: "planned" },
          { time: "11:15", label: "Saint-Michel", detail: "拉丁區午餐", lat: 48.8534, lng: 2.3439, status: "planned" },
          { time: "13:20", label: "Conciergerie", detail: "A 組古監獄重點參觀", lat: 48.8562, lng: 2.3457, status: "ticket" },
          { time: "15:00", label: "Sainte-Chapelle", detail: "兩組共同指定時段", lat: 48.8554, lng: 2.3450, status: "ticket" },
          { time: "16:30", label: "Notre-Dame", detail: "巴黎聖母院參觀", lat: 48.8529, lng: 2.3501, status: "fixed" },
          { time: "17:35", label: "Saint-Michel-Notre-Dame", detail: "搭乘 RER B", lat: 48.8536, lng: 2.3446, status: "transfer" },
          { time: "18:05 前", label: "Paris 飯店", detail: "返回巴黎北站住宿", lat: 48.8836, lng: 2.3594, status: "stay" }
        ],
        legs: [
          { mode: "train", label: "RER B" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "索邦大學街區步行" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "步行＋重新安檢" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "步行" },
          { mode: "train", label: "RER B" }
        ]
      },
      {
        id: "coffee", label: "B 咖啡路線", note: "B 組於西岱島或聖米歇爾咖啡館休息，14:20 返回集合點。",
        stops: [
          { time: "08:20", label: "Paris 飯店", detail: "搭乘 RER B 出發", lat: 48.8836, lng: 2.3594, status: "start" },
          { time: "08:45", label: "Jardin du Luxembourg", detail: "盧森堡公園", lat: 48.8462, lng: 2.3372, status: "planned" },
          { time: "09:45", label: "Panthéon", detail: "先賢祠外觀與索邦大學", lat: 48.8462, lng: 2.3461, status: "planned" },
          { time: "11:15", label: "Saint-Michel", detail: "拉丁區午餐", lat: 48.8534, lng: 2.3439, status: "planned" },
          { time: "13:00", label: "Place Dauphine", detail: "B 組咖啡小憩與多菲娜廣場", lat: 48.8565, lng: 2.3422, status: "optional" },
          { time: "15:00", label: "Sainte-Chapelle", detail: "兩組共同指定時段", lat: 48.8554, lng: 2.3450, status: "ticket" },
          { time: "16:30", label: "Notre-Dame", detail: "巴黎聖母院參觀", lat: 48.8529, lng: 2.3501, status: "fixed" },
          { time: "17:35", label: "Saint-Michel-Notre-Dame", detail: "搭乘 RER B", lat: 48.8536, lng: 2.3446, status: "transfer" },
          { time: "18:05 前", label: "Paris 飯店", detail: "返回巴黎北站住宿", lat: 48.8836, lng: 2.3594, status: "stay" }
        ],
        legs: [
          { mode: "train", label: "RER B" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "索邦大學街區步行" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "步行" },
          { mode: "walk", label: "步行" },
          { mode: "train", label: "RER B" }
        ]
      }
    ]
  },
  "09-15": {
    defaultGroup: "invalides_eiffel",
    groups: [{
      id: "invalides_eiffel", label: "分流、鐵塔全員、天鵝島與熱氣球", note: "上午分流、中午會合；下午四人同行串聯鐵塔、特羅卡德羅露台、天鵝島與熱氣球，19:00 Francette 為晚餐終點。",
      stops: [
        { time: "08:45", label: "Paris 飯店", detail: "分流出發（軍博組 M4+M8 / 百貨組 M4）", lat: 48.8836, lng: 2.3594, status: "start" },
        { time: "10:00", label: "軍博組 Invalides / 百貨組 Bon Marché", detail: "上午分流參觀與逛街", lat: 48.8570, lng: 2.3119, status: "planned" },
        { time: "12:30", label: "戰神廣場周邊", detail: "全員會合享用牛排午餐", lat: 48.8550, lng: 2.3020, status: "planned" },
        { time: "13:45", label: "Eiffel Tower ＆ Trocadéro", detail: "全員鐵塔合照與露台全景", lat: 48.8583, lng: 2.2945, status: "planned" },
        { time: "15:15", label: "Pont de Bir-Hakeim ＆ 天鵝島", detail: "雙層鋼構橋與自由女神像", lat: 48.8556, lng: 2.2875, status: "planned" },
        { time: "16:30", label: "Beaugrenelle Paris", detail: "商場冷氣小憩與 Fnac 旗艦店", lat: 48.8488, lng: 2.2828, status: "planned" },
        { time: "17:30", label: "Parc André Citroën", detail: "搭乘 Ballon de Paris 升空熱氣球", lat: 48.8415, lng: 2.2745, status: "planned" },
        { time: "19:00", label: "Francette", detail: "水上餐廳晚餐已預約", lat: 48.8588, lng: 2.2913, status: "fixed" }
      ],
      legs: [
        { mode: "metro", label: "地鐵分流出發" },
        { mode: "metro", label: "M8 至 École Militaire 會合" },
        { mode: "walk", label: "步行穿過戰神廣場至鐵塔與夏樂宮" },
        { mode: "walk", label: "步行過橋至天鵝島" },
        { mode: "walk", label: "步行 3 分鐘至商場" },
        { mode: "walk", label: "步行約 12 分鐘至雪鐵龍公園" },
        { mode: "train", label: "RER C 直達 Champ de Mars" }
      ]
    }]
  },
  "09-16": {
    defaultGroup: "west_to_louvre",
    groups: [{
      id: "west_to_louvre", label: "巴黎西向東單向線", note: "10:50 凱旋門門票時間；16:00 抵達金字塔報到，16:30 - 20:30 羅浮宮看展。",
      stops: [
        { time: "09:40", label: "Paris 飯店", detail: "M2 出發", lat: 48.8836, lng: 2.3594, status: "start" },
        { time: "10:50", label: "Arc de Triomphe", detail: "10:50 票面時間，提早排隊", lat: 48.8738, lng: 2.2950, status: "ticket" },
        { time: "12:00", label: "Champs-Élysées", detail: "向東散步，13:00 午餐", lat: 48.8705, lng: 2.3049, status: "planned" },
        { time: "14:00", label: "Place de la Concorde", detail: "協和廣場進入杜樂麗", lat: 48.8656, lng: 2.3212, status: "planned" },
        { time: "14:30", label: "Jardin des Tuileries", detail: "15:15 咖啡甜點小憩", lat: 48.8636, lng: 2.3270, status: "planned" },
        { time: "16:00 報到 / 16:30", label: "Musée du Louvre", detail: "16:30 入場至 20:30", lat: 48.8611, lng: 2.3380, status: "ticket" },
        { time: "20:30", label: "Cour Napoléon", detail: "玻璃金字塔夜景", lat: 48.8619, lng: 2.3364, status: "planned" },
        { time: "21:00 後", label: "Paris 飯店", detail: "M1＋M4 回程與晚餐", lat: 48.8836, lng: 2.3594, status: "stay" }
      ],
      legs: [
        { mode: "metro", label: "M2・09:40 出發，10:20 抵達" },
        { mode: "walk", label: "步行" },
        { mode: "walk", label: "步行" },
        { mode: "walk", label: "步行" },
        { mode: "walk", label: "步行" },
        { mode: "walk", label: "步行" },
        { mode: "metro", label: "M1＋M4" }
      ]
    }]
  },
  "09-17": {
    defaultGroup: "versailles",
    groups: [{
      id: "versailles", label: "Versailles 全日", note: "主宮至特里亞農距離較長，下午可搭配園區小火車。",
      stops: [
        { time: "07:55", label: "Paris 飯店", detail: "巴黎北站出發", lat: 48.8836, lng: 2.3594, status: "start" },
        { time: "09:20", label: "Versailles Château-Rive Gauche", detail: "搭乘 RER B＋RER C", lat: 48.8004, lng: 2.1293, status: "transfer" },
        { time: "10:00", label: "Palace of Versailles", detail: "指定時段入場", lat: 48.8044, lng: 2.1203, status: "ticket" },
        { time: "13:30", label: "Gardens／Apollo Fountain", detail: "主中軸線花園", lat: 48.8084, lng: 2.1081, status: "planned" },
        { time: "15:30", label: "Grand Trianon", detail: "大特里亞農與小特里亞農", lat: 48.8151, lng: 2.1044, status: "planned" },
        { time: "18:05", label: "Versailles Château-Rive Gauche", detail: "返回車站", lat: 48.8004, lng: 2.1293, status: "transfer" },
        { time: "19:30 前", label: "Paris 飯店", detail: "RER C＋RER B 返回飯店", lat: 48.8836, lng: 2.3594, status: "stay" }
      ],
      legs: [
        { mode: "train", label: "RER B＋RER C" },
        { mode: "walk", label: "步行＋安檢" },
        { mode: "walk", label: "步行" },
        { mode: "walk", label: "步行／園區小火車" },
        { mode: "walk", label: "步行／接駁" },
        { mode: "train", label: "RER C＋RER B" }
      ]
    }]
  },
  "09-18": {
    defaultGroup: "airport",
    groups: [{
      id: "airport", label: "Paris → CDG", note: "今日不排景點；約 12:00 抵達 T2C。",
      stops: [
        { time: "10:30", label: "Paris 飯店", detail: "退房出發", lat: 48.8836, lng: 2.3594, status: "start" },
        { time: "約 11:00", label: "Gare du Nord", detail: "搭乘 RER B", lat: 48.8809, lng: 2.3553, status: "transfer" },
        { time: "約 12:00", label: "CDG Terminal 2C", detail: "托運、安檢與退稅", lat: 49.0036, lng: 2.5674, status: "fixed" },
        { time: "15:35", label: "CDG 起飛", detail: "EK 74 飛往杜拜", lat: 49.0036, lng: 2.5674, status: "fixed" }
      ],
      legs: [
        { mode: "walk", label: "步行" },
        { mode: "train", label: "RER B" },
        { mode: "flight", label: "EK 74" }
      ]
    }]
  },
  "09-19": {
    defaultGroup: "home",
    groups: [{
      id: "home", label: "杜拜 → 台北", note: "返台航班，時間均為當地時間。",
      stops: [
        { time: "04:05", label: "杜拜機場 T3", detail: "EK 366 起飛", lat: 25.2532, lng: 55.3657, status: "fixed" },
        { time: "16:35", label: "桃園機場 T2", detail: "平安返抵台灣", lat: 25.0797, lng: 121.2342, status: "fixed" }
      ],
      legs: [{ mode: "flight", label: "EK 366・約 8 小時 30 分" }]
    }]
  }
};

window.TRIP.bilingualNames = {
  "Sure Hotel by Best Western Paris Gare du Nord": "貝斯特韋斯特巴黎北站飯店",
  "Hostellerie Saint Vincent Beauvais Aéroport": "博韋機場聖文森旅館",
  "Fast and Compact 3D Gaussian Splatting with Polarized Opacity Prior": "使用偏振不透明度先驗的快速精簡 3D 高斯潑濺",
  "Teknikens och Sjöfartens hus": "科技與海事館",
  "Versailles Château-Rive Gauche": "凡爾賽宮左岸站",
  "Aéroport Charles de Gaulle 2 TGV": "戴高樂機場第二航廈 TGV 站",
  "Chaussée d'Antin-La Fayette": "昂坦－拉法葉站",
  "Saint-Michel-Notre-Dame": "聖米歇爾－聖母院站",
  "Strasbourg-Saint-Denis": "斯特拉斯堡－聖德尼站",
  "Copenhagen Airport T3": "哥本哈根機場第三航廈",
  "Copenhagen Airport T2": "哥本哈根機場第二航廈",
  "Beauvais-Tillé Airport": "博韋－蒂耶機場",
  "First Camp Sibbarp-Malmö": "馬爾默西巴普第一營地",
  "Malmöhus Castle & Malmö Museums": "馬爾默城堡與博物館",
  "Musée de l’Armée & Les Invalides": "軍事博物館與榮軍院",
  "Cathédrale Notre-Dame de Paris": "巴黎聖母院",
  "Boulevard du Palais": "司法宮大道",
  "Marché aux Fleurs": "巴黎花市",
  "Île de la Cité": "西岱島",
  "Place Dauphine": "多菲娜廣場",
  "Conciergerie": "巴黎古監獄",
  "Palace of Versailles": "凡爾賽宮",
  "Château de Versailles": "凡爾賽宮",
  "Gardens of Versailles": "凡爾賽花園",
  "Malmöhus Castle": "馬爾默城堡",
  "Art Museum": "美術館",
  "Aquarium": "水族館",
  "Disgusting Food Museum": "噁心食物博物館",
  "Classic Canal Tour": "經典運河遊船",
  "Stromma Classic Canal Tour": "斯特羅瑪經典運河遊船",
  "Experimentarium": "互動科學中心",
  "Dansk Arkitektur Center": "丹麥建築中心",
  "DAC": "丹麥建築中心",
  "BLOX": "BLOX 大樓",
  "BLOX Slide": "BLOX 巨型溜滑梯",
  "Slotskælderen hos Gitte Kik": "吉特菊克傳統三明治",
  "Paludan Bog & Café": "帕魯丹圖書館咖啡館",
  "Rosenborg Castle": "羅森堡城堡",
  "Christiansborg Palace": "克里斯蒂安堡宮",
  "Church of Our Saviour": "救主堂",
  "Dizzy Mizz Lizzy": "Dizzy Mizz Lizzy 樂團",
  "TorvehallerneKBH": "托維哈勒恩市場",
  "Tivoli Illuminations": "趣伏里燈光秀",
  "Tivoli Gardens": "趣伏里花園",
  "Friday Rock": "週五搖滾音樂會",
  "Changing of the Guard": "衛兵交接",
  "Galeries Lafayette": "老佛爺百貨",
  "Palais Garnier": "加尼葉歌劇院",
  "Sacré-Cœur": "聖心堂",
  "Sainte-Chapelle": "聖徒禮拜堂",
  "Notre-Dame de Paris": "巴黎聖母院",
  "Notre-Dame": "巴黎聖母院",
  "Musée de l’Armée": "軍事博物館",
  "Musée Rodin": "羅丹美術館",
  "Musée du Louvre": "羅浮宮",
  "Arc de Triomphe": "凱旋門",
  "Champs-Élysées": "香榭麗舍大道",
  "Place de la Concorde": "協和廣場",
  "Jardin des Tuileries": "杜樂麗花園",
  "Jardin du Luxembourg": "盧森堡公園",
  "Latin Quarter": "拉丁區",
  "Hall of Mirrors": "鏡廳",
  "State Apartments": "國王套房",
  "Trianon Estate": "特里亞農宮苑",
  "Grand Trianon": "大特里亞農宮",
  "Petit Trianon": "小特里亞農宮",
  "Apollo Fountain": "阿波羅噴泉",
  "Latona Fountain": "拉托娜噴泉",
  "Eiffel Tower": "艾菲爾鐵塔",
  "Champ de Mars": "戰神廣場",
  "Port de Suffren": "敘弗朗港",
  "Cour Napoléon": "拿破崙庭院",
  "Place d’Armes": "軍隊廣場",
  "Hôtel Biron": "比隆府",
  "Rue de Grenelle": "格勒內勒街",
  "Rue Scribe": "斯克里布街",
  "Malmö Saluhall": "馬爾默市場大廳",
  "Turning Torso": "旋轉大樓",
  "Västra Hamnen": "西港區",
  "Hellerup Station": "海勒魯普車站",
  "Hellerup": "海勒魯普",
  "Slottsträdgården": "城堡花園",
  "Malmö Arena": "馬爾默體育館",
  "Malmömässan": "馬爾默會展中心",
  "Malmö Museum": "馬爾默博物館",
  "Restaurant Wega": "維加餐廳",
  "Marmorkirken": "大理石教堂",
  "Amalienborg": "阿馬林堡宮",
  "Rundetaarn": "圓塔",
  "Rådhuspladsen": "市政廳廣場",
  "Strøget": "步行購物街",
  "Nyhavn": "新港",
  "Nyhavn 3": "新港 3 號碼頭",
  "Kongens Nytorv": "國王新廣場",
  "Gothersgade": "哥特斯街",
  "København H": "哥本哈根中央車站",
  "Malmö C": "馬爾默中央車站",
  "Hyllie Station": "許利耶車站",
  "Beauvais SNCF": "博韋火車站",
  "Gare de Beauvais": "博韋火車站",
  "Paris Gare du Nord": "巴黎北站",
  "Gare du Nord": "巴黎北站",
  "Paris Nord": "巴黎北站",
  "Gare de l’Est": "巴黎東站",
  "CDG Terminal 2C": "戴高樂機場第二航廈 C",
  "CPH": "哥本哈根機場",
  "CDG": "巴黎戴高樂機場",
  "First Camp Sibbarp": "西巴普第一營地",
  "First Camp": "第一營地",
  "Hyllie": "許利耶",
  "Hostellerie Saint Vincent": "聖文森旅館",
  "La Tour-Maubourg": "拉圖爾－莫布爾站",
  "Charles de Gaulle-Étoile": "戴高樂－星形廣場站",
  "Saint-Michel": "聖米歇爾",
  "Rue de la Huchette": "于歇特街",
  "Panthéon": "先賢祠",
  "Sorbonne": "索邦大學",
  "Montmartre": "蒙馬特",
  "Madeleine": "瑪德蓮站",
  "Abbesses": "阿貝斯站",
  "Anvers": "安特衛普站",
  "La Chapelle": "拉沙佩勒站",
  "Châtelet": "夏特雷站",
  "Cité": "西岱站",
  "Opéra": "歌劇院區",
  "Nørreport": "北門站",
  "Triangeln": "三角站",
  "Trianglen": "三角廣場站",
  "Götgatan": "哥特街站",
  "Øresundståg": "厄勒海峽列車",
  "Beauvais-Tillé": "博韋－蒂耶機場",
  "Kombibiljett": "一日聯票",
  "Main Conference": "主會議",
  "Poster #137": "海報編號 137",
  "Poster Session": "海報發表場次",
  "physical badge": "實體識別證",
  "badge": "識別證",
  "Ride Pass": "遊樂設施通行證",
  "Entrance": "入園票",
  "ticket house": "售票亭",
  "locker": "置物櫃",
  "King’s Guard": "國王衛隊",
  "Trianon": "特里亞農宮苑",
  "Palace": "宮殿",
  "Gardens": "花園",
  "Expo": "展覽會",
  "Taxi": "計程車",
  "optional": "彈性選項",
  "Invalides": "榮軍院",
  "Francette": "法蘭賽特餐廳",
  "Stromma": "斯特羅瑪遊船公司",
  "Wisdome": "穹頂影院",
  "The Port": "港口展區",
  "Ship Simulator": "船舶模擬器",
  "Labyrinth of Light": "光之迷宮",
  "Puzzler": "益智解謎展",
  "Under Your Skin": "探索你的身體",
  "Future Human": "未來人類",
  "Bubblearium": "泡泡館",
  "The Beach": "海灘展區",
  "Interactive Rooftop": "互動屋頂",
  "Construction Site": "建築工地",
  "Interactive Film Theatre": "互動電影劇場",
  "Louvre": "羅浮宮",
  "Tuileries": "杜樂麗花園",
  "Tivoli": "趣伏里花園",
  "Versailles": "凡爾賽",
  "Copenhagen": "哥本哈根",
  "Beauvais": "博韋",
  "Malmöhus": "馬爾默城堡",
  "Malmö": "馬爾默",
  "Paris": "巴黎"
};

// Explicit instants for flight segments whose departure and arrival use different zones.
window.TRIP.ticketDigests = {
  "arc-de-triomphe.enc": "ad8c0264b62fc07fc33ba293ab7cab1f2b547c72370e3cfdc670f03b03a4fc8f",
  "church-our-saviour.enc": "ec8ace8d563dd8fc59e6dc9019052626f19df829436826d89fcee50c8dc749f2",
  "ek367-boarding-pass.enc": "feeade13eee739347031ba3d2dea7989818ab889dda31512c3ba40963d756963",
  "emirates-flights.enc": "0ea0c116b6e11bbf76fc9e34469654aafcb6435ec6422dcf46139e16a9fd2895",
  "first-camp.enc": "ee39682d3345e27cc4592c8bd58cdffe56772a3c7b3259f275ca48dadb624cf6",
  "k7-pass.enc": "a626901ecea63d363597ff3cfc8ea9bf6944ab30b3fa7d5588c6e076d1540a06",
  "louvre.enc": "aaef5837fcd8bef43f7b29e1622d9d56716aef1f6d4be5765a055d4cb4bd8a2a",
  "ryanair-fr9267.enc": "bf2902a318fc57ce3565afb0fa93401c123fd48316ea5df216b5a4080f062557",
  "sainte-chapelle.enc": "12aa851c0e7308a1068146161357e6515f584c454adba8b2889975cedb52b9eb",
  "stromma-canal-tour.enc": "a0c81657aa4e234f0e0ebed5683e9e8fa83e4cb29d1c5d647959e66b6b2bf6c0",
  "versailles.enc": "e19943cce11bc3e6303d52fc25a75c3315afd57e62e0f4d289eb154c433482e5"
};

window.TRIP.scheduleTiming = {
  '09-06': { 3: { start: '2026-09-06T23:50:00+08:00', end: '2026-09-07T04:35:00+04:00', timezone: 'Asia/Taipei' } },
  '09-07': { 0: { timezone: 'Asia/Dubai' } },
  '09-18': { 4: { start: '2026-09-18T15:35:00+02:00', end: '2026-09-19T01:10:00+04:00', timezone: 'Europe/Paris' } },
  '09-19': {
    0: { timezone: 'Asia/Dubai' },
    1: { start: '2026-09-19T04:05:00+04:00', end: '2026-09-19T16:35:00+08:00', timezone: 'Asia/Dubai' }
  }
};
