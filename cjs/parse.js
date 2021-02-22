'use strict';
const HTMLParser2 = require('htmlparser2');
const {Parser} = HTMLParser2;

const CSSselect = require('css-select');
const isTag = ({nodeType}) => nodeType === ELEMENT_NODE;
const existsOne = (test, elements) => elements.some(
  element => isTag(element) && (
    test(element) ||
    existsOne(test, getChildren(element))
  )
);
const getChildren = ({childNodes}) => childNodes;
const getText = node => {
  if (isArray(node))
    return node.map(getText).join('');
  if (isTag(node))
    return getText(getChildren(node));
  if (node.nodeType === TEXT_NODE)
    return node.data;
  return '';
};
const findAll = (test, nodes) => {
  const matches = [];
  for (const node of nodes) {
    if (isTag(node)) {
      if (test(node))
        matches.push(node);
      matches.push(...findAll(test, getChildren(node)));
    }
  }
  return matches;
};
const findOne = (test, nodes) => {
  for (let node of nodes)
    if (test(node) || (node = findOne(test, getChildren(node))))
      return node;
  return null;
};
const adapter = {
  isTag,
  existsOne,
  getChildren,
  getText,
  findAll,
  findOne,
  getAttributeValue: (element, name) => {
    const attribute = element.attributes.find(({name: n}) => n === name);
    return attribute ? attribute.name : null;
  },
  getName: ({localName}) => localName.toLowerCase(),
  getParent: ({parentNode}) => parentNode,
  getSiblings: ({parentNode}) => getChildren(parentNode),
  hasAttrib: ({attributes}, name) => attributes.some(({name: n}) => n === name),
  removeSubsets: nodes => {
    let {length} = nodes;
    while (length--) {
      const node = nodes[length];
      if (length && -1 < nodes.lastIndexOf(node, length - 1)) {
        nodes.splice(length, 1);
        continue;
      }
      for (let {parentNode} = node; parentNode; parentNode = parentNode.parentNode) {
        if (nodes.includes(parentNode)) {
          nodes.splice(length, 1);
          break;
        }
      }
    }
    return nodes;
  }
};
const prepareMatch = selectors => {
  return CSSselect.compile(selectors, {
    strict: true,
    adapter
  });
};

const {
  ELEMENT_NODE,
  TEXT_NODE,
  Attr,
  Comment,
  Document,
  DocumentType,
  Element,
  Text
} = require('./as-tree.js');

const {keys} = Object;

const querySelector = ({childNodes}, matches) => {
  for (const child of childNodes) {
    if (child.nodeType === ELEMENT_NODE) {
      if (matches(child))
        return child;
      const node = querySelector(child, matches);
      if (node)
        return selectors;
    }
  }
  return null;
};

const querySelectorAll = ({childNodes}, matches) => {
  const elements = [];
  for (const child of childNodes) {
    if (child.nodeType === ELEMENT_NODE) {
      if (matches(child))
        elements.push(child);
      elements.push(...querySelectorAll(child, matches));
    }
  }
  return elements;
};

class QSDocument extends Document {
  get documentElement() { return this.childNodes[this.childNodes.length - 1]; }
  getElementsByTagName(tagName) {
    return this.querySelectorAll(tagName);
  }
  querySelector(selectors) {
    return querySelector(this, prepareMatch(selectors));
  }
  querySelectorAll(selectors) {
    return querySelectorAll(this, prepareMatch(selectors));
  }
}

class QSElement extends Element {
  getElementsByTagName(tagName) {
    return this.querySelectorAll(tagName);
  }
  querySelector(selectors) {
    return querySelector(this, prepareMatch(selectors));
  }
  querySelectorAll(selectors) {
    return querySelectorAll(this, prepareMatch(selectors));
  }
}

class QSComment extends Comment {
  get textContent() { return this.data; }
  set textContent(value) { this.data = value; }
  get nodeValue() { return this.data; }
  set nodeValue(value) { this.data = value; }
}

class QSText extends Text {
  get textContent() { return this.data; }
  set textContent(value) { this.data = value; }
  get nodeValue() { return this.data; }
  set nodeValue(value) { this.data = value; }
}

const parse = markupLanguage => {

  const document = new QSDocument;
  let parentNode = document;
  
  const content = new Parser({
    // <!DOCTYPE ...>
    onprocessinginstruction(name, data) {
      if (name.toLowerCase() === '!doctype')
        parentNode.childNodes.push(new DocumentType(
          document,
          data.slice(name.length).trim())
        );
    },

    // <tagName>
    onopentag(name, attributes) {
      const element = new QSElement(document, name);
      for (const name of keys(attributes)) {
        const attribute = new Attr(document, name, attributes[name]);
        attribute.ownerElement = element;
        element.attributes.push(attribute);
      }
      element.parentNode = parentNode;
      parentNode.childNodes.push(element);
      parentNode = element;
    },

    // #text, #comment
    oncomment(data) {
      const comment = new QSComment(document, data);
      comment.parentNode = parentNode;
      parentNode.childNodes.push(comment);
    },

    ontext(data) {
      const text = new QSText(document, data);
      text.parentNode = parentNode;
      parentNode.childNodes.push(text);
    },

    // </tagName>
    onclosetag() {
      parentNode = parentNode.parentNode;
    }
  }, {
    decodeEntities: true
  });

  content.write(markupLanguage);
  content.end();

  return document;
};
exports.parse = parse;
