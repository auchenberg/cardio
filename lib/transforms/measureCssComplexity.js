var _ = require('underscore'),
    oneColor = require('onecolor'),
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

function findColorsInCssValue(cssValue) {
    var colorStrs = [];
    cssValue.replace(/\b(?:hsla?|hsva?|rgba?)\([^\)]*?\)/g, function ($0) {
        colorStrs.push($0.replace(/\s+/g, '').toLowerCase());
        return ' ';
    }).split(/\s+|,/).forEach(function (token) {
        if (oneColor(token) !== false) {
            colorStrs.push(token.toLowerCase());
        }
    });
    return colorStrs;
}

module.exports = function (queryObj, notepad) {
    notepad = notepad || {};

    notepad.css = notepad.css || {};
    notepad.css.numStyleDeclarationsByProperty = {};
    notepad.css.sumOfSelectorComplexity = 0;
    notepad.css.numStyleDeclarations = 0;
    notepad.css.numImportants = 0;

    var numCssRulesByType = notepad.css.numCssRulesByType = {},
        numStyleDeclarationsByPropertyName = notepad.css.numStyleDeclarationsByPropertyName = {},
        countByColor = notepad.css.countByColor = {};

    return function measureCssComplexity(assetGraph) {
        assetGraph.findAssets(_.extend({type: 'Css', isLoaded: true}, queryObj)).forEach(function (cssAsset) {
            cssAsset.eachRuleInParseTree(function (cssRule) {
                var cssRuleName = cssRuleNameByType[cssRule.type];
                numCssRulesByType[cssRuleName] = (numCssRulesByType[cssRuleName] || 0) + 1;
                if (cssRuleName === 'style') {
                    var cssExplanation = cssExplain(cssRule.selectorText);
                    notepad.css.sumOfSelectorComplexity += cssExplanation.score;
                    notepad.css.numStyleDeclarations += cssRule.style.length;

                    for (var i = 0 ; i < cssRule.style.length ; i += 1) {
                        notepad.css.numStyleDeclarations += 1;
                        var property = cssRule.style[i];
                        if (cssRule.style.getPropertyPriority(property) === 'important') {
                            notepad.css.numImportants += 1;
                        }
                        notepad.css.numStyleDeclarationsByProperty[property] = (notepad.css.numStyleDeclarationsByProperty[property] || 0) + 1;
                        findColorsInCssValue(cssRule.style[cssRule.style[i]]).forEach(function (colorStr) {
                            countByColor[colorStr] = (countByColor[colorStr] || 0) + 1;
                        });
                    }
                }
            });
        });
    };
};
