/*

udf - (user define functions) contains user defined javascript for tool elements in the designer

This is called from the canvas when elements are being initalized or rebuilt. Anything in this function will
be run when this method is called in the designer.

*/


function udf(){

	$('.advdateBox').each(function(){
	    $(this).removeClass("hasDatepicker");
	    $(this).datepicker();
	    //$(this).width($(this).parent().width()-4)
	});

	$(function() {
	 $( ".jTools_tabs" ).tabs();
	});
}
