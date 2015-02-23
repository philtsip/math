var am = require('./../array.math.js');
var series = require('./sp_monthly.json');

// HEADER

var metric = "adj_close";
var column = am.colforMetric(series, metric); 

var comparisons_eng = ["monthly", "annual", "5yr", "7yr", "10yr"];
var comparisons = [1,12,60,84,120];

for (var i = 0; i < comparisons.length; i++) {

	var values = am.percentdiffArray(series.data[column],comparisons[i]);	

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