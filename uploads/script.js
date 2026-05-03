/* ============================================
   YAO Pinshuo — Academic Homepage Script
   Trilingual i18n (EN / ZH / JA)
   ============================================ */

const i18n = {
  en: {
    "nav.about": "About",
    "nav.research": "Research",
    "nav.publications": "Publications",
    "nav.education": "Education",
    "nav.news": "News",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "hero.greeting": "Hi, I'm",
    "hero.name": "YAO Pinshuo <span class=\"name-cn\">姚品碩</span>",
    "hero.title": "Ph.D. Student at The University of Tokyo",
    "hero.desc": "Exploring the intersection of AI-driven Protein Design and Biophysics to decode lipid-protein interactions at the Tsuboyama Lab, Institute of Industrial Science.",
    "hero.btn.about": "About Me",
    "hero.btn.contact": "Contact",
    "about.title": "About Me",
    "about.p1": "My name is YAO Pinshuo. I am currently a Ph.D. student at the Tsuboyama Laboratory, Institute of Industrial Science (IIS), The University of Tokyo, focusing on AI-driven protein design. I am passionate about exploring the molecular basis of life and committed to developing novel methods to address challenges in biology and medicine.",
    "about.p2": "My Ph.D. research spans two main projects: (1) High-throughput screening to map the phospholipid-binding landscape of peripheral membrane proteins, combined with machine learning to elucidate the underlying principles of selectivity; (2) Establishing a standardized BLI-based method for measuring lipid-protein binding kinetics with accuracy and reproducibility.",
    "about.p3": "During my Master's, I induced mouse sperm chromosome decondensation via NPM protein in vitro and elucidated the effects of divalent metal cations on sperm chromatin compaction. Building on this, I achieved sperm nucleus decondensation, selective epigenetic mark erasure, re-condensation, followed by ICSI to observe how alterations in residual histone modifications affect early embryonic development.",
    "about.quickinfo": "Quick Info",
    "about.lab": "Tsuboyama Lab",
    "about.position": "Ph.D. Student",
    "about.languages": "Languages",
    "about.lang.zh": "Chinese — Native",
    "about.lang.ja": "Japanese — Advanced",
    "about.lang.en": "English — Advanced",
    "about.certs": "Certifications",
    "about.cert.dive": "Open Water Diver",
    "about.cert.drive": "Japanese Driver's License",
    "research.title": "Research Interests",
    "research.current": "Current Projects",
    "research.proj1.title": "Phospholipid-Binding Landscape of Peripheral Membrane Proteins",
    "research.proj1.desc": "High-throughput screening to map the phospholipid-binding profiles of peripheral membrane proteins, combined with machine learning approaches to explain the underlying principles of binding selectivity.",
    "research.proj2.title": "Standardized BLI Method for Lipid-Protein Binding Kinetics",
    "research.proj2.desc": "Establishing a standardized bio-layer interferometry (BLI) method for measuring lipid-protein binding kinetics, optimizing protocols to achieve accurate and reproducible measurements as a universal approach.",
    "research.interests": "Research Interests",
    "research.card1.title": "AI in Biology",
    "research.card1.desc": "Applying artificial intelligence to biological problems, from structure prediction to functional annotation.",
    "research.card2.title": "De Novo Protein Design",
    "research.card2.desc": "Protein structure prediction and de novo design, engineering proteins with novel functions from scratch.",
    "research.card3.title": "Large-Scale Bio Data & ML",
    "research.card3.desc": "Large-scale biological data analysis combined with machine learning for high-throughput discovery.",
    "research.card4.title": "Protein Engineering",
    "research.card4.desc": "Protein engineering and directed evolution to optimize function and create new molecular tools.",
    "research.future": "Future Directions",
    "research.fut1.title": "Better De Novo Proteins",
    "research.fut1.desc": "Developing universal methods to optimize protein binder specificity; advancing from single protein design to regulatory system engineering.",
    "research.fut2.title": "Protein Circuits & Virtual Cells",
    "research.fut2.desc": "Protein circuit development, whole-cell modeling, and virtual cell simulation — scaling from molecules to systems.",
    "research.skills": "Model Organisms & Techniques",
    "research.organisms": "Model Organisms",
    "research.techniques": "Techniques",
    "pub.title": "Publications & Presentations",
    "pub.presentations": "Conference Presentations",
    "pub.pres1.title": "Analysis of Divalent Cation Effects on Sperm Chromatin Structure",
    "pub.pres1.venue": "Joint \"Wakate-no-kai 2022\" of New Academic / Academic Transformation Areas, Rinku, Osaka",
    "pub.pres2.title": "Effects of Divalent Cations on Sperm Chromatin Structure & Ex Vivo Reconstitution",
    "pub.pres2.venue": "22nd UTokyo Life Sciences Symposium BIO UT, Komaba Campus",
    "pub.pres3.venue": "16th Annual Meeting of the Japan Epigenetics Research Society, Hitotsubashi Hall",
    "pub.pres4.title": "Ex Vivo Sperm Chromatin Reconstitution: An Innovative Approach",
    "pub.pres4.venue": "IQB Research Exchange Meeting 2023, Institute for Quantitative Biosciences, UTokyo",
    "pub.papers": "Journal Papers",
    "pub.inprogress": "In preparation... Stay tuned!",
    "pub.funding": "Funding",
    "pub.funding.desc": "Japan Science and Technology Agency (JST) — Support for Pioneering Research Initiated by the Next Generation (SPRING): Green Transformation (GX) Program for Advanced Human Resource Development",
    "pub.awards": "Awards",
    "pub.pres5.venue": "IPR International Conference 2025, Awaji Island, Japan",
    "pub.award1.title": "Outstanding Graduate Award — Interdisciplinary Sciences (広域科学専攻奨励賞)",
    "pub.award1.desc": "Awarded upon graduation from the Graduate School of Arts and Sciences, The University of Tokyo — FY2023",
    "edu.title": "Education & Experience",
    "edu.education": "Education",
    "edu.present": "Present",
    "edu.phd": "Ph.D. in Chemical Biotechnology",
    "edu.utokyo": "The University of Tokyo",
    "edu.phd.detail": "Institute of Industrial Science (IIS) · Tsuboyama Lab<br>Advisor: Prof. Kotaro Tsuboyama (坪山幸太郎)<br>Research: AI-assisted Protein Design",
    "edu.ms": "M.S. in Life Sciences",
    "edu.ms.detail": "Institute for Quantitative Biosciences (IQB)<br>Advisor: Prof. Yuki Okada (岡田由紀)<br>Research: Sperm Chromatin & Epigenetics",
    "edu.bs": "B.S. in Biological Sciences",
    "edu.nodai": "Tokyo University of Agriculture",
    "edu.bs.detail": "Faculty of Life Sciences · Dept. of Biological Sciences<br>Research: Structural Biology",
    "edu.lang": "Japanese Language Program",
    "edu.fuji": "Fuji International Language Institute, Tokyo",
    "edu.hs": "Secondary Education",
    "edu.hs.detail": "Harbin No.3 High School (Qunli Campus), 2014–2017<br>Harbin Guanghua Middle School, 2010–2014",
    "edu.experience": "Experience",
    "exp.web": "Web Maintenance (Part-time)",
    "exp.ra": "Technical Assistant / RA",
    "edu.activities": "Activities & Leadership",
    "act.nodai": "Chinese Students' Association, Tokyo Univ. of Agriculture",
    "act.nodai.detail": "President — organized international student exchange events",
    "act.freebird": "Freebird — China-Japan Friendship Exchange Group",
    "act.freebird.detail": "Active member during graduate school — promoting cultural exchange",
    "hobby.title": "Hobbies",
    "hobby.hiking": "Hiking & Camping",
    "hobby.hiking.desc": "Kamikochi, Oze, Tateyama Kurobe — exploring Japan's mountains across all seasons.",
    "hobby.dive": "Scuba Diving",
    "hobby.dive.desc": "Open Water certified diver. Fascinated by marine biodiversity.",
    "hobby.photo": "Photography",
    "hobby.photo.desc": "Capturing landscapes and cultural moments during travels across Japan.",
    "hobby.ski": "Skiing",
    "hobby.ski.desc": "Winter skiing in Niigata — embracing Japan's famous powder snow.",
    "hobby.seasonal": "Seasonal Activities",
    "hobby.seasonal.desc": "Spring cherry blossoms in Izu, summer hydrangeas in Kamakura — living by the seasons.",
    "news.title": "News",
    "news.n1.title": "Poster at IPR International Conference 2025",
    "news.n1.desc": "Presented research on protein–phospholipid binding at Awaji Island, Japan.",
    "news.n2.title": "Started Ph.D. Program",
    "news.n2.desc": "Officially enrolled as a Ph.D. student in Chemical Biotechnology, Graduate School of Engineering, UTokyo.",
    "news.n3.title": "Joined Tsuboyama Lab as Research Student",
    "news.n3.desc": "Started research at the Biomolecular Design Engineering Lab, IIS, The University of Tokyo.",
    "news.n4.title": "Outstanding Graduate Award & M.S. Completion",
    "news.n4.desc": "Recognized as an outstanding graduate with the Interdisciplinary Sciences Award upon completing M.S. at UTokyo.",
    "contact.title": "Let's Connect",
    "contact.desc": "I'm always open to discussing research collaborations, AI for Science, or sharing ideas. Feel free to reach out through any channel below.",
    "contact.phone": "Phone",
    "contact.xiaohongshu": "Xiaohongshu (RED)",
    "contact.office": "Office"
  },
  zh: {
    "nav.about": "关于",
    "nav.research": "研究",
    "nav.publications": "成果",
    "nav.education": "经历",
    "nav.news": "动态",
    "nav.gallery": "画廊",
    "nav.contact": "联系",
    "hero.greeting": "你好，我是",
    "hero.name": "姚品碩 <span class=\"name-cn\">YAO Pinshuo</span>",
    "hero.title": "东京大学 博士研究生",
    "hero.desc": "在东京大学生产技术研究所坪山实验室，探索AI驱动的蛋白质设计与生物物理学的交叉领域，解码脂质-蛋白质相互作用。",
    "hero.btn.about": "了解更多",
    "hero.btn.contact": "联系我",
    "about.title": "关于我",
    "about.p1": "我叫姚品碩，目前是东京大学生产技术研究所坪山研究室的一名博士生，专注于利用人工智能技术进行蛋白质设计的研究。我对探索生命的分子基础充满热情，并致力于开发能够解决生物学和医学挑战的新方法。",
    "about.p2": "我的博士研究涵盖两个主要项目：（1）通过高通量筛选绘制膜外周蛋白的磷脂结合图谱，并结合机器学习方法解释结合选择性的底层原理；（2）建立基于BLI系统的标准化方法，用于测定脂质-蛋白质结合动力学，通过优化方法实现准确且易复现的通用方案。",
    "about.p3": "硕士期间，我通过NPM蛋白在体外诱导小鼠精子染色体解压缩，阐明了二价金属阳离子对精子染色质压缩结构的影响。在此基础上实现了精子核解压缩、特定表观遗传修饰擦除、重新压缩，并通过ICSI观察精子残存组蛋白修饰的改变对初期胚胎发育的影响。",
    "about.quickinfo": "基本信息",
    "about.lab": "坪山研究室",
    "about.position": "博士研究生",
    "about.languages": "语言能力",
    "about.lang.zh": "中文 — 母语",
    "about.lang.ja": "日语 — 高级水平",
    "about.lang.en": "英语 — 高级水平",
    "about.certs": "资格证书",
    "about.cert.dive": "OW潜水证书",
    "about.cert.drive": "日本驾驶执照",
    "research.title": "科研兴趣",
    "research.current": "当前项目",
    "research.proj1.title": "膜外周蛋白的磷脂结合图谱",
    "research.proj1.desc": "通过高通量筛选绘制膜外周蛋白的磷脂结合谱，结合机器学习方法解释结合选择性的底层原理。",
    "research.proj2.title": "BLI标准化脂质-蛋白质结合动力学方法",
    "research.proj2.desc": "建立基于生物膜干涉（BLI）技术的标准化方法，用于测定脂质-蛋白质结合动力学，优化方案以实现准确且可重复的通用方法。",
    "research.interests": "研究方向",
    "research.card1.title": "人工智能在生物学中的应用",
    "research.card1.desc": "将人工智能应用于生物学问题，从结构预测到功能注释。",
    "research.card2.title": "蛋白质从头设计",
    "research.card2.desc": "蛋白质结构预测与从头设计（De Novo），从零开始工程化具有新功能的蛋白质。",
    "research.card3.title": "大规模生物数据与机器学习",
    "research.card3.desc": "大规模生物数据分析与机器学习相结合，实现高通量发现。",
    "research.card4.title": "蛋白质工程与定向进化",
    "research.card4.desc": "蛋白质工程与定向进化，优化功能并创造新的分子工具。",
    "research.future": "未来方向",
    "research.fut1.title": "更优的从头设计蛋白",
    "research.fut1.desc": "开发优化蛋白质binder特异性的通用方法；从单个蛋白设计上升到调控系统工程。",
    "research.fut2.title": "蛋白质电路与虚拟细胞",
    "research.fut2.desc": "蛋白质电路开发、全细胞建模与虚拟细胞模拟——从分子走向系统。",
    "research.skills": "模式生物与实验技术",
    "research.organisms": "模式生物",
    "research.techniques": "实验技术",
    "pub.title": "学术成果",
    "pub.presentations": "学会·会议发表",
    "pub.pres1.title": "二价阳离子对精子染色质结构的影响解析",
    "pub.pres1.venue": "新学术·学术变革领域联合「若手の会 2022」，大阪府泉南市Rinku",
    "pub.pres2.title": "二价阳离子对精子染色质结构的影响及精子染色质ex vivo再构成",
    "pub.pres2.venue": "第22回东京大学生命科学研讨会 BIO UT，驹场校区",
    "pub.pres3.venue": "第16回日本表观遗传学研究会年会，一桥讲堂",
    "pub.pres4.title": "精子染色质体外再构成：革新的方法",
    "pub.pres4.venue": "2023年度定量研究交流会，东京大学定量生命科学研究所",
    "pub.papers": "论文",
    "pub.inprogress": "撰写中……敬请期待！",
    "pub.funding": "科研经费",
    "pub.funding.desc": "日本科学技术振兴机构（JST）次世代研究者挑战性研究项目（SPRING）：绿色转型（GX）高级人才培养计划",
    "pub.awards": "获奖荣誉",
    "pub.pres5.venue": "IPR国际会议2025，日本淡路岛",
    "pub.award1.title": "优秀毕业生奖 — 广域科学专攻奖励奖（広域科学専攻奨励賞）",
    "pub.award1.desc": "东京大学综合文化研究科毕业时授予 — 令和5年度",
    "edu.title": "教育与经历",
    "edu.education": "教育背景",
    "edu.present": "至今",
    "edu.phd": "博士 · 化学生命工学",
    "edu.utokyo": "东京大学",
    "edu.phd.detail": "生产技术研究所（IIS）· 坪山研究室<br>导师：坪山幸太郎 教授<br>研究方向：AI辅助蛋白质设计",
    "edu.ms": "硕士 · 生命科学",
    "edu.ms.detail": "定量生命科学研究所（IQB）<br>导师：岡田由紀 教授<br>研究方向：精子染色体与表观遗传学",
    "edu.bs": "学士 · 生物科学",
    "edu.nodai": "东京农业大学",
    "edu.bs.detail": "生命科学部 · 生物科学科<br>研究方向：结构生物学",
    "edu.lang": "日语预科",
    "edu.fuji": "富士国际语学院，东京",
    "edu.hs": "基础教育",
    "edu.hs.detail": "哈尔滨市第三中学（群力校区），2014–2017<br>哈尔滨市光华中学，2010–2014",
    "edu.experience": "职业经历",
    "exp.web": "网站更新维护（兼职）",
    "exp.ra": "技术辅佐员 / RA",
    "edu.activities": "社团与领导经验",
    "act.nodai": "东京农业大学中国人留学生学友会",
    "act.nodai.detail": "担任会长 — 负责组织留学生交流活动",
    "act.freebird": "Freebird — 中日友好交流团体",
    "act.freebird.detail": "研究生期间积极参与 — 促进中日文化交流",
    "hobby.title": "兴趣爱好",
    "hobby.hiking": "徒步露营",
    "hobby.hiking.desc": "上高地、尾濑、立山黑部——四季探索日本的山岳风光。",
    "hobby.dive": "潜水",
    "hobby.dive.desc": "持有OW潜水证书，对海洋生物多样性充满好奇。",
    "hobby.photo": "摄影",
    "hobby.photo.desc": "记录旅途中的自然风光与人文景观。",
    "hobby.ski": "滑雪",
    "hobby.ski.desc": "冬季在新潟滑雪——享受日本著名的粉雪。",
    "hobby.seasonal": "季节活动",
    "hobby.seasonal.desc": "春季伊豆河津樱花，夏季镰仓紫阳花——随四季而生活。",
    "news.title": "最新动态",
    "news.n1.title": "IPR国际会议2025海报发表",
    "news.n1.desc": "在日本淡路岛发表关于蛋白质-磷脂结合的研究成果。",
    "news.n2.title": "博士课程入学",
    "news.n2.desc": "正式进入东京大学工学系研究科化学生命工学专攻博士课程。",
    "news.n3.title": "以研究生身份加入坪山研究室",
    "news.n3.desc": "在东京大学生产技术研究所生物分子设计工学实验室开始研究。",
    "news.n4.title": "获优秀毕业生奖 & 硕士毕业",
    "news.n4.desc": "以优秀毕业生身份获得广域科学专攻奖励奖；获得东京大学硕士学位。",
    "contact.title": "联系我",
    "contact.desc": "我随时欢迎讨论科研合作、AI for Science或交流想法。欢迎通过以下任何方式联系我。",
    "contact.phone": "电话",
    "contact.xiaohongshu": "小红书",
    "contact.office": "办公地点"
  },
  ja: {
    "nav.about": "概要",
    "nav.research": "研究",
    "nav.publications": "業績",
    "nav.education": "経歴",
    "nav.news": "ニュース",
    "nav.gallery": "ギャラリー",
    "nav.contact": "連絡先",
    "hero.greeting": "はじめまして、",
    "hero.name": "<ruby>姚<rp>(</rp><rt>よう</rt><rp>)</rp></ruby> <ruby>品碩<rp>(</rp><rt>ぴんしゅう</rt><rp>)</rp></ruby> <span class=\"name-cn\">YAO Pinshuo</span>",
    "hero.title": "東京大学 博士課程学生",
    "hero.desc": "東京大学生産技術研究所の坪山研究室にて、AI駆動型タンパク質設計と生物物理学の融合領域を探求し、脂質-タンパク質相互作用の解読に取り組んでいます。",
    "hero.btn.about": "詳しく見る",
    "hero.btn.contact": "連絡する",
    "about.title": "自己紹介",
    "about.p1": "姚品碩と申します。現在、東京大学生産技術研究所の坪山研究室にて博士課程に在籍し、AIを活用したタンパク質設計の研究に取り組んでいます。生命の分子基盤の探求に情熱を持ち、生物学・医学の課題に取り組む新たな手法の開発に尽力しています。",
    "about.p2": "博士研究では2つの主要プロジェクトに取り組んでいます：（1）ハイスループットスクリーニングによる末梢膜タンパク質のリン脂質結合ランドスケープの描写と、機械学習による選択性の原理解明；（2）BLIシステムを用いた脂質-タンパク質結合動態測定の標準化手法の確立。",
    "about.p3": "修士課程では、NPMタンパク質によるマウス精子染色体のin vitro脱凝縮を誘導し、二価金属カチオンが精子クロマチン圧縮構造に与える影響を解明しました。さらに、精子核の脱凝縮、特定のエピジェネティック修飾の消去、再凝縮を経てICSIを行い、残存ヒストン修飾の変化が初期胚発生に与える影響を観察しました。",
    "about.quickinfo": "基本情報",
    "about.lab": "坪山研究室",
    "about.position": "博士課程学生",
    "about.languages": "語学力",
    "about.lang.zh": "中国語 — 母語",
    "about.lang.ja": "日本語 — 上級",
    "about.lang.en": "英語 — 上級",
    "about.certs": "資格",
    "about.cert.dive": "OWダイビングライセンス",
    "about.cert.drive": "日本の運転免許証",
    "research.title": "研究分野",
    "research.current": "現在のプロジェクト",
    "research.proj1.title": "末梢膜タンパク質のリン脂質結合ランドスケープ",
    "research.proj1.desc": "ハイスループットスクリーニングにより末梢膜タンパク質のリン脂質結合プロファイルを描写し、機械学習により結合選択性の基本原理を解明します。",
    "research.proj2.title": "BLIによる脂質-タンパク質結合動態の標準化手法",
    "research.proj2.desc": "バイオレイヤー干渉法（BLI）を用いた脂質-タンパク質結合動態測定の標準化手法を確立し、正確で再現性の高い汎用的な方法を目指します。",
    "research.interests": "研究分野",
    "research.card1.title": "AIと生物学",
    "research.card1.desc": "構造予測から機能アノテーションまで、生物学的問題への人工知能の応用。",
    "research.card2.title": "De Novoタンパク質設計",
    "research.card2.desc": "タンパク質構造予測とde novo設計、ゼロから新機能を持つタンパク質を工学的に創出。",
    "research.card3.title": "大規模生物データ＆ML",
    "research.card3.desc": "大規模生物データ解析と機械学習の融合によるハイスループット発見。",
    "research.card4.title": "タンパク質工学",
    "research.card4.desc": "タンパク質工学と指向性進化による機能最適化と新たな分子ツールの創出。",
    "research.future": "将来の方向性",
    "research.fut1.title": "より優れたDe Novoタンパク質",
    "research.fut1.desc": "タンパク質バインダーの特異性を最適化する汎用手法の開発；単一タンパク質設計から制御システム工学へ。",
    "research.fut2.title": "タンパク質回路と仮想細胞",
    "research.fut2.desc": "タンパク質回路の開発、全細胞モデリング、仮想細胞シミュレーション — 分子からシステムへ。",
    "research.skills": "モデル生物と実験技術",
    "research.organisms": "モデル生物",
    "research.techniques": "実験技術",
    "pub.title": "業績",
    "pub.presentations": "学会・会議発表",
    "pub.pres1.title": "二価陽イオンが精子クロマチン構造に与える影響の解析",
    "pub.pres1.venue": "新学術・学術変革領域合同「若手の会 2022」、大阪府泉南市りんくう",
    "pub.pres2.title": "二価陽イオンが精子クロマチン構造に与える影響及び精子クロマチンex vivo再構成",
    "pub.pres2.venue": "第22回東京大学生命科学シンポジウム BIO UT、駒場キャンパス",
    "pub.pres3.venue": "第16回日本エピジェネティクス研究会年会、一橋講堂",
    "pub.pres4.title": "精子クロマチン体外再構成：革新的手法",
    "pub.pres4.venue": "2023年度定量研究交流会、東京大学定量生命科学研究所",
    "pub.papers": "論文",
    "pub.inprogress": "準備中…お楽しみに！",
    "pub.funding": "研究資金",
    "pub.funding.desc": "国立研究開発法人科学技術振興機構（JST）次世代研究者挑戦的研究プログラム（SPRING）：グリーントランスフォーメーション（GX）を先導する高度人材育成",
    "pub.awards": "受賞歴",
    "pub.pres5.venue": "IPR国際会議2025、淡路島、日本",
    "pub.award1.title": "優秀修了生表彰 — 広域科学専攻奨励賞",
    "pub.award1.desc": "東京大学総合文化研究科修了時に授与 — 令和5年度",
    "edu.title": "学歴・経歴",
    "edu.education": "学歴",
    "edu.present": "現在",
    "edu.phd": "博士課程 · 化学生命工学",
    "edu.utokyo": "東京大学",
    "edu.phd.detail": "生産技術研究所（IIS）· 坪山研究室<br>指導教員：坪山幸太郎 教授<br>研究：AI支援タンパク質設計",
    "edu.ms": "修士課程 · 生命科学",
    "edu.ms.detail": "定量生命科学研究所（IQB）<br>指導教員：岡田由紀 教授<br>研究：精子クロマチンとエピジェネティクス",
    "edu.bs": "学士 · 生物科学",
    "edu.nodai": "東京農業大学",
    "edu.bs.detail": "生命科学部 · 生物科学科<br>研究：構造生物学",
    "edu.lang": "日本語課程",
    "edu.fuji": "富士国際語学院、東京",
    "edu.hs": "基礎教育",
    "edu.hs.detail": "ハルビン市第三中学校（群力キャンパス）、2014–2017<br>ハルビン市光華中学校、2010–2014",
    "edu.experience": "職歴",
    "exp.web": "ウェブサイト更新管理（アルバイト）",
    "exp.ra": "技術補佐員 / RA",
    "edu.activities": "課外活動・リーダーシップ",
    "act.nodai": "東京農業大学中国人留学生学友会",
    "act.nodai.detail": "会長 — 留学生交流イベントの企画運営",
    "act.freebird": "Freebird — 日中友好交流団体",
    "act.freebird.detail": "大学院在籍中に積極的に参加 — 日中文化交流の促進",
    "hobby.title": "趣味",
    "hobby.hiking": "登山・キャンプ",
    "hobby.hiking.desc": "上高地、尾瀬、立山黒部 — 四季を通じて日本の山岳を探索。",
    "hobby.dive": "スキューバダイビング",
    "hobby.dive.desc": "OWライセンス保持。海洋生物の多様性に魅了されています。",
    "hobby.photo": "写真撮影",
    "hobby.photo.desc": "旅先での自然風景と人文的な瞬間を記録。",
    "hobby.ski": "スキー",
    "hobby.ski.desc": "冬は新潟でスキー — 日本のパウダースノーを満喫。",
    "hobby.seasonal": "季節の活動",
    "hobby.seasonal.desc": "春は伊豆の河津桜、夏は鎌倉のアジサイ — 季節と共に暮らす。",
    "news.title": "ニュース",
    "news.n1.title": "IPR国際会議2025でポスター発表",
    "news.n1.desc": "日本の淡路島でタンパク質-リン脂質結合に関する研究成果を発表。",
    "news.n2.title": "博士課程入学",
    "news.n2.desc": "東京大学工学系研究科化学生命工学専攻の博士課程に正式入学。",
    "news.n3.title": "研究生として坪山研究室に参加",
    "news.n3.desc": "東京大学生産技術研究所の生体分子設計工学研究室で研究を開始。",
    "news.n4.title": "優秀修了生表彰＆修士修了",
    "news.n4.desc": "優秀な修了生として広域科学専攻奨励賞を受賞；東京大学修士号を取得。",
    "contact.title": "ご連絡ください",
    "contact.desc": "共同研究、AI for Science、アイデアの交換など、いつでもお気軽にご連絡ください。",
    "contact.phone": "電話番号",
    "contact.xiaohongshu": "小紅書（RED）",
    "contact.office": "オフィス"
  }
};

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLang();
    initMobileMenu();
    initScrollEffects();
});

/* --- Theme --- */
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
            updateThemeIcon(!isDark);
        });
    }
}
function updateThemeIcon(isDark) {
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

/* --- Language --- */
function initLang() {
    const saved = localStorage.getItem('lang') || 'en';
    applyLang(saved);
    document.querySelectorAll('.lang-select').forEach(sel => {
        sel.value = saved;
        sel.addEventListener('change', (e) => {
            applyLang(e.target.value);
            localStorage.setItem('lang', e.target.value);
            // sync all selectors
            document.querySelectorAll('.lang-select').forEach(s => s.value = e.target.value);
        });
    });
}

function applyLang(lang) {
    const dict = i18n[lang] || i18n.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            // preserve innerHTML for keys containing <br> tags
            if (dict[key].includes('<br>') || dict[key].includes('<')) {
                el.innerHTML = dict[key];
            } else {
                el.textContent = dict[key];
            }
        }
    });
    document.documentElement.lang = lang;
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (toggle && overlay) {
        toggle.addEventListener('click', () => {
            overlay.classList.toggle('open');
            const icon = toggle.querySelector('i');
            icon.className = overlay.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
        });
        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                overlay.classList.remove('open');
                toggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}

/* --- Scroll --- */
function initScrollEffects() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
    });
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.research-card, .project-card, .future-card, .timeline-item, .news-item, .info-card, .pub-item, .hobby-card, .funding-card, .award-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
