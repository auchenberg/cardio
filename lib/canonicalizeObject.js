var _ = require('underscore');

module.exports = function canonicalizeObject(obj) {
    if (_.isArray(obj)) {
        return obj.map(canonicalizeObject);
    } else if (obj === null) {
        return null;
    } else if (typeof obj === 'object') {
        var sortedObj = {};
        _.keys(obj).sort().forEach(function (key) {
            sortedObj[key] = canonicalizeObject(obj[key]);
        });
        return sortedObj;
    } else {
        return obj;
    }
};
