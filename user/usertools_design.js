/*

udf - (user define functions) contains user defined javascript for tool elements in the designer

This is called from the canvas when elements are being initalized or rebuilt. Anything in this function will
be run when this method is called in the designer.

*/


function udf(){

	//apply resize and other behavior functions for this control

	$(".class").resize(function(){
	  //no resize for the control
	  //$(this).width(88+"px");
	  //$(this).height(27+"px");
	});
	$(".flexibleTextbox").resize(function(){
	  //get the textbox inside
	  var box = $(this).find(".textbox");
	  //$(box).height($(this).height());
	  $(box).width($(this).width()-4);

	});

	$('.textbox').each(function(){
	    $(this).width($(this).parent().width()-4)
	});
	$(".form_textbox_box").resize(function(){
	  //get the textbox inside
	  var box = $(this).find(".form_textbox_input");
	  $(box).width($(this).width()-15);

	});

	$('.form_textbox_input').each(function(){
	    $(this).width($(this).parent().width()-15)
	});

	$('.form_textbox_msg').fadeOut(2000);

	//apply resize and other behavior functions for this control

	$(".jtools_text_area").resize(function(){
	  var box = $(this).find(".jtools_text_area_box");
	  $(box).width($(this).width());
	  $(box).height($(this).height()-10 );
	});

	$('.jtools_text_area_box').each(function(){
	    $(this).width($(this).parent().width())
	    $(this).height($(this).parent().height()-10)
	});


	//<designer>

	$(".flexibleDateDiv").resize(function(){
	  //get the textbox inside
	  var box = $(this).find(".advdateBox");
	  //$(box).height($(this).height());
	  $(box).width($(this).width()-4);

	});

	//</designer>


	var purgeClasses = ["hasDatepicker", "class2"];

	$('.advdateBox').each(function(){
	    $(this).removeClass("hasDatepicker");
	    $(this).datepicker();
	    $(this).width($(this).parent().width()-4)
	});


	$(".chk_iphone_").resize(function(){
	  //no resize for the control
	  $(this).width(88+"px");
	  $(this).height(27+"px");
	});

	//apply resize and other behavior functions for this control

	$(function() {
	 $( ".jTools_tabs" ).tabs();
	});

	$(".tabs_container").resize(function(){
	  //no resize for the control
	  //$(this).width(88+"px");
	  //$(this).height(27+"px");

	  //$(".jTools_tab_div").height($(this).height());

	});

	$('.dropdown-toggle').dropdown();

	$('.btn-group').live('mouseover mouseout', function(event) {
	  if (event.type == 'mouseover') {
	    $(this).addClass("hoverGroup");
	  } else {
	    $(this).removeClass("hoverGroup");
	  }
	});

	$(".fm_text").resize(function(){
	  //get the textbox inside
	  var box = $(this).find(".fm_text_tx");
	  $(box).width($(this).width()-10);
	});

	$('.fm_text_tx').each(function(){
	  $(this).width($(this).parent().width()-10)
	});

	$(".fm_text").resize(function(){
	  //get the textbox inside
	  var box = $(this).find(".fm_text_tx");
	  $(box).width($(this).width()-10);
	});

	$('.fm_text_tx').each(function(){
	  $(this).width($(this).parent().width()-10)
	});
}
