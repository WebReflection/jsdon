self.jsdon = (function (exports) {
  'use strict';

  var NODE_END = -1;
  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE = 9;
  var DOCUMENT_TYPE_NODE = 10;
  var DOCUMENT_FRAGMENT_NODE = 11;

  var parse = JSON.parse;
  var fromJSON = function fromJSON(value) {
    var ownerDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    var array = typeof value === 'string' ? parse(value) : value;
    var length = array.length;
    var fragment = ownerDocument.createDocumentFragment();
    var parentNode = fragment;
    var isFragment = false;
    var doc = ownerDocument;
    var skipCheck = true;
    var i = 0;

    while (i < length) {
      var nodeType = array[i++];

      switch (nodeType) {
        case ELEMENT_NODE:
          var localName = array[i++]; // avoid re-creating the root element (html, svg, or root)

          if (skipCheck || localName.toLowerCase() !== parentNode.localName) parentNode = parentNode.appendChild(doc.createElement(localName));
          skipCheck = true;
          break;

        case ATTRIBUTE_NODE:
          var name = array[i++];

          var _value = i < length && typeof array[i] === 'string' ? array[i++] : '';

          if (name === 'is') {
            var ce = doc.createElement(parentNode.localName, {
              is: _value
            });

            for (var _parentNode = parentNode, attributes = _parentNode.attributes, _length = attributes.length, _i = 0; _i < _length; _i++) {
              ce.setAttributeNode(attributes[_i]);
            }

            parentNode.parentNode.replaceChild(ce, parentNode);
            parentNode = ce;
          } else parentNode.setAttribute(name, _value);

          break;

        case TEXT_NODE:
          parentNode.appendChild(doc.createTextNode(array[i++]));
          break;

        case COMMENT_NODE:
          parentNode.appendChild(doc.createComment(array[i++]));
          break;

        case DOCUMENT_NODE:
          if (array[i] === DOCUMENT_TYPE_NODE) {
            i++;

            var _parser = new ownerDocument.defaultView.DOMParser();

            switch (array[i++]) {
              case 'html':
              case 'HTML':
                doc = _parser.parseFromString('<!DOCTYPE html><html></html>', 'text/html');
                break;

              case 'svg':
              case 'SVG':
                doc = _parser.parseFromString('<!DOCTYPE svg><svg />', 'image/svg+xml');
                break;

              default:
                doc = _parser.parseFromString('<root />', 'text/xml');
                break;
            }
          } else doc = parser.parseFromString('', 'text/html');

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
          } while (nodeType < 0);

          break;
      }
    }

    if (isFragment) return fragment;
    if (doc !== ownerDocument) return doc;
    return fragment.firstChild;
  };

  var mergeClosing = function mergeClosing(output, length) {
    var closing = 0;

    while (length-- && output[length] === NODE_END) {
      closing += NODE_END;
    }

    if (closing !== NODE_END) {
      output[++length] = closing;
      output.splice(++length);
    }
  };

  var pushAttribute = function pushAttribute(_ref, output) {
    var name = _ref.name,
        value = _ref.value,
        nodeType = _ref.nodeType;
    output.push(nodeType, name);
    if (value) output.push(value);
  };

  var pushElement = function pushElement(_ref2, output, filter) {
    var attributes = _ref2.attributes,
        childNodes = _ref2.childNodes,
        localName = _ref2.localName,
        nodeType = _ref2.nodeType;
    output.push(nodeType, localName);

    for (var i = 0, length = attributes.length; i < length; i++) {
      pushAttribute(attributes[i], output);
    }

    for (var _i = 0, _length = childNodes.length; _i < _length; _i++) {
      pushNode(childNodes[_i], output, filter);
    }

    return output.push(NODE_END);
  };

  var pushFragment = function pushFragment(_ref3, output, filter) {
    var childNodes = _ref3.childNodes,
        nodeType = _ref3.nodeType;
    output.push(nodeType);

    for (var i = 0, length = childNodes.length; i < length; i++) {
      pushNode(childNodes[i], output, filter);
    }

    return output.push(NODE_END);
  };

  var pushNode = function pushNode(node, output, filter) {
    var nodeType = node.nodeType;

    switch (nodeType) {
      case ELEMENT_NODE:
        if (filter(node)) mergeClosing(output, pushElement(node, output, filter));
        break;

      case ATTRIBUTE_NODE:
        if (filter(node)) pushAttribute(node, output);
        break;

      case TEXT_NODE:
      case COMMENT_NODE:
        if (filter(node)) output.push(nodeType, node.textContent);
        break;

      case DOCUMENT_FRAGMENT_NODE:
      case DOCUMENT_NODE:
        if (filter(node)) mergeClosing(output, pushFragment(node, output, filter));
        break;

      case DOCUMENT_TYPE_NODE:
        if (filter(node)) output.push(nodeType, node.name || '');
        break;
    }
  };

  var yes = function yes() {
    return true;
  };

  var toJSON = function toJSON(node, filter) {
    var output = [];
    pushNode(node, output, filter || yes);
    return output;
  };

  exports.fromJSON = fromJSON;
  exports.toJSON = toJSON;

  return exports;

}({}));
