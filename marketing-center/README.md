# Revive — Marketing center

React + TypeScript (Vite) implementation of the **"mc v2"** section of the Figma file
[`UgiIveCwRYifQFdoXliO2e`](https://www.figma.com/design/UgiIveCwRYifQFdoXliO2e/Untitled?node-id=1-3264).
All 20 frames of that section are built as one interactive app.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into dist/
```

Open `#/screens` to get a list of every Figma frame, each linked to the URL that opens
the app in that exact state (open menus, modals, toasts, search queries).

## Pages

| Route | Figma frames |
| --- | --- |
| `#/` | Custom project empty state, With custom project, Full view, Products / Categories / Project dropdowns, Bookmark success message, Search address, Search marketing templates |
| `#/search?q=…` | Search result — single category, general, empty state (+ Submit request modal and its dropdowns) |
| `#/projects/:id` | Custom project marketing materials |
| `#/templates/:id` | Template preview (+ Edit profile modal) |

Interactive behaviour: project stage/status filters and "Show all / less projects";
product and category filters, "Show bookmarked materials", template search with
suggestions; global address search with suggestions and a results page; bookmarking
with success/info toasts (persisted in `localStorage`); dismissible Revive AI banner;
Edit profile modal (uploads, selects, save enabled once something changes);
Submit request modal (send enabled once both selects are chosen); Share / Download on
the template preview.

## Assets

* **SVGs** (icons, logo, empty-state illustration) are exported from the Figma file and
  live in `public/assets/`. A few 12 px icons use their main component's glyph, because
  the instance's stroke override can't be expressed in an SVG export; the instance
  colour is applied.
* **Raster images** (house photo, template thumbnails, template artwork, avatars, app QR
  code) need a Figma token to download:

  ```bash
  FIGMA_TOKEN=<personal access token> npm run fetch-assets
  ```

  This writes PNG exports of the exact image layers into `public/assets/images/`.
  Until then, image slots keep their size and show their background colour.

## Structure

```
src/
  data/catalog.ts        sample projects, templates, filter options, profile
  lib/                   hash router, app store (bookmarks, toasts, modals), search, asset URLs
  components/ui/         Button, Badge, Icon, inputs, Dropdown / Select menus, Modal, Toast
  components/            Sidebar, PageHeader, Autocomplete, cards, modals
  pages/                 Dashboard, Search, Project, Template preview, Screens index
  styles/                tokens.css (Figma variables), base, components, pages
```
