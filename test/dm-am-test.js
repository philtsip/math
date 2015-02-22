var dm = require('./../date.math.js')

var now = new Date("2015/02/09");
console.log( now.getWeek() );
var series = {"data":[["2014/03/27","2014/04/28","2014/04/30"],[13100,41100,10800],[558.46,559.99,556.97]]};
console.log(dm.convert(series, "monthly"));
console.log("");



var am = require('./../array.math.js');

console.log(am.isNumber(8));
var diffLogs = am.roundArray(am.diffArray(am.logArray([10, 100, 1000, 10000])), 3);
console.log(diffLogs);
console.log("");

console.log(am.meanArray(diffLogs));
console.log(am.countif(diffLogs,">2"));
console.log(am.percentif(diffLogs,">2"));
console.log(am.percentif(diffLogs,"<=2"));
console.log("");



var series = require('./sp_monthly.json');
var values = series.data[5]; // 6th column

console.log(am.toP(am.meanArray(values),1));
console.log(am.countif(values,">0"));
console.log(am.countif(values,"<=0"));
console.log(am.numericLength(values));
console.log(am.toP(am.percentif(values,">0"),1));
console.log(am.toP(am.percentif(values,"<=0"),1));
console.log("");
console.log(am.countif(values,">=.05"));
console.log(am.countif(values,"<.05"));
console.log(am.toP(am.percentif(values,">=.05"),1));
console.log("");
console.log(am.countif(values,"<=-.05"));
console.log(am.countif(values,">-.05"));
console.log(am.toP(am.percentif(values,"<=-.05"),1));
