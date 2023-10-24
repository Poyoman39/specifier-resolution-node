import {extname, isAbsolute} from 'path'
import {getConfig} from './config.js'

let initPromise
export function globalPreload({port}) {
  port.onmessage = e => initPromise = initialize({argv1: e.data})

  return 'port.postMessage(process.argv[1])'
}

let indexFiles, candidates
export async function initialize(data) {
  let {lookFor} = await getConfig(data)

  indexFiles = [lookFor.map(e => `index.${e}`), ['index.json']]
  candidates = indexFiles.map(i => i.map(f => extname(f)).concat(i.map(f => `/${f}`)))
}

let relSpecs = ['.', '..'], prefixes = ['./', '../', 'file://', '.\\', '..\\']
let extToSkip = ['.js', '.cjs', '.mjs', '.json', '.node', '.wasm'], empty = [[], []]

export async function resolve(specifier, context, nextResolve) {
  let isAbs = isAbsolute(specifier)

  if (!isAbs && !relSpecs.includes(specifier) && !prefixes.some(p => specifier.startsWith(p))) {
    return await nextResolve(specifier)
  }

  let selfURL = new URL((isAbs ? 'file://' : '') + specifier, context.parentURL).href
  let isJson = (context.importAttributes ?? context.importAssertions)?.type === 'json'

  await initPromise
  let postfixes = selfURL.endsWith('/') ? indexFiles : extToSkip.includes(extname(selfURL)) ? empty : candidates

  for (let postfix of postfixes[+isJson]) {
    try {
      return await nextResolve(selfURL + postfix)
    } catch {}
  }

  return await nextResolve(selfURL)
}
