// Compiles app.jsx → app.js with the vendored Babel standalone.
//
// The site has no bundler on purpose. Until September 2026 the browser loaded
// Babel (3.1 MB) and transpiled app.jsx on every visit; this script does that
// once, on this machine, so visitors download 133 KB of plain JavaScript instead.
//
//   node tools/build.js            compile app.jsx from disk
//   node tools/build.js --stdin    compile the JSX arriving on stdin (the
//                                  pre-commit hook feeds it the STAGED app.jsx,
//                                  so the committed app.js always matches the
//                                  committed app.jsx, never the working copy)
//
// tools/babel.min.js is git-ignored; scripts/build.sh in the yao-personal-hp
// skill downloads and SRI-checks it when it is missing.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const babelPath = path.join(ROOT, 'tools', 'babel.min.js');
if (!fs.existsSync(babelPath)) {
  console.error('tools/babel.min.js is missing. Run: bash ~/.claude/skills/yao-personal-hp/scripts/build.sh');
  process.exit(1);
}
const Babel = require(babelPath);
const src = process.argv.includes('--stdin') ? fs.readFileSync(0, 'utf8') : fs.readFileSync(path.join(ROOT, 'app.jsx'), 'utf8');
let out;
try {
  out = Babel.transform(src, { presets: ['react'], sourceType: 'script', compact: false, comments: false, retainLines: true }).code;
} catch (e) {
  // a JSX syntax error used to be invisible (pitfall 1); now it fails the build
  console.error('app.jsx does not compile:\n' + (e.message || e));
  process.exit(1);
}
const banner = '/* GENERATED from app.jsx by tools/build.js — do not edit. Edit app.jsx, then run\n   bash ~/.claude/skills/yao-personal-hp/scripts/build.sh (the pre-commit hook also does it). */\n';
fs.writeFileSync(path.join(ROOT, 'app.js'), banner + out + '\n');
console.log('app.js written: ' + (banner.length + out.length) + ' bytes');
