/*

codeCanvas Desktop
2012 Jason Burgess
team@codeCanvas.org
http://www.codeCanvas.org

Conditionally licensed under MIT Licensing 
providing all code and design stays open source
and this header stays intact.

Project Uses:

	App.js
	Node.js
	jQuery
	jQuery UI
	jQuery Layout - http://layout.jquery-dev.net
	Bootstrap
	Code Mirror Editor - http://codemirror.net/
	famfamfam silk icons - http://www.famfamfam.com/lab/icons/silk/

	*** 
	
	All required libraries used in the project 
	are open source and have their own licensing 
	and conditions for use.  
	
	***
*/

var canvas,
	unique_counter = 1,
	currentSelDiv,
	editor,
	editor_export,
	editor_htmlProp,
	eleSelected,
	jTools_dirty = false,
	openProjectLocation = '';

//build unique id	
function uniqid(){

	var d = new Date();
	var uniq = d.getMilliseconds();
	unique_counter = unique_counter + 1;

	var sec = d.getSeconds();
	uniq = uniq + "" + unique_counter + "" + sec;

	return uniq;
}

//codeMirror support code
function getSelectedRange(e) {
	return { from: e.getCursor(true), to: e.getCursor(false) };
}

function autoFormatSelection(e) {
	var range = getSelectedRange(e);
	e.autoFormatRange(range.from, range.to);
}

//create the codeCanvas object
var codeCanvas = {

	bindToolClick : function(callback){

		//a tool was selected in the toolbox
		$( ".jTools_ToolxTool" ).click(function(){

			var buttonId;

			//make all buttons appear up
			$( ".jTools_ToolxTool" ).removeClass("jTools_buttonDown");
			$( ".jTools_ToolxTool" ).addClass("jTools_buttonUp");

			//make the selected button appear insert
			$(this).removeClass("jTools_buttonUp");
			$(this).addClass("jTools_buttonDown");

			//this is the id of the selected button
			buttonId = $(this).attr("id");

			//check to see if this is the "select" button
			if (buttonId != "jTools_ToolxTool_xSelect"){

				//a button was clicked that is NOT the select
				canvas.adjustClasses(buttonId);

				//set the html construct for this tool
				codeCanvas.loadElementConstructor(buttonId);

				//bind click to this newly created class
				//this will allow you to add the element later to the canvas
				canvas.bind_jTools();

			} else {

				//select was clicked
				canvas.adjustClasses(buttonId);

				//reset the html box

				//reset the html in the properties window
				editor_htmlProp.setValue(" ");

				//select all
				CodeMirror.commands["selectAll"](editor_htmlProp);

				//format 
				autoFormatSelection(editor_htmlProp);

				//scroll to top
				editor_htmlProp.scrollTo(0,0);

				//refresh the editor
				editor_htmlProp.refresh();

				//set the current html slice to nothing
				currentSelDiv = '';

				//clear the html slice array
				$("#jTools_ToolxContainer_html_propertiesInner").html(' <div id="jTools_ToolxProp_toggle" class="jTools_ToolxProp_toggle">..</div>');

				//bind click to any containers on the canvas
				canvas.bindContainers();
			}
		});

		callback();
	},

	deleteElement : function() {

		var selected = canvas.eleSelected; 

		selected = $(selected).attr("id");

		//do nothing if no element is selected
		if (selected === 'jToolsCanvas' || selected === '' || selected === undefined){
			return false;
		}

		confirmMe("Delete Element", "Really delete item: " + selected + " and all items contained in it?", function(e){

			if ( e == "yes") {

				canvas.deleteElement(selected);
			}
		});
	},

	decodeXml : function(string){
		return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
	  	function(str, item) {
	    	return escaped_one_to_xml_special_map[item];
	 	});
	},

	doSave : function(callback){
		
		//save a project to disk

		console.log("file saved");
		jTools_dirty = false;

		callback();
	},

	encodeXml : function(string){
		return string.replace(/([\&"<>])/g, 
		function(str, item) {
	    	return xml_special_to_escaped_one_map[item];
	  	});
	},

	exportProject : function(){

		canvas.prepExport(function(h){

			//show the export wrapper
			$("#exportWrapper")
				.attr("data-view", "open")
				.width( $(window).width() )
				.height( $(window).height() )
				.css({
					"position" : "absolute",
					"display" : "block",
					"left" : "0px",
					"top" : "0px",
					"z-index" : "1000000"
				});

			$("#export_editorWrapper")
				.css({
					"position" : "absolute",
					"left" : "0px",
					"top" : "35px",
				})
				.attr("data-view", "open")
				.width( $("#exportWrapper").width() )
				.height( $("#exportWrapper").height() -48 );
			
			$(editor_export.getScrollerElement()).height($("#export_editorWrapper").height());
			$(editor_export.getScrollerElement()).width($("#export_editorWrapper").width());

		    //hide toolbox and property window
		    $("#jTools_ToolxContainer_main").hide();
		    $("#jTools_ToolxContainer_html_properties").hide();
		    
		    //set the html in the export editor
			editor_export.setValue(h);

			//this selects the contents
			CodeMirror.commands["selectAll"](editor_export);

			//apply formatting to the editor
			autoFormatSelection(editor_export);

			//set the cursor to the beginning of the editor
			editor_export.scrollTo(0,0);

			//resfresh the editor
			editor_export.refresh();
	    });
	},

	init : function(){

		//set canvas object
	    canvas = document.getElementById('canvas').contentWindow;

	    //new project... set to nothing
		openProjectLocation = '';

		//make the toolbar draggable
		$( ".jTools_ToolxContainer" ).draggable({
	    	handle 		: ".jTools_ToolxHandle",
	    	containment : 'parent'
	    });

		//make the html properties container draggable
		$( ".jTools_ToolxContainer_prop" ).draggable({
			handle   	: ".jTools_ToolxHandle_prop",
			containment	: 'parent'
		});

	    //toggle the html properties window closed
	    $("#html_properties_exposed").toggle();

	    //set the click event for toggling the html property window
	    $("#jTools_ToolxProp_toggle").live("click", function(){

			$("#html_properties_exposed").toggle(500, function(){
				 
				editor_htmlProp.scrollTo(0,0);
				editor_htmlProp.refresh();

			});
		});

	    //click event for when a dimension button is clicked
	    $(".jTools_ToolxProp").live("click", function(){

		    $(".jTools_ToolxProp")
		    	.removeClass("jTools_ToolxProp_btn_down")
		    	.addClass("jTools_ToolxProp_btn_up");

		    $(this)
		    	.removeClass("jTools_ToolxProp_btn_up")
		    	.addClass("jTools_ToolxProp_btn_down");

		    //TODO
		    codeCanvas.rebuildElements_ex();
		    //udf();

		    //what is the index of this button in the dimension array?
		    var idx = $(this).attr("idx");
		    idx = idx - 1;

		    try{
		    	//set the global selected element
		       	currentSelDiv = jTools_elementConstArr[idx];

		       	//set the output to the html properties editor
		       	if ($.trim(jTools_elementConstArr[idx])!= ''){

		        	editor_htmlProp.setValue(jTools_elementConstArr[idx]);

		       	} else {
		        	
		        	editor_htmlProp.setValue(" ");
		       	}

		       	//format and set the editor
		       	CodeMirror.commands["selectAll"](editor_htmlProp);
		       	autoFormatSelection(editor_htmlProp);
		       	editor_htmlProp.scrollTo(0,0);
		       	editor_htmlProp.refresh();

		      }catch(err){}
		});

	    //load the toolbox
	    codeCanvas.loadToolbox(function(){

		    codeCanvas.setupEditors();

		    //make all buttons appear up
			$( ".jTools_ToolxTool" )
				.removeClass("jTools_buttonDown")
				.addClass("jTools_buttonUp");

			//make the selected button appear insert
			$("#jTools_ToolxTool_xSelect")
				.removeClass("jTools_buttonUp")
				.addClass("jTools_buttonDown");	    	
	    });

	    //toolbar click events

	    $("#btnToolbar_new").on("click", function(){
	    	codeCanvas.newProject(true);
	    });

	    $("#btnToolbar_export").on("click", function(){
	    	codeCanvas.exportProject();
	    });

	    $("#btnToolbar_save").on("click", function(){
	    	$("#file_saveDialog").modal({
            	backdrop : "static",
            	keyboard: true,
            	show : true
            });

	    	//the Save button was clicked
            $("#btn_saveFile_saveDialog").on("click", function(){
            
            	//need to build a file dialog that uses node

            });
	    });

	    $("#btnToolbar_run").on("click", function(){
	    	codeCanvas.runLayout();
	    });
		
		//runtime pane close button
		$("#btn_runClose").on("click", function(){
	    	
			//show toolbox and property window
	    	$("#jTools_ToolxContainer_main").show();
	    	$("#jTools_ToolxContainer_html_properties").show();

	    	//hide the run wrapper
			$("#runWrapper")
				.css({
					"position" : "absolute",
					"display" : "none",
					"left" : "0px",
					"top" : "-1000px",
					"z-index" : "0"
				})
				.attr("data-view", "closed")
				.width(0)
				.height(0);
			
			//hide the run frame
			$("#runFrame")
				.css({
					"display" : "none"
				})
				.width(0)
				.height(0);
	    });

	    //export pane close button
		$("#btn_exportClose").on("click", function(){
	    	
			//show toolbox and property window
	    	$("#jTools_ToolxContainer_main").show();
	    	$("#jTools_ToolxContainer_html_properties").show();

	    	//hide the run wrapper
			$("#exportWrapper")
				.css({
					"position" : "absolute",
					"display" : "none",
					"left" : "0px",
					"top" : "-1000px",
					"z-index" : "0"
				})
				.attr("data-view", "closed")
				.width(0)
				.height(0);
	    });
	},

	loadElementConstructor : function(id){

		//get the html for this tool

		var jTools_tool,
			html_tool_constructor = $.trim( $("#user_jTool_html").contents().find("#" + id).html() );

       	//build array from any break delimiters
       	jTools_elementConstArr = html_tool_constructor.split('<br class="jTools_break" />');

       	//build each tool dimension 
       	var buttonArray = '<div id="jTools_ToolxProp_toggle" class="jTools_ToolxProp_toggle">..</div>';

       	var j = 1;
       	var str;

       	$.each(jTools_elementConstArr, function(){
           	
           	if (j == 1){
             	buttonArray = buttonArray + '<div idx="' + j + '" class="jTools_ToolxProp jTools_ToolxProp_btn_down">' + j + '</div>';
           	} else {
             	buttonArray = buttonArray + '<div idx="' + j + '" class="jTools_ToolxProp jTools_ToolxProp_btn_up">' + j + '</div>';
           	}	

          	j = j + 1;
       	});

       	//load the dimension buttons
       	$("#jTools_ToolxContainer_html_propertiesInner").html(buttonArray);

       	//load the current selector with the 1st tool element
       	jTools_elementConstructor = jTools_elementConstArr[0];

       	//set the global selction to the html in the first dimension
       	currentSelDiv = jTools_elementConstArr[0];

       	//the editor 
       	if ($.trim(jTools_elementConstArr[0])!= ''){

         	editor_htmlProp.setValue(jTools_elementConstArr[0]);


       	} else {

         	editor_htmlProp.setValue(" ");
       	}

        //editor.getSearchCursor('<div class="ui-resizable-handle ui-resizable-s">').replace("");
       CodeMirror.commands["selectAll"](editor_htmlProp);
       autoFormatSelection(editor_htmlProp);
       editor_htmlProp.scrollTo(0,0);
       editor_htmlProp.refresh();
	},

	loadToolbox : function(callback){
		var i,
			jTools_tool,
			toolConstruct,
			toolHtml;

		//load up the user defined tools from the tool iframe html
		codeCanvas.loadToolbox_ex(function(toolbox_items){

			//for (i = 0; i < jTools_toolboxItems.length; ++i){
			for (i = 0; i < toolbox_items.length; ++i){

				// Get the tool at this numeric index
				jTools_tool = toolbox_items[i];

				//build the tools to append
				toolConstruct  = '<div id="' + jTools_tool.tool_id + '" class="jTools_ToolxTool jTools_buttonUp">' + jTools_tool.tool_name +'</div>';

				//append to the toolbox	
				$("#jTools_ToolxBoxInner").append(toolConstruct);
			}

			//bind the click events to the new tools
			codeCanvas.bindToolClick(function(){

				callback();

			});
		});
	},

	loadToolbox_ex : function(callback){
		var toolbox_items = [],
			tool_item,
			ele;

		//loop through each tool in the tools iframe
		$("#user_jTool_html").contents().find(".userTool").each(function(){

			ele = this;

			//build the item
			tool_item = {
				"tool_id" : $(ele).attr("id"),
				"tool_name" : $(ele).attr("data-tool_name")
			}

			//add to tool array
			toolbox_items.push(tool_item);

		});

		callback(toolbox_items);
	},

	newProject : function(b){

		console.log("newProject");

		//does the user need to save the project?
		if ( b != false && jTools_dirty === true ) {

			//ask the user to save the project
			codeCanvas.saveProject(function(){

				console.log("saveProject completed");

				//take a breath...
				setTimeout(function(){

					/* 
					try the new project method again with
					"check for save" flag set to false indicating
					our save attempt */
					codeCanvas.newProject(false);
				},100);
			});
		
		} else {

			//take a breath...
			setTimeout(function(){

				confirmMe("New Project", "Start new project?", function(e){

					if ( e == "yes") {

						//clear the canvas
						canvas.newProject();
						
						//update the editor
						codeCanvas.updateEditor(" ");

						//reset the open project string
						openProjectLocation = '';
					}
				});
				
			},100);
		} 
	},

	rebuildElements_ex : function(){

		//deselect elements
		canvas.adjustClasses("jTools_ToolxTool_xSelect");
		canvas.bind_jTools();
		//canvas.bindContainers();

	},

	resizeLayout : function(){
		
		//if the run frame is open... resize it
		if ( $("#runWrapper").attr("data-view") == "open" ) {

			//resize the run wrapper
			$("#runWrapper")
				.width( $(window).width() )
				.height( $(window).height() );

			//resize the run frame
			$("#runFrame")
				.width( $("#runWrapper").width() - 50 )
				.height( $("#runWrapper").height() - 75 );
		}

		//if the export frame is open... resize it
		if ( $("#exportWrapper").attr("data-view") == "open" ) {

			//resize the export wrapper
			$("#exportWrapper")	
				.width( $(window).width() )
				.height( $(window).height() )
				.css({
					"left" : "0px",
					"top" : "0px"
				});

			//resize editor wrapper to accomodate editor sizing
			$("#export_editorWrapper")
				.css({
					"position" : "absolute",
					"display" : "block",
					"left" : "0px",
					"top" : "35px",
				})
				.width( $("#exportWrapper").width() )
				.height( $("#exportWrapper").height() -48 );
			
			//resize the export editor
			$(editor_export.getScrollerElement()).height($("#export_editorWrapper").height());
			$(editor_export.getScrollerElement()).width($("#export_editorWrapper").width());
		}

		var ele_parent = $("#editorWrapper").parent();

		$("#editorTools").width( ele_parent.width() );

		$("#editorWrapper")
			.width( ele_parent.width() )
			.height( ele_parent.height() - $("#editorTools").height() )
			.css({
				"top" : $("#editorTools").height() 
		});

		$(editor.getScrollerElement()).height($("#editorWrapper").height());
		$(editor.getScrollerElement()).width($("#editorWrapper").width());

		editor.refresh();

		//this won't be available during our
		//inital resize at startup
		//so we'll try to run it
		try {
			canvas.resizeCanvas();

		} catch(e){}
	},

	runLayout : function(){

		//remove any selection or resizable from elements
		canvas.adjustClasses("notSelected");
		canvas.adjustClasses("jTools_ToolxTool_xSelect");
		
		//click the select tool in the toolbox
		$('#jTools_ToolxTool_xSelect').trigger('click');

		//show the run wrapper
		$("#runWrapper")
			.css({
				"position" : "absolute",
				"display" : "block",
				"left" : "0px",
				"top" : "0px",
				"z-index" : "1000000"
			})
			.attr("data-view", "open")
			.width( $(window).width() )
			.height( $(window).height() );
		
		//show the run frame
		$("#runFrame")
			.css({
				"position" : "absolute",
				"display" : "block",
				"left" : "25px",
				"top" : "50px"
			})
			.width( $("#runWrapper").width() - 50 )
			.height( $("#runWrapper").height() - 75 );

		//pass the html to the runtime function and call the 
		//user defined javascript
	    var h = canvas.getCanvasHtml();
	    var run_html = document.getElementById('runFrame').contentWindow;

	    run_html.runtime(h);

	    //hide toolbox and property window
	    $("#jTools_ToolxContainer_main").hide();
	    $("#jTools_ToolxContainer_html_properties").hide();

	},

	saveProject : function(callback){

		/*
			TODO:
			see if there is an open project and auto save
			or if not... ask the user
		*/

		if ( openProjectLocation != '') {

			//just save the file
			codeCanvas.doSave(function(){

				console.log("openProjectLocation file saved");

				jTools_dirty = false;
				callback();

			});

		} else {

			//this is a placeholder function until we can figure out
			//a custom confirm dialog with file/save folder list using Node
			//open to any ideas... 
			confirmMe("Save Project", "Save project?", function(e){

				if ( e == "yes") {

					//TODO: display a file save as dialog
					//then call dosave from the dialog
					
					//then run the save
					codeCanvas.doSave(function(){
						
						callback();
					});

				} else {

					//no... don't save file
					callback();
				}
			});
		}
	},

	setupEditors : function(){

		//setup the main code editor
	    editor = CodeMirror.fromTextArea(document.getElementById("jToolsProperties_htmlbox1"), {
	        lineNumbers: true,
	        mode: "htmlmixed"
	    });

	    //setup the export code editor
	    editor_export = CodeMirror.fromTextArea(document.getElementById("export_editor"), {
	        lineNumbers: true,
	        mode: "htmlmixed"
	    });

	    //initally place a space in the editor 
		editor_export.setValue(" ");

	    //setup the html properties editor
	    editor_htmlProp = CodeMirror.fromTextArea(document.getElementById("html_properties_exposed_textbox"), {
	        lineNumbers: false,
	        theme: "night",
	    	mode: "htmlmixed"
	    });

	    //set the diminsions of the property editor
	    $(editor_htmlProp.getScrollerElement()).height(150);
	    $(editor_htmlProp.getScrollerElement()).width(290);

	    //initally place a space in the editor 
		editor_htmlProp.setValue(" ");

		//this selects the contents
		CodeMirror.commands["selectAll"](editor_htmlProp);

		//apply formatting to the editor
		autoFormatSelection(editor_htmlProp);

		//set the cursor to the beginning of the editor
		editor_htmlProp.scrollTo(0,0);

		//resfresh the editor
		editor_htmlProp.refresh();

	},

	statusUpdate : function(str){

		//update a status bar
	},

	updateEditor : function(html){

		editor.setValue( html );
		//editor.getSearchCursor('<div class="ui-resizable-handle ui-resizable-s">').replace("");

		CodeMirror.commands["selectAll"](editor);
		autoFormatSelection(editor);
		editor.scrollTo(0,0);
		editor.refresh();

		//update the layout buffer
		//TODO: layoutBuffer["layout_html"]= $("#jToolsCanvas").html();


	},

	updateSelectedElement : function() {

		// update the selected element
	    if ( canvas.eleSelected == undefined){
	        canvas.eleSelected = "jToolsCanvas";
	    }

	    //get html from editor
	    var editorContent = editor.getValue();

	    //validate the html
	    editorContent = HTMLtoXML(editorContent);

	    //update the canvas
	    canvas.updateSelectedElement(editorContent);

	},

	updateSelectionStatus : function(){
		
		var selected = $(eleSelected).attr("id");

		if (selected == 'jToolsCanvas'){
			selected = "Canvas";
		}

		codeCanvas.statusUpdate("Selected: " + selected);

	}
}

$(function(){

	//init ***
	
	//setup the workspace panes
	//using the jquery layout plug-in (http://layout.jquery-dev.net)
	$('body').layout({
		south__size:     .40,
		south__resizable: false,
		south__childOptions: {

			west : {
				size : 225,
				onopen : function(){


				}
			},
			center : {
				onresize : function(){
					codeCanvas.resizeLayout();
				}
			}			
		},
		north: {
		  resizable : false,
		  showOverflowOnHover: true,
		  closable  : false

		}
	});

	//add listener for window resize
	$(window).resize(function(){

		//get the window sizes
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		//find out where the toolbox is in the window
		var position = $("#jTools_ToolxContainer_main").position();
		var toolMainLeft = position.left;
		var toolMainTop = position.top;

		//is the toolbox outside the window area?
		if (toolMainLeft > windowWidth){
		   var inView = windowWidth - 150;
		   $("#jTools_ToolxContainer_main").attr('style', 'left: ' + inView + 'px; top: ' + toolMainTop + 'px;');
		}
		if (toolMainTop < 0){
		   var inView = windowWidth - 150;
		   $("#jTools_ToolxContainer_main").attr('style', 'left: ' + inView + 'px; top: 20px;');
		}

		//find out where the toolbox is in the window
		var position = $("#jTools_ToolxContainer_html_properties").position();
		var toolMainLeft = position.left;
		var toolMainTop = position.top;

		//is the toolbox outside the window area?
		if (toolMainLeft > windowWidth){
		   var inView = windowWidth - 250;
		   $("#jTools_ToolxContainer_html_properties").attr('style', 'left: ' + inView + 'px; top: ' + toolMainTop + 'px;');
		}
		if (toolMainTop < 0){
		   var inView = windowWidth - 150;
		   $("#jTools_ToolxContainer_html_properties").attr('style', 'left: ' + inView + 'px; top: 20px;');
		}

		codeCanvas.resizeLayout();

	});

	//init the codeCanvas object
	codeCanvas.init();

	codeCanvas.resizeLayout();

});
