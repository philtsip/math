var am = require('./../array.math.js');
var series = require('./sp_monthly.json');
var column = 8; 
var num_diffs = 120; 


console.log(JSON.stringify(series.data[column]));
console.log(JSON.stringify(am.forwardlooking(series.data[column],num_diffs)));

console.log(JSON.stringify(series.data[column].length));
console.log(JSON.stringify(am.forwardlooking(series.data[column],num_diffs).length));

