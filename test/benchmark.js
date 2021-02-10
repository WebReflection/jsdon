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
