const {toJSON} = require('../cjs/to-json.js');
const {asTree} = require('../cjs/as-tree.js');

const json = [9,10,"html",1,"html",2,"lang","en",1,"head",-1,1,"body",3,"\n    Text\n    ",8,"Comment",-3];

const document = asTree(json);
const html = document.childNodes[1];
const body = html.childNodes[1];

console.assert(document.parentNode === null);
console.assert(html.parentNode === document);
console.assert(body.parentNode === html);
console.assert(body.childNodes.every(node => node.parentNode === body));

console.assert(JSON.stringify(toJSON(document)) === JSON.stringify(json));
