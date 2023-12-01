Node.js loader for import specifiers as file paths without extensions or as directory paths.

This package intends to make the [extensionless project](https://www.npmjs.com/package/extensionless) works with [import-meta-resolve](https://www.npmjs.com/package/import-meta-resolve) algorithm so that it's closer to the behavior of node.js 18 with --experimental-loader=specifier-resolution-node

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

You can now use import specifiers as file paths without extensions or as directory paths:

```js
// imports from the first existing file in the candidates list as follows

import mod from './mod'
// ['./mod.js', './mod/index.js']

import mod from '../mod' assert {type: 'json'}
// ['../mod.json', '../mod/index.json']

import api from '/apps/api'
// ['/apps/api.js', '/apps/api/index.js']

import web from 'file:///apps/web'
// ['file:///apps/web.js', 'file:///apps/web/index.js']
```

&nbsp;

When it can be deduced from the specifier that its target is a directory, the resolver looks for only the index files:

```js
// imports from the first existing file in the candidates list as follows

import cur from '.'
// ['./index.js']

import up from '..'
// ['../index.js']

import mod from './mod/'
// ['./mod/index.js']

import mod from '../mod/' assert {type: 'json'}
// ['../mod/index.json']

import api from '/apps/api/'
// ['/apps/api/index.js']

import web from 'file:///apps/web/'
// ['file:///apps/web/index.js']
```
