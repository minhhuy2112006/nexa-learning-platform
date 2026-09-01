# Frontend structure

- `index.html` — static HTML shell and asset entry point.
- `js/app.js` — page rendering, navigation and UI behavior.
- `css/base.css` — global foundation and shared tokens.
- `css/theme-tuning.css` — theme-level adjustments.
- `css/component-tuning.css` — shared component refinements.
- `css/workspace*.css` — product workspace layout, alignment and polish.
- `css/pages/` — page-specific styles (`home`, `learning`, `library`, `reader`, `study-group`).
- `assets/images/` — local image assets used by the frontend.
- `serve.js` — dependency-free local development server.

Run locally from this folder:

```powershell
node serve.js
```