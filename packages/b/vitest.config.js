import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude,
        // Un-commenting the next line fixes the problem, but is not an intuitive fix
        // since the path is relative to the workspace root, rather than this file
        // "packages/a"
      ],
    },
  },
});
