/*

contains user defined javascript for tool elements in a runtime environment 

*/

function udf (){
	
	$('.advdateBox').each(function(){
	    $(this).removeClass("hasDatepicker");
	    $(this).datepicker();
	    //$(this).width($(this).parent().width()-4)
	});

	$( ".jTools_tabs" ).tabs();
}
