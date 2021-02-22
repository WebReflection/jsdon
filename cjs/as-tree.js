'use strict';
const {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE
} = require('./constants.js');

const {toJSON} = require('./to-json.js');

exports.ELEMENT_NODE = ELEMENT_NODE;
exports.ATTRIBUTE_NODE = ATTRIBUTE_NODE;
exports.TEXT_NODE = TEXT_NODE;
exports.COMMENT_NODE = COMMENT_NODE;
exports.DOCUMENT_NODE = DOCUMENT_NODE;
exports.DOCUMENT_TYPE_NODE = DOCUMENT_TYPE_NODE;
exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;

class Node {
  constructor(ownerDocument, nodeType, localName) {
    this.nodeType = nodeType;
    this.localName = localName;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
  }

  toJSON() {
    return toJSON(this);
  }
}
exports.Node = Node

class Attr extends Node {
  constructor(ownerDocument, name, value) {
    super(ownerDocument, ATTRIBUTE_NODE, '#attribute');
    this.name = name;
    this.value = value;
    this.ownerElement = null;
  }
}
exports.Attr = Attr

class Comment extends Node {
  constructor(ownerDocument, data) {
    super(ownerDocument, COMMENT_NODE, '#comment');
    this.data = data;
  }
}
exports.Comment = Comment

class Text extends Node {
  constructor(ownerDocument, data) {
    super(ownerDocument, TEXT_NODE, '#text');
    this.data = data;
  }
}
exports.Text = Text

class DocumentType extends Node {
  constructor(ownerDocument, name) {
    super(ownerDocument, DOCUMENT_TYPE_NODE, '#doctype');
    this.name = name;
  }
}
exports.DocumentType = DocumentType

class ParentNode extends Node {
  constructor(ownerDocument, nodeType, localName) {
    super(ownerDocument, nodeType, localName);
    this.childNodes = [];
  }
}
exports.ParentNode = ParentNode

class Document extends ParentNode {
  constructor() {
    super(null, DOCUMENT_NODE, '#document');
  }
}
exports.Document = Document

class DocumentFragment extends ParentNode {
  constructor(ownerDocument) {
    super(ownerDocument, DOCUMENT_FRAGMENT_NODE, '#document-fragment');
  }
}
exports.DocumentFragment = DocumentFragment

class Element extends ParentNode {
  constructor(ownerDocument, localName) {
    super(ownerDocument, ELEMENT_NODE, localName);
    this.attributes = [];
  }
}
exports.Element = Element

const toDocument = (jsdon, document, i, length) => {
  const {childNodes} = document;
  while (i < length) {
    switch (jsdon[i++]) {
      case ELEMENT_NODE: {
        const element = new Element(document, jsdon[i++]);
        element.parentNode = document;
        childNodes.push(element);
        i = toElement(jsdon, element, i, length);
        break;
      }
      case DOCUMENT_TYPE_NODE: {
        const docType = new DocumentType(document, jsdon[i++]);
        docType.parentNode = document;
        childNodes.push(docType);
        break;
      }
    }
  }
  return document;
};

const addDataChar = (parentNode, dataChar) => {
  dataChar.parentNode = parentNode;
  parentNode.childNodes.push(dataChar);
};

const toFragment = (jsdon, fragment, i, length) => {
  while (i < length) {
    switch (jsdon[i++]) {
      case TEXT_NODE: {
        addDataChar(fragment, new Text(null, jsdon[i++]));
        break;
      }
      case COMMENT_NODE: {
        addDataChar(fragment, new Comment(null, jsdon[i++]));
        break;
      }
      case ELEMENT_NODE: {
        const element = new Element(null, jsdon[i++]);
        element.parentNode = fragment;
        fragment.childNodes.push(element);
        i = toElement(jsdon, element, i, length);
        break;
      }
    }
  }
  return fragment;
};

const toElement = (jsdon, element, i, length) => {
  const {ownerDocument} = element;
  while (i < length) {
    switch (jsdon[i++]) {
      case TEXT_NODE: {
        addDataChar(element, new Text(ownerDocument, jsdon[i++]));
        break;
      }
      case COMMENT_NODE: {
        addDataChar(element, new Comment(ownerDocument, jsdon[i++]));
        break;
      }
      case ATTRIBUTE_NODE: {
        const name = jsdon[i++];
        const value = typeof jsdon[i] === 'string' ? jsdon[i++] : '';
        const attr = new Attr(ownerDocument, name, value);
        attr.ownerElement = element;
        element.attributes.push(attr);
        break;
      }
      case ELEMENT_NODE: {
        const child = new Element(ownerDocument, jsdon[i++]);
        child.parentNode = element;
        element.childNodes.push(child);
        i = toElement(jsdon, child, i, length);
        break;
      }
      default:
        return i;
    }
  }
};

const asTree = (jsdon) => {
  const {length} = jsdon;
  switch (length && jsdon[0]) {
    case DOCUMENT_NODE:
      return toDocument(jsdon, new Document, 1, length);
    case DOCUMENT_FRAGMENT_NODE:
      return toFragment(jsdon, new DocumentFragment(null), 1, length);
    case ELEMENT_NODE: {
      const element = new Element(null, jsdon[1]);
      toElement(jsdon, element, 2, length);
      return element;
    }
  }
  return null;
};
exports.asTree = asTree;
