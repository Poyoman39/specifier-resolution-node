/* eslint-disable no-console */
import { isBuiltin } from 'node:module';
import { moduleResolve as _moduleResolve } from 'import-meta-resolve';

const pause = (duration) => new Promise((_resolve) => {
  setTimeout(_resolve, duration);
});

const KNOWN_EXTS = process.env.KNOWN_EXTS?.split(',') || [
  'js',
  'cjs',
  'mjs',
  'json',
  'node',
  'wasm',
];

const debugMode = process.env.SPECIFIER_RESOLUTION_NODE_DEBUG === 'true';

const INDEX_FILES = KNOWN_EXTS.map((knownExt) => (
  `index.${knownExt}`
));

// Decorate for debug purpose
const moduleResolve = (specifier, ...args) => {
  if (debugMode) {
    console.log(`Try specifier "${specifier}"`);
  }

  return _moduleResolve(specifier, ...args);
};

export async function resolve(specifier, context, next) {
  const parentURL = new URL(context.parentURL ?? import.meta.url);

  if (isBuiltin(specifier)) {
    return next(specifier, context);
  }

  const resolution = await (async () => {
    // Try direct import
    try {
      return moduleResolve(
        specifier,
        parentURL,
        new Set(context.conditions),
      );
    } catch {
      // continue regardless of error
    }

    // Try with added extensions
    for (let i = 0; i < KNOWN_EXTS.length; i += 1) {
      const knownExt = KNOWN_EXTS[i];

      try {
        return moduleResolve(
          `${specifier}.${knownExt}`,
          parentURL,
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
          parentURL,
          new Set(context.conditions),
        );
      } catch {
        // continue regardless of error
      }
    }

    // No imports worked => throw
    throw new Error(`Can't resolve import specifier "${specifier}"`);
  })();

  if (debugMode) {
    await pause(100);
  }

  return next(resolution.href, context);
}
