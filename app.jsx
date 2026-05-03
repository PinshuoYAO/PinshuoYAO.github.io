// app.jsx — main React app for YAO Pinshuo HP
const { useState, useEffect, useRef } = React;

const I18N = {
  en: {
    nav: { about: "About", research: "Research", pubs: "Publications", edu: "Path", news: "News", contact: "Contact" },
    hero: {
      meta: ["UTOKYO · IIS", "TSUBOYAMA LAB", "PHD CANDIDATE"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "I work at the intersection of AI-driven protein design and biophysics — decoding how proteins read the lipid alphabet of the cell membrane.",
      cta1: "Read the work", cta2: "Get in touch",
    },
    about: {
      eyebrow: "01 / About",
      title: "A scientist between cities, languages, and disciplines.",
      p1: "I'm Yao Pinshuo. I grew up in Harbin, learned Japanese in Tokyo at sixteen, fell in love with biology at Tokyo University of Agriculture, and never stopped chasing molecules.",
      p2: "Today I am a PhD student at the Institute of Industrial Science, UTokyo, in the Tsuboyama Lab. My instruments are yeast displays, machine learning models, and BLI sensors. My questions: how does a protein know which lipid it loves, and can we teach a computer to design new ones from scratch?",
      p3: "Outside the lab you'll find me on a mountain trail, underwater with a regulator, or hunting for the perfect bowl of ramen.",
    },
    research: {
      eyebrow: "02 / Research",
      title: "Decoding the lipid alphabet, one protein at a time.",
      lede: "Two ongoing projects, one obsession: a universal grammar for protein-membrane recognition.",
      proj: [
        {
          n: "01",
          title: "Phospholipid binding landscape of peripheral membrane proteins",
          tags: ["Yeast Display", "NGS", "ML"],
          summary: "High-throughput screening across thousands of variants, mapping which proteins bind which lipids and why.",
          stats: [["~10⁵", "variants screened"], ["8", "lipid classes"], ["ML", "interpretability"]],
        },
        {
          n: "02",
          title: "A standardized BLI method for lipid-protein binding kinetics",
          tags: ["BLI", "Kinetics", "Liposomes"],
          summary: "A reproducible bio-layer interferometry protocol so anyone, anywhere, can measure the same kₐ and k_d for the same complex.",
          stats: [["nM", "affinity range"], ["3+", "labs validated"], ["Open", "protocol"]],
        },
      ],
      interestsTitle: "Currents I follow",
      interests: [
        ["AI × Biology", "From AlphaFold to functional annotation. Models that read sequence and dream structure."],
        ["De novo design", "Engineering proteins with new functions, atom by atom, from a blank page."],
        ["High-throughput data", "Screens that produce more data than any human can read; ML to read them."],
        ["Protein engineering", "Directed evolution and rational design — the slow art of making molecules better."],
      ],
      futureTitle: "Where I'm headed",
      organisms: ["E. coli", "S. cerevisiae", "Mouse"],
      techs: ["Yeast Display", "BLI Kinetics", "NGS", "FACS", "Protein Purification", "Liposome Prep", "Fluorescence Microscopy", "ICSI", "Western Blot", "Comet Assay", "AI Protein Design Tools", "HTS Workflows"],
    },
    edu: {
      eyebrow: "03 / Path",
      title: "From Harbin to Tokyo — twenty-six years in seven steps.",
      items: [
        { date: "2025 — Now", current: true, h: "PhD · Chemical Biotechnology", inst: "The University of Tokyo, IIS · Tsuboyama Lab", detail: "AI-assisted protein design under Prof. Kotaro Tsuboyama." },
        { date: "2024 — 2025", h: "Research Student", inst: "UTokyo IIS · Tsuboyama Lab", detail: "Joined the lab and started the lipid-binding screen." },
        { date: "2022 — 2024", h: "MSc · Life Sciences", inst: "The University of Tokyo, IQB · Okada Lab", detail: "Sperm chromatin reconstitution. Outstanding Graduate Award." },
        { date: "2018 — 2022", h: "BSc · Biological Sciences", inst: "Tokyo University of Agriculture", detail: "Structural biology. President of the Chinese Students' Association." },
        { date: "2016 — 2018", h: "Japanese Language Program", inst: "Fuji International Language Institute, Tokyo", detail: "Moved to Japan at sixteen. Learned a third language from scratch." },
        { date: "2010 — 2017", h: "Secondary Education", inst: "Harbin No.3 High School (Qunli) & Guanghua Middle School", detail: "Northeast China. Where the curiosity began." },
      ],
    },
    pubs: {
      eyebrow: "04 / Output",
      title: "Talks, posters, and what's coming next.",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "Decoding the Universal Principles of Protein–Phospholipid Binding", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR International Conference 2025, Awaji Island, Japan" },
        { date: "2023.12", type: "Poster P-25", title: "Ex Vivo Sperm Chromatin Reconstitution: An Innovative Approach", venue: "IQB Research Exchange Meeting 2023, UTokyo" },
        { date: "2023.06", type: "Poster P-49", title: "Establishment of ex vivo Sperm Chromatin Reconstitution Method", venue: "16th Annual Meeting of the Japan Epigenetics Research Society, Hitotsubashi Hall" },
        { date: "2023.06", type: "Poster", title: "Effects of Divalent Cations on Sperm Chromatin Structure & Ex Vivo Reconstitution", venue: "22nd UTokyo Life Sciences Symposium BIO UT, Komaba Campus" },
        { date: "2022.11", type: "Poster P-25", title: "Analysis of Divalent Cation Effects on Sperm Chromatin Structure", venue: "Joint \"Wakate-no-kai 2022\", Rinku, Osaka" },
      ],
      papersEmpty: "First-author manuscripts in preparation — stay tuned.",
      funding: { title: "JST SPRING-GX", desc: "Japan Science & Technology Agency — Support for Pioneering Research Initiated by the Next Generation: Green Transformation Program for Advanced Human Resource Development." },
      awards: [
        { y: "2024.03", h: "Outstanding Graduate Award — Interdisciplinary Sciences (広域科学専攻奨励賞)", p: "Graduate School of Arts and Sciences, The University of Tokyo, FY2023." },
      ],
    },
    hobbies: {
      eyebrow: "05 / Off-hours",
      title: "Curious about everything that isn't a pipette.",
      items: [
        ["山", "Hiking & Camping", "Kamikochi, Oze, Tateyama Kurobe."],
        ["海", "Scuba Diving", "Open Water certified. Quietly obsessed."],
        ["影", "Photography", "Slow film, fast trains."],
        ["雪", "Skiing", "Niigata powder days."],
        ["櫻", "Seasons", "Cherry blossoms in Izu, hydrangeas in Kamakura."],
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
      headline: <>Let's <em>talk science.</em></>,
      sub: "Collaborations, AI for Science, lipid biophysics, or just a cup of coffee in Komaba — my inbox is always open.",
    },
  },
  zh: {
    nav: { about: "关于", research: "研究", pubs: "成果", edu: "经历", news: "动态", contact: "联系" },
    hero: {
      meta: ["东京大学 · 生研所", "坪山研究室", "博士在读"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "我在 AI 蛋白质设计与生物物理的交叉口工作 —— 解码蛋白质如何阅读细胞膜的脂质字母表。",
      cta1: "看研究", cta2: "联系我",
    },
    about: {
      eyebrow: "01 / 关于",
      title: "在城市、语言与学科之间穿行的研究者。",
      p1: "我叫姚品碩。生于哈尔滨，十六岁来到东京学日语，在东京农业大学爱上了生物学，然后再也没有停止追逐分子。",
      p2: "现在我是东京大学生产技术研究所坪山研究室的博士生。我的工具是酵母展示、机器学习模型和 BLI 传感器。我想知道：蛋白质是如何识别它所偏爱的脂质？我们能否教计算机从零开始设计新的蛋白？",
      p3: "实验室之外，你大概率会在山道上、潜水镜后、或者一碗拉面前找到我。",
    },
    research: {
      eyebrow: "02 / 研究",
      title: "一次一个蛋白，破译脂质的字母表。",
      lede: "两个进行中的项目，一个执念：蛋白质 - 膜识别的通用语法。",
      proj: [
        { n: "01", title: "末梢膜蛋白的磷脂结合图谱", tags: ["酵母展示", "NGS", "机器学习"], summary: "对数千个变体进行高通量筛选，绘制哪种蛋白结合哪种脂质，以及为什么。", stats: [["~10⁵", "筛选变体"], ["8", "脂质类别"], ["ML", "可解释性"]] },
        { n: "02", title: "标准化 BLI 法测脂质-蛋白结合动力学", tags: ["BLI", "动力学", "脂质体"], summary: "可重现的 BLI 协议，让任何人、任何地方都能对相同复合物测出相同的 kₐ 和 k_d。", stats: [["nM", "亲和力"], ["3+", "实验室验证"], ["开放", "协议"]] },
      ],
      interestsTitle: "我追的潮流",
      interests: [
        ["AI × 生物", "从 AlphaFold 到功能注释。读序列、梦结构的模型。"],
        ["从头设计", "一个原子一个原子地设计具备新功能的蛋白。"],
        ["高通量数据", "筛选产生的数据没人读得完，机器学习来读。"],
        ["蛋白质工程", "定向进化与理性设计 —— 让分子变好的慢手艺。"],
      ],
      interestsTitle2: "我追的潮流",
      futureTitle: "下一站",
      organisms: ["E. coli", "S. cerevisiae", "小鼠"],
      techs: ["酵母展示", "BLI 动力学", "NGS", "FACS", "蛋白纯化", "脂质体制备", "荧光显微", "ICSI", "Western Blot", "彗星试验", "AI 蛋白设计工具", "HTS 流程"],
    },
    edu: {
      eyebrow: "03 / 经历",
      title: "从哈尔滨到东京 —— 二十六年，七步走完。",
      items: [
        { date: "2025 — 至今", current: true, h: "博士 · 化学生命工学", inst: "东京大学生研所 · 坪山研究室", detail: "在坪山幸太郎教授指导下，从事 AI 辅助蛋白质设计。" },
        { date: "2024 — 2025", h: "研究生", inst: "东京大学生研所 · 坪山研究室", detail: "加入实验室，启动脂质结合筛选。" },
        { date: "2022 — 2024", h: "硕士 · 生命科学", inst: "东京大学定量所 · 岡田研究室", detail: "精子染色质重构。获优秀毕业生奖。" },
        { date: "2018 — 2022", h: "学士 · 生物科学", inst: "东京农业大学", detail: "结构生物学。中国留学生学友会会长。" },
        { date: "2016 — 2018", h: "日语预科", inst: "富士国际语学院，东京", detail: "十六岁来到日本，从零开始学第三种语言。" },
        { date: "2010 — 2017", h: "基础教育", inst: "哈尔滨第三中学（群力）& 光华中学", detail: "中国东北。好奇心的起点。" },
      ],
    },
    pubs: {
      eyebrow: "04 / 成果",
      title: "演讲、海报，以及在路上的下一篇。",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "破译蛋白质-磷脂结合的通用原理", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国际会议 2025，淡路岛" },
        { date: "2023.12", type: "Poster P-25", title: "精子染色质体外再构成：革新的方法", venue: "2023 年度定量研究交流会，东京大学" },
        { date: "2023.06", type: "Poster P-49", title: "ex vivo 精子染色质再构成方法的建立", venue: "第 16 回日本表观遗传学研究会年会，一桥讲堂" },
        { date: "2023.06", type: "Poster", title: "二价阳离子对精子染色质结构的影响及体外再构成", venue: "第 22 回东京大学生命科学研讨会 BIO UT" },
        { date: "2022.11", type: "Poster P-25", title: "二价阳离子对精子染色质结构的影响解析", venue: "新学术领域联合「若手の会 2022」，大阪 Rinku" },
      ],
      papersEmpty: "第一作者论文撰写中 —— 敬请期待。",
      funding: { title: "JST SPRING-GX", desc: "日本科学技术振兴机构 · 次世代研究者挑战性研究项目 · 绿色转型高级人才培养计划。" },
      awards: [{ y: "2024.03", h: "优秀毕业生奖 · 广域科学专攻奖励奖", p: "东京大学综合文化研究科，令和 5 年度。" }],
    },
    hobbies: {
      eyebrow: "05 / 下班",
      title: "对一切与移液器无关的事情都好奇。",
      items: [
        ["山", "登山露营", "上高地、尾濑、立山黑部。"],
        ["海", "潜水", "OW 证书。安静地着迷。"],
        ["影", "摄影", "慢胶片，快列车。"],
        ["雪", "滑雪", "新潟的粉雪日。"],
        ["櫻", "季节", "伊豆的樱花，镰仓的紫阳花。"],
      ],
    },
    news: {
      eyebrow: "06 / 近况",
      title: "最近发生了什么。",
      items: [
        { when: "2025 · 01", h: "IPR 国际会议 2025", p: "在淡路岛发表蛋白质-磷脂结合研究。" },
        { when: "2025", h: "博士入学", p: "正式进入东京大学工学系研究科化学生命工学专攻博士课程。" },
        { when: "2024 · 04", h: "加入坪山研究室", p: "在生研所生体分子设计工学研究室开始研究。" },
        { when: "2024 · 03", h: "硕士毕业·获奖", p: "获广域科学专攻奖励奖。" },
      ],
    },
    contact: {
      headline: <>来 <em>聊聊科学。</em></>,
      sub: "科研合作、AI for Science、脂质生物物理，或只是在驹场喝杯咖啡 —— 我的邮箱永远开着。",
    },
  },
  ja: {
    nav: { about: "概要", research: "研究", pubs: "業績", edu: "経歴", news: "近況", contact: "連絡" },
    hero: {
      meta: ["東京大学 · 生研", "坪山研究室", "博士課程"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "AI タンパク質設計と生物物理学の交差点で研究しています — タンパク質が細胞膜の脂質アルファベットをどう読むか、その解読に取り組んでいます。",
      cta1: "研究を読む", cta2: "連絡する",
    },
    about: {
      eyebrow: "01 / 自己紹介",
      title: "都市と言語と分野の間を歩く研究者。",
      p1: "姚品碩と申します。ハルビンで生まれ、16歳で東京に来て日本語を学び、東京農業大学で生物学に夢中になり、それから分子を追いかけるのをやめていません。",
      p2: "現在は東京大学生産技術研究所・坪山研究室の博士課程に在籍しています。道具は酵母ディスプレイ、機械学習、BLI センサー。問いは：タンパク質はどうやって愛する脂質を見分けるのか、コンピュータにそれをゼロから設計させられるのか。",
      p3: "ラボの外では、山道か、レギュレータの先か、ラーメン屋の前にいます。",
    },
    research: {
      eyebrow: "02 / 研究",
      title: "脂質のアルファベットを、一つずつ解読する。",
      lede: "進行中の二つのプロジェクト、ひとつの執念：タンパク質 - 膜認識の普遍文法。",
      proj: [
        { n: "01", title: "末梢膜タンパク質のリン脂質結合ランドスケープ", tags: ["酵母ディスプレイ", "NGS", "ML"], summary: "数千の変異体をハイスループットでスクリーニング、どのタンパク質がどの脂質に結合するかをマッピング。", stats: [["~10⁵", "変異体"], ["8", "脂質クラス"], ["ML", "解釈性"]] },
        { n: "02", title: "BLI による脂質-タンパク質結合動態の標準化", tags: ["BLI", "速度論", "リポソーム"], summary: "再現性ある BLI プロトコル — 誰がどこで測っても同じ kₐ・k_d が出るように。", stats: [["nM", "親和性"], ["3+", "ラボ検証"], ["公開", "プロトコル"]] },
      ],
      interestsTitle: "追っている流れ",
      interests: [
        ["AI × 生物学", "AlphaFold から機能アノテーションまで。配列を読み構造を夢みるモデル。"],
        ["De novo 設計", "新機能を持つタンパク質を、原子レベルから設計する。"],
        ["大規模データ", "人が読みきれないスクリーニングデータを、機械学習に読ませる。"],
        ["タンパク質工学", "指向性進化と合理的設計 — 分子をよりよくする遅い手仕事。"],
      ],
      futureTitle: "次のステージ",
      organisms: ["E. coli", "S. cerevisiae", "マウス"],
      techs: ["酵母ディスプレイ", "BLI 速度論", "NGS", "FACS", "タンパク質精製", "リポソーム調製", "蛍光顕微鏡", "ICSI", "ウェスタンブロット", "コメットアッセイ", "AI 設計ツール", "HTS"],
    },
    edu: {
      eyebrow: "03 / 経歴",
      title: "ハルビンから東京へ — 26 年を七つの段で。",
      items: [
        { date: "2025 — 現在", current: true, h: "博士課程 · 化学生命工学", inst: "東京大学生研 · 坪山研究室", detail: "坪山幸太郎教授のもと、AI 支援タンパク質設計。" },
        { date: "2024 — 2025", h: "研究生", inst: "東京大学生研 · 坪山研究室", detail: "ラボに参加、脂質結合スクリーニングを開始。" },
        { date: "2022 — 2024", h: "修士 · 生命科学", inst: "東京大学定量研 · 岡田研究室", detail: "精子クロマチン再構成。優秀修了生表彰。" },
        { date: "2018 — 2022", h: "学士 · 生物科学", inst: "東京農業大学", detail: "構造生物学。中国人留学生学友会会長。" },
        { date: "2016 — 2018", h: "日本語課程", inst: "富士国際語学院、東京", detail: "16 歳で来日。三つ目の言語をゼロから。" },
        { date: "2010 — 2017", h: "基礎教育", inst: "ハルビン第三中学校（群力）、光華中学校", detail: "中国東北。好奇心の出発点。" },
      ],
    },
    pubs: {
      eyebrow: "04 / 業績",
      title: "発表、ポスター、そして次の一本。",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "タンパク質-リン脂質結合の普遍原理の解読", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国際会議 2025、淡路島" },
        { date: "2023.12", type: "Poster P-25", title: "精子クロマチン体外再構成：革新的手法", venue: "2023 年度定量研究交流会、東京大学" },
        { date: "2023.06", type: "Poster P-49", title: "ex vivo 精子クロマチン再構成法の確立", venue: "第 16 回日本エピジェネティクス研究会年会、一橋講堂" },
        { date: "2023.06", type: "Poster", title: "二価陽イオンが精子クロマチン構造に与える影響", venue: "第 22 回東京大学生命科学シンポジウム BIO UT" },
        { date: "2022.11", type: "Poster P-25", title: "二価陽イオンの精子クロマチン構造への影響解析", venue: "新学術・学術変革領域合同「若手の会 2022」、大阪りんくう" },
      ],
      papersEmpty: "筆頭著者論文を準備中 — お楽しみに。",
      funding: { title: "JST SPRING-GX", desc: "科学技術振興機構 · 次世代研究者挑戦的研究プログラム · GX 高度人材育成。" },
      awards: [{ y: "2024.03", h: "優秀修了生表彰 · 広域科学専攻奨励賞", p: "東京大学総合文化研究科、令和 5 年度。" }],
    },
    hobbies: {
      eyebrow: "05 / オフ",
      title: "ピペット以外のすべてに興味がある。",
      items: [
        ["山", "登山・キャンプ", "上高地、尾瀬、立山黒部。"],
        ["海", "ダイビング", "OW 取得。静かに夢中。"],
        ["影", "写真", "遅いフィルム、速い列車。"],
        ["雪", "スキー", "新潟のパウダー。"],
        ["櫻", "季節", "伊豆の桜、鎌倉の紫陽花。"],
      ],
    },
    news: {
      eyebrow: "06 / 近況",
      title: "最近の出来事。",
      items: [
        { when: "2025 · 01", h: "IPR 国際会議 2025", p: "淡路島でタンパク質-リン脂質結合研究を発表。" },
        { when: "2025", h: "博士課程入学", p: "東京大学工学系研究科化学生命工学専攻に正式入学。" },
        { when: "2024 · 04", h: "坪山研究室に参加", p: "生研の生体分子設計工学研究室で研究開始。" },
        { when: "2024 · 03", h: "修士修了・受賞", p: "広域科学専攻奨励賞を受賞。" },
      ],
    },
    contact: {
      headline: <>サイエンスの <em>話をしよう。</em></>,
      sub: "共同研究、AI for Science、脂質生物物理、駒場でのコーヒー — メールはいつでもどうぞ。",
    },
  },
};

const CONTACTS = [
  { label: "Email · primary", value: "pinshuoyao@outlook.com", href: "mailto:pinshuoyao@outlook.com" },
  { label: "Email · UTokyo", value: "yao1999@iis.u-tokyo.ac.jp", href: "mailto:yao1999@iis.u-tokyo.ac.jp" },
  { label: "Phone", value: "+81 80-6882-0322", href: "tel:+818068820322" },
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

  // apply mode + theme + accent to root
  useEffect(() => {
    document.body.setAttribute("data-mode", t.mode || "editorial");
    document.body.setAttribute("data-theme", t.theme || "light");
    document.documentElement.style.setProperty("--accent", t.accent || "#ff5722");
  }, [t.mode, t.theme, t.accent]);

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
            <h4>Coordinates</h4>
            <ul>
              <li><span className="key">city</span><span className="val">Tokyo, JP</span></li>
              <li><span className="key">institute</span><span className="val">UTokyo · IIS</span></li>
              <li><span className="key">lab</span><span className="val">Tsuboyama</span></li>
              <li><span className="key">role</span><span className="val">PhD candidate</span></li>
            </ul>
          </div>
          <div className="about-card">
            <h4>Languages</h4>
            <ul>
              <li><span className="key">中文</span><span className="val">Native</span></li>
              <li><span className="key">日本語</span><span className="val">Advanced</span></li>
              <li><span className="key">English</span><span className="val">Advanced</span></li>
            </ul>
          </div>
          <div className="about-card">
            <h4>Certifications</h4>
            <ul>
              <li><span className="key">PADI</span><span className="val">Open Water</span></li>
              <li><span className="key">運転免許</span><span className="val">普通自動車</span></li>
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
        <p className="reveal" style={{ color: "var(--muted)" }}>
          Two parallel tracks. One quantitative — measuring binding kinetics with rigour. One exploratory — letting machines find the patterns we can't see. Together they form one map of how proteins read membranes.
        </p>
      </div>

      <div className="projects">
        {R.proj.map((p, i) => (
          <div key={i} className={`project ${openProj === i ? "open" : ""}`} onClick={() => setOpenProj(openProj === i ? -1 : i)}>
            <div className="project-num">PROJ <span className="accent">{p.n}</span></div>
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
        <h3>Model organisms</h3>
        <div className="tech-cloud">
          {R.organisms.map((o, i) => <span key={i} className="org">{o}</span>)}
        </div>
      </div>
      <div className="tech-section reveal">
        <h3>Techniques</h3>
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
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Papers · in preparation</div>
        <div className="pub-empty">{P.papersEmpty}</div>
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Funding</div>
        <div className="pub-item" style={{ borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
          <div className="pub-date" style={{ color: "var(--accent)" }}>Active</div>
          <div className="pub-content">
            <h4>{P.funding.title}</h4>
            <div className="venue" style={{ marginTop: 6 }}>{P.funding.desc}</div>
          </div>
          <div className="pub-types"><span className="pub-tag intl">Grant</span></div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Awards</div>
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
          <div className="eyebrow">07 / Contact</div>
          <h2 className="contact-headline">{L.contact.headline}</h2>
          <p className="contact-sub">{L.contact.sub}</p>
          <div className="socials">
            {SOCIALS.map((s, i) => <a key={i} href={s.href} target="_blank" rel="noreferrer">{s.label} ↗</a>)}
          </div>
        </div>
        <div className="contact-list reveal">
          {CONTACTS.map((c, i) => {
            const inner = (
              <>
                <span className="label">{c.label}</span>
                <span className="value">{c.value}</span>
                <span className="arrow">{c.href ? "↗" : "·"}</span>
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
      <span>Built with curiosity · 好奇心 · 好奇心</span>
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
