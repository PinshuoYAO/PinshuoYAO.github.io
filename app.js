/* GENERATED from app.jsx by tools/build.js — do not edit. Edit app.jsx, then run
   bash ~/.claude/skills/yao-personal-hp/scripts/build.sh (the pre-commit hook also does it). */
function _extends() {return _extends = Object.assign ? Object.assign.bind() : function (n) {for (var e = 1; e < arguments.length; e++) {var t = arguments[e];for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);}return n;}, _extends.apply(null, arguments);}
const { useState, useEffect, useRef } = React;



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
  cvPdf: "cv.pdf"
};


const REDUCED_MOTION = (() => {
  try {return window.matchMedia("(prefers-reduced-motion: reduce)").matches;} catch (e) {return false;}
})();


const COARSE_POINTER = (() => {
  try {return window.matchMedia("(hover: none) and (pointer: coarse)").matches;} catch (e) {return false;}
})();

function Lnk({ to, children }) {
  return React.createElement("a", { href: to, target: "_blank", rel: "noreferrer" }, children);
}

function Hl({ children }) {
  return React.createElement("span", { className: "hl" }, children);
}



const KON = React.createElement(React.Fragment, null, "k", React.createElement("sub", null, "on"));
const KOFF = React.createElement(React.Fragment, null, "k", React.createElement("sub", null, "off"));
const KD = React.createElement(React.Fragment, null, "K", React.createElement("sub", null, "D"));





function nudgePop(e) {
  const pop = e.currentTarget.querySelector(".term-pop");
  if (!pop) return;
  const chip = e.currentTarget.getBoundingClientRect();


  const w = pop.getBoundingClientRect().width;
  const centre = chip.left + chip.width / 2;
  const margin = 12;
  const vw = document.documentElement.clientWidth;
  let shift = 0;
  if (centre - w / 2 < margin) shift = margin - (centre - w / 2);else
  if (centre + w / 2 > vw - margin) shift = vw - margin - (centre + w / 2);
  pop.style.setProperty("--pop-shift", shift.toFixed(2) + "px");
}
const POP_TRIGGERS = { onMouseEnter: nudgePop, onFocus: nudgePop };



function useNudgeAllPops(deps) {
  useEffect(() => {
    const run = () => {
      document.querySelectorAll(".term-pop").forEach((pop) => {
        if (pop.parentElement) nudgePop({ currentTarget: pop.parentElement });
      });
    };


    let queued = 0;
    const schedule = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {queued = 0;run();});
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




function Term({ k, lang, children }) {
  const pack = I18N[lang] || I18N.en;
  const def = pack && pack.glossary && pack.glossary[k];
  if (!def) return React.createElement(React.Fragment, null, children);
  return (
    React.createElement("span", _extends({ className: "term", tabIndex: 0 }, POP_TRIGGERS),
    children,
    React.createElement("span", { className: "term-pop" }, def)
    ));

}










const MODELS = [
{ key: "rfd3", name: "RFdiffusion3", group: "design", href: "https://www.biorxiv.org/content/10.1101/2025.09.18.676967v2" },
{ key: "boltzgen", name: "BoltzGen", group: "design", href: "https://github.com/HannesStark/boltzgen" },
{ key: "nise", name: "NISE", group: "design", href: "https://www.nature.com/articles/s41586-026-10670-w" },
{ key: "disco", name: "DISCO", group: "design", href: "https://arxiv.org/abs/2604.05181" },
{ key: "proteinmpnn", name: "ProteinMPNN", group: "design", href: "https://doi.org/10.1126/science.add2187" },
{ key: "ligandmpnn", name: "LigandMPNN", group: "design", href: "https://github.com/dauparas/LigandMPNN" },
{ key: "af3", name: "AlphaFold3", group: "struct", href: "https://doi.org/10.1038/s41586-024-07487-w" },
{ key: "af2", name: "AlphaFold2", group: "struct", href: "https://doi.org/10.1038/s41586-021-03819-2" },
{ key: "rosettafold", name: "RoseTTAFold", group: "struct", href: "https://doi.org/10.1126/science.abj8754" },
{ key: "esmfold2", name: "ESMFold2", group: "struct", href: "https://github.com/Biohub/esm" },
{ key: "boltz2", name: "Boltz-2", group: "struct", href: "https://github.com/jwohlwend/boltz" },
{ key: "chai1", name: "Chai-1", group: "struct", href: "https://github.com/chaidiscovery/chai-lab" },
{ key: "esm2", name: "ESM-2", group: "language", href: "https://doi.org/10.1126/science.ade2574" },
{ key: "esm3", name: "ESM3", group: "language", href: "https://github.com/evolutionaryscale/esm" },
{ key: "esmc", name: "ESM-C", group: "language", href: "https://github.com/evolutionaryscale/esm" },
{ key: "saprot", name: "SaProt", group: "language", href: "https://github.com/westlake-repl/SaProt" },
{ key: "masif", name: "MaSIF", group: "surface", href: "https://doi.org/10.1038/s41592-019-0666-6" }];




const GRANTS = [
{ key: "springgx", tone: "yes", href: LINKS.springGX },
{ key: "dc2_2027", tone: "pending", href: LINKS.jsps },
{ key: "spread_2026", tone: "lottery", href: LINKS.spread },
{ key: "dc2_2026", tone: "no", href: LINKS.jsps },
{ key: "dc1_2025", tone: "no", href: LINKS.jsps },
{ key: "dc1_2024", tone: "no", href: LINKS.jsps }];



const CONTACTS = [
{ id: "mailMain", value: "pinshuoyao@outlook.com", href: "mailto:pinshuoyao@outlook.com" },
{ id: "mailAlt", value: "pinshuoyao@gmail.com", href: "mailto:pinshuoyao@gmail.com" },
{ id: "mailUt", value: "yao1999@iis.u-tokyo.ac.jp", href: "mailto:yao1999@iis.u-tokyo.ac.jp" },
{ id: "mailEcc", value: "yaopinshuo@g.ecc.u-tokyo.ac.jp", href: "mailto:yaopinshuo@g.ecc.u-tokyo.ac.jp" },
{ id: "wechat", value: "yaopinshuo1999" },
{ id: "xhs", value: "744152221" },
{ id: "office", value: "Fe504, Institute of Industrial Science · 4-6-1 Komaba, Meguro-ku, Tokyo" }];

const SOCIALS = [
{ label: "X", href: "https://x.com/YAOPinshuo" },
{ label: "Bluesky", href: "https://bsky.app/profile/yaopinshuo.bsky.social" },
{ label: "LinkedIn", href: "https://jp.linkedin.com/in/pinshuoyao" },
{ label: "GitHub", href: "https://github.com/PinshuoYAO" },
{ label: "ORCID", href: "https://orcid.org/0009-0001-0085-3113" },
{ label: "Google Scholar", href: "https://scholar.google.com/citations?user=2S2t-oMAAAAJ" },
{ label: "Instagram", href: "https://www.instagram.com/PINSHUOYAO" }];


const NAV_KEYS = ["about", "research", "edu", "pubs", "news", "blog", "collect", "hobbies", "contact"];

const NAV_HREF = { collect: "collect.html" };

const I18N = {
  en: {
    nav: { about: "About", research: "Research", pubs: "Output", edu: "Path", hobbies: "Off-hours", news: "News", blog: "Blog", collect: "Collection", contact: "Contact" },
    hero: {
      meta: ["UTOKYO · INSTITUTE OF INDUSTRIAL SCIENCE", "TSUBOYAMA LAB", "PHD CANDIDATE"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "I work at the intersection of AI-driven protein design and biophysics, uncovering how proteins recognize the phospholipid signatures that define cellular membranes. Through AI design and high-throughput screening, I build highly specific phospholipid probes that a billion years of evolution never produced.",
      cta1: "Read the work", cta2: "Get in touch"
    },
    about: {
      eyebrow: "About me",
      title: "Ten years in Tokyo, between cities, languages, and disciplines.",
      p1: "I am Yao Pinshuo. Ten years ago, at seventeen, I left Harbin for Tokyo to learn a new language from scratch. I fell in love with biology at Tokyo University of Agriculture, and have been chasing molecules ever since.",
      p2: React.createElement(React.Fragment, null, "Today I am a PhD student at the ", React.createElement(Lnk, { to: LINKS.iis }, "Institute of Industrial Science"), ", The University of Tokyo, in the ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "Tsuboyama Lab"), ". My instruments are yeast displays, machine learning models, and BLI sensors. My questions: how does a protein know which lipid it loves, and can we teach a computer to design new ones from scratch?"),
      p3: React.createElement(React.Fragment, null, "My mother tongue is ", React.createElement(Hl, null, "Chinese"), ", and I hold research-level conversations in ", React.createElement(Hl, null, "English"), " and ", React.createElement(Hl, null, "Japanese"), ". You are welcome to write to me in any of the three. Outside the lab you'll find me on a mountain trail, with a film camera in hand, or planning the next quiet trip.")
    },


    glossary: {
      ICSI: "Intracytoplasmic sperm injection: a single sperm is injected directly into an egg under a micromanipulator, bypassing natural fertilization.",
      BLI: "Bio-layer interferometry: a label-free optical biosensor that reads binding in real time from the interference shift of light on a sensor tip.",
      PIPs: "Phosphoinositides: eight phosphorylated derivatives of phosphatidylinositol whose phosphate pattern marks each membrane compartment."
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
        summary: React.createElement(React.Fragment, null, "Phosphoinositides (", React.createElement(Term, { k: "PIPs", lang: "en" }, "PIPs"), ") are eight phosphorylated lipids that label distinct compartments of the endomembrane system: PI(4,5)P\u2082 at the plasma membrane, PI(3)P on early endosomes, PI(3,5)P\u2082 on late endosomes, and so on. Lipid-binding domains (PH, PX, ENTH, GRAM, GLUE, C2 \u2026) read these tiny phosphate decorations to control signaling, membrane trafficking, and cytoskeletal dynamics; a single mis-recognition ", React.createElement(Lnk, { to: LINKS.akt1 }, "can drive disease"), ", as the ", React.createElement(Lnk, { to: LINKS.akt1 }, "AKT1 PH E17K mutation"), " shows. Yet despite ", React.createElement(Lnk, { to: LINKS.pipCase1 }, "decades"), " of ", React.createElement(Lnk, { to: LINKS.pipCase2 }, "case studies"), ", no general rules describe how a given domain discriminates between the eight PIP species. Working in the ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "Tsuboyama Lab"), ", I set out to build ", React.createElement(Lnk, { to: LINKS.clib }, "large-scale, comparable binding datasets"), " across thousands of domains and lipid species, and to learn the recognition rules from them."),
        outcome: "Using a large-scale screen built on yeast display, we obtained a binding map covering more than 20,000 natural lipid-binding domains against 13 lipid species, over 260,000 measurements in all, and tried to derive, understand, predict and ultimately design binding specificity and strength from it with deep learning. The data quality was not sufficient to carry that, and the project failed. What it did give us is a clear picture of where yeast display is and is not the right tool, and a hard lesson about how much data quality matters."
      },
      {
        n: "02",
        status: "done",
        title: "Optimized liposome-based BLI for protein–phospholipid kinetics",
        tags: ["BLI", "Kinetics", "Liposomes"],
        summary: React.createElement(React.Fragment, null, "Most protein\u2013lipid assays report only equilibrium binding strength: they cannot tell you whether a tighter affinity comes from a faster ", KON, " or a slower ", KOFF, ", even though those two routes carry very different biological consequences. Bio-layer interferometry (", React.createElement(Term, { k: "BLI", lang: "en" }, "BLI"), ") can resolve real-time kinetics, but on lipid surfaces it is plagued by nonspecific protein adsorption. Through systematic buffer optimization (0.5% BSA, 0.001% Tween-20), we suppressed background binding while preserving liposome integrity, and recovered ", KON, ", ", KOFF, " and ", KD, " for representative PX and PH domains and their mutant series. The platform distinguishes kinetic mechanisms: for the AKT1 PH series, affinity gains came mostly from a slower ", KOFF, "; for SnxA PX, from a faster ", KON, ". Equilibrium binding alone cannot reveal that."),
        paperLabel: "Published in Biochemistry (ACS), 2026",
        figure: { src: "assets/toc.png", alt: "Schematic of the optimized liposome-based BLI assay with kon-driven and koff-driven sensorgrams.", caption: "The optimized assay, and the two kinetic routes to tighter binding. Table-of-contents graphic from the paper." }
      },
      {
        n: "03",
        status: "active",
        title: "De novo design of phosphoinositide-binding proteins",
        tags: ["De novo design", "Diffusion models", "Membrane"],
        summary: "Designing a protein that binds one specific PIP is one of the hardest cases in small-molecule binder design, for three reasons at once. The eight PIP species are near-identical to each other, differing only in which hydroxyls of the inositol ring carry a phosphate. Those head groups are strongly negatively charged, so a positively charged pocket picks up almost anything acidic, so specificity has to come from a precisely placed hydrogen-bond network rather than electrostatics. And the target sits on a membrane surface, so the design also has to solve membrane insertion and get the orientation of the binding pocket right relative to the bilayer. We are working our way through it; more to say later."
      }],

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
        masif: "Geometric deep learning on molecular surfaces; learns interaction fingerprints that mark binding sites."
      },
      organismsTitle: "Model organisms",
      organisms: [
      ["E. coli", "The workhorse bacterium for cloning and recombinant protein expression."],
      ["S. cerevisiae", "Budding yeast, the host for surface-display libraries and a simple eukaryotic membrane system."],
      ["Mouse", "Mammalian model used in my master's work on sperm chromatin and early development."]],

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
      ["HTS Workflows", "High-throughput screening: library construction, pooled selection, sequencing, and the analysis pipeline tying them together."]],

      projLabel: "PROJ"
    },
    edu: {
      eyebrow: "Path",
      title: "From Harbin to Tokyo, a path written in cities and disciplines.",
      items: [
      { date: "Since 2024.10", current: true, h: "PhD · Chemistry and Biotechnology", inst: React.createElement(React.Fragment, null, "The University of Tokyo, ", React.createElement(Lnk, { to: LINKS.iis }, "Institute of Industrial Science"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "Tsuboyama Lab")), detail: "AI-assisted protein design under Dr. Kotaro Tsuboyama. Supported by JST SPRING-GX. Expected completion September 2027." },
      { date: "2024.04–2024.09", h: "Research Student", inst: React.createElement(React.Fragment, null, "The University of Tokyo, ", React.createElement(Lnk, { to: LINKS.iis }, "Institute of Industrial Science"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "Tsuboyama Lab")), detail: "Joined the lab and started the lipid-binding screen." },
      { date: "2022–2024", h: "MSc · Life Sciences", inst: React.createElement(React.Fragment, null, "The University of Tokyo, ", React.createElement(Lnk, { to: LINKS.iqb }, "Institute for Quantitative Biosciences"), " \xB7 ", React.createElement(Lnk, { to: LINKS.okada }, "Okada Lab (Laboratory of Pathology and Development)")), detail: React.createElement(React.Fragment, null, "Under Prof. Yuki Okada. Built a method for reversible decondensation\u2013recondensation of sperm chromatin and tested the resulting sperm by ", React.createElement(Term, { k: "ICSI", lang: "en" }, "ICSI"), ". Concurrently a technical assistant at the Institute for Quantitative Biosciences (2022\u20132024). ", React.createElement(Hl, null, "Outstanding Graduate Award"), ".") },
      { date: "2018–2022", h: "BSc · Biological Sciences", inst: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.nodai }, "Tokyo University of Agriculture"), " \xB7 Laboratory of Functional Molecular Analysis (Yajima Lab)"), detail: "Under Prof. Shunsuke Yajima. Structural biology of an IclR-family transcription factor; early adopter of AlphaFold2 / RoseTTAFold inside the lab." },
      { date: "2016–2018", h: "Japanese Language Program", inst: "Fuji International Language Institute, Tokyo", detail: "Moved to Japan at seventeen. Learned a third language from scratch." },
      { date: "2010–2017", h: "Secondary Education", inst: "Harbin No.3 High School (Qunli) & Guanghua Middle School", detail: "Northeast China. Where the curiosity began." }]

    },
    pubs: {
      eyebrow: "Output",
      title: "Papers, talks, and what's coming next.",
      presTitle: "Conference presentations",
      upcomingLabel: "Upcoming",
      intlLabel: "International",
      typeLabels: { Poster: "Poster" },
      pres: [


      { date: "2026.10", intl: true, upcoming: true, type: "Poster", no: null, title: "De novo design of phosphoinositide-binding proteins", venue: "RosettaCon Asia 2026, Peking University, Beijing, China" },
      { date: "2025.01", intl: true, type: "Poster", no: null, title: "Decoding the Universal Principles of Protein–Phospholipid Binding", authors: "Yao P., Nishimura T., Tsuboyama K.", venue: "IPR International Conference 2025, Awaji Island, Japan" },
      { date: "2023.12", type: "Poster", no: "P-25", title: "Ex Vivo Sperm Chromatin Reconstitution: An Innovative Approach", venue: "Institute for Quantitative Biosciences Research Exchange Meeting 2023, The University of Tokyo" },
      { date: "2023.06", type: "Poster", no: "P-49", title: "Establishment of ex vivo Sperm Chromatin Reconstitution Method", venue: "16th Annual Meeting of the Japanese Society for Epigenetics, Hitotsubashi Hall, Tokyo" },
      { date: "2023.06", type: "Poster", no: null, title: "Effects of Divalent Cations on Sperm Chromatin Structure & Ex Vivo Reconstitution", venue: "22nd UTokyo Life Sciences Symposium BIO UT, Komaba Campus" },
      { date: "2022.11", type: "Poster", no: "P-25", title: "Analysis of Divalent Cation Effects on Sperm Chromatin Structure", venue: "Joint “Wakate-no-kai 2022”, Rinku, Osaka" }],

      papersTitle: "Peer-reviewed papers",
      papers: [
      {
        date: "2026", status: "Published",
        title: "Quantitative Kinetic Analysis of Protein–Phosphoinositide Binding by Optimized Liposome-Based Bio-Layer Interferometry",
        authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
        venue: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.acsBiochem }, "Biochemistry"), " (ACS) 65 (16), 2557\u20132565, special issue \u201CLipids and Lipidation\u201D \xB7 ", React.createElement(Lnk, { to: LINKS.paper }, "doi.org/10.1021/acs.biochem.6c00344")),
        note: "Received 20 Apr 2026 · accepted 23 Jul 2026. First-author."
      }],

      papersEmpty: "More first-author manuscripts in preparation. Stay tuned.",
      thesesTitle: "Theses",
      theses: [
      {
        y: "2024",
        h: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations",
        orig: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立",
        p: React.createElement(React.Fragment, null, "Master's thesis \xB7 The University of Tokyo, Graduate School of Arts and Sciences \xB7 ", React.createElement(Lnk, { to: LINKS.okada }, "Okada Lab"), ", ", React.createElement(Lnk, { to: LINKS.iqb }, "Institute for Quantitative Biosciences")),
        body: React.createElement(React.Fragment, null, React.createElement("p", null, "A sperm cell carries the paternal genome in an extraordinarily condensed nucleus. Late in spermatogenesis roughly 90% of the histones are swapped for protamine, leaving mouse sperm chromatin about 40\xD7 denser than a somatic nucleus, dense enough to shield the DNA from mechanical and enzymatic damage. That same density is why methods developed for somatic chromatin do not work on it. Divalent cations were known to condense and decondense polyamine\u2013DNA complexes in vitro, but whether they act on protamine-packed sperm chromatin was untested."), React.createElement("p", null, "I profiled Mg\xB2\u207A, Ca\xB2\u207A, Zn\xB2\u207A and Mn\xB2\u207A against mouse sperm, combined them with nucleoplasmin treatment to strip protamine, used the chelators EDTA and TPEN to identify which ion was responsible, then assayed the products by comet assay for DNA integrity and by ", React.createElement(Term, { k: "ICSI", lang: "en" }, "ICSI"), " for developmental competence. Mg\xB2\u207A promoted decondensation and Zn\xB2\u207A blocked it, both dose-dependently, and TPEN chelation confirmed the effect was Zn-specific. At 500 mM ZnCl\u2082, pH 1, decondensed chromatin recondensed to its original size or smaller: ", React.createElement(Hl, null, "the first reported method for recondensing sperm chromatin"), ". Recondensed sperm showed more DNA fragmentation than untreated controls though far less than an H\u2082O\u2082 positive control, and after ICSI the embryos reached the 4-cell stage at 24% against 67% for controls, with none reaching blastocyst. The handle works, but it is ", React.createElement(Hl, null, "not yet developmentally neutral"), "."), React.createElement("p", null, "That still matters: a reversible open-and-close operation on sperm chromatin is the prerequisite for editing the sperm epigenome and asking what it contributes to development, and this experiment pinpoints the step where the current protocol harms the embryo, which is where the next iteration has to start."))
      },
      {
        y: "2022",
        h: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P",
        orig: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析",
        p: React.createElement(React.Fragment, null, "Bachelor's thesis \xB7 ", React.createElement(Lnk, { to: LINKS.nodai }, "Tokyo University of Agriculture"), ", Faculty of Life Sciences \xB7 Laboratory of Functional Molecular Analysis (Prof. Shunsuke Yajima)"),
        body: React.createElement(React.Fragment, null, React.createElement("p", null, "L-glucose is the mirror image of the D-glucose that all life runs on. It does not occur in nature and hexokinase will not phosphorylate it, so for almost every organism it is not food. A soil isolate, Paracoccus sp. 43P, metabolises it anyway, through a dedicated pathway regulated by the IclR-family transcription factor LgnR. How an organism evolves regulation for a sugar it has never encountered is an open question, and the atomic-level mechanism by which LgnR senses the state of that pathway and switches it had not been described."), React.createElement("p", null, "I cloned and expressed LgnR in E. coli, purified it by Ni-affinity chromatography, confirmed the product by SDS-PAGE, dialysed and concentrated it, and screened crystallization conditions toward a structure. ", React.createElement(Hl, null, "Recombinant LgnR was purified to a crystallography-ready state"), " and the screens were run and evaluated."), React.createElement("p", null, "A structure would show how a regulator adapts to a substrate evolution never gave it, which bears both on the origins of new metabolic capability and on engineering bacteria for bioremediation. This project is also ", React.createElement(Hl, null, "where I first ran AlphaFold2 and RoseTTAFold"), ", and where the computational half of my work began."))
      }],

      fundingTitle: "Funding & fellowships",
      fundingNote: "Every application I have written so far, funded or not. Research runs on the ones that land and the ones that don't.",
      grantCols: ["Term", "Programme", "Project", "Outcome"],
      grants: {
        springgx: { year: "2024 – present", program: "JST SPRING-GX", title: React.createElement(React.Fragment, null, "Support for Pioneering Research Initiated by the Next Generation: ", React.createElement(Lnk, { to: LINKS.springGX }, "Green Transformation Program for Advanced Human Resource Development"), ", The University of Tokyo."), status: "Awarded" },
        dc2_2027: { year: "FY2027", program: "JSPS DC2", title: "Elucidating the precise lipid-species recognition mechanism by large-scale analysis and machine learning (大規模解析と機械学習による精密な脂質種認識機構の解明).", status: "Under review" },
        spread_2026: { year: "2026", program: "JST SPReAD (1st call)", title: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.spread }, "AI for Science \u840C\u82BD\u7684\u6311\u6226\u7814\u7A76\u5275\u51FA\u4E8B\u696D\uFF08SPReAD: Supporting Pioneering Research through AI for 1,000 Discovery challenges\uFF09"), ", part of the MEXT \u201CAI for Science \u306B\u3088\u308B\u79D1\u5B66\u7814\u7A76\u9769\u65B0\u30D7\u30ED\u30B0\u30E9\u30E0\u201D. Project: predicting the lipid-binding specificity of lipid-binding domains and extracting recognition rules with a sequence\u2013structure integrated AI."), status: "Passed review · not drawn" },
        dc2_2026: { year: "FY2026", program: "JSPS DC2", title: "Analysis of protein lifetime determinants by large-scale measurement and machine learning (大規模測定と機械学習によるタンパク質の寿命決定因子解析).", status: "Not awarded" },
        dc1_2025: { year: "FY2025", program: "JSPS DC1", title: "Analysis of protein lifetime determinants by large-scale measurement and machine learning (大規模測定と機械学習によるタンパク質の寿命決定因子解析).", status: "Not awarded" },
        dc1_2024: { year: "FY2024", program: "JSPS DC1", title: "Elucidating the significance of the sperm epigenome through ex vivo sperm reconstitution (精子エピゲノムの意義を精子体外再構成法で解明する研究).", status: "Not awarded" }
      },
      awardsTitle: "Awards & activities",
      awards: [
      { y: "2024.03", h: React.createElement(React.Fragment, null, React.createElement(Hl, null, "Outstanding Graduate Award"), ", Interdisciplinary Sciences (\u5E83\u57DF\u79D1\u5B66\u5C02\u653B\u5968\u52B1\u8CDE)"), p: "Graduate School of Arts and Sciences, The University of Tokyo, FY2023." },
      { y: "2023.08", h: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.nanolsiSchool }, "Bio-SPM Summer School"), " (", React.createElement(Lnk, { to: LINKS.nanolsi }, "Kanazawa University NanoLSI"), "), collaborative project accepted"), p: "11th Bio-SPM Summer School. High-speed AFM imaging of in vitro reconstituted complexes." }]

    },
    hobbies: {
      eyebrow: "Off-hours",
      title: "Curious about everything that isn't a pipette.",
      items: [
      ["山", "Hiking & Camping", "Kamikochi, Oze, Tateyama Kurobe; the slower the trail, the better."],
      ["影", "Photography", "Film cameras, fast trains, the occasional stranger's smile."],
      ["猫", "Cats", "The smallest, quietest collaborators."],
      ["旅", "Travel", "Long trains, side streets, and a notebook for finding-out-later."]]

    },
    news: {
      eyebrow: "Recent",
      title: "What's new.",
      items: [
      { when: "2026 · 10", h: "Poster at RosettaCon Asia 2026", p: React.createElement(React.Fragment, null, "Will present the ", React.createElement(Hl, null, "de novo PIP-binder design"), " work at ", React.createElement(Lnk, { to: LINKS.rosettaAsia }, "RosettaCon Asia"), ", 10 and 11 October, Peking University, Beijing.") },
      { when: "2026 · 08", h: "First-author paper published", p: React.createElement(React.Fragment, null, "Out now in ", React.createElement(Lnk, { to: LINKS.paper }, "Biochemistry (ACS)"), ", part of the special issue \u201CLipids and Lipidation\u201D: quantitative kinetic analysis of protein\u2013phosphoinositide binding by optimized liposome-based BLI.") },
      { when: "2026 · 05", h: "JSPS DC2 application submitted", p: "Applied for FY2027 with the lipid-species recognition project. Under review." },
      { when: "2026 · 04", h: "BLI manuscript submitted", p: React.createElement(React.Fragment, null, "Submitted to ", React.createElement(Lnk, { to: LINKS.acsBiochem }, "Biochemistry (ACS)"), " on 20 April; accepted three months later.") },
      { when: "2025 · 01", h: "IPR International Conference 2025", p: "Presented the protein–phospholipid binding work on Awaji Island." },
      { when: "2024 · 10", h: "Started the PhD program", p: "Officially enrolled in Chemistry and Biotechnology, Graduate School of Engineering, The University of Tokyo." },
      { when: "2024 · 04", h: "Joined the Tsuboyama Lab", p: React.createElement(React.Fragment, null, "Began research at the Biomolecular Design Engineering Lab, ", React.createElement(Lnk, { to: LINKS.iis }, "Institute of Industrial Science"), ".") }]

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
        excerpt: "A note to self on Biotite: sequences, 3D structures, database queries and wrappers for external tools, all in one Python package with a consistent API, so a small analysis script stops opening with two hundred lines of parsing."
      },
      {
        date: "2026 · 08 · 17",
        href: "posts/py2dmol.html",
        title: "Protein figures without opening PyMOL",
        excerpt: "py2Dmol turns a PDB ID into a drawing you can actually use, in a browser tab: transparent background, ligands included, several styles. A short note on the tool and why it stays in my bookmarks."
      },
      {
        date: "2026 · 08 · 17",
        href: "posts/bli-liposome.html",
        title: "Reading protein–lipid binding in real time",
        excerpt: "Almost every protein–lipid assay answers “how tightly?” Very few answer “how fast, and how long?” A method note on turning liposome-based BLI into a quantitative kinetic assay, on where the nonspecific signal actually comes from, and on what I would check before trusting the numbers."
      }],

      empty: "First posts are being written. Check back soon."
    },
    contact: {
      eyebrow: "Contact",
      headline: React.createElement(React.Fragment, null, "Let's ", React.createElement("em", null, "talk science.")),
      sub: "Collaborations, AI for Science, lipid biophysics, or just a cup of coffee in Komaba. My inbox is always open.",
      seekingLabel: "Open to",
      seeking: React.createElement(React.Fragment, null, "Postdoctoral positions starting late 2027 or 2028. I work on ", React.createElement(Hl, null, "both sides of the bench"), ": protein design, library construction, high-throughput screening, NGS processing and analysis, and binding kinetics are all things I can run end to end myself. What I want to do next is ", React.createElement(Hl, null, "put designed proteins to work inside living cells"), ", which draws me toward cell programming, genetic circuits and protein engineering."),
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
        office: "Office"
      }
    }
  },

  zh: {
    nav: { about: "关于", research: "研究", pubs: "成果", edu: "经历", hobbies: "生活", news: "动态", blog: "博客", collect: "收藏", contact: "联系" },
    hero: {
      meta: ["东京大学生产技术研究所", "坪山研究室", "博士在读"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "我在 AI 蛋白质设计与生物物理的交叉口工作，探索蛋白质如何识别决定细胞内各膜系统身份的磷脂特征。我通过 AI 设计和高通量实验筛选，创造亿万年进化中未曾出现过的高特异性磷脂探针。",
      cta1: "看研究", cta2: "联系我"
    },
    about: {
      eyebrow: "关于我",
      title: "东京十年，穿行在城市、语言与学科之间。",
      p1: "我叫姚品碩。十年前，十七岁那年，我离开哈尔滨来到东京，从零开始学日语。后来在东京农业大学爱上了生物学，从此再也没有停止追逐分子。",
      p2: React.createElement(React.Fragment, null, "\u73B0\u5728\u6211\u662F", React.createElement(Lnk, { to: LINKS.iis }, "\u4E1C\u4EAC\u5927\u5B66\u751F\u4EA7\u6280\u672F\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4"), "\u7684\u535A\u58EB\u751F\u3002\u6211\u7684\u5DE5\u5177\u662F\u9175\u6BCD\u5C55\u793A\u3001\u673A\u5668\u5B66\u4E60\u6A21\u578B\u548C BLI \u4F20\u611F\u5668\u3002\u6211\u60F3\u77E5\u9053\uFF1A\u86CB\u767D\u8D28\u662F\u5982\u4F55\u8BC6\u522B\u5B83\u6240\u504F\u7231\u7684\u8102\u8D28\uFF1F\u6211\u4EEC\u80FD\u5426\u6559\u8BA1\u7B97\u673A\u4ECE\u96F6\u5F00\u59CB\u8BBE\u8BA1\u65B0\u7684\u86CB\u767D\uFF1F"),
      p3: React.createElement(React.Fragment, null, "\u6211\u7684\u6BCD\u8BED\u662F", React.createElement(Hl, null, "\u4E2D\u6587"), "\uFF0C\u53EF\u4EE5\u719F\u7EC3\u7528", React.createElement(Hl, null, "\u82F1\u6587"), "\u548C", React.createElement(Hl, null, "\u65E5\u8BED"), "\u5BF9\u8BDD\uFF0C\u6B22\u8FCE\u4F7F\u7528\u4EFB\u610F\u8FD9\u4E09\u79CD\u8BED\u8A00\u4E0E\u6211\u6C9F\u901A\u3002\u5B9E\u9A8C\u5BA4\u4E4B\u5916\uFF0C\u4F60\u5927\u6982\u7387\u4F1A\u5728\u5C71\u9053\u4E0A\u3001\u76F8\u673A\u540E\u9762\uFF0C\u6216\u4E0B\u4E00\u6B21\u5B89\u9759\u65C5\u884C\u7684\u8BA1\u5212\u91CC\u627E\u5230\u6211\u3002")
    },
    glossary: {
      ICSI: "卵胞浆内单精子注射：在显微操作下把一个精子直接注入卵母细胞，绕过自然受精过程。",
      BLI: "生物层干涉法：无标记光学生物传感技术，通过传感器针尖上的光干涉位移实时读出结合过程。",
      PIPs: "磷脂酰肌醇：磷脂酰肌醇的 8 种磷酸化衍生物，其磷酸基组合标记着不同的膜区室。"
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
        summary: React.createElement(React.Fragment, null, "\u78F7\u8102\u9170\u808C\u9187\uFF08", React.createElement(Term, { k: "PIPs", lang: "zh" }, "PIPs"), "\uFF09\u662F 8 \u79CD\u78F7\u9178\u5316\u8102\u8D28\uFF0C\u6807\u8BB0\u7740\u5185\u819C\u7CFB\u7EDF\u7684\u4E0D\u540C\u533A\u5BA4\uFF1API(4,5)P\u2082 \u5728\u8D28\u819C\uFF0CPI(3)P \u5728\u65E9\u671F\u5185\u4F53\uFF0CPI(3,5)P\u2082 \u5728\u665A\u671F\u5185\u4F53\uFF0C\u7B49\u7B49\u3002\u8102\u8D28\u7ED3\u5408\u7ED3\u6784\u57DF\uFF08PH\u3001PX\u3001ENTH\u3001GRAM\u3001GLUE\u3001C2 \u2026\u2026\uFF09\u901A\u8FC7\u8BC6\u522B\u8FD9\u4E9B\u6781\u5C0F\u7684\u78F7\u9178\u57FA\u4FEE\u9970\u6765\u8C03\u63A7\u4FE1\u53F7\u4F20\u5BFC\u3001\u819C\u8FD0\u8F93\u4E0E\u7EC6\u80DE\u9AA8\u67B6\u52A8\u529B\u5B66\uFF1B\u4E00\u4E2A\u8BC6\u522B\u9519\u8BEF\u5C31", React.createElement(Lnk, { to: LINKS.akt1 }, "\u8DB3\u4EE5\u5F15\u53D1\u75BE\u75C5"), "\uFF0C", React.createElement(Lnk, { to: LINKS.akt1 }, "AKT1 PH \u7684 E17K \u7A81\u53D8"), "\u4FBF\u662F\u4E00\u4F8B\u3002\u7136\u800C\u7ECF\u8FC7", React.createElement(Lnk, { to: LINKS.pipCase1 }, "\u6570\u5341\u5E74"), "\u7684", React.createElement(Lnk, { to: LINKS.pipCase2 }, "\u4E2A\u6848\u7814\u7A76"), "\uFF0C\u4ECD\u7136\u6CA1\u6709\u4E00\u822C\u89C4\u5219\u80FD\u591F\u63CF\u8FF0\u4EFB\u610F\u7ED3\u6784\u57DF\u5982\u4F55\u533A\u5206\u8FD9 8 \u79CD PIPs\u3002\u6211\u5728", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4"), "\u91CC\uFF0C\u8BD5\u56FE\u5EFA\u7ACB\u8DE8\u6570\u5343\u4E2A\u7ED3\u6784\u57DF\u548C\u8102\u8D28\u79CD\u7684\u3001\u53EF\u6BD4\u8F83\u7684", React.createElement(Lnk, { to: LINKS.clib }, "\u5927\u89C4\u6A21\u7ED3\u5408\u6570\u636E\u96C6"), "\uFF0C\u5E76\u4ECE\u4E2D\u5B66\u51FA\u8BC6\u522B\u89C4\u5219\u3002"),
        outcome: "我们使用基于酵母展示（yeast display）开发的大规模筛选方法，获取了超过 2 万个天然脂质结合结构域与 13 种脂质的结合图谱，共计超过 26 万条数据，想要借助深度学习从中推导、理解、预测乃至设计它们的结合特异性和强度。但受限于数据质量，这条路最终走向失败。从中我们理解到了酵母展示方法的适用范围，以及数据质量的重要性。"
      },
      {
        n: "02",
        status: "done",
        title: "蛋白质对磷脂结合动力学的优化脂质体 BLI 平台",
        tags: ["BLI", "动力学", "脂质体"],
        summary: React.createElement(React.Fragment, null, "\u5927\u591A\u6570\u86CB\u767D\u8D28\u5BF9\u8102\u8D28\u7684\u5B9E\u9A8C\u53EA\u80FD\u7ED9\u51FA\u5E73\u8861\u7ED3\u5408\u5F3A\u5EA6\uFF1A\u65E0\u6CD5\u5206\u8FA8\u66F4\u7D27\u7684\u4EB2\u548C\u6027\u662F\u6765\u81EA\u66F4\u5FEB\u7684 ", KON, " \u8FD8\u662F\u66F4\u6162\u7684 ", KOFF, "\uFF0C\u5373\u4F7F\u8FD9\u4E24\u6761\u8DEF\u5F84\u5728\u751F\u7269\u5B66\u4E0A\u610F\u4E49\u622A\u7136\u4E0D\u540C\u3002\u751F\u7269\u5C42\u5E72\u6D89\u6CD5\uFF08", React.createElement(Term, { k: "BLI", lang: "zh" }, "BLI"), "\uFF09\u80FD\u591F\u5206\u8FA8\u5B9E\u65F6\u52A8\u529B\u5B66\uFF0C\u4F46\u5728\u8102\u8D28\u8868\u9762\u5E38\u5E38\u53D7\u5230\u975E\u7279\u5F02\u6027\u86CB\u767D\u5438\u9644\u7684\u5E72\u6270\u3002\u901A\u8FC7\u7CFB\u7EDF\u4F18\u5316\u7684\u7F13\u51B2\u6DB2\u914D\u65B9\uFF080.5% BSA\u30010.001% Tween-20\uFF09\uFF0C\u6211\u4EEC\u6291\u5236\u4E86\u80CC\u666F\u7ED3\u5408\u540C\u65F6\u4FDD\u6301\u8102\u8D28\u4F53\u7684\u5B8C\u6574\u6027\uFF0C\u5E76\u5BF9\u4EE3\u8868\u6027\u7684 PX\u3001PH \u7ED3\u6784\u57DF\u53CA\u5176\u7A81\u53D8\u4F53\u7CFB\u5217\u6062\u590D\u4E86 ", KON, "\u3001", KOFF, " \u4E0E ", KD, "\u3002\u8BE5\u5E73\u53F0\u80FD\u591F\u533A\u5206\u52A8\u529B\u5B66\u673A\u5236\uFF1AAKT1 PH \u7CFB\u5217\u7684\u4EB2\u548C\u6027\u589E\u5F3A\u4E3B\u8981\u6765\u81EA\u66F4\u6162\u7684 ", KOFF, "\uFF1BSnxA PX \u5219\u6765\u81EA\u66F4\u5FEB\u7684 ", KON, "\u3002\u8FD9\u662F\u5E73\u8861\u7ED3\u5408\u6570\u636E\u672C\u8EAB\u65E0\u6CD5\u63ED\u793A\u7684\u4FE1\u606F\u3002"),
        paperLabel: "论文发表于 Biochemistry (ACS)，2026",
        figure: { src: "assets/toc.png", alt: "优化后的脂质体 BLI 方法示意图，以及 kon 与 koff 两种驱动方式的曲线。", caption: "优化后的实验体系，以及结合变紧的两条动力学路径。图为论文的目录图。" }
      },
      {
        n: "03",
        status: "active",
        title: "磷脂结合蛋白的从头设计",
        tags: ["从头设计", "扩散模型", "膜"],
        summary: "设计一个只结合某一种 PIP 的蛋白，是小分子结合蛋白设计中难度最高的一类，因为三重困难同时存在。PIPs 家族的 8 个成员彼此高度相似，区别仅在于肌醇环上哪几个羟基被磷酸化。它们的头部带有强负电，正电口袋很容易把所有带酸性的东西都抓上来，因此特异性必须来自高度精准的氢键网络，而不能依赖静电。而且目标位于膜表面，所以设计还必须同时解决膜插入，以及结合口袋相对于双层膜的方向性问题。我们正在努力迈进，请期待。"
      }],

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
        masif: "在分子表面上做几何深度学习，学出标记结合位点的相互作用指纹。"
      },
      organismsTitle: "模式生物",
      organisms: [
      ["E. coli", "克隆与重组蛋白表达的主力细菌。"],
      ["S. cerevisiae", "出芽酵母，表面展示文库的宿主，也是最简单的真核膜系统。"],
      ["小鼠", "硕士期间研究精子染色质与早期发育所用的哺乳动物模型。"]],

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
      ["HTS 流程", "高通量筛选：文库构建、混合选择、测序，以及把它们串起来的分析流程。"]],

      projLabel: "PROJ"
    },
    edu: {
      eyebrow: "经历",
      title: "从哈尔滨到东京，一条由城市与学科书写的路径。",
      items: [
      { date: "2024.10 至今", current: true, h: "博士 · 化学生命工学", inst: React.createElement(React.Fragment, null, "\u4E1C\u4EAC\u5927\u5B66 ", React.createElement(Lnk, { to: LINKS.iis }, "\u751F\u4EA7\u6280\u672F\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4")), detail: "在坪山幸太郎讲师指导下，从事 AI 辅助蛋白质设计。受 JST SPRING-GX 资助。预计 2027 年 9 月毕业。" },
      { date: "2024.04–2024.09", h: "研究生", inst: React.createElement(React.Fragment, null, "\u4E1C\u4EAC\u5927\u5B66 ", React.createElement(Lnk, { to: LINKS.iis }, "\u751F\u4EA7\u6280\u672F\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4")), detail: "加入实验室，启动脂质结合筛选。" },
      { date: "2022–2024", h: "硕士 · 生命科学", inst: React.createElement(React.Fragment, null, "\u4E1C\u4EAC\u5927\u5B66 ", React.createElement(Lnk, { to: LINKS.iqb }, "\u5B9A\u91CF\u751F\u547D\u79D1\u5B66\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.okada }, "\u5188\u7530\u7814\u7A76\u5BA4\uFF08\u75C5\u6001\u53D1\u751F\u63A7\u5236\u7814\u7A76\u5206\u91CE\uFF09")), detail: React.createElement(React.Fragment, null, "\u6307\u5BFC\u6559\u6388\uFF1A\u5CA1\u7530\u7531\u7D00\u3002\u5EFA\u7ACB\u4E86\u7CBE\u5B50\u67D3\u8272\u8D28\u53EF\u9006\u89E3\u51DD\u7F29\u4E0E\u518D\u51DD\u7F29\u7684\u65B9\u6CD5\uFF0C\u5E76\u7528 ", React.createElement(Term, { k: "ICSI", lang: "zh" }, "ICSI"), " \u68C0\u9A8C\u4E86\u5904\u7406\u540E\u7CBE\u5B50\u7684\u53D1\u80B2\u80FD\u529B\u3002\u671F\u95F4\u517C\u4EFB\u5B9A\u91CF\u751F\u547D\u79D1\u5B66\u7814\u7A76\u6240\u6280\u672F\u8865\u4F50\u5458\uFF082022\u20132024\uFF09\u3002", React.createElement(Hl, null, "\u4F18\u79C0\u6BD5\u4E1A\u751F\u5956"), "\u3002") },
      { date: "2018–2022", h: "学士 · 生物科学", inst: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.nodai }, "\u4E1C\u4EAC\u519C\u4E1A\u5927\u5B66"), " \xB7 \u673A\u80FD\u6027\u5206\u5B50\u89E3\u6790\u5B66\u7814\u7A76\u5BA4\uFF08\u77E2\u5D8B\u7814\u7A76\u5BA4\uFF09"), detail: "指导教授：矢嶋俊介。IclR 家族转录因子的结构生物学；在研究室内率先引入 AlphaFold2 / RoseTTAFold。" },
      { date: "2016–2018", h: "日语预科", inst: "富士国际语学院，东京", detail: "十七岁来到日本，从零开始学第三种语言。" },
      { date: "2010–2017", h: "基础教育", inst: "哈尔滨第三中学（群力）& 光华中学", detail: "中国东北。好奇心的起点。" }]

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
      { date: "2022.11", type: "Poster", no: "P-25", title: "二价阳离子对精子染色质结构的影响解析", venue: "新学术领域·学术变革领域联合「若手の会 2022」，大阪临空" }],

      papersTitle: "同行评审论文",
      papers: [
      {
        date: "2026", status: "已发表",
        title: "通过优化的脂质体生物层干涉法定量分析蛋白质对磷脂酰肌醇的结合动力学",
        authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
        venue: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.acsBiochem }, "Biochemistry"), " (ACS) 65 (16)\uFF0C2557\u20132565\uFF0C\u4E13\u520A \u201CLipids and Lipidation\u201D \xB7 ", React.createElement(Lnk, { to: LINKS.paper }, "doi.org/10.1021/acs.biochem.6c00344")),
        note: "2026 年 4 月 20 日投稿 · 7 月 23 日接收。第一作者。"
      }],

      papersEmpty: "其他第一作者论文正在撰写中。敬请期待。",
      thesesTitle: "学位论文",
      theses: [
      {
        y: "2024",
        h: "用二价阳离子建立精子染色质的体外改变方法",
        orig: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立",
        p: React.createElement(React.Fragment, null, "\u7855\u58EB\u5B66\u4F4D\u8BBA\u6587 \xB7 \u4E1C\u4EAC\u5927\u5B66\u7EFC\u5408\u6587\u5316\u7814\u7A76\u79D1\u5E7F\u57DF\u79D1\u5B66\u4E13\u653B \xB7 ", React.createElement(Lnk, { to: LINKS.okada }, "\u5188\u7530\u7814\u7A76\u5BA4"), "\uFF0C", React.createElement(Lnk, { to: LINKS.iqb }, "\u5B9A\u91CF\u751F\u547D\u79D1\u5B66\u7814\u7A76\u6240")),
        body: React.createElement(React.Fragment, null, React.createElement("p", null, "\u7CBE\u5B50\u628A\u7236\u6E90\u57FA\u56E0\u7EC4\u88C5\u8FDB\u4E00\u4E2A\u6781\u5EA6\u51DD\u7F29\u7684\u7EC6\u80DE\u6838\u91CC\u3002\u5728\u7CBE\u5B50\u5F62\u6210\u7684\u540E\u671F\uFF0C\u7EA6\u4E5D\u6210\u7684\u7EC4\u86CB\u767D\u88AB\u9C7C\u7CBE\u86CB\u767D\uFF08protamine\uFF09\u66FF\u6362\uFF0C\u4F7F\u5C0F\u9F20\u7CBE\u5B50\u67D3\u8272\u8D28\u6BD4\u4F53\u7EC6\u80DE\u6838\u51DD\u7F29\u7EA6 40 \u500D\uFF0C\u8DB3\u4EE5\u5C4F\u853D\u7269\u7406\u548C\u9176\u5B66\u7684 DNA \u635F\u4F24\u3002\u4F46\u6B63\u662F\u8FD9\u79CD\u81F4\u5BC6\uFF0C\u8BA9\u6240\u6709\u9488\u5BF9\u4F53\u7EC6\u80DE\u67D3\u8272\u8D28\u5F00\u53D1\u7684\u65B9\u6CD5\u5728\u7CBE\u5B50\u4E0A\u90FD\u5931\u6548\u3002\u6B64\u524D\u5DF2\u77E5\u4E8C\u4EF7\u9633\u79BB\u5B50\u80FD\u5728\u4F53\u5916\u8BA9\u591A\u80FA-DNA \u590D\u5408\u4F53\u53D1\u751F\u51DD\u7F29\u4E0E\u89E3\u51DD\u7F29\uFF0C\u4F46\u5B83\u4EEC\u5BF9\u7531\u9C7C\u7CBE\u86CB\u767D\u5305\u88C5\u7684\u7CBE\u5B50\u67D3\u8272\u8D28\u662F\u5426\u6709\u6548\uFF0C\u65E0\u4EBA\u9A8C\u8BC1\u8FC7\u3002"), React.createElement("p", null, "\u6211\u7CFB\u7EDF\u68C0\u9A8C\u4E86 Mg\xB2\u207A\u3001Ca\xB2\u207A\u3001Zn\xB2\u207A\u3001Mn\xB2\u207A \u5BF9\u5C0F\u9F20\u7CBE\u5B50\u7684\u4F5C\u7528\uFF0C\u5E76\u4E0E\u53BB\u9664\u9C7C\u7CBE\u86CB\u767D\u7684\u6838\u8D28\u86CB\u767D\uFF08nucleoplasmin\uFF09\u5904\u7406\u7EC4\u5408\u4F7F\u7528\uFF0C\u518D\u7528\u87AF\u5408\u5242 EDTA \u4E0E TPEN \u786E\u8BA4\u7A76\u7ADF\u662F\u54EA\u79CD\u79BB\u5B50\u5728\u8D77\u4F5C\u7528\uFF0C\u6700\u540E\u7528\u5F57\u661F\u8BD5\u9A8C\u8BC4\u4F30 DNA \u5B8C\u6574\u6027\u3001\u7528 ", React.createElement(Term, { k: "ICSI", lang: "zh" }, "ICSI"), " \u8BC4\u4F30\u53D7\u7CBE\u4E0E\u53D1\u80B2\u80FD\u529B\u3002\u7ED3\u679C\u662F\uFF1AMg\xB2\u207A \u4FC3\u8FDB\u89E3\u51DD\u7F29\uFF0CZn\xB2\u207A \u6291\u5236\u89E3\u51DD\u7F29\uFF0C\u5747\u5448\u6D53\u5EA6\u4F9D\u8D56\uFF1BTPEN \u87AF\u5408\u5B9E\u9A8C\u786E\u8BA4\u8BE5\u6548\u5E94\u662F Zn \u7279\u5F02\u6027\u7684\u3002\u5728 500 mM ZnCl\u2082\u3001pH 1 \u7684\u6761\u4EF6\u4E0B\uFF0C\u5DF2\u89E3\u51DD\u7F29\u7684\u7CBE\u5B50\u67D3\u8272\u8D28\u91CD\u65B0\u51DD\u7F29\u5230\u539F\u672C\u5927\u5C0F\u751A\u81F3\u66F4\u5C0F\uFF0C\u8FD9\u662F", React.createElement(Hl, null, "\u9996\u4E2A\u4F7F\u7CBE\u5B50\u67D3\u8272\u8D28\u518D\u51DD\u7F29\u7684\u65B9\u6CD5"), "\u3002\u518D\u51DD\u7F29\u7CBE\u5B50\u7684 DNA \u65AD\u88C2\u6BD4\u672A\u5904\u7406\u5BF9\u7167\u589E\u52A0\uFF0C\u4F46\u8FDC\u4F4E\u4E8E H\u2082O\u2082 \u9633\u6027\u5BF9\u7167\uFF1BICSI \u4E4B\u540E\uFF0C\u80DA\u80CE\u5230\u8FBE 4 \u7EC6\u80DE\u671F\u7684\u6BD4\u4F8B\u4E3A 24%\uFF08\u5BF9\u7167 67%\uFF09\uFF0C\u672A\u80FD\u5F62\u6210\u56CA\u80DA\u3002\u4E5F\u5C31\u662F\u8BF4\uFF0C\u8FD9\u4E2A\u201C\u628A\u624B\u201D\u786E\u5B9E\u80FD\u7528\uFF0C\u4F46", React.createElement(Hl, null, "\u76EE\u524D\u8FD8\u505A\u4E0D\u5230\u5BF9\u53D1\u80B2\u65E0\u5BB3"), "\u3002"), React.createElement("p", null, "\u8FD9\u4F9D\u7136\u91CD\u8981\uFF1A\u5728\u4F53\u5916\u53EF\u9006\u5730\u6253\u5F00\u4E0E\u5173\u95ED\u7CBE\u5B50\u67D3\u8272\u8D28\uFF0C\u6B63\u662F\u7F16\u8F91\u7CBE\u5B50\u8868\u89C2\u57FA\u56E0\u7EC4\u3001\u5E76\u8FFD\u95EE\u5B83\u7A76\u7ADF\u5BF9\u53D1\u80B2\u8D21\u732E\u4E86\u4EC0\u4E48\u7684\u524D\u63D0\uFF1B\u800C\u8FD9\u6B21\u5B9E\u9A8C\u4E5F\u7CBE\u786E\u6807\u51FA\u4E86\u73B0\u6709\u65B9\u6848\u5728\u54EA\u4E00\u6B65\u635F\u4F24\u4E86\u80DA\u80CE\uFF0C\u4E0B\u4E00\u6B21\u8FED\u4EE3\u5C31\u4ECE\u8FD9\u91CC\u5F00\u59CB\u3002"))
      },
      {
        y: "2022",
        h: "来自 Paracoccus sp. 43P 的 IclR 家族转录因子 LgnR 的结构解析",
        orig: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析",
        p: React.createElement(React.Fragment, null, "\u5B66\u58EB\u5B66\u4F4D\u8BBA\u6587 \xB7 ", React.createElement(Lnk, { to: LINKS.nodai }, "\u4E1C\u4EAC\u519C\u4E1A\u5927\u5B66"), "\u751F\u547D\u79D1\u5B66\u90E8 \xB7 \u673A\u80FD\u6027\u5206\u5B50\u89E3\u6790\u5B66\u7814\u7A76\u5BA4\uFF08\u77E2\u5D8B\u4FCA\u4ECB \u6559\u6388\uFF09"),
        body: React.createElement(React.Fragment, null, React.createElement("p", null, "L-\u8461\u8404\u7CD6\u662F\u6240\u6709\u751F\u547D\u8D56\u4EE5\u8FD0\u8F6C\u7684 D-\u8461\u8404\u7CD6\u7684\u955C\u50CF\u3002\u5B83\u5728\u81EA\u7136\u754C\u4E2D\u5E76\u4E0D\u5B58\u5728\uFF0C\u5DF1\u7CD6\u6FC0\u9176\u4E5F\u65E0\u6CD5\u5C06\u5176\u78F7\u9178\u5316\uFF0C\u56E0\u6B64\u5BF9\u51E0\u4E4E\u6240\u6709\u751F\u7269\u6765\u8BF4\u5B83\u90FD\u4E0D\u662F\u98DF\u7269\u3002\u4F46\u4ECE\u571F\u58E4\u4E2D\u5206\u79BB\u51FA\u7684 Paracoccus sp. 43P \u5374\u80FD\u4EE3\u8C22\u5B83\uFF0C\u9760\u7684\u662F\u4E00\u6761\u4E13\u95E8\u7684\u4EE3\u8C22\u9014\u5F84\uFF0C\u7531 IclR \u5BB6\u65CF\u7684\u8F6C\u5F55\u56E0\u5B50 LgnR \u8C03\u63A7\u3002\u4E00\u4E2A\u751F\u7269\u5982\u4F55\u4E3A\u81EA\u5DF1\u4ECE\u672A\u9047\u89C1\u8FC7\u7684\u7CD6\u6F14\u5316\u51FA\u8C03\u63A7\u673A\u5236\uFF0C\u81F3\u4ECA\u6CA1\u6709\u7B54\u6848\uFF1BLgnR \u5728\u539F\u5B50\u5C42\u9762\u5982\u4F55\u611F\u77E5\u8FD9\u6761\u9014\u5F84\u7684\u72B6\u6001\u5E76\u5BF9\u5176\u5F00\u5173\uFF0C\u4E5F\u8FD8\u6CA1\u6709\u88AB\u63CF\u8FF0\u8FC7\u3002"), React.createElement("p", null, "\u6211\u5728\u5927\u80A0\u6746\u83CC\u4E2D\u514B\u9686\u5E76\u8868\u8FBE LgnR\uFF0C\u7ECF Ni \u4EB2\u548C\u5C42\u6790\u7EAF\u5316\uFF0C\u7528 SDS-PAGE \u786E\u8BA4\u4EA7\u7269\uFF0C\u518D\u900F\u6790\u3001\u6D53\u7F29\uFF0C\u5E76\u8FDB\u884C\u7ED3\u6676\u6761\u4EF6\u7B5B\u9009\uFF0C\u76EE\u6807\u662F\u89E3\u51FA\u5176\u4E09\u7EF4\u7ED3\u6784\u3002\u6700\u7EC8", React.createElement(Hl, null, "\u6210\u529F\u8868\u8FBE\u5E76\u7EAF\u5316\u51FA\u53EF\u7528\u4E8E\u7ED3\u6676\u5B66\u7814\u7A76\u7684\u91CD\u7EC4 LgnR"), "\uFF0C\u5E76\u5B8C\u6210\u4E86\u7ED3\u6676\u6761\u4EF6\u7684\u7B5B\u9009\u4E0E\u8BC4\u4F30\u3002"), React.createElement("p", null, "LgnR \u7684\u7ED3\u6784\u5C06\u5C55\u793A\u4E00\u4E2A\u8C03\u63A7\u56E0\u5B50\u5982\u4F55\u9002\u5E94\u6F14\u5316\u4ECE\u672A\u7ED9\u8FC7\u5B83\u7684\u5E95\u7269\uFF0C\u8FD9\u65E2\u5173\u7CFB\u5230\u65B0\u4EE3\u8C22\u80FD\u529B\u7684\u8D77\u6E90\uFF0C\u4E5F\u5173\u7CFB\u5230\u4E3A\u73AF\u5883\u4FEE\u590D\u800C\u6539\u9020\u7EC6\u83CC\u3002\u8FD9\u4E2A\u8BFE\u9898\u4E5F\u662F", React.createElement(Hl, null, "\u6211\u7B2C\u4E00\u6B21\u8DD1 AlphaFold2 \u548C RoseTTAFold"), " \u7684\u5730\u65B9\uFF0C\u6211\u5DE5\u4F5C\u4E2D\u7684\u8BA1\u7B97\u8FD9\u4E00\u534A\u5C31\u662F\u4ECE\u8FD9\u91CC\u5F00\u59CB\u7684\u3002"))
      }],

      fundingTitle: "经费与奖学金",
      fundingNote: "这里列出我写过的每一份申请，成功的和失败的都在。研究是靠中的那些和没中的那些一起推着往前走的。",
      grantCols: ["年度", "项目", "课题", "结果"],
      grants: {
        springgx: { year: "2024 至今", program: "JST SPRING-GX", title: React.createElement(React.Fragment, null, "\u6B21\u4E16\u4EE3\u7814\u7A76\u8005\u6311\u6218\u6027\u7814\u7A76\u9879\u76EE \xB7 ", React.createElement(Lnk, { to: LINKS.springGX }, "\u7EFF\u8272\u8F6C\u578B\u9AD8\u7EA7\u4EBA\u624D\u57F9\u517B\u8BA1\u5212"), "\uFF0C\u4E1C\u4EAC\u5927\u5B66\u3002"), status: "获资助" },
        dc2_2027: { year: "令和9年度（2027年度）", program: "日本学术振兴会 DC2", title: "大規模解析と機械学習による精密な脂質種認識機構の解明（用大规模解析与机器学习阐明精密的脂质种识别机制）。", status: "审查中" },
        spread_2026: { year: "2026", program: "JST SPReAD 第 1 回", title: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.spread }, "AI for Science \u840C\u82BD\u7684\u6311\u6226\u7814\u7A76\u5275\u51FA\u4E8B\u696D\uFF08SPReAD: Supporting Pioneering Research through AI for 1,000 Discovery challenges\uFF09"), "\uFF0C\u96B6\u5C5E\u6587\u90E8\u79D1\u5B66\u7701\u300CAI for Science \u306B\u3088\u308B\u79D1\u5B66\u7814\u7A76\u9769\u65B0\u30D7\u30ED\u30B0\u30E9\u30E0\u300D\u3002\u8BFE\u9898\uFF1A\u7528\u5E8F\u5217-\u7ED3\u6784\u7EDF\u5408 AI \u9884\u6D4B\u8102\u8D28\u7ED3\u5408\u7ED3\u6784\u57DF\u7684\u7ED3\u5408\u7279\u5F02\u6027\u5E76\u62BD\u53D6\u8BC6\u522B\u89C4\u5219\u3002"), status: "通过审查 · 抽签未中" },
        dc2_2026: { year: "令和8年度（2026年度）", program: "日本学术振兴会 DC2", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析（用大规模测定与机器学习解析蛋白质寿命决定因子）。", status: "未获资助" },
        dc1_2025: { year: "令和7年度（2025年度）", program: "日本学术振兴会 DC1", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析（用大规模测定与机器学习解析蛋白质寿命决定因子）。", status: "未获资助" },
        dc1_2024: { year: "令和6年度（2024年度）", program: "日本学术振兴会 DC1", title: "精子エピゲノムの意義を精子体外再構成法で解明する研究（以精子体外再构成法阐明精子表观基因组的意义）。", status: "未获资助" }
      },
      awardsTitle: "奖励 & 活动",
      awards: [
      { y: "2024.03", h: React.createElement(React.Fragment, null, React.createElement(Hl, null, "\u4F18\u79C0\u6BD5\u4E1A\u751F\u5956"), " \xB7 \u5E7F\u57DF\u79D1\u5B66\u4E13\u653B\u5956\u52B1\u5956"), p: "东京大学综合文化研究科，令和 5 年度（2023 年度）。" },
      { y: "2023.08", h: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.nanolsiSchool }, "Bio-SPM \u590F\u5B63\u5B66\u6821"), "\uFF08", React.createElement(Lnk, { to: LINKS.nanolsi }, "\u91D1\u6CFD\u5927\u5B66 NanoLSI"), "\uFF09\uFF0C\u5171\u540C\u7814\u7A76\u91C7\u62E9"), p: "金泽大学第 11 回 Bio-SPM 夏季学校。高速原子力显微镜对体外重组复合物的动态观察。" }]

    },
    hobbies: {
      eyebrow: "生活",
      title: "对一切与移液器无关的事情都好奇。",
      items: [
      ["山", "登山露营", "上高地、尾濑、立山黑部，走得越慢越好。"],
      ["影", "摄影", "胶片相机，飞驰的列车，偶尔陌生人的笑容。"],
      ["猫", "猫", "最小、最安静的合作者。"],
      ["旅", "旅行", "长途列车、小巷子，一本之后再查的笔记。"]]

    },
    news: {
      eyebrow: "近况",
      title: "最近发生了什么。",
      items: [
      { when: "2026 · 10", h: "RosettaCon Asia 2026 海报报告", p: React.createElement(React.Fragment, null, "\u5C06\u5728 ", React.createElement(Lnk, { to: LINKS.rosettaAsia }, "RosettaCon Asia"), " \u4E0A\u505A\u6D77\u62A5\u62A5\u544A\uFF0C\u5185\u5BB9\u662F", React.createElement(Hl, null, "\u78F7\u8102\u7ED3\u5408\u86CB\u767D\u7684\u4ECE\u5934\u8BBE\u8BA1"), "\u300210 \u6708 10 \u81F3 11 \u65E5\uFF0C\u5317\u4EAC\u5927\u5B66\u3002") },
      { when: "2026 · 08", h: "第一作者论文发表", p: React.createElement(React.Fragment, null, "\u8BBA\u6587\u5DF2\u5728 ", React.createElement(Lnk, { to: LINKS.paper }, "Biochemistry (ACS)"), " \u4E0A\u7EBF\uFF0C\u6536\u5165\u4E13\u520A \u201CLipids and Lipidation\u201D\uFF1A\u901A\u8FC7\u4F18\u5316\u7684\u8102\u8D28\u4F53\u751F\u7269\u5C42\u5E72\u6D89\u6CD5\u5B9A\u91CF\u5206\u6790\u86CB\u767D\u8D28\u5BF9\u78F7\u8102\u9170\u808C\u9187\u7684\u7ED3\u5408\u52A8\u529B\u5B66\u3002") },
      { when: "2026 · 05", h: "提交学振 DC2 申请", p: "以脂质种识别机制为题申请令和 9 年度（2027 年度） DC2，目前审查中。" },
      { when: "2026 · 04", h: "BLI 论文投稿", p: React.createElement(React.Fragment, null, "4 \u6708 20 \u65E5\u6295\u7A3F\u81F3 ", React.createElement(Lnk, { to: LINKS.acsBiochem }, "Biochemistry (ACS)"), "\uFF0C\u4E09\u4E2A\u6708\u540E\u88AB\u63A5\u6536\u3002") },
      { when: "2025 · 01", h: "IPR 国际会议 2025", p: "在淡路岛发表蛋白质对磷脂结合的研究。" },
      { when: "2024 · 10", h: "博士入学", p: "正式进入东京大学工学系研究科化学生命工学专攻博士课程。" },
      { when: "2024 · 04", h: "加入坪山研究室", p: React.createElement(React.Fragment, null, "\u5728", React.createElement(Lnk, { to: LINKS.iis }, "\u751F\u4EA7\u6280\u672F\u7814\u7A76\u6240"), "\u751F\u4F53\u5206\u5B50\u8BBE\u8BA1\u5DE5\u5B66\u7814\u7A76\u5BA4\u5F00\u59CB\u7814\u7A76\u3002") }]

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
        excerpt: "一篇关于 Biotite 的备忘：序列、三维结构、数据库查询、外部软件封装，都收在同一个 Python 包、同一套 API 里，让一个小分析脚本不必以两百行解析代码开头。"
      },
      {
        date: "2026 · 08 · 17",
        href: "posts/py2dmol.html",
        title: "不打开 PyMOL 也能出蛋白质配图",
        excerpt: "py2Dmol 在一个浏览器标签页里把 PDB ID 变成能直接用的图：背景透明，配体也画得出来，还有好几种风格。一篇很短的工具笔记，以及它为什么一直躺在我的书签里。"
      },
      {
        date: "2026 · 08 · 17",
        href: "posts/bli-liposome.html",
        title: "实时读出蛋白质与脂质的结合",
        excerpt: "几乎所有蛋白质–脂质实验回答的都是「结合有多紧」，很少有人回答「结合得多快、停留多久」。一篇方法笔记：如何把脂质体 BLI 做成定量的动力学实验，非特异信号究竟从哪里来，以及在相信这些数字之前我会先检查什么。"
      }],

      empty: "第一批文章正在写。很快回来看看。"
    },
    contact: {
      eyebrow: "联系",
      headline: React.createElement(React.Fragment, null, "\u6765 ", React.createElement("em", null, "\u804A\u804A\u79D1\u5B66\u3002")),
      sub: "科研合作、AI for Science、脂质生物物理，或只是在驹场喝杯咖啡。我的邮箱永远开着。",
      seekingLabel: "在找",
      seeking: React.createElement(React.Fragment, null, "2027 \u5E74\u672B\u6216 2028 \u5E74\u5F00\u59CB\u7684\u535A\u58EB\u540E\u804C\u4F4D\u3002\u6211\u540C\u65F6\u5177\u5907", React.createElement(Hl, null, "\u5E72\u6E7F\u4E24\u7AEF\u7684\u7ECF\u9A8C"), "\uFF1A\u4ECE\u86CB\u767D\u8D28\u8BBE\u8BA1\u3001\u6587\u5E93\u6784\u5EFA\u3001\u9AD8\u901A\u91CF\u5B9E\u9A8C\uFF0C\u5230 NGS \u6570\u636E\u5904\u7406\u4E0E\u5206\u6790\uFF0C\u518D\u5230\u540E\u7EED\u7684\u7ED3\u5408\u52A8\u529B\u5B66\u6D4B\u5B9A\uFF0C\u6574\u6761\u94FE\u8DEF\u6211\u90FD\u80FD\u81EA\u5DF1\u8DD1\u901A\u3002\u63A5\u4E0B\u6765\u6211\u60F3\u505A\u7684\u662F", React.createElement(Hl, null, "\u628A\u4EBA\u5DE5\u8BBE\u8BA1\u7684\u86CB\u767D\u653E\u8FDB\u771F\u5B9E\u7684\u7EC6\u80DE\u73AF\u5883\u91CC\u5DE5\u4F5C"), "\uFF0C\u56E0\u6B64\u5BF9\u7EC6\u80DE\u7F16\u7A0B\u3001\u57FA\u56E0\u7EBF\u8DEF\u4E0E\u86CB\u767D\u8D28\u5DE5\u7A0B\u8FD9\u4E9B\u65B9\u5411\u5F88\u611F\u5174\u8DA3\u3002"),
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
        office: "办公室"
      }
    }
  },

  ja: {
    nav: { about: "自己紹介", research: "研究", pubs: "業績", edu: "経歴", hobbies: "オフ", news: "近況", blog: "ブログ", collect: "コレクション", contact: "連絡" },
    hero: {
      meta: ["東京大学生産技術研究所", "坪山研究室", "博士課程"],
      typer: ["protein.design()", "lipid_binding.predict()", "ai_for_biology.run()", "screen_HTS.analyze()"],
      desc: "AI タンパク質設計と生物物理学の交差点で研究しています。タンパク質が細胞内のさまざまな膜のアイデンティティを定めるリン脂質シグネチャをどう認識するかを探り、AI 設計と大規模スクリーニングによって、進化が一度も生み出さなかった高特異的なリン脂質プローブをつくっています。",
      cta1: "研究を読む", cta2: "連絡する"
    },
    about: {
      eyebrow: "自己紹介",
      title: "東京で十年、都市と言語と分野の間を歩く研究者。",
      p1: "姚品碩と申します。十年前、十七歳の春にハルビンを離れ、東京で日本語をゼロから学び始めました。東京農業大学で生物学と出会ってからは、分子を追いかけるのをやめていません。",
      p2: React.createElement(React.Fragment, null, "\u73FE\u5728\u306F", React.createElement(Lnk, { to: LINKS.iis }, "\u6771\u4EAC\u5927\u5B66\u751F\u7523\u6280\u8853\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4"), "\u306E\u535A\u58EB\u8AB2\u7A0B\u306B\u5728\u7C4D\u3057\u3066\u3044\u307E\u3059\u3002\u9053\u5177\u306F\u9175\u6BCD\u30C7\u30A3\u30B9\u30D7\u30EC\u30A4\u3001\u6A5F\u68B0\u5B66\u7FD2\u3001BLI \u30BB\u30F3\u30B5\u30FC\u3002\u554F\u3044\u306F\uFF1A\u30BF\u30F3\u30D1\u30AF\u8CEA\u306F\u3069\u3046\u3084\u3063\u3066\u611B\u3059\u308B\u8102\u8CEA\u3092\u898B\u5206\u3051\u308B\u306E\u304B\u3001\u30B3\u30F3\u30D4\u30E5\u30FC\u30BF\u306B\u305D\u308C\u3092\u30BC\u30ED\u304B\u3089\u8A2D\u8A08\u3055\u305B\u3089\u308C\u308B\u306E\u304B\u3002"),
      p3: React.createElement(React.Fragment, null, "\u6BCD\u8A9E\u306F", React.createElement(Hl, null, "\u4E2D\u56FD\u8A9E"), "\u3067\u3001", React.createElement(Hl, null, "\u82F1\u8A9E"), "\u3068", React.createElement(Hl, null, "\u65E5\u672C\u8A9E"), "\u3067\u3082\u7814\u7A76\u306E\u8B70\u8AD6\u304C\u3067\u304D\u307E\u3059\u3002\u3053\u306E\u4E09\u8A00\u8A9E\u306E\u3044\u305A\u308C\u3067\u3082\u304A\u6C17\u8EFD\u306B\u3054\u9023\u7D61\u304F\u3060\u3055\u3044\u3002\u30E9\u30DC\u306E\u5916\u3067\u306F\u3001\u5C71\u9053\u304B\u3001\u30D5\u30A3\u30EB\u30E0\u30AB\u30E1\u30E9\u306E\u5F8C\u308D\u304B\u3001\u6B21\u306E\u9759\u304B\u306A\u65C5\u306E\u8A08\u753B\u306E\u4E2D\u306B\u3044\u307E\u3059\u3002")
    },
    glossary: {
      ICSI: "卵細胞質内精子注入法。顕微操作により精子を 1 個だけ卵子内へ直接注入する、自然受精を介さない受精技術。",
      BLI: "バイオレイヤー干渉法。センサー先端の光干渉のシフトから結合をリアルタイムで読み取る、標識不要の光学バイオセンサー。",
      PIPs: "ホスホイノシチド。ホスファチジルイノシトールの 8 種のリン酸化誘導体。リン酸基の組み合わせが各膜コンパートメントを標識する。"
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
        summary: React.createElement(React.Fragment, null, "\u30DB\u30B9\u30DB\u30A4\u30CE\u30B7\u30C1\u30C9\uFF08", React.createElement(Term, { k: "PIPs", lang: "ja" }, "PIPs"), "\uFF09\u306F\u3001\u5185\u819C\u7CFB\u306E\u305D\u308C\u305E\u308C\u306E\u30B3\u30F3\u30D1\u30FC\u30C8\u30E1\u30F3\u30C8\u3092\u6A19\u8B58\u3059\u308B 8 \u7A2E\u985E\u306E\u30EA\u30F3\u9178\u5316\u8102\u8CEA\u3067\u3042\u308B\uFF1API(4,5)P\u2082 \u306F\u7D30\u80DE\u819C\u3001PI(3)P \u306F\u521D\u671F\u30A8\u30F3\u30C9\u30BD\u30FC\u30E0\u3001PI(3,5)P\u2082 \u306F\u5F8C\u671F\u30A8\u30F3\u30C9\u30BD\u30FC\u30E0\u306A\u3069\u3002\u8102\u8CEA\u7D50\u5408\u30C9\u30E1\u30A4\u30F3\uFF08PH\u3001PX\u3001ENTH\u3001GRAM\u3001GLUE\u3001C2 \u2026\uFF09\u306F\u3053\u306E\u6975\u3081\u3066\u5C0F\u3055\u306A\u30EA\u30F3\u9178\u57FA\u306E\u5DEE\u7570\u3092\u8AAD\u307F\u53D6\u308A\u3001\u30B7\u30B0\u30CA\u30EB\u4F1D\u9054\u3001\u819C\u8F38\u9001\u3001\u7D30\u80DE\u9AA8\u683C\u52D5\u614B\u3092\u5236\u5FA1\u3059\u308B\uFF1B\u305F\u3063\u305F\u4E00\u3064\u306E\u8A8D\u8B58\u30DF\u30B9\u304C", React.createElement(Lnk, { to: LINKS.akt1 }, "\u75BE\u60A3\u306E\u5F15\u304D\u91D1\u3068\u306A\u308B"), "\u3002", React.createElement(Lnk, { to: LINKS.akt1 }, "AKT1 PH \u306E E17K \u5909\u7570"), "\u304C\u305D\u306E\u4E00\u4F8B\u3067\u3042\u308B\u3002\u305D\u308C\u306B\u3082\u304B\u304B\u308F\u3089\u305A\u3001", React.createElement(Lnk, { to: LINKS.pipCase1 }, "\u6570\u5341\u5E74"), "\u306B\u308F\u305F\u308B", React.createElement(Lnk, { to: LINKS.pipCase2 }, "\u500B\u5225\u4E8B\u4F8B\u306E\u84C4\u7A4D"), "\u3092\u7D4C\u3066\u306A\u304A\u3001\u7279\u5B9A\u306E\u30C9\u30E1\u30A4\u30F3\u304C\u3069\u306E\u3088\u3046\u306B\u3057\u3066 8 \u7A2E\u985E\u306E PIPs \u3092\u533A\u5225\u3059\u308B\u306E\u304B\u3068\u3044\u3046\u4E00\u822C\u5247\u306F\u898B\u3048\u3066\u3044\u306A\u3044\u3002", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4"), "\u3067\u3001\u79C1\u306F\u6570\u5343\u306E\u30C9\u30E1\u30A4\u30F3\u3068\u8102\u8CEA\u7A2E\u306B\u307E\u305F\u304C\u308B\u6BD4\u8F03\u53EF\u80FD\u306A", React.createElement(Lnk, { to: LINKS.clib }, "\u5927\u898F\u6A21\u7D50\u5408\u30C7\u30FC\u30BF\u30BB\u30C3\u30C8"), "\u3092\u69CB\u7BC9\u3057\u3001\u305D\u3053\u304B\u3089\u8A8D\u8B58\u898F\u5247\u3092\u5B66\u7FD2\u3055\u305B\u3088\u3046\u3068\u3057\u305F\u3002"),
        outcome: "酵母ディスプレイに基づく大規模スクリーニング法により、2 万を超える天然の脂質結合ドメインと 13 種の脂質との結合マップ、計 26 万件以上のデータを取得し、深層学習によって結合特異性と強度を導出・理解・予測し、最終的には設計することを目指した。しかしデータ品質の制約により、この方針は失敗に終わった。そこから得られたのは、酵母ディスプレイ法が適用できる範囲の把握と、データ品質がどれほど決定的かという教訓である。"
      },
      {
        n: "02",
        status: "done",
        title: "タンパク質とリン脂質結合動態のための最適化 BLI",
        tags: ["BLI", "速度論", "リポソーム"],
        summary: React.createElement(React.Fragment, null, "\u307B\u3068\u3093\u3069\u306E\u30BF\u30F3\u30D1\u30AF\u8CEA-\u8102\u8CEA\u30A2\u30C3\u30BB\u30A4\u306F\u5E73\u8861\u7D50\u5408\u5F37\u5EA6\u3057\u304B\u5831\u544A\u3057\u306A\u3044\uFF1A\u3088\u308A\u5F37\u3044\u89AA\u548C\u6027\u304C\u3001\u3088\u308A\u901F\u3044 ", KON, " \u304B\u3089\u6765\u308B\u306E\u304B\u3001\u3088\u308A\u9045\u3044 ", KOFF, " \u304B\u3089\u6765\u308B\u306E\u304B\u3092\u533A\u5225\u3067\u304D\u306A\u3044\u3002\u3057\u304B\u3057\u3053\u306E\u4E8C\u3064\u306F\u751F\u7269\u5B66\u7684\u306B\u307E\u3063\u305F\u304F\u7570\u306A\u308B\u5E30\u7D50\u3092\u3082\u3064\u3002\u30D0\u30A4\u30AA\u30EC\u30A4\u30E4\u30FC\u5E72\u6E09\u6CD5\uFF08", React.createElement(Term, { k: "BLI", lang: "ja" }, "BLI"), "\uFF09\u306F\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u306E\u52D5\u614B\u3092\u89E3\u50CF\u3067\u304D\u308B\u304C\u3001\u8102\u8CEA\u8868\u9762\u3067\u306F\u975E\u7279\u7570\u7684\u5438\u7740\u304C\u5927\u304D\u306A\u969C\u5BB3\u3068\u306A\u308B\u3002\u7CFB\u7D71\u7684\u306A\u7DE9\u885D\u6DB2\u6700\u9069\u5316\uFF080.5% BSA\u30010.001% Tween-20\uFF09\u306B\u3088\u3063\u3066\u80CC\u666F\u7D50\u5408\u3092\u6291\u3048\u3001\u30EA\u30DD\u30BD\u30FC\u30E0\u306E\u5B8C\u5168\u6027\u3092\u4FDD\u3063\u305F\u307E\u307E\u3001\u4EE3\u8868\u7684\u306A PX\u30FBPH \u30C9\u30E1\u30A4\u30F3\u3068\u305D\u306E\u5909\u7570\u4F53\u7CFB\u5217\u306B\u3064\u3044\u3066 ", KON, "\u30FB", KOFF, "\u30FB", KD, " \u3092\u53D6\u5F97\u3057\u305F\u3002\u672C\u30D7\u30E9\u30C3\u30C8\u30D5\u30A9\u30FC\u30E0\u306F\u52D5\u614B\u30E1\u30AB\u30CB\u30BA\u30E0\u3092\u533A\u5225\u3059\u308B\uFF1AAKT1 PH \u7CFB\u5217\u3067\u306F\u89AA\u548C\u6027\u5411\u4E0A\u304C\u4E3B\u306B ", KOFF, " \u306E\u9045\u3055\u304B\u3089\u3001SnxA PX \u7CFB\u5217\u3067\u306F ", KON, " \u306E\u901F\u3055\u304B\u3089\u6765\u3066\u3044\u308B\u3002\u5E73\u8861\u7D50\u5408\u6E2C\u5B9A\u3060\u3051\u3067\u306F\u5206\u304B\u3089\u306A\u3044\u60C5\u5831\u3067\u3042\u308B\u3002"),
        paperLabel: "Biochemistry (ACS), 2026 に掲載",
        figure: { src: "assets/toc.png", alt: "最適化したリポソームベース BLI の模式図と、kon 駆動・koff 駆動のセンサーグラム。", caption: "最適化したアッセイと、結合が強くなる二つの速度論的な経路。論文の目次図より。" }
      },
      {
        n: "03",
        status: "active",
        title: "リン脂質結合タンパク質の de novo 設計",
        tags: ["de novo 設計", "拡散モデル", "膜"],
        summary: "特定の PIP だけに結合するタンパク質を設計することは、低分子結合タンパク質設計の中でも最難関の部類に入る。困難が三つ同時に存在するからである。PIPs 8 種は互いに極めて類似しており、違いはイノシトール環のどの水酸基がリン酸化されているかだけ。その頭部は強い負電荷を持つため、正電荷のポケットは酸性のものを見境なく捕まえてしまう。特異性は静電相互作用ではなく、高度に精密な水素結合ネットワークから来なければならない。さらに標的は膜表面に存在するため、膜挿入と、二重層に対する結合ポケットの方向性という問題も同時に解く必要がある。現在も取り組み中。続報をお待ちください。"
      }],

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
        masif: "分子表面上の幾何学的深層学習。結合部位を示す相互作用フィンガープリントを学習する。"
      },
      organismsTitle: "モデル生物",
      organisms: [
      ["E. coli", "クローニングと組換えタンパク質発現の主力となる細菌。"],
      ["S. cerevisiae", "出芽酵母。表面ディスプレイライブラリの宿主であり、最も単純な真核生物の膜システムでもある。"],
      ["マウス", "修士課程での精子クロマチンと初期発生の研究に用いた哺乳類モデル。"]],

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
      ["HTS", "ハイスループットスクリーニング：ライブラリ構築、プール選択、シーケンシングと、それらをつなぐ解析パイプライン。"]],

      projLabel: "PROJ"
    },
    edu: {
      eyebrow: "経歴",
      title: "ハルビンから東京へ、都市と分野が綴る道。",
      items: [
      { date: "2024.10–現在", current: true, h: "博士課程 · 化学生命工学", inst: React.createElement(React.Fragment, null, "\u6771\u4EAC\u5927\u5B66 ", React.createElement(Lnk, { to: LINKS.iis }, "\u751F\u7523\u6280\u8853\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4")), detail: "坪山幸太郎講師のもと、AI 支援タンパク質設計。JST SPRING-GX 支援。2027 年 9 月修了予定。" },
      { date: "2024.04–2024.09", h: "研究生", inst: React.createElement(React.Fragment, null, "\u6771\u4EAC\u5927\u5B66 ", React.createElement(Lnk, { to: LINKS.iis }, "\u751F\u7523\u6280\u8853\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.tsuboyama }, "\u576A\u5C71\u7814\u7A76\u5BA4")), detail: "ラボに参加、脂質結合スクリーニングを開始。" },
      { date: "2022–2024", h: "修士 · 生命科学", inst: React.createElement(React.Fragment, null, "\u6771\u4EAC\u5927\u5B66 ", React.createElement(Lnk, { to: LINKS.iqb }, "\u5B9A\u91CF\u751F\u547D\u79D1\u5B66\u7814\u7A76\u6240"), " \xB7 ", React.createElement(Lnk, { to: LINKS.okada }, "\u5CA1\u7530\u7814\u7A76\u5BA4\uFF08\u75C5\u614B\u767A\u751F\u5236\u5FA1\u7814\u7A76\u5206\u91CE\uFF09")), detail: React.createElement(React.Fragment, null, "\u6307\u5C0E\u6559\u54E1\uFF1A\u5CA1\u7530\u7531\u7D00 \u6559\u6388\u3002\u7CBE\u5B50\u30AF\u30ED\u30DE\u30C1\u30F3\u306E\u53EF\u9006\u7684\u306A\u8131\u51DD\u7E2E\u3068\u518D\u51DD\u7E2E\u306E\u624B\u6CD5\u3092\u78BA\u7ACB\u3057\u3001\u51E6\u7406\u5F8C\u306E\u7CBE\u5B50\u3092 ", React.createElement(Term, { k: "ICSI", lang: "ja" }, "ICSI"), " \u3067\u8A55\u4FA1\u3002\u540C\u6642\u671F\u306B\u5B9A\u91CF\u751F\u547D\u79D1\u5B66\u7814\u7A76\u6240\u306E\u6280\u8853\u88DC\u4F50\u54E1\uFF082022\u20132024\uFF09\u3002", React.createElement(Hl, null, "\u512A\u79C0\u4FEE\u4E86\u751F\u8868\u5F70"), "\u3002") },
      { date: "2018–2022", h: "学士 · 生物科学", inst: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.nodai }, "\u6771\u4EAC\u8FB2\u696D\u5927\u5B66"), " \xB7 \u6A5F\u80FD\u6027\u5206\u5B50\u89E3\u6790\u5B66\u7814\u7A76\u5BA4\uFF08\u77E2\u5D8B\u7814\u7A76\u5BA4\uFF09"), detail: "指導教員：矢嶋俊介 教授。IclR ファミリー転写因子の構造生物学；ラボ内で AlphaFold2 / RoseTTAFold をいち早く導入。" },
      { date: "2016–2018", h: "日本語課程", inst: "富士国際語学院、東京", detail: "17 歳で来日。三つ目の言語をゼロから。" },
      { date: "2010–2017", h: "基礎教育", inst: "ハルビン第三中学校（群力）、光華中学校", detail: "中国東北。好奇心の出発点。" }]

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
      { date: "2022.11", type: "Poster", no: "P-25", title: "二価陽イオンの精子クロマチン構造への影響解析", venue: "新学術・学術変革領域合同「若手の会 2022」、大阪りんくう" }],

      papersTitle: "査読付き論文",
      papers: [
      {
        date: "2026", status: "掲載",
        title: "最適化したリポソームベース・バイオレイヤー干渉法によるタンパク質とホスホイノシチドの結合動態の定量解析",
        authors: "Yao P., Nishimura T.*, Tsuboyama K.*",
        venue: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.acsBiochem }, "Biochemistry"), " (ACS) 65 (16)\u30012557\u20132565\u3001\u7279\u96C6\u53F7 \u201CLipids and Lipidation\u201D \xB7 ", React.createElement(Lnk, { to: LINKS.paper }, "doi.org/10.1021/acs.biochem.6c00344")),
        note: "2026 年 4 月 20 日投稿 · 7 月 23 日受理。筆頭著者。"
      }],

      papersEmpty: "他の筆頭著者論文を準備中。お楽しみに。",
      thesesTitle: "学位論文",
      theses: [
      {
        y: "2024",
        h: "二価陽イオンを用いた精子クロマチンの体外改変方法の確立",
        orig: "Establishment of an Ex Vivo Sperm Chromatin Manipulation Method via Divalent Cations",
        p: React.createElement(React.Fragment, null, "\u4FEE\u58EB\u5B66\u4F4D\u8AD6\u6587 \xB7 \u6771\u4EAC\u5927\u5B66\u5927\u5B66\u9662\u7DCF\u5408\u6587\u5316\u7814\u7A76\u79D1 \u5E83\u57DF\u79D1\u5B66\u5C02\u653B \xB7 ", React.createElement(Lnk, { to: LINKS.okada }, "\u5CA1\u7530\u7814\u7A76\u5BA4"), "\u3001", React.createElement(Lnk, { to: LINKS.iqb }, "\u5B9A\u91CF\u751F\u547D\u79D1\u5B66\u7814\u7A76\u6240")),
        body: React.createElement(React.Fragment, null, React.createElement("p", null, "\u7CBE\u5B50\u306F\u7236\u65B9\u30B2\u30CE\u30E0\u3092\u6975\u5EA6\u306B\u51DD\u7E2E\u3057\u305F\u6838\u306B\u53CE\u3081\u3066\u3044\u308B\u3002\u7CBE\u5B50\u5F62\u6210\u306E\u5F8C\u671F\u306B\u30D2\u30B9\u30C8\u30F3\u306E\u7D04 9 \u5272\u304C\u30D7\u30ED\u30BF\u30DF\u30F3\u306B\u7F6E\u63DB\u3055\u308C\u3001\u30DE\u30A6\u30B9\u7CBE\u5B50\u30AF\u30ED\u30DE\u30C1\u30F3\u306F\u4F53\u7D30\u80DE\u6838\u3068\u6BD4\u3079\u3066\u7D04 40 \u500D\u306B\u51DD\u7E2E\u3059\u308B\u3002\u7269\u7406\u7684\u523A\u6FC0\u3084\u9175\u7D20\u6D3B\u6027\u306B\u3088\u308B DNA \u640D\u50B7\u304B\u3089\u5B88\u308B\u305F\u3081\u306E\u5BC6\u5EA6\u3067\u3042\u308B\u3002\u3057\u304B\u3057\u305D\u306E\u5BC6\u5EA6\u3086\u3048\u306B\u3001\u4F53\u7D30\u80DE\u30AF\u30ED\u30DE\u30C1\u30F3\u5411\u3051\u306B\u958B\u767A\u3055\u308C\u305F\u624B\u6CD5\u306F\u7CBE\u5B50\u3067\u306F\u6A5F\u80FD\u3057\u306A\u3044\u3002\u4E8C\u4FA1\u967D\u30A4\u30AA\u30F3\u304C\u8A66\u9A13\u7BA1\u5185\u3067\u30DD\u30EA\u30A2\u30DF\u30F3-DNA \u8907\u5408\u4F53\u306E\u51DD\u7E2E\u30FB\u8131\u51DD\u7E2E\u3092\u5F15\u304D\u8D77\u3053\u3059\u3053\u3068\u306F\u5831\u544A\u3055\u308C\u3066\u3044\u305F\u304C\u3001\u30D7\u30ED\u30BF\u30DF\u30F3\u3067\u68B1\u5305\u3055\u308C\u305F\u7CBE\u5B50\u30AF\u30ED\u30DE\u30C1\u30F3\u306B\u52B9\u304F\u304B\u3069\u3046\u304B\u306F\u672A\u77E5\u3067\u3042\u3063\u305F\u3002"), React.createElement("p", null, "\u305D\u3053\u3067 Mg\xB2\u207A\u30FBCa\xB2\u207A\u30FBZn\xB2\u207A\u30FBMn\xB2\u207A \u306E\u30DE\u30A6\u30B9\u7CBE\u5B50\u3078\u306E\u4F5C\u7528\u3092\u7CFB\u7D71\u7684\u306B\u691C\u8A0E\u3057\u3001\u30D7\u30ED\u30BF\u30DF\u30F3\u3092\u9664\u53BB\u3059\u308B\u30CC\u30AF\u30EC\u30AA\u30D7\u30E9\u30B9\u30DF\u30F3\u51E6\u7406\u3068\u4F75\u7528\u3057\u305F\u3002\u6B21\u306B\u30AD\u30EC\u30FC\u30C8\u5264 EDTA\u30FBTPEN \u3067\u3069\u306E\u30A4\u30AA\u30F3\u304C\u52B9\u3044\u3066\u3044\u308B\u304B\u3092\u7279\u5B9A\u3057\u3001\u30B3\u30E1\u30C3\u30C8\u30A2\u30C3\u30BB\u30A4\u3067 DNA \u5B8C\u5168\u6027\u3092\u3001", React.createElement(Term, { k: "ICSI", lang: "ja" }, "ICSI"), " \u3067\u53D7\u7CBE\u30FB\u767A\u751F\u80FD\u3092\u8A55\u4FA1\u3057\u305F\u3002\u305D\u306E\u7D50\u679C\u3001Mg\xB2\u207A \u306F\u8131\u51DD\u7E2E\u3092\u4FC3\u9032\u3057\u3001Zn\xB2\u207A \u306F\u963B\u5BB3\u3057\u305F\u3002\u3044\u305A\u308C\u3082\u6FC3\u5EA6\u4F9D\u5B58\u7684\u3067\u3001TPEN \u306B\u3088\u308B\u30AD\u30EC\u30FC\u30C8\u304B\u3089 Zn \u7279\u7570\u7684\u306A\u52B9\u679C\u3067\u3042\u308B\u3053\u3068\u304C\u78BA\u8A8D\u3055\u308C\u305F\u3002500 mM ZnCl\u2082\u3001pH 1 \u306E\u6761\u4EF6\u3067\u306F\u3001\u8131\u51DD\u7E2E\u3057\u305F\u7CBE\u5B50\u30AF\u30ED\u30DE\u30C1\u30F3\u304C\u5143\u306E\u30B5\u30A4\u30BA\u3042\u308B\u3044\u306F\u305D\u308C\u4EE5\u4E0B\u306B\u307E\u3067\u518D\u51DD\u7E2E\u3057\u305F\u3002", React.createElement(Hl, null, "\u7CBE\u5B50\u30AF\u30ED\u30DE\u30C1\u30F3\u3092\u518D\u51DD\u7E2E\u3055\u305B\u305F\u521D\u3081\u3066\u306E\u5831\u544A"), "\u3067\u3042\u308B\u3002\u518D\u51DD\u7E2E\u7CBE\u5B50\u306E DNA \u65AD\u7247\u5316\u306F\u7121\u51E6\u7406\u5BFE\u7167\u3088\u308A\u5897\u52A0\u3057\u305F\u3082\u306E\u306E\u3001H\u2082O\u2082 \u51E6\u7406\u967D\u6027\u5BFE\u7167\u3088\u308A\u306F\u306F\u308B\u304B\u306B\u8EFD\u5EA6\u3067\u3042\u3063\u305F\u3002\u4E00\u65B9 ICSI \u5F8C\u306E 4 \u7D30\u80DE\u671F\u5230\u9054\u7387\u306F 24%\uFF08\u5BFE\u7167 67%\uFF09\u3001\u80DA\u76E4\u80DE\u5230\u9054\u7387\u306F 0% \u3067\u3042\u308A\u3001\u672C\u51E6\u7406\u306F", React.createElement(Hl, null, "\u767A\u751F\u306B\u5BFE\u3057\u3066\u307E\u3060\u4E2D\u7ACB\u3068\u306F\u3044\u3048\u306A\u3044"), "\u3002"), React.createElement("p", null, "\u305D\u308C\u3067\u3082\u610F\u7FA9\u306F\u5927\u304D\u3044\u3002\u7CBE\u5B50\u30AF\u30ED\u30DE\u30C1\u30F3\u3092\u4F53\u5916\u3067\u53EF\u9006\u7684\u306B\u958B\u9589\u3067\u304D\u308B\u3053\u3068\u306F\u3001\u7CBE\u5B50\u30A8\u30D4\u30B2\u30CE\u30E0\u3092\u7DE8\u96C6\u3057\u3001\u305D\u308C\u304C\u767A\u751F\u306B\u4F55\u3092\u5BC4\u4E0E\u3057\u3066\u3044\u308B\u306E\u304B\u3092\u554F\u3046\u305F\u3081\u306E\u524D\u63D0\u6761\u4EF6\u3060\u304B\u3089\u3067\u3042\u308B\u3002\u52A0\u3048\u3066\u672C\u7814\u7A76\u306F\u3001\u73FE\u884C\u30D7\u30ED\u30C8\u30B3\u30EB\u304C\u80DA\u3092\u3069\u306E\u6BB5\u968E\u3067\u640D\u306A\u3046\u306E\u304B\u3092\u660E\u78BA\u306B\u793A\u3057\u3066\u304A\u308A\u3001\u6B21\u306E\u6539\u826F\u306F\u305D\u3053\u304B\u3089\u59CB\u307E\u308B\u3002"))
      },
      {
        y: "2022",
        h: "Paracoccus sp. 43P 由来の IclR ファミリー転写因子である LgnR の構造解析",
        orig: "Structural Analysis of LgnR, an IclR-Family Transcription Factor from Paracoccus sp. 43P",
        p: React.createElement(React.Fragment, null, "\u5B66\u58EB\u5B66\u4F4D\u8AD6\u6587 \xB7 ", React.createElement(Lnk, { to: LINKS.nodai }, "\u6771\u4EAC\u8FB2\u696D\u5927\u5B66"), "\u751F\u547D\u79D1\u5B66\u90E8 \xB7 \u6A5F\u80FD\u6027\u5206\u5B50\u89E3\u6790\u5B66\u7814\u7A76\u5BA4\uFF08\u77E2\u5D8B\u4FCA\u4ECB \u6559\u6388\uFF09"),
        body: React.createElement(React.Fragment, null, React.createElement("p", null, "L-\u30B0\u30EB\u30B3\u30FC\u30B9\u306F\u3001\u3042\u3089\u3086\u308B\u751F\u547D\u304C\u7528\u3044\u308B D-\u30B0\u30EB\u30B3\u30FC\u30B9\u306E\u93E1\u50CF\u3067\u3042\u308B\u3002\u81EA\u7136\u754C\u306B\u306F\u5B58\u5728\u305B\u305A\u3001\u30D8\u30AD\u30BD\u30AD\u30CA\u30FC\u30BC\u306B\u3088\u3063\u3066\u30EA\u30F3\u9178\u5316\u3082\u3055\u308C\u306A\u3044\u305F\u3081\u3001\u307B\u3068\u3093\u3069\u306E\u751F\u7269\u306B\u3068\u3063\u3066\u6804\u990A\u306B\u306A\u3089\u306A\u3044\u3002\u3068\u3053\u308D\u304C\u571F\u58CC\u304B\u3089\u5206\u96E2\u3055\u308C\u305F Paracoccus sp. 43P \u306F\u3053\u308C\u3092\u8CC7\u5316\u3067\u304D\u3001\u305D\u306E\u5C02\u7528\u7D4C\u8DEF\u306F IclR \u30D5\u30A1\u30DF\u30EA\u30FC\u8EE2\u5199\u56E0\u5B50 LgnR \u306B\u3088\u3063\u3066\u5236\u5FA1\u3055\u308C\u3066\u3044\u308B\u3002\u51FA\u4F1A\u3063\u305F\u3053\u3068\u306E\u306A\u3044\u7CD6\u306B\u5BFE\u3057\u3066\u751F\u7269\u304C\u3069\u306E\u3088\u3046\u306B\u5236\u5FA1\u6A5F\u69CB\u3092\u7372\u5F97\u3059\u308B\u306E\u304B\u306F\u660E\u3089\u304B\u3067\u306A\u304F\u3001LgnR \u304C\u539F\u5B50\u30EC\u30D9\u30EB\u3067\u7D4C\u8DEF\u306E\u72B6\u614B\u3092\u3069\u3046\u611F\u77E5\u3057\u3001\u3069\u3046\u958B\u9589\u3059\u308B\u306E\u304B\u3082\u8A18\u8FF0\u3055\u308C\u3066\u3044\u306A\u304B\u3063\u305F\u3002"), React.createElement("p", null, "\u305D\u3053\u3067 LgnR \u3092\u5927\u8178\u83CC\u3067\u767A\u73FE\u3055\u305B\u3001Ni \u30A2\u30D5\u30A3\u30CB\u30C6\u30A3\u30FC\u30AF\u30ED\u30DE\u30C8\u30B0\u30E9\u30D5\u30A3\u30FC\u3067\u7CBE\u88FD\u3057\u3001SDS-PAGE \u3067\u767A\u73FE\u3092\u78BA\u8A8D\u3001\u900F\u6790\u30FB\u6FC3\u7E2E\u3092\u7D4C\u3066\u7D50\u6676\u5316\u6761\u4EF6\u306E\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0\u3092\u884C\u3063\u305F\u3002\u7D50\u679C\u3068\u3057\u3066", React.createElement(Hl, null, "\u7D50\u6676\u5B66\u7684\u89E3\u6790\u306B\u4F9B\u3057\u3046\u308B\u72B6\u614B\u307E\u3067\u7D44\u63DB\u3048 LgnR \u3092\u767A\u73FE\u30FB\u7CBE\u88FD"), "\u3057\u3001\u7D50\u6676\u5316\u6761\u4EF6\u306E\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0\u3068\u8A55\u4FA1\u3092\u5B9F\u65BD\u3057\u305F\u3002"), React.createElement("p", null, "LgnR \u306E\u69CB\u9020\u306F\u3001\u5236\u5FA1\u56E0\u5B50\u304C\u9032\u5316\u306E\u4E0E\u3048\u306A\u304B\u3063\u305F\u57FA\u8CEA\u306B\u3069\u3046\u9069\u5FDC\u3059\u308B\u306E\u304B\u3092\u793A\u3059\u3002\u65B0\u305F\u306A\u4EE3\u8B1D\u80FD\u529B\u306E\u8D77\u6E90\u306B\u3082\u3001\u74B0\u5883\u6D44\u5316\u306B\u5411\u3051\u305F\u7D30\u83CC\u306E\u6539\u5909\u306B\u3082\u95A2\u308F\u308B\u554F\u3044\u3067\u3042\u308B\u3002\u307E\u305F\u3053\u306E\u8AB2\u984C\u306F", React.createElement(Hl, null, "\u79C1\u304C\u521D\u3081\u3066 AlphaFold2 \u3068 RoseTTAFold \u3092\u8D70\u3089\u305B\u305F\u5834\u6240"), "\u3067\u3042\u308A\u3001\u79C1\u306E\u7814\u7A76\u306E\u8A08\u7B97\u5074\u306F\u3053\u3053\u304B\u3089\u59CB\u307E\u3063\u305F\u3002"))
      }],

      fundingTitle: "研究費・フェローシップ",
      fundingNote: "これまでに書いた申請をすべて並べています。採択されたものも、されなかったものも。研究はその両方に押されて進んでいます。",
      grantCols: ["年度", "制度", "課題", "結果"],
      grants: {
        springgx: { year: "2024–現在", program: "JST SPRING-GX", title: React.createElement(React.Fragment, null, "\u6B21\u4E16\u4EE3\u7814\u7A76\u8005\u6311\u6226\u7684\u7814\u7A76\u30D7\u30ED\u30B0\u30E9\u30E0 \xB7 ", React.createElement(Lnk, { to: LINKS.springGX }, "GX \u9AD8\u5EA6\u4EBA\u6750\u80B2\u6210"), "\u3001\u6771\u4EAC\u5927\u5B66\u3002"), status: "採択" },
        dc2_2027: { year: "令和9年度（2027年度）", program: "学振 DC2", title: "大規模解析と機械学習による精密な脂質種認識機構の解明", status: "審査中" },
        spread_2026: { year: "2026", program: "JST SPReAD 第 1 回", title: React.createElement(React.Fragment, null, "\u6587\u90E8\u79D1\u5B66\u7701\u300CAI for Science \u306B\u3088\u308B\u79D1\u5B66\u7814\u7A76\u9769\u65B0\u30D7\u30ED\u30B0\u30E9\u30E0\u300D", React.createElement(Lnk, { to: LINKS.spread }, "AI for Science \u840C\u82BD\u7684\u6311\u6226\u7814\u7A76\u5275\u51FA\u4E8B\u696D\uFF08SPReAD: Supporting Pioneering Research through AI for 1,000 Discovery challenges\uFF09"), "\u3002\u8AB2\u984C\uFF1A\u914D\u5217\u3068\u69CB\u9020\u7D71\u5408 AI \u306B\u3088\u308B\u8102\u8CEA\u7D50\u5408\u30C9\u30E1\u30A4\u30F3\u306E\u8102\u8CEA\u7D50\u5408\u7279\u7570\u6027\u306E\u4E88\u6E2C\u3068\u8A8D\u8B58\u898F\u5247\u62BD\u51FA\u3002"), status: "要件審査通過 · 抽選漏れ" },
        dc2_2026: { year: "令和8年度（2026年度）", program: "学振 DC2", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析", status: "不採用" },
        dc1_2025: { year: "令和7年度（2025年度）", program: "学振 DC1", title: "大規模測定と機械学習によるタンパク質の寿命決定因子解析", status: "不採用" },
        dc1_2024: { year: "令和6年度（2024年度）", program: "学振 DC1", title: "精子エピゲノムの意義を精子体外再構成法で解明する研究", status: "不採用" }
      },
      awardsTitle: "受賞・活動",
      awards: [
      { y: "2024.03", h: React.createElement(React.Fragment, null, React.createElement(Hl, null, "\u512A\u79C0\u4FEE\u4E86\u751F\u8868\u5F70"), " \xB7 \u5E83\u57DF\u79D1\u5B66\u5C02\u653B\u5968\u52B1\u8CDE"), p: "東京大学総合文化研究科、令和 5 年度（2023 年度）。" },
      { y: "2023.08", h: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.nanolsiSchool }, "Bio-SPM \u590F\u306E\u5B66\u6821"), "\uFF08", React.createElement(Lnk, { to: LINKS.nanolsi }, "\u91D1\u6CA2\u5927\u5B66 NanoLSI"), "\uFF09\u3001\u5171\u540C\u7814\u7A76\u63A1\u629E"), p: "金沢大学第 11 回 Bio-SPM 夏の学校。高速原子間力顕微鏡による試験管内再構成複合体の動態観察。" }]

    },
    hobbies: {
      eyebrow: "オフ",
      title: "ピペット以外のすべてに興味がある。",
      items: [
      ["山", "登山・キャンプ", "上高地、尾瀬、立山黒部、遅い道ほどよい。"],
      ["影", "写真", "フィルムカメラ、速い列車、ときどき誰かの微笑み。"],
      ["猫", "猫", "もっとも小さく、もっとも静かな共同研究者。"],
      ["旅", "旅", "長い列車、路地裏、後で調べる用のノート。"]]

    },
    news: {
      eyebrow: "近況",
      title: "最近の出来事。",
      items: [
      { when: "2026 · 10", h: "RosettaCon Asia 2026 でポスター発表", p: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.rosettaAsia }, "RosettaCon Asia"), " \u306B\u3066", React.createElement(Hl, null, "\u30EA\u30F3\u8102\u8CEA\u7D50\u5408\u30BF\u30F3\u30D1\u30AF\u8CEA\u306E de novo \u8A2D\u8A08"), "\u3092\u767A\u8868\u4E88\u5B9A\u300210 \u6708 10 \u65E5\u30FB11 \u65E5\u3001\u5317\u4EAC\u5927\u5B66\u3002") },
      { when: "2026 · 08", h: "筆頭著者論文が公開", p: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.paper }, "Biochemistry (ACS)"), " \u306E\u7279\u96C6\u53F7 \u201CLipids and Lipidation\u201D \u306B\u63B2\u8F09\uFF1A\u6700\u9069\u5316\u30EA\u30DD\u30BD\u30FC\u30E0\u30D9\u30FC\u30B9 BLI \u306B\u3088\u308B\u30BF\u30F3\u30D1\u30AF\u8CEA\u3068\u30DB\u30B9\u30DB\u30A4\u30CE\u30B7\u30C1\u30C9\u306E\u7D50\u5408\u52D5\u614B\u306E\u5B9A\u91CF\u89E3\u6790\u3002") },
      { when: "2026 · 05", h: "学振 DC2 に申請", p: "脂質種認識機構をテーマに令和 9 年度（2027 年度） DC2 へ申請。現在審査中。" },
      { when: "2026 · 04", h: "BLI 論文を投稿", p: React.createElement(React.Fragment, null, "4 \u6708 20 \u65E5\u306B ", React.createElement(Lnk, { to: LINKS.acsBiochem }, "Biochemistry (ACS)"), " \u3078\u6295\u7A3F\u30013 \u304B\u6708\u5F8C\u306B\u53D7\u7406\u3002") },
      { when: "2025 · 01", h: "IPR 国際会議 2025", p: "淡路島でタンパク質とリン脂質結合の研究を発表。" },
      { when: "2024 · 10", h: "博士課程入学", p: "東京大学工学系研究科化学生命工学専攻に正式入学。" },
      { when: "2024 · 04", h: "坪山研究室に参加", p: React.createElement(React.Fragment, null, React.createElement(Lnk, { to: LINKS.iis }, "\u751F\u7523\u6280\u8853\u7814\u7A76\u6240"), "\u306E\u751F\u4F53\u5206\u5B50\u8A2D\u8A08\u5DE5\u5B66\u7814\u7A76\u5BA4\u3067\u7814\u7A76\u958B\u59CB\u3002") }]

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
        excerpt: "Biotite についての自分用の覚書。配列、立体構造、データベース問い合わせ、外部ソフトのラッパーが一つの Python パッケージと一貫した API に収まっており、小さな解析スクリプトが二百行の解析処理から始まらずに済む。"
      },
      {
        date: "2026 · 08 · 17",
        href: "posts/py2dmol.html",
        title: "PyMOL を開かずにタンパク質の図をつくる",
        excerpt: "py2Dmol はブラウザのタブの中で PDB ID をそのまま使える図に変える。背景は透明、リガンドも描かれ、スタイルも複数。短いツール覚書と、ブックマークに残している理由。"
      },
      {
        date: "2026 · 08 · 17",
        href: "posts/bli-liposome.html",
        title: "タンパク質と脂質の結合をリアルタイムで読む",
        excerpt: "ほとんどのタンパク質–脂質アッセイが答えるのは「どれくらい強く」だけ。「どれくらい速く、どれくらい留まるか」に答えるものは少ない。リポソームベース BLI を定量的な速度論アッセイに変える手法ノート。非特異シグナルの出どころと、数値を信じる前に確かめることについて。"
      }],

      empty: "最初の記事を執筆中です。もう少しお待ちください。"
    },
    contact: {
      eyebrow: "連絡",
      headline: React.createElement(React.Fragment, null, "\u30B5\u30A4\u30A8\u30F3\u30B9\u306E ", React.createElement("em", null, "\u8A71\u3092\u3057\u3088\u3046\u3002")),
      sub: "共同研究、AI for Science、脂質生物物理、駒場でのコーヒー。メールはいつでもどうぞ。",
      seekingLabel: "募集中",
      seeking: React.createElement(React.Fragment, null, "2027 \u5E74\u5F8C\u534A\u307E\u305F\u306F 2028 \u5E74\u958B\u59CB\u306E\u30DD\u30B9\u30C9\u30AF\u3002", React.createElement(Hl, null, "\u30A6\u30A7\u30C3\u30C8\u3068\u30C9\u30E9\u30A4\u306E\u4E21\u65B9"), "\u3092\u81EA\u5206\u3067\u56DE\u305B\u307E\u3059\uFF1A\u30BF\u30F3\u30D1\u30AF\u8CEA\u8A2D\u8A08\u3001\u30E9\u30A4\u30D6\u30E9\u30EA\u69CB\u7BC9\u3001\u5927\u898F\u6A21\u30B9\u30AF\u30EA\u30FC\u30CB\u30F3\u30B0\u3001NGS \u306E\u30C7\u30FC\u30BF\u51E6\u7406\u30FB\u89E3\u6790\u3001\u305D\u3057\u3066\u7D50\u5408\u52D5\u614B\u306E\u6E2C\u5B9A\u307E\u3067\u3001\u4E00\u9023\u306E\u6D41\u308C\u3092\u4E00\u4EBA\u3067\u5B8C\u7D50\u3067\u304D\u307E\u3059\u3002\u6B21\u306B\u53D6\u308A\u7D44\u307F\u305F\u3044\u306E\u306F", React.createElement(Hl, null, "\u8A2D\u8A08\u3057\u305F\u30BF\u30F3\u30D1\u30AF\u8CEA\u3092\u751F\u304D\u305F\u7D30\u80DE\u306E\u4E2D\u3067\u50CD\u304B\u305B\u308B\u3053\u3068"), "\u3067\u3001\u7D30\u80DE\u30D7\u30ED\u30B0\u30E9\u30DF\u30F3\u30B0\u3001\u907A\u4F1D\u5B50\u56DE\u8DEF\u3001\u30BF\u30F3\u30D1\u30AF\u8CEA\u5DE5\u5B66\u3068\u3044\u3063\u305F\u65B9\u5411\u306B\u95A2\u5FC3\u304C\u3042\u308A\u307E\u3059\u3002"),
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
        office: "居室"
      }
    }
  }
};


function Typewriter({ phrases }) {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (REDUCED_MOTION) {setOut(phrases[0]);return undefined;}
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
    React.createElement("span", null,
    React.createElement("span", { className: "prompt" }, "$"),
    React.createElement("span", null, out),
    React.createElement("span", { className: "caret" })
    ));

}


function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .timeline-item");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) e.target.classList.add("visible");});
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}


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
  return React.createElement("span", { className: "clock", "aria-hidden": "true" }, t);
}

function App() {
  const tweaks = window.useTweaks(window.TWEAK_DEFAULTS);
  const [t] = tweaks;
  const lang = t.lang || "en";
  const L = I18N[lang];

  useReveal();

  useNudgeAllPops([lang]);


  useEffect(() => {
    const theme = t.theme || "light";




    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-lang", t.lang || "en");
    document.documentElement.lang = t.lang === "zh" ? "zh-CN" : t.lang === "ja" ? "ja" : "en";
    document.documentElement.style.setProperty("--accent", t.accent || "#16a34a");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#fafaf7");
  }, [t.theme, t.accent, t.lang]);




  useEffect(() => {
    const id = decodeURIComponent((window.location.hash || "").slice(1));
    if (!id) return undefined;
    const el = document.getElementById(id);
    if (!el) return undefined;





    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    let done = false;
    const jump = () => {if (!done) el.scrollIntoView({ block: "start", behavior: "auto" });};
    const stop = () => {done = true;root.style.scrollBehavior = prevBehavior;};
    jump();
    const events = ["wheel", "touchstart", "keydown", "pointerdown"];
    events.forEach((ev) => window.addEventListener(ev, stop, { passive: true, once: true }));
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(jump) : null;
    if (ro) ro.observe(document.body);
    const timer = setTimeout(() => {if (ro) ro.disconnect();stop();}, 2500);
    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
      events.forEach((ev) => window.removeEventListener(ev, stop));
      stop();
    };
  }, []);


  useEffect(() => {
    const c = document.getElementById("protein-canvas");
    if (c && window.initProtein && !c.dataset.inited) {
      window.initProtein(c);
      c.dataset.inited = "1";
    }
  }, []);

  return (
    React.createElement(React.Fragment, null,
    React.createElement(Nav, { L: L, tweaks: tweaks }),
    React.createElement("main", null,
    React.createElement(Hero, { L: L }),
    React.createElement(About, { L: L }),
    React.createElement(Research, { L: L }),
    React.createElement(Education, { L: L }),
    React.createElement(Publications, { L: L }),
    React.createElement(News, { L: L }),
    React.createElement(Blog, { L: L }),
    React.createElement(Hobbies, { L: L }),
    React.createElement(Contact, { L: L })
    ),
    React.createElement(Footer, { L: L })
    ));

}

function Nav({ L, tweaks }) {
  const [t, setT] = tweaks;
  const langs = ["en", "zh", "ja"];
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {if (e.key === "Escape") setMenuOpen(false);};
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => {if (mq.matches) setMenuOpen(false);};
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {window.removeEventListener("keydown", onKey);mq.removeEventListener("change", onWide);};
  }, [menuOpen]);

  return (
    React.createElement("nav", { className: `nav ${menuOpen ? "menu-open" : ""}` },
    React.createElement("div", { className: "nav-mark" }, React.createElement("span", { className: "dot" }), React.createElement("span", null, "YAO \xB7 \u59DA\u54C1\u78A9")),
    React.createElement("div", { className: "nav-links", id: "nav-links" },
    NAV_KEYS.map((k) => React.createElement("a", { key: k, href: NAV_HREF[k] || "#" + k, onClick: () => setMenuOpen(false) }, L.nav[k]))
    ),
    React.createElement("div", { className: "nav-actions" },
    React.createElement("div", { className: "lang-pills" },
    langs.map((l) =>
    React.createElement("button", { key: l, className: t.lang === l ? "active" : "", "aria-pressed": t.lang === l, onClick: () => setT("lang", l) },
    l === "en" ? "EN" : l === "zh" ? "中" : "日"
    )
    )
    ),
    React.createElement("button", { className: "theme-btn", onClick: () => setT("theme", t.theme === "dark" ? "light" : "dark"), "aria-label": "Toggle theme" },
    t.theme === "dark" ? "\u2600\uFE0E" : "\u263E\uFE0E"
    ),
    React.createElement("button", {
      className: "nav-toggle",
      "aria-expanded": menuOpen,
      "aria-controls": "nav-links",
      "aria-label": "Menu",
      onClick: () => setMenuOpen((o) => !o) },

    React.createElement("span", null), React.createElement("span", null), React.createElement("span", null)
    )
    )
    ));

}



const HERO_KEY_SPLIT = /(\bAI\b|\bproteins?\b|\blipids?\b|\bmembranes?\b|蛋白质|磷脂|タンパク質|リン脂質)/;
const HERO_KEY_TEST = /^(AI|proteins?|lipids?|membranes?|蛋白质|磷脂|タンパク質|リン脂質)$/;

function Hero({ L }) {
  return (
    React.createElement("section", { id: "hero", className: "hero" },
    React.createElement("div", { className: "hero-left" },
    React.createElement("div", { className: "hero-meta" },
    React.createElement("span", { className: "live" }),
    L.hero.meta.map((m, i) =>
    React.createElement(React.Fragment, { key: i }, React.createElement("span", null, m), i < L.hero.meta.length - 1 && React.createElement("span", null, "\xB7"))
    )
    ),
    React.createElement("h1", { className: "hero-name" }, "YAO",
    React.createElement("br", null),
    React.createElement("span", { className: "ital" }, "Pinshuo")
    ),
    React.createElement("div", { className: "hero-name-cn" }, "\u59DA \u54C1 \u78A9"),
    React.createElement("div", { className: "hero-typer", "aria-hidden": "true" }, React.createElement(Typewriter, { phrases: L.hero.typer })),
    React.createElement("p", { className: "hero-desc" }, L.hero.desc.split(HERO_KEY_SPLIT).map((s, i) =>
    HERO_KEY_TEST.test(s) ? React.createElement("span", { key: i, className: "key" }, s) : s
    )),
    React.createElement("div", { className: "hero-cta" },
    React.createElement("a", { href: "#research", className: "btn primary" }, React.createElement("span", null, L.hero.cta1), React.createElement("span", { className: "arrow" }, "\u2192")),
    React.createElement("a", { href: "#contact", className: "btn" }, React.createElement("span", null, L.hero.cta2), React.createElement("span", { className: "arrow" }, "\u2192"))
    )
    ),
    React.createElement("div", { className: "hero-right", "aria-hidden": "true" },
    React.createElement("div", { className: "protein-stage" },
    React.createElement("canvas", { id: "protein-canvas" })
    ),
    React.createElement("div", { className: "protein-frame" }),
    React.createElement("div", { className: "protein-corner-tr" }),
    React.createElement("div", { className: "protein-corner-bl" }),
    React.createElement("div", { className: "protein-corner-br" }),
    React.createElement("div", { className: "protein-tag" }, "PDB \xB7 synth_helix.0"),
    React.createElement("div", { className: "protein-readout" },
    React.createElement("span", { className: "lbl" }, "obj"), " peripheral_membrane \xB7 ", React.createElement("span", { className: "lbl" }, "N"), "=56 \xB7 ", React.createElement("span", { className: "lbl" }, "rot"), " live"
    )
    )
    ));

}

function About({ L }) {
  return (
    React.createElement("section", { id: "about" },
    React.createElement("div", { className: "eyebrow" }, L.about.eyebrow),
    React.createElement("div", { className: "about-head" },
    React.createElement("h2", { className: "section-title reveal" }, L.about.title),
    React.createElement("figure", { className: "portrait reveal" },
    React.createElement("img", { src: "assets/portrait.jpg", alt: "YAO Pinshuo", width: "526", height: "526", decoding: "async" })
    )
    ),
    React.createElement("div", { className: "about-text reveal" },
    React.createElement("p", null, L.about.p1),
    React.createElement("p", null, L.about.p2),
    React.createElement("p", null, L.about.p3)
    )
    ));

}



function Chip({ label, def, className }) {
  return (
    React.createElement("span", _extends({
      className: [className, def ? "has-term" : ""].filter(Boolean).join(" "),
      tabIndex: def ? 0 : undefined },
    def ? POP_TRIGGERS : {}),

    label,
    def && React.createElement("span", { className: "term-pop" }, def)
    ));

}






function ModelChip({ m, desc, hint, open, onOpen }) {
  let host = "";
  try {host = new URL(m.href).hostname.replace(/^www\./, "");} catch (e) {}
  const onClick = (e) => {
    if (!m.href) {e.preventDefault();onOpen(open ? null : m.key);return;}
    if (COARSE_POINTER && !open) {e.preventDefault();onOpen(m.key);}
  };
  const className = ["chip", "model", "has-term", open ? "open" : ""].filter(Boolean).join(" ");
  const pop =
  React.createElement("span", { className: "term-pop" },
  desc,
  m.href && React.createElement("span", { className: "pop-meta" }, host, COARSE_POINTER && hint ? ` · ${hint}` : "")
  );

  return m.href ?
  React.createElement("a", _extends({ className: className, href: m.href, target: "_blank", rel: "noreferrer", onClick: onClick }, POP_TRIGGERS),
  m.name, React.createElement("span", { className: "arrow-glyph" }, " \u2197\uFE0E"), pop
  ) :

  React.createElement("span", _extends({ className: className, tabIndex: 0, onClick: onClick }, POP_TRIGGERS),
  m.name, pop
  );

}

function Research({ L }) {
  const R = L.research;
  const groups = Object.keys(R.modelGroups || {});

  const [openModel, setOpenModel] = useState(null);
  useEffect(() => {
    if (!openModel) return undefined;
    const close = (e) => {if (!e.target.closest(".chip.model.open")) setOpenModel(null);};
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [openModel]);
  return (
    React.createElement("section", { id: "research" },
    React.createElement("div", { className: "eyebrow" }, R.eyebrow),
    React.createElement("div", { className: "section-head" },
    React.createElement("h2", { className: "section-title reveal" }, R.title),
    React.createElement("p", { className: "lede reveal" }, R.lede)
    ),

    React.createElement("div", { className: "projects" },
    R.proj.map((p, i) =>
    React.createElement("div", { key: i, className: "project" },
    React.createElement("div", { className: "project-num" }, R.projLabel, " ", React.createElement("span", { className: "accent" }, p.n)),
    React.createElement("div", { className: "project-main" },
    React.createElement("div", { className: "project-head" },
    React.createElement("h3", null, p.title),
    React.createElement("span", { className: `project-status tone-${p.status}` }, R.projStatus[p.status])
    ),
    React.createElement("div", { className: "project-tags" }, p.tags.map((t, j) => React.createElement("span", { key: j }, t))),
    React.createElement("div", { className: "project-detail" },
    React.createElement("div", { className: "project-detail-inner" },
    React.createElement("p", null, p.summary),
    p.outcome &&
    React.createElement("div", { className: "project-outcome" },
    React.createElement("div", { className: "outcome-label" }, R.outcomeLabel),
    React.createElement("p", null, p.outcome)
    ),

    p.figure &&
    React.createElement("figure", { className: "project-fig" },
    React.createElement("img", { src: p.figure.src, alt: p.figure.alt, loading: "lazy", decoding: "async" }),
    React.createElement("figcaption", null, p.figure.caption)
    ),

    p.paperLabel &&
    React.createElement("p", { className: "project-paper" },
    React.createElement(Lnk, { to: LINKS.paper }, p.paperLabel, " ", React.createElement("span", { className: "arrow-glyph" }, "\u2197\uFE0E"))
    )

    )
    )
    )
    )
    )
    ),

    R.models &&
    React.createElement("div", { className: "tech-section reveal" },
    React.createElement("h3", null, R.modelsTitle),
    React.createElement("p", { className: "tech-note" }, R.modelsNote),
    React.createElement("div", { className: "model-groups" },
    groups.map((g) => {
      const rows = MODELS.filter((m) => m.group === g);
      if (!rows.length) return null;
      return (
        React.createElement("div", { key: g, className: "model-group" },
        React.createElement("div", { className: "model-group-label" }, R.modelGroups[g]),
        React.createElement("div", { className: "tech-cloud" },
        rows.map((m) =>
        React.createElement(ModelChip, { key: m.key, m: m, desc: R.models[m.key], hint: R.modelTapHint,
          open: openModel === m.key, onOpen: setOpenModel })
        )
        )
        ));

    })
    )
    ),


    React.createElement("div", { className: "tech-section reveal" },
    React.createElement("h3", null, R.organismsTitle),
    React.createElement("div", { className: "tech-cloud" },
    R.organisms.map(([label, def], i) => React.createElement(Chip, { key: i, className: "org", label: label, def: def }))
    )
    ),
    React.createElement("div", { className: "tech-section reveal" },
    React.createElement("h3", null, R.techsTitle),
    R.techsNote && React.createElement("p", { className: "tech-note" }, R.techsNote),
    React.createElement("div", { className: "tech-cloud" },
    R.techs.map(([label, def], i) => React.createElement(Chip, { key: i, label: label, def: def }))
    )
    )
    ));

}

function Education({ L }) {
  return (
    React.createElement("section", { id: "edu" },
    React.createElement("div", { className: "eyebrow" }, L.edu.eyebrow),
    React.createElement("h2", { className: "section-title reveal" }, L.edu.title),
    React.createElement("div", { className: "timeline" },
    L.edu.items.map((it, i) =>
    React.createElement("div", { key: i, className: `timeline-item ${it.current ? "current" : ""}` },
    React.createElement("div", { className: "timeline-date" },
    React.createElement("span", null, it.date),
    it.current && React.createElement("span", { className: "badge" }, "NOW")
    ),
    React.createElement("h4", null, it.h),
    React.createElement("div", { className: "institution" }, it.inst),
    React.createElement("div", { className: "detail" }, it.detail)
    )
    )
    )
    ));

}

function BlockLabel({ children }) {
  return React.createElement("div", { className: "block-label" }, children);
}

function Publications({ L }) {
  const P = L.pubs;
  return (
    React.createElement("section", { id: "pubs" },
    React.createElement("div", { className: "eyebrow" }, P.eyebrow),
    React.createElement("h2", { className: "section-title reveal" }, P.title),

    React.createElement("div", { className: "reveal" },
    React.createElement(BlockLabel, null, P.papersTitle),
    P.papers && P.papers.map((p, i) =>
    React.createElement("div", { key: i, className: "pub-item" },
    React.createElement("div", { className: "pub-date", style: { color: "var(--accent-ink)" } }, p.status),
    React.createElement("div", { className: "pub-content" },
    React.createElement("h4", null, p.title),
    p.authors && React.createElement("div", { className: "authors" }, p.authors),
    React.createElement("div", { className: "venue" }, p.venue),
    p.note && React.createElement("div", { className: "pub-note" }, p.note)
    ),
    React.createElement("div", { className: "pub-types" }, React.createElement("span", { className: "pub-tag intl" }, p.date))
    )
    ),
    React.createElement("div", { className: "pub-empty", style: { marginTop: 16 } }, P.papersEmpty)
    ),

    React.createElement("div", { className: "divider" }),

    React.createElement("div", { className: "reveal" },
    React.createElement(BlockLabel, null, P.thesesTitle),
    P.theses && P.theses.map((t, i) =>
    React.createElement("article", { key: i, className: "thesis" },
    React.createElement("div", { className: "thesis-head" },
    React.createElement("div", { className: "thesis-year" }, t.y),
    React.createElement("div", null,
    React.createElement("h4", null, t.h),
    t.orig && React.createElement("div", { className: "thesis-orig" }, t.orig),
    React.createElement("div", { className: "thesis-where" }, t.p)
    )
    ),
    React.createElement("div", { className: "thesis-body" }, t.body)
    )
    )
    ),

    React.createElement("div", { className: "divider" }),

    React.createElement("div", { className: "pub-list reveal" },
    React.createElement(BlockLabel, null, P.presTitle),
    P.pres.map((p, i) =>
    React.createElement("div", { key: i, className: "pub-item" },
    React.createElement("div", { className: "pub-date" }, p.date),
    React.createElement("div", { className: "pub-content" },
    React.createElement("h4", null, p.title),
    p.authors && React.createElement("div", { className: "authors" }, p.authors),
    React.createElement("div", { className: "venue" }, p.venue, p.no ? ` · ${p.no}` : "")
    ),
    React.createElement("div", { className: "pub-types" },
    p.upcoming && React.createElement("span", { className: "pub-tag upcoming" }, P.upcomingLabel),
    p.intl && React.createElement("span", { className: "pub-tag intl" }, P.intlLabel),


    React.createElement("span", { className: "pub-tag poster" },
    (P.typeLabels[p.type] || p.type) + (p.no ? ` ${p.no}` : "")
    )
    )
    )
    )
    ),

    React.createElement("div", { className: "divider" }),

    React.createElement("div", { className: "reveal" },
    React.createElement(BlockLabel, null, P.fundingTitle),
    React.createElement("p", { className: "funding-note" }, P.fundingNote),
    React.createElement("div", { className: "grant-table" },
    React.createElement("div", { className: "grant-head" },
    P.grantCols.map((c, i) => React.createElement("span", { key: i }, c))
    ),
    GRANTS.map((g) => {
      const row = P.grants[g.key];
      if (!row) return null;
      return (
        React.createElement("div", { key: g.key, className: `grant-row tone-${g.tone}` },
        React.createElement("div", { className: "grant-year" }, row.year),
        React.createElement("div", { className: "grant-program" },
        g.href ? React.createElement("a", { href: g.href, target: "_blank", rel: "noreferrer" }, row.program) : row.program
        ),
        React.createElement("div", { className: "grant-title" }, row.title),
        React.createElement("div", { className: "grant-status" }, React.createElement("span", { className: "grant-pill" }, row.status))
        ));

    })
    )
    ),

    React.createElement("div", { className: "divider" }),

    React.createElement("div", { className: "reveal" },
    React.createElement(BlockLabel, null, P.awardsTitle),
    P.awards.map((a, i) =>
    React.createElement("div", { key: i, className: "award-row" },
    React.createElement("div", { className: "year" }, a.y),
    React.createElement("div", null,
    React.createElement("h4", null, a.h),
    React.createElement("p", null, a.p)
    )
    )
    )
    )
    ));

}

function Hobbies({ L }) {
  return (
    React.createElement("section", { id: "hobbies" },
    React.createElement("div", { className: "eyebrow" }, L.hobbies.eyebrow),
    React.createElement("h2", { className: "section-title reveal" }, L.hobbies.title),
    React.createElement("div", { className: "hobby-strip reveal" },
    L.hobbies.items.map(([g, h, p], i) =>
    React.createElement("div", { key: i, className: "hobby-cell" },
    React.createElement("div", { className: "glyph" }, g),
    React.createElement("h4", null, h),
    React.createElement("p", null, p)
    )
    )
    )
    ));

}

function News({ L }) {
  return (
    React.createElement("section", { id: "news" },
    React.createElement("div", { className: "eyebrow" }, L.news.eyebrow),
    React.createElement("h2", { className: "section-title reveal" }, L.news.title),
    React.createElement("div", { className: "news-flow reveal" },
    L.news.items.map((n, i) =>
    React.createElement("div", { key: i, className: "news-card" },
    React.createElement("div", { className: "when" }, n.when),
    React.createElement("h4", null, n.h),
    React.createElement("p", null, n.p)
    )
    )
    )
    ));

}

function Blog({ L }) {
  const B = L.blog;
  const posts = B.posts || [];
  return (
    React.createElement("section", { id: "blog" },
    React.createElement("div", { className: "eyebrow" }, B.eyebrow),
    React.createElement("div", { className: "section-head" },
    React.createElement("h2", { className: "section-title reveal" }, B.title),
    React.createElement("p", { className: "lede reveal" }, B.note)
    ),
    posts.length ?
    React.createElement("div", { className: "post-list reveal" },
    posts.map((p, i) => {
      const inner =
      React.createElement(React.Fragment, null,
      React.createElement("div", { className: "post-date" }, p.date),
      React.createElement("div", { className: "post-main" },
      React.createElement("h4", null, p.title),
      p.excerpt && React.createElement("p", null, p.excerpt)
      ),
      React.createElement("span", { className: "arrow-glyph" }, "\u2197\uFE0E")
      );

      return p.href ?
      React.createElement("a", { key: i, className: "post-item", href: p.href }, inner) :
      React.createElement("div", { key: i, className: "post-item" }, inner);
    })
    ) :

    React.createElement("div", { className: "pub-empty reveal" }, B.empty),

    B.collectLink &&
    React.createElement("p", { className: "section-more reveal" },
    React.createElement("a", { href: "collect.html" }, B.collectLink, " ", React.createElement("span", { className: "arrow-glyph" }, "\u2197\uFE0E"))
    )

    ));

}




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
      try {document.execCommand("copy");} catch (e) {}
      document.body.removeChild(ta);
    };
    const done = () => {
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1800);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(done, () => {fallback();done();});
    } else {
      fallback();
      done();
    }
  };

  return (
    React.createElement("button", { type: "button", className: `contact-row copyable ${done ? "copied" : ""}`, onClick: copy },
    React.createElement("span", { className: "label" }, label),
    React.createElement("span", { className: "value" }, value),
    React.createElement("span", { className: "copy-hint" }, done ? copiedLabel : copyLabel)
    ));

}



const LAST_UPDATE_FALLBACK = "2026-09-12";
const REPO_COMMITS_API = "https://api.github.com/repos/PinshuoYAO/PinshuoYAO.github.io/commits?per_page=1";
function LastUpdate({ label }) {
  const [date, setDate] = useState(LAST_UPDATE_FALLBACK);
  useEffect(() => {
    let alive = true;


    let cached = null;
    try {cached = sessionStorage.getItem("yps-hp-last-commit");} catch (e) {}
    if (cached) {setDate(cached);return undefined;}
    fetch(REPO_COMMITS_API).
    then((r) => r.ok ? r.json() : null).
    then((j) => {
      const iso = j && j[0] && j[0].commit && j[0].commit.committer && j[0].commit.committer.date;
      if (alive && iso) {
        setDate(iso.slice(0, 10));
        try {sessionStorage.setItem("yps-hp-last-commit", iso.slice(0, 10));} catch (e) {}
      }
    }).
    catch(() => {});
    return () => {alive = false;};
  }, []);
  return React.createElement("span", null, label, " \xB7 ", date);
}

function Contact({ L }) {
  return (
    React.createElement("section", { id: "contact" },
    React.createElement("div", { className: "contact-block" },
    React.createElement("div", { className: "reveal" },
    React.createElement("div", { className: "eyebrow" }, L.contact.eyebrow),
    React.createElement("h2", { className: "contact-headline" }, L.contact.headline),
    React.createElement("p", { className: "contact-sub" }, L.contact.sub),
    React.createElement("div", { className: "seeking-card" },
    React.createElement("div", { className: "seeking-label" }, L.contact.seekingLabel),
    React.createElement("p", { className: "seeking-body" }, L.contact.seeking)
    ),
    React.createElement("div", { className: "socials" },
    SOCIALS.map((s, i) => React.createElement("a", { key: i, href: s.href, target: "_blank", rel: "noreferrer" }, s.label, " ", React.createElement("span", { className: "arrow-glyph" }, "\u2197\uFE0E"))),

    React.createElement("a", { className: "socials-cv", href: LINKS.cvPdf, download: "YAO_Pinshuo_CV.pdf" }, L.contact.cvLabel, " ", React.createElement("span", { className: "arrow-glyph" }, "\u2193"))
    )
    ),
    React.createElement("div", { className: "contact-list reveal" },
    CONTACTS.map((c, i) => {
      const label = L.contact.labels[c.id] || c.id;
      return c.href ?
      React.createElement("a", { key: i, className: "contact-row", href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined },
      React.createElement("span", { className: "label" }, label),
      React.createElement("span", { className: "value" }, c.value),
      React.createElement("span", { className: "arrow" }, "\u2197\uFE0E")
      ) :

      React.createElement(CopyRow, { key: i, label: label, value: c.value, copyLabel: L.contact.copy, copiedLabel: L.contact.copied });

    })
    )
    )
    ));

}

function Footer({ L }) {
  return (
    React.createElement("footer", null,
    React.createElement("span", null, "\xA9 2026 YAO Pinshuo \xB7 \u59DA\u54C1\u78A9"),
    React.createElement("span", null, "Built with curiosity \xB7 with Claude"),
    React.createElement(LastUpdate, { label: L.contact.lastUpdate }),
    React.createElement(Clock, null)
    ));

}

window.App = App;
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
