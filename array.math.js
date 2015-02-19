//  JAVASCRIPT ARRAY MATH UTILS
//  Copyright (c) 2015 Philipp Tsipman 
//  v 1.0 on 2015-02-04

/*  JAVASCRIPT ARRAY MATH UTILS
    Use these together for forecasting functions  

    Examples: 
        diffLogs = roundArray(diffArray(logArray([10, 100, 1000, 10000])), 3);
        forecast_n1 = array.slice(-1)* Math.pow(round(Math.exp(meanArray(diffArray(logArray(array)))),6),1);
        aic = aicc((time_series.length-1),0,0,sumSquares(diffArray(logArray(time_series)), constant), constant);
    
    isNumber
    round
    Math.log
    aicc
    
	Math.min.apply
	Math.max.apply

    numericLength
    sumArray
    meanArray
    sumSquares
    
    logArray
    expArray
    diffArray
	percentdiffArray
    roundArray
    
    Array.prototype.transpose
    addArray
    pastorFuture
*/

(function(){

    'use strict';
    
	//  ARRAY MATH

	// Source: http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	//  round(number, decimals), e.g. round(10.3333, 2)
	//  Source: http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript#comment42209497_19722641
	function round(number, decimals) {
	  return +(Math.round(number + "e+" + decimals)  + "e-" + decimals);
	}

	//  Math.log(number, base), e.g. Math.log(10, 2)
	//  Source: http://stackoverflow.com/questions/3019278/how-can-i-specify-the-base-for-math-log-in-javascript
	Math.log = (function() {
	    var log = Math.log;
	    return function(n, base) {
	        return log(n)/(base ? log(base) : 1);
	    };
	})();

	// AICC
	// aicc(n_after_diff, p, q, ss, include_constant)
	// Example: aicc(786, 2, 1, 1.05297, false) == -5191.607634684157

	function aicc (n, p, q, ss, constant) {
		var const_factor = 0;
		if (constant)
			const_factor = 1;

		return (n*Math.log(ss/n))+(2*(p+q+(1+const_factor))*n/(n-p-q-(2+const_factor)));
	}

	// Min of array
	// Math.min.apply(null, arr);

	// Max of array
	// Math.max.apply(null, arr);
	
	function numericLength(array) {
	        
	    var len = 0;
	    if (array instanceof Array) {
	    	for (var i = 0; i < array.length; i++) {
	    		if (isNumber(array[i]))
	    		    len++;
	    	}
	    	return len;
	    }
	    else
	    	return null;
    
	};

	function sumArray(array) {

	    var i = array.length,
	        sum = 0;
	    while (i--) {
	        if (isNumber(array[i]))
	            sum += array[i];
	    }

	    return sum;
	};

	function meanArray(array) {
	    // requires sumArray
	    // requires numericLength
	    return sumArray(array) / numericLength(array);
	};


	// sumSquares(array, false)

	function sumSquares(input_array, constant) {
	    // requires meanArray, sumArray
    
	    var mean_array = 0;
	    if (constant)
	        mean_array = meanArray(input_array);

	    var sum = 0;
	    if (input_array instanceof Array) {
	    	for (var i = 0; i < input_array.length; i++) {
	            if (isNumber(input_array[i]))
	    		    sum += Math.pow((input_array[i]-mean_array), 2);
	    	}
	    	return sum;
	    }
	    else
	    	return null;
	};



	// logArray([array], optional_base)
	// Assumes natural log if base is omitted. Returns an array of logarithms 
	// Example: logArray([5, 2], 10); logArray([20, 7, Math.E]);

	function logArray(input_array, base) {
    
		var output_array = [];
		if (input_array instanceof Array) {
			for (var i = 0; i < input_array.length; i++) {
				output_array.push(Math.log(input_array[i], base));
			}
			return output_array;
		}
		else
			return null;
	};

	// expArray(array), e.g. expArray([5, 2]);

	function expArray(input_array) {
    
	    var output_array = [];
	    if (input_array instanceof Array) {
	    	for (var i = 0; i < input_array.length; i++) {
	    		output_array.push(Math.exp(input_array[i]));
	    	}
	    	return output_array;
	    }
	    else
	    	return null;
	};


	// diffArray([array], optional_span)
	// Returns an array of differences between array elements.  Initial elements returned as null.  2000 - 2010 = 10 year span.
	// Example: diffArray([5, 2]);

	function diffArray(input_array, span) {
    
	    if (input_array instanceof Array) {

		    var output_array = [];
		
			if (!span)
				span = 1;
		
			for (var i = 0; i < span; i++) 
				output_array.push(null);
	
			for (var i = span; i < input_array.length; i++)
				output_array.push(input_array[i] - input_array[i-span]);

	    	return output_array;
	    }
	    else
	    	return null;
	};

	// percentdiffArray([array], optional_span)
	// Returns an array of % change between array elements.  Initial elements returned as null
	// Example: percentdiffArray([5, 2]);

	function percentdiffArray(input_array, span) {
    
	    if (input_array instanceof Array) {

		    var output_array = [];
		
			if (!span)
				span = 1;
		
			for (var i = 0; i < span; i++) 
				output_array.push(null);
	
			for (var i = span; i < input_array.length; i++) {
				if (input_array[i-span] == 0)
					output_array.push(null);
				else 
					output_array.push(input_array[i] / input_array[i-span] -1)
			}

	    	return output_array;
	    }
	    else
	    	return null;
	};

	// roundArray([array], optional_decimal_places)
	// Assumes 0 decimal places as the default
	// Example: roundArray([5.2222, 2.5555], 3);

	// Will not work for ([1.005],2) which comes out as [1] instead of [1.01], 
	// see: http://stackoverflow.com/questions/11832914/round-up-to-2-decimal-places-in-javascript#comment26122771_11832950

	function roundArray(input_array, decimals) {
    
	    var output_array = [];
	    if (!decimals)
	        decimals = 0;
        
	    if (input_array instanceof Array) {
	    	for (var i = 0; i < input_array.length; i++) {
	    		output_array.push(round(input_array[i], decimals));
	    	}
	    	return output_array;
	    }
	    else
	    	return null;
	};

	//  ARRAY TRANSFORMATIONS

	// Clone array: http://stackoverflow.com/questions/3978492/javascript-fastest-way-to-duplicate-an-array-slice-vs-for-loop
	// var b = a.slice(); 
	// var outputArray = inputArray.slice();


	// Source: http://stackoverflow.com/questions/4492678/to-swap-rows-with-columns-of-matrix-in-javascript-or-jquery
	Array.prototype.transpose = function() {

	  // Calculate the width and height of the Array
	  var a = this,
	    w = a.length ? a.length : 0,
	    h = a[0] instanceof Array ? a[0].length : 0;

	  // In case it is a zero matrix, no transpose routine needed.
	  if(h === 0 || w === 0) { return []; }

	  /**
	   * @var {Number} i Counter
	   * @var {Number} j Counter
	   * @var {Array} t Transposed data is stored in this array.
	   */
	  var i, j, t = [];

	  // Loop through every item in the outer array (height)
	  for(i=0; i<h; i++) {

	    // Insert a new row (array)
	    t[i] = [];

	    // Loop through every item per item in outer array (width)
	    for(j=0; j<w; j++) {

	      // Save transposed data.
	      t[i][j] = a[j][i];
	    }
	  }

	  return t;
	};

	// assume both arrays are sorted by first column
	// second array must have exactly 2 columns
	// first array must include all years
	// a = [[2007,2], [2008, 4]];
	// b = [[2008, 18],[2009, 4], [2010, 8]];

	function addArray (output_array, second_array) {
	    if (second_array.length > 0 && second_array[0].length == 2) {        

	        // iterate through each row of output_array
	        for (var i = 0; i < output_array.length; i++) {
	            var j = 0;
	            while ((j < second_array.length) && (output_array[i][0] > second_array[j][0]))
	            	j++;
	            if ((j < second_array.length) && (output_array[i][0] == second_array[j][0]))
	                output_array[i].push(second_array[j][1]);
	            else
	                output_array[i].push(null);  
	        }
	    }
	    return output_array;
	}

	// assume array is sorted by first column
	// assume array has exactly 2 columns
	// a = [[2008, 18],[2009, 4], [2010, 8], [2012, 8], [2013, 8], [2014, 8]];

	function pastorFuture(array) {
	    var array_length = array.length;
	    // if (array_length)
	    //     var array_width = array[0].length;
	    var year = new Date().getFullYear();
	    if (array_length && array[0][0] <= year && array[array_length-1][0] > year) {
	        for (var i = 0; i < array_length; i++) {
	                if (array[i][0] < year)
	                    array[i].push(null);
	                else if (array[i][0] == year)
	                    array[i].push(array[i][1]);
	                else
	                    array[i] = [array[i][0],null,array[i][1]];                
	        }
	    }
	    return array;
	}

    // Exports and modularity
	var a = {};
	a.isNumber = isNumber;
    a.round = round,
    a.aicc = aicc,

    a.numericLength = numericLength,
    a.sumArray = sumArray,
    a.meanArray = meanArray,
    a.sumSquares = sumSquares,

    a.logArray = logArray,
    a.expArray = expArray,
    a.diffArray = diffArray,
	a.percentdiffArray = percentdiffArray,
    a.roundArray = roundArray,

    a.addArray = addArray,
    a.pastorFuture = pastorFuture;
	
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = a;
    }

    if (typeof ender === 'undefined') {
        window.am = a;
    }

    if (typeof define === "function" && define.amd) {
        define('am', [], function () { 
            return a;
        });
    }

}).call(this);