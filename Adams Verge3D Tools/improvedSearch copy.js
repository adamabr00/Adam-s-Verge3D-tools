<template color="#de3900" prev="true" next="true" help="https://github.com/adamabr00/Adam-s-Verge3D-tools/tree/main" tooltip="Press Shift+F to open enhanced search with tab navigation. Find blocks across all tabs with keyboard shortcuts.">
    <dummy>
        <label>Improved Search (Shift+F)</label>
    </dummy>
</template>

<script>
function code(block) {
    return `(function() {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('logic') || !window.__PE__) {
            console.log('%c[Improved Search] Missing logic parameter or __PE__ not available', 'color: orange; font-weight: bold;');
            return;
        }

        let searchOverlay = null, searchInput, statusLabel, tabsBar, hintsLabel;
        let groupedResults = [], activeTabIndex = 0, currentIndexInTab = 0;
        let lastHighlightedId = null;
        let cachedBlocks = [];
        let searchTimeout = null;
        let highlightOverlay = null;
        let temporarilyExpandedBlocks = new Map(); // Track temporarily expanded blocks: blockId -> wasCollapsed
        let currentCollapsedParentId = null; // Track current collapsed parent being viewed
        const DEBOUNCE_DELAY = 250; // milliseconds - wait 250ms after user stops typing
        const TAB_SWITCH_DELAY = 10; // Delay for tab switching to complete
        const EXPAND_RENDER_DELAY = 50; // Delay for block expansion to render

        // 🔹 Normalize for search
        function normalize(str) {
            return (str || "").toLowerCase().replace(/[^a-z0-9]/g, '');
        }

        // 🔹 Refresh block cache (only top-level processed directly)
        function refreshBlockCache() {
            const parser = new DOMParser();
            const dom = parser.parseFromString(__PE__.generateXMLStr(), 'application/xml');
            const tabs = Array.from(dom.querySelectorAll('tab'));
            cachedBlocks = [];

            return tabs.map((tab, tabIndex) => {
                const tabName = tab.getAttribute('name') || 'Unknown';
                tab.querySelectorAll(':scope > block').forEach(block => processBlock(block, tabName, tabIndex));
                return { tabName, tabIndex };
            });
        }

        // 🔹 Process one block and its children (no duplicate text)
        function processBlock(block, tabName, tabIndex) {
            const type = block.getAttribute('type') || '';
            const children = Array.from(block.children || []);

            // direct <field> only
            const fields = children
                .filter(el => el.tagName === 'field')
                .map(f => f.textContent.trim().toLowerCase())
                .join(' ');

            // mutation name (for procedure calls etc.)
            const mutation = children.find(el => el.tagName === 'mutation');
            const mutationName = mutation?.getAttribute('name')?.toLowerCase() || '';

            // block text = type + fields + mutation.name only
            const ownText = [type, fields, mutationName].filter(Boolean).join(' ');

            const obj = { tabName, tabIndex, id: block.getAttribute('id'), type, text: ownText };
            cachedBlocks.push(obj);

            // process children recursively, but without adding their text to the parent
            const childBlocks = block.querySelectorAll(':scope > value > block, :scope > statement > block, :scope > next > block');
            Array.from(childBlocks).forEach(child => processBlock(child, tabName, tabIndex));
        }

        // 🔹 Perform search
        function performSearch(query) {
            const nq = normalize(query);
            const allTabs = refreshBlockCache();
            groupedResults = [];

            allTabs.forEach(tab => {
                const matches = cachedBlocks.filter(b => b.tabIndex === tab.tabIndex && normalize(b.text).includes(nq));
                if (matches.length) groupedResults.push({ tabName: tab.tabName, tabIndex: tab.tabIndex, results: matches });
            });

            activeTabIndex = 0;
            currentIndexInTab = 0;
            renderTabsBar();
            // Don't auto-jump - let user navigate with arrow keys or Enter
        }

        // 🔹 Create search UI
        function createSearchUI(initialQuery = "") {
            if (searchOverlay) return;

            // Create main overlay container
            searchOverlay = document.createElement('div');
            Object.assign(searchOverlay.style, {
                position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                width: 'min(480px, 90vw)', padding: '15px',
                borderRadius: '18px',
                background: 'linear-gradient(180deg, #101827bf, #0b1324cc)',
                border: '1px solid #ffffff22',
                boxShadow: '0 20px 40px rgba(2, 6, 23, .45)',
                backdropFilter: 'blur(10px) saturate(120%)',
                color: '#e5e7eb',
                fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
            });

            // Create header
            const header = document.createElement('div');
            header.style.marginBottom = '18px';
            
            const title = document.createElement('h1');
            title.textContent = 'Search Puzzles';
            Object.assign(title.style, {
                fontSize: 'clamp(18px, 2.2vw, 18px)',
                lineHeight: '1.25',
                margin: '0 0 6px',
                fontWeight: '700'
            });
            
            const subtitle = document.createElement('p');
            subtitle.textContent = 'Find blocks across all tabs';
            Object.assign(subtitle.style, {
                margin: '0',
                color: '#94a3b8',
                fontSize: '14px'
            });
            
            header.appendChild(title);
            header.appendChild(subtitle);

            // Create search field with modern styling
            const fieldContainer = document.createElement('div');
            Object.assign(fieldContainer.style, {
                position: 'relative',
                border: '1px solid #ffffff1a',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #0c1322, #0a111e)',
                boxShadow: 'inset 0 0 0 1px #00000040',
                marginBottom: '5px'
            });

            searchInput = document.createElement('input');
            Object.assign(searchInput.style, {
                width: '100%',
                padding: '10px',
                border: '0',
                outline: 'none',
                background: 'transparent',
                color: '#e6f0ff',
                fontSize: '16px',
                fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontWeight: '500'
            });
            searchInput.type = 'text';
            searchInput.placeholder = 'Search puzzles...';
            searchInput.value = initialQuery;

            // Create tabs bar with modern styling
            tabsBar = document.createElement('div');
            Object.assign(tabsBar.style, {
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '13px',
                flexWrap: 'wrap'
            });

            // Create status label with modern styling
            statusLabel = document.createElement('div');
            Object.assign(statusLabel.style, {
                fontSize: '13px',
                color: '#94a3b8',
                marginBottom: '8px'
            });

            // Create keyboard hints label
            hintsLabel = document.createElement('div');
            Object.assign(hintsLabel.style, {
                fontSize: '12px',
                color: '#64748b',
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #ffffff1a',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center'
            });
            
            // Create hint items
            const createHintItem = (keys, description) => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.gap = '6px';
                
                const keysEl = document.createElement('div');
                keysEl.textContent = keys;
                Object.assign(keysEl.style, {
                    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1'
                });
                
                const descEl = document.createElement('span');
                descEl.textContent = description;
                descEl.style.color = '#94a3b8';
                
                item.appendChild(keysEl);
                item.appendChild(descEl);
                return item;
            };
            
            hintsLabel.appendChild(createHintItem('↑↓', 'Navigate results'));
            hintsLabel.appendChild(createHintItem('←→', 'Switch tabs'));
            hintsLabel.appendChild(createHintItem('Enter', 'Jump to result'));
            hintsLabel.appendChild(createHintItem('Esc', 'Close'));

            // Create close button as X in upper right corner
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                appearance: 'none',
                border: 'none',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '20px',
                fontWeight: '300',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .2s ease',
                zIndex: '1'
            });
            closeBtn.onclick = closeSearchUI;
            closeBtn.onmouseenter = () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                closeBtn.style.color = '#e5e7eb';
            };
            closeBtn.onmouseleave = () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                closeBtn.style.color = '#94a3b8';
            };

            // Assemble the UI
            fieldContainer.appendChild(searchInput);
            
            searchOverlay.appendChild(closeBtn);
            searchOverlay.appendChild(header);
            searchOverlay.appendChild(fieldContainer);
            searchOverlay.appendChild(tabsBar);
            searchOverlay.appendChild(statusLabel);
            searchOverlay.appendChild(hintsLabel);
            
            document.body.appendChild(searchOverlay);

            // Debounced search input - only search after user stops typing
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    doSearch();
                }, DEBOUNCE_DELAY);
            });
            searchInput.addEventListener('keydown', e => handleKeys(e));
            searchInput.focus();

            if (initialQuery) doSearch();
        }

        // 🔹 Render tabs bar
        function renderTabsBar() {
            tabsBar.innerHTML = '';
            groupedResults.forEach((tab, i) => {
                const el = document.createElement('div');
                el.textContent = (i === activeTabIndex)
                    ? \`\${tab.tabName} \${currentIndexInTab + 1}/\${tab.results.length}\`
                    : \`\${tab.tabName} (\${tab.results.length})\`;
                Object.assign(el.style, {
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'all .2s ease',
                    background: (i === activeTabIndex) 
                        ? 'linear-gradient(180deg, #1e293b, #334155)' 
                        : 'linear-gradient(180deg, #0e1729, #0a1323)',
                    border: (i === activeTabIndex) 
                        ? '1px solid #5b8cff' 
                        : '1px solid #ffffff22',
                    color: (i === activeTabIndex) ? '#e6f0ff' : '#94a3b8'
                });
                el.onclick = () => {
                    restoreBeforeNavigation();
                    activeTabIndex = i; 
                    currentIndexInTab = 0; 
                    jumpToCurrent(); 
                    renderTabsBar(); 
                };
                el.onmouseenter = () => {
                    if (i !== activeTabIndex) {
                        el.style.filter = 'brightness(1.1)';
                    }
                };
                el.onmouseleave = () => {
                    if (i !== activeTabIndex) {
                        el.style.filter = 'brightness(1)';
                    }
                };
                tabsBar.appendChild(el);
            });

            statusLabel.textContent = groupedResults.length
                ? \`Found \${groupedResults.reduce((sum, tab) => sum + tab.results.length, 0)} results across \${groupedResults.length} tab\${groupedResults.length > 1 ? 's' : ''}\`
                : 'No results found';
        }

        // 🔹 Navigation
        function handleKeys(e) {
            if (!groupedResults.length) return;
            if (e.key === 'ArrowUp') { cycleInTab(-1); e.preventDefault(); }
            if (e.key === 'ArrowDown') { cycleInTab(1); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { switchTab(-1); e.preventDefault(); }
            if (e.key === 'ArrowRight') { switchTab(1); e.preventDefault(); }
            if (e.key === 'Enter') {
                // Jump to current (collapsed parents are automatically expanded)
                jumpToCurrent();
                e.preventDefault();
            }
        }

        // 🔹 Restore collapsed state before navigation (if needed)
        function restoreBeforeNavigation() {
            if (currentCollapsedParentId) {
                restoreCollapsedState(currentCollapsedParentId);
            }
        }

        function cycleInTab(dir) {
            const tab = groupedResults[activeTabIndex];
            const oldIndex = currentIndexInTab;
            currentIndexInTab = (currentIndexInTab + dir + tab.results.length) % tab.results.length;
            
            // Check if we're moving to a different parent - restore if needed
            if (currentCollapsedParentId && oldIndex !== currentIndexInTab) {
                const ws = Blockly.getMainWorkspace();
                const oldResult = tab.results[oldIndex];
                const newResult = tab.results[currentIndexInTab];
                
                if (oldResult && newResult && ws) {
                    const oldBlock = ws.getBlockById(oldResult.id);
                    const newBlock = ws.getBlockById(newResult.id);
                    
                    if (oldBlock && newBlock) {
                        const oldInParent = isBlockInsideParent(oldBlock, currentCollapsedParentId);
                        const newInParent = isBlockInsideParent(newBlock, currentCollapsedParentId);
                        
                        if (oldInParent && !newInParent) {
                            restoreCollapsedState(currentCollapsedParentId);
                        }
                    }
                }
            }
            
            jumpToCurrent(); 
            renderTabsBar();
        }

        function switchTab(dir) {
            restoreBeforeNavigation();
            activeTabIndex = (activeTabIndex + dir + groupedResults.length) % groupedResults.length;
            currentIndexInTab = 0;
            jumpToCurrent(); 
            renderTabsBar();
        }

        // 🔹 Enhanced highlighting with custom visual effects
        function addCustomHighlight(block) {
            removeCustomHighlight();
            
            if (!block || !block.rendered) return;
            
            const svgRoot = block.getSvgRoot && block.getSvgRoot();
            if (!svgRoot) return;
            
            const workspace = Blockly.getMainWorkspace();
            if (!workspace) return;
            
            // Get block position and size
            // Use block's own height/width properties (not getHeightWidth which includes children)
            const pos = block.getRelativeToSurfaceXY();
            const scale = workspace.scale || 1;
            
            // Get the block's main path element bounding box for accurate size
            // The pathObject contains the block's visual representation
            let width, height;
            if (block.pathObject && block.pathObject.svgPath) {
                const pathBBox = block.pathObject.svgPath.getBBox && block.pathObject.svgPath.getBBox();
                if (pathBBox && pathBBox.width > 0 && pathBBox.height > 0) {
                    width = pathBBox.width;
                    height = pathBBox.height;
                } else {
                    // Fallback to block's own dimensions
                    width = block.width || 100;
                    height = block.height || 40;
                }
            } else {
                // Fallback to block's own dimensions
                width = block.width || 100;
                height = block.height || 40;
            }
            
            // Create a group element that will be positioned relative to the block
            const highlightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            highlightGroup.setAttribute('id', '__searchHighlightGroup__');
            highlightGroup.setAttribute('transform', \`translate(\${pos.x}, \${pos.y})\`);
            
            // Create overlay rectangle (positioned relative to group)
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '-6');
            rect.setAttribute('y', '-6');
            rect.setAttribute('width', String(width + 12));
            rect.setAttribute('height', String(height + 12));
            rect.setAttribute('rx', '6');
            rect.setAttribute('ry', '6');
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', '#5b8cff');
            rect.setAttribute('stroke-width', String(Math.max(3, 4 / scale)));
            rect.setAttribute('stroke-dasharray', '10,5');
            rect.setAttribute('opacity', '1');
            rect.setAttribute('pointer-events', 'none');
            rect.style.vectorEffect = 'non-scaling-stroke';
            
            highlightGroup.appendChild(rect);
            
            // Get block canvas and add highlight group
            const blockCanvas = workspace.getCanvas && workspace.getCanvas();
            if (blockCanvas) {
                blockCanvas.appendChild(highlightGroup);
                highlightOverlay = highlightGroup;
            }
        }
        
        function removeCustomHighlight() {
            if (highlightOverlay && highlightOverlay.parentNode) {
                highlightOverlay.parentNode.removeChild(highlightOverlay);
                highlightOverlay = null;
            }
        }
        
        // 🔹 Temporarily expand a collapsed block
        function temporarilyExpandBlock(block) {
            if (!block || typeof block.isCollapsed !== 'function') return;
            
            // Only expand if it's collapsed
            if (block.isCollapsed()) {
                try {
                    // Ensure block is rendered
                    if (!block.rendered) {
                        if (typeof block.initSvg === 'function') {
                            block.initSvg();
                        }
                    }
                    
                    // Store the collapsed state
                    temporarilyExpandedBlocks.set(block.id, true);
                    // Expand the block
                    block.setCollapsed(false);
                    // Render to update visibility with error handling
                    if (block.rendered && typeof block.render === 'function') {
                        try {
                            block.render();
                            // Bring block and all its children to the front
                            if (typeof block.bringToFront === 'function') {
                                block.bringToFront();
                            }
                        } catch (e) {
                            console.warn('[Search] Failed to render block during expand:', e);
                        }
                    }
                } catch (e) {
                    console.warn('[Search] Failed to expand block:', e);
                }
            }
        }
        
        // 🔹 Restore collapsed state for a temporarily expanded block
        function restoreCollapsedState(blockId) {
            if (!temporarilyExpandedBlocks.has(blockId)) return;
            
            const ws = Blockly.getMainWorkspace();
            if (!ws) {
                temporarilyExpandedBlocks.delete(blockId);
                return;
            }
            
            const block = ws.getBlockById(blockId);
            if (!block) {
                temporarilyExpandedBlocks.delete(blockId);
                return;
            }
            
            // Restore collapsed state - called before switching tabs, so block is accessible
            try {
                if (block.rendered && typeof block.setCollapsed === 'function' && 
                    typeof block.isCollapsed === 'function' && !block.isCollapsed()) {
                    block.setCollapsed(true);
                    if (typeof block.render === 'function') {
                        block.render();
                    }
                }
            } catch (e) {
                console.warn('[Search] Failed to restore collapsed state:', e);
            }
            
            temporarilyExpandedBlocks.delete(blockId);
        }
        
        // 🔹 Restore all temporarily expanded blocks
        function restoreAllCollapsedStates() {
            temporarilyExpandedBlocks.forEach((_, blockId) => {
                restoreCollapsedState(blockId);
            });
            temporarilyExpandedBlocks.clear();
            currentCollapsedParentId = null;
        }
        
        // 🔹 Check if a block is inside a specific parent
        function isBlockInsideParent(block, parentId) {
            if (!block) return false;
            let current = block.getParent && block.getParent();
            while (current) {
                if (current.id === parentId) return true;
                current = current.getParent && current.getParent();
            }
            return false;
        }

        // 🔹 Highlight the current result
        function jumpToCurrent() {
            const tab = groupedResults[activeTabIndex];
            if (!tab) return;
            const r = tab.results[currentIndexInTab];
            if (!r) return;

            const headers = document.querySelectorAll('.title-bar__tab-header');
            if (headers[r.tabIndex]) headers[r.tabIndex].click();

            setTimeout(() => {
                searchInput.focus();
                const ws = Blockly.getMainWorkspace();
                const b = ws.getBlockById(r.id);
                if (!b) return;
                
                // Traverse parent chain once to find collapsed parent and temp expanded parent
                let blockToHighlight = b;
                let collapsedParent = null;
                let tempExpandedParentId = null;
                let parent = b.getParent && b.getParent();
                
                while (parent) {
                    const isCollapsed = typeof parent.isCollapsed === 'function' && parent.isCollapsed();
                    const isTemporarilyExpanded = temporarilyExpandedBlocks.has(parent.id);
                    
                    if (isCollapsed && !collapsedParent) {
                        collapsedParent = parent;
                    }
                    if (isTemporarilyExpanded && !tempExpandedParentId) {
                        tempExpandedParentId = parent.id;
                    }
                    parent = parent.getParent && parent.getParent();
                }
                
                // Automatically expand collapsed parent if found
                if (collapsedParent) {
                    temporarilyExpandBlock(collapsedParent);
                    if (typeof collapsedParent.bringToFront === 'function') {
                        collapsedParent.bringToFront();
                    }
                    // After expanding, highlight the actual child block
                    blockToHighlight = b;
                    tempExpandedParentId = collapsedParent.id;
                }
                
                const newParentId = collapsedParent ? collapsedParent.id : tempExpandedParentId;
                
                // Restore previous parent if moving away from it
                if (currentCollapsedParentId && currentCollapsedParentId !== newParentId) {
                    const stillInSameParent = newParentId === null && 
                                             isBlockInsideParent(b, currentCollapsedParentId);
                    if (!stillInSameParent) {
                        restoreCollapsedState(currentCollapsedParentId);
                    }
                }
                
                currentCollapsedParentId = newParentId;
                removeCustomHighlight();
                
                // Small delay if we expanded a parent to allow rendering
                const delay = collapsedParent ? EXPAND_RENDER_DELAY : 0;
                setTimeout(() => {
                    ws.centerOnBlock(blockToHighlight.id);
                    ws.highlightBlock(blockToHighlight.id);
                    addCustomHighlight(blockToHighlight);
                    lastHighlightedId = blockToHighlight.id;
                }, delay);
            }, TAB_SWITCH_DELAY);
        }
        
        // 🔹 Expand collapsed parent to show child block
        function expandCollapsedParent() {
            if (!currentCollapsedParentId) return;
            
            const ws = Blockly.getMainWorkspace();
            if (!ws) return;
            
            const parent = ws.getBlockById(currentCollapsedParentId);
            if (parent) {
                temporarilyExpandBlock(parent);
                // Ensure parent is brought to front (bringToFront is called in temporarilyExpandBlock, but ensure it here too)
                if (typeof parent.bringToFront === 'function') {
                    parent.bringToFront();
                }
                // Re-highlight the actual child block now that parent is expanded
                setTimeout(() => {
                    const tab = groupedResults[activeTabIndex];
                    if (tab) {
                        const r = tab.results[currentIndexInTab];
                        if (r) {
                            const b = ws.getBlockById(r.id);
                            if (b) {
                                removeCustomHighlight();
                                ws.centerOnBlock(b.id);
                                ws.highlightBlock(b.id);
                                addCustomHighlight(b);
                                lastHighlightedId = b.id;
                            }
                        }
                    }
                }, EXPAND_RENDER_DELAY);
            }
        }

        function doSearch() {
            const query = searchInput.value.trim();
            if (!query) { groupedResults = []; renderTabsBar(); statusLabel.textContent = '0 results'; return; }
            performSearch(query);
        }

        function closeSearchUI() {
            if (searchOverlay) {
                // Clear any pending search timeout
                clearTimeout(searchTimeout);
                searchTimeout = null;
                
                // Remove custom highlight
                removeCustomHighlight();
                
                // Restore all temporarily expanded blocks
                restoreAllCollapsedStates();
                
                searchOverlay.remove(); searchOverlay = null;
                groupedResults = [];
                if (lastHighlightedId) { 
                    Blockly.getMainWorkspace().highlightBlock(null); 
                    lastHighlightedId = null; 
                }
            }
        }

        function toggleSearchUI(initialQuery = "") {
            refreshBlockCache(); 
            createSearchUI(initialQuery);
        }

        // 🔹 Debug helper
        window.inspectSelectedBlockCache = function() {
            if (!cachedBlocks.length) refreshBlockCache();
            if (!Blockly.selected) return console.warn("[Search] No block selected.");
            const found = cachedBlocks.find(b => b.id === Blockly.selected.id);
            found ? console.log("[Search] Cached object for selected block:", found)
                  : console.warn("[Search] Selected block not found in cache.");
        };

        function getCleanBlockQuery(block) {
            return block?.type?.toLowerCase() || "";
        }

        // 🔹 Hotkeys
        document.addEventListener('keydown', e => {
            // ✅ Only toggle if focus is NOT inside an input/textarea
            const isTyping = document.activeElement && 
                            (document.activeElement.tagName === 'INPUT' || 
                            document.activeElement.tagName === 'TEXTAREA');

            if (!isTyping && e.shiftKey && e.key.toLowerCase() === 'f') {
                toggleSearchUI(Blockly.selected ? getCleanBlockQuery(Blockly.selected) : "");
                e.preventDefault();
            }

            if (e.key === 'Escape') closeSearchUI();
        });
    })();`;
}
</script>
