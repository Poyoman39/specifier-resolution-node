import {extname} from 'path'
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

let winAbsPath = /^[/\\]?[a-z]:[/\\]/i, relSpecs = ['.', '..']
let specStarts = ['./', '../', '/', 'file://', 'https://', '.\\', '..\\', '\\']
let knownExts = ['.js', '.cjs', '.mjs', '.json', '.node', '.wasm'], empty = [[], []]

export async function resolve(specifier, context, nextResolve) {
  let prefix = winAbsPath.test(specifier) ? 'file://' : ''

  if (!prefix && !relSpecs.includes(specifier) && !specStarts.some(p => specifier.startsWith(p))) {
    return await nextResolve(specifier)
  }

  let selfURL = new URL(prefix + specifier, context.parentURL).href

  let {type} = context.importAttributes ?? context.importAssertions
  let postfixes = (await initPromise, selfURL.endsWith('/') ? indexFiles : knownExts.includes(extname(selfURL)) ? empty : candidates)

  for (let postfix of postfixes[+(type === 'json')]) {
    try {
      return await nextResolve(selfURL + postfix)
    } catch {}
  }

  return await nextResolve(selfURL)
}
