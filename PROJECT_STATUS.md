# Adam’s Verge3D Tools — project status overview

*Last updated: April 2026 — for sharing “where we’re at” with collaborators.*

This document summarizes the **Adam’s Awesome Tools** Verge3D puzzle-editor plugin collection: what it contains, how pieces fit together, what’s landed in git history, and what is currently in active development on the `dev` branch (including local changes not yet pushed).

---

## What this repository is

A **plugin pack** for the Verge3D **Visual Logic / puzzle editor**: each feature is a `.block` file, wired through `Adams Verge3D Tools/init.plug`. The pack adds **keyboard shortcuts, search, multi-selection, layout tools, a minimap, floating UI**, and supporting scripts so authors can work faster in large Blockly workspaces.

**Upstream:** [Adam-s-Verge3D-tools](https://github.com/adamabr00/Adam-s-Verge3D-tools) (this repo).

---

## Plugin inventory (master chain)

The recommended load order is defined in `init.plug` inside the **master** block’s statement chain. Typical order:

| # | Block | Role (short) |
|---|--------|----------------|
| 1 | `shortCutsBlock` | X / Shift+D / M / C style shortcuts |
| 2 | `improvedSearch` | Shift+F cross-tab search |
| 3 | `minimap` | Draggable minimap + workspace navigation |
| 4 | `addMenuBlock` | Q favorites + Shift+A fuzzy add menu |
| 5 | `grabBlock` | G grab / move helper |
| 6 | `mathExpression` | Shift+C math → puzzles |
| 7 | `localView` | Shift+H local focus view |
| 8 | `multiSelect` | Multi-select, box select, layout align/spacing |
| 9 | `floatingToolbar` | Optional horizontal icon bar (`?logic` required) |

The **`masterBlock`** puzzle runs all chained tools in one go; individual blocks can also be added separately from the same category.

---

## User-facing capabilities (summary)

- **Search:** Shift+F — cross-tab search, highlighting, navigation (see `improvedSearch.block`; README has feature bullets).
- **Add menu:** Q / Shift+A — favorites and Fuse.js search with variables/procedures (see `addMenuBlock.block`).
- **Shortcuts block:** Delete / duplicate / toggle / collapse (see `shortCutsBlock.block`).
- **Math:** Shift+C — expression entry (see `mathExpression.block`).
- **Local view:** Shift+H — hide unrelated blocks in the tab (see `localView.block`).
- **Grab:** G — drag helper (see `grabBlock.block`).
- **Multi-select:** Shift+click, shift+drag / Ctrl+B box select, multi-delete, Shift+D duplicate stacks when shortcuts block is present, layout previews with **Ctrl+Q / Shift+Q** and **Ctrl+E / Shift+E** (align / spacing), Esc to cancel — see `multiSelect.block` tooltip and console banner.
- **Floating toolbar:** Draggable bar with quick actions; position stored in **localStorage** per URL; **requires `?logic`** on the editor URL — see `floatingToolbar.block`.
- **Minimap:** Draggable panel, **resize** to scale map, **gray chrome** aligned with toolbar, **click to jump**, **drag to pan** — see `minimap.block`.

---

## Shared editor bootstrap (`__adamEditorCommon`)

`init.plug` embeds a small script (mirrored in optional `adamEditorCommon.js`) that defines:

- `__adamHasLogicParam()` — whether the URL has `logic` (used by tools that should only run in the logic editor).
- `__adamIsTypingTarget(el)` — avoids stealing keys when typing in inputs / contenteditable.
- `__adamGlassStyles` — shared CSS snippets for glass-style panels.

Plugins that depend on “not typing in a field” or “only with `?logic`” rely on these helpers.

---

## Git history — major themes (recent commits)

From `git log` (newest first, abbreviated):

- **Multi-select** — large `multiSelect.block` addition and integration (`e1f6ca6` and related).
- **Improved search** — debouncing, collapsed highlighting, UI hints, glow highlight, no auto-jump on first search (`98c3778`, `391ab83`, `f1a1a7e`, `cdc82ff`, `8d18467`).
- **Local view** — dedicated block and docs (`4294c80`).
- **README** — plugin descriptions and screenshots (`a469f58`, etc.).
- **Blockly selection notes** — `cursor_blockly_block_selection_handling.md` expanded (`48b320d`).

Older commits cover **master block**, **init.plug**, **add-menu shadow defaults**, naming, and initial uploads.

---

## Current branch / sync status

- **Branch:** `dev` (example local state: **behind `origin/dev` by several commits** — pull/merge before publishing).
- **Working tree:** Many files under `Adams Verge3D Tools/` are **modified locally** (not only minimap): multi-select, add menu, search, shortcuts, grab, math, local view, master, init, etc.
- **New / untracked examples:** `floatingToolbar.block`, `adamEditorCommon.js`, `.cursor/` plans, optional `improvedSearch copy.js` — treat as **in-progress or optional** until committed and documented in README.

*Exact file lists change daily — run `git status` before sharing a build.*

---

## Recent development themes (local + session work)

These items reflect what has been **worked on in this repo**, including changes that may still be uncommitted:

1. **Minimap (`minimap.block`)** — Resizable panel: canvas size follows `ResizeObserver` on the map area. Visual style matches the **floating toolbar** (gray panel, border, shadow). Interaction: **left-click** centers the workspace on that point; **hold and drag** pans using `workspace.scroll` deltas tied to minimap scale; panel position still dragged via the **grip handle** only.

2. **Floating toolbar (`floatingToolbar.block`)** — Horizontal icon bar, draggable, persisted position; integrates with minimap toggle, add menu, local view, math, search, multi-select layout actions, etc.

3. **Multi-select (`multiSelect.block`)** — Box select, stack operations, layout preview shortcuts aligned with toolbar messaging; ongoing integration with keyboard shortcut block.

4. **Init / shared code** — `init.plug` keeps the embedded block database and `__adamEditorCommon` bootstrap; `adamEditorCommon.js` is an optional standalone copy for pages that do not load `init.plug`.

5. **Documentation** — `cursor_blockly_block_selection_handling.md` documents Blockly 8.0.1 single-selection behavior and informs multi-select design. Root `README.md` remains the **user-facing** feature list for the pack.

---

## Documentation map

| Document | Purpose |
|----------|---------|
| `README.md` | Install steps, feature screenshots, shortcut table |
| `PROJECT_STATUS.md` | This file — repo status for collaborators |
| `cursor_blockly_block_selection_handling.md` | Blockly selection internals / research notes |
| `.cursorrules` / `VERGE3D_PLUGINS_REFERENCE.md` (if present) | Authoring conventions |

---

## Suggested “share” checklist

When sharing a build or writing release notes:

1. Run **`git status`** and **`git log -5`** on your branch.
2. Confirm **`?logic`** behavior for toolbar users and **`init.plug`** load order.
3. Point readers to **`README.md`** for end-user features and to **this file** for engineering status.
4. After merging upstream, **delete or archive** obsolete scratch files (e.g. duplicate search scripts) so the tree matches what you describe.

---

*This overview is descriptive, not a legal changelog. For exact line-by-line history, use `git log` and `git diff`.*
