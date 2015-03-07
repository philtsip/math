//  ADD,UPDATE,REMOVE COLUMNS IN JSON TIME SERIES OBJECTS
//  Copyright (c) 2015 Philipp Tsipman 
//  v 1.0 on 2015-02-22

/*  
	s_io.

	save
	add
	remove
	update
*/

// ASSUMES DATA STRUCTURE
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

(function(){

    'use strict';
	
	// GET.  If getting series JSON from URL via jQueary rather than Require
	// $.getJSON(url, function(body, textStatus, jqXHR) {
	// 	console.log(url + " loaded successfully");
	// 	console.log(body);
	// })
	// .fail(function() {
	// 	console.log( url + " failed to load" );
	// });
	//
	// OR
	//
	// $.ajax({
	//    url: 'sp_monthly.json',
	//    type: 'GET',
	//    async: true,
	//    dataType: "json",
	//    success: function (data) {
	//        var series = data;
	// 	   console.log(JSON.stringify(series.data[column]));
	//    }
	//  });
    	
		
	// SAVE obj to file
	// Eg. var file = './sp_monthly.json';  var series = require(file);   s_io.save(file, series);
	function save(filename, obj) {
		var fs = require('fs');

		fs.writeFile((filename), JSON.stringify(obj), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log(filename + " was saved!");
		    }
		}); 
	}

	// ADD column to series
	// Eg. s_io.add(series, metric_name, values)
	// Eg. s_io.add(series, metric + "_pdiff_" + comparisons[i], values)
	function add(series, metric_name, values) {
		series.meta.columns.push(metric_name);
		series.data.push(values);	
	
		return true;
	}

	// REMOVE column from series
	// Eg. s_io.remove(series, metric_name)
	function remove(series, metric_name) {
		var mcolumn = series.meta.columns.indexOf(metric_name);  // test for metric_name
		if (mcolumn >= 0) {
			series.data.splice(mcolumn,1);	
			return true;		
		}
		else
			return -1;

	}

	// UPDATE column in series
	// Eg. s_io.update(series, metric_name, values)
	function update(series, metric_name, values) {
		var mcolumn = series.meta.columns.indexOf(metric_name);  // test for metric_name
		if (mcolumn >= 0) {
			series.data.splice(mcolumn,1,values);	
			return true;		
		}
		else
			return -1;
	}

	// TEST

	// var metric = "adj_close";
	// var save_flag = 1;
	// var mcolumn = series.meta.columns.indexOf(metric);
	// var values = [];
	//
	// var comparisons_eng = ["monthly", "annual", "5yr", "7yr", "10yr"];
	// var comparisons = [1,12,60,84,120];
	//
	// var dcolumn = series.meta.columns.indexOf(metric + "_pdiff_" + comparisons[i]);
	//
	// if ( dcolumn != -1) {
	// 	values = series.data[dcolumn];
	// 	save_col = 0;
	// }
	// else {
	// 	values = am.percentdiffArray(series.data[mcolumn],comparisons[i]);
	// 	save_col = 1;
	// }
	//
	//
	// if (save_flag*save_col) {
	// 	series.meta.columns.push(metric + "_pdiff_" + comparisons[i]);
	// 	series.data.push(values);
	// }

    // Exports and modularity
	var a = {};
	a.save = save,
	a.add = add,
	a.remove = remove,
	a.update = update;
	
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = a;
    }

    else if (typeof define === "function" && define.amd) {
        define('s_io', [], function () { 
            return a; 
        });
    }

    else if (typeof ender === 'undefined') {
        window.s_io = a;
    }

}).call(this);