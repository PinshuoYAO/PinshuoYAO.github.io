// app.jsx — main React app for YAO Pinshuo HP
const { useState, useEffect, useRef } = React;

const I18N = {
  en: {
    nav: { about: "About", research: "Research", pubs: "Publications", edu: "Path", news: "News", contact: "Contact" },
    hero: {
      meta: ["UTOKYO · IIS", "TSUBOYAMA LAB", "PHD CANDIDATE"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "I work at the intersection of AI-driven protein design and biophysics — uncovering how proteins recognize the phospholipid signatures that define cellular membranes.",
      cta1: "Read the work", cta2: "Get in touch",
    },
    about: {
      eyebrow: "01 / About",
      title: "A scientist between cities, languages, and disciplines.",
      p1: "I'm Yao Pinshuo. I grew up in Harbin, learned Japanese in Tokyo at sixteen, fell in love with biology at Tokyo University of Agriculture, and never stopped chasing molecules.",
      p2: "Today I am a PhD student at the Institute of Industrial Science, UTokyo, in the Tsuboyama Lab. My instruments are yeast displays, machine learning models, and BLI sensors. My questions: how does a protein know which lipid it loves, and can we teach a computer to design new ones from scratch?",
      p3: "Outside the lab you'll find me on a mountain trail, behind a slow camera, or planning the next quiet trip.",
      coordinatesTitle: "Coordinates",
      coords: [["city","Tokyo, JP"],["institute","UTokyo · IIS"],["lab","Tsuboyama"],["role","PhD candidate"]],
      languagesTitle: "Languages",
      langs: [["中文","Native"],["日本語","Advanced"],["English","Advanced"]],
    },
    research: {
      eyebrow: "02 / Research",
      title: "How do proteins recognize the phospholipids that define a membrane?",
      lede: "Each membrane in a eukaryotic cell carries a distinct phospholipid signature; protein domains read those signatures to localize signaling, traffic cargo, and shape compartments. I want to understand how that recognition works — quantitatively, and at scale.",
      intro2: "Two parallel tracks. One quantitative — measuring binding kinetics with rigor. One exploratory — letting machines find the patterns we cannot see by hand. Together they map the molecular logic of phospholipid recognition.",
      proj: [
        {
          n: "01",
          title: "A large-scale map of protein–phosphoinositide recognition",
          tags: ["High-throughput", "NGS", "Machine Learning"],
          summary: "Phosphoinositides (PIPs) are eight phosphorylated lipids that label distinct compartments of the endomembrane system — PI(4,5)P₂ at the plasma membrane, PI(3)P on early endosomes, PI(3,5)P₂ on late endosomes, and so on. Lipid-binding domains (PH, PX, ENTH, GRAM, GLUE, C2 …) read these tiny phosphate decorations to control signaling, membrane trafficking, and cytoskeletal dynamics; a single mis-recognition (e.g. AKT1 PH E17K) can drive disease. Yet despite decades of case studies, no general rules describe how a given domain discriminates between the eight PIP species. Working in the Tsuboyama Lab, I assemble large-scale, comparable binding datasets across thousands of domains and lipid species, and use machine learning to look for the recognition rules underneath.",
          stats: [["~20k", "domains profiled"], ["13", "lipid species"], ["ML", "interpretability"]],
        },
        {
          n: "02",
          title: "Optimized liposome-based BLI for protein–phospholipid kinetics",
          tags: ["BLI", "Kinetics", "Liposomes"],
          summary: "Most protein–lipid assays report only equilibrium binding strength — they cannot tell you whether a tighter affinity comes from a faster kₒₙ or a slower k_off, even though those two routes carry very different biological consequences. Bio-layer interferometry (BLI) can resolve real-time kinetics, but on lipid surfaces it is plagued by nonspecific protein adsorption. Through systematic buffer optimization (0.5% BSA, 0.001% Tween-20), we suppressed background binding while preserving liposome integrity, and recovered kₒₙ, k_off, and K_D for representative PX and PH domains and their mutant series. The platform distinguishes kinetic mechanisms — for the AKT1 PH series, affinity gains came mostly from slower k_off; for SnxA PX, from faster kₒₙ — information equilibrium binding alone cannot reveal.",
          stats: [["kₒₙ · k_off", "real-time"], ["nM", "affinity range"], ["Open", "protocol"]],
        },
      ],
      interestsTitle: "Currents I follow",
      interests: [
        ["AI × Biology", "From AlphaFold to interpretable function. Models that read sequence and dream structure."],
        ["De novo design", "Engineering proteins with new functions, atom by atom, from a blank page."],
        ["High-throughput data", "Screens that produce more data than any human can read; ML to read them."],
        ["Protein engineering", "Directed evolution and rational design — the slow art of making molecules better."],
      ],
      organismsTitle: "Model organisms",
      organisms: ["E. coli", "S. cerevisiae", "Mouse"],
      techsTitle: "Techniques",
      techs: ["Yeast Display", "BLI Kinetics", "NGS", "FACS", "Protein Purification", "Liposome Prep", "Fluorescence Microscopy", "ICSI", "Western Blot", "Comet Assay", "AI Protein Design Tools", "HTS Workflows"],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "03 / Path",
      title: "From Harbin to Tokyo — a path written in cities and disciplines.",
      items: [
        { date: "2025 — Now", current: true, h: "PhD · Chemical Biotechnology", inst: "The University of Tokyo, IIS · Tsuboyama Lab", detail: "AI-assisted protein design under Prof. Kotaro Tsuboyama." },
        { date: "2024 — 2025", h: "Research Student", inst: "UTokyo IIS · Tsuboyama Lab", detail: "Joined the lab and started the lipid-binding screen." },
        { date: "2022 — 2024", h: "MSc · Life Sciences", inst: "The University of Tokyo, IQB · Okada Lab", detail: "Built a method for reversible decondensation–recondensation of sperm chromatin and verified development by ICSI from epigenome-edited sperm. Outstanding Graduate Award." },
        { date: "2018 — 2022", h: "BSc · Biological Sciences", inst: "Tokyo University of Agriculture · Yajima Lab", detail: "Structural biology of an IclR-family transcription factor; early adopter of AlphaFold2 / RoseTTAFold inside the lab." },
        { date: "2016 — 2018", h: "Japanese Language Program", inst: "Fuji International Language Institute, Tokyo", detail: "Moved to Japan at sixteen. Learned a third language from scratch." },
        { date: "2010 — 2017", h: "Secondary Education", inst: "Harbin No.3 High School (Qunli) & Guanghua Middle School", detail: "Northeast China. Where the curiosity began." },
      ],
    },
    pubs: {
      eyebrow: "04 / Output",
      title: "Papers, talks, and what's coming next.",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "Decoding the Universal Principles of Protein–Phospholipid Binding", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR International Conference 2025, Awaji Island, Japan" },
        { date: "2023.12", type: "Poster P-25", title: "Ex Vivo Sperm Chromatin Reconstitution: An Innovative Approach", venue: "IQB Research Exchange Meeting 2023, UTokyo" },
        { date: "2023.06", type: "Poster P-49", title: "Establishment of ex vivo Sperm Chromatin Reconstitution Method", venue: "16th Annual Meeting of the Japan Epigenetics Research Society, Hitotsubashi Hall" },
        { date: "2023.06", type: "Poster", title: "Effects of Divalent Cations on Sperm Chromatin Structure & Ex Vivo Reconstitution", venue: "22nd UTokyo Life Sciences Symposium BIO UT, Komaba Campus" },
        { date: "2022.11", type: "Poster P-25", title: "Analysis of Divalent Cation Effects on Sperm Chromatin Structure", venue: "Joint \"Wakate-no-kai 2022\", Rinku, Osaka" },
      ],
      papersTitle: "Papers",
      papers: [
        { date: "2026", status: "Under review", title: "Quantitative Kinetic Analysis of Protein–Phosphoinositide Binding by Optimized Liposome-Based Bio-Layer Interferometry", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "Biochemistry (ACS) — submitted" },
      ],
      papersEmpty: "More first-author manuscripts in preparation — stay tuned.",
      fundingTitle: "Funding",
      funding: { title: "JST SPRING-GX", desc: "Japan Science & Technology Agency — Support for Pioneering Research Initiated by the Next Generation: Green Transformation Program for Advanced Human Resource Development." },
      awardsTitle: "Awards & Activities",
      awards: [
        { y: "2024.03", h: "Outstanding Graduate Award — Interdisciplinary Sciences (広域科学専攻奨励賞)", p: "Graduate School of Arts and Sciences, The University of Tokyo, FY2023." },
        { y: "2023.08", h: "Bio-SPM Summer School (Kanazawa University) — collaborative project accepted", p: "11th Bio-SPM Summer School, Nano Life Science Institute, Kanazawa University. High-speed AFM imaging of in vitro reconstituted complexes." },
      ],
      activeLabel: "Active",
      grantTag: "Grant",
    },
    hobbies: {
      eyebrow: "05 / Off-hours",
      title: "Curious about everything that isn't a pipette.",
      items: [
        ["山", "Hiking & Camping", "Kamikochi, Oze, Tateyama Kurobe — the slower the trail, the better."],
        ["影", "Photography", "Slow film, fast trains, the occasional stranger's smile."],
        ["猫", "Cats", "The smallest, quietest collaborators."],
        ["旅", "Travel", "Long trains, side streets, and a notebook for finding-out-later."],
      ],
    },
    news: {
      eyebrow: "06 / Recent",
      title: "What's new.",
      items: [
        { when: "2025 · 01", h: "IPR International Conference 2025", p: "Presented the protein–phospholipid binding work on Awaji Island." },
        { when: "2025", h: "Started the PhD program", p: "Officially enrolled in Chemical Biotechnology, Graduate School of Engineering, UTokyo." },
        { when: "2024 · 04", h: "Joined the Tsuboyama Lab", p: "Began research at the Biomolecular Design Engineering Lab, IIS." },
        { when: "2024 · 03", h: "MSc completed with honors", p: "Awarded the Interdisciplinary Sciences prize on graduation." },
      ],
    },
    contact: {
      eyebrow: "07 / Contact",
      headline: <>Let's <em>talk science.</em></>,
      sub: "Collaborations, AI for Science, lipid biophysics, or just a cup of coffee in Komaba — my inbox is always open.",
    },
  },
  zh: {
    nav: { about: "关于", research: "研究", pubs: "成果", edu: "经历", news: "动态", contact: "联系" },
    hero: {
      meta: ["东京大学 · 生研所", "坪山研究室", "博士在读"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "我在 AI 蛋白质设计与生物物理的交叉口工作 —— 探索蛋白质如何识别决定细胞内各膜系统身份的磷脂特征。",
      cta1: "看研究", cta2: "联系我",
    },
    about: {
      eyebrow: "01 / 关于",
      title: "在城市、语言与学科之间穿行的研究者。",
      p1: "我叫姚品碩。生于哈尔滨，十六岁来到东京学日语，在东京农业大学爱上了生物学，然后再也没有停止追逐分子。",
      p2: "现在我是东京大学生产技术研究所坪山研究室的博士生。我的工具是酵母展示、机器学习模型和 BLI 传感器。我想知道：蛋白质是如何识别它所偏爱的脂质？我们能否教计算机从零开始设计新的蛋白？",
      p3: "实验室之外，你大概率会在山道上、慢相机之后，或下一次安静旅行的计划里找到我。",
      coordinatesTitle: "坐标",
      coords: [["城市","东京"],["机构","UTokyo · IIS"],["实验室","坪山"],["身份","博士生"]],
      languagesTitle: "语言",
      langs: [["中文","母语"],["日本語","熟练"],["English","熟练"]],
    },
    research: {
      eyebrow: "02 / 研究",
      title: "蛋白质如何识别那些定义膜身份的磷脂？",
      lede: "真核细胞的每一层膜都带有独特的磷脂特征；蛋白质结构域阅读这些特征，从而决定信号定位、物质运输与细胞器形成。我希望理解这种识别如何运作 —— 定量地、且大规模地。",
      intro2: "两条并行的轨道。一条是定量的 —— 用严格的方法测量结合动力学；一条是探索性的 —— 让机器从数据中找出我们手工看不见的规律。两者一起，绘制蛋白质识别磷脂的分子逻辑图谱。",
      proj: [
        {
          n: "01",
          title: "蛋白质 — 磷脂酰肌醇识别的大规模图谱",
          tags: ["高通量", "NGS", "机器学习"],
          summary: "磷脂酰肌醇（PIPs）是 8 种磷酸化脂质，标记着内膜系统的不同区室 —— PI(4,5)P₂ 在质膜，PI(3)P 在早期内体，PI(3,5)P₂ 在晚期内体，等等。脂质结合结构域（PH、PX、ENTH、GRAM、GLUE、C2 ……）通过识别这些极小的磷酸基修饰来调控信号传导、膜运输与细胞骨架动力学；一个识别错误（例如 AKT1 PH 的 E17K 突变）就足以引发疾病。然而经过几十年的个案研究，仍然没有一般规则能够描述任意结构域如何区分这 8 种 PIPs。我在坪山研究室里，建立可比较的、跨数千个结构域和脂质种的大规模结合数据集，并用机器学习寻找其中潜在的识别规则。",
          stats: [["~20k", "结构域"], ["13", "脂质种"], ["ML", "可解释性"]],
        },
        {
          n: "02",
          title: "蛋白质 — 磷脂结合动力学的标准化 BLI 平台",
          tags: ["BLI", "动力学", "脂质体"],
          summary: "大多数蛋白质 - 脂质实验只能给出平衡结合强度 —— 无法分辨更紧的亲和性是来自更快的 kₒₙ 还是更慢的 k_off，即使这两条路径在生物学上意义截然不同。生物层干涉法（BLI）能够分辨实时动力学，但在脂质表面常常受到非特异性蛋白吸附的干扰。通过系统优化的缓冲液配方（0.5% BSA、0.001% Tween-20），我们抑制了背景结合同时保持脂质体的完整性，并对代表性的 PX、PH 结构域及其突变体系列恢复了 kₒₙ、k_off 与 K_D。该平台能够区分动力学机制 —— AKT1 PH 系列的亲和性增强主要来自更慢的 k_off；SnxA PX 则来自更快的 kₒₙ —— 这是平衡结合数据本身无法揭示的信息。",
          stats: [["kₒₙ · k_off", "实时"], ["nM", "亲和力"], ["开放", "协议"]],
        },
      ],
      interestsTitle: "我追的潮流",
      interests: [
        ["AI × 生物", "从 AlphaFold 到可解释的功能。读序列、梦结构的模型。"],
        ["从头设计", "一个原子一个原子地设计具备新功能的蛋白。"],
        ["高通量数据", "筛选产生的数据没人读得完，机器学习来读。"],
        ["蛋白质工程", "定向进化与理性设计 —— 让分子变好的慢手艺。"],
      ],
      organismsTitle: "模式生物",
      organisms: ["E. coli", "S. cerevisiae", "小鼠"],
      techsTitle: "技术",
      techs: ["酵母展示", "BLI 动力学", "NGS", "FACS", "蛋白纯化", "脂质体制备", "荧光显微", "ICSI", "Western Blot", "彗星试验", "AI 蛋白设计工具", "HTS 流程"],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "03 / 经历",
      title: "从哈尔滨到东京 —— 一条由城市与学科书写的路径。",
      items: [
        { date: "2025 — 至今", current: true, h: "博士 · 化学生命工学", inst: "东京大学生研所 · 坪山研究室", detail: "在坪山幸太郎讲师指导下，从事 AI 辅助蛋白质设计。" },
        { date: "2024 — 2025", h: "研究生", inst: "东京大学生研所 · 坪山研究室", detail: "加入实验室，启动脂质结合筛选。" },
        { date: "2022 — 2024", h: "硕士 · 生命科学", inst: "东京大学定量所 · 岡田研究室", detail: "建立了精子染色质可逆解凝缩 - 再凝缩的方法，并通过 ICSI 验证表观遗传编辑后精子的发育。优秀毕业生奖。" },
        { date: "2018 — 2022", h: "学士 · 生物科学", inst: "东京农业大学 · 矢嶋研究室", detail: "IclR 家族转录因子的结构生物学；在研究室内率先引入 AlphaFold2 / RoseTTAFold。" },
        { date: "2016 — 2018", h: "日语预科", inst: "富士国际语学院，东京", detail: "十六岁来到日本，从零开始学第三种语言。" },
        { date: "2010 — 2017", h: "基础教育", inst: "哈尔滨第三中学（群力）& 光华中学", detail: "中国东北。好奇心的起点。" },
      ],
    },
    pubs: {
      eyebrow: "04 / 成果",
      title: "论文、发表，与即将发生的下一篇。",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "破译蛋白质 - 磷脂结合的通用原理", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国际会议 2025，淡路岛" },
        { date: "2023.12", type: "Poster P-25", title: "精子染色质体外再构成：革新的方法", venue: "2023 年度定量研究交流会，东京大学" },
        { date: "2023.06", type: "Poster P-49", title: "ex vivo 精子染色质再构成方法的建立", venue: "第 16 回日本表观遗传学研究会年会，一桥讲堂" },
        { date: "2023.06", type: "Poster", title: "二价阳离子对精子染色质结构的影响及体外再构成", venue: "第 22 回东京大学生命科学研讨会 BIO UT" },
        { date: "2022.11", type: "Poster P-25", title: "二价阳离子对精子染色质结构的影响解析", venue: "新学术领域联合「若手の会 2022」，大阪 Rinku" },
      ],
      papersTitle: "论文",
      papers: [
        { date: "2026", status: "审稿中", title: "通过优化的脂质体生物层干涉法定量分析蛋白质 - 磷脂酰肌醇结合动力学", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "Biochemistry (ACS) — 投稿中" },
      ],
      papersEmpty: "其他第一作者论文正在撰写中 —— 敬请期待。",
      fundingTitle: "资助",
      funding: { title: "JST SPRING-GX", desc: "日本科学技术振兴机构 · 次世代研究者挑战性研究项目 · 绿色转型高级人才培养计划。" },
      awardsTitle: "奖励 & 活动",
      awards: [
        { y: "2024.03", h: "优秀毕业生奖 · 广域科学专攻奖励奖", p: "东京大学综合文化研究科，令和 5 年度。" },
        { y: "2023.08", h: "Bio-SPM 夏季学校（金沢大学）—— 共同研究采择", p: "金沢大学 NanoLSI 第 11 回 Bio-SPM 夏季学校。高速原子力显微镜对体外重组复合物的动态观察。" },
      ],
      activeLabel: "进行中",
      grantTag: "经费",
    },
    hobbies: {
      eyebrow: "05 / 下班",
      title: "对一切与移液器无关的事情都好奇。",
      items: [
        ["山", "登山露营", "上高地、尾濑、立山黑部 —— 走得越慢越好。"],
        ["影", "摄影", "慢胶片，快列车，偶尔陌生人的笑容。"],
        ["猫", "猫", "最小、最安静的合作者。"],
        ["旅", "旅行", "长途列车、小巷子，一本之后再查的笔记。"],
      ],
    },
    news: {
      eyebrow: "06 / 近况",
      title: "最近发生了什么。",
      items: [
        { when: "2025 · 01", h: "IPR 国际会议 2025", p: "在淡路岛发表蛋白质 - 磷脂结合研究。" },
        { when: "2025", h: "博士入学", p: "正式进入东京大学工学系研究科化学生命工学专攻博士课程。" },
        { when: "2024 · 04", h: "加入坪山研究室", p: "在生研所生体分子设计工学研究室开始研究。" },
        { when: "2024 · 03", h: "硕士毕业 · 获奖", p: "获广域科学专攻奖励奖。" },
      ],
    },
    contact: {
      eyebrow: "07 / 联系",
      headline: <>来 <em>聊聊科学。</em></>,
      sub: "科研合作、AI for Science、脂质生物物理，或只是在驹场喝杯咖啡 —— 我的邮箱永远开着。",
    },
  },
  ja: {
    nav: { about: "概要", research: "研究", pubs: "業績", edu: "経歴", news: "近況", contact: "連絡" },
    hero: {
      meta: ["東京大学 · 生研", "坪山研究室", "博士課程"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "AI タンパク質設計と生物物理学の交差点で研究しています — タンパク質が細胞内のさまざまな膜のアイデンティティを定めるリン脂質シグネチャをどう認識するか、その解明に取り組んでいます。",
      cta1: "研究を読む", cta2: "連絡する",
    },
    about: {
      eyebrow: "01 / 自己紹介",
      title: "都市と言語と分野の間を歩く研究者。",
      p1: "姚品碩と申します。ハルビンで生まれ、16 歳で東京に来て日本語を学び、東京農業大学で生物学に夢中になり、それから分子を追いかけるのをやめていません。",
      p2: "現在は東京大学生産技術研究所・坪山研究室の博士課程に在籍しています。道具は酵母ディスプレイ、機械学習、BLI センサー。問いは：タンパク質はどうやって愛する脂質を見分けるのか、コンピュータにそれをゼロから設計させられるのか。",
      p3: "ラボの外では、山道か、ゆっくりカメラの後ろか、次の静かな旅の計画の中にいます。",
      coordinatesTitle: "所在",
      coords: [["都市","東京"],["所属","UTokyo · IIS"],["研究室","坪山"],["役割","博士課程"]],
      languagesTitle: "言語",
      langs: [["中文","ネイティブ"],["日本語","上級"],["English","上級"]],
    },
    research: {
      eyebrow: "02 / 研究",
      title: "タンパク質はどうやって膜のアイデンティティを定めるリン脂質を認識するのか？",
      lede: "真核細胞のそれぞれの膜は、固有のリン脂質シグネチャを持つ。タンパク質ドメインはそのシグネチャを読み、シグナルを局所化し、貨物を輸送し、コンパートメントを形作る。私はその認識が、定量的に、かつ大規模にどう機能するかを理解したい。",
      intro2: "二つの並行する軌道。ひとつは定量的 — 結合動態を厳密に計測する。ひとつは探索的 — 機械に、人手では見えないパターンを探させる。あわせてリン脂質認識の分子論理を地図化する。",
      proj: [
        {
          n: "01",
          title: "タンパク質 — ホスホイノシチド認識の大規模マップ",
          tags: ["大規模解析", "NGS", "機械学習"],
          summary: "ホスホイノシチド（PIPs）は、内膜系のそれぞれのコンパートメントを標識する 8 種類のリン酸化脂質である — PI(4,5)P₂ は細胞膜、PI(3)P は初期エンドソーム、PI(3,5)P₂ は後期エンドソームなど。脂質結合ドメイン（PH、PX、ENTH、GRAM、GLUE、C2 …）はこの極めて小さなリン酸基の差異を読み取り、シグナル伝達、膜輸送、細胞骨格動態を制御する；たった一つの認識ミス（例えば AKT1 PH の E17K 変異）が疾患の引き金となる。それにもかかわらず、特定のドメインがどのようにして 8 種類の PIPs を区別するのか、その一般則は未だに見えていない。坪山研究室で、私は数千のドメインと脂質種にまたがる比較可能な大規模結合データセットを構築し、その中に潜む認識規則を機械学習で探っている。",
          stats: [["~20k", "ドメイン"], ["13", "脂質種"], ["ML", "解釈性"]],
        },
        {
          n: "02",
          title: "タンパク質 — リン脂質結合動態のための最適化 BLI",
          tags: ["BLI", "速度論", "リポソーム"],
          summary: "ほとんどのタンパク質-脂質アッセイは平衡結合強度しか報告しない — より強い親和性が、より速い kₒₙ から来るのか、より遅い k_off から来るのかを区別できない。しかしこの二つは生物学的にまったく異なる帰結をもつ。バイオレイヤー干渉法（BLI）はリアルタイムの動態を解像できるが、脂質表面では非特異的吸着が大きな障害となる。系統的な緩衝液最適化（0.5% BSA、0.001% Tween-20）によって背景結合を抑え、リポソームの完全性を保ったまま、代表的な PX・PH ドメインとその変異体系列について kₒₙ・k_off・K_D を取得した。本プラットフォームは動態メカニズムを区別する — AKT1 PH 系列では親和性向上が主に k_off の遅さから、SnxA PX 系列では kₒₙ の速さから来ている — 平衡結合測定だけでは分からない情報である。",
          stats: [["kₒₙ · k_off", "リアルタイム"], ["nM", "親和性"], ["公開", "プロトコル"]],
        },
      ],
      interestsTitle: "追っている流れ",
      interests: [
        ["AI × 生物学", "AlphaFold から機能アノテーションまで。配列を読み構造を夢みるモデル。"],
        ["De novo 設計", "新機能を持つタンパク質を、原子レベルから設計する。"],
        ["大規模データ", "人が読みきれないスクリーニングデータを、機械学習に読ませる。"],
        ["タンパク質工学", "指向性進化と合理的設計 — 分子をよりよくする遅い手仕事。"],
      ],
      organismsTitle: "モデル生物",
      organisms: ["E. coli", "S. cerevisiae", "マウス"],
      techsTitle: "技術",
      techs: ["酵母ディスプレイ", "BLI 速度論", "NGS", "FACS", "タンパク質精製", "リポソーム調製", "蛍光顕微鏡", "ICSI", "ウェスタンブロット", "コメットアッセイ", "AI 設計ツール", "HTS"],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "03 / 経歴",
      title: "ハルビンから東京へ — 都市と分野が綴る道。",
      items: [
        { date: "2025 — 現在", current: true, h: "博士課程 · 化学生命工学", inst: "東京大学生研 · 坪山研究室", detail: "坪山幸太郎講師のもと、AI 支援タンパク質設計。" },
        { date: "2024 — 2025", h: "研究生", inst: "東京大学生研 · 坪山研究室", detail: "ラボに参加、脂質結合スクリーニングを開始。" },
        { date: "2022 — 2024", h: "修士 · 生命科学", inst: "東京大学定量研 · 岡田研究室", detail: "精子クロマチンの可逆的脱凝縮 - 再凝縮法を確立し、エピゲノム編集後の精子から ICSI による発生を確認。優秀修了生表彰。" },
        { date: "2018 — 2022", h: "学士 · 生物科学", inst: "東京農業大学 · 矢嶋研究室", detail: "IclR ファミリー転写因子の構造生物学；ラボ内で AlphaFold2 / RoseTTAFold をいち早く導入。" },
        { date: "2016 — 2018", h: "日本語課程", inst: "富士国際語学院、東京", detail: "16 歳で来日。三つ目の言語をゼロから。" },
        { date: "2010 — 2017", h: "基礎教育", inst: "ハルビン第三中学校（群力）、光華中学校", detail: "中国東北。好奇心の出発点。" },
      ],
    },
    pubs: {
      eyebrow: "04 / 業績",
      title: "論文、発表、そして次の一本。",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "タンパク質 - リン脂質結合の普遍原理の解読", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国際会議 2025、淡路島" },
        { date: "2023.12", type: "Poster P-25", title: "精子クロマチン体外再構成：革新的手法", venue: "2023 年度定量研究交流会、東京大学" },
        { date: "2023.06", type: "Poster P-49", title: "ex vivo 精子クロマチン再構成法の確立", venue: "第 16 回日本エピジェネティクス研究会年会、一橋講堂" },
        { date: "2023.06", type: "Poster", title: "二価陽イオンが精子クロマチン構造に与える影響", venue: "第 22 回東京大学生命科学シンポジウム BIO UT" },
        { date: "2022.11", type: "Poster P-25", title: "二価陽イオンの精子クロマチン構造への影響解析", venue: "新学術・学術変革領域合同「若手の会 2022」、大阪りんくう" },
      ],
      papersTitle: "論文",
      papers: [
        { date: "2026", status: "審査中", title: "最適化したリポソームベース・バイオレイヤー干渉法によるタンパク質 - ホスホイノシチド結合動態の定量解析", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "Biochemistry (ACS) — 投稿中" },
      ],
      papersEmpty: "他の筆頭著者論文を準備中 — お楽しみに。",
      fundingTitle: "助成",
      funding: { title: "JST SPRING-GX", desc: "科学技術振興機構 · 次世代研究者挑戦的研究プログラム · GX 高度人材育成。" },
      awardsTitle: "受賞・活動",
      awards: [
        { y: "2024.03", h: "優秀修了生表彰 · 広域科学専攻奨励賞", p: "東京大学総合文化研究科、令和 5 年度。" },
        { y: "2023.08", h: "Bio-SPM 夏の学校（金沢大学）— 共同研究採択", p: "金沢大学 NanoLSI 第 11 回 Bio-SPM 夏の学校。高速原子間力顕微鏡による試験管内再構成複合体の動態観察。" },
      ],
      activeLabel: "進行中",
      grantTag: "助成",
    },
    hobbies: {
      eyebrow: "05 / オフ",
      title: "ピペット以外のすべてに興味がある。",
      items: [
        ["山", "登山・キャンプ", "上高地、尾瀬、立山黒部 — 遅い道ほどよい。"],
        ["影", "写真", "遅いフィルム、速い列車、ときどき誰かの微笑み。"],
        ["猫", "猫", "もっとも小さく、もっとも静かな共同研究者。"],
        ["旅", "旅", "長い列車、路地裏、後で調べる用のノート。"],
      ],
    },
    news: {
      eyebrow: "06 / 近況",
      title: "最近の出来事。",
      items: [
        { when: "2025 · 01", h: "IPR 国際会議 2025", p: "淡路島でタンパク質 - リン脂質結合研究を発表。" },
        { when: "2025", h: "博士課程入学", p: "東京大学工学系研究科化学生命工学専攻に正式入学。" },
        { when: "2024 · 04", h: "坪山研究室に参加", p: "生研の生体分子設計工学研究室で研究開始。" },
        { when: "2024 · 03", h: "修士修了 · 受賞", p: "広域科学専攻奨励賞を受賞。" },
      ],
    },
    contact: {
      eyebrow: "07 / 連絡",
      headline: <>サイエンスの <em>話をしよう。</em></>,
      sub: "共同研究、AI for Science、脂質生物物理、駒場でのコーヒー — メールはいつでもどうぞ。",
    },
  },
};

const CONTACTS = [
  { label: "Email · primary", value: "pinshuoyao@outlook.com", href: "mailto:pinshuoyao@outlook.com" },
  { label: "Email · personal", value: "pinshuoyao@gmail.com", href: "mailto:pinshuoyao@gmail.com" },
  { label: "Email · UTokyo", value: "yao1999@iis.u-tokyo.ac.jp", href: "mailto:yao1999@iis.u-tokyo.ac.jp" },
  { label: "WeChat", value: "yaopinshuo1999" },
  { label: "Xiaohongshu", value: "744152221" },
  { label: "Office", value: "Fe504, IIS · 4-6-1 Komaba, Meguro-ku, Tokyo" },
];
const SOCIALS = [
  { label: "LinkedIn", href: "https://jp.linkedin.com/in/pinshuoyao" },
  { label: "GitHub", href: "https://github.com/PinshuoYAO" },
  { label: "ORCID", href: "https://orcid.org/0009-0001-0085-3113" },
  { label: "Instagram", href: "https://www.instagram.com/PINSHUOYAO" },
];

// --- Typewriter ---
function Typewriter({ phrases }) {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const cur = phrases[idx % phrases.length];
    let timeout;
    if (!del && out === cur) {
      timeout = setTimeout(() => setDel(true), 1600);
    } else if (del && out === "") {
      setDel(false);
      setIdx((i) => (i + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setOut(del ? cur.slice(0, out.length - 1) : cur.slice(0, out.length + 1));
      }, del ? 30 : 60);
    }
    return () => clearTimeout(timeout);
  }, [out, del, idx, phrases]);

  return (
    <span>
      <span className="prompt">$</span>
      <span>{out}</span>
      <span className="caret"></span>
    </span>
  );
}

// --- Cursor follower ---
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    let rx = 0, ry = 0, mx = 0, my = 0;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) { dot.current.style.left = mx + "px"; dot.current.style.top = my + "px"; }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px"; }
      requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("mousemove", move);
    const hovers = document.querySelectorAll("a, button, .project, .interest-card, .hobby-cell, .contact-row");
    const enter = () => ring.current && ring.current.classList.add("hover");
    const leave = () => ring.current && ring.current.classList.remove("hover");
    hovers.forEach(h => { h.addEventListener("mouseenter", enter); h.addEventListener("mouseleave", leave); });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <>
    <div ref={dot} className="cursor-dot"></div>
    <div ref={ring} className="cursor-ring"></div>
  </>;
}

// --- Reveal on scroll ---
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .timeline-item");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// --- Live clock ---
function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () => {
      const d = new Date();
      const tokyo = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
      const hh = String(tokyo.getHours()).padStart(2, "0");
      const mm = String(tokyo.getMinutes()).padStart(2, "0");
      const ss = String(tokyo.getSeconds()).padStart(2, "0");
      setT(`TYO ${hh}:${mm}:${ss}`);
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="clock">{t}</span>;
}

function App() {
  const tweaks = window.useTweaks(window.TWEAK_DEFAULTS);
  const [t] = tweaks;
  const lang = t.lang || "en";
  const L = I18N[lang];
  const [openProj, setOpenProj] = useState(0);

  useReveal();

  // apply mode + theme + accent + lang to root
  useEffect(() => {
    document.body.setAttribute("data-mode", t.mode || "editorial");
    document.body.setAttribute("data-theme", t.theme || "light");
    document.body.setAttribute("data-lang", t.lang || "en");
    document.documentElement.lang = t.lang === "zh" ? "zh-CN" : t.lang === "ja" ? "ja" : "en";
    document.documentElement.style.setProperty("--accent", t.accent || "#ff5722");
  }, [t.mode, t.theme, t.accent, t.lang]);

  // init protein canvas
  useEffect(() => {
    const c = document.getElementById("protein-canvas");
    if (c && window.initProtein && !c.dataset.inited) {
      window.initProtein(c);
      c.dataset.inited = "1";
    }
  }, []);

  return (
    <>
      <Cursor />
      <Nav L={L} tweaks={tweaks} />
      <main>
        <Hero L={L} />
        <About L={L} />
        <Research L={L} openProj={openProj} setOpenProj={setOpenProj} />
        <Education L={L} />
        <Publications L={L} />
        <Hobbies L={L} />
        <News L={L} />
        <Contact L={L} />
      </main>
      <Footer />
      <TweaksUI tweaks={tweaks} />
    </>
  );
}

function Nav({ L, tweaks }) {
  const [t, setT] = tweaks;
  const langs = ["en", "zh", "ja"];
  return (
    <nav className="nav">
      <div className="nav-mark"><span className="dot"></span><span>YAO · 姚品碩</span></div>
      <div className="nav-links">
        <a href="#about">{L.nav.about}</a>
        <a href="#research">{L.nav.research}</a>
        <a href="#pubs">{L.nav.pubs}</a>
        <a href="#edu">{L.nav.edu}</a>
        <a href="#news">{L.nav.news}</a>
        <a href="#contact">{L.nav.contact}</a>
      </div>
      <div className="nav-actions">
        <div className="lang-pills">
          {langs.map(l => (
            <button key={l} className={t.lang === l ? "active" : ""} onClick={() => setT("lang", l)}>
              {l === "en" ? "EN" : l === "zh" ? "中" : "日"}
            </button>
          ))}
        </div>
        <button className="theme-btn" onClick={() => setT("theme", t.theme === "dark" ? "light" : "dark")}>
          {t.theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </nav>
  );
}

function Hero({ L }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-left">
        <div className="hero-meta">
          <span className="live"></span>
          {L.hero.meta.map((m, i) => (
            <React.Fragment key={i}><span>{m}</span>{i < L.hero.meta.length - 1 && <span>·</span>}</React.Fragment>
          ))}
        </div>
        <h1 className="hero-name">
          YAO<br />
          <span className="ital">Pinshuo</span>
        </h1>
        <div className="hero-name-cn">姚 品 碩</div>
        <div className="hero-typer"><Typewriter phrases={L.hero.typer} /></div>
        <p className="hero-desc">{L.hero.desc.split(/(AI|protein|lipid|membrane|分子|脂质|タンパク質)/).map((s, i) =>
          /^(AI|protein|lipid|membrane|分子|脂质|タンパク質)$/.test(s) ? <span key={i} className="key">{s}</span> : s
        )}</p>
        <div className="hero-cta">
          <a href="#research" className="btn primary"><span>{L.hero.cta1}</span><span className="arrow">→</span></a>
          <a href="#contact" className="btn"><span>{L.hero.cta2}</span><span className="arrow">→</span></a>
        </div>
      </div>
      <div className="hero-right">
        <div className="protein-stage">
          <canvas id="protein-canvas"></canvas>
        </div>
        <div className="protein-frame"></div>
        <div className="protein-corner-tr"></div>
        <div className="protein-corner-bl"></div>
        <div className="protein-corner-br"></div>
        <div className="protein-tag">PDB · synth_helix.0</div>
        <div className="protein-readout">
          <span className="lbl">obj</span> peripheral_membrane · <span className="lbl">N</span>=56 · <span className="lbl">rot</span> live
        </div>
      </div>
      <div className="scroll-hint"><span className="line"></span><span>scroll · 下へ</span></div>
    </section>
  );
}

function About({ L }) {
  return (
    <section id="about">
      <div className="eyebrow">{L.about.eyebrow}</div>
      <h2 className="section-title reveal">{L.about.title}</h2>
      <div className="about-grid">
        <div className="about-text reveal">
          <p>{L.about.p1}</p>
          <p>{L.about.p2}</p>
          <p>{L.about.p3}</p>
        </div>
        <div className="about-side reveal">
          <div className="about-card">
            <h4>{L.about.coordinatesTitle}</h4>
            <ul>
              {L.about.coords.map(([k, v], i) => (
                <li key={i}><span className="key">{k}</span><span className="val">{v}</span></li>
              ))}
            </ul>
          </div>
          <div className="about-card">
            <h4>{L.about.languagesTitle}</h4>
            <ul>
              {L.about.langs.map(([k, v], i) => (
                <li key={i}><span className="key">{k}</span><span className="val">{v}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Research({ L, openProj, setOpenProj }) {
  const R = L.research;
  return (
    <section id="research">
      <div className="eyebrow">{R.eyebrow}</div>
      <h2 className="section-title reveal">{R.title}</h2>
      <div className="research-intro">
        <p className="lede reveal">{R.lede}</p>
        <p className="reveal" style={{ color: "var(--muted)" }}>{R.intro2}</p>
      </div>

      <div className="projects">
        {R.proj.map((p, i) => (
          <div key={i} className={`project ${openProj === i ? "open" : ""}`} onClick={() => setOpenProj(openProj === i ? -1 : i)}>
            <div className="project-num">{R.projLabel} <span className="accent">{p.n}</span></div>
            <div className="project-main">
              <h3>{p.title}</h3>
              <div className="project-tags">{p.tags.map((t, j) => <span key={j}>{t}</span>)}</div>
              <div className="project-detail">
                <div className="project-detail-inner">
                  <p>{p.summary}</p>
                  <div className="stats">
                    {p.stats.map(([n, l], k) => <div key={k} className="stat"><span className="num">{n}</span>{l}</div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="project-toggle">+</div>
          </div>
        ))}
      </div>

      <div className="interests reveal">
        {R.interests.map(([h, p], i) => (
          <div key={i} className="interest-card">
            <div className="num">/{String(i + 1).padStart(2, "0")}</div>
            <h4>{h}</h4>
            <p>{p}</p>
          </div>
        ))}
      </div>

      <div className="tech-section reveal">
        <h3>{R.organismsTitle}</h3>
        <div className="tech-cloud">
          {R.organisms.map((o, i) => <span key={i} className="org">{o}</span>)}
        </div>
      </div>
      <div className="tech-section reveal">
        <h3>{R.techsTitle}</h3>
        <div className="tech-cloud">
          {R.techs.map((o, i) => <span key={i}>{o}</span>)}
        </div>
      </div>
    </section>
  );
}

function Education({ L }) {
  return (
    <section id="edu">
      <div className="eyebrow">{L.edu.eyebrow}</div>
      <h2 className="section-title reveal">{L.edu.title}</h2>
      <div className="timeline">
        {L.edu.items.map((it, i) => (
          <div key={i} className={`timeline-item ${it.current ? "current" : ""}`}>
            <div className="timeline-date">
              <span>{it.date}</span>
              {it.current && <span className="badge">NOW</span>}
            </div>
            <h4>{it.h}</h4>
            <div className="institution">{it.inst}</div>
            <div className="detail">{it.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Publications({ L }) {
  const P = L.pubs;
  return (
    <section id="pubs">
      <div className="eyebrow">{P.eyebrow}</div>
      <h2 className="section-title reveal">{P.title}</h2>
      <div className="pub-list reveal">
        {P.pres.map((p, i) => (
          <div key={i} className="pub-item">
            <div className="pub-date">{p.date}</div>
            <div className="pub-content">
              <h4>{p.title}</h4>
              {p.authors && <div className="authors">{p.authors}</div>}
              <div className="venue">{p.venue}</div>
            </div>
            <div className="pub-types">
              {p.intl && <span className="pub-tag intl">International</span>}
              <span className="pub-tag poster">{p.type}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{P.papersTitle}</div>
        {P.papers && P.papers.map((p, i) => (
          <div key={i} className="pub-item">
            <div className="pub-date" style={{ color: "var(--accent)" }}>{p.status}</div>
            <div className="pub-content">
              <h4>{p.title}</h4>
              {p.authors && <div className="authors">{p.authors}</div>}
              <div className="venue">{p.venue}</div>
            </div>
            <div className="pub-types"><span className="pub-tag intl">{p.date}</span></div>
          </div>
        ))}
        <div className="pub-empty" style={{ marginTop: 16 }}>{P.papersEmpty}</div>
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{P.fundingTitle}</div>
        <div className="pub-item" style={{ borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
          <div className="pub-date" style={{ color: "var(--accent)" }}>{P.activeLabel}</div>
          <div className="pub-content">
            <h4>{P.funding.title}</h4>
            <div className="venue" style={{ marginTop: 6 }}>{P.funding.desc}</div>
          </div>
          <div className="pub-types"><span className="pub-tag intl">{P.grantTag}</span></div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{P.awardsTitle}</div>
        {P.awards.map((a, i) => (
          <div key={i} className="award-row">
            <div className="year">{a.y}</div>
            <div>
              <h4>{a.h}</h4>
              <p>{a.p}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Hobbies({ L }) {
  return (
    <section id="hobbies">
      <div className="eyebrow">{L.hobbies.eyebrow}</div>
      <h2 className="section-title reveal">{L.hobbies.title}</h2>
      <div className="hobby-strip reveal">
        {L.hobbies.items.map(([g, h, p], i) => (
          <div key={i} className="hobby-cell">
            <div className="glyph">{g}</div>
            <h4>{h}</h4>
            <p>{p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function News({ L }) {
  return (
    <section id="news">
      <div className="eyebrow">{L.news.eyebrow}</div>
      <h2 className="section-title reveal">{L.news.title}</h2>
      <div className="news-flow reveal">
        {L.news.items.map((n, i) => (
          <div key={i} className="news-card">
            <div className="when">{n.when}</div>
            <h4>{n.h}</h4>
            <p>{n.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ L }) {
  return (
    <section id="contact">
      <div className="contact-block">
        <div className="reveal">
          <div className="eyebrow">{L.contact.eyebrow}</div>
          <h2 className="contact-headline">{L.contact.headline}</h2>
          <p className="contact-sub">{L.contact.sub}</p>
          <div className="socials">
            {SOCIALS.map((s, i) => <a key={i} href={s.href} target="_blank" rel="noreferrer">{s.label} <span className="arrow-glyph">↗︎</span></a>)}
          </div>
        </div>
        <div className="contact-list reveal">
          {CONTACTS.map((c, i) => {
            const inner = (
              <>
                <span className="label">{c.label}</span>
                <span className="value">{c.value}</span>
                <span className="arrow">{c.href ? "↗︎" : "·"}</span>
              </>
            );
            return c.href ? (
              <a key={i} className="contact-row" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}>{inner}</a>
            ) : (
              <div key={i} className="contact-row">{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <span>© 2026 Yao Pinshuo · 姚品碩</span>
      <span>Built with curiosity · with Claude</span>
      <Clock />
    </footer>
  );
}

function TweaksUI({ tweaks }) {
  const [t, setT] = tweaks;
  const { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSelect } = window;
  return (
    <TweaksPanel>
      <TweakSection title="Aesthetic">
        <TweakRadio label="Mode" value={t.mode} onChange={(v) => setT("mode", v)}
          options={[
            { value: "editorial", label: "Editorial" },
            { value: "terminal", label: "Terminal" },
            { value: "swiss", label: "Swiss" },
          ]} />
        <TweakRadio label="Theme" value={t.theme} onChange={(v) => setT("theme", v)}
          options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
      </TweakSection>
      <TweakSection title="Accent">
        <TweakColor label="Accent color" value={t.accent} onChange={(v) => setT("accent", v)} />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {["#ff5722", "#e11d48", "#0ea5e9", "#16a34a", "#a855f7", "#0a0a0a"].map(c => (
            <button key={c} onClick={() => setT("accent", c)} style={{ width: 24, height: 24, borderRadius: 0, background: c, border: t.accent === c ? "2px solid #000" : "1px solid #ddd", cursor: "pointer", padding: 0 }} />
          ))}
        </div>
      </TweakSection>
      <TweakSection title="Language">
        <TweakRadio label="Lang" value={t.lang} onChange={(v) => setT("lang", v)}
          options={[{ value: "en", label: "EN" }, { value: "zh", label: "中" }, { value: "ja", label: "日" }]} />
      </TweakSection>
    </TweaksPanel>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
