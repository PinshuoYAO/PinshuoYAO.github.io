/* collect.js — the Collection page.
 *
 * Two lists. BOOKMARKS live in a separate public repository (DATA_REPO) so the
 * page can be edited from the browser: the owner enters a password, the page
 * decrypts a GitHub token that is stored sealed in that repository
 * (edit-key.json, AES-GCM under a PBKDF2 key), and every change is committed
 * through the GitHub Contents API. Readers only ever fetch the JSON. PAPERS are
 * exported from Zotero by the yao-personal-hp skill into data/papers.json in
 * the site repository and are read-only here.
 *
 * Nothing secret ever lands in this file, in localStorage, or on this origin:
 * the token exists in memory only while the page is unlocked.
 */
(function () {
  'use strict';

  var DATA_REPO = 'PinshuoYAO/hp-data';
  var DATA_BRANCH = 'main';
  var BOOKMARKS_PATH = 'bookmarks.json';
  var KEY_PATH = 'edit-key.json';
  var RAW = 'https://raw.githubusercontent.com/' + DATA_REPO + '/' + DATA_BRANCH + '/';
  var API = 'https://api.github.com/repos/' + DATA_REPO;
  var PAPERS_URL = 'data/papers.json';
  var STORE_KEY = 'yps-hp-prefs';
  var CACHE_KEY = 'yps-collect-bookmarks';
  var PBKDF2_ITER = 600000;
  var PAGE = 120;

  var I18N = {
    en: {
      kicker: 'Collection', title: 'Things worth keeping.',
      standfirst: 'Short notes on tools, repositories and papers I want to find again. Some grow into blog posts; those carry a green Blog mark.',
      tabBookmarks: 'Bookmarks', tabPapers: 'Papers', search: 'Search', edit: 'Edit', done: 'Done',
      add: 'Add', save: 'Save', cancel: 'Cancel', deleteBtn: 'Delete', editBtn: 'Edit', deleteConfirm: 'Delete this entry?',
      fText: 'Memo', fUrl: 'Link (optional)', fTags: 'Tags, comma separated', fBlog: 'Blog post on this site (optional), e.g. posts/biotite.html',
      hintEditing: 'editing an entry', hintBlog: 'that is not a post on this site', hintUrl: 'links must start with http(s)://',
      unlockTitle: 'Edit the collection', unlockHint: 'Enter the edit password. Nothing is stored in this browser.',
      password: 'Password', unlock: 'Unlock', wrongPassword: 'That password did not open the key.',
      connectTitle: 'Connect the data repository',
      connectHint: 'One-time setup, or a reset after a lost password. The token is encrypted with the password you choose and stored in the data repository; this page never keeps it.',
      connectSteps: ['Create a public repository <code>' + DATA_REPO + '</code> on GitHub with a README.', 'Create a fine-grained personal access token limited to that repository, permission <code>Contents: Read and write</code>.', 'Paste it below and choose the edit password.'],
      token: 'GitHub token', newPassword: 'Edit password (a long phrase is safer)', confirmPassword: 'Repeat it', connect: 'Connect',
      changeTitle: 'Change the edit password', changePassword: 'Change password', lostPassword: 'Lost the password? Connect again with a new token',
      mismatch: 'The two passwords differ.', tooShort: 'Use at least 8 characters.', badToken: 'GitHub rejected that token for ' + DATA_REPO + '.',
      noRepo: 'Repository ' + DATA_REPO + ' was not found. Create it first (public, with a README).',
      saving: 'Saving…', saved: 'Saved to GitHub. Readers see it within a few minutes.', saveFailed: 'Could not save: ', keySaved: 'Password changed.',
      loadFailed: 'Could not load the bookmarks.', notConnected: 'Nothing here yet.', noResults: 'Nothing matches.',
      blog: 'Blog', read: 'read', hot: 'pick', hotTag: '★ picks', readTag: 'read', all: 'All',
      papersNote: 'Exported from my Zotero library: {n} entries, updated {date}. Titles link to the DOI. Papers I have written about carry the Blog mark.',
      showMore: 'Show more', nd: 'n.d.', more: '+{n}',
      lockedAgain: 'Locked. The token is gone from memory.',
    },
    zh: {
      kicker: '收藏夹', title: '值得留着的东西。',
      standfirst: '工具、代码库和论文的一句话备忘，都是我以后还想找到的东西。有些后来写成了博客，会带一个绿色的"博客"标记。',
      tabBookmarks: '收藏', tabPapers: '论文', search: '搜索', edit: '编辑', done: '完成',
      add: '添加', save: '保存', cancel: '取消', deleteBtn: '删除', editBtn: '编辑', deleteConfirm: '删除这一条？',
      fText: '备忘', fUrl: '链接（可选）', fTags: '标签，用逗号分隔', fBlog: '本站博客链接（可选），例如 posts/biotite.html',
      hintEditing: '正在修改一条', hintBlog: '这不是本站的博客地址', hintUrl: '链接要以 http(s):// 开头',
      unlockTitle: '编辑收藏夹', unlockHint: '输入编辑密码。浏览器里不会保存任何东西。',
      password: '密码', unlock: '解锁', wrongPassword: '密码不对。',
      connectTitle: '连接数据仓库',
      connectHint: '首次设置，或者忘记密码后重置。令牌会用你设定的密码加密后存进数据仓库，这个页面本身不保存它。',
      connectSteps: ['在 GitHub 新建一个公开仓库 <code>' + DATA_REPO + '</code>，带 README。', '创建一个只限于该仓库的 fine-grained 令牌，权限 <code>Contents: Read and write</code>。', '把令牌贴到下面，设定编辑密码。'],
      token: 'GitHub 令牌', newPassword: '编辑密码（长一点的短语更安全）', confirmPassword: '再输一次', connect: '连接',
      changeTitle: '修改编辑密码', changePassword: '修改密码', lostPassword: '忘记密码？用新令牌重新连接',
      mismatch: '两次输入不一致。', tooShort: '至少 8 个字符。', badToken: 'GitHub 拒绝了这个令牌对 ' + DATA_REPO + ' 的访问。',
      noRepo: '找不到仓库 ' + DATA_REPO + '。先建好它（公开，带 README）。',
      saving: '保存中…', saved: '已保存到 GitHub。读者几分钟内会看到。', saveFailed: '保存失败：', keySaved: '密码已修改。',
      loadFailed: '收藏加载失败。', notConnected: '还没有内容。', noResults: '没有匹配的条目。',
      blog: '博客', read: '已读', hot: '精选', hotTag: '★ 精选', readTag: '已读', all: '全部',
      papersNote: '从我的 Zotero 文献库导出：{n} 条，更新于 {date}。标题链接到 DOI。写过博客的论文带"博客"标记。',
      showMore: '显示更多', nd: '无年份', more: '+{n}',
      lockedAgain: '已锁定，令牌已从内存清除。',
    },
    ja: {
      kicker: 'コレクション', title: '手元に置いておきたいもの。',
      standfirst: 'もう一度探したいツール、リポジトリ、論文の短いメモ。ブログ記事になったものには緑の「ブログ」印が付く。',
      tabBookmarks: 'ブックマーク', tabPapers: '論文', search: '検索', edit: '編集', done: '完了',
      add: '追加', save: '保存', cancel: 'キャンセル', deleteBtn: '削除', editBtn: '編集', deleteConfirm: 'この項目を削除しますか？',
      fText: 'メモ', fUrl: 'リンク（任意）', fTags: 'タグ、カンマ区切り', fBlog: 'このサイトの記事（任意）、例 posts/biotite.html',
      hintEditing: '項目を編集中', hintBlog: 'このサイトの記事の URL ではない', hintUrl: 'リンクは http(s):// で始める',
      unlockTitle: 'コレクションを編集', unlockHint: '編集パスワードを入力。ブラウザには何も保存されない。',
      password: 'パスワード', unlock: '解除', wrongPassword: 'パスワードが違う。',
      connectTitle: 'データリポジトリを接続',
      connectHint: '初回の設定、またはパスワードを忘れたときのリセット。トークンは設定したパスワードで暗号化してデータリポジトリに置かれ、このページ自体は保持しない。',
      connectSteps: ['GitHub に公開リポジトリ <code>' + DATA_REPO + '</code> を README 付きで作る。', 'そのリポジトリだけに限定した fine-grained トークンを作る。権限は <code>Contents: Read and write</code>。', '下に貼り付けて、編集パスワードを決める。'],
      token: 'GitHub トークン', newPassword: '編集パスワード（長いフレーズのほうが安全）', confirmPassword: 'もう一度', connect: '接続',
      changeTitle: '編集パスワードを変更', changePassword: 'パスワード変更', lostPassword: 'パスワードを忘れた？新しいトークンで再接続',
      mismatch: '二つの入力が一致しない。', tooShort: '8 文字以上にする。', badToken: 'GitHub がこのトークンによる ' + DATA_REPO + ' へのアクセスを拒否した。',
      noRepo: 'リポジトリ ' + DATA_REPO + ' が見つからない。先に作る（公開、README 付き）。',
      saving: '保存中…', saved: 'GitHub に保存した。読者には数分以内に反映される。', saveFailed: '保存できなかった：', keySaved: 'パスワードを変更した。',
      loadFailed: 'ブックマークを読み込めなかった。', notConnected: 'まだ何もない。', noResults: '該当なし。',
      blog: 'ブログ', read: '既読', hot: '注目', hotTag: '★ 注目', readTag: '既読', all: 'すべて',
      papersNote: '自分の Zotero ライブラリから書き出したもの：{n} 件、{date} 更新。タイトルは DOI へリンク。記事にした論文には「ブログ」印。',
      showMore: 'さらに表示', nd: '年不明', more: '+{n}',
      lockedAgain: 'ロックした。トークンはメモリから消えた。',
    },
  };

  var $ = function (id) { return document.getElementById(id); };
  var state = {
    lang: 'en', tab: 'bookmarks', q: '', tag: null,
    bookmarks: { items: [], sha: null, loaded: false, error: null },
    papers: { items: [], meta: null, loaded: false, shown: PAGE },
    token: null, editId: null,
  };
  var t = function (k) { return (I18N[state.lang] && I18N[state.lang][k]) || I18N.en[k] || k; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- preferences: shared with the rest of the site ---------- */
  function readPrefs() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
  function writePrefs(p) { try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {} }
  function applyLang(lang) {
    if (['en', 'zh', 'ja'].indexOf(lang) === -1) lang = 'en';
    state.lang = lang;
    document.body.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      var on = b.getAttribute('data-set-lang') === lang;
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $('q').placeholder = t('search');
    $('q').setAttribute('aria-label', t('search'));
    document.title = t('kicker') + ' · YAO Pinshuo';
    renderAll();
  }
  function applyTheme(theme) {
    if (theme !== 'dark') theme = 'light';
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    $('themeBtn').textContent = theme === 'dark' ? '☀︎' : '☾︎';
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#fafaf7');
  }

  /* ---------- helpers ---------- */
  function blogPath(u) {
    if (!u) return null;
    var m = String(u).trim().match(/^(?:https?:\/\/pinshuoyao\.github\.io)?\/?(posts\/[\w.-]+\.html)(?:[#?].*)?$/i);
    return m ? m[1] : null;
  }
  function hostOf(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  // Only web links are ever rendered as links: the data file is public and
  // writable by whoever holds the password, so a javascript: URL must not
  // become a clickable anchor on this origin.
  function safeUrl(u) { return /^https?:\/\/\S+$/i.test(String(u || '').trim()) ? String(u).trim() : null; }
  function today() { return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' }); }
  function fmtDate(d) { return d ? String(d).slice(0, 10).replace(/-/g, ' · ') : ''; }
  function newId() { return 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function status(msg, err, ms) {
    var el = $('status');
    el.textContent = msg; el.classList.toggle('err', !!err); el.classList.add('on');
    clearTimeout(status.timer);
    if (ms !== 0) status.timer = setTimeout(function () { el.classList.remove('on'); }, ms || (err ? 6000 : 3200));
  }
  function b64encode(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64decode(b64) {
    var bin = atob(b64.replace(/\s/g, '')), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  var bufToB64 = function (buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); };
  var b64ToBuf = function (b64) { var bin = atob(b64), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; };

  /* ---------- crypto: seal / open the token ---------- */
  function deriveKey(password, salt, iter) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
      .then(function (km) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      });
  }
  function seal(token, password) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    return deriveKey(password, salt, PBKDF2_ITER).then(function (key) {
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(token));
    }).then(function (ct) {
      return { v: 1, kdf: 'PBKDF2-SHA256', iter: PBKDF2_ITER, salt: bufToB64(salt), iv: bufToB64(iv), ct: bufToB64(ct), repo: DATA_REPO, path: BOOKMARKS_PATH };
    });
  }
  function openKey(blob, password) {
    return deriveKey(password, b64ToBuf(blob.salt), blob.iter || PBKDF2_ITER).then(function (key) {
      return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBuf(blob.iv) }, key, b64ToBuf(blob.ct));
    }).then(function (pt) { return new TextDecoder().decode(pt); });
  }

  /* ---------- GitHub ---------- */
  function authHeaders(token) {
    return { Authorization: 'Bearer ' + (token || state.token), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  }
  // Fresh read through the API (no CDN cache); returns {json, sha} or null on 404.
  function apiRead(path, token) {
    var h = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (token || state.token) h.Authorization = 'Bearer ' + (token || state.token);
    return fetch(API + '/contents/' + path + '?ref=' + DATA_BRANCH, { headers: h }).then(function (r) {
      if (r.status === 404) return null;
      if (!r.ok) throw new Error('GitHub ' + r.status);
      return r.json().then(function (j) { return { json: JSON.parse(b64decode(j.content)), sha: j.sha }; });
    });
  }
  function apiWrite(path, obj, message, sha, token) {
    var body = { message: message, content: b64encode(JSON.stringify(obj, null, 1)), branch: DATA_BRANCH };
    if (sha) body.sha = sha;
    return fetch(API + '/contents/' + path, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(body) }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) { var e = new Error((j && j.message) || ('GitHub ' + r.status)); e.status = r.status; throw e; }
        return j.content.sha;
      });
    });
  }

  /* ---------- loading ---------- */
  function loadBookmarks() {
    // readers: the raw CDN copy (cached up to five minutes, no rate limit);
    // the owner's own browser also remembers the last saved copy so an edit
    // shows immediately here even before the CDN catches up
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) {}
    return fetch(RAW + BOOKMARKS_PATH + '?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' })
      .then(function (r) { if (r.status === 404) return { items: [] }; if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) {
        var items = (j && j.items) || [];
        if (cached && cached.updated && (!j.updated || cached.updated > j.updated)) items = cached.items || items;
        state.bookmarks.items = items; state.bookmarks.loaded = true; state.bookmarks.error = null;
      })
      .catch(function () {
        state.bookmarks.error = t('loadFailed'); state.bookmarks.loaded = true;
        if (cached && cached.items) { state.bookmarks.items = cached.items; state.bookmarks.error = null; }
      })
      .then(renderAll);
  }
  function loadPapers() {
    if (state.papers.loaded || state.papers.loading) return;
    state.papers.loading = true;
    fetch(PAPERS_URL).then(function (r) { return r.json(); }).then(function (j) {
      state.papers.items = j.items || []; state.papers.meta = j; state.papers.loaded = true; state.papers.loading = false;
      renderAll();
    }).catch(function () { state.papers.loading = false; state.papers.loaded = true; renderAll(); });
  }

  /* ---------- filtering ---------- */
  function matches(hay, q) { return !q || hay.toLowerCase().indexOf(q) !== -1; }
  function visibleBookmarks() {
    var q = state.q.trim().toLowerCase();
    return state.bookmarks.items.filter(function (b) {
      if (state.tag && (b.tags || []).indexOf(state.tag) === -1) return false;
      return matches([b.text, b.url, (b.tags || []).join(' '), b.blog].filter(Boolean).join(' '), q);
    });
  }
  function visiblePapers() {
    var q = state.q.trim().toLowerCase();
    return state.papers.items.filter(function (p) {
      if (state.tag === '★') { if (!p.hot) return false; }
      else if (state.tag === 'read') { if (!p.read) return false; }
      else if (state.tag && (p.tags || []).indexOf(state.tag) === -1) return false;
      return matches([p.title, (p.authors || []).join(' '), p.venue, p.year, (p.tags || []).join(' '), p.doi].filter(Boolean).join(' '), q);
    });
  }

  /* ---------- rendering ---------- */
  function renderTags() {
    var counts = {}, items = state.tab === 'bookmarks' ? state.bookmarks.items : state.papers.items;
    items.forEach(function (it) {
      (it.tags || []).forEach(function (g) { counts[g] = (counts[g] || 0) + 1; });
      if (state.tab === 'papers') { if (it.hot) counts['★'] = (counts['★'] || 0) + 1; if (it.read) counts.read = (counts.read || 0) + 1; }
    });
    var keys = Object.keys(counts).sort(function (a, b) {
      var order = function (k) { return k === '★' ? 0 : k === 'read' ? 1 : 2; };
      return order(a) - order(b) || counts[b] - counts[a] || a.localeCompare(b);
    });
    if (state.tag && keys.indexOf(state.tag) === -1) state.tag = null;
    var html = keys.length ? '<button type="button" data-tag="" aria-pressed="' + (!state.tag) + '">' + esc(t('all')) + '</button>' : '';
    keys.forEach(function (k) {
      var label = k === '★' ? t('hotTag') : k === 'read' ? t('readTag') : k;
      html += '<button type="button" data-tag="' + esc(k) + '" aria-pressed="' + (state.tag === k) + '">' + esc(label) + '<span class="n">' + counts[k] + '</span></button>';
    });
    $('tags').innerHTML = html;
  }
  function blogPill(path) {
    return '<a class="blog-pill" href="' + esc(path) + '" title="' + esc(path) + '">' + esc(t('blog')) + ' ↗︎</a>';
  }
  function renderBookmarks() {
    var list = $('list-bookmarks'), empty = $('empty-bookmarks');
    var rows = visibleBookmarks(), editing = !!state.token;
    $('count-bookmarks').textContent = state.bookmarks.items.length || '';
    list.innerHTML = rows.map(function (b) {
      var blog = blogPath(b.blog) || blogPath(b.url);
      var url = b.url && !blogPath(b.url) ? safeUrl(b.url) : null;
      var memo = url ? '<a href="' + esc(url) + '" target="_blank" rel="noreferrer">' + esc(b.text) + '</a>' : esc(b.text);
      var meta = '';
      if (url) meta += '<a class="host" href="' + esc(url) + '" target="_blank" rel="noreferrer">' + esc(hostOf(url)) + '</a>';
      (b.tags || []).forEach(function (g) { meta += '<span class="tag">' + esc(g) + '</span>'; });
      var side = blog ? blogPill(blog) : (url ? '<span class="arrow-glyph">↗︎</span>' : '');
      if (editing) side += '<span class="row-actions"><button type="button" class="collect-btn quiet" data-edit="' + esc(b.id) + '">' + esc(t('editBtn')) + '</button><button type="button" class="collect-btn quiet danger" data-del="' + esc(b.id) + '">' + esc(t('deleteBtn')) + '</button></span>';
      return '<li class="collect-item' + (blog ? ' has-blog' : '') + '"><div class="when">' + esc(fmtDate(b.added)) + '</div><div class="main"><div class="memo">' + memo + '</div>' + (meta ? '<div class="meta">' + meta + '</div>' : '') + '</div><div class="side">' + side + '</div></li>';
    }).join('');
    var msg = state.bookmarks.error ? state.bookmarks.error : (!state.bookmarks.items.length ? t('notConnected') : (!rows.length ? t('noResults') : ''));
    empty.hidden = !msg; empty.textContent = msg;
  }
  function renderPapers() {
    var list = $('list-papers'), empty = $('empty-papers'), more = $('morePapers'), note = $('papers-note');
    var all = state.papers.items, rows = visiblePapers();
    $('count-papers').textContent = all.length || '';
    if (state.papers.meta) {
      note.textContent = t('papersNote').replace('{n}', all.length).replace('{date}', state.papers.meta.exported || '');
    }
    var shown = rows.slice(0, state.papers.shown);
    list.innerHTML = shown.map(function (p) {
      var link = p.doi ? 'https://doi.org/' + encodeURI(p.doi) : safeUrl(p.url);
      var title = link ? '<a href="' + esc(link) + '" target="_blank" rel="noreferrer">' + esc(p.title) + '</a>' : esc(p.title);
      var authors = (p.authors || []).join(', ') + (p.n > (p.authors || []).length ? ' ' + t('more').replace('{n}', p.n - p.authors.length) : '');
      var meta = '';
      if (p.venue) meta += '<span class="venue">' + esc(p.venue) + '</span>';
      if (p.hot) meta += '<span class="hot" title="' + esc(t('hot')) + '">' + '★'.repeat(p.hot) + '</span>';
      if (p.read) meta += '<span class="read">' + esc(t('read')) + '</span>';
      (p.tags || []).forEach(function (g) { meta += '<span class="tag">' + esc(g) + '</span>'; });
      var blog = blogPath(p.blog);
      var side = blog ? blogPill(blog) : (link ? '<span class="arrow-glyph">↗︎</span>' : '');
      return '<li class="collect-item paper' + (blog ? ' has-blog' : '') + '"><div class="when">' + esc(p.year || t('nd')) + '</div><div class="main"><div class="memo">' + title + '</div>' + (authors ? '<div class="authors">' + esc(authors) + '</div>' : '') + (meta ? '<div class="meta">' + meta + '</div>' : '') + '</div><div class="side">' + side + '</div></li>';
    }).join('');
    more.hidden = rows.length <= state.papers.shown;
    var msg = state.papers.loaded && !all.length ? t('loadFailed') : (state.papers.loaded && !rows.length ? t('noResults') : '');
    empty.hidden = !msg; empty.textContent = msg;
  }
  function renderEditor() {
    var editing = !!state.token;
    $('editor').hidden = !editing || state.tab !== 'bookmarks';
    var btn = $('editBtn');
    btn.querySelector('span').textContent = editing ? t('done') : t('edit');
    btn.classList.toggle('editing', editing);
    $('f-save').textContent = state.editId ? t('save') : t('add');
    $('f-cancel').hidden = !state.editId;
    $('f-hint').textContent = state.editId ? t('hintEditing') : '';
    $('f-pw').textContent = t('changePassword');
  }
  function renderTabs() {
    ['bookmarks', 'papers'].forEach(function (k) {
      $('tab-' + k).setAttribute('aria-selected', String(state.tab === k));
      $('panel-' + k).hidden = state.tab !== k;
    });
  }
  function renderAll() { renderTabs(); renderTags(); renderBookmarks(); renderPapers(); renderEditor(); }

  /* ---------- editing ---------- */
  function fillForm(b) {
    $('f-text').value = b ? b.text : ''; $('f-url').value = b && b.url ? b.url : '';
    $('f-tags').value = b && b.tags ? b.tags.join(', ') : ''; $('f-blog').value = b && b.blog ? b.blog : '';
    state.editId = b ? b.id : null; renderEditor();
  }
  function saveBookmarks(message) {
    var doc = { version: 1, updated: new Date().toISOString(), items: state.bookmarks.items };
    status(t('saving'), false, 0);
    return apiWrite(BOOKMARKS_PATH, doc, message, state.bookmarks.sha).catch(function (e) {
      if (e.status !== 409 && e.status !== 422) throw e;
      // someone (a second tab?) wrote in between: take the new sha and retry once
      return apiRead(BOOKMARKS_PATH).then(function (r) { state.bookmarks.sha = r ? r.sha : null; return apiWrite(BOOKMARKS_PATH, doc, message, state.bookmarks.sha); });
    }).then(function (sha) {
      state.bookmarks.sha = sha;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(doc)); } catch (e) {}
      status(t('saved'));
    }).catch(function (e) { status(t('saveFailed') + (e.message || e), true); throw e; });
  }
  $('editor').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var text = $('f-text').value.trim(); if (!text) return;
    var url = $('f-url').value.trim(), blog = $('f-blog').value.trim();
    if (url && !safeUrl(url) && !blogPath(url)) { $('f-hint').textContent = t('hintUrl'); $('f-url').focus(); return; }
    var tags = $('f-tags').value.split(/[,，、]/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (blog && !blogPath(blog)) { $('f-hint').textContent = t('hintBlog'); $('f-blog').focus(); return; }
    var entry = { id: state.editId || newId(), text: text, added: today() };
    if (url) entry.url = url; if (tags.length) entry.tags = tags; if (blog) entry.blog = blogPath(blog);
    if (state.editId) {
      var i = state.bookmarks.items.findIndex(function (b) { return b.id === state.editId; });
      if (i !== -1) { entry.added = state.bookmarks.items[i].added || entry.added; state.bookmarks.items[i] = entry; }
    } else {
      state.bookmarks.items.unshift(entry);
    }
    var was = state.editId;
    fillForm(null); renderAll();
    saveBookmarks((was ? 'collect: edit ' : 'collect: add ') + text.slice(0, 60)).catch(function () {});
  });
  $('f-cancel').addEventListener('click', function () { fillForm(null); });
  $('list-bookmarks').addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.edit) {
      var it = state.bookmarks.items.find(function (x) { return x.id === b.dataset.edit; });
      if (it) { fillForm(it); $('f-text').focus(); $('editor').scrollIntoView({ block: 'center' }); }
    } else if (b.dataset.del) {
      var it2 = state.bookmarks.items.find(function (x) { return x.id === b.dataset.del; });
      if (!it2 || !window.confirm(t('deleteConfirm') + '\n\n' + it2.text)) return;
      state.bookmarks.items = state.bookmarks.items.filter(function (x) { return x.id !== b.dataset.del; });
      renderAll();
      saveBookmarks('collect: delete ' + it2.text.slice(0, 60)).catch(function () {});
    }
  });

  /* ---------- dialogs ---------- */
  function showDialog(html) { $('dialog-card').innerHTML = html; $('dialog').hidden = false; var f = $('dialog-card').querySelector('input'); if (f) f.focus(); }
  function hideDialog() { $('dialog').hidden = true; $('dialog-card').innerHTML = ''; }
  $('dialog').addEventListener('click', function (ev) { if (ev.target === $('dialog')) hideDialog(); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('dialog').hidden) hideDialog(); });

  function unlockDialog(err) {
    showDialog(
      '<h2 id="dialog-title">' + esc(t('unlockTitle')) + '</h2><p>' + esc(t('unlockHint')) + '</p>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<form id="d-form"><label for="d-pw">' + esc(t('password')) + '</label><input id="d-pw" type="password" autocomplete="current-password" required>' +
      '<div class="actions"><button class="collect-btn primary" type="submit">' + esc(t('unlock')) + '</button>' +
      '<button class="collect-btn quiet" type="button" id="d-cancel">' + esc(t('cancel')) + '</button>' +
      '<a class="link" href="#" id="d-connect">' + esc(t('lostPassword')) + '</a></div></form>');
    $('d-cancel').onclick = hideDialog;
    $('d-connect').onclick = function (e) { e.preventDefault(); connectDialog(); };
    $('d-form').onsubmit = function (e) {
      e.preventDefault();
      var pw = $('d-pw').value; var btn = $('d-form').querySelector('button[type=submit]'); btn.disabled = true;
      apiRead(KEY_PATH).then(function (r) {
        if (!r) { connectDialog(); return null; }
        return openKey(r.json, pw).then(function (token) {
          return apiRead(BOOKMARKS_PATH, token).then(function (bm) {
            state.token = token;
            if (bm) { state.bookmarks.items = bm.json.items || []; state.bookmarks.sha = bm.sha; }
            hideDialog(); renderAll();
            if (state.tab !== 'bookmarks') { state.tab = 'bookmarks'; renderAll(); }
            $('f-text').focus();
          });
        });
      }).catch(function (e) {
        var msg = (e && e.name === 'OperationError') ? t('wrongPassword') : (e.message || String(e));
        unlockDialog(msg);
      });
    };
  }
  function connectDialog(err) {
    showDialog(
      '<h2 id="dialog-title">' + esc(t('connectTitle')) + '</h2><p>' + esc(t('connectHint')) + '</p>' +
      '<ol>' + t('connectSteps').map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<form id="d-form"><label for="d-token">' + esc(t('token')) + '</label><input id="d-token" type="password" autocomplete="off" required>' +
      '<label for="d-pw1">' + esc(t('newPassword')) + '</label><input id="d-pw1" type="password" autocomplete="new-password" required>' +
      '<label for="d-pw2">' + esc(t('confirmPassword')) + '</label><input id="d-pw2" type="password" autocomplete="new-password" required>' +
      '<div class="actions"><button class="collect-btn primary" type="submit">' + esc(t('connect')) + '</button>' +
      '<button class="collect-btn quiet" type="button" id="d-cancel">' + esc(t('cancel')) + '</button></div></form>');
    $('d-cancel').onclick = hideDialog;
    $('d-form').onsubmit = function (e) {
      e.preventDefault();
      var token = $('d-token').value.trim(), p1 = $('d-pw1').value, p2 = $('d-pw2').value;
      if (p1 !== p2) return connectDialog(t('mismatch'));
      if (p1.length < 8) return connectDialog(t('tooShort'));
      var btn = $('d-form').querySelector('button[type=submit]'); btn.disabled = true;
      fetch(API, { headers: authHeaders(token) }).then(function (r) {
        if (r.status === 404) throw new Error(t('noRepo'));
        if (!r.ok) throw new Error(t('badToken'));
        return Promise.all([apiRead(KEY_PATH, token), apiRead(BOOKMARKS_PATH, token), seal(token, p1)]);
      }).then(function (res) {
        var key = res[0], bm = res[1], blob = res[2];
        return apiWrite(KEY_PATH, blob, 'collect: ' + (key ? 'reseal' : 'seal') + ' the edit key', key ? key.sha : null, token).then(function () {
          if (bm) { state.bookmarks.items = bm.json.items || []; state.bookmarks.sha = bm.sha; return null; }
          var doc = { version: 1, updated: new Date().toISOString(), items: state.bookmarks.items };
          return apiWrite(BOOKMARKS_PATH, doc, 'collect: first bookmarks file', null, token).then(function (sha) { state.bookmarks.sha = sha; });
        });
      }).then(function () {
        state.token = token; hideDialog(); renderAll(); status(t('keySaved'));
      }).catch(function (e) { connectDialog(e.message || String(e)); });
    };
  }
  function changePasswordDialog(err) {
    showDialog(
      '<h2 id="dialog-title">' + esc(t('changeTitle')) + '</h2>' + (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<form id="d-form"><label for="d-pw1">' + esc(t('newPassword')) + '</label><input id="d-pw1" type="password" autocomplete="new-password" required>' +
      '<label for="d-pw2">' + esc(t('confirmPassword')) + '</label><input id="d-pw2" type="password" autocomplete="new-password" required>' +
      '<div class="actions"><button class="collect-btn primary" type="submit">' + esc(t('changePassword')) + '</button>' +
      '<button class="collect-btn quiet" type="button" id="d-cancel">' + esc(t('cancel')) + '</button></div></form>');
    $('d-cancel').onclick = hideDialog;
    $('d-form').onsubmit = function (e) {
      e.preventDefault();
      var p1 = $('d-pw1').value, p2 = $('d-pw2').value;
      if (p1 !== p2) return changePasswordDialog(t('mismatch'));
      if (p1.length < 8) return changePasswordDialog(t('tooShort'));
      Promise.all([apiRead(KEY_PATH), seal(state.token, p1)]).then(function (res) {
        return apiWrite(KEY_PATH, res[1], 'collect: change the edit password', res[0] ? res[0].sha : null);
      }).then(function () { hideDialog(); status(t('keySaved')); })
        .catch(function (e) { changePasswordDialog(e.message || String(e)); });
    };
  }
  function lock() { state.token = null; fillForm(null); renderAll(); status(t('lockedAgain')); }

  /* ---------- wiring ---------- */
  $('editBtn').addEventListener('click', function () {
    if (state.token) { lock(); return; }
    // first-time setup goes straight to Connect; otherwise ask for the password
    // (a network or rate-limit failure falls back to the password dialog)
    apiRead(KEY_PATH).then(function (r) { if (r) unlockDialog(); else connectDialog(); }).catch(function () { unlockDialog(); });
  });
  $('f-pw').addEventListener('click', function () { changePasswordDialog(); });

  document.querySelectorAll('.collect-tabs [data-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.tab = b.dataset.tab; state.tag = null;
      if (state.tab === 'papers') loadPapers();
      history.replaceState(null, '', state.tab === 'papers' ? '#papers' : location.pathname);
      renderAll();
    });
  });
  $('tags').addEventListener('click', function (ev) {
    var b = ev.target.closest('button[data-tag]'); if (!b) return;
    state.tag = b.dataset.tag || null; renderAll();
  });
  $('q').addEventListener('input', function () { state.q = $('q').value; state.papers.shown = PAGE; renderAll(); });
  $('morePapers').addEventListener('click', function () { state.papers.shown += PAGE; renderPapers(); });
  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () { var p = readPrefs(); p.lang = b.getAttribute('data-set-lang'); writePrefs(p); applyLang(p.lang); });
  });
  $('themeBtn').addEventListener('click', function () {
    var p = readPrefs(); p.theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; writePrefs(p); applyTheme(p.theme);
  });
  window.addEventListener('pagehide', function () { state.token = null; });

  /* ---------- clock (same as the posts) ---------- */
  (function () {
    var clock = $('clock');
    function tick() {
      var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
      var p = function (n) { return String(n).padStart(2, '0'); };
      clock.textContent = 'TYO ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- boot ---------- */
  var prefs = readPrefs();
  var systemDark = false;
  try { systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) {}
  applyTheme(prefs.theme || (systemDark ? 'dark' : 'light'));
  if (location.hash === '#papers') { state.tab = 'papers'; loadPapers(); }
  applyLang(prefs.lang || 'en');
  loadBookmarks();
  // the papers list is ~400 KB; fetch it once the page is idle unless it is
  // already the open tab
  if (state.tab !== 'papers') { (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(loadPapers); }
})();
