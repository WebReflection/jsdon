const {readFile} = require('fs');
const {join} = require('path');

const {DOMParser, parseJSON} = require('linkedom');

const {toJSON, fromJSON} = require('../cjs/index.js');

const trim = value => {
  return typeof value === 'string' ? value.trim() : value;
};

readFile(join(__dirname, 'html.html'), (_, data) => {
  let title = '';

  const document = (new DOMParser).parseFromString(data.toString(), 'text/html');
  document.normalize();

  title = 'JSDON: toJSON(document)';
  console.time(title);
  let jsdon = toJSON(document, node => (node.nodeType !== 3 || node.textContent.trim()));
  console.timeEnd(title);

  title = 'JSDON: fromJSON(json)';
  console.time(title);
  let doc = fromJSON(jsdon, document);
  console.timeEnd(title);

  title = 'LinkeDOM: document.toJSON()';
  console.time(title);
  let json = document.toJSON();
  console.timeEnd(title);

  title = 'LinkeDOM: parseJSON(json)';
  console.time(title);
  let parsed = parseJSON(json);
  console.timeEnd(title);

  title = 'LinkeDOM: parseJSON(jsdon)';
  console.time(title);
  let reparsed = parseJSON(jsdon);
  console.timeEnd(title);


  console.assert(!!reparsed && !!parsed && !!doc);
  for (let i = 0, {length} = jsdon; i < length; i++)
    console.assert(trim(jsdon[i]) === trim(json[i]), json[i]);
});

/* simpler but 3X+ slower
function* traverse(node) {
  const {nodeType} = node;
  yield nodeType;
  switch (nodeType) {
    case node.ELEMENT_NODE:
      yield node.localName;
      for (const attr of node.attributes) {
        yield node.ATTRIBUTE_NODE;
        yield attr.name;
        if (attr.value.trim())
          yield attr.value;
      }
    case node.DOCUMENT_FRAGMENT_NODE:
    case node.DOCUMENT_NODE:
      let child = node.firstChild;
      while (child) {
        yield* traverse(child);
        child = child.nextSibling;
      }
      yield -1;
      break;
    case node.TEXT_NODE:
    case node.COMMENT_NODE:
      yield node.nodeValue;
      break;
    case node.DOCUMENT_TYPE_NODE:
      yield node.name;
      break;
  }
}

function jsDON(node) {
  const out = [];
  let i = 0;
  for (const value of traverse(node)) {
    if (typeof value === 'number' && value < 0) {
      if (typeof out[i] === 'number') {
        out[i] += value;
        continue;
      }
    }
    i = out.push(value) - 1;
  }
  return out;
}

console.time('jsDON generator');
[...traverse(document)];
console.timeEnd('jsDON generator');

console.time('JSDON.toJSON');
JSDON.toJSON(document);
console.timeEnd('JSDON.toJSON');
*/
