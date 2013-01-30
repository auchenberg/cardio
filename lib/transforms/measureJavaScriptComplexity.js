var _ = require('underscore'),
    complexityReport = require('complexity-report');

module.exports = function measureJavaScriptComplexity(queryObj, notepad) {
    notepad = notepad || {};
    notepad.js = notepad.js || {};
    notepad.js.complexityReports = [];
    return function (assetGraph) {
        assetGraph.findAssets(_.extend({type: 'JavaScript', isLoaded: true}, queryObj)).forEach(function (javaScriptAsset) {
            notepad.js.complexityReports.push(complexityReport.run(javaScriptAsset.text));
        });
    };
};
