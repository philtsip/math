//  JAVASCRIPT CHART MATH UTILS
//  Copyright (c) 2015 Philipp Tsipman 
//  v 1.0 on 2015-02-20

/*  JAVASCRIPT CHART MATH UTILS

	dimensions
*/

(function(){

    'use strict';
    
	// ARRAY MATH SUBSET
	
	//  round(number, decimals), e.g. round(10.3333, 2)
	//  Source: http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript#comment42209497_19722641
	//  Note: .toFixed(20) to solve for scientific notation numbers upto 20 decimals - http://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
	function round(number, decimals) {
		if (!decimals) 
			decimals = 0;
		
	  	return +(Math.round(number.toFixed(20) + "e+" + decimals)  + "e-" + decimals);
	}

	//  ceil(number, decimals), e.g. ceil(10.3333, 2)
	//  Note: .toFixed(20) to solve for scientific notation numbers upto 20 decimals - http://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
	function ceil(number, decimals) {
		if (!decimals) 
			decimals = 0;
		
	  	return +(Math.ceil(number.toFixed(20) + "e+" + decimals)  + "e-" + decimals);
	}

	//  floor(number, decimals), e.g. floor(10.3333, 2)
	//  Note: .toFixed(20) to solve for scientific notation numbers upto 20 decimals - http://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
	function floor(number, decimals) {
		if (!decimals) 
			decimals = 0;
		
	  	return +(Math.floor(number.toFixed(20) + "e+" + decimals)  + "e-" + decimals);
	}

	//  round to nearest
	//  nearest(number, rounding), e.g. nearest(1319, 500)
	function nearest(number, rounding) {
	  	return +(Math.round(number/rounding) * rounding);
	}

	//  ceil to nearest
	//  nCeil(number, rounding), e.g. nCeil(1319, 500)
	function nCeil(number, rounding) {
	  return +(Math.ceil(number/rounding) * rounding);
	}

	//  floor to nearest
	//  nFloor(number, rounding), e.g. nFloor(1319, 500)
	function nFloor(number, rounding) {
	  return +(Math.floor(number/rounding) * rounding);
	}
	
	
	// CHART MATH	

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
	
		axis.tickwidth = tickWidth(ar_max-ar_min);
		
		// Create min-max to fit and match up to zero
		
		if (axis.tickwidth < 1) {  // if tickwidth is smaller than 1 (=.1), round to one decimal
			axis.min = floor(ar_min,1);
			axis.max = ceil(ar_max,1);
		}
			
		else if (axis.tickwidth == 1) { // if tickwidth is 1, round to whole #s
			axis.min = floor(ar_min,0);
			axis.max = ceil(ar_max,0);
		}
		else {
			axis.min = nFloor(ar_min,axis.tickwidth)
			axis.max = nCeil(ar_max,axis.tickwidth)
		}
		
		// Number of ticks on the axis
		axis.majorticks = Math.round((axis.max-axis.min)/axis.tickwidth);  // rounded to prevent floating point values
		
		return axis;
	}

	// Create n number of equally spaced buckets between min and max
	// a = min, b = max, generate n buckets
	function linspace(a,b,n) {
		n++;
	    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
	    if(n<2) { return n===1?[a]:[]; }
	    var i,ret = Array(n);
	    n--;
	    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
	    return ret;
	}

	// Pluck x and y values out of a histogramjs output
	function histogramData(data) {
		var obj = {}; obj.x = [], obj.y = [];
		
		for (var i = 0; i < data.length; i++) {
			obj.x.push(data[i].x);
			obj.y.push(data[i].y);
		}
		return obj;
	}

	//     var n_symbols = ["", "", "", "k", "kk", "kkk", "m", "mm", "mmm", "b"];
	//     var multiple = n_symbols[numDeflator(json.data[0][1])];
	//     label('number', (series_label + " (" + json.y_unit  + ", " + multiple + ")"));
	//
	// function numDeflator(num) {
	//     var pow10 = 0;
	//
	//     if (num < 0)
	//         num = -num;
	//
	//     if (num > 0)
	//         pow10 = Math.floor( Math.floor(round(Math.log(num, 10), 6)) / 3) * 3;
	//
	//     return pow10;
	// }
	
	// TEST
	// var x = [1,2,-3,4,5,6,7];
	// axisDimensions(x);

    // Exports and modularity
	var a = {};
    a.dimensions = axisDimensions;
	a.linspace = linspace;
	a.histogramData = histogramData;
	
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