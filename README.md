# \_\_vitest-monorepo-coverage

This repository demonstrates a difference in Vitest's code coverage gathering when working with mono-repos.

## Summary

If you're working with a mono-repo where internal package `b` depends on another internal package `a`, and Vitest is executed from the mono-repo root using the `-r` flag to define the root of the package to test, the code coverage report will include the files from `a` in the despite it being a dependency.

## Expected Behavior

Regardless of what the current working directory is, because the `-r` flag is being used to point to a Vitest project root, I would expect that the `--coverage` flag works the same exact way.

## Demonstration

### Setup

Start off by cloning this repository and installing the dependencies using `npm install`

### Base Case: `packages/b` Tests from `packages/b`

When running the tests for `packages/b` from that package's root, the code coverage report only includes source files from that package. You can demonstrate this by running `npm test` within `packages/b`, which prints a coverage report like this:

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |
 add-and-double.js |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

### Error Case: `packages/b` Tests from Workspace Root

When running the tests for `packages/b` from the workspace root -- which is supported by the `-r` flag -- the coverage report includes the files for `packages/a` as well as the expected ones from `packages/b`. You can demonstrate this by running `npm test` from the workspace root, which prints a coverage report like this:

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |      100 |     100 |     100 |
 a/src              |     100 |      100 |     100 |     100 |
  add.js            |     100 |      100 |     100 |     100 |
  index.js          |     100 |      100 |     100 |     100 |
 b/src              |     100 |      100 |     100 |     100 |
  add-and-double.js |     100 |      100 |     100 |     100 |
--------------------|---------|----------|---------|---------|-------------------
```

## Potential Resolutions

### `coverage.excludes`

There is a `coverage.excludes` configuration option that can be used to exclude certain source files from the coverage report. However, it is unclear how this would be used to exclude files from a sibling package. All of the following patterns within that option _did not_ exclude it from the coverage report:

- `../a`
- `node_modules/a`
- `a`

The following option _did_ work, but is confusing from the perspective of running the tests from the `packages/b` directory, since it's a path relative to the workspace root.

- `packages/a`

However, it has the side-effect of now including the test files for `package/b` in the coverage report. This can be resolved by spreading the `configDefaults.coverage.excludes` value that `vitest/config` exports into the `excludes` array, but this feels like a lot of ceremony just to restore the original behavior (and still feels weird since the `packages/a` path is relative to the worksace root, and one would assume that paths in the `vitest.config.js` file are relative to the directory it is located within, or at least relative to the directory specified by the `-r` flag).
