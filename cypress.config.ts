import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '1hamo3',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
