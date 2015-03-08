//  JAVASCRIPT DATE MATH UTILS
//  Copyright (c) 2015 Philipp Tsipman 
//  v 1.0 on 2015-02-04

/*  JAVASCRIPT DATE MATH UTILS

	getWeek
	LastDayofMonth
	toMMMYY
	toQYY
	startIndex
	since
	convertSeriesFrequency
*/


(function(){

    'use strict';
    
	// getWeek: https://gist.github.com/dblock/1081513
	Date.prototype.getWeek = function() { 
	
	  var d = this;
 
	  // Create a copy of this date object  
	  var target  = new Date(d.valueOf());  
  
	  // ISO week date weeks start on monday  
	  // so correct the day number  
	  var dayNr   = (d.getDay() + 6) % 7;  
 
	  // Set the target to the thursday of this week so the  
	  // target date is in the right year  
	  target.setDate(target.getDate() - dayNr + 3);  
 
	  // ISO 8601 states that week 1 is the week  
	  // with january 4th in it  
	  var jan4    = new Date(target.getFullYear(), 0, 4);  
 
	  // Number of days between target date and january 4th  
	  var dayDiff = (target - jan4) / 86400000;    
 
	  // Calculate week number: Week 1 (january 4th) plus the    
	  // number of weeks between target date and january 4th    
	  var weekNr = 1 + Math.ceil(dayDiff / 7);    
 
	  return weekNr;    
 
	}
	
	// Returns last day of month.  
	// Simplified to not calulate Feb 29 for leap years.  More complex version: http://javascript.about.com/library/bllday.htm
	function LastDayofMonth(month) { // starting from 1 <-- not JS DATE standard!!!
		var numdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		
		return numdays[month-1]; 		
	}

	// Input: Date formatted as JS #, Output: Date formatted as MMM-YY.  Eg. toMMMYY(new Date()) => "Mar-15"
	function toMMMYY(num){
		var m_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	    
		var date = new Date(num);
	    return (m_names[date.getMonth()]+ "-" + date.getFullYear().toString().substring(2));
	}

	// Input: Date formatted as JS #, Output: Date formatted as Q'YY.  Eg. toQYY(new Date()) => "Q1'15"
	function toQYY(num){
	    var q_names = ["Q1", "Q1", "Q1", "Q2", "Q2", "Q2", "Q3", "Q3", "Q3", "Q4", "Q4", "Q4"];
	    
		var date = new Date(num);
	    return (q_names[date.getMonth()]+ "'" + date.getFullYear().toString().substring(2));
	}
	
	
	// DATA STRUCTURE
	//
	// var series = {
	// 	"meta": {
	// 		"columns": ["date", "volume", "adj_close"],
	// 	},
	// 	"data": [
	// 		[],
	// 		[],
	// 		[]
	// 	]
	// }
	// Assumes first data column is standard-formatted dates (eg. YYYY/MM/DD)


	// Return startIndex of date array - equal or after the start date.  -1 if all dates are before start date
	// eg. startIndex(["2014/03/27","2014/04/28","2014/04/30"], "2014/04/01") => 1
	function startIndex(dateArray, startDate) {
		startDate = new Date(startDate);

		if (true) { // TODO: check for date format
			if ( (new Date(dateArray[0])) < (new Date(dateArray[1])) ) {// chronological 
				// iterate through dates
				for (var i = 0; i < dateArray.length; i++) {
					 if ( startDate <= (new Date(dateArray[i])) )
						 return i;
				}
				return -1;
			}
			else
				return null; // TODO: reverse chronological?
		}
		else
			return null; // bad format
	}

	// Return series since the start date (on or after)
	// eg. var shortSeries = since(series, "2014/04/01");
	function since(inputObj, startDate) {
		if (!startDate)
			var start = 0;
		else
			var start = startIndex(inputObj.data[0], startDate);
		
		var numCols = inputObj.data.length;
		var outputObj = {};
	
		outputObj.meta = inputObj.meta; 
		outputObj.data = []; 
		
		for (var i = 0; i < numCols; i++) {
			if (start == -1)
				outputObj.data.push([]);
			else
				outputObj.data.push(inputObj.data[i].slice(start));
		}
			
		return outputObj;
	}

	// Filter series data down to a particular frequency
	// Options: weekly, monthly, annual
	// eg. console.log(convertSeriesFrequency(series, "monthly"));	
	function convertSeriesFrequency (inputObj, frequency) {
		var numCols = inputObj.data.length;
		var numRows = inputObj.data[0].length;
		var outputObj = {}, current = 0, next = 0;
	
		outputObj.meta = inputObj.meta; 
		outputObj.data = []; for (var i = 0; i < numCols; i++) outputObj.data.push([]);
	
		if (true) { // TODO: check for date format
			if ( (new Date(inputObj.data[0][0])) < (new Date(inputObj.data[0][1])) ) {// chronological 

				// iterate through dates
				current = new Date(inputObj.data[0][0]);
			
				for (var j = 1; j < numRows; j++) {
					next = new Date(inputObj.data[0][j]);
						
					if ( frequency == "weekly" && ( current.getFullYear() == next.getFullYear() ) && ( current.getWeek() == next.getWeek() ) ) {
						current = next;	
					}
				
					else if ( frequency == "monthly" && ( current.getFullYear() == next.getFullYear() ) && ( (current.getMonth()+1) == (next.getMonth()+1) ) ) { // note: month starts with 0
						current = next;	
					}
								
					else if ( frequency == "annual" && ( current.getFullYear() == next.getFullYear() ) ) {
						current = next;	
					}

					else {
						for (var k = 0; k < numCols; k++) {
							outputObj.data[k].push(inputObj.data[k][j-1]);
						}
						current = next;					
					}
				}
			
				// always push last row
				for (var k = 0; k < numCols; k++) {
					outputObj.data[k].push(inputObj.data[k][numRows-1]);
				}
		
			}		
			else
				return null; // TODO: reverse chronological?
		}
		else
			return null; // bad format
			
		return outputObj;
	}

	// TEST

	// Options: weekly, monthly, annual
	// var series = {"data":[["2014/03/27","2014/04/28","2014/04/30"],[13100,41100,10800],[558.46,559.99,556.97]]};

	// var series = require('./test/goog_daily.json');
	// console.log(convertSeriesFrequency(series, "monthly"));



    // Exports and modularity
	var a = {};
	a.LastDayofMonth = LastDayofMonth;
	a.toMMMYY = toMMMYY;
	a.toQYY = toQYY;
	a.startIndex = startIndex;
	a.since = since;
	a.convert = convertSeriesFrequency;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = a;
    }

    else if (typeof define === "function" && define.amd) {
        define('dm', [], function () { 
            return a; 
        });
    }

    else if (typeof ender === 'undefined') {
        // this.convert = convertSeriesFrequency;
        window.dm = a;
    }

}).call(this);