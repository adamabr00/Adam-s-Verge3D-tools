# Blockly Block Movement and Reconnection Guide

## Overview
This guide documents the lessons learned while implementing block movement functionality in Blockly v8.0.1, specifically for reordering blocks in a chain while maintaining visual position.

## Key Concepts

### Block Connections in Blockly
- **`previousConnection`**: Connects to the block above (parent)
- **`nextConnection`**: Connects to the block below (child)
- **`outputConnection`**: For blocks with values (not used in chain blocks)
- **`inputConnection`**: For blocks that accept values (not used in chain blocks)

### Root Block Detection
```javascript
// Find the root block (top of the chain)
let rootBlock = anyBlock;
while (rootBlock && rootBlock.getParent()) {
    rootBlock = rootBlock.getParent();
}
```

## Block Movement Patterns

### 1. Moving a Block Up in Chain
**Goal**: Swap selected block with its parent

```javascript
function moveBlockUp(block) {
    const parentBlock = block.getParent();
    if (!parentBlock) return; // Already at top
    
    const nextBlock = block.getNextBlock();
    const grandParent = parentBlock.getParent();
    
    // Store original root position
    let originalRoot = block;
    while (originalRoot && originalRoot.getParent()) {
        originalRoot = originalRoot.getParent();
    }
    const originalPosition = originalRoot.getRelativeToSurfaceXY();
    
    // Disconnect all involved blocks
    if (grandParent && parentBlock.previousConnection?.isConnected()) {
        parentBlock.previousConnection.disconnect();
    }
    if (parentBlock && block.previousConnection?.isConnected()) {
        block.previousConnection.disconnect();
    }
    if (block.nextConnection?.isConnected()) {
        block.nextConnection.disconnect();
    }
    
    // Reconnect in new order
    if (grandParent && grandParent.nextConnection) {
        grandParent.nextConnection.connect(block.previousConnection);
    }
    block.nextConnection.connect(parentBlock.previousConnection);
    if (nextBlock) {
        parentBlock.nextConnection.connect(nextBlock.previousConnection);
    }
    
    // Move new root to original position
    let newRoot = block;
    while (newRoot && newRoot.getParent()) {
        newRoot = newRoot.getParent();
    }
    if (originalPosition && newRoot) {
        const currentPosition = newRoot.getRelativeToSurfaceXY();
        newRoot.moveBy(
            originalPosition.x - currentPosition.x,
            originalPosition.y - currentPosition.y
        );
    }
}
```

### 2. Moving a Block Down in Chain
**Goal**: Swap selected block with its child

```javascript
function moveBlockDown(block) {
    const nextBlock = block.getNextBlock();
    if (!nextBlock) return; // Already at bottom
    
    const nextNextBlock = nextBlock.getNextBlock();
    const parentBlock = block.getParent();
    
    // Store original root position
    let originalRoot = block;
    while (originalRoot && originalRoot.getParent()) {
        originalRoot = originalRoot.getParent();
    }
    const originalPosition = originalRoot.getRelativeToSurfaceXY();
    
    // Disconnect all involved blocks
    if (parentBlock && block.previousConnection?.isConnected()) {
        block.previousConnection.disconnect();
    }
    if (block.nextConnection?.isConnected()) {
        block.nextConnection.disconnect();
    }
    if (nextBlock.nextConnection?.isConnected()) {
        nextBlock.nextConnection.disconnect();
    }
    
    // Reconnect in new order
    if (parentBlock && parentBlock.nextConnection) {
        parentBlock.nextConnection.connect(nextBlock.previousConnection);
    }
    nextBlock.nextConnection.connect(block.previousConnection);
    if (nextNextBlock) {
        block.nextConnection.connect(nextNextBlock.previousConnection);
    }
    
    // Move new root to original position
    let newRoot = block;
    while (newRoot && newRoot.getParent()) {
        newRoot = newRoot.getParent();
    }
    if (originalPosition && newRoot) {
        const currentPosition = newRoot.getRelativeToSurfaceXY();
        newRoot.moveBy(
            originalPosition.x - currentPosition.x,
            originalPosition.y - currentPosition.y
        );
    }
}
```

## Critical Lessons Learned

### 1. Root Block Detection
**❌ Wrong Approach**:
```javascript
// Don't start from parentBlock - it might not be the actual root
let root = parentBlock;
while (root && root.getParent()) {
    root = root.getParent();
}
```

**✅ Correct Approach**:
```javascript
// Always start from the selected block to find the true root
let root = selectedBlock;
while (root && root.getParent()) {
    root = root.getParent();
}
```

### 2. Position Preservation
**❌ Wrong Approach**:
```javascript
// Don't try to move connected blocks directly
connectedBlock.moveBy(deltaX, deltaY); // "Block has parent" error
```

**✅ Correct Approach**:
```javascript
// Move the root block - it will move the entire connected stack
rootBlock.moveBy(deltaX, deltaY);
```

### 3. Connection Management
**❌ Wrong Approach**:
```javascript
// Don't use unplug() for temporary disconnection
block.unplug(); // Can cause issues with reconnection
```

**✅ Correct Approach**:
```javascript
// Use disconnect() on specific connections
if (block.previousConnection?.isConnected()) {
    block.previousConnection.disconnect();
}
```

### 4. New Root Detection After Reordering
**❌ Wrong Approach**:
```javascript
// Don't assume nextBlock becomes the new root
let newRoot = nextBlock; // This might not be the actual new root
```

**✅ Correct Approach**:
```javascript
// Always walk up from the moved block to find the new root
let newRoot = movedBlock;
while (newRoot && newRoot.getParent()) {
    newRoot = newRoot.getParent();
}
```

## Common Pitfalls

### 1. "Block has parent" Error
**Cause**: Trying to move a block that's connected to other blocks
**Solution**: Only move the root block, which will move the entire stack

### 2. Stack Position Jumping
**Cause**: Not moving the new root to the original root's position
**Solution**: Always store original root position and move new root there

### 3. Wrong Root Detection
**Cause**: Starting from the wrong block to find the root
**Solution**: Always start from the selected/moved block and walk up

### 4. Connection State Assumptions
**Cause**: Assuming connections exist without checking
**Solution**: Always check `isConnected()` before disconnecting

## Best Practices

### 1. Always Check Connection State
```javascript
if (connection && connection.isConnected()) {
    connection.disconnect();
}
```

### 2. Store Position Before Reordering
```javascript
const originalPosition = rootBlock.getRelativeToSurfaceXY();
```

### 3. Find New Root After Reordering
```javascript
let newRoot = movedBlock;
while (newRoot && newRoot.getParent()) {
    newRoot = newRoot.getParent();
}
```

### 4. Move Entire Stack via Root
```javascript
newRoot.moveBy(deltaX, deltaY); // Moves entire connected stack
```

## API Reference

### Block Methods
- `block.getParent()`: Get the block above
- `block.getNextBlock()`: Get the block below
- `block.getRelativeToSurfaceXY()`: Get position relative to workspace
- `block.moveBy(dx, dy)`: Move block by delta (only works on root blocks)

### Connection Methods
- `connection.isConnected()`: Check if connection is active
- `connection.disconnect()`: Disconnect from other connection
- `connection.connect(otherConnection)`: Connect to another connection

### Workspace Methods
- `Blockly.selected`: Get currently selected block
- `Blockly.getMainWorkspace()`: Get the main workspace instance

## Example Implementation
See `stepBlock.block` for a complete working implementation that handles:
- Keyboard event handling
- Block selection
- Up/down movement
- Position preservation
- Error handling 