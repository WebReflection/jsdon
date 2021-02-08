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

const mergeClosing = (output, length) => {
  let closing = 0;
  while (length-- && output[length] === NODE_END)
    closing += NODE_END;
  if (closing !== NODE_END) {
    output[++length] = closing;
    output.splice(++length);
  }
};

const pushAttribute = ({name, value, nodeType}, output) => {
  output.push(nodeType, name);
  if (value)
    output.push(value);
};

const pushElement = ({attributes, childNodes, localName, nodeType}, output, filter) => {
  output.push(nodeType, localName);
  for (let i = 0, {length} = attributes; i < length; i++)
    pushAttribute(attributes[i], output);
  for (let i = 0, {length} = childNodes; i < length; i++)
    pushNode(childNodes[i], output, filter);
  return output.push(NODE_END);
};

const pushFragment = ({childNodes, nodeType}, output, filter) => {
  output.push(nodeType);
  for (let i = 0, {length} = childNodes; i < length; i++)
    pushNode(childNodes[i], output, filter);
  return output.push(NODE_END);
};

const pushNode = (node, output, filter) => {
  const {nodeType} = node;
  switch (nodeType) {
    case ELEMENT_NODE:
      if (filter(node))
        mergeClosing(output, pushElement(node, output, filter));
      break;
    case ATTRIBUTE_NODE:
      if (filter(node))
        pushAttribute(node, output);
      break;
    case TEXT_NODE:
    case COMMENT_NODE:
      if (filter(node))
        output.push(nodeType, node.textContent);
      break;
    case DOCUMENT_FRAGMENT_NODE:
    case DOCUMENT_NODE:
      if (filter(node))
        mergeClosing(output, pushFragment(node, output, filter));
      break;
    case DOCUMENT_TYPE_NODE:
      if (filter(node))
        output.push(nodeType, node.name || '');
      break;
  }
};

const yes = () => true;

export const toJSON = (node, filter) => {
  const output = [];
  pushNode(node, output, filter || yes);
  return output;
};
