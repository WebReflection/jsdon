'use strict';
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('domconstants/constants'));

const NODE_END = -1;
exports.NODE_END = NODE_END;
const UNKNOWN = 42;
exports.UNKNOWN = UNKNOWN;
