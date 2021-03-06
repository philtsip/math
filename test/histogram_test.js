var histogram = require('histogramjs');
var am = require('./../array.math.js');
var cm = require('./../chart.math.js');
var series = require('./sp_monthly.json');

// CONSTANTS

var metric = "adj_close";

var values = [], xAxis = {}, min, max, ticks, buckets, x, y = [], data, log = "";

var column = series.meta.columns.indexOf(metric); 

var comparisons_eng = ["monthly", "annual", "5yr", "7yr", "10yr"];
var comparisons = [1,12,60,84,120];

// FUNCTIONS

// a = min, b = max, generate n buckets
var linspace = function linspace(a,b,n) {
	n++;
    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    if(n<2) { return n===1?[a]:[]; }
    var i,ret = Array(n);
    n--;
    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    return ret;
}


for (var i = 0; i < comparisons.length; i++) {

	values = am.percentdiffArray(series.data[column],comparisons[i]);	

	xAxis = cm.dimensions(values);

	// var min = -.1,
	// 	max = .1,
	// 	buckets = 10;
	min = xAxis.min;
	max = xAxis.max;
	ticks = Math.round((xAxis.max-xAxis.min)/xAxis.tickwidth);  // to prevent floating point values
	buckets = ticks * Math.floor(10/ticks); // get to 10 or less buckets
	
	console.log(comparisons_eng[i] + " returns");
	console.log("Average return: " + am.toP(am.meanArray(values),1));
	console.log(min + " " + max);
	console.log(ticks);
	console.log(buckets);



	// MAIN
	// var num;
	// for(var i = 0; i < 200000; i ++){
	//     num = Math.random()*10;
	//     y.push(num)
	// }

	x = linspace(min, max, buckets);
	y = values;

	data = histogram({
	    data : y,
	    bins : x
	})

	// OPTION 1
	// for(var j = 0; j < data.length; j ++){
	//     console.log('[' + am.round(data[j].x,3) + ',' +  data[j].y + '],')
	// }

	// OPTION 2
	log = '[';
	for(var j = 0; j < data.length; j ++){
	    log += (am.round(data[j].x,3) + ',')
	}
	log += '],';

	log += '[';
	for(var j = 0; j < data.length; j ++){
	    log += (data[j].y + ',')
	}
	log += ']';


	console.log(log);

	console.log("");
}

