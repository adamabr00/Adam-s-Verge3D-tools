# Adam's Awesome Tools - Verge3D Puzzle Editor Plugins

A collection of powerful plugins that enhance the Verge3D puzzle editor with advanced functionality, keyboard shortcuts, and improved workflow tools.

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

**Key Features:**
- **X key** - Deletes the selected puzzle (same action as Delete key)
- **Shift+D** - Duplicates the selected puzzle
- **M key** - Toggles disable/enable state of the selected puzzle

**Usage:** Select any puzzle in the workspace, then press **X** to delete it, **Shift+D** to create a duplicate, or **M** to toggle the puzzle's enabled/disabled state.

---

### Add Menu Plugin - Q & Shift+A
Provides two powerful menu systems for quickly adding puzzles to the workspace using keyboard shortcuts.

![AddMenu](https://github.com/user-attachments/assets/e66fcea0-bb20-4078-a7cb-6b13bcf4dec5)

**Q Key - Favorites Menu:**
- Opens a popup with commonly used puzzles (if statements, comparisons, math operations, variables, loops, etc.)
- Displays puzzles with category colors and descriptions
- Keyboard navigation with arrow keys and Enter to select
- Creates puzzles at the current mouse cursor position

**Shift+A - Search Menu:**
- Comprehensive search interface for all available puzzles
- **Fuzzy search** using Fuse.js for intelligent matching
- **Variable integration** - search and create variable get blocks
- **Procedure integration** - search and create procedure call blocks
- **Smart suggestions** - offers to create new variables/procedures if they don't exist
- **Keyboard shortcuts:**
  - Shift+Enter: Create new variable
  - Ctrl+Enter: Create new procedure
  - Arrow keys: Navigate results
  - Enter: Select highlighted item

**Usage:** Press **Q** for quick access to favorite puzzles, or press **Shift+A** to search all available puzzles, variables, and procedures.

---

### Improved Search Plugin - Shift+F
Provides an advanced search interface for finding puzzles across all tabs in the workspace.

![SearchPuzzles](https://github.com/user-attachments/assets/fce8c832-2b48-481d-9e4e-4337935e9e3b)

**Key Features:**
- **Cross-tab search** - Searches through all tabs simultaneously
- **Tab-based navigation** - Results organized by tab with individual counters
- **Smart text processing** - Searches puzzle types, field values, and mutation names
- **Real-time highlighting** - Automatically switches to relevant tab and highlights found puzzles
- **Keyboard navigation:**
  - Arrow Up/Down: Navigate within current tab
  - Arrow Left/Right: Switch between tabs
  - Enter: Jump to highlighted puzzle
  - Escape: Close search interface

**Usage:** Press **Shift+F** to open search (pre-fills with selected puzzle type if available). Type to search across all puzzles in all tabs, use arrow keys to navigate results, and press Enter to jump to the highlighted puzzle.

## 🛠️ Installation

1. Copy the `.block` files to your Verge3D puzzle editor plugins directory
2. Restart the puzzle editor
