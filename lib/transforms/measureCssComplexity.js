var _ = require('underscore'),
    cssExplain = require('css-explain').cssExplain,
    cssRuleNameByType = {
        1: 'style',
        3: 'import',
        4: 'media',
        5: 'font-face',
        6: 'page',
        8: 'webkit-keyframes',
        9: 'webkit-keyframe'
    };

module.exports = function (queryObj, notepad) {
    notepad = notepad || {};
    notepad.css = notepad.css || {};
    notepad.css.numStyleDeclarationsByProperty = {};
    notepad.css.sumOfSelectorComplexity = 0;
    notepad.css.numStyleDeclarations = 0;
    var numCssRulesByType = notepad.css.numCssRulesByType = {},
        numStyleDeclarationsByPropertyName = notepad.css.numStyleDeclarationsByPropertyName = {};
    return function (assetGraph) {
        assetGraph.findAssets(_.extend({type: 'Css'}, queryObj)).forEach(function (cssAsset) {
            cssAsset.eachRuleInParseTree(function (cssRule) {
                var cssRuleName = cssRuleNameByType[cssRule.type];
                numCssRulesByType[cssRuleName] = (numCssRulesByType[cssRuleName] || 0) + 1;
                if (cssRuleName === 'style') {
                    var cssExplanation = cssExplain(cssRule.selectorText);
                    notepad.css.sumOfSelectorComplexity += cssExplanation.score;
                    notepad.css.numStyleDeclarations += cssRule.style.length;
                    for (var i = 0 ; i < cssRule.style.length ; i += 1) {
                        notepad.css.numStyleDeclarations += 1;
                        notepad.css.numStyleDeclarationsByProperty[cssRule.style[i]] = (notepad.css.numStyleDeclarationsByProperty[cssRule.style[i]] || 0) + 1;
                    }
                }
            });
        });
    };
};
