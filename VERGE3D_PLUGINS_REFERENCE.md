# Verge3D Puzzles Plugins Reference

> Reference documentation for creating custom plugins for Verge3D Puzzles Editor

## Table of Contents

1. [Installing Plugins](#installing-plugins)
2. [Plugin Files Overview](#plugin-files-overview)
   - [init.plug File Format](#initplug-file-format)
   - [.block File Format](#block-file-format)
3. [Plugin and Block Errors](#plugin-and-block-errors)
4. [Sharing Your Plugin](#sharing-your-plugin)

---

## Installing Plugins

Plugins are folders containing plugin-relevant files. To be recognized by the Puzzles Editor:

- **Location**: Place plugins inside the `puzzles/plugins` subfolder within the Verge3D installation folder
- **Example Path**: `C:\Program Files\Verge3D_for_Blender\puzzles\plugins`
- **Activation**: After reloading the Editor's page, installed plugins appear at the bottom of the Editor's toolbox

**Example Plugin**: [ExamplePlugin.zip](https://www.soft8soft.com/docs/files/puzzles/ExamplePlugin.zip) - Contains examples of typical puzzle blocks

---

## Plugin Files Overview

A typical plugin consists of:
- **init.plug** - Mandatory file containing general plugin settings
- **.block files** - One file per puzzle block definition

Both file formats support HTML syntax highlighting in text editors.

---

## init.plug File Format

The `init.plug` file is mandatory and defines:
- Toolbox entry appearance
- Available puzzle blocks
- Plugin-wide initialization JavaScript code

### Basic Structure

```xml
<category name="My Awesome Plugin" color="green">
    <label text="My Awesome Plugin v1.0"></label>
    <block type="myPuzzle"></block>
    <block type="doSomethingCool"></block>
</category>

<script>
function code() {
    return `console.log('Powered by My Awesome Plugin!');`;
}
</script>
```

### Category Element

The `<category>` element is an XML tree that defines how the plugin appears in the toolbox. **If omitted, the plugin won't load.**

#### Toolbox Entry Name

Set via the `name` attribute:

```xml
<category name="My Awesome Plugin"></category>
```

#### Toolbox Entry Color

Set via the `color` attribute. Color formats:

- **Hex triplet**: `#f61` or `#f0562f`
- **Hue value**: `0-360` (HSV with S=45%, V=65%)
- **Color keywords**: `aqua`, `black`, `blue`, `fuchsia`, `gray`, `green`, `lime`, `maroon`, `navy`, `olive`, `purple`, `red`, `silver`, `teal`, `white`, `yellow`

```xml
<category name="My Awesome Plugin" color="green"></category>
```

#### Available Puzzles

Puzzle blocks are specified via `<block>` elements with a `type` attribute. The `type` can reference:

1. **Plugin's own blocks**: Use the `.block` filename (without extension)
   ```xml
   <block type="myPuzzle"></block>
   ```

2. **Stock puzzle blocks**: Use the stock puzzle type name
   ```xml
   <block type="math_number"></block>
   ```

3. **Other plugins' blocks**: Use `PLUGIN_DIRECTORY_NAME/PUZZLE_TYPE` format
   ```xml
   <block type="E-Commerce/placeOrder"></block>
   ```

**Finding Block Types**: Use "Print Puzzle XML Tree" from the puzzle context menu to see the XML structure and block type.

#### Puzzles Order

Blocks appear in the toolbox in the order defined in `init.plug`:

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle"></block>
    <block type="doSomethingCool"></block>
    <!-- <block type="testPuzzle"></block> -->  <!-- Commented out blocks don't appear -->
    <block type="anotherPuzzle"></block>
</category>
```

#### Text Labels

Add text labels via `<label>` elements:

```xml
<category name="My Awesome Plugin" color="green">
    <label text="My Awesome Plugin v1.0"></label>
    <label text="Main Puzzles:"></label>
    <block type="myPuzzle"></block>
    <label text="Other:"></label>
    <block type="anotherPuzzle"></block>
</category>
```

**Note**: Labels don't support multiline text (no line breaks).

**Styling Labels**: Use the `web-class` attribute to assign custom CSS:

```xml
<category name="Example Plugin" color="#a52a2a">
    <label text="Example Plugin v1.0 by Soft8Soft" web-class="example-plugin__label"></label>
</category>

<script>
const styleElem = document.createElement('style');
styleElem.innerHTML = `
    .example-plugin__label .blocklyFlyoutLabelText {
        fill: #a52a2a;
        font-style: italic;
        font-weight: bold;
        text-decoration: underline;
    }
`;
document.head.appendChild(styleElem);
</script>
```

**Best Practice**: Use CSS scoping with a unique prefix (e.g., `example-plugin__label`) to avoid conflicts.

#### Separators

Add spacing between blocks using `<sep>` elements:

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle"></block>
    <sep gap="0"></sep>  <!-- 0 pixels -->
    <block type="doSomethingCool"></block>
    <sep gap="80"></sep>  <!-- 80 pixels -->
    <block type="anotherPuzzle"></block>
</category>
```

**Default gap**: 24 pixels (when `<sep>` is not used)

#### Puzzle Blocks Available in the "init" Tab

By default, blocks only appear in `main` and user-created tabs, not in `init`. The `init` tab runs before the Verge3D application loads, so blocks requiring 3D scene access can crash.

To allow a block in `init`, set `allow-init="true"`:

```xml
<category name="My Awesome Plugin" color="green">
    <label text="My Awesome Plugin v1.0" allow-init="true"></label>
    <block type="myPuzzle" allow-init="true"></block>
    <block type="doSomethingCool"></block>  <!-- Not available in init -->
</category>
```

**Applies to**: `<block>`, `<label>`, and `<sep>` elements

#### Default Input and Field Values

Specify placeholder blocks and default values for inputs and fields.

**Value Input with Placeholder Block**:

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle">
        <value name="myNumber">
            <block type="math_number"></block>
        </value>
    </block>
</category>
```

**Shadow Blocks** (automatically replaced when user inserts a block):

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle">
        <value name="myNumber">
            <shadow type="math_number"></shadow>
        </value>
    </block>
</category>
```

**Statement Input with Placeholder Blocks**:

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle">
        <statement name="myStatement">
            <block type="addHTMLElement">
                <next>
                    <block type="setHTMLElemAttribute"></block>
                </next>
            </block>
        </statement>
    </block>
</category>
```

**Default Field Values**:

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle">
        <field name="myCheckbox">true</field>  <!-- true = enabled, false = disabled -->
    </block>
</category>
```

**Compound Puzzles**: You can create complex pre-configured block setups similar to the Puzzles Library.

#### Toolbox Subcategories

Create nested categories for tree-like organization:

```xml
<category name="My Awesome Plugin" color="green">
    <block type="myPuzzle"></block>
    <category name="1" color="red">
        <category name="1.1" color="silver">
            <block type="anotherPuzzle"></block>
        </category>
    </category>
    <category name="2" color="blue">
        <block type="doSomethingCool"></block>
    </category>
</category>
```

**Note**: Categories can contain both `<category>` and `<block>` elements simultaneously.

### Script Element

The `<script>` element is optional and can contain plugin-wide initialization code.

**code() Function**: Returns JavaScript code executed once before any puzzles:

```xml
<script>
function code() {
    // This code runs before any puzzles
    return `console.log('Powered by My Awesome Plugin!');`;
}
</script>
```

**Important**: The initialization code is only added to the generated logic file if the plugin's puzzles are actually used (added to workspace and not disabled).

---

## .block File Format

Files with `.block` extension define individual puzzle blocks. Each file defines:
- Block appearance (template)
- Generated JavaScript code (code function)

**File Naming**: The `.block` filename (without extension) determines the block `type` used in `init.plug`.

**Note**: A plugin can have zero `.block` files if it only uses stock blocks or other plugins' blocks.

### Minimal Example

```xml
<template color="green">
    <dummy>
        <label>myPuzzle</label>
    </dummy>
</template>

<script>
function code(block) {
    return `console.log('This is my first puzzle!');`;
}
</script>
```

### Block Template

Block appearance can be defined in two ways:

1. **XML `<template>` element** (simpler, recommended)
2. **JavaScript `template()` function** (more flexible, uses Blockly API)

#### XML Template Example

```xml
<template
    color="green"
    inline="true"
    output="Dictionary"
    tooltip="This is my first puzzle!"
    help="https://soft8soft.com">
    <dummy name="myDummyInput">
        <label>enable</label>
        <checkbox name="myCheckbox">true</checkbox>
    </dummy>
    <value name="myValueInput">
        <label>input value</label>
    </value>
</template>
```

#### JavaScript Template Example

```javascript
<script>
function template(block) {
    block.setColor('green');
    block.setInputsInline(true);
    block.setOutput(true, 'Dictionary');
    block.setTooltip('This is a test puzzle!');
    block.setHelpUrl('https://soft8soft.com');

    block.appendDummyInput('myDummyInput')
        .appendField('enable')
        .appendField(new Blockly.FieldCheckbox(true), 'myCheckbox');

    block.appendValueInput('myValueInput')
        .appendField('input value');
}

function code(block) {
    return `console.log('This is my first puzzle!');`;
}
</script>
```

**Note**: You can use both `<template>` and `template()` simultaneously.

### Block Template Attributes and Elements

#### Block Color

**XML**:
```xml
<template color="green"></template>
```

**JavaScript**:
```javascript
block.setColor('green');
```

#### Block Tooltip

**XML**:
```xml
<template tooltip="This is my first puzzle!"></template>
```

**JavaScript**:
```javascript
block.setTooltip('This is my first puzzle!');
```

#### Block Help URL

**XML**:
```xml
<template help="https://www.soft8soft.com/"></template>
```

**JavaScript**:
```javascript
block.setHelpUrl('https://www.soft8soft.com/');
```

#### Adding Inputs

Three input types:

1. **Value inputs** (`<value>`) - Accept blocks with output connections
2. **Statement inputs** (`<statement>`) - Hold groups of consecutive actions
3. **Dummy inputs** (`<dummy>`) - Contain non-block UI elements (fields)

**XML**:
```xml
<template>
    <value name="myInput"></value>
    <statement name="myStatement"></statement>
    <dummy>
        <checkbox name="myCheckbox">true</checkbox>
    </dummy>
</template>
```

**JavaScript**:
```javascript
block.appendValueInput('myValue');
block.appendStatementInput('myStatement');
block.appendDummyInput()
    .appendField(new Blockly.FieldCheckbox(true), 'myCheckbox');
```

**Note**: Value and statement inputs must have names. Dummy inputs usually don't need names.

#### Arrangement of Inputs

**XML**:
```xml
<template inline="true"></template>  <!-- true = horizontal, false = vertical -->
```

**JavaScript**:
```javascript
block.setInputsInline(true);  // true = horizontal, false = vertical
```

#### Adding Fields

Fields are UI elements like labels, checkboxes, dropdowns, etc.

**Common Fields**:

- **Label** (non-editable text):
  ```xml
  <dummy>
      <label>a text label</label>
  </dummy>
  ```

- **Text** (editable):
  ```xml
  <dummy>
      <text name="myText">default text</text>
  </dummy>
  ```

- **Multiline Text**:
  ```xml
  <dummy>
      <multiline name="myTextMultiline">This is a \n multiline \n   text</multiline>
  </dummy>
  ```

- **Number**:
  ```xml
  <dummy>
      <number name="myNumber">3</number>
  </dummy>
  ```

- **Angle** (degrees):
  ```xml
  <dummy>
      <angle name="myAngle">15</angle>
  </dummy>
  ```

- **Checkbox**:
  ```xml
  <dummy>
      <checkbox name="myCheckbox">true</checkbox>  <!-- true or false -->
  </dummy>
  ```

- **Dropdown**:
  ```xml
  <dummy>
      <dropdown name="myDropdown">
          <option name="COLOR_GREEN">green</option>
          <option name="COLOR_YELLOW" default="true">yellow</option>
          <option name="COLOR_RED">red</option>
      </dropdown>
  </dummy>
  ```

- **Color Picker**:
  ```xml
  <dummy>
      <color name="myColor">#350af5</color>
  </dummy>
  ```

**Field Properties**:
- All fields support optional `name` attribute for referencing in `code()`
- Default values can be specified (values in `init.plug` have higher priority)

#### Field Alignment

**XML**:
```xml
<template>
    <dummy align="left"></dummy>
    <value align="center" name="myValueInput"></value>
    <statement align="right" name="myStatementInput"></statement>
</template>
```

**JavaScript**:
```javascript
block.appendDummyInput().setAlign(Blockly.ALIGN_LEFT);
block.appendValueInput('myValueInput').setAlign(Blockly.ALIGN_CENTER);
block.appendStatementInput('myStatementInput').setAlign(Blockly.ALIGN_RIGHT);
```

**Valid values**: `left`, `center`, `right` (default: `left`)

#### Block Connections

Blocks can have connections for linking to other blocks:

- **Previous** (`prev="true"`) - Connection at top
- **Next** (`next="true"`) - Connection at bottom
- **Output** (`output=""`) - Connection on left side

**Valid Combinations**:
- `prev` + `next`
- `next` + `output`
- Single connection of any type

**XML**:
```xml
<template prev="true" next="true"></template>
<template output=""></template>
```

**JavaScript**:
```javascript
block.setPreviousStatement(true);
block.setNextStatement(true);
block.setOutput(true);
```

#### Input/Output Type Checking

Assign types to inputs and outputs to restrict connections:

**XML**:
```xml
<template output="String">
    <value name="myInput" type="Number"></value>
</template>
```

**JavaScript**:
```javascript
block.appendValueInput('myInput').setCheck('Number');
block.setOutput(true, 'String');
```

**Multiple Types**:

**XML**:
```xml
<template output="String Animation">
    <value name="myInput" type="Number Object3D"></value>
</template>
```

**JavaScript**:
```javascript
block.appendValueInput('myInput').setCheck(['Number', 'Object3D']);
block.setOutput(true, ['String', 'Animation']);
```

**Standard Verge3D Types**:
- JavaScript types: `Number`, `String`, `Boolean`, `Dictionary`, `Array`, `Promise`, `Procedure`
- Scene entities: `Object3D`, `Material`, `Animation`
- Other: `Canvas`, `Sound`, `Video`

**Note**: You can create custom types for your puzzles.

### Code Function

The `code()` function generates JavaScript code for the puzzle block. It receives a `block` parameter (Blockly.BlockSvg instance) and must return a string.

#### Basic Code Generation

```javascript
function code(block) {
    return `alert('Test');`;
}
```

```javascript
function code(block) {
    return `1`;  // Only makes sense if block has output connection
}
```

```javascript
function code(block) {
    const fun = function() {
        app.scene.traverse(function(obj) {
            obj.material = new v3d.MeshBasicMaterial({
                color: new v3d.Color(Math.random(), Math.random(), Math.random())
            });
        });
    }
    return `(${fun})();`;
}
```

#### Mitigating Code Bloat

Use `Plug.provide()` to declare functions only once, even if the block is used multiple times:

```javascript
function code(block) {
    const fun = Plug.provide('myFunction', function(a, b, c) {
        console.log(a, b, c);
    });

    return `${fun}(1, 2, 3);`;
}
```

**How it works**:
- `Plug.provide()` ensures the function is declared only once in the generated code
- Returns a variable name (may differ from the original identifier)
- Use the returned name to call the function

#### Using PzLib API

PzLib provides extensive APIs for plugin development:

```javascript
function code(block) {
    // Declare required methods
    Plug.pzlib('getAllObjectNames');
    Plug.pzlib('getObjectByName');
    Plug.pzlib('generateUniqueName');
    
    // Or declare multiple at once
    Plug.pzlib('getAllObjectNames', 'getObjectByName', 'generateUniqueName');

    const fun = Plug.provide('myFunction', function() {
        const objNames = PzLib.getAllObjectNames();
        const cubeObj = PzLib.getObjectByName('Cube');
        const uniqueName = PzLib.generateUniqueName('Cube');
    });

    return `${fun}();`;
}
```

**Reference**: [PzLib API Documentation](https://www.soft8soft.com/docs/pzlib_api/)

#### Accessing Inputs and Fields

Use Blockly API methods to access input values and field values:

**Key Methods**:
- `Blockly.JavaScript.valueToCode(block, inputName, order)` - Get value input code
- `Blockly.JavaScript.statementToCode(block, statementName)` - Get statement input code
- `block.getFieldValue(fieldName)` - Get field value

**Complete Example**:

```xml
<template color="green">
    <dummy>
        <label>myPuzzle</label>
    </dummy>
    <value name="myValue"></value>
    <statement name="myStatement"></statement>
    <dummy>
        <checkbox name="myCheckbox">true</checkbox>
    </dummy>
</template>

<script>
function wrapFn(contents) {
    return `function() {${contents}}`;
}

function code(block) {
    // Get value input (with fallback for empty input)
    const myInput = Blockly.JavaScript.valueToCode(block, 'myValue',
            Blockly.JavaScript.ORDER_NONE) || `''`;

    // Get statement input (wrapped in function)
    const myStatement = wrapFn(Blockly.JavaScript.statementToCode(block, 'myStatement'));

    // Get checkbox field value (convert to boolean)
    const myCheckbox = block.getFieldValue('myCheckbox') === 'TRUE';

    const fun = Plug.provide('myFunction', function(input, statements, checkbox) {
        console.log('input value:', input);
        statements();  // Execute puzzles from the myStatement input
        console.log('checkbox state:', checkbox);
    });
    
    return `${fun}(${myInput}, ${myStatement}, ${myCheckbox});`;
}
</script>
```

**Important Notes**:
- Value inputs may be empty - provide fallback: `|| ''`
- Statement inputs are typically wrapped in functions for use as callbacks
- Checkbox values are strings: `'TRUE'` or `'FALSE'` - compare to convert to boolean

---

## Plugin and Block Errors

When developing plugins, errors appear in the browser console. Common error formats:

- `PluginError(PLUGIN_NAME) ...`
- `BlockError(PLUGIN_NAME/BLOCK_NAME) ...`
- `Puzzle "PLUGIN_NAME/BLOCK_NAME" is not defined properly. Replaced with a dummy block.`

**Effects**:
- Plugin errors: Whole plugin category disappears from toolbox
- Block errors: Affected blocks marked as invalid (dummy blocks)

### Block Errors

#### BlockError: error parsing .block file - XML errors

**Cause**: XML syntax errors in `.block` file (e.g., missing closing tags)

**Example**:
```xml
<script>
function template(block) {}
function code(block) {}
<!-- Missing </script> tag -->
```

#### BlockError: error parsing .block file - JavaScript errors

**Cause**: JavaScript syntax/runtime errors in `<script>` element

#### BlockError: validation error - "Child block does not have output or previous statement"

**Cause**: Child block plugged into input doesn't have required connection type

**Solution**: Ensure child blocks have appropriate `output` or `prev` connections

#### BlockError: validation error - "Connection checks failed"

**Cause**: Input/output type mismatch between connected blocks

**Solution**: Check `type` attributes on inputs and `output` attribute on blocks

#### BlockError: validation error - "Unknown block type: PLUGIN_NAME/null"

**Cause**: `<block>` element in `init.plug` missing `type` attribute

**Solution**: Always specify `type` attribute:
```xml
<!-- Wrong -->
<block></block>

<!-- Correct -->
<block type="myPuzzle"></block>
```

#### BlockError: validation error - "Unknown block type: PLUGIN_NAME/BLOCK_NAME"

**Cause**: Usually follows parsing errors - block wasn't properly loaded

**Solution**: Fix the underlying parsing error first

#### BlockError: error calling template() function

**Cause**: Errors in `<template>` XML or `template()` JavaScript function

**Common Issue**: Dropdown field with unnamed option
```xml
<!-- Wrong -->
<dropdown name="myDropdown">
    <option>green</option>  <!-- Missing name attribute -->
</dropdown>

<!-- Correct -->
<dropdown name="myDropdown">
    <option name="COLOR_GREEN">green</option>
</dropdown>
```

#### BlockError: error calling code() function

**Cause**: JavaScript errors in `code()` function

**Solution**: Check JavaScript syntax and runtime errors

### Plugin Errors

#### PluginError: error parsing init.plug file - XML errors

**Cause**: XML syntax errors in `init.plug` (e.g., missing closing tags)

**Example**:
```xml
<category name="MyAwesomePlugin" color="green">
    <block type="myPuzzle"></block>
<!-- Missing </category> tag -->
```

#### PluginError: error parsing init.plug file - JavaScript errors

**Cause**: JavaScript syntax/runtime errors in `<script>` element

#### PluginError: error calling code() function

**Cause**: JavaScript errors in plugin's `code()` function

### Dummy Block Replacement

**Message**: `Puzzle "PLUGIN_NAME/BLOCK_NAME" is not defined properly. Replaced with a dummy block.`

**Cause**: Usually follows BlockError or PluginError messages

**Effect**: Invalid blocks replaced with dummy blocks (visually distinct, non-functional)

**Solution**: Fix the underlying error(s) first

---

## Sharing Your Plugin

Ways to share your plugin:

1. **Verge3D Forums**: Post on [Verge3D Forums - Plugins](https://www.soft8soft.com/forum/plugins/)
2. **Wiki**: Write a [wiki article](https://www.soft8soft.com/wiki/index.php/Main_Page) and get listed in [List of Verge3D Plugins](https://www.soft8soft.com/wiki/index.php/List_of_Verge3D_Plugins)
3. **Social Media**: Share on Twitter/Facebook/LinkedIn with `#verge3d` hashtag
4. **Reddit**: Share on [r/RealVerge3D](https://www.reddit.com/r/RealVerge3D/), [r/3dcommerce](https://www.reddit.com/r/3dcommerce/), or [r/3dconfigurators](https://www.reddit.com/r/3dconfigurators/)
5. **Marketplace**: Sell on [Gumroad](https://gumroad.com/) or similar platforms

---

## Quick Reference

### Block Type References in init.plug

- **Same plugin**: Use short name (`myPuzzle`)
- **Stock puzzles**: Use stock type (`math_number`)
- **Other plugins**: Use `PLUGIN_NAME/BLOCK_NAME` (`E-Commerce/placeOrder`)

### Common Blockly API Methods

- `block.setColor(color)` - Set block color
- `block.setTooltip(text)` - Set tooltip
- `block.setHelpUrl(url)` - Set help URL
- `block.setInputsInline(true/false)` - Horizontal/vertical arrangement
- `block.setOutput(true, type)` - Add output connection
- `block.setPreviousStatement(true)` - Add previous connection
- `block.setNextStatement(true)` - Add next connection
- `block.appendValueInput(name)` - Add value input
- `block.appendStatementInput(name)` - Add statement input
- `block.appendDummyInput()` - Add dummy input
- `block.getFieldValue(name)` - Get field value

### Common Blockly Code Generation Methods

- `Blockly.JavaScript.valueToCode(block, name, order)` - Get value input code
- `Blockly.JavaScript.statementToCode(block, name)` - Get statement input code

### Plugin-Specific Methods

- `Plug.provide(name, function)` - Declare function once (returns function name)
- `Plug.pzlib(...methods)` - Declare PzLib API methods

---

## Additional Resources

- **Official Documentation**: [Verge3D Plugins Reference](https://www.soft8soft.com/docs/manual/en/puzzles/Plugins.html)
- **PzLib API**: [PzLib API Documentation](https://www.soft8soft.com/docs/pzlib_api/)
- **Blockly Reference**: [Google Blockly Documentation](https://developers.google.com/blockly/reference/overview)
- **Example Plugin**: [ExamplePlugin.zip](https://www.soft8soft.com/docs/files/puzzles/ExamplePlugin.zip)
- **Support**: [Verge3D Forums](https://www.soft8soft.com/forums/)

---

*Last updated: Based on Verge3D documentation as of November 2025*
