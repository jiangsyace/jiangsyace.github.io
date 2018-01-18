/*
 * @author jiangsy
 * @version 2016-10-13
 */
//默认未完成，上传无错误
var uploadFinished = 0, uploadSuccess = true;
(function($){
    $.upload = function(options){
    	options = $.extend({
    		list : '.thelist',
    		pick : '',
    		showFileName : '',
    		input : ''
        }, options);
    	
    	var $list = $(options.list),
        fileList = '',
        done = true;
        var uploader = WebUploader.create({
            swf: $ctxStatic + "/webuploader/Uploader.swf",
            server: $ctx + "/loanInfo/saveDataPushFile",
            delurl: $ctx + "/loanInfo/deleteFile",
            pick : options.pick,
            name: "file",
            fileVal: "file",
            fileNumLimit: 1
        });
        // 文件被加入队列之前
        uploader.on( 'beforeFileQueued', function( file ) {
            var files = uploader.getFiles();
            for (var i = 0; i < files.length; i++) {
            	$('#' + files[i].id).remove();
            	uploader.removeFile(files[i]);
            }
            //验证文件大小
            if (file.size > 314572800) {
                $.jBox.tip("文件大小不超过300M", 'error'); 
                return false;
            }
        });
        // 当有文件添加进来的时候
        uploader.on( 'fileQueued', function( file ) {
        	$(options.showFileName).val(file.name);
            $list.append( '<div id="' + file.id + '" class="item">' +
                '<p class="state">等待上传...</p>' +
            '</div>' );
        });
        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .bar');
            // 避免重复创建
            if ( $percent.size() == 0 ) {
                $percent = $('<div class="progress progress-striped active">' +
                  '<div class="bar" style="width: 0%">' +
                  '</div>' +
                '</div>').appendTo( $li ).find('.bar');
            }
            $li.find('p.state').text('上传中...已上传' + (percentage * 100).toFixed(2) + '%');
            $percent.css( 'width', percentage * 100 + '%' );
        })
        uploader.on( 'uploadSuccess', function( file , res) {
            if (res.code == 'ERROR') {
            	uploadSuccess = false;
            	$( '#'+file.id ).find('p.state').text(res.msg);
            } else {
            	$(options.input).val(res.msg)
                $( '#'+file.id ).find('p.state').text('已上传');
            }
        });
        
        uploader.on( 'uploadError', function( file , res) {
        	uploadSuccess = false;
            $( '#'+file.id ).find('p.state').text('上传出错');
        });
        
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').fadeOut();
        });
        uploader.on('uploadFinished', function( file ) {
        	uploadFinished ++;
        	if (uploadFinished == 2) {
        		if (uploadSuccess) {
                    $('#inputForm').submit();
        		} else {
        			$('#btnSubmit').val('保存');
        			$('#btnSubmit').prop('disabled', false);
        			uploadFinished = 0, uploadSuccess = true;
        		}
        	}
        });
        return uploader;
    };
})(jQuery);
$(function(){
	//展开收起
    $(document).on('click', '.active-node', function(){
        $(this).parent().parent().nextUntil('.node').show();
        $(this).text('[-收起]');
        $(this).removeClass('active-node');
        $(this).addClass('passive-node');
    });
    $(document).on('click', '.passive-node', function(){
        $(this).parent().parent().nextUntil('.node').hide();
        $(this).text('[+展开]');
        $(this).removeClass('passive-node');
        $(this).addClass('active-node');
    });
	$(document).on('click', '.nav-tabs>li', function(){
		$('.nav-tabs li').removeClass('active');
		$(this).addClass('active');
		$('#content>div').css('display', 'none');
		$('#' + $(this).attr('data')).css('display', 'block');
	});
    var advUploader = $.upload({
    	list : '.advFilelist',
    	pick : '.adv-upload',
    	showFileName : '.showAdvFileName',
    	input : '#advDocFile'
    });
    var cmpUploader = $.upload({
        list : '.cmpFilelist',
        pick : '.cmp-upload',
        showFileName : '.showCmpFileName',
        input : '#cmpDocFile'
    });
    
    var $btn = $('#btnSubmit');
    $btn.on( 'click', function() {
    	if ($("#inputForm").valid()) {
    		advUploader.upload();
    		cmpUploader.upload();
    		$btn.val('上传文件中...');
    		$btn.prop('disabled', true);
    	}
    });
});
function selectFile(){
	var html = $('#selectPushFile').html();
	$.jBox(html, {title:"选择推送资料", width:670, height:500, buttons: { '关闭': true, '确定': 'submit'}, submit: function (v, h, f){
	    if(v == "submit"){
	    	$('#cmpDocFile').val("");
	    	$('#cmpDoc').val("");
	    	$('.cmpFilelist').css('display', 'none');
	    	var docIdStr = '';
	    	$('#content input.docId:checked').each(function(i, v){ 
	    		docIdStr += "," + ($(v).val()); 
	    	}); 
            docIdStr = docIdStr.substring(1);
            if (docIdStr.length > 0) {
		    	$('#cmpSelectDoc').val(docIdStr);
		    	var filename = $('#content input.docId:checked').parent().parent().find('a').attr('title');
		    	if ($('#content input.docId:checked').size() > 1) {
			    	$('#selectDataFileTip').text('(' + filename + '等'+ $('#content input.docId:checked').size() +'个文件)');
		    	} else {
		    		$('#selectDataFileTip').text('(' + filename + ')');
		    	}
            }
	    }
   }, loaded : function (b) {
	    //图片浏览
		$('#managerDataList_div').viewerDefault();
        $('#riskControlDataList_div').viewerDefault();
//	    $("a[rel=img_group_docType]").fancybox({
//	        'transitionIn'      : 'none',
//	        'transitionOut'     : 'none',
//	        'titlePosition'     : 'over',
//	        'overlayShow'       : false,
//	        'titleFormat'       : function(title, currentArray, currentIndex, currentOpts) {
//	            return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
//	        }
//	    });
   }});
}
function page(n,s){
	$('input[name="pager.offset"]').val(n);
	$('input[name="pager.limit"]').val(s);
	$("#searchForm").submit();
	return false;
}
function resetSearch() {
	$("#searchForm input[type!=button]").val('');
	$("#searchForm select").select2('val', '');
	$("#searchForm").submit();
}