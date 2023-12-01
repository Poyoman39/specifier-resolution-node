import { register } from 'node:module';
import { argv } from 'node:process';

register(
  './index.js',
  import.meta.url,
  { data: { argv1: argv[1] } },
);
