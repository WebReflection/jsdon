'use strict';
const {
  NODE_END,
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE,
  UNKNOWN
} = require('./constants.js');

const mergeClosing = output => {
  const last = output.length - 1;
  const value = output[last];
  if (typeof value === 'number' && value < 0)
    output[last] += NODE_END;
  else
    output.push(NODE_END);
};

const pushAttribute = ({name, value}, output) => {
  output.push(ATTRIBUTE_NODE, name);
  if (value)
    output.push(value);
};

const pushElement = ({attributes, childNodes, localName}, output, filter) => {
  output.push(ELEMENT_NODE, localName);
  for (let i = 0, {length} = attributes; i < length; i++)
    pushAttribute(attributes[i], output);
  for (let i = 0, {length} = childNodes; i < length; i++)
    pushNode(childNodes[i], output, filter);
  mergeClosing(output);
};

const pushFragment = ({childNodes}, output, filter) => {
  for (let i = 0, {length} = childNodes; i < length; i++)
    pushNode(childNodes[i], output, filter);
  mergeClosing(output);
};

const pushNode = (node, output, filter, unknown) => {
  if (filter(node)) {
    const {nodeType} = node;
    switch (nodeType) {
      case ELEMENT_NODE: {
        pushElement(node, output, filter, unknown);
        break;
      }
      case TEXT_NODE:
      case COMMENT_NODE: {
        output.push(nodeType, node.data);
        break;
      }
      case DOCUMENT_FRAGMENT_NODE:
      case DOCUMENT_NODE: {
        output.push(nodeType);
        pushFragment(node, output, filter, unknown);
        break;
      }
      case DOCUMENT_TYPE_NODE: {
        const {name, publicId, systemId} = node;
        output.push(nodeType, name);
        if (publicId)
          output.push(publicId);
        if (systemId)
          output.push(systemId);
        break;
      }
      default: {
        output.push(UNKNOWN, unknown(node));
        break;
      }
    }
  }
};

const yes = () => true;

/**
 * Given a generic DOM element, returns a JSDON compatible array that represents it.
 * @param {Document|DocumentFragment|Element|Text|Comment} node
 * @param {function?} filter if provided, filters nodes by returning `true` or `false`
 */
const toJSON = (node, filter, unknown = Object) => {
  const output = [];
  pushNode(node, output, filter || yes, unknown);
  return output;
};
exports.toJSON = toJSON;
