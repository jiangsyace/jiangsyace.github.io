$(function () {

  'use strict';
  var console = window.console || { log: function () {} };
  var $images = $('.docs-pictures');
  var $buttons = $('a');
  
    var options = {
        //inline: true,
        url: 'data-original'
      };
      
  //$images.viewer(options);
  $('#aaaaa').viewer(options);
  console.info('size:' + $('#aaaaa').find('img').size());
  $('.viewer-trigger').on('click', function(){
      var data = $(this).data();
      console.info(data);
      console.info(data.target);
      $('.image_'+data.target).trigger('click');
  });
$buttons.on('click', function () {
    var data = $(this).data();
    if (data.method) {
      if (data.target) {
        console.info(22222222);
        $images.viewer(data.method, 3);
        //$images.viewer('destroy').viewer(options);
      }
    }
    /*var args = data.arguments || [];
    if (data.method) {
      if (data.target) {
        $images.viewer(data.method, $(data.target).val());
      } else {
        $images.viewer(data.method, args[0], args[1]);
      }
    }*/
  });
});

 