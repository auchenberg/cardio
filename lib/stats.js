// Re-calculate known array-data.
function stats(numbers) {
    numbers = numbers.sort(function (a, b) { return a - b; });
    var count = numbers.length,
        numbers_90th = numbers.slice(0, Math.ceil(numbers.length*0.9)),
        count_90th = numbers_90th.length,
        max = numbers[count - 1],
        sum,
        mean,
        cumulativeValues = [numbers[0]];

    // Calculate cumulative values
    for (var i = 1; i < count; i += 1) {
        cumulativeValues.push(numbers[i] + cumulativeValues[i - 1]);
    }

    mean = cumulativeValues[count - 1] / count;

    // Calculate standard deviation
    var sumOfDifferences = 0;
    for (var i = 0; i < count; i += 1) {
        sumOfDifferences += (numbers[i] - mean) * (numbers[i] - mean);
    }

    // Create output object in one go.
	var ret = {
        count: count,
        mean: mean,
        max: max,
        std: Math.sqrt(sumOfDifferences / count),

        mean_90th: cumulativeValues[count_90th - 1] / count_90th,
        max_90th: numbers_90th[count_90th - 1],
	};

    return ret;
}

module.exports.stats = stats;
