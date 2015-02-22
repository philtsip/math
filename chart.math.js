//  JAVASCRIPT CHART MATH UTILS
//  Copyright (c) 2015 Philipp Tsipman 
//  v 1.0 on 2015-02-20

/*  JAVASCRIPT CHART MATH UTILS

	dimensions
*/

(function(){

    'use strict';
    
	var am = require('./array.math.js');

	function tickWidth(x) { // x = diff between max and min of data
		if (x <=1)
			return .1; // ~10 ticks
		else if (x <=10)
			return 1; // ~10 ticks
		else if (x <=50)
			return 5; // ~10 ticks
		else if (x <=100)
			return 10; // ~10 ticks
		else if (x <=200)
			return 20; // ~10 ticks
		else if (x <=500)
			return 50; // ~10 ticks
		else 
			return 100;
	}
	
	function axisDimensions(array) {
		var axis = {};
		
		var ar_min = Math.min.apply(null, array);
		var ar_max = Math.max.apply(null, array);
	
		axis.ticksize = tickWidth(ar_max-ar_min);
		
		// Create min-max to fit and match up to zero
		
		if (axis.ticksize < 1) {  // if ticksize is smaller than 1 (=.1), round to one decimal
			axis.min = am.floor(ar_min,1);
			axis.max = am.ceil(ar_max,1);
		}
			
		else if (axis.ticksize == 1) { // if ticksize is 1, round to whole #s
			axis.min = am.floor(ar_min,0);
			axis.max = am.ceil(ar_max,0);
		}
		else {
			axis.min = am.nFloor(ar_min,axis.ticksize)
			axis.max = am.nCeil(ar_max,axis.ticksize)
		}
		
		return axis;
	}
	
	// TEST
	// var x = [1,2,-3,4,5,6,7];
	// axisDimensions(x);

    // Exports and modularity
	var a = {};
    a.dimensions = axisDimensions;
	
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = a;
    }

    else if (typeof define === "function" && define.amd) {
        define('cm', [], function () { 
            return a; 
        });
    }

    else if (typeof ender === 'undefined') {
        // this.convert = convertSeriesFrequency;
        window.cm = a;
    }

}).call(this);