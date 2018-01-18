$(document).ready(function() {
	$('input').on('input propertychange' ,function(){
        var that = $(this)[0];
        that.value = that.value.slice(0, 12)
    });
});