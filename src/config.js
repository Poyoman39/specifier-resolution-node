import {readFile} from 'fs/promises'
import {dirname, isAbsolute, join} from 'path'
import {argv, cwd} from 'process'

let pkgJson = await (async () => {
  let curDir, upDir = isAbsolute(argv[1] ?? '') ? argv[1] : cwd()

  do {
    try {
      return JSON.parse(await readFile(join(curDir = upDir, 'package.json'), 'utf8'))
    } catch (e) {
      if (!['ENOTDIR', 'ENOENT', 'EISDIR'].includes(e.code)) {
        throw new Error('Cannot retrieve package.json', {cause: e})
      }
    }
  } while (curDir !== (upDir = dirname(curDir)))
})()

let warn = (field, desc) => console.warn('⚠️ \x1b[33m%s\x1b[0m', `Warning: The package.json field 'extensionless.${field}' must be ${desc}! Using the default value instead...`)

let defaults = {
  lookFor: ['js']
}, {
  lookFor
} = {...defaults, ...pkgJson?.extensionless}

Array.isArray(lookFor) && lookFor.length && lookFor.every(a => typeof a === 'string' && /^[a-z]+\w*$/i.test(a)) || (
  lookFor = defaults.lookFor, warn('lookFor', 'an array of alphanumeric strings')
)

export {
  lookFor
}
