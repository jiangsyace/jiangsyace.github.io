$.fn.extend({ 
	viewerDefault:function(){ 
		$(this).viewer({
			url: 'data-original'
		});
		$('.viewer-trigger').on('click', function(){
		  var data = $(this).data();
		  $(this).parent().find('img').trigger('click');
		});
	}
});