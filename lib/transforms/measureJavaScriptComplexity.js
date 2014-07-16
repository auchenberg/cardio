var _ = require('underscore'),
    complexity = require('escomplex-js');

module.exports = function (queryObj, notepad) {
    notepad = notepad || {};
    notepad.js = notepad.js || {};
    notepad.js.complexityReports = [];
    return function measureJavaScriptComplexity(assetGraph) {
        assetGraph.findAssets(_.extend({type: 'JavaScript', isLoaded: true}, queryObj)).forEach(function (javaScriptAsset) {
            var report;
            try {
                report = complexity.analyse(javaScriptAsset.text);
            } catch (err) {
                var error = new Error('complexity-report: Error while processing JavaScript Asset');
                error.asset = javaScriptAsset;
                error.stack = err.stack;

                assetGraph.emit('error', error);
            }

            if (report) {
                notepad.js.complexityReports.push(report);
            }
        });
    };
};
