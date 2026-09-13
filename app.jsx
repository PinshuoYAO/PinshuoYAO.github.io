// app.jsx — main React app for YAO Pinshuo HP
const { useState, useEffect, useRef } = React;

// External URLs reused as inline links across the I18N (declared first
// because the I18N object literal references LINKS.* in JSX expressions).
const LINKS = {
  tsuboyama: "https://sites.google.com/view/tsubo-lab/home",
  iis: "https://www.iis.u-tokyo.ac.jp/en/",
  iqb: "https://www.iqb.u-tokyo.ac.jp/",
  okada: "https://okadalab.iqb.u-tokyo.ac.jp/home-en/",
  nodai: "https://www.nodai.ac.jp/",
  springGX: "https://www.u-tokyo.ac.jp/en/academics/spring_gx.html",
  jsps: "https://www.jsps.go.jp/english/e-pd/index.html",
  spread: "https://www.mext.go.jp/aifors_spread/",
  nanolsi: "https://nanolsi.kanazawa-u.ac.jp/",
  nanolsiSchool: "https://nanolsi.kanazawa-u.ac.jp/research/applications/summerschool/",
  acsBiochem: "https://pubs.acs.org/journal/bichaw",
  paper: "https://doi.org/10.1021/acs.biochem.6c00344",
  akt1: "https://www.nature.com/articles/nature05933",
  pipCase1: "https://www.nature.com/articles/s41467-021-24639-y",
  pipCase2: "https://www.nature.com/articles/s41467-019-09355-y",
  clib: "https://www.nature.com/articles/s41556-026-01996-8",
  rosettaAsia: "https://sites.google.com/view/asianrosettacon-2026/",
  cvPdf: "cv.pdf",
};
// Readers who asked their OS for less motion get a static typewriter line and
// no scroll reveals (the CSS half of this lives in styles.css).
const REDUCED_MOTION = (() => {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
})();
// Touch screens have no hover, so a chip that both explains itself on hover
// and navigates on click needs a two-step rule there: see ModelChip.
const COARSE_POINTER = (() => {
  try { return window.matchMedia("(hover: none) and (pointer: coarse)").matches; } catch (e) { return false; }
})();

function Lnk({ to, children }) {
  return <a href={to} target="_blank" rel="noreferrer">{children}</a>;
}
// Inline highlight for a word that should catch the eye inside running text.
function Hl({ children }) {
  return <span className="hl">{children}</span>;
}

// Kinetic constants, typeset with real subscripts. React elements are
// immutable descriptors, so the same one can be reused in many places.
const KON = <>k<sub>on</sub></>;
const KOFF = <>k<sub>off</sub></>;
const KD = <>K<sub>D</sub></>;

// Popovers are centred on their trigger, which pushes them off-screen for
// triggers near the left or right edge of the viewport. Measure on open and
// slide the popover back inside; --pop-shift also moves the arrow the other
// way so it keeps pointing at the trigger.
function nudgePop(e) {
  const pop = e.currentTarget.querySelector(".term-pop");
  if (!pop) return;
  const chip = e.currentTarget.getBoundingClientRect();
  // width is unaffected by the translate, and keeps sub-pixel precision that
  // offsetWidth would round away
  const w = pop.getBoundingClientRect().width;
  const centre = chip.left + chip.width / 2;
  const margin = 12;
  const vw = document.documentElement.clientWidth;
  let shift = 0;
  if (centre - w / 2 < margin) shift = margin - (centre - w / 2);
  else if (centre + w / 2 > vw - margin) shift = vw - margin - (centre + w / 2);
  pop.style.setProperty("--pop-shift", shift.toFixed(2) + "px");
}
const POP_TRIGGERS = { onMouseEnter: nudgePop, onFocus: nudgePop };

// Popovers are laid out even while hidden, so an un-nudged one still widens
// the document. Place them all once after mount and again on resize/scroll.
function useNudgeAllPops(deps) {
  useEffect(() => {
    const run = () => {
      document.querySelectorAll(".term-pop").forEach(pop => {
        if (pop.parentElement) nudgePop({ currentTarget: pop.parentElement });
      });
    };
    // Timeline items start translated and settle when revealed, so re-place
    // on scroll too — throttled to one frame.
    let queued = 0;
    const schedule = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => { queued = 0; run(); });
    };
    const id = requestAnimationFrame(run);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      if (queued) cancelAnimationFrame(queued);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
    };
  }, deps);
}

// Inline glossary term. Resolves the definition at render time (not while the
// I18N literal is being built), so it takes a language code rather than the
// language object. A missing key degrades to plain text rather than throwing.
function Term({ k, lang, children }) {
  const pack = I18N[lang] || I18N.en;
  const def = pack && pack.glossary && pack.glossary[k];
  if (!def) return <>{children}</>;
  return (
    <span className="term" tabIndex={0} {...POP_TRIGGERS}>
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
// Every entry currently has a link; href: null renders the name without an
// arrow, for anything whose source is not yet confirmed.
const MODELS = [
  { key: "rfd3",        name: "RFdiffusion3",  group: "design",   href: "https://www.biorxiv.org/content/10.1101/2025.09.18.676967v2" },
  { key: "boltzgen",    name: "BoltzGen",      group: "design",   href: "https://github.com/HannesStark/boltzgen" },
  { key: "nise",        name: "NISE",          group: "design",   href: "https://www.nature.com/articles/s41586-026-10670-w" },
  { key: "disco",       name: "DISCO",         group: "design",   href: "https://arxiv.org/abs/2604.05181" },
  { key: "proteinmpnn", name: "ProteinMPNN",   group: "design",   href: "https://doi.org/10.1126/science.add2187" },
  { key: "ligandmpnn",  name: "LigandMPNN",    group: "design",   href: "https://github.com/dauparas/LigandMPNN" },
  { key: "af3",         name: "AlphaFold3",    group: "struct",   href: "https://doi.org/10.1038/s41586-024-07487-w" },
  { key: "af2",         name: "AlphaFold2",    group: "struct",   href: "https://doi.org/10.1038/s41586-021-03819-2" },
  { key: "rosettafold", name: "RoseTTAFold",   group: "struct",   href: "https://doi.org/10.1126/science.abj8754" },
  { key: "esmfold2",    name: "ESMFold2",      group: "struct",   href: "https://github.com/Biohub/esm" },
  { key: "boltz2",      name: "Boltz-2",       group: "struct",   href: "https://github.com/jwohlwend/boltz" },
  { key: "chai1",       name: "Chai-1",        group: "struct",   href: "https://github.com/chaidiscovery/chai-lab" },
  { key: "esm2",        name: "ESM-2",         group: "language", href: "https://doi.org/10.1126/science.ade2574" },
  { key: "esm3",        name: "ESM3",          group: "language", href: "https://github.com/evolutionaryscale/esm" },
  { key: "esmc",        name: "ESM-C",         group: "language", href: "https://github.com/evolutionaryscale/esm" },
  { key: "saprot",      name: "SaProt",        group: "language", href: "https://github.com/westlake-repl/SaProt" },
  { key: "masif",       name: "MaSIF",         group: "surface",  href: "https://doi.org/10.1038/s41592-019-0666-6" },
];

// Grant / fellowship applications, newest first. Every application is listed,
// funded or not. `tone` drives the status pill colour.
const GRANTS = [
  { key: "springgx",    tone: "yes",     href: LINKS.springGX },
  { key: "dc2_2027",    tone: "pending", href: LINKS.jsps },
  { key: "spread_2026", tone: "lottery", href: LINKS.spread },
  { key: "dc2_2026",    tone: "no",      href: LINKS.jsps },
  { key: "dc1_2025",    tone: "no",      href: LINKS.jsps },
  { key: "dc1_2024",    tone: "no",      href: LINKS.jsps },
];

// Contact rows: values and links are language-independent, labels are not.
const CONTACTS = [
  { id: "mailMain", value: "pinshuoyao@outlook.com", href: "mailto:pinshuoyao@outlook.com" },
  { id: "mailAlt", value: "pinshuoyao@gmail.com", href: "mailto:pinshuoyao@gmail.com" },
  { id: "mailUt", value: "yao1999@iis.u-tokyo.ac.jp", href: "mailto:yao1999@iis.u-tokyo.ac.jp" },
  { id: "mailEcc", value: "yaopinshuo@g.ecc.u-tokyo.ac.jp", href: "mailto:yaopinshuo@g.ecc.u-tokyo.ac.jp" },
  { id: "wechat", value: "yaopinshuo1999" },
  { id: "xhs", value: "744152221" },
  { id: "office", value: "Fe504, Institute of Industrial Science · 4-6-1 Komaba, Meguro-ku, Tokyo" },
];
const SOCIALS = [
  { label: "X", href: "https://x.com/YAOPinshuo" },
  { label: "Bluesky", href: "https://bsky.app/profile/yaopinshuo.bsky.social" },
  { label: "LinkedIn", href: "https://jp.linkedin.com/in/pinshuoyao" },
  { label: "GitHub", href: "https://github.com/PinshuoYAO" },
  { label: "ORCID", href: "https://orcid.org/0009-0001-0085-3113" },
  { label: "Google Scholar", href: "https://scholar.google.com/citations?user=2S2t-oMAAAAJ" },
  { label: "Instagram", href: "https://www.instagram.com/PINSHUOYAO" },
];

const NAV_KEYS = ["about", "research", "edu", "pubs", "news", "blog", "collect", "hobbies", "contact"];
// Nav entries are section anchors unless listed here.
const NAV_HREF = { collect: "collect.html" };

const I18N = {
  en: {
    nav: { about: "About", research: "Research", pubs: "Output", edu: "Path", hobbies: "Off-hours", news: "News", blog: "Blog", collect: "Collection", contact: "Contact" },
    hero: {
      meta: ["UTOKYO · INSTITUTE OF INDUSTRIAL SCIENCE", "TSUBOYAMA LAB", "PHD CANDIDATE"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "I work at the intersection of AI-driven protein design and biophysics, uncovering how proteins recognize the phospholipid signatures that define cellular membranes. Through AI design and high-throughput screening, I build highly specific phospholipid probes that a billion years of evolution never produced.",
      cta1: "Read the work", cta2: "Get in touch",
    },
    about: {
      eyebrow: "About me",
      title: "Ten years in Tokyo, between cities, languages, and disciplines.",
      p1: "I am Yao Pinshuo. Ten years ago, at seventeen, I left Harbin for Tokyo to learn a new language from scratch. I fell in love with biology at Tokyo University of Agriculture, and have been chasing molecules ever since.",
      p2: <>Today I am a PhD student at the <Lnk to={LINKS.iis}>Institute of Industrial Science</Lnk>, The University of Tokyo, in the <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk>. My instruments are yeast displays, machine learning models, and BLI sensors. My questions: how does a protein know which lipid it loves, and can we teach a computer to design new ones from scratch?</>,
      p3: <>My mother tongue is <Hl>Chinese</Hl>, and I hold research-level conversations in <Hl>English</Hl> and <Hl>Japanese</Hl>. You are welcome to write to me in any of the three. Outside the lab you'll find me on a mountain trail, with a film camera in hand, or planning the next quiet trip.</>,
    },
    // Definitions for terms used inline in running prose. Chips in the
    // technique / organism clouds carry their own definition instead.
    glossary: {
      ICSI: "Intracytoplasmic sperm injection: a single sperm is injected directly into an egg under a micromanipulator, bypassing natural fertilization.",
      BLI: "Bio-layer interferometry: a label-free optical biosensor that reads binding in real time from the interference shift of light on a sensor tip.",
      PIPs: "Phosphoinositides: eight phosphorylated derivatives of phosphatidylinositol whose phosphate pattern marks each membrane compartment.",
    },
    research: {
      eyebrow: "Research",
      title: "How do proteins recognize the phospholipids that define a membrane?",
      lede: "Each membrane in a eukaryotic cell carries a distinct phospholipid signature; protein domains read those signatures to localize signaling, traffic cargo, and shape compartments. I want to understand how that recognition works, quantitatively, and at scale.",
      projStatus: { failed: "Project failed", done: "Completed", active: "In progress" },
      outcomeLabel: "What happened",
      proj: [
        {
          n: "01",
          status: "failed",
          title: "A large-scale map of protein–phosphoinositide recognition",
          tags: ["High-throughput", "Yeast display", "Deep learning"],
          summary: <>Phosphoinositides (<Term k="PIPs" lang="en">PIPs</Term>) are eight phosphorylated lipids that label distinct compartments of the endomembrane system: PI(4,5)P₂ at the plasma membrane, PI(3)P on early endosomes, PI(3,5)P₂ on late endosomes, and so on. Lipid-binding domains (PH, PX, ENTH, GRAM, GLUE, C2 …) read these tiny phosphate decorations to control signaling, membrane trafficking, and cytoskeletal dynamics; a single mis-recognition <Lnk to={LINKS.akt1}>can drive disease</Lnk>, as the <Lnk to={LINKS.akt1}>AKT1 PH E17K mutation</Lnk> shows. Yet despite <Lnk to={LINKS.pipCase1}>decades</Lnk> of <Lnk to={LINKS.pipCase2}>case studies</Lnk>, no general rules describe how a given domain discriminates between the eight PIP species. Working in the <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk>, I set out to build <Lnk to={LINKS.clib}>large-scale, comparable binding datasets</Lnk> across thousands of domains and lipid species, and to learn the recognition rules from them.</>,
          outcome: "Using a large-scale screen built on yeast display, we obtained a binding map covering more than 20,000 natural lipid-binding domains against 13 lipid species, over 260,000 measurements in all, and tried to derive, understand, predict and ultimately design binding specificity and strength from it with deep learning. The data quality was not sufficient to carry that, and the project failed. What it did give us is a clear picture of where yeast display is and is not the right tool, and a hard lesson about how much data quality matters.",
        },
        {
          n: "02",
          status: "done",
          title: "Optimized liposome-based BLI for protein–phospholipid kinetics",
          tags: ["BLI", "Kinetics", "Liposomes"],
          summary: <>Most protein–lipid assays report only equilibrium binding strength: they cannot tell you whether a tighter affinity comes from a faster {KON} or a slower {KOFF}, even though those two routes carry very different biological consequences. Bio-layer interferometry (<Term k="BLI" lang="en">BLI</Term>) can resolve real-time kinetics, but on lipid surfaces it is plagued by nonspecific protein adsorption. Through systematic buffer optimization (0.5% BSA, 0.001% Tween-20), we suppressed background binding while preserving liposome integrity, and recovered {KON}, {KOFF} and {KD} for representative PX and PH domains and their mutant series. The platform distinguishes kinetic mechanisms: for the AKT1 PH series, affinity gains came mostly from a slower {KOFF}; for SnxA PX, from a faster {KON}. Equilibrium binding alone cannot reveal that.</>,
          paperLabel: "Published in Biochemistry (ACS), 2026",
          figure: { src: "assets/toc.png", alt: "Schematic of the optimized liposome-based BLI assay with kon-driven and koff-driven sensorgrams.", caption: "The optimized assay, and the two kinetic routes to tighter binding. Table-of-contents graphic from the paper." },
        },
        {
          n: "03",
          status: "active",
          title: "De novo design of phosphoinositide-binding proteins",
          tags: ["De novo design", "Diffusion models", "Membrane"],
          summary: "Designing a protein that binds one specific PIP is one of the hardest cases in small-molecule binder design, for three reasons at once. The eight PIP species are near-identical to each other, differing only in which hydroxyls of the inositol ring carry a phosphate. Those head groups are strongly negatively charged, so a positively charged pocket picks up almost anything acidic, so specificity has to come from a precisely placed hydrogen-bond network rather than electrostatics. And the target sits on a membrane surface, so the design also has to solve membrane insertion and get the orientation of the binding pocket right relative to the bilayer. We are working our way through it; more to say later.",
        },
      ],
      modelsTitle: "Models & tools in the current project",
      modelsNote: "What I actually run. Hover or tap a name for what it does; the name itself links to the paper or the code.",
      modelGroups: { design: "Generative design", struct: "Structure prediction", language: "Protein language models", surface: "Surface & interface" },
      modelTapHint: "tap again to open",
      models: {
        rfd3: "Diffusion model that generates protein backbones; the distinguishing feature is all-atom generation, so side chains and ligands are built in rather than added later.",
        boltzgen: "Probably the most general binder-design model available right now: it covers the widest range of design modes and lands a comparatively high success rate.",
        nise: "Generative design specialised for small-molecule binding proteins.",
        disco: "Generative design strongest on small-molecule and nucleic-acid binding proteins; reported by its authors as state of the art.",
        proteinmpnn: "Inverse folding: given a backbone, it writes the amino acid sequence most likely to fold into it.",
        ligandmpnn: "ProteinMPNN extended to design sequences in the presence of ligands, nucleotides and metal ions.",
        af3: "Predicts the joint structure of proteins together with nucleic acids, ligands and ions in a single model.",
        af2: "The model that made accurate single-chain structure prediction routine; still the baseline everything is compared against.",
        rosettafold: "Three-track network predicting structure from sequence, developed in parallel with AlphaFold2.",
        esmfold2: "Fast, and not heavily dependent on an MSA, which is exactly why it predicts de novo designed proteins well.",
        boltz2: "Open co-folding model that predicts complex structure and binding affinity at once.",
        chai1: "Open multimodal structure prediction across proteins, ligands and nucleic acids.",
        esm2: "Protein language model trained on sequences alone; its embeddings still carry structural and functional signal.",
        esm3: "Multimodal generative language model reasoning jointly over sequence, structure and function.",
        esmc: "ESM Cambrian, a compact successor to ESM-2 tuned for representation quality per parameter.",
        saprot: "Structure-aware language model that tokenizes a 3Di structural alphabet alongside the amino acid sequence.",
        masif: "Geometric deep learning on molecular surfaces; learns interaction fingerprints that mark binding sites.",
      },
      organismsTitle: "Model organisms",
      organisms: [
        ["E. coli", "The workhorse bacterium for cloning and recombinant protein expression."],
        ["S. cerevisiae", "Budding yeast, the host for surface-display libraries and a simple eukaryotic membrane system."],
        ["Mouse", "Mammalian model used in my master's work on sperm chromatin and early development."],
      ],
      techsTitle: "Techniques",
      techsNote: "Hover or tap a technique for a one-line explanation.",
      techs: [
        ["Yeast Display", "The protein of interest is displayed on the yeast cell wall, so binding can be read out cell-by-cell and sorted at library scale."],
        ["BLI Kinetics", "Bio-layer interferometry: a label-free optical biosensor that reads association and dissociation in real time."],
        ["NGS", "Next-generation sequencing: massively parallel sequencing that reads millions of library variants at once."],
        ["FACS", "Fluorescence-activated cell sorting: physically sorts individual cells by their fluorescence signal."],
        ["Protein Purification", "Isolating one recombinant protein from a lysate by affinity, ion-exchange and size-exclusion chromatography."],
        ["Liposome Prep", "Building artificial lipid vesicles of defined composition: the synthetic membrane a lipid-binding domain is tested against."],
        ["Fluorescence Microscopy", "Imaging where a fluorescently tagged molecule sits inside a cell or on a membrane."],
        ["ICSI", "Intracytoplasmic sperm injection: a single sperm is injected directly into an egg under a micromanipulator."],
        ["Western Blot", "Separating proteins by size on a gel and detecting one of them with a specific antibody."],
        ["Comet Assay", "Single-cell gel electrophoresis: damaged DNA trails out of the nucleus like a comet tail, quantifying DNA breakage."],
        ["AI Protein Design Tools", "Structure predictors, inverse folding and generative backbone models used together to propose new sequences."],
        ["HTS Workflows", "High-throughput screening: library construction, pooled selection, sequencing, and the analysis pipeline tying them together."],
      ],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "Path",
      title: "From Harbin to Tokyo, a path written in cities and disciplines.",
      items: [
        { date: "Since 2024.10", current: true, h: "PhD · Chemistry and Biotechnology", inst: <>The University of Tokyo, <Lnk to={LINKS.iis}>Institute of Industrial Science</Lnk> · <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk></>, detail: "AI-assisted protein design under Dr. Kotaro Tsuboyama. Supported by JST SPRING-GX. Expected completion September 2027." },
        { date: "2024.04–2024.09", h: "Research Student", inst: <>The University of Tokyo, <Lnk to={LINKS.iis}>Institute of Industrial Science</Lnk> · <Lnk to={LINKS.tsuboyama}>Tsuboyama Lab</Lnk></>, detail: "Joined the lab and started the lipid-binding screen." },
        { date: "2022–2024", h: "MSc · Life Sciences", inst: <>The University of Tokyo, <Lnk to={LINKS.iqb}>Institute for Quantitative Biosciences</Lnk> · <Lnk to={LINKS.okada}>Okada Lab (Laboratory of Pathology and Development)</Lnk></>, detail: <>Under Prof. Yuki Okada. Built a method for reversible decondensation–recondensation of sperm chromatin and tested the resulting sperm by <Term k="ICSI" lang="en">ICSI</Term>. Concurrently a technical assistant at the Institute for Quantitative Biosciences (2022–2024). <Hl>Outstanding Graduate Award</Hl>.</> },
        { date: "2018–2022", h: "BSc · Biological Sciences", inst: <><Lnk to={LINKS.nodai}>Tokyo University of Agriculture</Lnk> · Laboratory of Functional Molecular Analysis (Yajima Lab)</>, detail: "Under Prof. Shunsuke Yajima. Structural biology of an IclR-family transcription factor; early adopter of AlphaFold2 / RoseTTAFold inside the lab." },
        { date: "2016–2018", h: "Japanese Language Program", inst: "Fuji International Language Institute, Tokyo", detail: "Moved to Japan at seventeen. Learned a third language from scratch." },
        { date: "2010–2017", h: "Secondary Education", inst: "Harbin No.3 High School (Qunli) & Guanghua Middle School", detail: "Northeast China. Where the curiosity began." },
      ],
    },
    pubs: {
      eyebrow: "Output",
      title: "Papers, talks, and what's coming next.",
      presTitle: "Conference presentations",
      upcomingLabel: "Upcoming",
      intlLabel: "International",
      typeLabels: { Poster: "Poster" },
      pres: [
        // No abstract title yet, so the topic stands in; the Upcoming pill is
        // what keeps this from reading as something already presented.
        { date: "2026.10", intl: true, upcoming: true, type: "Poster", no: null, title: "De novo design of phosphoinositide-binding proteins", venue: "RosettaCon Asia 2026, Peking University, Beijing, China" },
        { date: "2025.01", intl: true, type: "Poster", no: null, title: "Decoding the Universal Principles of Protein–Phospholipid Binding", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR International Conference 2025, Awaji Island, Japan" },
        { date: "2023.12", type: "Poster", no: "P-25", title: "Ex Vivo Sperm Chromatin Reconstitution: An Innovative Approach", venue: "Institute for Quantitative Biosciences Research Exchange Meeting 2023, The University of Tokyo" },
        { date: "2023.06", type: "Poster", no: "P-49", title: "Establishment of ex vivo Sperm Chromatin Reconstitution Method", venue: "16th Annual Meeting of the Japanese Society for Epigenetics, Hitotsubashi Hall, Tokyo" },
        { date: "2023.06", type: "Poster", no: null, title: "Effects of Divalent Cations on Sperm Chromatin Structure & Ex Vivo Reconstitution", venue: "22nd UTokyo Life Sciences Symposium BIO UT, Komaba Campus" },
        { date: "2022.11", type: "Poster", no: "P-25", title: "Analysis of Divalent Cation Effects on Sperm Chromatin Structure", venue: "Joint “Wakate-no-kai 2022”, Rinku, Osaka" },
      ],
      papersTitle: "Peer-reviewed papers",
      papers: [
        {
          date: "2026", status: "Published",
          title: "Quantitative Kinetic Analysis of Protein–Phosphoinositide Binding by Optimized Liposome-Based Bio-Layer Interferometry",
          authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
          venue: <><Lnk to={LINKS.acsBiochem}>Biochemistry</Lnk> (ACS) 65 (16), 2557–2565, special issue “Lipids and Lipidation” · <Lnk to={LINKS.paper}>doi.org/10.1021/acs.biochem.6c00344</Lnk></>,
          note: "Received 20 Apr 2026 · accepted 23 Jul 2026. First-author.",
        },
      ],
      papersEmpty: "More first-author manuscripts in preparation. Stay tuned.",
      thesesTitle: "Theses",
      theses: [
        {
          y: "2024",
          h: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations",
          orig: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立",
          p: <>Master's thesis · The University of Tokyo, Graduate School of Arts and Sciences · <Lnk to={LINKS.okada}>Okada Lab</Lnk>, <Lnk to={LINKS.iqb}>Institute for Quantitative Biosciences</Lnk></>,
          body: <><p>A sperm cell carries the paternal genome in an extraordinarily condensed nucleus. Late in spermatogenesis roughly 90% of the histones are swapped for protamine, leaving mouse sperm chromatin about 40× denser than a somatic nucleus, dense enough to shield the DNA from mechanical and enzymatic damage. That same density is why methods developed for somatic chromatin do not work on it. Divalent cations were known to condense and decondense polyamine–DNA complexes in vitro, but whether they act on protamine-packed sperm chromatin was untested.</p><p>I profiled Mg²⁺, Ca²⁺, Zn²⁺ and Mn²⁺ against mouse sperm, combined them with nucleoplasmin treatment to strip protamine, used the chelators EDTA and TPEN to identify which ion was responsible, then assayed the products by comet assay for DNA integrity and by <Term k="ICSI" lang="en">ICSI</Term> for developmental competence. Mg²⁺ promoted decondensation and Zn²⁺ blocked it, both dose-dependently, and TPEN chelation confirmed the effect was Zn-specific. At 500 mM ZnCl₂, pH 1, decondensed chromatin recondensed to its original size or smaller: <Hl>the first reported method for recondensing sperm chromatin</Hl>. Recondensed sperm showed more DNA fragmentation than untreated controls though far less than an H₂O₂ positive control, and after ICSI the embryos reached the 4-cell stage at 24% against 67% for controls, with none reaching blastocyst. The handle works, but it is <Hl>not yet developmentally neutral</Hl>.</p><p>That still matters: a reversible open-and-close operation on sperm chromatin is the prerequisite for editing the sperm epigenome and asking what it contributes to development, and this experiment pinpoints the step where the current protocol harms the embryo, which is where the next iteration has to start.</p></>,
        },
        {
          y: "2022",
          h: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P",
          orig: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析",
          p: <>Bachelor's thesis · <Lnk to={LINKS.nodai}>Tokyo University of Agriculture</Lnk>, Faculty of Life Sciences · Laboratory of Functional Molecular Analysis (Prof. Shunsuke Yajima)</>,
          body: <><p>L-glucose is the mirror image of the D-glucose that all life runs on. It does not occur in nature and hexokinase will not phosphorylate it, so for almost every organism it is not food. A soil isolate, Paracoccus sp. 43P, metabolises it anyway, through a dedicated pathway regulated by the IclR-family transcription factor LgnR. How an organism evolves regulation for a sugar it has never encountered is an open question, and the atomic-level mechanism by which LgnR senses the state of that pathway and switches it had not been described.</p><p>I cloned and expressed LgnR in E. coli, purified it by Ni-affinity chromatography, confirmed the product by SDS-PAGE, dialysed and concentrated it, and screened crystallization conditions toward a structure. <Hl>Recombinant LgnR was purified to a crystallography-ready state</Hl> and the screens were run and evaluated.</p><p>A structure would show how a regulator adapts to a substrate evolution never gave it, which bears both on the origins of new metabolic capability and on engineering bacteria for bioremediation. This project is also <Hl>where I first ran AlphaFold2 and RoseTTAFold</Hl>, and where the computational half of my work began.</p></>,
        },
      ],
      fundingTitle: "Funding & fellowships",
      fundingNote: "Every application I have written so far, funded or not. Research runs on the ones that land and the ones that don't.",
      grantCols: ["Term", "Programme", "Project", "Outcome"],
      grants: {
        springgx: { year: "2024 – present", program: "JST SPRING-GX", title: <>Support for Pioneering Research Initiated by the Next Generation: <Lnk to={LINKS.springGX}>Green Transformation Program for Advanced Human Resource Development</Lnk>, The University of Tokyo.</>, status: "Awarded" },
        dc2_2027: { year: "FY2027", program: "JSPS DC2", title: "Elucidating the precise lipid-species recognition mechanism by large-scale analysis and machine learning (大規模解析と機械学習による精密な脂質種認識機構の解明).", status: "Under review" },
        spread_2026: { year: "2026", program: "JST SPReAD (1st call)", title: <><Lnk to={LINKS.spread}>AI for Science 萌芽的挑戦研究創出事業（SPReAD: Supporting Pioneering Research through AI for 1,000 Discovery challenges）</Lnk>, part of the MEXT “AI for Science による科学研究革新プログラム”. Project: predicting the lipid-binding specificity of lipid-binding domains and extracting recognition rules with a sequence–structure integrated AI.</>, status: "Passed review · not drawn" },
        dc2_2026: { year: "FY2026", program: "JSPS DC2", title: "Analysis of protein lifetime determinants by large-scale measurement and machine learning (大規模測定と機械学習によるタンパク質の寿命決定因子解析).", status: "Not awarded" },
        dc1_2025: { year: "FY2025", program: "JSPS DC1", title: "Analysis of protein lifetime determinants by large-scale measurement and machine learning (大規模測定と機械学習によるタンパク質の寿命決定因子解析).", status: "Not awarded" },
        dc1_2024: { year: "FY2024", program: "JSPS DC1", title: "Elucidating the significance of the sperm epigenome through ex vivo sperm reconstitution (精子エピゲノムの意義を精子体外再構成法で解明する研究).", status: "Not awarded" },
      },
      awardsTitle: "Awards & activities",
      awards: [
        { y: "2024.03", h: <><Hl>Outstanding Graduate Award</Hl>, Interdisciplinary Sciences (広域科学専攻奨励賞)</>, p: "Graduate School of Arts and Sciences, The University of Tokyo, FY2023." },
        { y: "2023.08", h: <><Lnk to={LINKS.nanolsiSchool}>Bio-SPM Summer School</Lnk> (<Lnk to={LINKS.nanolsi}>Kanazawa University NanoLSI</Lnk>), collaborative project accepted</>, p: "11th Bio-SPM Summer School. High-speed AFM imaging of in vitro reconstituted complexes." },
      ],
    },
    hobbies: {
      eyebrow: "Off-hours",
      title: "Curious about everything that isn't a pipette.",
      items: [
        ["山", "Hiking & Camping", "Kamikochi, Oze, Tateyama Kurobe; the slower the trail, the better."],
        ["影", "Photography", "Film cameras, fast trains, the occasional stranger's smile."],
        ["猫", "Cats", "The smallest, quietest collaborators."],
        ["旅", "Travel", "Long trains, side streets, and a notebook for finding-out-later."],
      ],
    },
    news: {
      eyebrow: "Recent",
      title: "What's new.",
      items: [
        { when: "2026 · 10", h: "Poster at RosettaCon Asia 2026", p: <>Will present the <Hl>de novo PIP-binder design</Hl> work at <Lnk to={LINKS.rosettaAsia}>RosettaCon Asia</Lnk>, 10 and 11 October, Peking University, Beijing.</> },
        { when: "2026 · 08", h: "First-author paper published", p: <>Out now in <Lnk to={LINKS.paper}>Biochemistry (ACS)</Lnk>, part of the special issue “Lipids and Lipidation”: quantitative kinetic analysis of protein–phosphoinositide binding by optimized liposome-based BLI.</> },
        { when: "2026 · 05", h: "JSPS DC2 application submitted", p: "Applied for FY2027 with the lipid-species recognition project. Under review." },
        { when: "2026 · 04", h: "BLI manuscript submitted", p: <>Submitted to <Lnk to={LINKS.acsBiochem}>Biochemistry (ACS)</Lnk> on 20 April; accepted three months later.</> },
        { when: "2025 · 01", h: "IPR International Conference 2025", p: "Presented the protein–phospholipid binding work on Awaji Island." },
        { when: "2024 · 10", h: "Started the PhD program", p: "Officially enrolled in Chemistry and Biotechnology, Graduate School of Engineering, The University of Tokyo." },
        { when: "2024 · 04", h: "Joined the Tsuboyama Lab", p: <>Began research at the Biomolecular Design Engineering Lab, <Lnk to={LINKS.iis}>Institute of Industrial Science</Lnk>.</> },
      ],
    },
    blog: {
      eyebrow: "Blog",
      title: "Notes from the bench and the terminal.",
      note: "Longer write-ups: what a failed screen actually teaches you, how to read a BLI sensorgram, and notes on the design models I run.",
      collectLink: "Shorter than a post: the collection, one-line notes on tools and papers worth keeping",
      posts: [
        {
          date: "2026 · 08 · 22",
          href: "posts/biotite.html",
          title: "Biotite, one library for the boring parts",
          excerpt: "A note to self on Biotite: sequences, 3D structures, database queries and wrappers for external tools, all in one Python package with a consistent API, so a small analysis script stops opening with two hundred lines of parsing.",
        },
        {
          date: "2026 · 08 · 17",
          href: "posts/py2dmol.html",
          title: "Protein figures without opening PyMOL",
          excerpt: "py2Dmol turns a PDB ID into a drawing you can actually use, in a browser tab: transparent background, ligands included, several styles. A short note on the tool and why it stays in my bookmarks.",
        },
        {
          date: "2026 · 08 · 17",
          href: "posts/bli-liposome.html",
          title: "Reading protein–lipid binding in real time",
          excerpt: "Almost every protein–lipid assay answers “how tightly?” Very few answer “how fast, and how long?” A method note on turning liposome-based BLI into a quantitative kinetic assay, on where the nonspecific signal actually comes from, and on what I would check before trusting the numbers.",
        },
      ],
      empty: "First posts are being written. Check back soon.",
    },
    contact: {
      eyebrow: "Contact",
      headline: <>Let's <em>talk science.</em></>,
      sub: "Collaborations, AI for Science, lipid biophysics, or just a cup of coffee in Komaba. My inbox is always open.",
      seekingLabel: "Open to",
      seeking: <>Postdoctoral positions starting late 2027 or 2028. I work on <Hl>both sides of the bench</Hl>: protein design, library construction, high-throughput screening, NGS processing and analysis, and binding kinetics are all things I can run end to end myself. What I want to do next is <Hl>put designed proteins to work inside living cells</Hl>, which draws me toward cell programming, genetic circuits and protein engineering.</>,
      cvLabel: "Download CV (PDF)",
      lastUpdate: "Last update",
      copy: "click to copy",
      copied: "copied",
      labels: {
        mailMain: "Email · primary",
        mailAlt: "Email · personal",
        mailUt: "Email · Institute of Industrial Science",
        mailEcc: "Email · UTokyo (ECC)",
        wechat: "WeChat",
        xhs: "RedNote",
        office: "Office",
      },
    },
  },

  zh: {
    nav: { about: "关于", research: "研究", pubs: "成果", edu: "经历", hobbies: "生活", news: "动态", blog: "博客", collect: "收藏", contact: "联系" },
    hero: {
      meta: ["东京大学生产技术研究所", "坪山研究室", "博士在读"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "我在 AI 蛋白质设计与生物物理的交叉口工作，探索蛋白质如何识别决定细胞内各膜系统身份的磷脂特征。我通过 AI 设计和高通量实验筛选，创造亿万年进化中未曾出现过的高特异性磷脂探针。",
      cta1: "看研究", cta2: "联系我",
    },
    about: {
      eyebrow: "关于我",
      title: "东京十年，穿行在城市、语言与学科之间。",
      p1: "我叫姚品碩。十年前，十七岁那年，我离开哈尔滨来到东京，从零开始学日语。后来在东京农业大学爱上了生物学，从此再也没有停止追逐分子。",
      p2: <>现在我是<Lnk to={LINKS.iis}>东京大学生产技术研究所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>的博士生。我的工具是酵母展示、机器学习模型和 BLI 传感器。我想知道：蛋白质是如何识别它所偏爱的脂质？我们能否教计算机从零开始设计新的蛋白？</>,
      p3: <>我的母语是<Hl>中文</Hl>，可以熟练用<Hl>英文</Hl>和<Hl>日语</Hl>对话，欢迎使用任意这三种语言与我沟通。实验室之外，你大概率会在山道上、相机后面，或下一次安静旅行的计划里找到我。</>,
    },
    glossary: {
      ICSI: "卵胞浆内单精子注射：在显微操作下把一个精子直接注入卵母细胞，绕过自然受精过程。",
      BLI: "生物层干涉法：无标记光学生物传感技术，通过传感器针尖上的光干涉位移实时读出结合过程。",
      PIPs: "磷脂酰肌醇：磷脂酰肌醇的 8 种磷酸化衍生物，其磷酸基组合标记着不同的膜区室。",
    },
    research: {
      eyebrow: "研究",
      title: "蛋白质如何识别那些定义膜身份的磷脂？",
      lede: "真核细胞的每一层膜都带有独特的磷脂特征；蛋白质结构域阅读这些特征，从而决定信号定位、物质运输与细胞器形成。我希望理解这种识别如何运作，定量地，且大规模地。",
      projStatus: { failed: "项目失败", done: "已结束", active: "进行中" },
      outcomeLabel: "结果与反思",
      proj: [
        {
          n: "01",
          status: "failed",
          title: "蛋白质对磷脂酰肌醇的识别：大规模图谱",
          tags: ["高通量", "酵母展示", "深度学习"],
          summary: <>磷脂酰肌醇（<Term k="PIPs" lang="zh">PIPs</Term>）是 8 种磷酸化脂质，标记着内膜系统的不同区室：PI(4,5)P₂ 在质膜，PI(3)P 在早期内体，PI(3,5)P₂ 在晚期内体，等等。脂质结合结构域（PH、PX、ENTH、GRAM、GLUE、C2 ……）通过识别这些极小的磷酸基修饰来调控信号传导、膜运输与细胞骨架动力学；一个识别错误就<Lnk to={LINKS.akt1}>足以引发疾病</Lnk>，<Lnk to={LINKS.akt1}>AKT1 PH 的 E17K 突变</Lnk>便是一例。然而经过<Lnk to={LINKS.pipCase1}>数十年</Lnk>的<Lnk to={LINKS.pipCase2}>个案研究</Lnk>，仍然没有一般规则能够描述任意结构域如何区分这 8 种 PIPs。我在<Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>里，试图建立跨数千个结构域和脂质种的、可比较的<Lnk to={LINKS.clib}>大规模结合数据集</Lnk>，并从中学出识别规则。</>,
          outcome: "我们使用基于酵母展示（yeast display）开发的大规模筛选方法，获取了超过 2 万个天然脂质结合结构域与 13 种脂质的结合图谱，共计超过 26 万条数据，想要借助深度学习从中推导、理解、预测乃至设计它们的结合特异性和强度。但受限于数据质量，这条路最终走向失败。从中我们理解到了酵母展示方法的适用范围，以及数据质量的重要性。",
        },
        {
          n: "02",
          status: "done",
          title: "蛋白质对磷脂结合动力学的优化脂质体 BLI 平台",
          tags: ["BLI", "动力学", "脂质体"],
          summary: <>大多数蛋白质对脂质的实验只能给出平衡结合强度：无法分辨更紧的亲和性是来自更快的 {KON} 还是更慢的 {KOFF}，即使这两条路径在生物学上意义截然不同。生物层干涉法（<Term k="BLI" lang="zh">BLI</Term>）能够分辨实时动力学，但在脂质表面常常受到非特异性蛋白吸附的干扰。通过系统优化的缓冲液配方（0.5% BSA、0.001% Tween-20），我们抑制了背景结合同时保持脂质体的完整性，并对代表性的 PX、PH 结构域及其突变体系列恢复了 {KON}、{KOFF} 与 {KD}。该平台能够区分动力学机制：AKT1 PH 系列的亲和性增强主要来自更慢的 {KOFF}；SnxA PX 则来自更快的 {KON}。这是平衡结合数据本身无法揭示的信息。</>,
          paperLabel: "论文发表于 Biochemistry (ACS)，2026",
          figure: { src: "assets/toc.png", alt: "优化后的脂质体 BLI 方法示意图，以及 kon 与 koff 两种驱动方式的曲线。", caption: "优化后的实验体系，以及结合变紧的两条动力学路径。图为论文的目录图。" },
        },
        {
          n: "03",
          status: "active",
          title: "磷脂结合蛋白的从头设计",
          tags: ["从头设计", "扩散模型", "膜"],
          summary: "设计一个只结合某一种 PIP 的蛋白，是小分子结合蛋白设计中难度最高的一类，因为三重困难同时存在。PIPs 家族的 8 个成员彼此高度相似，区别仅在于肌醇环上哪几个羟基被磷酸化。它们的头部带有强负电，正电口袋很容易把所有带酸性的东西都抓上来，因此特异性必须来自高度精准的氢键网络，而不能依赖静电。而且目标位于膜表面，所以设计还必须同时解决膜插入，以及结合口袋相对于双层膜的方向性问题。我们正在努力迈进，请期待。",
        },
      ],
      modelsTitle: "当前课题里用到的模型与工具",
      modelsNote: "这些是我真正跑过的模型。悬停或点一下名字可以看到它负责什么，名字本身链接到原文或代码。",
      modelGroups: { design: "生成式设计", struct: "结构预测", language: "蛋白质语言模型", surface: "表面与界面" },
      modelTapHint: "再点一次打开链接",
      models: {
        rfd3: "生成蛋白质骨架的扩散模型；最大的特点是支持全原子生成，侧链与配体在生成过程中一并构建，而非事后补上。",
        boltzgen: "可能是目前最通用的结合蛋白设计模型：可设计模式最全面，成功率也相对较高。",
        nise: "生成式设计模型，专门针对小分子结合蛋白的设计做了优化。",
        disco: "生成式设计模型，强项在小分子结合蛋白与核酸结合蛋白，作者自称达到 SOTA。",
        proteinmpnn: "逆折叠：给定一个骨架，写出最可能折叠成它的氨基酸序列。",
        ligandmpnn: "ProteinMPNN 的扩展版，可以在配体、核苷酸和金属离子存在的条件下设计序列。",
        af3: "在同一个模型里联合预测蛋白质与核酸、配体、离子的复合物结构。",
        af2: "让单链结构预测第一次变得日常可用的模型；至今仍是所有方法的比较基准。",
        rosettafold: "与 AlphaFold2 同期出现的三轨网络，从序列预测结构。",
        esmfold2: "速度快，且不过度依赖 MSA，这也正是它对 de novo 设计蛋白预测效果好的原因。",
        boltz2: "开源共折叠模型，同时预测复合物结构与结合亲和力。",
        chai1: "开源的多模态结构预测模型，覆盖蛋白质、配体与核酸。",
        esm2: "只用序列训练的蛋白质语言模型，其表征中仍然携带结构与功能信息。",
        esm3: "在序列、结构、功能三种模态上联合推理的生成式语言模型。",
        esmc: "ESM Cambrian，ESM-2 的紧凑后继者，在同等参数下追求更好的表征质量。",
        saprot: "结构感知的语言模型，把 3Di 结构字母表与氨基酸序列一起做 token 化。",
        masif: "在分子表面上做几何深度学习，学出标记结合位点的相互作用指纹。",
      },
      organismsTitle: "模式生物",
      organisms: [
        ["E. coli", "克隆与重组蛋白表达的主力细菌。"],
        ["S. cerevisiae", "出芽酵母，表面展示文库的宿主，也是最简单的真核膜系统。"],
        ["小鼠", "硕士期间研究精子染色质与早期发育所用的哺乳动物模型。"],
      ],
      techsTitle: "技术",
      techsNote: "把鼠标停在（或点一下）某项技术，可以看到一句话说明。",
      techs: [
        ["酵母展示", "把目标蛋白展示在酵母细胞壁上，于是结合信号可以逐细胞读出，并在文库规模上分选。"],
        ["BLI 动力学", "生物层干涉法：无标记光学传感，实时读出结合与解离过程。"],
        ["NGS", "二代测序：大规模并行测序，一次读出文库中数百万个变体。"],
        ["FACS", "荧光激活细胞分选：按荧光信号把单个细胞实际分选出来。"],
        ["蛋白纯化", "用亲和、离子交换和分子筛层析，从裂解液里把某一个重组蛋白分离出来。"],
        ["脂质体制备", "制备成分确定的人工脂质囊泡：用来检验脂质结合结构域的“人造膜”。"],
        ["荧光显微", "观察带荧光标记的分子在细胞内或膜上的具体位置。"],
        ["ICSI", "卵胞浆内单精子注射：在显微操作下把一个精子直接注入卵母细胞。"],
        ["Western Blot", "先按分子量在凝胶上分离蛋白，再用特异抗体检出其中某一条。"],
        ["彗星试验", "单细胞凝胶电泳：受损 DNA 会像彗尾一样拖出细胞核，用来定量 DNA 断裂。"],
        ["AI 蛋白设计工具", "把结构预测、逆折叠与生成式骨架模型组合起来，提出新的序列。"],
        ["HTS 流程", "高通量筛选：文库构建、混合选择、测序，以及把它们串起来的分析流程。"],
      ],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "经历",
      title: "从哈尔滨到东京，一条由城市与学科书写的路径。",
      items: [
        { date: "2024.10 至今", current: true, h: "博士 · 化学生命工学", inst: <>东京大学 <Lnk to={LINKS.iis}>生产技术研究所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "在坪山幸太郎讲师指导下，从事 AI 辅助蛋白质设计。受 JST SPRING-GX 资助。预计 2027 年 9 月毕业。" },
        { date: "2024.04–2024.09", h: "研究生", inst: <>东京大学 <Lnk to={LINKS.iis}>生产技术研究所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "加入实验室，启动脂质结合筛选。" },
        { date: "2022–2024", h: "硕士 · 生命科学", inst: <>东京大学 <Lnk to={LINKS.iqb}>定量生命科学研究所</Lnk> · <Lnk to={LINKS.okada}>冈田研究室（病态发生控制研究分野）</Lnk></>, detail: <>指导教授：岡田由紀。建立了精子染色质可逆解凝缩与再凝缩的方法，并用 <Term k="ICSI" lang="zh">ICSI</Term> 检验了处理后精子的发育能力。期间兼任定量生命科学研究所技术补佐员（2022–2024）。<Hl>优秀毕业生奖</Hl>。</> },
        { date: "2018–2022", h: "学士 · 生物科学", inst: <><Lnk to={LINKS.nodai}>东京农业大学</Lnk> · 机能性分子解析学研究室（矢嶋研究室）</>, detail: "指导教授：矢嶋俊介。IclR 家族转录因子的结构生物学；在研究室内率先引入 AlphaFold2 / RoseTTAFold。" },
        { date: "2016–2018", h: "日语预科", inst: "富士国际语学院，东京", detail: "十七岁来到日本，从零开始学第三种语言。" },
        { date: "2010–2017", h: "基础教育", inst: "哈尔滨第三中学（群力）& 光华中学", detail: "中国东北。好奇心的起点。" },
      ],
    },
    pubs: {
      eyebrow: "成果",
      title: "论文、发表，与即将到来的下一篇。",
      presTitle: "学会发表",
      upcomingLabel: "即将",
      intlLabel: "国际",
      typeLabels: { Poster: "海报" },
      pres: [
        { date: "2026.10", intl: true, upcoming: true, type: "Poster", no: null, title: "磷脂结合蛋白的从头设计", venue: "RosettaCon Asia 2026，北京大学，北京" },
        { date: "2025.01", intl: true, type: "Poster", no: null, title: "破译蛋白质对磷脂结合的通用原理", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国际会议 2025，淡路岛" },
        { date: "2023.12", type: "Poster", no: "P-25", title: "精子染色质体外再构成：革新的方法", venue: "2023 年度定量生命科学研究所研究交流会，东京大学" },
        { date: "2023.06", type: "Poster", no: "P-49", title: "ex vivo 精子染色质再构成方法的建立", venue: "第 16 回日本表观遗传学研究会年会，一桥讲堂" },
        { date: "2023.06", type: "Poster", no: null, title: "二价阳离子对精子染色质结构的影响及体外再构成", venue: "第 22 回东京大学生命科学研讨会 BIO UT，驹场校区" },
        { date: "2022.11", type: "Poster", no: "P-25", title: "二价阳离子对精子染色质结构的影响解析", venue: "新学术领域·学术变革领域联合「若手の会 2022」，大阪临空" },
      ],
      papersTitle: "同行评审论文",
      papers: [
        {
          date: "2026", status: "已发表",
          title: "通过优化的脂质体生物层干涉法定量分析蛋白质对磷脂酰肌醇的结合动力学",
          authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
          venue: <><Lnk to={LINKS.acsBiochem}>Biochemistry</Lnk> (ACS) 65 (16)，2557–2565，专刊 “Lipids and Lipidation” · <Lnk to={LINKS.paper}>doi.org/10.1021/acs.biochem.6c00344</Lnk></>,
          note: "2026 年 4 月 20 日投稿 · 7 月 23 日接收。第一作者。",
        },
      ],
      papersEmpty: "其他第一作者论文正在撰写中。敬请期待。",
      thesesTitle: "学位论文",
      theses: [
        {
          y: "2024",
          h: "用二价阳离子建立精子染色质的体外改变方法",
          orig: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立",
          p: <>硕士学位论文 · 东京大学综合文化研究科广域科学专攻 · <Lnk to={LINKS.okada}>冈田研究室</Lnk>，<Lnk to={LINKS.iqb}>定量生命科学研究所</Lnk></>,
          body: <><p>精子把父源基因组装进一个极度凝缩的细胞核里。在精子形成的后期，约九成的组蛋白被鱼精蛋白（protamine）替换，使小鼠精子染色质比体细胞核凝缩约 40 倍，足以屏蔽物理和酶学的 DNA 损伤。但正是这种致密，让所有针对体细胞染色质开发的方法在精子上都失效。此前已知二价阳离子能在体外让多胺-DNA 复合体发生凝缩与解凝缩，但它们对由鱼精蛋白包装的精子染色质是否有效，无人验证过。</p><p>我系统检验了 Mg²⁺、Ca²⁺、Zn²⁺、Mn²⁺ 对小鼠精子的作用，并与去除鱼精蛋白的核质蛋白（nucleoplasmin）处理组合使用，再用螯合剂 EDTA 与 TPEN 确认究竟是哪种离子在起作用，最后用彗星试验评估 DNA 完整性、用 <Term k="ICSI" lang="zh">ICSI</Term> 评估受精与发育能力。结果是：Mg²⁺ 促进解凝缩，Zn²⁺ 抑制解凝缩，均呈浓度依赖；TPEN 螯合实验确认该效应是 Zn 特异性的。在 500 mM ZnCl₂、pH 1 的条件下，已解凝缩的精子染色质重新凝缩到原本大小甚至更小，这是<Hl>首个使精子染色质再凝缩的方法</Hl>。再凝缩精子的 DNA 断裂比未处理对照增加，但远低于 H₂O₂ 阳性对照；ICSI 之后，胚胎到达 4 细胞期的比例为 24%（对照 67%），未能形成囊胚。也就是说，这个“把手”确实能用，但<Hl>目前还做不到对发育无害</Hl>。</p><p>这依然重要：在体外可逆地打开与关闭精子染色质，正是编辑精子表观基因组、并追问它究竟对发育贡献了什么的前提；而这次实验也精确标出了现有方案在哪一步损伤了胚胎，下一次迭代就从这里开始。</p></>,
        },
        {
          y: "2022",
          h: "来自 Paracoccus sp. 43P 的 IclR 家族转录因子 LgnR 的结构解析",
          orig: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析",
          p: <>学士学位论文 · <Lnk to={LINKS.nodai}>东京农业大学</Lnk>生命科学部 · 机能性分子解析学研究室（矢嶋俊介 教授）</>,
          body: <><p>L-葡萄糖是所有生命赖以运转的 D-葡萄糖的镜像。它在自然界中并不存在，己糖激酶也无法将其磷酸化，因此对几乎所有生物来说它都不是食物。但从土壤中分离出的 Paracoccus sp. 43P 却能代谢它，靠的是一条专门的代谢途径，由 IclR 家族的转录因子 LgnR 调控。一个生物如何为自己从未遇见过的糖演化出调控机制，至今没有答案；LgnR 在原子层面如何感知这条途径的状态并对其开关，也还没有被描述过。</p><p>我在大肠杆菌中克隆并表达 LgnR，经 Ni 亲和层析纯化，用 SDS-PAGE 确认产物，再透析、浓缩，并进行结晶条件筛选，目标是解出其三维结构。最终<Hl>成功表达并纯化出可用于结晶学研究的重组 LgnR</Hl>，并完成了结晶条件的筛选与评估。</p><p>LgnR 的结构将展示一个调控因子如何适应演化从未给过它的底物，这既关系到新代谢能力的起源，也关系到为环境修复而改造细菌。这个课题也是<Hl>我第一次跑 AlphaFold2 和 RoseTTAFold</Hl> 的地方，我工作中的计算这一半就是从这里开始的。</p></>,
        },
      ],
      fundingTitle: "经费与奖学金",
      fundingNote: "这里列出我写过的每一份申请，成功的和失败的都在。研究是靠中的那些和没中的那些一起推着往前走的。",
      grantCols: ["年度", "项目", "课题", "结果"],
      grants: {
        springgx: { year: "2024 至今", program: "JST SPRING-GX", title: <>次世代研究者挑战性研究项目 · <Lnk to={LINKS.springGX}>绿色转型高级人才培养计划</Lnk>，东京大学。</>, status: "获资助" },
        dc2_2027: { year: "令和9年度（2027年度）", program: "日本学术振兴会 DC2", title: "大規模解析と機械学習による精密な脂質種認識機構の解明（用大规模解析与机器学习阐明精密的脂质种识别机制）。", status: "审查中" },
        spread_2026: { year: "2026", program: "JST SPReAD 第 1 回", title: <><Lnk to={LINKS.spread}>AI for Science 萌芽的挑戦研究創出事業（SPReAD: Supporting Pioneering Research through AI for 1,000 Discovery challenges）</Lnk>，隶属文部科学省「AI for Science による科学研究革新プログラム」。课题：用序列-结构统合 AI 预测脂质结合结构域的结合特异性并抽取识别规则。</>, status: "通过审查 · 抽签未中" },
        dc2_2026: { year: "令和8年度（2026年度）", program: "日本学术振兴会 DC2", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析（用大规模测定与机器学习解析蛋白质寿命决定因子）。", status: "未获资助" },
        dc1_2025: { year: "令和7年度（2025年度）", program: "日本学术振兴会 DC1", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析（用大规模测定与机器学习解析蛋白质寿命决定因子）。", status: "未获资助" },
        dc1_2024: { year: "令和6年度（2024年度）", program: "日本学术振兴会 DC1", title: "精子エピゲノムの意義を精子体外再構成法で解明する研究（以精子体外再构成法阐明精子表观基因组的意义）。", status: "未获资助" },
      },
      awardsTitle: "奖励 & 活动",
      awards: [
        { y: "2024.03", h: <><Hl>优秀毕业生奖</Hl> · 广域科学专攻奖励奖</>, p: "东京大学综合文化研究科，令和 5 年度（2023 年度）。" },
        { y: "2023.08", h: <><Lnk to={LINKS.nanolsiSchool}>Bio-SPM 夏季学校</Lnk>（<Lnk to={LINKS.nanolsi}>金泽大学 NanoLSI</Lnk>），共同研究采择</>, p: "金泽大学第 11 回 Bio-SPM 夏季学校。高速原子力显微镜对体外重组复合物的动态观察。" },
      ],
    },
    hobbies: {
      eyebrow: "生活",
      title: "对一切与移液器无关的事情都好奇。",
      items: [
        ["山", "登山露营", "上高地、尾濑、立山黑部，走得越慢越好。"],
        ["影", "摄影", "胶片相机，飞驰的列车，偶尔陌生人的笑容。"],
        ["猫", "猫", "最小、最安静的合作者。"],
        ["旅", "旅行", "长途列车、小巷子，一本之后再查的笔记。"],
      ],
    },
    news: {
      eyebrow: "近况",
      title: "最近发生了什么。",
      items: [
        { when: "2026 · 10", h: "RosettaCon Asia 2026 海报报告", p: <>将在 <Lnk to={LINKS.rosettaAsia}>RosettaCon Asia</Lnk> 上做海报报告，内容是<Hl>磷脂结合蛋白的从头设计</Hl>。10 月 10 至 11 日，北京大学。</> },
        { when: "2026 · 08", h: "第一作者论文发表", p: <>论文已在 <Lnk to={LINKS.paper}>Biochemistry (ACS)</Lnk> 上线，收入专刊 “Lipids and Lipidation”：通过优化的脂质体生物层干涉法定量分析蛋白质对磷脂酰肌醇的结合动力学。</> },
        { when: "2026 · 05", h: "提交学振 DC2 申请", p: "以脂质种识别机制为题申请令和 9 年度（2027 年度） DC2，目前审查中。" },
        { when: "2026 · 04", h: "BLI 论文投稿", p: <>4 月 20 日投稿至 <Lnk to={LINKS.acsBiochem}>Biochemistry (ACS)</Lnk>，三个月后被接收。</> },
        { when: "2025 · 01", h: "IPR 国际会议 2025", p: "在淡路岛发表蛋白质对磷脂结合的研究。" },
        { when: "2024 · 10", h: "博士入学", p: "正式进入东京大学工学系研究科化学生命工学专攻博士课程。" },
        { when: "2024 · 04", h: "加入坪山研究室", p: <>在<Lnk to={LINKS.iis}>生产技术研究所</Lnk>生体分子设计工学研究室开始研究。</> },
      ],
    },
    blog: {
      eyebrow: "博客",
      title: "实验台与终端两边的笔记。",
      note: "写得长一点的东西：一次失败的筛选到底教会了什么、BLI 曲线怎么读，以及我跑过的那些设计模型的使用笔记。",
      collectLink: "比博客短的东西放在收藏夹里：值得留着的工具和论文，各配一句备忘",
      posts: [
        {
          date: "2026 · 08 · 22",
          href: "posts/biotite.html",
          title: "Biotite：把琐碎的部分交给一个库",
          excerpt: "一篇关于 Biotite 的备忘：序列、三维结构、数据库查询、外部软件封装，都收在同一个 Python 包、同一套 API 里，让一个小分析脚本不必以两百行解析代码开头。",
        },
        {
          date: "2026 · 08 · 17",
          href: "posts/py2dmol.html",
          title: "不打开 PyMOL 也能出蛋白质配图",
          excerpt: "py2Dmol 在一个浏览器标签页里把 PDB ID 变成能直接用的图：背景透明，配体也画得出来，还有好几种风格。一篇很短的工具笔记，以及它为什么一直躺在我的书签里。",
        },
        {
          date: "2026 · 08 · 17",
          href: "posts/bli-liposome.html",
          title: "实时读出蛋白质与脂质的结合",
          excerpt: "几乎所有蛋白质–脂质实验回答的都是「结合有多紧」，很少有人回答「结合得多快、停留多久」。一篇方法笔记：如何把脂质体 BLI 做成定量的动力学实验，非特异信号究竟从哪里来，以及在相信这些数字之前我会先检查什么。",
        },
      ],
      empty: "第一批文章正在写。很快回来看看。",
    },
    contact: {
      eyebrow: "联系",
      headline: <>来 <em>聊聊科学。</em></>,
      sub: "科研合作、AI for Science、脂质生物物理，或只是在驹场喝杯咖啡。我的邮箱永远开着。",
      seekingLabel: "在找",
      seeking: <>2027 年末或 2028 年开始的博士后职位。我同时具备<Hl>干湿两端的经验</Hl>：从蛋白质设计、文库构建、高通量实验，到 NGS 数据处理与分析，再到后续的结合动力学测定，整条链路我都能自己跑通。接下来我想做的是<Hl>把人工设计的蛋白放进真实的细胞环境里工作</Hl>，因此对细胞编程、基因线路与蛋白质工程这些方向很感兴趣。</>,
      cvLabel: "下载简历 (PDF)",
      lastUpdate: "最后更新",
      copy: "点击复制",
      copied: "已复制",
      labels: {
        mailMain: "邮箱 · 常用",
        mailAlt: "邮箱 · 个人",
        mailUt: "邮箱 · 生产技术研究所",
        mailEcc: "邮箱 · 东大 ECC",
        wechat: "微信",
        xhs: "小红书",
        office: "办公室",
      },
    },
  },

  ja: {
    nav: { about: "自己紹介", research: "研究", pubs: "業績", edu: "経歴", hobbies: "オフ", news: "近況", blog: "ブログ", collect: "コレクション", contact: "連絡" },
    hero: {
      meta: ["東京大学生産技術研究所", "坪山研究室", "博士課程"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "AI タンパク質設計と生物物理学の交差点で研究しています。タンパク質が細胞内のさまざまな膜のアイデンティティを定めるリン脂質シグネチャをどう認識するかを探り、AI 設計と大規模スクリーニングによって、進化が一度も生み出さなかった高特異的なリン脂質プローブをつくっています。",
      cta1: "研究を読む", cta2: "連絡する",
    },
    about: {
      eyebrow: "自己紹介",
      title: "東京で十年、都市と言語と分野の間を歩く研究者。",
      p1: "姚品碩と申します。十年前、十七歳の春にハルビンを離れ、東京で日本語をゼロから学び始めました。東京農業大学で生物学と出会ってからは、分子を追いかけるのをやめていません。",
      p2: <>現在は<Lnk to={LINKS.iis}>東京大学生産技術研究所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>の博士課程に在籍しています。道具は酵母ディスプレイ、機械学習、BLI センサー。問いは：タンパク質はどうやって愛する脂質を見分けるのか、コンピュータにそれをゼロから設計させられるのか。</>,
      p3: <>母語は<Hl>中国語</Hl>で、<Hl>英語</Hl>と<Hl>日本語</Hl>でも研究の議論ができます。この三言語のいずれでもお気軽にご連絡ください。ラボの外では、山道か、フィルムカメラの後ろか、次の静かな旅の計画の中にいます。</>,
    },
    glossary: {
      ICSI: "卵細胞質内精子注入法。顕微操作により精子を 1 個だけ卵子内へ直接注入する、自然受精を介さない受精技術。",
      BLI: "バイオレイヤー干渉法。センサー先端の光干渉のシフトから結合をリアルタイムで読み取る、標識不要の光学バイオセンサー。",
      PIPs: "ホスホイノシチド。ホスファチジルイノシトールの 8 種のリン酸化誘導体。リン酸基の組み合わせが各膜コンパートメントを標識する。",
    },
    research: {
      eyebrow: "研究",
      title: "タンパク質はどうやって膜のアイデンティティを定めるリン脂質を認識するのか？",
      lede: "真核細胞のそれぞれの膜は、固有のリン脂質シグネチャを持つ。タンパク質ドメインはそのシグネチャを読み、シグナルを局所化し、貨物を輸送し、コンパートメントを形作る。私はその認識が、定量的に、かつ大規模にどう機能するかを理解したい。",
      projStatus: { failed: "プロジェクト失敗", done: "完了", active: "進行中" },
      outcomeLabel: "結果と学び",
      proj: [
        {
          n: "01",
          status: "failed",
          title: "タンパク質によるホスホイノシチド認識の大規模マップ",
          tags: ["大規模解析", "酵母ディスプレイ", "深層学習"],
          summary: <>ホスホイノシチド（<Term k="PIPs" lang="ja">PIPs</Term>）は、内膜系のそれぞれのコンパートメントを標識する 8 種類のリン酸化脂質である：PI(4,5)P₂ は細胞膜、PI(3)P は初期エンドソーム、PI(3,5)P₂ は後期エンドソームなど。脂質結合ドメイン（PH、PX、ENTH、GRAM、GLUE、C2 …）はこの極めて小さなリン酸基の差異を読み取り、シグナル伝達、膜輸送、細胞骨格動態を制御する；たった一つの認識ミスが<Lnk to={LINKS.akt1}>疾患の引き金となる</Lnk>。<Lnk to={LINKS.akt1}>AKT1 PH の E17K 変異</Lnk>がその一例である。それにもかかわらず、<Lnk to={LINKS.pipCase1}>数十年</Lnk>にわたる<Lnk to={LINKS.pipCase2}>個別事例の蓄積</Lnk>を経てなお、特定のドメインがどのようにして 8 種類の PIPs を区別するのかという一般則は見えていない。<Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk>で、私は数千のドメインと脂質種にまたがる比較可能な<Lnk to={LINKS.clib}>大規模結合データセット</Lnk>を構築し、そこから認識規則を学習させようとした。</>,
          outcome: "酵母ディスプレイに基づく大規模スクリーニング法により、2 万を超える天然の脂質結合ドメインと 13 種の脂質との結合マップ、計 26 万件以上のデータを取得し、深層学習によって結合特異性と強度を導出・理解・予測し、最終的には設計することを目指した。しかしデータ品質の制約により、この方針は失敗に終わった。そこから得られたのは、酵母ディスプレイ法が適用できる範囲の把握と、データ品質がどれほど決定的かという教訓である。",
        },
        {
          n: "02",
          status: "done",
          title: "タンパク質とリン脂質結合動態のための最適化 BLI",
          tags: ["BLI", "速度論", "リポソーム"],
          summary: <>ほとんどのタンパク質-脂質アッセイは平衡結合強度しか報告しない：より強い親和性が、より速い {KON} から来るのか、より遅い {KOFF} から来るのかを区別できない。しかしこの二つは生物学的にまったく異なる帰結をもつ。バイオレイヤー干渉法（<Term k="BLI" lang="ja">BLI</Term>）はリアルタイムの動態を解像できるが、脂質表面では非特異的吸着が大きな障害となる。系統的な緩衝液最適化（0.5% BSA、0.001% Tween-20）によって背景結合を抑え、リポソームの完全性を保ったまま、代表的な PX・PH ドメインとその変異体系列について {KON}・{KOFF}・{KD} を取得した。本プラットフォームは動態メカニズムを区別する：AKT1 PH 系列では親和性向上が主に {KOFF} の遅さから、SnxA PX 系列では {KON} の速さから来ている。平衡結合測定だけでは分からない情報である。</>,
          paperLabel: "Biochemistry (ACS), 2026 に掲載",
          figure: { src: "assets/toc.png", alt: "最適化したリポソームベース BLI の模式図と、kon 駆動・koff 駆動のセンサーグラム。", caption: "最適化したアッセイと、結合が強くなる二つの速度論的な経路。論文の目次図より。" },
        },
        {
          n: "03",
          status: "active",
          title: "リン脂質結合タンパク質の de novo 設計",
          tags: ["de novo 設計", "拡散モデル", "膜"],
          summary: "特定の PIP だけに結合するタンパク質を設計することは、低分子結合タンパク質設計の中でも最難関の部類に入る。困難が三つ同時に存在するからである。PIPs 8 種は互いに極めて類似しており、違いはイノシトール環のどの水酸基がリン酸化されているかだけ。その頭部は強い負電荷を持つため、正電荷のポケットは酸性のものを見境なく捕まえてしまう。特異性は静電相互作用ではなく、高度に精密な水素結合ネットワークから来なければならない。さらに標的は膜表面に存在するため、膜挿入と、二重層に対する結合ポケットの方向性という問題も同時に解く必要がある。現在も取り組み中。続報をお待ちください。",
        },
      ],
      modelsTitle: "現在の課題で使っているモデル・ツール",
      modelsNote: "実際に走らせているモデル。名前にカーソルを合わせる（またはタップする）と役割が出て、名前自体が原論文またはコードへのリンクになっている。",
      modelGroups: { design: "生成的設計", struct: "構造予測", language: "タンパク質言語モデル", surface: "表面・界面" },
      modelTapHint: "もう一度タップで開く",
      models: {
        rfd3: "タンパク質骨格を生成する拡散モデル。最大の特徴は全原子生成に対応している点で、側鎖やリガンドを後付けせず生成過程に組み込む。",
        boltzgen: "現時点でおそらく最も汎用的なバインダー設計モデル。設計モードの網羅性が最も高く、成功率も比較的高い。",
        nise: "低分子結合タンパク質の設計に特化して最適化された生成的設計モデル。",
        disco: "低分子結合タンパク質と核酸結合タンパク質を得意とする生成的設計モデル。著者らは SOTA と主張している。",
        proteinmpnn: "逆折りたたみ：与えられた骨格に対して、それに最も折りたたまれやすいアミノ酸配列を書き出す。",
        ligandmpnn: "ProteinMPNN の拡張。リガンド・核酸・金属イオンが存在する条件下で配列を設計できる。",
        af3: "タンパク質と核酸・リガンド・イオンの複合体構造を、単一のモデルで同時に予測する。",
        af2: "単鎖の構造予測を初めて日常的な道具にしたモデル。今もあらゆる手法の比較基準。",
        rosettafold: "AlphaFold2 と同時期に登場した三トラックネットワーク。配列から構造を予測する。",
        esmfold2: "高速で、MSA への依存が小さく、それゆえ de novo 設計タンパク質の予測に強い。",
        boltz2: "複合体構造と結合親和性を同時に予測するオープンな co-folding モデル。",
        chai1: "タンパク質・リガンド・核酸を横断するオープンなマルチモーダル構造予測モデル。",
        esm2: "配列のみで学習したタンパク質言語モデル。その表現には構造・機能のシグナルが残っている。",
        esm3: "配列・構造・機能の三モダリティを同時に扱う生成的言語モデル。",
        esmc: "ESM Cambrian。ESM-2 の後継で、パラメータあたりの表現品質を重視したコンパクトなモデル。",
        saprot: "3Di 構造アルファベットをアミノ酸配列と併せてトークン化する、構造認識型の言語モデル。",
        masif: "分子表面上の幾何学的深層学習。結合部位を示す相互作用フィンガープリントを学習する。",
      },
      organismsTitle: "モデル生物",
      organisms: [
        ["E. coli", "クローニングと組換えタンパク質発現の主力となる細菌。"],
        ["S. cerevisiae", "出芽酵母。表面ディスプレイライブラリの宿主であり、最も単純な真核生物の膜システムでもある。"],
        ["マウス", "修士課程での精子クロマチンと初期発生の研究に用いた哺乳類モデル。"],
      ],
      techsTitle: "技術",
      techsNote: "技術名にカーソルを合わせる（またはタップする）と一行の説明が出ます。",
      techs: [
        ["酵母ディスプレイ", "目的タンパク質を酵母細胞壁上に提示し、結合を細胞ごとに読み出してライブラリ規模で分取する。"],
        ["BLI 速度論", "バイオレイヤー干渉法。標識不要の光学センサーで結合と解離をリアルタイムに読む。"],
        ["NGS", "次世代シーケンシング。超並列シーケンシングで数百万のライブラリバリアントを一度に読む。"],
        ["FACS", "蛍光活性化セルソーティング。蛍光シグナルで個々の細胞を分取する。"],
        ["タンパク質精製", "アフィニティ・イオン交換・ゲルろ過クロマトグラフィーで、ライセートから目的の組換えタンパク質だけを取り出す。"],
        ["リポソーム調製", "組成を規定した人工脂質小胞をつくる。脂質結合ドメインを試すための「人工膜」。"],
        ["蛍光顕微鏡", "蛍光標識した分子が細胞内や膜上のどこにいるかを可視化する。"],
        ["ICSI", "卵細胞質内精子注入法。顕微操作で精子を 1 個だけ卵子内に直接注入する。"],
        ["ウェスタンブロット", "ゲルでタンパク質をサイズ分離し、特異抗体で目的の一本を検出する。"],
        ["コメットアッセイ", "単一細胞ゲル電気泳動。損傷 DNA が彗星の尾のように核外へ流れ出し、DNA 切断を定量できる。"],
        ["AI 設計ツール", "構造予測・逆折りたたみ・生成的骨格モデルを組み合わせ、新しい配列を提案する。"],
        ["HTS", "ハイスループットスクリーニング：ライブラリ構築、プール選択、シーケンシングと、それらをつなぐ解析パイプライン。"],
      ],
      projLabel: "PROJ",
    },
    edu: {
      eyebrow: "経歴",
      title: "ハルビンから東京へ、都市と分野が綴る道。",
      items: [
        { date: "2024.10–現在", current: true, h: "博士課程 · 化学生命工学", inst: <>東京大学 <Lnk to={LINKS.iis}>生産技術研究所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "坪山幸太郎講師のもと、AI 支援タンパク質設計。JST SPRING-GX 支援。2027 年 9 月修了予定。" },
        { date: "2024.04–2024.09", h: "研究生", inst: <>東京大学 <Lnk to={LINKS.iis}>生産技術研究所</Lnk> · <Lnk to={LINKS.tsuboyama}>坪山研究室</Lnk></>, detail: "ラボに参加、脂質結合スクリーニングを開始。" },
        { date: "2022–2024", h: "修士 · 生命科学", inst: <>東京大学 <Lnk to={LINKS.iqb}>定量生命科学研究所</Lnk> · <Lnk to={LINKS.okada}>岡田研究室（病態発生制御研究分野）</Lnk></>, detail: <>指導教員：岡田由紀 教授。精子クロマチンの可逆的な脱凝縮と再凝縮の手法を確立し、処理後の精子を <Term k="ICSI" lang="ja">ICSI</Term> で評価。同時期に定量生命科学研究所の技術補佐員（2022–2024）。<Hl>優秀修了生表彰</Hl>。</> },
        { date: "2018–2022", h: "学士 · 生物科学", inst: <><Lnk to={LINKS.nodai}>東京農業大学</Lnk> · 機能性分子解析学研究室（矢嶋研究室）</>, detail: "指導教員：矢嶋俊介 教授。IclR ファミリー転写因子の構造生物学；ラボ内で AlphaFold2 / RoseTTAFold をいち早く導入。" },
        { date: "2016–2018", h: "日本語課程", inst: "富士国際語学院、東京", detail: "17 歳で来日。三つ目の言語をゼロから。" },
        { date: "2010–2017", h: "基礎教育", inst: "ハルビン第三中学校（群力）、光華中学校", detail: "中国東北。好奇心の出発点。" },
      ],
    },
    pubs: {
      eyebrow: "業績",
      title: "論文、発表、そして次の一本。",
      presTitle: "学会発表",
      upcomingLabel: "発表予定",
      intlLabel: "国際",
      typeLabels: { Poster: "ポスター" },
      pres: [
        { date: "2026.10", intl: true, upcoming: true, type: "Poster", no: null, title: "リン脂質結合タンパク質の de novo 設計", venue: "RosettaCon Asia 2026、北京大学、北京" },
        { date: "2025.01", intl: true, type: "Poster", no: null, title: "タンパク質とリン脂質結合の普遍原理の解読", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR 国際会議 2025、淡路島" },
        { date: "2023.12", type: "Poster", no: "P-25", title: "精子クロマチン体外再構成：革新的手法", venue: "2023 年度定量生命科学研究所 研究交流会、東京大学" },
        { date: "2023.06", type: "Poster", no: "P-49", title: "ex vivo 精子クロマチン再構成法の確立", venue: "第 16 回日本エピジェネティクス研究会年会、一橋講堂" },
        { date: "2023.06", type: "Poster", no: null, title: "二価陽イオンが精子クロマチン構造に与える影響と体外再構成", venue: "第 22 回東京大学生命科学シンポジウム BIO UT、駒場キャンパス" },
        { date: "2022.11", type: "Poster", no: "P-25", title: "二価陽イオンの精子クロマチン構造への影響解析", venue: "新学術・学術変革領域合同「若手の会 2022」、大阪りんくう" },
      ],
      papersTitle: "査読付き論文",
      papers: [
        {
          date: "2026", status: "掲載",
          title: "最適化したリポソームベース・バイオレイヤー干渉法によるタンパク質とホスホイノシチドの結合動態の定量解析",
          authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
          venue: <><Lnk to={LINKS.acsBiochem}>Biochemistry</Lnk> (ACS) 65 (16)、2557–2565、特集号 “Lipids and Lipidation” · <Lnk to={LINKS.paper}>doi.org/10.1021/acs.biochem.6c00344</Lnk></>,
          note: "2026 年 4 月 20 日投稿 · 7 月 23 日受理。筆頭著者。",
        },
      ],
      papersEmpty: "他の筆頭著者論文を準備中。お楽しみに。",
      thesesTitle: "学位論文",
      theses: [
        {
          y: "2024",
          h: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立",
          orig: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations",
          p: <>修士学位論文 · 東京大学大学院総合文化研究科 広域科学専攻 · <Lnk to={LINKS.okada}>岡田研究室</Lnk>、<Lnk to={LINKS.iqb}>定量生命科学研究所</Lnk></>,
          body: <><p>精子は父方ゲノムを極度に凝縮した核に収めている。精子形成の後期にヒストンの約 9 割がプロタミンに置換され、マウス精子クロマチンは体細胞核と比べて約 40 倍に凝縮する。物理的刺激や酵素活性による DNA 損傷から守るための密度である。しかしその密度ゆえに、体細胞クロマチン向けに開発された手法は精子では機能しない。二価陽イオンが試験管内でポリアミン-DNA 複合体の凝縮・脱凝縮を引き起こすことは報告されていたが、プロタミンで梱包された精子クロマチンに効くかどうかは未知であった。</p><p>そこで Mg²⁺・Ca²⁺・Zn²⁺・Mn²⁺ のマウス精子への作用を系統的に検討し、プロタミンを除去するヌクレオプラスミン処理と併用した。次にキレート剤 EDTA・TPEN でどのイオンが効いているかを特定し、コメットアッセイで DNA 完全性を、<Term k="ICSI" lang="ja">ICSI</Term> で受精・発生能を評価した。その結果、Mg²⁺ は脱凝縮を促進し、Zn²⁺ は阻害した。いずれも濃度依存的で、TPEN によるキレートから Zn 特異的な効果であることが確認された。500 mM ZnCl₂、pH 1 の条件では、脱凝縮した精子クロマチンが元のサイズあるいはそれ以下にまで再凝縮した。<Hl>精子クロマチンを再凝縮させた初めての報告</Hl>である。再凝縮精子の DNA 断片化は無処理対照より増加したものの、H₂O₂ 処理陽性対照よりははるかに軽度であった。一方 ICSI 後の 4 細胞期到達率は 24%（対照 67%）、胚盤胞到達率は 0% であり、本処理は<Hl>発生に対してまだ中立とはいえない</Hl>。</p><p>それでも意義は大きい。精子クロマチンを体外で可逆的に開閉できることは、精子エピゲノムを編集し、それが発生に何を寄与しているのかを問うための前提条件だからである。加えて本研究は、現行プロトコルが胚をどの段階で損なうのかを明確に示しており、次の改良はそこから始まる。</p></>,
        },
        {
          y: "2022",
          h: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析",
          orig: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P",
          p: <>学士学位論文 · <Lnk to={LINKS.nodai}>東京農業大学</Lnk>生命科学部 · 機能性分子解析学研究室（矢嶋俊介 教授）</>,
          body: <><p>L-グルコースは、あらゆる生命が用いる D-グルコースの鏡像である。自然界には存在せず、ヘキソキナーゼによってリン酸化もされないため、ほとんどの生物にとって栄養にならない。ところが土壌から分離された Paracoccus sp. 43P はこれを資化でき、その専用経路は IclR ファミリー転写因子 LgnR によって制御されている。出会ったことのない糖に対して生物がどのように制御機構を獲得するのかは明らかでなく、LgnR が原子レベルで経路の状態をどう感知し、どう開閉するのかも記述されていなかった。</p><p>そこで LgnR を大腸菌で発現させ、Ni アフィニティークロマトグラフィーで精製し、SDS-PAGE で発現を確認、透析・濃縮を経て結晶化条件のスクリーニングを行った。結果として<Hl>結晶学的解析に供しうる状態まで組換え LgnR を発現・精製</Hl>し、結晶化条件のスクリーニングと評価を実施した。</p><p>LgnR の構造は、制御因子が進化の与えなかった基質にどう適応するのかを示す。新たな代謝能力の起源にも、環境浄化に向けた細菌の改変にも関わる問いである。またこの課題は<Hl>私が初めて AlphaFold2 と RoseTTAFold を走らせた場所</Hl>であり、私の研究の計算側はここから始まった。</p></>,
        },
      ],
      fundingTitle: "研究費・フェローシップ",
      fundingNote: "これまでに書いた申請をすべて並べています。採択されたものも、されなかったものも。研究はその両方に押されて進んでいます。",
      grantCols: ["年度", "制度", "課題", "結果"],
      grants: {
        springgx: { year: "2024–現在", program: "JST SPRING-GX", title: <>次世代研究者挑戦的研究プログラム · <Lnk to={LINKS.springGX}>GX 高度人材育成</Lnk>、東京大学。</>, status: "採択" },
        dc2_2027: { year: "令和9年度（2027年度）", program: "学振 DC2", title: "大規模解析と機械学習による精密な脂質種認識機構の解明", status: "審査中" },
        spread_2026: { year: "2026", program: "JST SPReAD 第 1 回", title: <>文部科学省「AI for Science による科学研究革新プログラム」<Lnk to={LINKS.spread}>AI for Science 萌芽的挑戦研究創出事業（SPReAD: Supporting Pioneering Research through AI for 1,000 Discovery challenges）</Lnk>。課題：配列と構造統合 AI による脂質結合ドメインの脂質結合特異性の予測と認識規則抽出。</>, status: "要件審査通過 · 抽選漏れ" },
        dc2_2026: { year: "令和8年度（2026年度）", program: "学振 DC2", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析", status: "不採用" },
        dc1_2025: { year: "令和7年度（2025年度）", program: "学振 DC1", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析", status: "不採用" },
        dc1_2024: { year: "令和6年度（2024年度）", program: "学振 DC1", title: "精子エピゲノムの意義を精子体外再構成法で解明する研究", status: "不採用" },
      },
      awardsTitle: "受賞・活動",
      awards: [
        { y: "2024.03", h: <><Hl>優秀修了生表彰</Hl> · 広域科学専攻奨励賞</>, p: "東京大学総合文化研究科、令和 5 年度（2023 年度）。" },
        { y: "2023.08", h: <><Lnk to={LINKS.nanolsiSchool}>Bio-SPM 夏の学校</Lnk>（<Lnk to={LINKS.nanolsi}>金沢大学 NanoLSI</Lnk>）、共同研究採択</>, p: "金沢大学第 11 回 Bio-SPM 夏の学校。高速原子間力顕微鏡による試験管内再構成複合体の動態観察。" },
      ],
    },
    hobbies: {
      eyebrow: "オフ",
      title: "ピペット以外のすべてに興味がある。",
      items: [
        ["山", "登山・キャンプ", "上高地、尾瀬、立山黒部、遅い道ほどよい。"],
        ["影", "写真", "フィルムカメラ、速い列車、ときどき誰かの微笑み。"],
        ["猫", "猫", "もっとも小さく、もっとも静かな共同研究者。"],
        ["旅", "旅", "長い列車、路地裏、後で調べる用のノート。"],
      ],
    },
    news: {
      eyebrow: "近況",
      title: "最近の出来事。",
      items: [
        { when: "2026 · 10", h: "RosettaCon Asia 2026 でポスター発表", p: <><Lnk to={LINKS.rosettaAsia}>RosettaCon Asia</Lnk> にて<Hl>リン脂質結合タンパク質の de novo 設計</Hl>を発表予定。10 月 10 日・11 日、北京大学。</> },
        { when: "2026 · 08", h: "筆頭著者論文が公開", p: <><Lnk to={LINKS.paper}>Biochemistry (ACS)</Lnk> の特集号 “Lipids and Lipidation” に掲載：最適化リポソームベース BLI によるタンパク質とホスホイノシチドの結合動態の定量解析。</> },
        { when: "2026 · 05", h: "学振 DC2 に申請", p: "脂質種認識機構をテーマに令和 9 年度（2027 年度） DC2 へ申請。現在審査中。" },
        { when: "2026 · 04", h: "BLI 論文を投稿", p: <>4 月 20 日に <Lnk to={LINKS.acsBiochem}>Biochemistry (ACS)</Lnk> へ投稿、3 か月後に受理。</> },
        { when: "2025 · 01", h: "IPR 国際会議 2025", p: "淡路島でタンパク質とリン脂質結合の研究を発表。" },
        { when: "2024 · 10", h: "博士課程入学", p: "東京大学工学系研究科化学生命工学専攻に正式入学。" },
        { when: "2024 · 04", h: "坪山研究室に参加", p: <><Lnk to={LINKS.iis}>生産技術研究所</Lnk>の生体分子設計工学研究室で研究開始。</> },
      ],
    },
    blog: {
      eyebrow: "ブログ",
      title: "実験台とターミナル、両方からのノート。",
      note: "少し長めに書くもの：失敗したスクリーニングが何を教えてくれたのか、BLI センサーグラムの読み方、そして走らせている設計モデルの使用メモ。",
      collectLink: "記事より短いものはコレクションに：手元に置きたいツールや論文と、一行のメモ",
      posts: [
        {
          date: "2026 · 08 · 22",
          href: "posts/biotite.html",
          title: "Biotite：面倒な部分をまとめて引き受ける",
          excerpt: "Biotite についての自分用の覚書。配列、立体構造、データベース問い合わせ、外部ソフトのラッパーが一つの Python パッケージと一貫した API に収まっており、小さな解析スクリプトが二百行の解析処理から始まらずに済む。",
        },
        {
          date: "2026 · 08 · 17",
          href: "posts/py2dmol.html",
          title: "PyMOL を開かずにタンパク質の図をつくる",
          excerpt: "py2Dmol はブラウザのタブの中で PDB ID をそのまま使える図に変える。背景は透明、リガンドも描かれ、スタイルも複数。短いツール覚書と、ブックマークに残している理由。",
        },
        {
          date: "2026 · 08 · 17",
          href: "posts/bli-liposome.html",
          title: "タンパク質と脂質の結合をリアルタイムで読む",
          excerpt: "ほとんどのタンパク質–脂質アッセイが答えるのは「どれくらい強く」だけ。「どれくらい速く、どれくらい留まるか」に答えるものは少ない。リポソームベース BLI を定量的な速度論アッセイに変える手法ノート。非特異シグナルの出どころと、数値を信じる前に確かめることについて。",
        },
      ],
      empty: "最初の記事を執筆中です。もう少しお待ちください。",
    },
    contact: {
      eyebrow: "連絡",
      headline: <>サイエンスの <em>話をしよう。</em></>,
      sub: "共同研究、AI for Science、脂質生物物理、駒場でのコーヒー。メールはいつでもどうぞ。",
      seekingLabel: "募集中",
      seeking: <>2027 年後半または 2028 年開始のポスドク。<Hl>ウェットとドライの両方</Hl>を自分で回せます：タンパク質設計、ライブラリ構築、大規模スクリーニング、NGS のデータ処理・解析、そして結合動態の測定まで、一連の流れを一人で完結できます。次に取り組みたいのは<Hl>設計したタンパク質を生きた細胞の中で働かせること</Hl>で、細胞プログラミング、遺伝子回路、タンパク質工学といった方向に関心があります。</>,
      cvLabel: "履歴書 (PDF)",
      lastUpdate: "最終更新",
      copy: "クリックでコピー",
      copied: "コピーしました",
      labels: {
        mailMain: "メール · 主",
        mailAlt: "メール · 個人",
        mailUt: "メール · 生産技術研究所",
        mailEcc: "メール · 東大（ECC）",
        wechat: "WeChat",
        xhs: "RedNote",
        office: "居室",
      },
    },
  },
};

// --- Typewriter ---
function Typewriter({ phrases }) {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (REDUCED_MOTION) { setOut(phrases[0]); return undefined; }
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
  return <span className="clock" aria-hidden="true">{t}</span>;
}

function App() {
  const tweaks = window.useTweaks(window.TWEAK_DEFAULTS);
  const [t] = tweaks;
  const lang = t.lang || "en";
  const L = I18N[lang];

  useReveal();
  // re-run when the language changes: the chips are re-laid out
  useNudgeAllPops([lang]);

  // apply theme + accent + lang to the document
  useEffect(() => {
    const theme = t.theme || "light";
    // <html> carries the theme too: index.html sets it before first paint, and
    // the [data-theme] variables cascade from whichever element has the
    // attribute, so both must agree or a toggle back to light would leave the
    // dark palette in place.
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-lang", t.lang || "en");
    document.documentElement.lang = t.lang === "zh" ? "zh-CN" : t.lang === "ja" ? "ja" : "en";
    document.documentElement.style.setProperty("--accent", t.accent || "#16a34a");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#fafaf7");
  }, [t.theme, t.accent, t.lang]);

  // A link such as posts/…#blog or /#research arrives before React has built
  // the sections, so the browser's own anchor jump finds nothing. Do it once
  // the DOM exists; sections carry scroll-margin-top for the fixed nav.
  useEffect(() => {
    const id = decodeURIComponent((window.location.hash || "").slice(1));
    if (!id) return undefined;
    const el = document.getElementById(id);
    if (!el) return undefined;
    // Instant, like the browser's own load-time jump: with html
    // { scroll-behavior: smooth } a plain scrollIntoView animates across ten
    // thousand pixels and lands wherever the layout was two seconds earlier.
    // Re-run while the layout above the target still settles (fonts, the lazy
    // project figure) and stop the moment the reader scrolls on their own.
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    let done = false;
    const jump = () => { if (!done) el.scrollIntoView({ block: "start", behavior: "auto" }); };
    const stop = () => { done = true; root.style.scrollBehavior = prevBehavior; };
    jump();
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach(ev => window.addEventListener(ev, stop, { passive: true, once: true }));
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(jump) : null;
    if (ro) ro.observe(document.body);
    const timer = setTimeout(() => { if (ro) ro.disconnect(); stop(); }, 2500);
    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      events.forEach(ev => window.removeEventListener(ev, stop));
      stop();
    };
  }, []);

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
      <Nav L={L} tweaks={tweaks} />
      <main>
        <Hero L={L} />
        <About L={L} />
        <Research L={L} />
        <Education L={L} />
        <Publications L={L} />
        <News L={L} />
        <Blog L={L} />
        <Hobbies L={L} />
        <Contact L={L} />
      </main>
      <Footer L={L} />
    </>
  );
}

function Nav({ L, tweaks }) {
  const [t, setT] = tweaks;
  const langs = ["en", "zh", "ja"];
  const [menuOpen, setMenuOpen] = useState(false);

  // close on Escape, and whenever the viewport grows past the phone breakpoint
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => { if (mq.matches) setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => { window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onWide); };
  }, [menuOpen]);

  return (
    <nav className={`nav ${menuOpen ? "menu-open" : ""}`}>
      <div className="nav-mark"><span className="dot"></span><span>YAO · 姚品碩</span></div>
      <div className="nav-links" id="nav-links">
        {NAV_KEYS.map(k => <a key={k} href={NAV_HREF[k] || "#" + k} onClick={() => setMenuOpen(false)}>{L.nav[k]}</a>)}
      </div>
      <div className="nav-actions">
        <div className="lang-pills">
          {langs.map(l => (
            <button key={l} className={t.lang === l ? "active" : ""} aria-pressed={t.lang === l} onClick={() => setT("lang", l)}>
              {l === "en" ? "EN" : l === "zh" ? "中" : "日"}
            </button>
          ))}
        </div>
        <button className="theme-btn" onClick={() => setT("theme", t.theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
          {t.theme === "dark" ? "\u2600\uFE0E" : "\u263E\uFE0E"}
        </button>
        <button
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          aria-label="Menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}

// Words the hero strapline marks. Latin keys match whole words only, so
// "phospholipid" no longer carries a half-word band around "lipid".
const HERO_KEY_SPLIT = /(\bAI\b|\bproteins?\b|\blipids?\b|\bmembranes?\b|蛋白质|磷脂|タンパク質|リン脂質)/;
const HERO_KEY_TEST = /^(AI|proteins?|lipids?|membranes?|蛋白质|磷脂|タンパク質|リン脂質)$/;

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
        <div className="hero-typer" aria-hidden="true"><Typewriter phrases={L.hero.typer} /></div>
        <p className="hero-desc">{L.hero.desc.split(HERO_KEY_SPLIT).map((s, i) =>
          HERO_KEY_TEST.test(s) ? <span key={i} className="key">{s}</span> : s
        )}</p>
        <div className="hero-cta">
          <a href="#research" className="btn primary"><span>{L.hero.cta1}</span><span className="arrow">→</span></a>
          <a href="#contact" className="btn"><span>{L.hero.cta2}</span><span className="arrow">→</span></a>
        </div>
      </div>
      <div className="hero-right" aria-hidden="true">
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
    </section>
  );
}

function About({ L }) {
  return (
    <section id="about">
      <div className="eyebrow">{L.about.eyebrow}</div>
      <div className="about-head">
        <h2 className="section-title reveal">{L.about.title}</h2>
        <figure className="portrait reveal">
          <img src="assets/portrait.jpg" alt="YAO Pinshuo" width="526" height="526" decoding="async" />
        </figure>
      </div>
      <div className="about-text reveal">
        <p>{L.about.p1}</p>
        <p>{L.about.p2}</p>
        <p>{L.about.p3}</p>
      </div>
    </section>
  );
}

// Small chip that carries a hover/focus definition. Used by the technique and
// organism clouds; `def` may be undefined, in which case it is a plain chip.
function Chip({ label, def, className }) {
  return (
    <span
      className={[className, def ? "has-term" : ""].filter(Boolean).join(" ")}
      tabIndex={def ? 0 : undefined}
      {...(def ? POP_TRIGGERS : {})}
    >
      {label}
      {def && <span className="term-pop">{def}</span>}
    </span>
  );
}

// A model chip is a technique chip that is also a link. With a mouse, hover
// shows the description and a click follows the link. On a touch screen a tap
// is both events at once, so the first tap only opens the description (and
// says "tap again to open") and the second tap navigates. Keyboard users get
// the description on focus and Enter on the link, as for any anchor.
function ModelChip({ m, desc, hint, open, onOpen }) {
  let host = "";
  try { host = new URL(m.href).hostname.replace(/^www\./, ""); } catch (e) { /* no link */ }
  const onClick = (e) => {
    if (!m.href) { e.preventDefault(); onOpen(open ? null : m.key); return; }
    if (COARSE_POINTER && !open) { e.preventDefault(); onOpen(m.key); }
  };
  const className = ["chip", "model", "has-term", open ? "open" : ""].filter(Boolean).join(" ");
  const pop = (
    <span className="term-pop">
      {desc}
      {m.href && <span className="pop-meta">{host}{COARSE_POINTER && hint ? ` · ${hint}` : ""}</span>}
    </span>
  );
  return m.href ? (
    <a className={className} href={m.href} target="_blank" rel="noreferrer" onClick={onClick} {...POP_TRIGGERS}>
      {m.name}<span className="arrow-glyph"> ↗︎</span>{pop}
    </a>
  ) : (
    <span className={className} tabIndex={0} onClick={onClick} {...POP_TRIGGERS}>
      {m.name}{pop}
    </span>
  );
}

function Research({ L }) {
  const R = L.research;
  const groups = Object.keys(R.modelGroups || {});
  // which model chip a touch user has opened; a tap anywhere else closes it
  const [openModel, setOpenModel] = useState(null);
  useEffect(() => {
    if (!openModel) return undefined;
    const close = (e) => { if (!e.target.closest(".chip.model.open")) setOpenModel(null); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [openModel]);
  return (
    <section id="research">
      <div className="eyebrow">{R.eyebrow}</div>
      <div className="section-head">
        <h2 className="section-title reveal">{R.title}</h2>
        <p className="lede reveal">{R.lede}</p>
      </div>

      <div className="projects">
        {R.proj.map((p, i) => (
          <div key={i} className="project">
            <div className="project-num">{R.projLabel} <span className="accent">{p.n}</span></div>
            <div className="project-main">
              <div className="project-head">
                <h3>{p.title}</h3>
                <span className={`project-status tone-${p.status}`}>{R.projStatus[p.status]}</span>
              </div>
              <div className="project-tags">{p.tags.map((t, j) => <span key={j}>{t}</span>)}</div>
              <div className="project-detail">
                <div className="project-detail-inner">
                  <p>{p.summary}</p>
                  {p.outcome && (
                    <div className="project-outcome">
                      <div className="outcome-label">{R.outcomeLabel}</div>
                      <p>{p.outcome}</p>
                    </div>
                  )}
                  {p.figure && (
                    <figure className="project-fig">
                      <img src={p.figure.src} alt={p.figure.alt} loading="lazy" decoding="async" />
                      <figcaption>{p.figure.caption}</figcaption>
                    </figure>
                  )}
                  {p.paperLabel && (
                    <p className="project-paper">
                      <Lnk to={LINKS.paper}>{p.paperLabel} <span className="arrow-glyph">↗︎</span></Lnk>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {R.models && (
        <div className="tech-section reveal">
          <h3>{R.modelsTitle}</h3>
          <p className="tech-note">{R.modelsNote}</p>
          <div className="model-groups">
            {groups.map(g => {
              const rows = MODELS.filter(m => m.group === g);
              if (!rows.length) return null;
              return (
                <div key={g} className="model-group">
                  <div className="model-group-label">{R.modelGroups[g]}</div>
                  <div className="tech-cloud">
                    {rows.map(m => (
                      <ModelChip key={m.key} m={m} desc={R.models[m.key]} hint={R.modelTapHint}
                        open={openModel === m.key} onOpen={setOpenModel} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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
            <div className="pub-date" style={{ color: "var(--accent-ink)" }}>{p.status}</div>
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
          <article key={i} className="thesis">
            <div className="thesis-head">
              <div className="thesis-year">{t.y}</div>
              <div>
                <h4>{t.h}</h4>
                {t.orig && <div className="thesis-orig">{t.orig}</div>}
                <div className="thesis-where">{t.p}</div>
              </div>
            </div>
            <div className="thesis-body">{t.body}</div>
          </article>
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
              <div className="venue">{p.venue}{p.no ? ` · ${p.no}` : ""}</div>
            </div>
            <div className="pub-types">
              {p.upcoming && <span className="pub-tag upcoming">{P.upcomingLabel}</span>}
              {p.intl && <span className="pub-tag intl">{P.intlLabel}</span>}
              {/* p.type is the language-independent key; every entry so far is
                  a poster, but a Talk would just need a fourth typeLabels row */}
              <span className="pub-tag poster">
                {(P.typeLabels[p.type] || p.type) + (p.no ? ` ${p.no}` : "")}
              </span>
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

function Blog({ L }) {
  const B = L.blog;
  const posts = B.posts || [];
  return (
    <section id="blog">
      <div className="eyebrow">{B.eyebrow}</div>
      <div className="section-head">
        <h2 className="section-title reveal">{B.title}</h2>
        <p className="lede reveal">{B.note}</p>
      </div>
      {posts.length ? (
        <div className="post-list reveal">
          {posts.map((p, i) => {
            const inner = (
              <>
                <div className="post-date">{p.date}</div>
                <div className="post-main">
                  <h4>{p.title}</h4>
                  {p.excerpt && <p>{p.excerpt}</p>}
                </div>
                <span className="arrow-glyph">↗︎</span>
              </>
            );
            return p.href
              ? <a key={i} className="post-item" href={p.href}>{inner}</a>
              : <div key={i} className="post-item">{inner}</div>;
          })}
        </div>
      ) : (
        <div className="pub-empty reveal">{B.empty}</div>
      )}
      {B.collectLink && (
        <p className="section-more reveal">
          <a href="collect.html">{B.collectLink} <span className="arrow-glyph">↗︎</span></a>
        </p>
      )}
    </section>
  );
}

// A contact row with nothing to link to (WeChat ID, office address …) is a
// button that copies its value instead, with a visible affordance so it does
// not read as dead text.
function CopyRow({ label, value, copyLabel, copiedLabel }) {
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-9999px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) { /* nothing else to try */ }
      document.body.removeChild(ta);
    };
    const done = () => {
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1800);
    };
    // clipboard API needs a secure context; fall back on plain http / older Safari
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(done, () => { fallback(); done(); });
    } else {
      fallback();
      done();
    }
  };

  return (
    <button type="button" className={`contact-row copyable ${done ? "copied" : ""}`} onClick={copy}>
      <span className="label">{label}</span>
      <span className="value">{value}</span>
      <span className="copy-hint">{done ? copiedLabel : copyLabel}</span>
    </button>
  );
}

// Reads the repository's last commit date so the footer stays honest without a
// build step; falls back to the date this file was last edited by hand.
const LAST_UPDATE_FALLBACK = "2026-09-12";
const REPO_COMMITS_API = "https://api.github.com/repos/PinshuoYAO/PinshuoYAO.github.io/commits?per_page=1";
function LastUpdate({ label }) {
  const [date, setDate] = useState(LAST_UPDATE_FALLBACK);
  useEffect(() => {
    let alive = true;
    // one unauthenticated call per browser session: the 60-per-hour limit is
    // shared by everyone behind the same address
    let cached = null;
    try { cached = sessionStorage.getItem("yps-hp-last-commit"); } catch (e) { /* private mode */ }
    if (cached) { setDate(cached); return undefined; }
    fetch(REPO_COMMITS_API)
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        const iso = j && j[0] && j[0].commit && j[0].commit.committer && j[0].commit.committer.date;
        if (alive && iso) {
          setDate(iso.slice(0, 10));
          try { sessionStorage.setItem("yps-hp-last-commit", iso.slice(0, 10)); } catch (e) { /* ignore */ }
        }
      })
      .catch(() => { /* offline or rate-limited: keep the fallback */ });
    return () => { alive = false; };
  }, []);
  return <span>{label} · {date}</span>;
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
            {/* cv.pdf is generated from cv.html — see the comment at the top of that file. */}
            <a className="socials-cv" href={LINKS.cvPdf} download="YAO_Pinshuo_CV.pdf">{L.contact.cvLabel} <span className="arrow-glyph">↓</span></a>
          </div>
        </div>
        <div className="contact-list reveal">
          {CONTACTS.map((c, i) => {
            const label = L.contact.labels[c.id] || c.id;
            return c.href ? (
              <a key={i} className="contact-row" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}>
                <span className="label">{label}</span>
                <span className="value">{c.value}</span>
                <span className="arrow">↗︎</span>
              </a>
            ) : (
              <CopyRow key={i} label={label} value={c.value} copyLabel={L.contact.copy} copiedLabel={L.contact.copied} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer({ L }) {
  return (
    <footer>
      <span>© 2026 YAO Pinshuo · 姚品碩</span>
      <span>Built with curiosity · with Claude</span>
      <LastUpdate label={L.contact.lastUpdate} />
      <Clock />
    </footer>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
