This package intends to help `experimental-specifier-resolution=node` users migrate from Node.js v18 to Node.js v20 without any code change.
- Node.js v18 `node --experimental-specifier-resolution=node`
- Node.js v20 `node --import=specifier-resolution-node/register`

---

This package is based on the [extensionless project](https://www.npmjs.com/package/extensionless) project, but use [import-meta-resolve](https://www.npmjs.com/package/import-meta-resolve) algorithm to get closer to the behavior of node.js 18 with --experimental-loader=specifier-resolution-node

Particulary, it supports `imports: {}` when it's specified in `package.json`

---

Install:

```
npm i specifier-resolution-node
```

Start `node` with one of the following flags added. If you're running on a version of node older than `20.6.0`, use:

```
--experimental-loader=specifier-resolution-node
```

or else, use the newer one instead:

```
--import=specifier-resolution-node/register
```

You can now use import specifiers as file paths without extensions or as directory paths.

---

Customize:

By default specifier-resolution-node will try to append the following extensions: `['js', 'cjs', 'mjs', 'json', 'node', 'wasm']`

You can customize this behavior by setting the environment variable `KNOWN_EXTS` this way:

```
KNOWN_EXTS=js,ts,tsc node --import=specifier-resolution-node/register index.js
```