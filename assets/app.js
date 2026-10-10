(() => {
  const config = window.SITE_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const state = { pages: [], filter: "all", query: "" };

  const titleCase = (s) => s.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const basename = (path) => path.split("/").pop();
  const folderOf = (path) => path.includes("/") ? path.split("/").slice(0, -1).join("/") : "Root";
  const humanName = (path) => basename(path).replace(/\.(html?|md|markdown)$/i, "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function publishedUrl(path) {
    const base = location.pathname.endsWith("/") ? location.pathname : location.pathname.replace(/[^/]*$/, "");
    return base + path.split("/").map(encodeURIComponent).join("/");
  }

  function setStatus(message, isError = false) {
    $("status").textContent = message;
    $("status").classList.toggle("error", isError);
  }

  function getFolderIcon(folder) {
    const f = folder.toLowerCase();
    if (f.includes("lab") || f.includes("workshop")) return "⌘";
    if (f.includes("architecture") || f.includes("design")) return "◇";
    if (f.includes("aws") || f.includes("azure") || f.includes("cloud")) return "☁";
    if (f.includes("data")) return "▤";
    if (f.includes("adr") || f.includes("decision")) return "⚖";
    if (f.includes("guide") || f.includes("docs")) return "▧";
    return "▱";
  }

  function isIgnored(path) {
    const ignored = (config.ignoredFolders || []).map(x => x.toLowerCase());
    return path.split("/").some(part => ignored.includes(part.toLowerCase()));
  }

  function shouldInclude(path) {
    if (isIgnored(path)) return false;
    if (/^(index|home)\.(html?)$/i.test(basename(path))) return false;
    return /\.(html?|md|markdown)$/i.test(path);
  }

  function buildDescription(page) {
    return page.description || (page.ext === "md"
      ? "Markdown documentation"
      : "Web page published from this repository");
  }

  function renderFilters() {
    const counts = {};
    state.pages.forEach(p => counts[p.folder] = (counts[p.folder] || 0) + 1);
    const host = $("folder-filters");
    host.innerHTML = Object.keys(counts).sort((a,b) => a.localeCompare(b)).map(folder =>
      `<button class="filter" data-filter="${escapeHtml(folder)}"><span class="filter-icon">${getFolderIcon(folder)}</span><span class="filter-name">${escapeHtml(folder === "Root" ? "Root files" : titleCase(folder))}</span><span class="count">${counts[folder]}</span></button>`
    ).join("");
    $("all-count").textContent = state.pages.length;
    host.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => chooseFilter(button.dataset.filter)));
    document.querySelectorAll(".sidebar > [data-filter]").forEach(button => button.addEventListener("click", () => chooseFilter(button.dataset.filter)));
  }

  function chooseFilter(filter) {
    state.filter = filter;
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === filter));
    $("results-title").textContent = filter === "all" ? "All pages" : (filter === "Root" ? "Root files" : titleCase(filter));
    renderPages();
  }

  function renderPages() {
    const query = state.query.trim().toLowerCase();
    let pages = state.pages.filter(p => {
      const matchesFilter = state.filter === "all" || p.folder === state.filter;
      const haystack = `${p.name} ${p.path} ${p.folder} ${buildDescription(p)}`.toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });
    const sort = $("sort").value;
    pages.sort((a,b) => sort === "name" ? a.name.localeCompare(b.name)
      : sort === "newest" ? b.path.localeCompare(a.path)
      : a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));

    $("page-grid").innerHTML = pages.map(p => {
      const folderLabel = p.folder === "Root" ? "ROOT" : p.folder.toUpperCase();
      const kind = p.ext === "md" ? "MARKDOWN" : "HTML PAGE";
      return `<article class="page-card">
        <div class="card-top"><span class="file-icon">${p.ext === "md" ? "M↓" : "‹ ›"}</span><span class="file-kind">${kind}</span><button class="more" title="Open source on GitHub" data-source="${escapeHtml(p.path)}">↗</button></div>
        <div class="card-folder">${escapeHtml(folderLabel)}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(buildDescription(p))}</p>
        <div class="card-bottom"><span class="path-text">${escapeHtml(p.path)}</span><button class="open-card" data-open="${escapeHtml(p.path)}">Open page <span>→</span></button></div>
      </article>`;
    }).join("");

    $("page-grid").querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openPage(b.dataset.open)));
    $("page-grid").querySelectorAll("[data-source]").forEach(b => b.addEventListener("click", () => window.open(`https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${b.dataset.source.split("/").map(encodeURIComponent).join("/")}`, "_blank", "noopener")));
    $("empty-state").hidden = pages.length !== 0;
    $("page-grid").hidden = pages.length === 0;
    $("page-count").textContent = `${state.pages.length} page${state.pages.length === 1 ? "" : "s"} discovered`;
  }

  async function openPage(path) {
    const page = state.pages.find(p => p.path === path);
    if (!page) return;
    const url = publishedUrl(path);
    $("reader-title").textContent = page.name;
    $("reader-folder").textContent = page.folder === "Root" ? "ROOT FILE" : page.folder;
    $("open-file").href = url;
    if (page.ext === "md") {
      $("reader-content").innerHTML = '<p class="loading">Loading Markdown…</p>';
      $("reader").showModal();
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const markdown = await response.text();
        const html = window.marked ? marked.parse(markdown) : `<pre>${escapeHtml(markdown)}</pre>`;
        $("reader-content").innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
      } catch (error) {
        $("reader-content").innerHTML = `<p>Could not load the Markdown preview. Use <a href="${escapeHtml(url)}" target="_blank" rel="noopener">Open published page</a>.</p>`;
      }
    } else {
      // HTML files are opened directly so their styles, scripts, and relative links work normally.
      window.open(url, "_blank", "noopener");
    }
  }

  async function load() {
    const validConfig = config.owner && config.repo &&
      !config.owner.startsWith("YOUR_") && !config.repo.startsWith("YOUR_");
    $("site-title").textContent = config.title || "Repository Hub";
    $("footer-title").textContent = config.title || "Repository Hub";
    document.title = config.title || "Repository Hub";
    $("repo-link").href = `https://github.com/${config.owner || ""}/${config.repo || ""}`;
    if (!validConfig) {
      setStatus("Setup required: edit config.js with your GitHub username, repository name, and branch.", true);
      $("page-count").textContent = "Waiting for repository settings";
      return;
    }

    const api = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/git/trees/${encodeURIComponent(config.branch || "main")}?recursive=1`;
    try {
      const response = await fetch(api, { headers: { "Accept": "application/vnd.github+json" } });
      if (!response.ok) {
        if (response.status === 404) throw new Error("Repository or branch not found. Check config.js and confirm the repository is public.");
        if (response.status === 403) throw new Error("GitHub API rate limit reached. Wait a while and refresh.");
        throw new Error(`GitHub API returned ${response.status}.`);
      }
      const data = await response.json();
      if (data.truncated) console.warn("GitHub returned a truncated repository tree; some files may be omitted.");
      state.pages = (data.tree || []).filter(item => item.type === "blob" && shouldInclude(item.path)).map(item => {
        const ext = basename(item.path).split(".").pop().toLowerCase();
        return { path: item.path, folder: folderOf(item.path), name: humanName(item.path), ext: ext === "markdown" ? "md" : ext };
      });
      // Root README is documentation, but avoid listing README when the repository already has a README used only for setup.
      renderFilters();
      renderPages();
      setStatus(state.pages.length ? "Pages are ready. Choose a folder or search to explore." : "No HTML or Markdown pages were found in the repository.", false);
      if (data.truncated) setStatus("Repository is large; GitHub returned a partial file list.");
    } catch (error) {
      setStatus(error.message || "Unable to load repository pages.", true);
      $("page-count").textContent = "Could not load pages";
    }
  }

  $("search").addEventListener("input", e => { state.query = e.target.value; renderPages(); });
  $("sort").addEventListener("change", renderPages);
  $("reader-close").addEventListener("click", () => $("reader").close());
  $("reader").addEventListener("click", e => { if (e.target === $("reader")) $("reader").close(); });
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault(); $("search").focus();
    }
    if (e.key === "Escape" && $("reader").open) $("reader").close();
  });
  load();
})();
