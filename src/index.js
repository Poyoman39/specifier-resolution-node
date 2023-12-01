import { isBuiltin } from 'node:module';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';
import { moduleResolve } from 'import-meta-resolve';

const baseURL = pathToFileURL(`${cwd()}/`).href;

const KNOWN_EXTS = [
  '.js',
  '.cjs',
  '.mjs',
  '.json',
  '.node',
  '.wasm',
];

const INDEX_FILES = KNOWN_EXTS.map((knownExt) => (
  `index${knownExt}`
));

export async function resolve(specifier, context, next) {
  const { parentURL = baseURL } = context;

  if (isBuiltin(specifier)) {
    return next(specifier, context);
  }

  let error;

  const resolution = (() => {
    // Try direct import
    try {
      return moduleResolve(
        specifier,
        parentURL || import.meta.url,
        new Set(context.conditions),
      );
    } catch (_error) {
      error = _error;
    }

    // Try with added extensions
    for (let i = 0; i < KNOWN_EXTS.length; i += 1) {
      const knownExt = KNOWN_EXTS[i];

      try {
        return moduleResolve(
          `${specifier}${knownExt}`,
          parentURL || import.meta.url,
          new Set(context.conditions),
        );
      } catch {
        // continue regardless of error
      }
    }

    // Try with added index file
    for (let i = 0; i < INDEX_FILES.length; i += 1) {
      const indexFile = INDEX_FILES[i];

      try {
        return moduleResolve(
          `${specifier}/${indexFile}`,
          parentURL || import.meta.url,
          new Set(context.conditions),
        );
      } catch {
        // continue regardless of error
      }
    }

    // No imports worked => throw direct import error
    throw error;
  })();

  return next(resolution.href, context);
}
