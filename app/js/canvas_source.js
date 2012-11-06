/*

codeCanvas Desktop
2012 Jason Burgess
team@codeCanvas.org

Conditionally licensed under MIT Licensing providing all code and design stays open source
and use is not for profit.

*/

var canvas,
	cResized,
	eleSelected;

/* 

adjustClasses - manages the classes of the canvas tools based on what
tool is selected from the toolbox

*/

function adjustClasses(buttonId){

	if (buttonId != "jTools_ToolxTool_xSelect"){

		//not the select tool button
	    $("#jToolsCanvas")
	    	.addClass("jTools_edit")
	    	.removeClass("jTools_containerSelectable");

	    $(".jTools_tool")
	    	.removeClass("jTools_containerResize jTools_containerSelectable jTool_selected")
	    	.unbind("click");

	    $(".jTools_container")
	    	.addClass("jTools_containerTarget")
	    	.unbind("click");
	    
	    $('.jTools_tool').resizable('destroy');

	} else {

		//the select tool button
	    $("#jToolsCanvas")
	    	.removeClass("jTools_edit")
	    	.addClass("jTools_containerSelectable");

	    $(".jTools_container")
	    	.removeClass("jTools_containerTarget")
	    	.unbind("click");

	    $(".jTools_tool")
	    	.removeClass("jTools_containerResize jTools_containerSelectable jTool_selected")
	    	.addClass("jTools_containerSelectable")
	    	.unbind("click");

	    bind_jTools();
	    bindContainers();
	}	
}

/*

bind_jTools - allows the ability to add new elements to existing containers
whether it be the canvas or another element with a container class

*/
function bind_jTools(){

	$(".jTools_containerTarget").bind("click", function(e){
		e.stopPropagation();

		//set the global selected element
		eleSelected = this;

		var id = $(eleSelected).attr('id');
		var uniq_id = parent.uniqid();

		//this removes the codeCanvas logo due to content being added to the canvas
		$("#jToolsCanvas").removeClass("cc_logo");

		//getting the html from the tool property editor
		var ele_constr = parent.editor_htmlProp.getValue();

		//parse the html for unique id placeholder 
		var eConstructor = ele_constr.replace(/{{uniqid}}/gi, uniq_id);

		//update the status
		parent.codeCanvas.updateSelectionStatus();

		//appeand this to the selected container
		$(eleSelected).append(eConstructor);

		//statusUpdate($("#" + buttonId).text() + " was added");

		//update the html in the editor
		parent.codeCanvas.updateEditor( $.trim( $(eleSelected).html() ) );

		//run any user defined javascript
		udf();

		//mark the project dirty to prompt save
		parent.jTools_dirty = true;
	});
}

/*

bindContainers - deselects all other elements and allows the ability 
to manipulate an element when clicked. 

*/

function bindContainers(){

	//bind click events on elements that are containers in the canvas
	$(".jTools_containerSelectable").unbind("click").bind("click", function(e){
		e.stopPropagation();

		//set the global selected element
		eleSelected = this;
		
		//get the selected element id
		var element_id = $(eleSelected).attr("id");

		//remove all edit abilities from all other elements
		$('.jTools_tool').resizable('destroy');
		$('.jTools_tool').sortable('destroy');
		$('#jToolsCanvas').resizable('destroy');

		//deselect all other elements
		$('.jTools_tool').removeClass("jTool_selected");

		//select this element
		$(eleSelected).addClass("jTool_selected");

		//update selection status
		parent.codeCanvas.updateSelectionStatus();

		//bind the ability to update editor after an element resize
		$(eleSelected).resizeend(function(){
			parent.codeCanvas.updateEditor( $.trim( $(cResized).html() ) );
		});

		//show the html
		parent.codeCanvas.updateEditor( $.trim( $(eleSelected).html() ) );

		//make the selected element sortable using UI
		$(eleSelected).parent().sortable();
		
		//make the canvas sortable again
		$("#jToolsCanvas").sortable();

		//do not allow the anything on the body to be sortable (like the canvas)
		$('body').sortable('destroy');

		//select this element only
		if ( $(eleSelected).attr("id") != "jToolsCanvas" ){
			
			//make the selected element resizable
			$(eleSelected).resizable();
		}

		//don't allow the canvas parent to be sortable
		$("#jToolsCanvas").parent().sortable('destroy');

		parent.jTools_dirty = true;
	});
}

function deleteElement(ele){

	$("#" + ele).remove();

	//update the editor with html in the canvas
	parent.codeCanvas.updateEditor( $.trim( $("#jToolsCanvas").html() ) );

	//run user defined functions
	udf();

	//set the canvas to dirty
	jTools_dirty = true;

	//currently selected element is this canvas
	eleSelected = $("#jToolsCanvas");

}

function resizeCanvas(){

	var ele_parent = $("#jToolsCanvas").parent();

	$("#jToolsCanvas")
		.width( ele_parent.width() - 12)
		.height( ele_parent.height() - 12 )
		.css({
			"top" : "2" 
	});
}

function updateSelectedElement(html){

    $(eleSelected).html(html);
    
    //rebuild element bindings
    adjustClasses("jTools_ToolxTool_xSelect");
    bind_jTools();
    bindContainers();

    //run any user defined javascript
	udf();

    //update the layout buffer
    //layoutBuffer["layout_id"]="Main Layout";
    //layoutBuffer["layout_html"]= $("#jToolsCanvas").html();

    //reselect the current element
    $(eleSelected).trigger("click");
}


$(function(){
	
	//init the select on startup
    adjustClasses("jTools_ToolxTool_xSelect");	

    parent.jTools_dirty = false;

    resizeCanvas();
});











//for later... to write files locally
/*function write_file(){

	console.log("msg");
	$("#btn").text("Not");

	var fs = require('fs');
	fs.writeFile("test.txt", "Hey there!", function(err) {
	    if(err) {
	        console.log(err);
	        $("#btn").text(err);
	    } else {
	        console.log("The file was saved!");
	        $("#btn").text("The file was saved");
	        alert("saved");
	    }
	}); 

}*/


