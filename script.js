// Mobile menu toggle
const ccMenuToggle = document.getElementById('ccMenuToggle');
const ccPrimaryNav = document.getElementById('ccPrimaryNav');

ccMenuToggle?.addEventListener('click', () => {
  const open = ccPrimaryNav.classList.toggle('open');
  ccMenuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Mobile dropdown expand/collapse
const ddParents = Array.from(document.querySelectorAll('.cc-has-dropdown'));

function isMobile() {
  return window.matchMedia('(max-width: 980px)').matches;
}

ddParents.forEach(li => {
  const trigger = li.querySelector('a.cc-link');
  trigger.addEventListener('click', (e) => {
    if (isMobile()) {
      e.preventDefault();
      li.classList.toggle('open');
    }
  });
});

// Close nav when a link is clicked (mobile)
document.querySelector('.cc-nav-list')?.addEventListener('click', (e) => {
  if (!isMobile()) return;
  if (e.target.closest('a')) {
    ccPrimaryNav.classList.remove('open');
    ccMenuToggle.setAttribute('aria-expanded', 'false');
  }
});


// Search listener for search function

// Very simple filter example
const SCOPE = '.accordion-item';

function clearHighlights(root) {
  const marks = root.querySelectorAll('mark.search-highlight');
  marks.forEach(mark => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  });
}

function applyHighlights(root, query) {
  if (!query) return;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim() !== '') {
      textNodes.push(node);
    }
  }
  
  textNodes.forEach(textNode => {
    if (textNode.nodeValue.toLowerCase().includes(query.toLowerCase())) {
      const fragment = document.createDocumentFragment();
      const parts = textNode.nodeValue.split(regex);
      parts.forEach(part => {
        if (part.toLowerCase() === query.toLowerCase()) {
          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });
}

function filterBlocks(q) {
  const query = (q || '').trim().toLowerCase();
  const blocks = Array.from(document.querySelectorAll(SCOPE));
  
  // Clear previous highlights
  blocks.forEach(b => clearHighlights(b));

  if (!query) {
    blocks.forEach(b => { b.style.display = ''; if (b.tagName === 'DETAILS') b.open = b.hasAttribute('data-default-open') || false; });
    return;
  }
  blocks.forEach(b => {
    const match = (b.textContent || '').toLowerCase().includes(query);
    b.style.display = match ? '' : 'none';
    if (match) {
        if (b.tagName === 'DETAILS') b.open = true;
        // Highlight matched text
        applyHighlights(b, query);
    }
  });
}

document.addEventListener('cc:search:query', (e) => filterBlocks(e.detail.q));
document.addEventListener('cc:search:clear', () => filterBlocks(''));

// Search function JS below logic

/* =========================
   SEARCH: expand + in-page
========================= */
(function () {
  const wrap  = document.getElementById('ccSearchWrap');
  const btn   = document.getElementById('ccSearchBtn');
  const input = document.getElementById('ccSearchInput');

  if (!wrap || !btn || !input) {
    console.warn('[search] Missing element(s):', { wrap: !!wrap, btn: !!btn, input: !!input });
    return;
  }

  function openSearch() {
    wrap.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    // Wait one frame so width transition applies before focus
    requestAnimationFrame(() => input.focus());
  }

  function closeSearch() {
    wrap.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    input.value = '';
    // If you wired filtering logic, reset it here
    const evt = new CustomEvent('cc:search:clear');
    document.dispatchEvent(evt);
  }

  btn.addEventListener('click', () => {
    const isOpen = wrap.classList.contains('active');
    if (isOpen) {
      input.focus();
    } else {
      openSearch();
    }
  });

  // Type to broadcast query (you can listen elsewhere to filter content)
  input.addEventListener('input', (e) => {
    const evt = new CustomEvent('cc:search:query', { detail: { q: e.target.value } });
    document.dispatchEvent(evt);
  });

  // Esc to close
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      btn.focus();
    }
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      if (wrap.classList.contains('active')) closeSearch();
    }
  });
})();

// AUTO-HEIGHLIGHT ACTIVE NAV ITEMS ON SCROLL

// Active section highlight in the nav (anchors must point to #spare, #content, #fyi, #tech)
(function () {
  const navLinks = Array.from(document.querySelectorAll('.cc-nav-list a[href^="#"]'));
  if (!navLinks.length) return;

  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(sec => io.observe(sec));
})();




// NEW BUTTON TOGGLE SWITCH JAVASCRIPT
const toggleInput = document.getElementById('ccThemeSwitch');
if (toggleInput) {
  const initialState = localStorage.getItem('toggleState') === 'true';
  toggleInput.checked = initialState;

  if (initialState) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggleInput.addEventListener('change', function() {
    localStorage.setItem('toggleState', toggleInput.checked);
    if (toggleInput.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });
}


/* =========================================
   GOOGLE SHEETS DYNAMIC CONTENT INTEGRATION
   ========================================= */
// 1. Create a Google Sheet. Make exactly 4 columns: Type, Title, Content, Date
// 2. Click Share -> "Anyone with the link can view".
// 3. Extract the long ID from the URL and paste it here:
const GOOGLE_SHEET_ID = "1zIUgQUlL6UX_rkMf5lm0fuPBbPd-YDTGGMT3aX3Sxlg"; // e.g., "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

async function loadDynamicContent() {
  if (!GOOGLE_SHEET_ID) {
    console.log("No Google Sheet ID provided. Using hardcoded HTML templates.");
    return;
  }

  // Google Visualization API returns JSON wrapped in a function call
  // We append timestamp '&t=...' to bust browser caches so live updates work!
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&headers=1&t=${new Date().getTime()}`;

  try {
    // Add cache: 'no-store' to ensure recent changes are pulled natively
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    // Google returns a JSONP wrapper, we slice it off to get raw JSON structure
    const jsonStr = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonStr);

    // 1. Extract headers. If Google failed to map them to 'label', use the first data row.
    let cols = json.table.cols.map(c => c && c.label ? c.label.toString().toLowerCase().trim() : '');
    let rowsToParse = json.table.rows;

    if (cols.every(c => c === '') && rowsToParse.length > 0) {
      cols = rowsToParse[0].c.map(cell => cell && cell.v ? cell.v.toString().toLowerCase().trim() : '');
      rowsToParse = rowsToParse.slice(1); // skip headers row
    }

    // 2. Reconstruct array of objects mapped to those headers
    const data = rowsToParse.map(row => {
      const obj = {};
      cols.forEach((col, i) => {
        if (col) {
          obj[col] = row.c && row.c[i] && row.c[i].v !== null && row.c[i].v !== undefined ? row.c[i].v : '';
        }
      });
      return obj;
    });

    renderDynamicContent(data);
  } catch (err) {
    console.error("Error loading Google Sheet:", err);
  }
}

function renderDynamicContent(data) {
  const flashcardContainer = document.getElementById('flashcard-container');
  const fyiContainer = document.getElementById('fyi-accordion-container');
  const perfContainer = document.getElementById('performance-accordion-container');
  
  if (!flashcardContainer || !fyiContainer) return;

  // Clear hardcoded HTML so we can build it from the spreadsheet data
  flashcardContainer.innerHTML = '';
  fyiContainer.innerHTML = '';
  if (perfContainer) perfContainer.innerHTML = '';

  const perfData = {};

  data.forEach(item => {
    const type = (item.type || '').toLowerCase().trim();
    const title = item.title || '';
    const content = item.content || '';
    const date = item.date || '';

    // Transform multiline cell text into HTML line breaks
    const formattedContent = content.toString().replace(/\n/g, '<br><br>');

    if (type === 'flashcard') {
      const card = document.createElement('div');
      card.className = 'flashcard';
      card.innerHTML = `
        <h2 class="flashcard-title">${title}</h2>
        <p class="flashcard-text">${formattedContent}</p>
      `;
      flashcardContainer.appendChild(card);
    } 
    else if (type === 'fyi') {
      const details = document.createElement('details');
      details.className = 'accordion-item';
      
      const dateHtml = date ? `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${date}` : '';
      details.innerHTML = `
        <summary><span>${title} ${dateHtml}</span></summary>
        <div class="accordion-panel">
          <strong>${formattedContent}</strong>
        </div>
      `;
      fyiContainer.appendChild(details);
    }
    else if (type === 'performance') {
      const rowType = (item['row type'] || '').toLowerCase(); // "actuals" or "targets"
      if (!title) return; // Need a city name (title)
      
      if (!perfData[title]) perfData[title] = {};
      perfData[title][rowType] = {
        nps: item.nps || '',
        solution: item['solution rate'] || '',
        rcr: item.rcr || '',
        transfer: item['transfer rate'] || '',
        canx_ncrm: item['canx ncrm'] || '',
        canx_siebel: item['canx siebel'] || '',
        upsell: item.upsell || ''
      };
    }
  });

  // Render Performance Tables
  if (perfContainer) {
    for (const [city, rows] of Object.entries(perfData)) {
      const actuals = rows['actuals'] || {};
      const targets = rows['targets'] || {};

      const details = document.createElement('details');
      details.className = 'accordion-item';
      details.innerHTML = `
        <summary><span>${city}</span></summary>
        <div class="accordion-panel" style="overflow-x: auto;">
          <table border="1" style="text-align: center; width: 100%; min-width: 600px; margin-top: 10px;">
            <tr>
              <th></th>
              <th>NPS</th>
              <th>Solution Rate</th>
              <th>RCR</th>
              <th>Transfer Rate</th>
              <th>CanX NCRM</th>
              <th>CanX Siebel</th>
              <th>Upsell</th>
            </tr>
            <tr>
              <td><strong>Actuals</strong></td>
              <td>${actuals.nps || ''}</td>
              <td>${actuals.solution || ''}</td>
              <td>${actuals.rcr || ''}</td>
              <td>${actuals.transfer || ''}</td>
              <td>${actuals.canx_ncrm || ''}</td>
              <td>${actuals.canx_siebel || ''}</td>
              <td>${actuals.upsell || ''}</td>
            </tr>
            <tr>
              <td><strong>Targets</strong></td>
              <td>${targets.nps || ''}</td>
              <td>${targets.solution || ''}</td>
              <td>${targets.rcr || ''}</td>
              <td>${targets.transfer || ''}</td>
              <td>${targets.canx_ncrm || ''}</td>
              <td>${targets.canx_siebel || ''}</td>
              <td>${targets.upsell || ''}</td>
            </tr>
          </table>
        </div>
      `;
      perfContainer.appendChild(details);
    }
  }

  // Re-run search listener just in case they typed while it was loading
  document.dispatchEvent(new CustomEvent('cc:search:clear'));
}

document.addEventListener('DOMContentLoaded', loadDynamicContent);
