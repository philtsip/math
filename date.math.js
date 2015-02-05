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

// clone array: http://stackoverflow.com/questions/3978492/javascript-fastest-way-to-duplicate-an-array-slice-vs-for-loop
// var b = a.slice(); 
// var outputArray = inputArray.slice();

// var series = {"data":[["2014/03/27","2014/04/28","2014/04/30"],[13100,41100,10800],[558.46,559.99,556.97]]};

var series = require('./test/goog_daily.json');

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

// Assumes first column is standard-formatted dates (eg. YYYY/MM/DD)
function convertSeriesFrequency (inputArray, frequency) {
	var numCols = inputArray.data.length;
	var numRows = inputArray.data[0].length;
	var outputArray = [], current = 0, next = 0;
	
	outputArray.meta = inputArray.meta; 
	outputArray.data = []; for (var i = 0; i < numCols; i++) outputArray.data.push([]);
	
	if (true) { // TODO: check for date format
		if ( (new Date(inputArray.data[0][0])) < (new Date(inputArray.data[0][1])) ) {// chronological 

			// iterate through dates
			current = new Date(inputArray.data[0][0]);
			
			for (var j = 1; j < numRows; j++) {
				next = new Date(inputArray.data[0][j]);
						
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
						outputArray.data[k].push(inputArray.data[k][j-1]);
					}
					current = next;					
				}
			}
			
			// always push last row
			for (var k = 0; k < numCols; k++) {
				outputArray.data[k].push(inputArray.data[k][numRows-1]);
			}
		
		}		
		else
			return null; // TODO: reverse chronological?
	}
	else
		return null; // bad format
			
	return outputArray;
}

// Options: weekly, monthly, annual
console.log(convertSeriesFrequency(series, "weekly"));