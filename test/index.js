import './dir'
import './dir' assert {type: 'json'}

import './dir/'
import './dir/' assert {type: 'json'}

import './dir/index'
import './dir/index' assert {type: 'json'}

import './dir/index.js'
import './dir/index.json' assert {type: 'json'}

import './dir/ext'

import './dir/sub/rel'

console.log('✅ \x1b[32m%s\x1b[0m', 'Loaded all the modules successfully.')
