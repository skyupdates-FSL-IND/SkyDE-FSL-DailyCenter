# Sky Updates - Developer Documentation

Welcome to the **Sky Updates** repository! This is a sleek, modern, single-page informational hub built with a premium "Glassmorphism" aesthetic, animated gradients, and highly responsive native web technologies. 

It is designed to serve as an internal knowledge base and performance dashboard for Sky customer service teams.

This guide is intended for developers taking over the project to understand the core architecture, add new features, update styles, or troubleshoot behaviors.

## 🛠 Tech Stack
- **HTML5**: Leverages semantic tags and native accessible `<details>`/`<summary>` elements for interactive accordions.
- **CSS3 (Vanilla)**: Powered by CSS Variables (`:root`) for easy theming. Utilizes Flexbox/Grid for layout and advanced `backdrop-filter` for glassmorphic blurring.
- **JavaScript (Vanilla JS / ES6)**: Zero framework dependencies. Extremely lightweight scripts handle DOM interactions, custom events, and persistent storage.

---

## 📊 How to Update Content (For Non-Coders)
We have integrated a **Google Sheets Database** module directly into `script.js`. This allows non-coders to update the website's `Flashcards` and `FYI Accordions` simply by editing an Excel-like spreadsheet. 

If this is set up, the website automatically loads the Spreadsheet's data and replaces the hardcoded index tags.

### Step 1: Set up the Google Sheet
1. Create a [new Google Sheet](https://sheets.new/).
2. In the very first row (Row 1), create the following core headers (case-insensitive):
   - **Type**: The most critical column! Tells the website exactly *where* to place your text.
   - **Title**: The main header or title of the update.
   - **Content**: The actual rules, guidelines, or paragraphs.
   - **Date**: Optional (e.g., "26-03-2026"). Appears next to FYI titles.

### 🏷️ Allowed "Type" Names
When filling out the **Type** column in your spreadsheet, you must use one of these exact words so the website knows where to put it:
- `flashcard`: Placed at the very top of the website as the glowing **Important News** banner. *(Best practice: Only keep one of these active at a time!)*
- `fyi`: Placed inside the middle **Fyi Section** as a collapsible dropdown accordion. *(You can add as many of these as you want, they will stack automatically!)*
- `performance`: Placed inside the **Performance Section**. *(Requires specific metric columns. See Example 3 below!)*

### 📝 Step 1.5: Examples of How to Fill the Sheet
To make your updates appear on the website, simply add rows under your headers using these exact formats. The sheet auto-syncs with the website!

**Example 1: Updating the 'Important' Flashcard**
The Flashcard sits at the very top of the page. You only ever need **one** Flashcard active at a time to grab attention.
| Type | Title | Content | Date |
| :--- | :--- | :--- | :--- |
| `flashcard` | Urgent Hotline Update | All agents MUST review the new NCRM guidelines immediately. | *(Leave blank)* |

**Example 2: Adding an 'FYI' Accordion**
The FYI section holds multiple dropdowns. Every row you add with the `Type` set to `fyi` will instantly generate a new accordion on the website.
| Type | Title | Content | Date |
| :--- | :--- | :--- | :--- |
| `fyi` | Account Hacked Protocol | If an account is hacked, do not make changes right away. | 25-03-2026 |

**Example 3: Updating the Performance Dashboard**
To update the data tables for Hyderabad or Bangalore, you need to add these exact headers anywhere in your Row 1: `Row Type`, `NPS`, `Solution Rate`, `RCR`, `Transfer Rate`, `CanX NCRM`, `CanX Siebel`, `Upsell`.
Then, fill in the metrics for **Actuals** in one row, and **Targets** in another row. Both rows must have the exact same *Title* (the city).

| Type | Title | Row Type | NPS | Solution Rate | RCR | Transfer Rate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `performance` | Hyderabad | Actuals | 53 | 68.60% | 30.90% | 2.90% |
| `performance` | Hyderabad | Targets | 65 | 72.00% | 28.0%  | 2.50% |

*(Note: The website automatically matches your 'Actuals' and 'Targets' rows and merges them together into a beautiful HTML table for that specific city!)*

💡 **Formatting Tip**: If you want **multiple paragraphs** in your content, press `ALT + ENTER` (or `OPTION + RETURN` on Mac) inside the Google Sheet cell to create a line break. The website will automatically convert those into beautiful paragraph spacing on the live site!

### Step 2: Make the Sheet Public
1. Click the big **Share** button in the top right.
2. Change the general access from "Restricted" to **"Anyone with the link can view"**.
3. Click Done.

### Step 3: Connect to the Website
1. Look at the URL of your Google Sheet. It looks like this:
   `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs.../edit`
2. **Copy the long ID block** shown between `/d/` and `/edit`.
3. Open `script.js` directly in your code editor or GitHub UI.
4. Scroll to the very bottom to find `const GOOGLE_SHEET_ID = "";`
5. Paste your ID inside the quotes. Save!

**Fallback Mechanism:**
If the `GOOGLE_SHEET_ID` is left empty, the website gracefully defaults to displaying whatever HTML you manually wrote inside `index.html`.

---


## 📁 File Structure
- `index.html`: The core presentation layer. Includes the Navbar (with sticky effect), Theme Toggle Switch, Search Expander, and the active Main Content Sections (`#important-news`, `#fyi` and `#content`). Note: The `#tech` section has been commented out for now.
- `style.css`: Contains CSS variables, typography mapping (Inter font), complex animations (header gradient flow & sun/moon toggle switch), layout systems, and responsive media queries.
- `script.js`: Handles UI reactivity—mobile menu toggle, dynamic in-page search feature (`TreeWalker`), intersection observers for ScrollSpy logic, dynamic Google sheet fetching, and saving/loading theme preferences via `localStorage`.

---

## 🏗 Content Architecture (Current State)
As of the latest updates (March 2026), the platform is structured into three primary portals:
1. **Important News (`#important-news`)**: Features an animated, glowing flashcard designed to natively scale colors between light/dark themes. Contains critical unmissable news.
2. **Fyi (`#fyi`)**: Houses crucial agent updates, including hotline policies, "Account Hacked" guidelines, and NCRM value propositions. These are stored inside `<details class="accordion-item">`.
3. **Performance (`#content`)**: Displays the monthly location-wise tracking dashboards (e.g. Hyderabad, Bangalore) focusing on metrics like NPS, Solution Rate, RCR, Transfer Rate, CanX, and Upsell.

**Footer:** Links pointing explicitly to the external `https://www.sky.de/` portals.

---

## 🎨 Theme System (Dark & Light Mode)
The project embraces a dynamic day-night color swap utilizing CSS Variables defined at the top of `style.css`.
- **Dark Mode (Default):** Variables are clustered inside `:root { ... }`.
- **Light Mode Override:** Variables are swapped out under `html[data-theme="light"] { ... }`.
- **Toggle Mechanism:** Located at the bottom of `script.js`. It listens to the `#ccThemeSwitch` checkbox input. When checked/unchecked, it sets the `data-theme` attribute on the `<html>` element and persists state utilizing `localStorage.setItem('toggleState', ...)`.

💡 **Tip for Adjusting Colors**: 
To modify the main background or navbar colors, locate the `:root` pseudo-class (around Line 5 in `style.css`) and modify variables like `--bg-main` or `--nav-bg`. Need to tweak Light Mode? Tweak variables in `html[data-theme="light"]`.

---

## 🔍 In-Page Search & Highlights System
We implemented a robust client-side search component inside `script.js`.
- **Behavior:** As the user types into `#ccSearchInput`, the JS broadcasts a custom `cc:search:query` event. A listener forces elements with the `.accordion-item` class to hide (`display: none`) unless their text includes the search term.
- **Highlighting:** A nested `TreeWalker` traverses all text nodes inside a matched accordion item, slicing the text to wrap matches in `<mark class="search-highlight">`. It smartly clears them when a new lookup executes or when clearing the search input.

---

## ✨ Adding a New Page Section
Adding new blocks to the main hub is simple and auto-integrates with existing scripts.

**Step 1: HTML Modification**
Duplicate an existing section block inside `<main id="main">` within `index.html`. Ensure you assign a unique `id`.
```html
<section id="features" class="page-section">
  <div class="container">
    <header class="page-section__header">
      <h2>New Features</h2>
      <p class="lead">A brief description...</p>
    </header>
    <!-- Content goes here -->
  </div>
</section>
```

**Step 2: Update the Primary Navigation**
Inside `index.html`, locate `<ul class="cc-nav-list">` (around Line 42) and add your link pointing exactly to the new `id`:
```html
<li><a class="cc-link" href="#features">Features</a></li>
```

**Step 3: Test Dynamic ScrollSpy**
Because your new link targets an `#id`, `script.js`'s `IntersectionObserver` automatically detects the targeted `<section>` and highlights the `<a class="cc-link">` when users scroll down.

---

## 🧩 Components Guide
Use standard snippet patterns to maintain design consistency:

**1. Accordions (Guidelines/Policies/Rules)**
```html
<div class="accordion">
  <details class="accordion-item">
    <summary><span>Rule Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</span></summary>
    <div class="accordion-panel">
      <strong>Your bold guideline goes here.</strong>
    </div>
  </details>
</div>
```

**2. Data Tables (Performance Dashboards)**
*Must be nested inside an accordion panel for proper search/hide behavior.*
```html
<table border="1" style="text-align: center;">
  <tr>
    <th></th>
    <th>NPS</th>
    <th>solution Rate</th>
  </tr>
  <tr>
    <td>Actuals</td>
    <td>55</td>
    <td>67.20%</td>
  </tr>
</table>
```

---

## 📱 Responsiveness Breakdown
The layout adapts via standard `@media` breakpoints at the end of `style.css`:
- `min-width: 1440px`: Maximum container expansion.
- `max-width: 980px`: Desktop text-links are completely hidden (`display: none`). The Mobile Hamburger menu (`#ccMenuToggle`) takes preference. Tables may scroll natively depending on screen viewport.
- `max-width: 767px`: Vertical padding compresses to fit mobile viewports.

---

## 🐞 Troubleshooting Exceptions
- **I updated the Spreadsheet but my Live Website isn't updating?**
  - **Browser Cache**: Your browser saves website assets like `script.js` to save bandwidth. Always do a **Hard Refresh** (`CTRL + F5` on Windows, or `CMD + SHIFT + R` on Mac) to force the browser to grab your newly updated code.
  - **Google Sheets Sync**: Google delays generating their live endpoints by ~1 to 5 minutes natively. However, our script uses strict "Cache-Busting" techniques to force immediate loads!
- **Animated gradient border feels choppy?** The effect is powered by an `::before` pseudo element under `.cc-bar`. Ensure GPU acceleration isn't bogged down by immense DOMs.
- **Search input won't focus?** The input technically expands visually across multiple frames. If focus fails, verify `requestAnimationFrame` exists in the `openSearch()` JS function. 

Please maintain clean commits and strict utilization of Vanilla web standards out of respect for project payload sizing. Happy building! 🚀
