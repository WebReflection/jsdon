const {DOMParser} = require('linkedom');

const {toJSON, fromJSON} = require('../cjs/index.js');

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

console.assert(
  JSON.stringify(json) ===
  JSON.stringify([9,10,"html",3,"\n",3,"\n",1,"html",2,"lang","en",3,"\n  ",1,"head",3," ",-1,3,"\n  ",1,"body",3,"\n    Text\n    ",8,"Comment",3,"\n  ",-1,3,"\n",-1,3,"\n",-1]),
  'expected outcome'
);

console.assert(
  fromJSON([9,10,"html",3,"\n",3,"\n",1,"html",2,"lang","en",3,"\n  ",1,"head",3," ",-1,3,"\n  ",1,"body",3,"\n    Text\n    ",8,"Comment",3,"\n  ",-1,3,"\n",-1,3,"\n",-1], document).isEqualNode(fromJSON(json, document)),
  'from JSON document'
);

json.splice(1, 2);
console.assert(
  fromJSON([9,3,"\n",3,"\n",1,"html",2,"lang","en",3,"\n  ",1,"head",3," ",-1,3,"\n  ",1,"body",3,"\n    Text\n    ",8,"Comment",3,"\n  ",-1,3,"\n",-1,3,"\n",-1], document).isEqualNode(fromJSON(json, document)),
  'from JSON document'
);

console.assert(
  fromJSON([11,1,"hello",-2], document).childNodes[0].localName === 'hello',
  'from JSON fragment'
);

json = toJSON(document, node => node.nodeType !== 3 || node.textContent.trim());
console.assert(
  JSON.stringify(json) ===
  JSON.stringify([9,10,"html",1,"html",2,"lang","en",1,"head",-1,1,"body",3,"\n    Text\n    ",8,"Comment",-3]),
  'expected shrank outcome'
);

let fragment = document.createDocumentFragment();
fragment.appendChild(document.documentElement.cloneNode(true));

json = toJSON(fragment, node => node.nodeType !== 3 || node.textContent.trim());
console.assert(
  JSON.stringify(json) ===
  JSON.stringify([11,1,"html",2,"lang","en",1,"head",-1,1,"body",3,"\n    Text\n    ",8,"Comment",-3]),
  'expected shrank outcome'
);


console.assert(fromJSON('[1,"test",-1]', document).outerHTML === '<test></test>', 'fromJSON element is OK');
console.assert(fromJSON('[1,"test",2,"ok",2,"is","custom",-1]', document).outerHTML === '<test ok="" is="custom"></test>', 'fromJSON attribute is OK');
console.assert(fromJSON('[3,"test"]', document).toString() === 'test', 'fromJSON text is OK');
console.assert(fromJSON('[8,"test"]', document).toString() === '<!--test-->', 'fromJSON comment is OK');
console.assert(fromJSON([], document) === null, 'fromJSON empty is null');
fragment = document.createDocumentFragment();
fragment.append(document.createTextNode('OK'));
console.assert(fromJSON(toJSON(fragment), document).childNodes.join('') === 'OK', 'fromJSON fragment is OK');

// document = (new DOMParser).parseFromString(`<!doctype html><html><svg><rect /></svg></html>`, 'text/html');
document = fromJSON([9,10,"html",1,"html",1,"svg",1,"rect",-4], document);

console.assert('ownerSVGElement' in document.querySelector('svg'), 'svg restored');

document = fromJSON([9,10,"html","-//W3C//DTD HTML 4.01//EN","http://www.w3.org/TR/html4/strict.dtd",1,"html",1,"svg",1,"rect",-4], document);
console.assert(JSON.stringify(toJSON(document)) === JSON.stringify([9,10,"html","-//W3C//DTD HTML 4.01//EN","http://www.w3.org/TR/html4/strict.dtd",1,"html",1,"svg",1,"rect",-4]));
document = fromJSON([9,10,"html","-//IETF//DTD HTML 2.0//EN",1,"html",1,"svg",1,"rect",-4], document);
console.assert(JSON.stringify(toJSON(document)) === JSON.stringify([9,10,"html","-//IETF//DTD HTML 2.0//EN",1,"html",1,"svg",1,"rect",-4]));
document = fromJSON([9,10,"html","http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd",1,"html",1,"svg",1,"rect",-4], document);
console.assert(JSON.stringify(toJSON(document)) === JSON.stringify([9,10,"html","http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd",1,"html",1,"svg",1,"rect",-4]));
