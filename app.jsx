// app.jsx — main React app for YAO Pinshuo HP
const { useState, useEffect, useRef } = React;

// External URLs reused as inline links across the I18N (declared first
// because the I18N object literal references LINKS.* in JSX expressions).
const LINKS = {
  tsuboyama: "https://sites.google.com/view/tsubo-lab/home",
  iis: "https://www.iis.u-tokyo.ac.jp/en/",
  iqb: "https://www.iqb.u-tokyo.ac.jp/eng/",
  okada: "https://www.iam.u-tokyo.ac.jp/chromdyn/index.html",
  nodai: "https://www.nodai.ac.jp/english/",
  springGX: "https://www.u-tokyo.ac.jp/en/academics/spring_gx.html",
  jst: "https://www.jst.go.jp/EN/",
  jsps: "https://www.jsps.go.jp/english/e-pd/index.html",
  nanolsi: "https://nanolsi.kanazawa-u.ac.jp/en/",
  iprConf: "https://www.protein.osaka-u.ac.jp/",
  acsBiochem: "https://pubs.acs.org/journal/bichaw",
  paper: "https://doi.org/10.1021/acs.biochem.6c00344",
  cvPdf: "/cv.pdf",
};
function Lnk({ to, children }) {
  return <a href={to} target="_blank" rel="noreferrer">{children}</a>;
}

// Inline glossary term. Resolves the definition at render time (not while the
// I18N literal is being built), so it takes a language code rather than the
// language object. A missing key degrades to plain text rather than throwing.
function Term({ k, lang, children }) {
  const pack = I18N[lang] || I18N.en;
  const def = pack && pack.glossary && pack.glossary[k];
  if (!def) return <>{children}</>;
  return (
    <span className="term" tabIndex={0}>
      {children}
      <span className="term-pop">{def}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Shared, language-independent structure. Descriptions live in I18N under the
// matching key, so a missing translation renders an empty line instead of
// crashing the whole app.
// ---------------------------------------------------------------------------

// Computational models & tools used in the current project.
// href: null = link still to be confirmed.
const MODELS = [
  { key: "rfd3",        name: "RFdiffusion3",  group: "design",   href: null },
  { key: "proteinmpnn", name: "ProteinMPNN",   group: "design",   href: "https://doi.org/10.1126/science.add2187" },
  { key: "ligandmpnn",  name: "LigandMPNN",    group: "design",   href: "https://github.com/dauparas/LigandMPNN" },
  { key: "boltzgen2",   name: "BoltzGen2",     group: "design",   href: null },
  { key: "af3",         name: "AlphaFold3",    group: "struct",   href: "https://doi.org/10.1038/s41586-024-07487-w" },
  { key: "af2",         name: "AlphaFold2",    group: "struct",   href: "https://doi.org/10.1038/s41586-021-03819-2" },
  { key: "rosettafold", name: "RoseTTAFold",   group: "struct",   href: "https://doi.org/10.1126/science.abj8754" },
  { key: "boltz2",      name: "Boltz-2",       group: "struct",   href: "https://github.com/jwohlwend/boltz" },
  { key: "chai1",       name: "Chai-1",        group: "struct",   href: "https://github.com/chaidiscovery/chai-lab" },
  { key: "esm2",        name: "ESM-2",         group: "language", href: "https://doi.org/10.1126/science.ade2574" },
  { key: "esm3",        name: "ESM3",          group: "language", href: "https://github.com/evolutionaryscale/esm" },
  { key: "esmc",        name: "ESM-C",         group: "language", href: "https://github.com/evolutionaryscale/esm" },
  { key: "saprot",      name: "SaProt",        group: "language", href: "https://github.com/westlake-repl/SaProt" },
  { key: "masif",       name: "MaSIF",         group: "surface",  href: "https://doi.org/10.1038/s41592-019-0666-6" },
  { key: "nise",        name: "NISE",          group: "surface",  href: null },
  { key: "disco",       name: "DISCO",         group: "surface",  href: null },
];

// Grant / fellowship applications, newest first. Every application is listed,
// funded or not. `tone` drives the status pill colour.
const GRANTS = [
  { key: "springgx",    tone: "yes",     href: LINKS.springGX },
  { key: "dc2_2027",    tone: "pending", href: LINKS.jsps },
  { key: "spread_2026", tone: "lottery", href: LINKS.jst },
  { key: "dc2_2026",    tone: "no",      href: LINKS.jsps },
  { key: "dc1_2025",    tone: "no",      href: LINKS.jsps },
  { key: "dc1_2024",    tone: "no",      href: LINKS.jsps },
];

const I18N = {
  en: {
    nav: { about: "About", research: "Research", pubs: "Publications", edu: "Path", news: "News", contact: "Contact" },
    hero: {
      meta: ["UTOKYO · IIS", "TSUBOYAMA LAB", "10TH YEAR · TOKYO", "PHD CANDIDATE"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "I work at the intersection of AI-driven protein design and biophysics, uncovering how proteins recognize the phospholipid signatures that define cellular membranes.",
      cta1: "Read the work", cta2: "Get in touch",
      stats: [["01", "first-author paper"], ["05", "conference posters"], ["~20k", "domains profiled"], ["03", "languages"]],
    },
    about: {
      eyebrow: "01 / About",
      title: "Ten years in Tokyo, between cities, languages, and disciplines.",
      p1: "I'm Yao Pinshuo. Ten years ago, at sixteen, I left Harbin for Tokyo to learn a new language from scratch. I fell in love with biology at Tokyo University of Agriculture, and have been chasing molecules ever since.",
      p2: <>Today I am a PhD student at <Lnk to={LINKS.iis}>UTokyo IIS</Lnk>, in the <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk>. My instruments are yeast displays, machine learning models, and BLI sensors. My questions: how does a protein know which lipid it loves, and can we teach a computer to design new ones from scratch?</>,
      p3: "Outside the lab you'll find me on a mountain trail, with a film camera in hand, or planning the next quiet trip.",
      coordinatesTitle: "Coordinates",
      coords: [["city","Tokyo, JP"],["institute","UTokyo · IIS"],["lab","Tsuboyama"],["role","PhD candidate"]],
      languagesTitle: "Languages",
      langs: [["中文","Native"],["日本語","Advanced"],["English","Advanced"]],
    },
    // Definitions for terms used inline in running prose. Chips in the
    // technique / organism clouds carry their own definition instead.
    glossary: {
      ICSI: "Intracytoplasmic sperm injection — a single sperm is injected directly into an egg under a micromanipulator, bypassing natural fertilization.",
      BLI: "Bio-layer interferometry — a label-free optical biosensor that reads binding in real time from the interference shift of light on a sensor tip.",
      PIPs: "Phosphoinositides — eight phosphorylated derivatives of phosphatidylinositol whose phosphate pattern marks each membrane compartment.",
    },
    research: {
      eyebrow: "02 / Research",
      title: "How do proteins recognize the phospholipids that define a membrane?",
      lede: "Each membrane in a eukaryotic cell carries a distinct phospholipid signature; protein domains read those signatures to localize signaling, traffic cargo, and shape compartments. I want to understand how that recognition works, quantitatively, and at scale.",
      intro2: "Two parallel tracks. One is quantitative: measuring binding kinetics with rigor. The other is exploratory: letting machines find the patterns we cannot see by hand. Together they map the molecular logic of phospholipid recognition.",
      proj: [
        {
          n: "01",
          title: "A large-scale map of protein–phosphoinositide recognition",
          tags: ["High-throughput", "NGS", "Machine Learning"],
          summary: <>Phosphoinositides (PIPs) are eight phosphorylated lipids that label distinct compartments of the endomembrane system: PI(4,5)P₂ at the plasma membrane, PI(3)P on early endosomes, PI(3,5)P₂ on late endosomes, and so on. Lipid-binding domains (PH, PX, ENTH, GRAM, GLUE, C2 …) read these tiny phosphate decorations to control signaling, membrane trafficking, and cytoskeletal dynamics; a single mis-recognition (e.g. AKT1 PH E17K) can drive disease. Yet despite decades of case studies, no general rules describe how a given domain discriminates between the eight PIP species. Working in the <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk>, I assemble large-scale, comparable binding datasets across thousands of domains and lipid species, and use machine learning to look for the recognition rules underneath.</>,
          stats: [["~20k", "domains profiled"], ["13", "lipid species"], ["ML", "interpretability"]],
        },
        {
          n: "02",
          title: "Optimized liposome-based BLI for protein–phospholipid kinetics",
          tags: ["BLI", "Kinetics", "Liposomes"],
          summary: <>Most protein–lipid assays report only equilibrium binding strength: they cannot tell you whether a tighter affinity comes from a faster kₒₙ or a slower k_off, even though those two routes carry very different biological consequences. Bio-layer interferometry (BLI) can resolve real-time kinetics, but on lipid surfaces it is plagued by nonspecific protein adsorption. Through systematic buffer optimization (0.5% BSA, 0.001% Tween-20), we suppressed background binding while preserving liposome integrity, and recovered kₒₙ, k_off, and K_D for representative PX and PH domains and their mutant series. The platform distinguishes kinetic mechanisms: for the AKT1 PH series, affinity gains came mostly from slower k_off; for SnxA PX, from faster kₒₙ. Equilibrium binding alone cannot reveal that. Published in <Lnk to={LINKS.paper}>Biochemistry (ACS), 2026</Lnk>.</>,
          stats: [["kₒₙ · k_off", "real-time"], ["nM", "affinity range"], ["Open", "protocol"]],
        },
      ],
      interestsTitle: "Currents I follow",
      interests: [
        ["AI × Biology", "From AlphaFold to interpretable function. Models that read sequence and dream structure."],
        ["De novo design", "Engineering proteins with new functions, atom by atom, from a blank page."],
        ["High-throughput data", "Screens that produce more data than any human can read; ML to read them."],
        ["Protein engineering", "Directed evolution and rational design: the slow art of making molecules better."],
      ],
      modelsTitle: "Models & tools in the current project",
      modelsNote: "What I actually run, and what each one is for. Click a name for the paper or the code.",
      modelGroups: { design: "Generative design", struct: "Structure prediction", language: "Protein language models", surface: "Surface & interface" },
      models: {
        rfd3: "Diffusion model that generates protein backbones; the distinguishing feature is all-atom generation, so side chains and ligands are built in rather than added later.",
        proteinmpnn: "Inverse folding: given a backbone, it writes the amino acid sequence most likely to fold into it.",
        ligandmpnn: "ProteinMPNN extended to design sequences in the presence of ligands, nucleotides and metal ions.",
        boltzgen2: "Open generative model for de novo binder design.",
        af3: "Predicts the joint structure of proteins together with nucleic acids, ligands and ions in a single model.",
        af2: "The model that made accurate single-chain structure prediction routine; still the baseline everything is compared against.",
        rosettafold: "Three-track network predicting structure from sequence, developed in parallel with AlphaFold2.",
        boltz2: "Open co-folding model that predicts complex structure and binding affinity at once.",
        chai1: "Open multimodal structure prediction across proteins, ligands and nucleic acids.",
        esm2: "Protein language model trained on sequences alone; its embeddings still carry structural and functional signal.",
        esm3: "Multimodal generative language model reasoning jointly over sequence, structure and function.",
        esmc: "ESM Cambrian — a compact successor to ESM-2 tuned for representation quality per parameter.",
        saprot: "Structure-aware language model that tokenizes a 3Di structural alphabet alongside the amino acid sequence.",
        masif: "Geometric deep learning on molecular surfaces; learns interaction fingerprints that mark binding sites.",
        nise: "Applied to interface and binding-site analysis in the current screen.",
        disco: "Applied to interface and binding-site analysis in the current screen.",
      },
      organismsTitle: "Model organisms",
      organisms: [
        ["E. coli", "The workhorse bacterium for cloning and recombinant protein expression."],
        ["S. cerevisiae", "Budding yeast — host for surface-display libraries and a simple eukaryotic membrane system."],
        ["Mouse", "Mammalian model used in my master's work on sperm chromatin and early development."],
      ],
      techsTitle: "Techniques",
      techsNote: "Hover or tap a technique for a one-line explanation.",
      techs: [
        ["Yeast Display", "The protein of interest is displayed on the yeast cell wall, so binding can be read out cell-by-cell and sorted at library scale."],
        ["BLI Kinetics", "Bio-layer interferometry — a label-free optical biosensor that reads association and dissociation in real time."],
        ["NGS", "Next-generation sequencing — massively parallel sequencing that reads millions of library variants at once."],
        ["FACS", "Fluorescence-activated cell sorting — physically sorts individual cells by their fluorescence signal."],
        ["Protein Purification", "Isolating one recombinant protein from a lysate by affinity, ion-exchange and size-exclusion chromatography."],
        ["Liposome Prep", "Building artificial lipid vesicles of defined composition: the synthetic membrane a lipid-binding domain is tested against."],
        ["Fluorescence Microscopy", "Imaging where a fluorescently tagged molecule sits inside a cell or on a membrane."],
        ["ICSI", "Intracytoplasmic sperm injection — a single sperm is injected directly into an egg under a micromanipulator."],
        ["Western Blot", "Separating proteins by size on a gel and detecting one of them with a specific antibody."],
        ["Comet Assay", "Single-cell gel electrophoresis: damaged DNA trails out of the nucleus like a comet tail, quantifying DNA breakage."],
        ["AI Protein Design Tools", "Structure predictors, inverse folding and generative backbone models used together to propose new sequences."],
        ["HTS Workflows", "High-throughput screening: library construction, pooled selection, sequencing, and the analysis pipeline tying them together."],
      ],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "03 / Path",
      title: "From Harbin to Tokyo, a path written in cities and disciplines.",
      items: [
        { date: "Since 2025", current: true, h: "PhD · Chemical Biotechnology", inst: <>The University of Tokyo, <Lnk to={LINKS.iis}>IIS</Lnk> · <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk></>, detail: "AI-assisted protein design under Prof. Kotaro Tsuboyama. Supported by JST SPRING-GX." },
        { date: "2024–2025", h: "Research Student", inst: <>UTokyo <Lnk to={LINKS.iis}>IIS</Lnk> · <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk></>, detail: "Joined the lab and started the lipid-binding screen." },
        { date: "2022–2024", h: "MSc · Life Sciences", inst: <>The University of Tokyo, <Lnk to={LINKS.iqb}>IQB</Lnk> · <Lnk to={LINKS.okada}>Okada Lab</Lnk></>, detail: <>Built a method for reversible decondensation–recondensation of sperm chromatin, and verified development by <Term k="ICSI" lang="en">ICSI</Term> from epigenome-edited sperm. Concurrently a technical assistant at IQB (2022–2024). Outstanding Graduate Award.</> },
        { date: "2018–2022", h: "BSc · Biological Sciences", inst: <><Lnk to={LINKS.nodai}>Tokyo University of Agriculture</Lnk> · Yajima Lab</>, detail: "Structural biology of an IclR-family transcription factor; early adopter of AlphaFold2 / RoseTTAFold inside the lab." },
        { date: "2016–2018", h: "Japanese Language Program", inst: "Fuji International Language Institute, Tokyo", detail: "Moved to Japan at sixteen. Learned a third language from scratch." },
        { date: "2010–2017", h: "Secondary Education", inst: "Harbin No.3 High School (Qunli) & Guanghua Middle School", detail: "Northeast China. Where the curiosity began." },
      ],
    },
    pubs: {
      eyebrow: "04 / Output",
      title: "Papers, talks, and what's coming next.",
      presTitle: "Conference presentations",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "Decoding the Universal Principles of Protein–Phospholipid Binding", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR International Conference 2025, Awaji Island, Japan" },
        { date: "2023.12", type: "Poster P-25", title: "Ex Vivo Sperm Chromatin Reconstitution: An Innovative Approach", venue: "IQB Research Exchange Meeting 2023, UTokyo" },
        { date: "2023.06", type: "Poster P-49", title: "Establishment of ex vivo Sperm Chromatin Reconstitution Method", venue: "16th Annual Meeting of the Japan Epigenetics Research Society, Hitotsubashi Hall" },
        { date: "2023.06", type: "Poster", title: "Effects of Divalent Cations on Sperm Chromatin Structure & Ex Vivo Reconstitution", venue: "22nd UTokyo Life Sciences Symposium BIO UT, Komaba Campus" },
        { date: "2022.11", type: "Poster P-25", title: "Analysis of Divalent Cation Effects on Sperm Chromatin Structure", venue: "Joint \"Wakate-no-kai 2022\", Rinku, Osaka" },
      ],
      papersTitle: "Peer-reviewed papers",
      papers: [
        {
          date: "2026", status: "Published",
          title: "Quantitative Kinetic Analysis of Protein–Phosphoinositide Binding by Optimized Liposome-Based Bio-Layer Interferometry",
          authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
          venue: <><Lnk to={LINKS.acsBiochem}>Biochemistry</Lnk> (ACS), special issue “Lipids and Lipidation” · <Lnk to={LINKS.paper}>doi.org/10.1021/acs.biochem.6c00344</Lnk></>,
          note: "Received 20 Apr 2026 · accepted 23 Jul 2026. First-author.",
        },
      ],
      papersEmpty: "More first-author manuscripts in preparation. Stay tuned.",
      thesesTitle: "Theses",
      theses: [
        { y: "2024", h: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations", orig: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立", p: <>Master's thesis, Graduate School of Arts and Sciences, The University of Tokyo · <Lnk to={LINKS.okada}>Okada Lab</Lnk></> },
        { y: "2022", h: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P", orig: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析", p: <>Bachelor's thesis, <Lnk to={LINKS.nodai}>Tokyo University of Agriculture</Lnk> · Laboratory of Functional Molecular Analysis</> },
      ],
      fundingTitle: "Funding & fellowships",
      fundingNote: "Every application I have written so far, funded or not. Research runs on the ones that land and the ones that don't.",
      grantCols: ["Term", "Programme", "Project", "Outcome"],
      grants: {
        springgx: { year: "2024 – present", program: "JST SPRING-GX", title: <>Support for Pioneering Research Initiated by the Next Generation — <Lnk to={LINKS.springGX}>Green Transformation Program for Advanced Human Resource Development</Lnk>, The University of Tokyo.</>, status: "Awarded" },
        dc2_2027: { year: "FY2027", program: "JSPS DC2", title: "Elucidating the precise lipid-species recognition mechanism by large-scale analysis and machine learning (大規模解析と機械学習による精密な脂質種認識機構の解明).", status: "Under review" },
        spread_2026: { year: "2026", program: "JST SPReAD (1st call)", title: "Predicting lipid-binding specificity of lipid-binding domains and extracting recognition rules with a sequence–structure integrated AI (配列と構造統合AIによる脂質結合ドメインの脂質結合特異性の予測と認識規則抽出).", status: "Passed review · not drawn" },
        dc2_2026: { year: "FY2026", program: "JSPS DC2", title: "Analysis of protein lifetime determinants by large-scale measurement and machine learning (大規模測定と機械学習によるタンパク質の寿命決定因子解析).", status: "Not awarded" },
        dc1_2025: { year: "FY2025", program: "JSPS DC1", title: "Analysis of protein lifetime determinants by large-scale measurement and machine learning (大規模測定と機械学習によるタンパク質の寿命決定因子解析).", status: "Not awarded" },
        dc1_2024: { year: "FY2024", program: "JSPS DC1", title: "Elucidating the significance of the sperm epigenome through ex vivo sperm reconstitution (精子エピゲノムの意義を精子体外再構成法で解明する研究).", status: "Not awarded" },
      },
      awardsTitle: "Awards & activities",
      awards: [
        { y: "2024.03", h: "Outstanding Graduate Award, Interdisciplinary Sciences (広域科学専攻奨励賞)", p: "Graduate School of Arts and Sciences, The University of Tokyo, FY2023." },
        { y: "2023.08", h: <>Bio-SPM Summer School (<Lnk to={LINKS.nanolsi}>Kanazawa University NanoLSI</Lnk>), collaborative project accepted</>, p: "11th Bio-SPM Summer School. High-speed AFM imaging of in vitro reconstituted complexes." },
      ],
    },
    hobbies: {
      eyebrow: "05 / Off-hours",
      title: "Curious about everything that isn't a pipette.",
      items: [
        ["山", "Hiking & Camping", "Kamikochi, Oze, Tateyama Kurobe; the slower the trail, the better."],
        ["影", "Photography", "Film cameras, fast trains, the occasional stranger's smile."],
        ["猫", "Cats", "The smallest, quietest collaborators."],
        ["旅", "Travel", "Long trains, side streets, and a notebook for finding-out-later."],
      ],
    },
    news: {
      eyebrow: "06 / Recent",
      title: "What's new.",
      items: [
        { when: "2026 · 08", h: "First-author paper published", p: <>Out now in <Lnk to={LINKS.paper}>Biochemistry (ACS)</Lnk>, part of the special issue “Lipids and Lipidation”: quantitative kinetic analysis of protein–phosphoinositide binding by optimized liposome-based BLI.</> },
        { when: "2026 · 05", h: "JSPS DC2 application submitted", p: "Applied for FY2027 with the lipid-species recognition project. Under review." },
        { when: "2026 · 04", h: "BLI manuscript submitted", p: <>Submitted to <Lnk to={LINKS.acsBiochem}>Biochemistry (ACS)</Lnk> on 20 April; accepted three months later.</> },
        { when: "2025 · 01", h: "IPR International Conference 2025", p: "Presented the protein–phospholipid binding work on Awaji Island." },
        { when: "2025", h: "Started the PhD program", p: "Officially enrolled in Chemical Biotechnology, Graduate School of Engineering, UTokyo." },
        { when: "2024 · 04", h: "Joined the Tsuboyama Lab", p: <>Began research at the Biomolecular Design Engineering Lab, <Lnk to={LINKS.iis}>IIS</Lnk>.</> },
      ],
    },
    contact: {
      eyebrow: "07 / Contact",
      headline: <>Let's <em>talk science.</em></>,
      sub: "Collaborations, AI for Science, lipid biophysics, or just a cup of coffee in Komaba. My inbox is always open.",
      seekingLabel: "Open to",
      seeking: "Postdoctoral positions starting late 2027 or 2028, in protein design, synthetic biology, and computational cell biology.",
      cvLabel: "Download CV (PDF)",
    },
  },
  zh: {
    nav: { about: "关于", research: "研究", pubs: "成果", edu: "经历", news: "动态", contact: "联系" },
    hero: {
      meta: ["东京大学 · 生研所", "坪山研究室", "东京 · 第十年", "博士在读"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "我在 AI 蛋白质设计与生物物理的交叉口工作，探索蛋白质如何识别决定细胞内各膜系统身份的磷脂特征。",
      cta1: "看研究", cta2: "联系我",
      stats: [["01", "第一作者论文"], ["05", "会议海报"], ["~20k", "结构域"], ["03", "语言"]],
    },
    about: {
      eyebrow: "01 / 关于",
      title: "东京十年，穿行在城市、语言与学科之间。",
      p1: "我叫姚品碩。十年前，十六岁那年，我离开哈尔滨来到东京，从零开始学日语。后来在东京农业大学爱上了生物学，从此再也没有停止追逐分子。",
      p2: <>现在我是<Lnk to={LINKS.iis}>东京大学生研所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>的博士生。我的工具是酵母展示、机器学习模型和 BLI 传感器。我想知道：蛋白质是如何识别它所偏爱的脂质？我们能否教计算机从零开始设计新的蛋白？</>,
      p3: "实验室之外，你大概率会在山道上、相机后面，或下一次安静旅行的计划里找到我。",
      coordinatesTitle: "坐标",
      coords: [["城市","东京"],["机构","UTokyo · IIS"],["实验室","坪山"],["身份","博士生"]],
      languagesTitle: "语言",
      langs: [["中文","母语"],["日本語","熟练"],["English","熟练"]],
    },
    glossary: {
      ICSI: "卵胞浆内单精子注射——在显微操作下把一个精子直接注入卵母细胞，绕过自然受精过程。",
      BLI: "生物层干涉法——无标记光学生物传感技术，通过传感器针尖上的光干涉位移实时读出结合过程。",
      PIPs: "磷脂酰肌醇——磷脂酰肌醇的 8 种磷酸化衍生物，其磷酸基组合标记着不同的膜区室。",
    },
    research: {
      eyebrow: "02 / 研究",
      title: "蛋白质如何识别那些定义膜身份的磷脂？",
      lede: "真核细胞的每一层膜都带有独特的磷脂特征；蛋白质结构域阅读这些特征，从而决定信号定位、物质运输与细胞器形成。我希望理解这种识别如何运作，定量地，且大规模地。",
      intro2: "两条并行的轨道。一条是定量的：用严格的方法测量结合动力学。一条是探索性的：让机器从数据中找出我们手工看不见的规律。两者一起，绘制蛋白质识别磷脂的分子逻辑图谱。",
      proj: [
        {
          n: "01",
          title: "蛋白质对磷脂酰肌醇的识别：大规模图谱",
          tags: ["高通量", "NGS", "机器学习"],
          summary: <>磷脂酰肌醇（PIPs）是 8 种磷酸化脂质，标记着内膜系统的不同区室：PI(4,5)P₂ 在质膜，PI(3)P 在早期内体，PI(3,5)P₂ 在晚期内体，等等。脂质结合结构域（PH、PX、ENTH、GRAM、GLUE、C2 ……）通过识别这些极小的磷酸基修饰来调控信号传导、膜运输与细胞骨架动力学；一个识别错误（例如 AKT1 PH 的 E17K 突变）就足以引发疾病。然而经过几十年的个案研究，仍然没有一般规则能够描述任意结构域如何区分这 8 种 PIPs。我在<Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>里，建立可比较的、跨数千个结构域和脂质种的大规模结合数据集，并用机器学习寻找其中潜在的识别规则。</>,
          stats: [["~20k", "结构域"], ["13", "脂质种"], ["ML", "可解释性"]],
        },
        {
          n: "02",
          title: "蛋白质对磷脂结合动力学的标准化 BLI 平台",
          tags: ["BLI", "动力学", "脂质体"],
          summary: <>大多数蛋白质对脂质的实验只能给出平衡结合强度：无法分辨更紧的亲和性是来自更快的 kₒₙ 还是更慢的 k_off，即使这两条路径在生物学上意义截然不同。生物层干涉法（BLI）能够分辨实时动力学，但在脂质表面常常受到非特异性蛋白吸附的干扰。通过系统优化的缓冲液配方（0.5% BSA、0.001% Tween-20），我们抑制了背景结合同时保持脂质体的完整性，并对代表性的 PX、PH 结构域及其突变体系列恢复了 kₒₙ、k_off 与 K_D。该平台能够区分动力学机制：AKT1 PH 系列的亲和性增强主要来自更慢的 k_off；SnxA PX 则来自更快的 kₒₙ。这是平衡结合数据本身无法揭示的信息。论文发表于 <Lnk to={LINKS.paper}>Biochemistry (ACS)，2026</Lnk>。</>,
          stats: [["kₒₙ · k_off", "实时"], ["nM", "亲和力"], ["开放", "协议"]],
        },
      ],
      interestsTitle: "我追的潮流",
      interests: [
        ["AI × 生物", "从 AlphaFold 到可解释的功能。读序列、梦结构的模型。"],
        ["从头设计", "一个原子一个原子地设计具备新功能的蛋白。"],
        ["高通量数据", "筛选产生的数据没人读得完，机器学习来读。"],
        ["蛋白质工程", "定向进化与理性设计：让分子变好的慢手艺。"],
      ],
      modelsTitle: "当前课题里用到的模型与工具",
      modelsNote: "这些是我真正跑过的模型，以及各自负责什么。点名字可以跳转到原文或代码。",
      modelGroups: { design: "生成式设计", struct: "结构预测", language: "蛋白质语言模型", surface: "表面与界面" },
      models: {
        rfd3: "生成蛋白质骨架的扩散模型；最大的特点是支持全原子生成，侧链与配体在生成过程中一并构建，而非事后补上。",
        proteinmpnn: "逆折叠：给定一个骨架，写出最可能折叠成它的氨基酸序列。",
        ligandmpnn: "ProteinMPNN 的扩展版，可以在配体、核苷酸和金属离子存在的条件下设计序列。",
        boltzgen2: "用于从头结合蛋白设计的开源生成模型。",
        af3: "在同一个模型里联合预测蛋白质与核酸、配体、离子的复合物结构。",
        af2: "让单链结构预测第一次变得日常可用的模型；至今仍是所有方法的比较基准。",
        rosettafold: "与 AlphaFold2 同期出现的三轨网络，从序列预测结构。",
        boltz2: "开源共折叠模型，同时预测复合物结构与结合亲和力。",
        chai1: "开源的多模态结构预测模型，覆盖蛋白质、配体与核酸。",
        esm2: "只用序列训练的蛋白质语言模型，其表征中仍然携带结构与功能信息。",
        esm3: "在序列、结构、功能三种模态上联合推理的生成式语言模型。",
        esmc: "ESM Cambrian——ESM-2 的紧凑后继者，在同等参数下追求更好的表征质量。",
        saprot: "结构感知的语言模型，把 3Di 结构字母表与氨基酸序列一起做 token 化。",
        masif: "在分子表面上做几何深度学习，学出标记结合位点的相互作用指纹。",
        nise: "用于当前筛选中的界面与结合位点分析。",
        disco: "用于当前筛选中的界面与结合位点分析。",
      },
      organismsTitle: "模式生物",
      organisms: [
        ["E. coli", "克隆与重组蛋白表达的主力细菌。"],
        ["S. cerevisiae", "出芽酵母——表面展示文库的宿主，也是最简单的真核膜系统。"],
        ["小鼠", "硕士期间研究精子染色质与早期发育所用的哺乳动物模型。"],
      ],
      techsTitle: "技术",
      techsNote: "把鼠标停在（或点一下）某项技术，可以看到一句话说明。",
      techs: [
        ["酵母展示", "把目标蛋白展示在酵母细胞壁上，于是结合信号可以逐细胞读出，并在文库规模上分选。"],
        ["BLI 动力学", "生物层干涉法——无标记光学传感，实时读出结合与解离过程。"],
        ["NGS", "二代测序——大规模并行测序，一次读出文库中数百万个变体。"],
        ["FACS", "荧光激活细胞分选——按荧光信号把单个细胞实际分选出来。"],
        ["蛋白纯化", "用亲和、离子交换和分子筛层析，从裂解液里把某一个重组蛋白分离出来。"],
        ["脂质体制备", "制备成分确定的人工脂质囊泡：用来检验脂质结合结构域的“人造膜”。"],
        ["荧光显微", "观察带荧光标记的分子在细胞内或膜上的具体位置。"],
        ["ICSI", "卵胞浆内单精子注射——在显微操作下把一个精子直接注入卵母细胞。"],
        ["Western Blot", "先按分子量在凝胶上分离蛋白，再用特异抗体检出其中某一条。"],
        ["彗星试验", "单细胞凝胶电泳：受损 DNA 会像彗尾一样拖出细胞核，用来定量 DNA 断裂。"],
        ["AI 蛋白设计工具", "把结构预测、逆折叠与生成式骨架模型组合起来，提出新的序列。"],
        ["HTS 流程", "高通量筛选：文库构建、混合选择、测序，以及把它们串起来的分析流程。"],
      ],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "03 / 经历",
      title: "从哈尔滨到东京，一条由城市与学科书写的路径。",
      items: [
        { date: "2025 至今", current: true, h: "博士 · 化学生命工学", inst: <>东京大学 <Lnk to={LINKS.iis}>生研所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "在坪山幸太郎讲师指导下，从事 AI 辅助蛋白质设计。受 JST SPRING-GX 资助。" },
        { date: "2024–2025", h: "研究生", inst: <>东京大学 <Lnk to={LINKS.iis}>生研所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "加入实验室，启动脂质结合筛选。" },
        { date: "2022–2024", h: "硕士 · 生命科学", inst: <>东京大学 <Lnk to={LINKS.iqb}>定量所</Lnk> · <Lnk to={LINKS.okada}>岡田研究室</Lnk></>, detail: <>建立了精子染色质可逆解凝缩与再凝缩的方法，并通过 <Term k="ICSI" lang="zh">ICSI</Term> 验证表观遗传编辑后精子的发育。期间兼任定量所技术补佐员（2022–2024）。优秀毕业生奖。</> },
        { date: "2018–2022", h: "学士 · 生物科学", inst: <><Lnk to={LINKS.nodai}>东京农业大学</Lnk> · 矢嶋研究室</>, detail: "IclR 家族转录因子的结构生物学；在研究室内率先引入 AlphaFold2 / RoseTTAFold。" },
        { date: "2016–2018", h: "日语预科", inst: "富士国际语学院，东京", detail: "十六岁来到日本，从零开始学第三种语言。" },
        { date: "2010–2017", h: "基础教育", inst: "哈尔滨第三中学（群力）& 光华中学", detail: "中国东北。好奇心的起点。" },
      ],
    },
    pubs: {
      eyebrow: "04 / 成果",
      title: "论文、发表，与即将到来的下一篇。",
      presTitle: "学会发表",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "破译蛋白质对磷脂结合的通用原理", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国际会议 2025，淡路岛" },
        { date: "2023.12", type: "Poster P-25", title: "精子染色质体外再构成：革新的方法", venue: "2023 年度定量研究交流会，东京大学" },
        { date: "2023.06", type: "Poster P-49", title: "ex vivo 精子染色质再构成方法的建立", venue: "第 16 回日本表观遗传学研究会年会，一桥讲堂" },
        { date: "2023.06", type: "Poster", title: "二价阳离子对精子染色质结构的影响及体外再构成", venue: "第 22 回东京大学生命科学研讨会 BIO UT" },
        { date: "2022.11", type: "Poster P-25", title: "二价阳离子对精子染色质结构的影响解析", venue: "新学术领域联合「若手の会 2022」，大阪 Rinku" },
      ],
      papersTitle: "同行评审论文",
      papers: [
        {
          date: "2026", status: "已发表",
          title: "通过优化的脂质体生物层干涉法定量分析蛋白质对磷脂酰肌醇的结合动力学",
          authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
          venue: <><Lnk to={LINKS.acsBiochem}>Biochemistry</Lnk> (ACS)，专刊 “Lipids and Lipidation” · <Lnk to={LINKS.paper}>doi.org/10.1021/acs.biochem.6c00344</Lnk></>,
          note: "2026 年 4 月 20 日投稿 · 7 月 23 日接收。第一作者。",
        },
      ],
      papersEmpty: "其他第一作者论文正在撰写中。敬请期待。",
      thesesTitle: "学位论文",
      theses: [
        { y: "2024", h: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立", orig: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations", p: <>硕士学位论文，东京大学综合文化研究科广域科学专攻 · <Lnk to={LINKS.okada}>岡田研究室</Lnk></> },
        { y: "2022", h: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析", orig: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P", p: <>学士学位论文，<Lnk to={LINKS.nodai}>东京农业大学</Lnk>生命科学部 · 机能性分子解析学研究室</> },
      ],
      fundingTitle: "经费与奖学金",
      fundingNote: "这里列出我写过的每一份申请，成功的和失败的都在。研究是靠中的那些和没中的那些一起推着往前走的。",
      grantCols: ["年度", "项目", "课题", "结果"],
      grants: {
        springgx: { year: "2024 至今", program: "JST SPRING-GX", title: <>次世代研究者挑战性研究项目 · <Lnk to={LINKS.springGX}>绿色转型高级人才培养计划</Lnk>，东京大学。</>, status: "获资助" },
        dc2_2027: { year: "令和9年度", program: "日本学术振兴会 DC2", title: "大規模解析と機械学習による精密な脂質種認識機構の解明（用大规模解析与机器学习阐明精密的脂质种识别机制）。", status: "审查中" },
        spread_2026: { year: "2026", program: "JST SPReAD 第 1 回", title: "配列と構造統合AIによる脂質結合ドメインの脂質結合特異性の予測と認識規則抽出（用序列-结构统合 AI 预测脂质结合结构域的结合特异性并抽取识别规则）。", status: "通过审查 · 抽签未中" },
        dc2_2026: { year: "令和8年度", program: "日本学术振兴会 DC2", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析（用大规模测定与机器学习解析蛋白质寿命决定因子）。", status: "未获资助" },
        dc1_2025: { year: "令和7年度", program: "日本学术振兴会 DC1", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析（用大规模测定与机器学习解析蛋白质寿命决定因子）。", status: "未获资助" },
        dc1_2024: { year: "令和6年度", program: "日本学术振兴会 DC1", title: "精子エピゲノムの意義を精子体外再構成法で解明する研究（以精子体外再构成法阐明精子表观基因组的意义）。", status: "未获资助" },
      },
      awardsTitle: "奖励 & 活动",
      awards: [
        { y: "2024.03", h: "优秀毕业生奖 · 广域科学专攻奖励奖", p: "东京大学综合文化研究科，令和 5 年度。" },
        { y: "2023.08", h: <>Bio-SPM 夏季学校（<Lnk to={LINKS.nanolsi}>金沢大学 NanoLSI</Lnk>），共同研究采择</>, p: "金沢大学第 11 回 Bio-SPM 夏季学校。高速原子力显微镜对体外重组复合物的动态观察。" },
      ],
    },
    hobbies: {
      eyebrow: "05 / 下班",
      title: "对一切与移液器无关的事情都好奇。",
      items: [
        ["山", "登山露营", "上高地、尾濑、立山黑部，走得越慢越好。"],
        ["影", "摄影", "胶片相机，飞驰的列车，偶尔陌生人的笑容。"],
        ["猫", "猫", "最小、最安静的合作者。"],
        ["旅", "旅行", "长途列车、小巷子，一本之后再查的笔记。"],
      ],
    },
    news: {
      eyebrow: "06 / 近况",
      title: "最近发生了什么。",
      items: [
        { when: "2026 · 08", h: "第一作者论文发表", p: <>论文已在 <Lnk to={LINKS.paper}>Biochemistry (ACS)</Lnk> 上线，收入专刊 “Lipids and Lipidation”：通过优化的脂质体生物层干涉法定量分析蛋白质对磷脂酰肌醇的结合动力学。</> },
        { when: "2026 · 05", h: "提交学振 DC2 申请", p: "以脂质种识别机制为题申请令和 9 年度 DC2，目前审查中。" },
        { when: "2026 · 04", h: "BLI 论文投稿", p: <>4 月 20 日投稿至 <Lnk to={LINKS.acsBiochem}>Biochemistry (ACS)</Lnk>，三个月后被接收。</> },
        { when: "2025 · 01", h: "IPR 国际会议 2025", p: "在淡路岛发表蛋白质对磷脂结合的研究。" },
        { when: "2025", h: "博士入学", p: "正式进入东京大学工学系研究科化学生命工学专攻博士课程。" },
        { when: "2024 · 04", h: "加入坪山研究室", p: <>在 <Lnk to={LINKS.iis}>生研所</Lnk> 生体分子设计工学研究室开始研究。</> },
      ],
    },
    contact: {
      eyebrow: "07 / 联系",
      headline: <>来 <em>聊聊科学。</em></>,
      sub: "科研合作、AI for Science、脂质生物物理，或只是在驹场喝杯咖啡。我的邮箱永远开着。",
      seekingLabel: "在找",
      seeking: "2027 年末或 2028 年开始的博士后职位，方向：蛋白质设计、合成生物学、计算细胞生物学。",
      cvLabel: "下载简历 (PDF)",
    },
  },
  ja: {
    nav: { about: "概要", research: "研究", pubs: "業績", edu: "経歴", news: "近況", contact: "連絡" },
    hero: {
      meta: ["東京大学 · 生研", "坪山研究室", "東京 · 十年目", "博士課程"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "AI タンパク質設計と生物物理学の交差点で研究しています。タンパク質が細胞内のさまざまな膜のアイデンティティを定めるリン脂質シグネチャをどう認識するか、その解明に取り組んでいます。",
      cta1: "研究を読む", cta2: "連絡する",
      stats: [["01", "筆頭著者論文"], ["05", "学会ポスター"], ["~20k", "ドメイン"], ["03", "言語"]],
    },
    about: {
      eyebrow: "01 / 自己紹介",
      title: "東京で十年、都市と言語と分野の間を歩く研究者。",
      p1: "姚品碩と申します。十年前、十六歳の春にハルビンを離れ、東京で日本語をゼロから学び始めました。東京農業大学で生物学と出会ってからは、分子を追いかけるのをやめていません。",
      p2: <>現在は<Lnk to={LINKS.iis}>東京大学生研</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>の博士課程に在籍しています。道具は酵母ディスプレイ、機械学習、BLI センサー。問いは：タンパク質はどうやって愛する脂質を見分けるのか、コンピュータにそれをゼロから設計させられるのか。</>,
      p3: "ラボの外では、山道か、フィルムカメラの後ろか、次の静かな旅の計画の中にいます。",
      coordinatesTitle: "所在",
      coords: [["都市","東京"],["所属","UTokyo · IIS"],["研究室","坪山"],["役割","博士課程"]],
      languagesTitle: "言語",
      langs: [["中文","ネイティブ"],["日本語","上級"],["English","上級"]],
    },
    glossary: {
      ICSI: "卵細胞質内精子注入法——顕微操作により精子を 1 個だけ卵子内へ直接注入する、自然受精を介さない受精技術。",
      BLI: "バイオレイヤー干渉法——センサー先端の光干渉のシフトから結合をリアルタイムで読み取る、標識不要の光学バイオセンサー。",
      PIPs: "ホスホイノシチド——ホスファチジルイノシトールの 8 種のリン酸化誘導体。リン酸基の組み合わせが各膜コンパートメントを標識する。",
    },
    research: {
      eyebrow: "02 / 研究",
      title: "タンパク質はどうやって膜のアイデンティティを定めるリン脂質を認識するのか？",
      lede: "真核細胞のそれぞれの膜は、固有のリン脂質シグネチャを持つ。タンパク質ドメインはそのシグネチャを読み、シグナルを局所化し、貨物を輸送し、コンパートメントを形作る。私はその認識が、定量的に、かつ大規模にどう機能するかを理解したい。",
      intro2: "二つの並行する軌道。ひとつは定量的：結合動態を厳密に計測する。もうひとつは探索的：機械に、人手では見えないパターンを探させる。あわせてリン脂質認識の分子論理を地図化する。",
      proj: [
        {
          n: "01",
          title: "タンパク質によるホスホイノシチド認識の大規模マップ",
          tags: ["大規模解析", "NGS", "機械学習"],
          summary: <>ホスホイノシチド（PIPs）は、内膜系のそれぞれのコンパートメントを標識する 8 種類のリン酸化脂質である：PI(4,5)P₂ は細胞膜、PI(3)P は初期エンドソーム、PI(3,5)P₂ は後期エンドソームなど。脂質結合ドメイン（PH、PX、ENTH、GRAM、GLUE、C2 …）はこの極めて小さなリン酸基の差異を読み取り、シグナル伝達、膜輸送、細胞骨格動態を制御する；たった一つの認識ミス（例えば AKT1 PH の E17K 変異）が疾患の引き金となる。それにもかかわらず、特定のドメインがどのようにして 8 種類の PIPs を区別するのか、その一般則は未だに見えていない。<Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>で、私は数千のドメインと脂質種にまたがる比較可能な大規模結合データセットを構築し、その中に潜む認識規則を機械学習で探っている。</>,
          stats: [["~20k", "ドメイン"], ["13", "脂質種"], ["ML", "解釈性"]],
        },
        {
          n: "02",
          title: "タンパク質とリン脂質結合動態のための最適化 BLI",
          tags: ["BLI", "速度論", "リポソーム"],
          summary: <>ほとんどのタンパク質-脂質アッセイは平衡結合強度しか報告しない：より強い親和性が、より速い kₒₙ から来るのか、より遅い k_off から来るのかを区別できない。しかしこの二つは生物学的にまったく異なる帰結をもつ。バイオレイヤー干渉法（BLI）はリアルタイムの動態を解像できるが、脂質表面では非特異的吸着が大きな障害となる。系統的な緩衝液最適化（0.5% BSA、0.001% Tween-20）によって背景結合を抑え、リポソームの完全性を保ったまま、代表的な PX・PH ドメインとその変異体系列について kₒₙ・k_off・K_D を取得した。本プラットフォームは動態メカニズムを区別する：AKT1 PH 系列では親和性向上が主に k_off の遅さから、SnxA PX 系列では kₒₙ の速さから来ている。平衡結合測定だけでは分からない情報である。<Lnk to={LINKS.paper}>Biochemistry (ACS), 2026</Lnk> に掲載。</>,
          stats: [["kₒₙ · k_off", "リアルタイム"], ["nM", "親和性"], ["公開", "プロトコル"]],
        },
      ],
      interestsTitle: "追っている流れ",
      interests: [
        ["AI × 生物学", "AlphaFold から機能アノテーションまで。配列を読み構造を夢みるモデル。"],
        ["De novo 設計", "新機能を持つタンパク質を、原子レベルから設計する。"],
        ["大規模データ", "人が読みきれないスクリーニングデータを、機械学習に読ませる。"],
        ["タンパク質工学", "指向性進化と合理的設計：分子をよりよくする遅い手仕事。"],
      ],
      modelsTitle: "現在の課題で使っているモデル・ツール",
      modelsNote: "実際に走らせているモデルと、それぞれの役割。名前をクリックすると原論文またはコードへ。",
      modelGroups: { design: "生成的設計", struct: "構造予測", language: "タンパク質言語モデル", surface: "表面・界面" },
      models: {
        rfd3: "タンパク質骨格を生成する拡散モデル。最大の特徴は全原子生成に対応している点で、側鎖やリガンドを後付けせず生成過程に組み込む。",
        proteinmpnn: "逆折りたたみ：与えられた骨格に対して、それに最も折りたたまれやすいアミノ酸配列を書き出す。",
        ligandmpnn: "ProteinMPNN の拡張。リガンド・核酸・金属イオンが存在する条件下で配列を設計できる。",
        boltzgen2: "de novo バインダー設計のためのオープンな生成モデル。",
        af3: "タンパク質と核酸・リガンド・イオンの複合体構造を、単一のモデルで同時に予測する。",
        af2: "単鎖の構造予測を初めて日常的な道具にしたモデル。今もあらゆる手法の比較基準。",
        rosettafold: "AlphaFold2 と同時期に登場した三トラックネットワーク。配列から構造を予測する。",
        boltz2: "複合体構造と結合親和性を同時に予測するオープンな co-folding モデル。",
        chai1: "タンパク質・リガンド・核酸を横断するオープンなマルチモーダル構造予測モデル。",
        esm2: "配列のみで学習したタンパク質言語モデル。その表現には構造・機能のシグナルが残っている。",
        esm3: "配列・構造・機能の三モダリティを同時に扱う生成的言語モデル。",
        esmc: "ESM Cambrian——ESM-2 の後継。パラメータあたりの表現品質を重視したコンパクトなモデル。",
        saprot: "3Di 構造アルファベットをアミノ酸配列と併せてトークン化する、構造認識型の言語モデル。",
        masif: "分子表面上の幾何学的深層学習。結合部位を示す相互作用フィンガープリントを学習する。",
        nise: "現在のスクリーニングにおける界面・結合部位解析に使用。",
        disco: "現在のスクリーニングにおける界面・結合部位解析に使用。",
      },
      organismsTitle: "モデル生物",
      organisms: [
        ["E. coli", "クローニングと組換えタンパク質発現の主力となる細菌。"],
        ["S. cerevisiae", "出芽酵母——表面ディスプレイライブラリの宿主であり、最も単純な真核生物の膜システムでもある。"],
        ["マウス", "修士課程での精子クロマチンと初期発生の研究に用いた哺乳類モデル。"],
      ],
      techsTitle: "技術",
      techsNote: "技術名にカーソルを合わせる（またはタップする）と一行の説明が出ます。",
      techs: [
        ["酵母ディスプレイ", "目的タンパク質を酵母細胞壁上に提示し、結合を細胞ごとに読み出してライブラリ規模で分取する。"],
        ["BLI 速度論", "バイオレイヤー干渉法——標識不要の光学センサーで結合と解離をリアルタイムに読む。"],
        ["NGS", "次世代シーケンシング——超並列シーケンシングで数百万のライブラリバリアントを一度に読む。"],
        ["FACS", "蛍光活性化セルソーティング——蛍光シグナルで個々の細胞を分取する。"],
        ["タンパク質精製", "アフィニティ・イオン交換・ゲルろ過クロマトグラフィーで、ライセートから目的の組換えタンパク質だけを取り出す。"],
        ["リポソーム調製", "組成を規定した人工脂質小胞をつくる。脂質結合ドメインを試すための「人工膜」。"],
        ["蛍光顕微鏡", "蛍光標識した分子が細胞内や膜上のどこにいるかを可視化する。"],
        ["ICSI", "卵細胞質内精子注入法——顕微操作で精子を 1 個だけ卵子内に直接注入する。"],
        ["ウェスタンブロット", "ゲルでタンパク質をサイズ分離し、特異抗体で目的の一本を検出する。"],
        ["コメットアッセイ", "単一細胞ゲル電気泳動。損傷 DNA が彗星の尾のように核外へ流れ出し、DNA 切断を定量できる。"],
        ["AI 設計ツール", "構造予測・逆折りたたみ・生成的骨格モデルを組み合わせ、新しい配列を提案する。"],
        ["HTS", "ハイスループットスクリーニング：ライブラリ構築、プール選択、シーケンシングと、それらをつなぐ解析パイプライン。"],
      ],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "03 / 経歴",
      title: "ハルビンから東京へ、都市と分野が綴る道。",
      items: [
        { date: "2025–現在", current: true, h: "博士課程 · 化学生命工学", inst: <>東京大学 <Lnk to={LINKS.iis}>生研</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "坪山幸太郎講師のもと、AI 支援タンパク質設計。JST SPRING-GX 支援。" },
        { date: "2024–2025", h: "研究生", inst: <>東京大学 <Lnk to={LINKS.iis}>生研</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "ラボに参加、脂質結合スクリーニングを開始。" },
        { date: "2022–2024", h: "修士 · 生命科学", inst: <>東京大学 <Lnk to={LINKS.iqb}>定量研</Lnk> · <Lnk to={LINKS.okada}>岡田研究室</Lnk></>, detail: <>精子クロマチンの可逆的な脱凝縮と再凝縮の手法を確立し、エピゲノム編集後の精子から <Term k="ICSI" lang="ja">ICSI</Term> による発生を確認。同時期に定量研の技術補佐員（2022–2024）。優秀修了生表彰。</> },
        { date: "2018–2022", h: "学士 · 生物科学", inst: <><Lnk to={LINKS.nodai}>東京農業大学</Lnk> · 矢嶋研究室</>, detail: "IclR ファミリー転写因子の構造生物学；ラボ内で AlphaFold2 / RoseTTAFold をいち早く導入。" },
        { date: "2016–2018", h: "日本語課程", inst: "富士国際語学院、東京", detail: "16 歳で来日。三つ目の言語をゼロから。" },
        { date: "2010–2017", h: "基礎教育", inst: "ハルビン第三中学校（群力）、光華中学校", detail: "中国東北。好奇心の出発点。" },
      ],
    },
    pubs: {
      eyebrow: "04 / 業績",
      title: "論文、発表、そして次の一本。",
      presTitle: "学会発表",
      pres: [
        { date: "2025.01", intl: true, type: "Poster", title: "タンパク質とリン脂質結合の普遍原理の解読", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国際会議 2025、淡路島" },
        { date: "2023.12", type: "Poster P-25", title: "精子クロマチン体外再構成：革新的手法", venue: "2023 年度定量研究交流会、東京大学" },
        { date: "2023.06", type: "Poster P-49", title: "ex vivo 精子クロマチン再構成法の確立", venue: "第 16 回日本エピジェネティクス研究会年会、一橋講堂" },
        { date: "2023.06", type: "Poster", title: "二価陽イオンが精子クロマチン構造に与える影響", venue: "第 22 回東京大学生命科学シンポジウム BIO UT" },
        { date: "2022.11", type: "Poster P-25", title: "二価陽イオンの精子クロマチン構造への影響解析", venue: "新学術・学術変革領域合同「若手の会 2022」、大阪りんくう" },
      ],
      papersTitle: "査読付き論文",
      papers: [
        {
          date: "2026", status: "掲載",
          title: "最適化したリポソームベース・バイオレイヤー干渉法によるタンパク質とホスホイノシチドの結合動態の定量解析",
          authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
          venue: <><Lnk to={LINKS.acsBiochem}>Biochemistry</Lnk> (ACS)、特集号 “Lipids and Lipidation” · <Lnk to={LINKS.paper}>doi.org/10.1021/acs.biochem.6c00344</Lnk></>,
          note: "2026 年 4 月 20 日投稿 · 7 月 23 日受理。筆頭著者。",
        },
      ],
      papersEmpty: "他の筆頭著者論文を準備中。お楽しみに。",
      thesesTitle: "学位論文",
      theses: [
        { y: "2024", h: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立", orig: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations", p: <>修士学位論文、東京大学大学院総合文化研究科 広域科学専攻 · <Lnk to={LINKS.okada}>岡田研究室</Lnk></> },
        { y: "2022", h: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析", orig: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P", p: <>学士学位論文、<Lnk to={LINKS.nodai}>東京農業大学</Lnk>生命科学部 · 機能性分子解析学研究室</> },
      ],
      fundingTitle: "研究費・フェローシップ",
      fundingNote: "これまでに書いた申請をすべて並べています。採択されたものも、されなかったものも。研究はその両方に押されて進んでいます。",
      grantCols: ["年度", "制度", "課題", "結果"],
      grants: {
        springgx: { year: "2024–現在", program: "JST SPRING-GX", title: <>次世代研究者挑戦的研究プログラム · <Lnk to={LINKS.springGX}>GX 高度人材育成</Lnk>、東京大学。</>, status: "採択" },
        dc2_2027: { year: "令和9年度", program: "学振 DC2", title: "大規模解析と機械学習による精密な脂質種認識機構の解明", status: "審査中" },
        spread_2026: { year: "2026", program: "JST SPReAD 第 1 回", title: "配列と構造統合AIによる脂質結合ドメインの脂質結合特異性の予測と認識規則抽出", status: "要件審査通過 · 抽選漏れ" },
        dc2_2026: { year: "令和8年度", program: "学振 DC2", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析", status: "不採用" },
        dc1_2025: { year: "令和7年度", program: "学振 DC1", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析", status: "不採用" },
        dc1_2024: { year: "令和6年度", program: "学振 DC1", title: "精子エピゲノムの意義を精子体外再構成法で解明する研究", status: "不採用" },
      },
      awardsTitle: "受賞・活動",
      awards: [
        { y: "2024.03", h: "優秀修了生表彰 · 広域科学専攻奨励賞", p: "東京大学総合文化研究科、令和 5 年度。" },
        { y: "2023.08", h: <>Bio-SPM 夏の学校（<Lnk to={LINKS.nanolsi}>金沢大学 NanoLSI</Lnk>）、共同研究採択</>, p: "金沢大学第 11 回 Bio-SPM 夏の学校。高速原子間力顕微鏡による試験管内再構成複合体の動態観察。" },
      ],
    },
    hobbies: {
      eyebrow: "05 / オフ",
      title: "ピペット以外のすべてに興味がある。",
      items: [
        ["山", "登山・キャンプ", "上高地、尾瀬、立山黒部、遅い道ほどよい。"],
        ["影", "写真", "フィルムカメラ、速い列車、ときどき誰かの微笑み。"],
        ["猫", "猫", "もっとも小さく、もっとも静かな共同研究者。"],
        ["旅", "旅", "長い列車、路地裏、後で調べる用のノート。"],
      ],
    },
    news: {
      eyebrow: "06 / 近況",
      title: "最近の出来事。",
      items: [
        { when: "2026 · 08", h: "筆頭著者論文が公開", p: <><Lnk to={LINKS.paper}>Biochemistry (ACS)</Lnk> の特集号 “Lipids and Lipidation” に掲載：最適化リポソームベース BLI によるタンパク質とホスホイノシチドの結合動態の定量解析。</> },
        { when: "2026 · 05", h: "学振 DC2 に申請", p: "脂質種認識機構をテーマに令和 9 年度 DC2 へ申請。現在審査中。" },
        { when: "2026 · 04", h: "BLI 論文を投稿", p: <>4 月 20 日に <Lnk to={LINKS.acsBiochem}>Biochemistry (ACS)</Lnk> へ投稿、3 か月後に受理。</> },
        { when: "2025 · 01", h: "IPR 国際会議 2025", p: "淡路島でタンパク質とリン脂質結合の研究を発表。" },
        { when: "2025", h: "博士課程入学", p: "東京大学工学系研究科化学生命工学専攻に正式入学。" },
        { when: "2024 · 04", h: "坪山研究室に参加", p: <><Lnk to={LINKS.iis}>生研</Lnk> の生体分子設計工学研究室で研究開始。</> },
      ],
    },
    contact: {
      eyebrow: "07 / 連絡",
      headline: <>サイエンスの <em>話をしよう。</em></>,
      sub: "共同研究、AI for Science、脂質生物物理、駒場でのコーヒー。メールはいつでもどうぞ。",
      seekingLabel: "募集中",
      seeking: "2027 年後半または 2028 年開始のポスドク：タンパク質設計、合成生物学、計算細胞生物学を中心に。",
      cvLabel: "履歴書をダウンロード (PDF)",
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
  { label: "X", href: "https://x.com/YAOPinshuo" },
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
        {L.hero.stats && (
          <div className="hero-stats">
            {L.hero.stats.map(([n, l], i) => (
              <div key={i} className="hero-stat"><span className="n">{n}</span><span className="l">{l}</span></div>
            ))}
          </div>
        )}
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

// Small chip that carries a hover/focus definition. Used by the technique and
// organism clouds; `def` may be undefined, in which case it is a plain chip.
function Chip({ label, def, className }) {
  return (
    <span className={[className, def ? "has-term" : ""].filter(Boolean).join(" ")} tabIndex={def ? 0 : undefined}>
      {label}
      {def && <span className="term-pop">{def}</span>}
    </span>
  );
}

function Research({ L, openProj, setOpenProj }) {
  const R = L.research;
  const groups = Object.keys(R.modelGroups || {});
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

      {R.models && (
        <div className="tech-section reveal">
          <h3>{R.modelsTitle}</h3>
          <p className="tech-note">{R.modelsNote}</p>
          {groups.map(g => {
            const rows = MODELS.filter(m => m.group === g);
            if (!rows.length) return null;
            return (
              <div key={g} className="model-group">
                <div className="model-group-label">{R.modelGroups[g]}</div>
                <div className="model-grid">
                  {rows.map(m => (
                    <div key={m.key} className="model-card">
                      <div className="model-name">
                        {m.href
                          ? <a href={m.href} target="_blank" rel="noreferrer">{m.name}<span className="arrow-glyph"> ↗︎</span></a>
                          : <span>{m.name}</span>}
                      </div>
                      <p>{R.models[m.key]}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="tech-section reveal">
        <h3>{R.organismsTitle}</h3>
        <div className="tech-cloud">
          {R.organisms.map(([label, def], i) => <Chip key={i} className="org" label={label} def={def} />)}
        </div>
      </div>
      <div className="tech-section reveal">
        <h3>{R.techsTitle}</h3>
        {R.techsNote && <p className="tech-note">{R.techsNote}</p>}
        <div className="tech-cloud">
          {R.techs.map(([label, def], i) => <Chip key={i} label={label} def={def} />)}
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

function BlockLabel({ children }) {
  return <div className="block-label">{children}</div>;
}

function Publications({ L }) {
  const P = L.pubs;
  return (
    <section id="pubs">
      <div className="eyebrow">{P.eyebrow}</div>
      <h2 className="section-title reveal">{P.title}</h2>

      <div className="reveal">
        <BlockLabel>{P.papersTitle}</BlockLabel>
        {P.papers && P.papers.map((p, i) => (
          <div key={i} className="pub-item">
            <div className="pub-date" style={{ color: "var(--accent)" }}>{p.status}</div>
            <div className="pub-content">
              <h4>{p.title}</h4>
              {p.authors && <div className="authors">{p.authors}</div>}
              <div className="venue">{p.venue}</div>
              {p.note && <div className="pub-note">{p.note}</div>}
            </div>
            <div className="pub-types"><span className="pub-tag intl">{p.date}</span></div>
          </div>
        ))}
        <div className="pub-empty" style={{ marginTop: 16 }}>{P.papersEmpty}</div>
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <BlockLabel>{P.thesesTitle}</BlockLabel>
        {P.theses && P.theses.map((t, i) => (
          <div key={i} className="award-row">
            <div className="year">{t.y}</div>
            <div>
              <h4>{t.h}</h4>
              {t.orig && <div className="thesis-orig">{t.orig}</div>}
              <p>{t.p}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      <div className="pub-list reveal">
        <BlockLabel>{P.presTitle}</BlockLabel>
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
        <BlockLabel>{P.fundingTitle}</BlockLabel>
        <p className="funding-note">{P.fundingNote}</p>
        <div className="grant-table">
          <div className="grant-head">
            {P.grantCols.map((c, i) => <span key={i}>{c}</span>)}
          </div>
          {GRANTS.map(g => {
            const row = P.grants[g.key];
            if (!row) return null;
            return (
              <div key={g.key} className={`grant-row tone-${g.tone}`}>
                <div className="grant-year">{row.year}</div>
                <div className="grant-program">
                  {g.href ? <a href={g.href} target="_blank" rel="noreferrer">{row.program}</a> : row.program}
                </div>
                <div className="grant-title">{row.title}</div>
                <div className="grant-status"><span className="grant-pill">{row.status}</span></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="divider"></div>

      <div className="reveal">
        <BlockLabel>{P.awardsTitle}</BlockLabel>
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
          <div className="seeking-card">
            <div className="seeking-label">{L.contact.seekingLabel}</div>
            <p className="seeking-body">{L.contact.seeking}</p>
          </div>
          <div className="socials">
            {SOCIALS.map((s, i) => <a key={i} href={s.href} target="_blank" rel="noreferrer">{s.label} <span className="arrow-glyph">↗︎</span></a>)}
            {/* CV download intentionally disabled: cv.pdf is still a placeholder.
                Drop a real CV at /cv.pdf and re-enable the line below.
            <a className="socials-cv" href={LINKS.cvPdf} download>{L.contact.cvLabel} <span className="arrow-glyph">↓</span></a> */}
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

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
