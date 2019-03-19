layui.define(['element','layer','form','eleTree','common','jquery','laydate'],function(exports){
    var $ = layui.jquery
        ,layer = layui.layer
        ,form = layui.form
        ,laydate = layui.laydate
        ,eleTree = layui.eleTree
        ,common = layui.common;
    //初始传入参数
    var _config = {};
    var view = {
        init:function(config){
            _config = config;
            laydate.render({
                elem: '.ss-laydate'
            });
            form.render(null, 'form-notice');
            form.verify(common.verify);
            form.on('submit(btn-add)', function(data){
               if(!common.isEmpty(_config.id)){
                   data.field.noticeId = _config.id;
               }
               if(true){
                    $.ajax({
                        cache : false,
                        type : "POST",
                        url : common.isEmpty(_config.id) ? (prefix + "/add"):(prefix + "/edit"),
                        data : data.field,
                        async : false,
                        error : function(request) {
                            layer.msg("系统错误");
                        },
                        success : function(data) {
                            if(data.code > 0 ){
                                layer.msg(data.msg);
                            }else{
                                var index = parent.layer.getFrameIndex(window.name);
                                parent.layer.close(index);
                                parent.layui.notice.refreshTable();
                            }
                        }
                    });
                }
                return false;
            });
        },
        submit:function(config){
            var iframeWindow = window['layui-layer-iframe'+ config.index];
            var _form = $(window.frames["layui-layer-iframe" + config.index].document).contents().find("#btn-add");
            $(_form).click();
        }
    };
    exports("add",view);
});