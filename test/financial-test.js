var am = require('./../array.math.js');
var series = require('./sp_monthly.json');

// HEADER

var comparisons_eng = ["monthly", "annual", "5yr", "10yr"];
var comparisons = [3,5,7,9];

for (var i = 0; i < comparisons.length; i++) {

	var values = series.data[comparisons[i]];

	console.log(comparisons_eng[i] + " returns");
	console.log("Average return: " + am.toP(am.meanArray(values),1));

	var tests = [">0", ">=.1", "<=-.1", ">=.5", "<=-.5", ">=1"];
	var tests_eng = ["positive", "10%+", "less than -10%", "50%+", "less than -50%", "double"];

	for (var j = 0; j < tests.length; j++) {
		console.log("Probability " + tests_eng[j] + ": " + am.toP(am.percentif(values,tests[j]),0));
	}

	console.log(am.countif(values,">=.5"));
	console.log(am.countif(values,"<=-.5"));
	console.log("");
}