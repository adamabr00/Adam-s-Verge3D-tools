function buildToolboxJSON() {
    const toolbox = Blockly.getMainWorkspace().getToolbox();
    const result = { blocks: {}, categories: {} };
  
    for (const category of toolbox.contents_) {
      const def = category.toolboxItemDef_;
      if (!def?.contents) continue;
  
      const categoryName = category.name_;
      const categoryColor = category.colour_ || "#888888";
  
      // ✅ Store category metadata
      if (!result.categories[categoryName]) {
        result.categories[categoryName] = {
          color: categoryColor,
          description: `Blocks related to ${categoryName}`
        };
      }
  
      // ✅ Iterate over block entries (check for 'BLOCK')
      for (const entry of def.contents) {
        if (entry.kind && entry.kind.toUpperCase() === 'BLOCK' && entry.type) {
          const type = entry.type;
  
          result.blocks[type] = {
            category: categoryName,
            displayName: type,       // Placeholder: use type as name
            searchTerms: [type],     // Placeholder: only type
            description: `Block of type ${type}`
          };
        }
      }
    }
  
    return result;
  }
  
  // ✅ Example usage:
  const toolboxJSON = buildToolboxJSON();
  console.log(JSON.stringify(toolboxJSON, null, 2));
  