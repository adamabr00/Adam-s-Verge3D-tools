# Add menu: variable get/set + procedure no-return/return (Scheme C)

## Chosen shortcut matrix (user selection: Scheme C)

Symmetric mental model: **Shift = variables**, **Ctrl = procedures**; **Alt** picks the “second kind” in each family.

| Outcome | Shortcut (from search input, valid name) |
|---------|------------------------------------------|
| Variable **get** (`variables_get`) | **Shift+Enter** |
| Variable **set** (`variables_set`) | **Alt+Shift+Enter** |
| Procedure **no return** (`procedures_defnoreturn`) | **Ctrl+Enter** |
| Procedure **with return** (`procedures_defreturn`) | **Alt+Ctrl+Enter** |

### Why this avoids conflicts

- **Ctrl+Shift+Enter** is intentionally **not** used, so it cannot collide with “variable set” vs “procedure return.”
- **Alt** cleanly encodes “alternate variant” for both domains (set vs get, return vs no return).

## Mouse / click parity (recommended)

Mirror the same modifiers on click where possible:

- Variable row / create-variable flows: **Alt+Shift+click** → insert **set**; plain click → **get**.
- Procedure create flows: **Alt+Ctrl+click** → **defreturn**; **Ctrl+click** (or plain on procedure button) → **defnoreturn** (align with existing UI).

Exact click behavior should match whatever buttons/rows exist after implementation; update on-screen hints to show Alt+Shift and Alt+Ctrl, not only Shift/Ctrl.

## Implementation notes (when executing)

1. **Enter handler order** (most specific first): check **Alt+Ctrl+Enter**, then **Alt+Shift+Enter**, then **Ctrl+Enter** (require `!altKey` / `!shiftKey` as needed), then **Shift+Enter** (require `!altKey && !ctrlKey` for bare variable get).
2. Replace prior plan to use **Ctrl+Shift** for variable set — superseded by Scheme C.
3. Update footer shortcut hints on “Create Variable” / “Create Procedure” buttons and any `(Shift+Enter)` / `(Ctrl+Enter)` labels to reflect the four chords.
4. **Procedure with return**: use `procedures_defreturn` and set `NAME` like the no-return path.

## Verification

- Four chords each produce the correct block type with a new or existing name as applicable.
- Alt+Shift+Enter does not trigger Shift+Enter branch (narrow conditions with `!e.altKey` where needed).
- Ctrl+Enter does not fire when Alt is held (procedure return path).
