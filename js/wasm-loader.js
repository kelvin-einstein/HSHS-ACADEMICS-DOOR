/**
 * WebAssembly integration loader
 * Hook for WASM modules (fast search, offline filters). JS fallback when unavailable.
 */
(function () {
  async function tryLoadWasm() {
    if (typeof WebAssembly === "undefined") {
      console.info("[HSHS] WebAssembly not supported — using JS fallback.");
      return null;
    }
    try {
      const bytes = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
      const result = await WebAssembly.instantiate(bytes);
      console.info("%c[HSHS] WebAssembly runtime OK — ready for modules", "color:#6366f1;font-weight:bold");
      window.__HSHS_WASM__ = { ready: true, module: result.module };
      return result;
    } catch (e) {
      console.warn("[HSHS] WASM probe failed:", e.message);
      return null;
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryLoadWasm);
  } else {
    tryLoadWasm();
  }
})();
