var metric = "adj_close";
var save_flag = 1;
var mcolumn = series.meta.columns.indexOf(metric);
var values = [];

var comparisons_eng = ["monthly", "annual", "5yr", "7yr", "10yr"];
var comparisons = [1,12,60,84,120];

var dcolumn = series.meta.columns.indexOf(metric + "_pdiff_" + comparisons[i]);

if ( dcolumn !== null) {
	values = series.data[dcolumn];	
	save_col = 0;	
}
else {
	values = am.percentdiffArray(series.data[mcolumn],comparisons[i]);	
	save_col = 1;
}
	

if (save_flag*save_col) {
	series.meta.columns.push(metric + "_pdiff_" + comparisons[i]);
	series.data.push(values);	
}
