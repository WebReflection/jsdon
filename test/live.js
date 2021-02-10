const benchJSDON = () => {
  const filter = node => (node.nodeType !== 3 || node.textContent.trim());
  import('//unpkg.com/jsdon?module').then(({fromJSON, toJSON}) => {
    let title = '';

    title = 'JSDON: toJSON(document)';
    console.time(title);
    let json = toJSON(document);
    console.timeEnd(title);

    title = 'JSDON: toJSON(document, filter)';
    console.time(title);
    json = toJSON(document, filter);
    console.timeEnd(title);

    title = 'JSDON: fromJSON(json)';
    console.time(title);
    const doc = fromJSON(json);
    console.timeEnd(title);
  });
};

const benchDOM = () => {
  let title = '';

  title = 'DOM: document.documentElement.outerHTML';
  console.time(title);
  const {outerHTML} = document.documentElement;
  console.timeEnd(title);

  title = 'DOM: DOMParser#parseFromString';
  console.time(title);
  const doc = (new DOMParser).parseFromString(
    '<!doctype html>' + outerHTML,
    'text/html'
  );
  console.timeEnd(title);
};
