const {DOMParser} = require('linkedom');
// not needed with next linkedom update
global.DOMParser = DOMParser;

const {toJSON, fromJSON} = require('../cjs');

let document = (new DOMParser).parseFromString(`
<!doctype html>
<html lang="en">
  <head> </head>
  <body>
    Text
    <!--Comment-->
  </body>
</html>
`, 'text/html');

let json = toJSON(document);

console.log(JSON.stringify(json));

/*
console.assert(JSON.stringify(json) === JSON.stringify(toJSON(fromJSON(json, document))), 'whole document is OK');

let fragment = document.createDocumentFragment();
fragment.append(...document.documentElement.childNodes);

json = toJSON(fragment);
console.assert(JSON.stringify(json) === '[11,3,"\\n  ",1,"head",3," ",0,3,"\\n  ",1,"body",3,"\\n    Text\\n    ",8,"Comment",3,"\\n  ",0,3,"\\n",0]', 'fragment as JSON');
console.assert(JSON.stringify(json) === JSON.stringify(toJSON(fromJSON(json, document))), 'fragment is OK');
console.assert(JSON.stringify(toJSON(fragment, node => node.nodeType !== 3 || !!node.textContent.trim())) === '[11,1,"head",0,1,"body",3,"\\n    Text\\n    ",8,"Comment",0,0]', 'fragment as JSON');

console.assert(JSON.stringify(toJSON(document.createElement('test'))) === '[1,"test",0]', 'element is parsed OK');
console.assert(JSON.stringify(toJSON(document.createAttribute('test'))) === '[2,"test"]', 'attribute is parsed OK');
console.assert(JSON.stringify(toJSON(document.createTextNode('test'))) === '[3,"test"]', 'text is parsed OK');
console.assert(JSON.stringify(toJSON(document.createComment('test'))) === '[8,"test"]', 'comment is parsed OK');

console.assert(fromJSON('[1,"test",0]', document).outerHTML === '<test></test>', 'fromJSON element is OK');
console.assert(fromJSON('[1,"test",2,"ok",2,"is","custom",0]', document).outerHTML === '<test ok is="custom"></test>', 'fromJSON attribute is OK');
console.assert(fromJSON('[3,"test"]', document).toString() === 'test', 'fromJSON text is OK');
console.assert(fromJSON('[8,"test"]', document).toString() === '<!--test-->', 'fromJSON comment is OK');
console.assert(fromJSON([], document) === null, 'fromJSON empty is null');
fragment = document.createDocumentFragment();
fragment.append(document.createTextNode('OK'));
console.assert(fromJSON(toJSON(fragment), document).childNodes.join('') === 'OK', 'fromJSON fragment is OK');
*/
