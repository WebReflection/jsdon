import {
  NODE_END,
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE
} from './constants.js';

const {parse} = JSON;

export const fromJSON = (value, ownerDocument = document) => {
  const array = typeof value === 'string' ? parse(value) : value;
  const {length} = array;
  const fragment = ownerDocument.createDocumentFragment();
  let parentNode = fragment;
  let isFragment = false;
  let doc = ownerDocument;
  let skipCheck = true;
  let i = 0;
  while (i < length) {
    let nodeType = array[i++];
    switch (nodeType) {
      case ELEMENT_NODE:
        const localName = array[i++];
        // avoid re-creating the root element (html, svg, or root)
        if (skipCheck || localName.toLowerCase() !== parentNode.localName.toLowerCase())
          parentNode = parentNode.appendChild(doc.createElement(localName));
        skipCheck = true;
        break;
      case ATTRIBUTE_NODE:
        const name = array[i++];
        const value = i < length && typeof array[i] === 'string' ? array[i++] : '';
        if (name === 'is') {
          const ce = doc.createElement(parentNode.localName, {is: value});
          for (let {attributes} = parentNode, {length} = attributes, i = 0; i < length; i++)
            ce.setAttributeNode(attributes[i]);
          parentNode.parentNode.replaceChild(ce, parentNode);
          parentNode = ce;
        }
        else
          parentNode.setAttribute(name, value);
        break;
      case TEXT_NODE:
        parentNode.appendChild(doc.createTextNode(array[i++]));
        break;
      case COMMENT_NODE:
        parentNode.appendChild(doc.createComment(array[i++]));
        break;
      case DOCUMENT_NODE:
        const parser = new ownerDocument.defaultView.DOMParser;
        if (array[i] === DOCUMENT_TYPE_NODE) {
          i++;
          switch (array[i++]) {
            case 'html':
            case 'HTML':
              doc = parser.parseFromString('<!DOCTYPE html><html></html>', 'text/html');
              break;
            /* c8 ignore start */
            case 'svg':
            case 'SVG':
              doc = parser.parseFromString('<!DOCTYPE svg><svg />', 'image/svg+xml');
              break;
            default:
              doc = parser.parseFromString('<root />', 'text/xml');
              break;
            /* c8 ignore stop */
          }
        }
        else
          doc = parser.parseFromString('<html></html>', 'text/html');
        parentNode = doc.documentElement;
        skipCheck = false;
        break;
      case DOCUMENT_FRAGMENT_NODE:
        isFragment = true;
        break;
      default:
        do {
          nodeType -= NODE_END;
          parentNode = parentNode.parentNode || fragment;
        }
        while (nodeType < 0);
        break;
    }
  }
  if (isFragment)
    return fragment;
  if (doc !== ownerDocument)
    return doc;
  return fragment.firstChild;
};
