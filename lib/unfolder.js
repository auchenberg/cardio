/* Unfold a JSON-object recursively
 */
var _ = require('underscore');

function object2lines(obj) {
    // Numbers
    if (typeof obj === 'number') {
        return [obj.toString(10)];
    }

    // List of objects?
    if (_.isArray(obj)) {
        return _.flatten(obj.map(object2lines));
    }

    // Non-objects
    if (!_.isObject(obj)) {
        return [];
    }

    var keys = Object.keys(obj),
        key,
        val,
        outList = [];

    for (var i = 0; i < keys.length; i += 1) {
        key = keys[i];
        val = obj[key];

        var data = object2lines(val);

        data.forEach(function (out) {
            outList.push(key + "_" + out);
        });
    }

    return outList;
}

module.exports = function (obj) {
    var list = object2lines(obj),
        key,
        val,
        out = {};

    list.forEach(function (value) {
        key = value.split("_"); 
        val = key.pop();
        key = key.join(".");
        out[key] = out[key] || [];
        out[key].push(parseFloat(val, 10));
    });

    return out; 
};
