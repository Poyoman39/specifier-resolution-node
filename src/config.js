import {readFile} from 'fs/promises'
import {dirname, isAbsolute, join} from 'path'
import {cwd} from 'process'

let warn = (field, desc) => console.warn('⚠️ \x1b[33m%s\x1b[0m',
  `Warning: The package.json field 'extensionless.${field}' must be ${desc}! Using the default value instead...`)

let getPkgJson = async argv1 => {
  let path = isAbsolute(argv1 ?? '') ? argv1 : cwd()

  do {
    try {
      return JSON.parse(await readFile(join(path, 'package.json'), 'utf8'))
    } catch (e) {
      if (!['ENOTDIR', 'ENOENT', 'EISDIR'].includes(e.code)) {
        throw new Error('Cannot retrieve package.json', {cause: e})
      }
    }
  } while (path !== (path = dirname(path)))
}

export async function getConfig({argv1} = {}) {
  let defaults = {
    lookFor: ['js']
  }, {
    lookFor
  } = {...defaults, ...(await getPkgJson(argv1))?.extensionless}

  Array.isArray(lookFor) && lookFor.length && lookFor.every(a => typeof a === 'string' && /^[a-z]\w*$/i.test(a)) || (
    lookFor = defaults.lookFor, warn('lookFor', 'an array of alphanumeric strings')
  )

  return {lookFor}
}
