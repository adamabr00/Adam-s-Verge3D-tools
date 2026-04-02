# Adam's Awesome Tools - Verge3D Puzzle Editor Plugins

A collection of powerful plugins that enhance the Verge3D puzzle editor with advanced functionality, keyboard shortcuts, and improved workflow tools. The suite includes **multi-selection**, **layout alignment**, a **minimap**, **cross-tab search**, optional **floating toolbar**, **procedure caller retarget** (context menu), and shared editor helpers loaded from `init.plug`.

Use the **Master** puzzle to chain every tool at once, or add individual blocks from the same plugin category. For a maintainer-oriented overview of how pieces fit together, see [`PROJECT_STATUS.md`](PROJECT_STATUS.md).

## Features

### Math Expression Plugin - Shift+C
Convert mathematical and logical expressions directly into Verge3D puzzles using a keyboard shortcut.

![Mathexpression](https://github.com/user-attachments/assets/2a269b99-17eb-451e-b2bf-c83bcd032580)

**Key Features:**
- **Real-time parsing** with syntax highlighting for mathematical expressions
- **Support for complex operations** including arithmetic (+, -, *, /, ^), trigonometric functions (sin, cos, tan), comparisons (==, !=, >, <, >=, <=), and logical operators (&&, ||, !)
- **Variable handling** - automatically creates variables if they don't exist in the workspace
- **Expression history** - Up/Down arrow keys to cycle through previously entered expressions
- **Modern UI** with a transparent overlay featuring real-time validation and syntax highlighting
- **Smart positioning** - places generated puzzles at the center of the workspace view

**Usage:** Press **Shift+C** to open the expression input dialog. Type mathematical expressions like `5 + x * 2` or logical expressions like `a > 5 && b < 10`. The system validates in real-time and converts valid expressions into appropriate Verge3D puzzles.

---

### Keyboard Shortcuts Plugin
Adds convenient keyboard shortcuts for common puzzle operations, enhancing the user experience in the puzzle editor.

![ShortCutPuzzles](https://github.com/user-attachments/assets/9b0871e3-3e48-46ed-abb9-1a769367bf29)

**Key Features:**
- **X key** - Deletes the selected puzzle (same action as Delete key); with **Multi-Select**, deletes every selected block
- **Shift+D** - Duplicates the selected puzzle; with **Multi-Select**, duplicates **multiple** top-level stacks in one action
- **M key** - Toggles disable/enable state of the selected puzzle
- **C key** - Toggles collapse/expand state of the selected puzzle

**Usage:** Select any puzzle in the workspace, then press **X** to delete it, **Shift+D** to create a duplicate, or **M** to toggle the puzzle's enabled/disabled state. Install the **Multi-Select** puzzle for bulk delete/duplicate behavior.

---

### Add Menu Plugin - Q & Shift+A
Provides two powerful menu systems for quickly adding puzzles to the workspace using keyboard shortcuts. The menus have been **refreshed** to work smoothly with the newer search, multi-select, and toolbar workflows.

![AddMenuV2](https://github.com/user-attachments/assets/98ea11a7-95f9-4a8d-9818-17e9c966e49a)

**Q Key - Favorites Menu:**
- Opens a popup with commonly used puzzles (if statements, comparisons, math operations, variables, loops, etc.)
- Displays puzzles with category colors and descriptions
- Keyboard navigation with arrow keys and Enter to select
- Creates puzzles at the current mouse cursor position

**Shift+A - Search Menu:**
- Comprehensive search interface for all available puzzles
- **Fuzzy search** using Fuse.js for intelligent matching
- **Variable integration** - search existing variables or create new ones; insert a **getter** or **setter** block depending on modifiers (see below)
- **Procedure integration** - search procedure calls, or **define** a new procedure with or without a return value (see below)
- **Supports Shadow Defaults** - Brings in the default values found in the toolbox
- **Smart suggestions** - offers to create new variables/procedures if they don't exist
- **Keyboard shortcuts (navigation):**
  - Arrow keys: Move through results
  - Enter: Activate the highlighted row (combined with modifiers below when creating from the typed name)

**New variable name (typed in the search box — valid identifier, not already in use):**
- **Shift+Enter** — Create the variable and insert a **get** block (read the value)
- **Alt+Shift+Enter** — Create the variable and insert a **set** block (assign the value)
- **“Create Variable …” button:** normal click = **get** · **Alt+click** = **set**

**New variable row (you moved the highlight to “Create Variable …” in the results list):**
- **Enter** — **get**
- **Alt+Shift+Enter** — **set** (same pattern as the typed-name shortcuts above)

**Existing variable (chosen from the list):**
- **Enter** — Insert a **get** block
- **Alt+Enter** — Insert a **set** block
- **Click** a row — **get** · **Alt+click** — **set**

**New procedure name (typed in the search box — valid identifier, not already in use):**
- **Ctrl+Enter** — Create a **procedure without return** (definition block has no return socket)
- **Ctrl+Alt+Enter** — Create a **procedure with return** (definition block includes a return value)

**“Create Procedure …” button (same typed name):**
- **Click** — New procedure **without** return
- **Alt+click** — New procedure **with** return

**Usage:** Press **Q** for quick access to favorite puzzles, or press **Shift+A** to search all available puzzles, variables, and procedures. Hold **Alt** when you want a **setter** instead of a **getter** for variables, or a **returning procedure** instead of a plain procedure when creating definitions from the menu.

---

### Improved Search Plugin - Shift+F
Provides an advanced search interface for finding puzzles across all tabs in the workspace.

![SearchPuzzles](https://github.com/user-attachments/assets/fce8c832-2b48-481d-9e4e-4337935e9e3b)

**Key Features:**
- **Cross-tab search** - Searches through all tabs simultaneously
- **Tab-based navigation** - Results organized by tab with individual counters
- **Smart text processing** - Searches puzzle types, field values, and mutation names
- **Debounced search** - Reduces work while typing for smoother performance on large projects
- **Collapsed blocks** - Matches inside collapsed stacks are found and surfaced when navigating results
- **Stronger highlighting** - Glow-style emphasis on the active match in the workspace
- **UI hints** - Inline guidance for shortcuts and navigation
- **Predictable first open** - Does not auto-jump the viewport on the first open; you stay in control until you pick a result
- **Real-time highlighting** - Automatically switches to relevant tab and highlights found puzzles
- **Keyboard navigation:**
  - Arrow Up/Down: Navigate within current tab
  - Arrow Left/Right: Switch between tabs
  - Enter: Jump to highlighted puzzle
  - Escape: Close search interface

**Usage:** Press **Shift+F** to open search (pre-fills with selected puzzle type if available). Type to search across all puzzles in all tabs, use arrow keys to navigate results, and press Enter to jump to the highlighted puzzle.

---

### Local View Plugin - Shift+H
Provides a focused view mode that shows only the selected puzzle block and its connected blocks, hiding all others for visual clarity in cluttered workspaces.

**Key Features:**
- **Visual focus mode** - Shows only the selected block and all blocks connected to it (via previous, next, output, and input connections)
- **Non-destructive** - Hiding is visual only; puzzle execution remains unaffected
- **Tab-scoped** - Only hides blocks within the current tab
- **Visual indicator** - Displays "Local View" indicator in the top-right corner when active
- **Toggle functionality** - Press Shift+H again to restore all blocks
- **Smart connection detection** - Automatically includes all blocks in statement chains, value inputs, and output connections
- **Collapsed state preservation** - Maintains collapsed/expanded state of blocks when toggling local view

**Usage:** Select any puzzle block in the workspace, then press **Shift+H** to enter local view mode. Only the selected block and its connections will be visible. Press **Shift+H** again to exit local view and show all blocks. The "Local View" indicator appears in the top-right corner when active.

---

### Multi-Select Plugin
Adds **multi-selection** on top of Blockly’s single selection: select several blocks, run bulk actions, and use **layout preview** tools for alignment and spacing.

**Key Features:**
- **Shift+Click** - Add or remove blocks from the selection
- **Shift+drag on empty workspace** - Marquee / drag selection (gesture integration with Blockly)
- **Ctrl+B** - One-shot box selection overlay
- **X** - Delete all selected blocks (with the Keyboard Shortcuts plugin)
- **Shift+D** - Duplicate **multiple top-level stacks** at once when the Keyboard Shortcuts plugin is present
- **G** - Multi-drag with connection preservation (works with the G-Drag plugin)
- **Layout previews** - **Ctrl+Q** / **Shift+Q** for horizontal alignment preview, **Ctrl+E** / **Shift+E** for vertical spacing preview; mouse to preview, click to commit, **Esc** to cancel
- **WASD** - Nudge during layout preview where supported

**Usage:** Add **Enable Multi-Selection** to your master chain (after shortcuts/search/minimap/add menu is recommended). Use Shift+click and box select to build a selection, then delete, duplicate, or open layout previews. See the block tooltip in the editor for the full shortcut list.

---

### Move to Tab Plugin - Shift+T
Moves the current **multi-selection** (or Blockly’s primary selection when nothing is multi-selected) from the active tab to another tab by **cut + paste**, preserving each stack’s **XY** position.

**Key Features:**
- **Shift+T** - Opens a small picker: filter existing tabs, type a **new tab name** to create it, then **Move**
- **Multi-select aware** - Moves unique **chain roots** only (same root logic as bulk duplicate/delete)
- **Procedure-safe (best effort)** - Serialized blocks keep their **Blockly IDs**; destination proxies that would collide are removed before paste so definitions don’t duplicate
- **Undo** - Move is performed inside Blockly event groups (`Blockly.Events.setGroup`) so **Undo** should reverse the paste/delete steps together where the editor allows

**Usage:** Add **Move selection to tab** to your master chain (after **Enable Multi-Selection** is recommended). Select block(s), press **Shift+T**, pick or name the destination tab, confirm. Optional script API: `window.__adamMoveBlocksToTab('MyTab', { createIfMissing: true })`.

**Manual checks:** Move one stack and several stacks to an existing tab; create a new tab via the dialog; move a procedure definition while callers stay in another tab; try **Undo** after a move.

---

### Procedure retarget (editor context menu)

Adds a **right-click** action on **procedure caller** blocks (both “run procedure” and “run procedure with return”): **Retarget all callers of “…” to…**

**Behavior:**

- Prompts for the **target procedure name** (must already exist on every tab that still has callers of the old name).
- Updates **all** caller blocks that used the old name, across **all** puzzle tabs (`Blockly.Workspace.getAll()`), in one undo group.
- The target definition must **match caller type** (procedure with return vs without return). After retargeting, `Blockly.Procedures.mutateCallers` runs where applicable so arguments line up with the new definition when Blockly supports it.

**Usage:** Add the **Procedure retarget (editor context menu)** puzzle to the **Master** chain (or place it once in the workspace). Open the Puzzles editor with **`?logic`**. Right-click a **caller** block → choose **Retarget all callers…** → enter the new procedure name.

Implementation note: the menu entry is registered with Blockly’s **`ContextMenuRegistry`** (Blockly 9+), not by patching `Blockly.Blocks[…].customContextMenu`, so it appears for all procedure caller blocks including ones already on the workspace when the editor loaded.

**Limitations:** Does not move procedure definitions; only repoints callers. If the target procedure does not exist on a tab that still has callers of the old name, validation fails with an alert.

---

### Minimap Plugin
Adds a **draggable minimap** in the corner of the puzzle editor so you can see the whole workspace and your current viewport at a glance.

**Key Features:**
- **Resizable panel** - Drag the panel edge to resize; the map redraws to fill the new area
- **Toolbar-matched styling** - Gray panel chrome consistent with the floating toolbar
- **Click to jump** - Left-click centers the main workspace on that minimap location
- **Drag to pan** - After clicking, hold and drag to pan; tracking uses window-level listeners so it keeps working if the pointer leaves the minimap
- **Separate drag handle** - Move the whole panel by dragging the grip handle only (canvas stays for navigation)

**Usage:** Add the **Add Minimap** puzzle to your chain. Drag the grip to reposition the panel. Resize the panel to change the map size. Click and drag on the map to move the workspace view.

---

### Floating Toolbar Plugin
Optional **horizontal icon bar** for common actions (add menu, local view, math, minimap toggle, improved search, layout align/spacing). **Only runs in the Visual Logic editor when the page URL includes `?logic`.**

**Key Features:**
- **Quick actions** - Same shortcuts as the rest of the suite, exposed as icons
- **Draggable** - Grab the left grip to move the bar
- **Position remembered** - Stored per URL in **browser localStorage** (not inside your `.blend` or puzzle XML)
- **Integrates with multi-select** - Layout actions align with multi-select previews where applicable

**Usage:** Open the puzzle editor with **`?logic`** in the URL, add **Floating toolbar** after other Adam puzzles in the master chain, reload, and use the bar. If `?logic` is missing, the toolbar skips loading (see browser console).

---

### G-Drag Puzzles Plugin
Provides an simple block dragging interface with connection preservation and restoration.

![GrabPuzzle](https://github.com/user-attachments/assets/ec6fb249-ef14-45e1-b1d3-dd93ec592a90)

**Key Features:**
- **Keyboard shortcut** - Press **G** to grab the selected block
- **Smart connection handling** - Preserves all block connections (value, statement, input) during drag operations
- **Click to drop** - Simple click interface for precise placement
- **Right-click restore** - Restores the block to its original position with all connections intact

**Usage:** Select any block in the workspace, then press **G** to initiate drag mode. Click anywhere to drop the block in its new position, or right-click to cancel and restore the block to its original location with all connections preserved.


## 🛠️ Installation

1. Copy the **`Adams Verge3D Tools`** plugin folder (including **`init.plug`** and all **`.block`** files) into your Verge3D puzzle editor plugins directory.
2. Restart the puzzle editor.
3. In Visual Logic, add blocks from **Adam's Custom Tools** — use **Adam's Awesome Tools - Master** to run the full pre-wired chain, or add individual puzzles.

**Optional:** `adamEditorCommon.js` mirrors small globals normally injected by `init.plug` (`?logic` detection, typing guard, shared panel styles). Include it only if you load puzzles without the standard `init.plug` bootstrap.

**Floating toolbar:** Open the editor with **`?logic`** in the query string (e.g. your usual Visual Logic URL with `?logic` appended) so the floating toolbar and other logic-only features can initialize.
