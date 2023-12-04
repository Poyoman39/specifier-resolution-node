This package intends to help people migrate from Node.js v18 `node --experimental-specifier-resolution=node` to Node.js v20 `node --import=specifier-resolution-node/register` and have the same behavior without any code change.

This package is based on the [extensionless project](https://www.npmjs.com/package/extensionless) project, but import [import-meta-resolve](https://www.npmjs.com/package/import-meta-resolve) algorithm so that it's closer to the behavior of node.js 18 with --experimental-loader=specifier-resolution-node

Particulary, it supports `imports: {}` when it's specified in `package.json`

&nbsp;

Install:

```
npm i specifier-resolution-node
```

&nbsp;

Start `node` with one of the following flags added. If you're running on a version of node older than `20.6.0`, use:

```
--experimental-loader=specifier-resolution-node
```

or else, use the newer one instead:

```
--import=specifier-resolution-node/register
```

&nbsp;

You can now use import specifiers as file paths without extensions or as directory paths.