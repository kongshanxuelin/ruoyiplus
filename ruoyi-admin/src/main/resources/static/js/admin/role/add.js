layui.define(['element','layer','form','eleTree','common','jquery'],function(exports){
    var $ = layui.jquery
        ,layer = layui.layer
        ,form = layui.form
        ,eleTree = layui.eleTree
        ,common = layui.common;
    //初始传入参数
    var _config = {};
    var view = {
        init:function(config){
            _config = config;
            var treeUrl = ctx + "system/menu/roleMenuTreeData2";

            if(!common.isEmpty(_config.id)){
                treeUrl += "?roleId=" + _config.id;
            }

            var menuTree=eleTree.render({
                elem: '#menuTrees',
                showCheckbox: true,
                url: treeUrl,
                //  defaultCheckedKeys:[113,115],
                request: {
                    name: "name",
                    key: "id",
                    children: "children",
                    checked: "checked",
                    disabled: "disabled",
                    isLeaf: "isLeaf"
                },
                response: {
                    statusName: "code",
                    statusCode: 0,
                    dataName: "data"
                },
                done: function(res){
                    var ss = common.getJsonArrayValue(res.data,"children","checked","id");
                    menuTree.setChecked(ss);
                    console.log("tree checked:",ss)
                },
                defaultExpandAll: true,
                expandOnClickNode: false,
                highlightCurrent: true
            });

            form.render(null, 'form-role');

            form.verify({
                roleKey:function(value,item){
                    var msg;
                    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                        msg = 'roleKey不能有特殊字符';
                    }
                    $.ajax({
                        type: "POST",
                        url: prefix + "/checkRoleKeyUnique",
                        async:false,
                        cache:false,
                        dataType: "json",
                        data: {
                            roleKey:$("[name='roleKey']").val()
                        },
                        success: function(res){
                            if(res != "0"){
                                msg = "roleKey已存在，请修改！";
                            }
                        },
                        error:function(){
                            msg = "验证roleKey出错！";
                        }
                    });
                    return msg;
                },
                roleName:function(value,item){
                    var msg;
                    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                        msg = 'roleName不能有特殊字符';
                    }
                    $.ajax({
                        type: "POST",
                        url: prefix + "/checkRoleNameUnique",
                        async:false,
                        cache:false,
                        dataType: "json",
                        data: {
                            roleName:$("[name='roleName']").val()
                        },
                        success: function(res){
                            if(res != "0"){
                                msg = "roleName已存在，请修改！";
                            }
                        },
                        error:function(){
                            msg = "验证roleName出错！";
                        }
                    });
                    return msg;
                }
            });

            form.on('submit(btn-add)', function(data){
               var menus = menuTree.getChecked(false,true);
               data.field.menuIds = common.joinArray(menus,"id");
               data.field.status = data.field.status === "on" ? "1":"0";
               if(!common.isEmpty(_config.id)){
                   data.field.roleId = _config.id;
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
                                parent.layui.role.refreshTable();
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