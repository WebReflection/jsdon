import {toJSON} from './to-json.js';

import {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE
} from './constants.js';

export {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE
};

export class Node {
  static get ELEMENT_NODE() { return ELEMENT_NODE; }
  static get ATTRIBUTE_NODE() { return ATTRIBUTE_NODE; }
  static get TEXT_NODE() { return TEXT_NODE; }
  static get COMMENT_NODE() { return COMMENT_NODE; }
  static get DOCUMENT_NODE() { return DOCUMENT_NODE; }
  static get DOCUMENT_TYPE_NODE() { return DOCUMENT_TYPE_NODE; }
  static get DOCUMENT_FRAGMENT_NODE() { return DOCUMENT_FRAGMENT_NODE; }

  get ELEMENT_NODE() { return ELEMENT_NODE; }
  get ATTRIBUTE_NODE() { return ATTRIBUTE_NODE; }
  get TEXT_NODE() { return TEXT_NODE; }
  get COMMENT_NODE() { return COMMENT_NODE; }
  get DOCUMENT_NODE() { return DOCUMENT_NODE; }
  get DOCUMENT_TYPE_NODE() { return DOCUMENT_TYPE_NODE; }
  get DOCUMENT_FRAGMENT_NODE() { return DOCUMENT_FRAGMENT_NODE; }

  constructor(nodeType, localName, ownerDocument = null) {
    this.nodeType = nodeType;
    this.localName = localName;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
  }

  toJSON() { return toJSON(this); }
}

export class Attr extends Node {
  constructor(name, value, ownerDocument) {
    super(ATTRIBUTE_NODE, '#attribute', ownerDocument);
    this.name = name;
    this.value = value;
    this.ownerElement = null;
  }
}

export class DocumentType extends Node {
  constructor(name, ownerDocument) {
    super(DOCUMENT_TYPE_NODE, '#doctype', ownerDocument);
    this.name = name;
  }
}

export class CharacterData extends Node {}

export class Comment extends CharacterData {
  constructor(data, ownerDocument) {
    super(COMMENT_NODE, '#comment', ownerDocument);
    this.data = data;
  }
}

export class Text extends CharacterData {
  constructor(data, ownerDocument) {
    super(TEXT_NODE, '#text', ownerDocument);
    this.data = data;
  }
}

export class ParentNode extends Node {
  constructor(nodeType, localName, ownerDocument) {
    super(nodeType, localName, ownerDocument);
    this.childNodes = [];
  }
}

export class Document extends ParentNode {
  constructor() {
    super(DOCUMENT_NODE, '#document', null);
  }
}

export class DocumentFragment extends ParentNode {
  constructor(ownerDocument) {
    super(DOCUMENT_FRAGMENT_NODE, '#document-fragment', ownerDocument);
  }
}

export class Element extends ParentNode {
  constructor(localName, ownerDocument) {
    super(ELEMENT_NODE, localName, ownerDocument);
    this.attributes = [];
  }
}
