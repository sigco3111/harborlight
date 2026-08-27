import { defineConfig } from "vite";

// GitHub Pages serves this site from a sub-path
// (https://<owner>.github.io/harborlight/), so we anchor every emitted asset
// URL under the repository name. Without this, the built `dist/index.html`
// references `/assets/index-XXX.js` and the page renders as a blank white
// screen because the browser resolves those paths against the domain root.
export default defineConfig({
  base: "/harborlight/",
});
