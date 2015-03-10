/*
 * jquery.clrtext.js
 *	ClrText is a rich inline block editor created by extending jQuery

 * Version History:
 *      Vimal Kurup, 2013.11.10: created
 *      Vimal Kurup, 2013.11.10: Added block feature
 *      Vimal Kurup, 2013.12.01: added image block
 *      Vimal Kurup, 2013.12.13: fix bug
 *      Vimal Kurup, 2013.12.14: added rich text
*/


;(function($){
        //options to set default settings
	var defaults = {
		url: ""
	};

	//plugin constructor
        function ClrText(element, options){
		var widget = this;
                this.dots;

                //combine default settings with user provided settings
		widget.config = $.extend({}, defaults, options);

		widget.element = element;

                //delay function
                var delay = (function(){
		  var timer = 0;
		  return function(callback, ms){
		    clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		  };
		})();

    //when no activity for 4 seconds save the document
		widget.element.on("keyup", function(){
		    delay(function(){
	        //widget.startAnim( $(".returnedMessage") );

					var content = [];
	        $('.content-block').each(function(index, element) {
	            //clonedElement = $(element).clone();
	            //$(clonedElement).find('.handle, .delete-block').remove();
	            //$(clonedElement).children(".inner-block").removeAttr("contenteditable");
	            //ele += $(element).find('.inner-block').html();
							var block = {};
							var ele = $(element).find('.inner-block');
							block.type = ele.data("set");
							block.content = ele.html();
							content.push(block);
	        });
	        //$("textarea#content").val(ele);

	        //widget.save(widget);
					var jContent = JSON.stringify(content);
					console.log(jContent);

		    }, 4000 );
		});

    //using jQuery UI sortable to make blocks sortable
		$( "#mainContainer" ).sortable({ handle: ".handle" });

                //when text is selected, show options to modify text (bold, italics, link, unlink)
		element.on("mouseup", ".inner-block", function(e){
			var selObj = window.getSelection();
			var selString = selObj.toString();
			if( selString != ""){
				$(".modifyTextModel").show().css({left: e.clientX - 50, top: e.clientY - 50});
			}
		});

                //make selected text bold
		$(document.body).on("mousedown", "#bold", function(){
				$(".modifyTextModel").hide();
				document.execCommand('bold', false, null);
		});

                //make selected text italic
		$(document.body).on("mousedown", "#italics", function(){
			$(".modifyTextModel").hide();
			document.execCommand('italic', false, null);
		});

                //insert url
		$(document.body).on("mousedown", "#link", function(){
			$(".modifyTextModel").hide();
			var link = prompt("Enter the link","http://");

			if (link != null)
				document.execCommand('createLink', false, link);

		});

                //remove hyper link
		$(document.body).on("mousedown", "#unlink", function(){
			$(".modifyTextModel").hide();
			document.execCommand('unlink', false, null);
		});

		widget.init();
	}

        //save function
        ClrText.prototype.save = function(widget){

            if( $("#noteId").val() === "" ){
                widget.create( $(".titleDiv").val(),
                        $("#content").val(), widget
                );
            }
            else{
                widget.update( $("#noteId").val(),
                        $(".titleDiv").val(),
                        $("#content").val(), widget
                );
            }
        };

        //create new function
        ClrText.prototype.create = function(title, content, widget){
            if( title !== "", content !== "" ){
                $.post('createNote',{title:title, content:content},
                    function(responseText) {
                        var jsonObj = JSON.parse(responseText);
                        if(jsonObj.response === "true"){
                           widget.stopAnim( $(".returnedMessage") );
                           $(".returnedMessage").html("<span>All changes Saved</span>");
                           $(".returnedMessage").show();
                           $("#noteId").val(jsonObj.id);
                        }else{
                            $(".returnedMessage").html(jsonObj.errorMessage);
                            $(".returnedMessage").show();
                        }
                    }
                );
            }
        };

        //update function
        ClrText.prototype.update = function(id, title, content, widget){
            $.post('createNote',{id:id, title:title, content:content},
                function(responseText) {
                    var jsonObj = JSON.parse(responseText);
                    if(jsonObj.response === "true"){
                       widget.stopAnim( $(".returnedMessage") );
                       $(".returnedMessage").html("<span>All changes Saved</span>");
                       $(".returnedMessage").show();
                    }else {
                        $(".returnedMessage").html(jsonObj.errorMessage);
                        $(".returnedMessage").show();
                    }
                }
            );
        };

        //This function starts the indexing animation
	// ClrText.prototype.startAnim = function(element){
	// 	element.html("<p>Saving <span id='wait'></span></p>");
	// 	this.dots = window.setInterval( function() {
	// 		var wait = element.children("p").children("span");
	// 		if ( wait.html().length > 8 ) wait.html("");
	// 		else wait.html(wait.html()+".");
	// 	}, 340);
	// };

	//this function stops the animation
	ClrText.prototype.stopAnim = function(element){
		clearInterval(this.dots);
		element.html("");
	};

	/*init function
        this part of the plugin takes care of creating elements on the page*/
	ClrText.prototype.init = function(){
		var element = this.element;

                //button to create blocks
		var blockOptions = $("<div/>,", {
			"class": "blockOptions group"
		}).appendTo(element);

                //text block button
		var textBlockOption = $("<div/>", {
			text: "Text",
			id: "text"
		}).appendTo(blockOptions);

                //image block button
		var imageBlockOption = $("<div/>", {
			text: "Image",
			id: "image"
		}).appendTo(blockOptions);

                //code block button
		var codeBlockOption = $("<div/>", {
			text: "Code",
			id: "code"
		}).appendTo(blockOptions);

                //list block button
		var listBlockOption = $("<div/>", {
			text: "List",
			id: "list"
		}).appendTo(blockOptions);

		$("<div/>", {
			"style": "clear: both"
		}).appendTo(blockOptions);

		var form = $("<form />").appendTo(element);

                //document title element
		var contentTitle = $("<input/>", {
			type: "text",
			name: "title",
			"class": "titleDiv",
			"placeholder": "Document Title"
		}).appendTo(form).focus();

                //textarea to hold the values
		var content = $("<textarea/>", {
			name: "content",
			id: "content",
			hidden: true
		}).appendTo(form);

		var blocksContainer = $("<div/>", {
			text: "Click on the content type button on the top right to a create a content block and start typing !!!",
			id: "blocks-container"
		}).appendTo(element);

		$('.blockOptions').one("click", function(){
			blocksContainer.hide();
		})

                //text block
		textBlockOption.on("click", function(e){
			var contentDiv = $("<div/>", {
				"class": "content-block"
			});
			var handle = $('<div/>', {
				text: "X",
				"class": "handle",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			var deleteBlock = $('<div/>', {
				text: "X",
				"class": "delete-block",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			contentDiv.appendTo(element);

			$("<div/>", {
				"class": "inner-block",
				"data-set": "text",
				contentEditable: true
			}).appendTo(contentDiv).focus();
		});

                //code block
		codeBlockOption.on("click", function(e){
			var contentDiv = $("<div/>", {
				"class": "content-block"
			});

			var handle = $('<div/>', {
				text: "X",
				"class": "handle",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			var deleteBlock = $('<div/>', {
				text: "X",
				"class": "delete-block",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			contentDiv.appendTo(element);

			$("<pre/>", {
				"class": "inner-block prettyprint",
				"data-set": "text",
				contentEditable: true
			}).appendTo(contentDiv).focus();
		});

                //list block
		listBlockOption.on("click", function(e){
			var contentDiv = $("<div/>", {
				"class": "content-block"
			});

			var handle = $('<div/>', {
				text: "X",
				"class": "handle",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			var deleteBlock = $('<div/>', {
				text: "X",
				"class": "delete-block",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			contentDiv.appendTo(element);

			var list = $("<ul/>", {
				"class": "inner-block",
				"data-set": "list",
				contentEditable: true
			}).appendTo(contentDiv);

			$("<li><br /></li>").focus().appendTo(list);
		});

                //image block
		imageBlockOption.on("click", function(e){

			var imageLink = prompt("Enter the image link","http://");

			if (imageLink != null) {
				var contentDiv = $("<div/>", {
				"class": "content-block"
			});
			var handle = $('<div/>', {
				text: "X",
				"class": "handle",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			var deleteBlock = $('<div/>', {
				text: "X",
				"class": "delete-block",
				css: {
					display: 'none'
				}
			}).appendTo(contentDiv);

			contentDiv.appendTo(element);

			$("<img/>", {
				"class": "inner-block",
				"data-set": "image",
				"src": imageLink
			}).appendTo(contentDiv).focus();
			}

		});

                //rich text options
		var modifyTextModel = $("<div/>", {
			"class": "modifyTextModel",
			hidden : true
		}).appendTo(document.body);

		$('<span/>', {
			text: "B",
			id: "bold"
		}).appendTo(modifyTextModel);

		$('<span/>', {
			text: "I",
			id: "italics"
		}).appendTo(modifyTextModel);

		$('<span/>', {
			text: "L",
			id: "link"
		}).appendTo(modifyTextModel);

		$('<span/>', {
			text: "NL",
			id: "unlink"
		}).appendTo(modifyTextModel);

                //code highliter
		element.one("focus", ".prettyprint", function(e){
			$(this).text(" ");
			prettyPrint();
		});
		element.on("focusout", ".prettyprint", function(e){
			prettyPrint();
		});

                //show hide delete and move icons
		element.on("mouseover", ".content-block", function(e){
			$this = $(this);
			$this.find(".delete-block").show();
			$this.find(".handle").show();
		});

		element.on("mouseout", ".content-block", function(e){
			$this = $(this);
			$this.find(".delete-block").hide();
			$this.find(".handle").hide();
		});

                //delete block
		element.on("click", ".delete-block", function(e){
			$(this).parent(".content-block").remove();
		});
	}

        //extending jQuery
	$.fn.clrtext = function(options){
		new ClrText(this.first(), options);

		return this;//returning this to not break chaining
	};
})(jQuery);
