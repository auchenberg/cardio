var _ = require('underscore');

var nodeTypeByName = {
    ATTRIBUTE_NODE: 2,
    CDATA_SECTION_NODE: 4,
    COMMENT_NODE: 8,
    DOCUMENT_FRAGMENT_NODE: 11,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    ELEMENT_NODE: 1,
    ENTITY_NODE: 6,
    ENTITY_REFERENCE_NODE: 5,
    NOTATION_NODE: 12,
    PROCESSING_INSTRUCTION_NODE: 7,
    TEXT_NODE: 3
};

var nodeNameByType = {
    1: 'ELEMENT_NODE',
    2: 'ATTRIBUTE_NODE',
    3: 'TEXT_NODE',
    4: 'CDATA_SECTION_NODE',
    5: 'ENTITY_REFERENCE_NODE',
    6: 'ENTITY_NODE',
    7: 'PROCESSING_INSTRUCTION_NODE',
    8: 'COMMENT_NODE',
    9: 'DOCUMENT_NODE',
    10: 'DOCUMENT_TYPE_NODE',
    11: 'DOCUMENT_FRAGMENT_NODE',
    12: 'NOTATION_NODE'
};

module.exports = function (queryObj, notepad) {
    notepad = notepad || {};
    notepad.html = notepad.html || {};
    notepad.html.nestingLevels = [];
    notepad.html.countByNodeType = {};
    notepad.html.countByTagName = {};
    notepad.html.countByAttributeName = {};
    return function measureHtmlComplexity(assetGraph) {
        assetGraph.findAssets(_.extend({type: 'Html', isLoaded: true}, queryObj)).forEach(function (htmlAsset) {
            (function walk(node, nestingLevel) {
                notepad.html.countByNodeType[nodeNameByType[node.nodeType]] = (notepad.html.countByNodeType[nodeNameByType[node.nodeType]] || 0) + 1;
                if (node.nodeType === 1) { // ELEMENT_NODE
                    var tagName = node.nodeName.toLowerCase();
                    notepad.html.countByTagName[tagName] = (notepad.html.countByTagName[tagName] || 0) + 1;
                }
                if (typeof nestingLevel === 'number' && Array.prototype.slice.call(node.childNodes).every(function (childNode) {return childNode.nodeType !== 1;}) && node.nodeType === 1) {
                    notepad.html.nestingLevels.push(nestingLevel);
                }
                var i;
                for (i = 0 ; i < node.childNodes.length ; i += 1) {
                    walk(node.childNodes[i], typeof nestingLevel === 'number' ? nestingLevel + 1 : (node.nodeName.toLowerCase() === 'body' ? 0 : undefined));
                }
                if (node.attributes) {
                    for (i = 0 ; i < node.attributes.length ; i += 1) {
                        var attribute = node.attributes[i];
                        notepad.html.countByAttributeName[attribute.nodeName] = (notepad.html.countByAttributeName[attribute.nodeName] || 0) + 1;
                    }
                }
            }(htmlAsset.parseTree, htmlAsset.parseTree.body ? undefined : 0));
        });
    };
};
