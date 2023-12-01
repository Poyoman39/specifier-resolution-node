import { register } from "node:module";
import { pathToFileURL } from "node:url";

register('specifier-resolution-node', import.meta.url);
