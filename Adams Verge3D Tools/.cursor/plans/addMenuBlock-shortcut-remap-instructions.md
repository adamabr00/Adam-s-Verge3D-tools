# addMenuBlock.block shortcut remap (manual or Agent)

Apply these edits to [`addMenuBlock.block`](Adams Verge3D Tools/addMenuBlock.block).

## Desired behavior

- **New name** (search box): **Shift+Enter** → get · **Alt+Shift+Enter** → set · **Ctrl+Enter** → procedure no return · **Ctrl+Alt+Enter** → procedure with return  
- **Existing variable** from list: plain → get · **Alt** (click or Enter) → set  
- **Create-variable** row / footer (new name): **Alt+click** → set (keyboard: Alt+Shift+Enter from search box)  
- **Create procedure** footer: **Ctrl+click** vs **Ctrl+Alt+click** mirrors Enter chords  

## 1. Template `tooltip` (line ~1)

Replace the `tooltip="..."` attribute with:

```html
tooltip="Shift+A: search. New name: Shift+Enter get, Alt+Shift+Enter set; Ctrl+Enter procedure, Ctrl+Alt+Enter procedure with return. Existing variable from list: Alt for set. Shift+Q / Shift+E: layout (multi-select).">
```

## 2. Variable result `click` (~1191)

`const asSet = ev.ctrlKey && ev.shiftKey` → `const asSet = ev.altKey;`

## 3. Create Variable hint (~1323)

`(Shift+Enter get · Ctrl+Shift+Enter set)` → `(Shift+Enter get · Alt+Shift+Enter set · Alt+click set)`

## 4. Create Variable button `click` (~1351)

`const asSet = ev.ctrlKey && ev.shiftKey` → `const asSet = ev.altKey`

## 5. Create Procedure button: use `(ev)` and branch on alt (~1415–1422)

Replace the click handler body with:

```javascript
             createProcButton.addEventListener('click', (ev) => {
               const blockType = ev.altKey ? 'procedures_defreturn' : 'procedures_defnoreturn';
               const block = createBlockAtCursor(blockType);
               if (block) {
                 block.setFieldValue(originalSearchTerm, 'NAME');
               }
               popup.remove();
             });
```

## 6. Create Procedure hint (~1387)

`(Ctrl+Enter)` → `(Ctrl+Enter · Ctrl+Alt+Enter return)`

## 7. Search `keydown` Enter: quick-create block (~1486–1505)

Replace the four `if` branches with (order matters):

```javascript
           if (e.ctrlKey && e.altKey && !existingProcedure) {
             const block = createBlockAtCursor('procedures_defreturn');
             if (block) {
               block.setFieldValue(searchTerm, 'NAME');
             }
             popup.remove();
             return;
           }

           if (e.altKey && e.shiftKey && !e.ctrlKey && !existingVariable) {
             createVariableAndInsertBlock(searchTerm, true);
             popup.remove();
             return;
           }

           if (e.shiftKey && !e.ctrlKey && !e.altKey && !existingVariable) {
             createVariableAndInsertBlock(searchTerm, false);
             popup.remove();
             return;
           }

           if (e.ctrlKey && !e.shiftKey && !e.altKey && !existingProcedure) {
             const block = createBlockAtCursor('procedures_defnoreturn');
             if (block) {
               block.setFieldValue(searchTerm, 'NAME');
             }
             popup.remove();
             return;
           }
```

Update the comment above this block to describe Alt+Shift / Ctrl+Alt.

## 8. Regular Enter on variable row (~1518)

Replace:

`const asSet = e.ctrlKey && e.shiftKey;`

with:

```javascript
           const asSet = isCreateOption ? (e.altKey && e.shiftKey) : e.altKey;
```

This matches: **Alt+Shift+Enter** for create-option rows (new name from list), **Alt+Enter** only for existing variables.

---

After editing, reload the Puzzles page and test all four quick-create chords plus Alt on an existing variable row.
