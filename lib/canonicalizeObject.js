module.exports = function canonicalizeObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(canonicalizeObject);
    } else if (typeof obj === 'object' && obj !== null) {
        var sortedObj = {};
        Object.keys(obj).sort().forEach(function (key) {
            sortedObj[key] = canonicalizeObject(obj[key]);
        });
        return sortedObj;
    } else {
        return obj;
    }
};
