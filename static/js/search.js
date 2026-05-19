(() => {
  const input = document.getElementById("search-input");
  const status = document.getElementById("search-status");
  const resultsEl = document.getElementById("search-results");

  if (!input || !status || !resultsEl) return;

  let pages = [];

  const escapeHtml = (text) =>
    text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const renderResults = (results, keyword) => {
    if (!keyword) {
      status.textContent = "Enter keywords to search.";
      resultsEl.innerHTML = "";
      return;
    }

    status.textContent = `Found ${results.length} result(s).`;

    if (!results.length) {
      resultsEl.innerHTML = "";
      return;
    }

    resultsEl.innerHTML = results
      .map((item) => {
        const summary = item.summary || item.content.slice(0, 140);
        return `
          <li class="mb4 pb3 bb b--black-10">
            <a class="link f4 fw6" href="${item.permalink}">${escapeHtml(item.title || "Untitled")}</a>
            <p class="f6 lh-copy mt2 mb0">${escapeHtml(summary)}</p>
          </li>
        `;
      })
      .join("");
  };

  // 核心逻辑：根据关键词在标题、摘要、正文中做包含匹配
  const filterPages = (keyword) => {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];

    return pages.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const summary = (item.summary || "").toLowerCase();
      const content = (item.content || "").toLowerCase();
      return title.includes(q) || summary.includes(q) || content.includes(q);
    });
  };

  const runSearch = () => {
    const keyword = input.value;
    const results = filterPages(keyword);
    renderResults(results, keyword.trim());
  };

  fetch("/index.json")
    .then((resp) => resp.json())
    .then((data) => {
      pages = Array.isArray(data) ? data : [];
      status.textContent = "Enter keywords to search.";

      const query = new URLSearchParams(window.location.search).get("q");
      if (query) {
        input.value = query;
        runSearch();
      }
    })
    .catch(() => {
      status.textContent = "Search index failed to load.";
    });

  input.addEventListener("input", runSearch);
})();
