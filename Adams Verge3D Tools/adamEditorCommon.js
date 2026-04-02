/**
 * Optional: same logic is injected at runtime by init.plug when using Adam's toolbox init.
 * If you load puzzles without init.plug, you can include this script in the puzzle editor page.
 */
(function () {
  if (window.__adamEditorCommon) return;
  window.__adamEditorCommon = true;
  window.__adamHasLogicParam = function () {
    try {
      return new URLSearchParams(window.location.search).has('logic');
    } catch (e) {
      return false;
    }
  };
  window.__adamIsTypingTarget = function (el) {
    if (!el) return false;
    var tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    if (el.isContentEditable) return true;
    if (el.contentEditable === 'true') return true;
    return false;
  };
  window.__adamGlassStyles = {
    panelShell:
      'background: linear-gradient(180deg, #101827bf, #0b1324cc); border: 1px solid #ffffff22; box-shadow: 0 20px 40px rgba(2, 6, 23, .45); backdrop-filter: blur(10px) saturate(120%);',
    inputField:
      'background: linear-gradient(180deg, #0c1322, #0a111e); border: 1px solid #ffffff1a; border-radius: 14px;'
  };
})();
