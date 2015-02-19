var histogram = require('histogramjs')

// var dm = require('./../date.math.js')
//
// var now = new Date("2015/02/09");
// console.log( now.getWeek() );
// var series = {"data":[["2014/03/27","2014/04/28","2014/04/30"],[13100,41100,10800],[558.46,559.99,556.97]]};
// console.log(dm.convert(series, "monthly"));
	
// var am = require('./../array.math.js')
// console.log(am.isNumber(8));
// var diffLogs = am.roundArray(am.diffArray(am.logArray([10, 100, 1000, 10000])), 3);
// console.log(diffLogs);

// HEADER


var series = require('./goog_monthly_derived.json');
var values = series.data[3];

var min = Math.min.apply(null, values).toPrecision(1),
	max = Math.max.apply(null, values).toPrecision(1),
	buckets = 10;

console.log(min, " ", max);

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


// MAIN

// for(var i = 0; i < 200000; i ++){
//     num = Math.random()*10;
//     y.push(num)
// }

var x = linspace(min, max, buckets), y = [], num;

y = values;

var data = histogram({
    data : y,
    bins : x
})

for(var i = 0; i < data.length; i ++){
    console.log('[' + data[i].x + ',' +  data[i].y + '],')
}
