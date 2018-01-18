/**
 * 用法
 * helpers:{
 * 		rotate:true
 * }
 * add the rotate helpers to fancybox
 * @author sunguodong
 * @email sgd1993s@foxmail.com
 */
(function ($) {
	//Shortcut for fancyBox object
	"use strict";
	var F = $.fancybox;
	F.helpers.rotate = {
		afterLoad: function(current, previous) {
			var currentImage = "",
			rotates = 0,
			rotatecntrl = function (clicked, curImg) {
				if(currentImage != curImg ||  currentImage == "") {
        			currentImage = curImg;
        			if(currentImage != "") {
        				rotates = 0;
        			}
        		}
        		rotates++;
        		var rotate = $(clicked).attr('rel');
        		var deg = $(clicked).attr('deg');
        		$('.rotate-controller').find('a').each(function() {
        			var updated = 0;
        			var current = $(this).attr('rel');
        			var updated = parseInt(current)+parseInt(deg);	
					$(this).attr('rel', updated)
				});
				var imageHeight = $('.fancybox-image').height();
				var imageWidth = $('.fancybox-image').width();
				rotate = "rotate(" + rotate + "deg)";
				var trans = "all 0.3s ease-out";
				if( rotates % 2 == 1) {
					$(".fancybox-image").css({
						"-webkit-transform": rotate,
						"-moz-transform": rotate,
						"-o-transform": rotate,
						"msTransform": rotate,
						"transform": rotate,
						"-webkit-transition": trans,
						"-moz-transition": trans,
						"-o-transition": trans,
						"transition": trans,
						"width": imageHeight
					});
					$('.fancybox-wrap').css ("width", imageHeight+30);
					$('.fancybox-inner').css ("margin","0 auto");
					$.fancybox.reposition();
				} else {
					$(".fancybox-image").css({
						"-webkit-transform": rotate,
						"-moz-transform": rotate,
						"-o-transform": rotate,
						"msTransform": rotate,
						"transform": rotate,
						"-webkit-transition": trans,
						"-moz-transition": trans,
						"-o-transition": trans,
						"transition": trans,
						"width": "100%"
					});
					$.fancybox.update();
				}
			};
			var curImg = ( 'Current: ' + current.href );  
            var rotate = '<div class="rotate-controller"><a href="#" class="rotate 270deg" deg="-90" rel="-90" >rotate -90</a>|<a href="#" class="rotate 90deg" deg="90" rel="90"> rotate 90</a>|</div>';
            $('.fancybox-outer').after(rotate);
            $('.270deg').click(function(){ rotatecntrl(this,curImg);return false; });
            $('.90deg').click(function(){ rotatecntrl(this,curImg);return false; });
        },
        afterClose : function () {
        	var rotates = 0,
        	currentImage = "";
        }
    };
}(jQuery));
