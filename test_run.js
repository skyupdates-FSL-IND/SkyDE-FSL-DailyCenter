const fetch = globalThis.fetch || require('node-fetch');

const GOOGLE_SHEET_ID = "1zIUgQUlL6UX_rkMf5lm0fuPBbPd-YDTGGMT3aX3Sxlg";

async function run() {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&headers=1&t=${new Date().getTime()}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    const jsonStr = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonStr);

    let cols = json.table.cols.map(c => c && c.label ? c.label.toString().toLowerCase().trim() : '');
    let rowsToParse = json.table.rows;

    if (cols.every(c => c === '') && rowsToParse.length > 0) {
      cols = rowsToParse[0].c.map(cell => cell && cell.v ? cell.v.toString().toLowerCase().trim() : '');
      rowsToParse = rowsToParse.slice(1); // skip headers row
    }

    const data = rowsToParse.map(row => {
      const obj = {};
      cols.forEach((col, i) => {
        if (col) {
          obj[col] = row.c && row.c[i] && row.c[i].v !== null && row.c[i].v !== undefined ? row.c[i].v : '';
        }
      });
      return obj;
    });

    console.log("Parsed Data:", JSON.stringify(data, null, 2));

    // Simulate render
    const perfData = {};
    data.forEach(item => {
      const type = (item.type || '').toLowerCase().replace(/`/g, '').trim();
      const title = item.title || '';
      console.log(`Processing Item: Type=${type}, Title=${title}`);
    });

  } catch (err) {
    console.error("Error loading Google Sheet:", err);
  }
}

run();
