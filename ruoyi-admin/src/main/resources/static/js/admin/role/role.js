layui.define(['jquery','table','layer','form','common'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        table = layui.table;
    var tableRole = null;
    //页面事件列表
    var active = {
        reload: function(){
            //执行重载
            table.reload('table_role', {
                page: {
                    curr: 1
                }
                ,where: {
                    "roleName": $("[name=roleName]").val(),
                    "roleKey": $("[name=roleKey]").val(),
                    "status": $("[name=status]").val()
                }
            });
        },
        remove: function(ids){
            common.ajaxRemove(prefix + "/remove",ids,function(res){
                active['reload'].call(this);
            });
        }
    };
    var _config = null;
    var view = {
        init:function(config){
            _config = config;
            this.initTable();
            this.initForm();
        },
        initTable:function(){
            tableRole = table.render({
                elem: '#table_role',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_role_toolbar',
                defaultToolbar:['filter'],
                limit: 20,
                height: 'full-340',
                page: true,
                cols: new Array([{
                    type:'checkbox',
                    sort: false,
                    align:'center',
                    width:40,
                    fixed: 'left'
                },
                    {
                        field: 'roleName',
                        sort: true,
                        width:150,
                        align:'center',
                        title: '角色名称'
                    },
                    {
                        field: 'roleKey',
                        sort: true,
                        width:150,
                        align:'center',
                        title: '权限字符'
                    },
                    {
                        field: 'roleSort',
                        title: '显示顺序',
                        sort: true,
                        width:100,
                        align:'center',
                        visible: false
                    },
                    {
                        visible: editFlag == 'hidden' ? false : true,
                        title: '冻结角色',
                        sort: true,
                        width:100,
                        align: 'center',
                        templet: '#tmplRoleStatus'
                    },
                    {
                        field: 'createTime',
                        title: '创建时间',
                        align: 'center',
                        sort: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        toolbar:'#col_operation'
                    }])
            });
            /*监听表格复选框选择
            table.on('checkbox(tableRole)', function (obj) {
                console.log(obj,this.value)
            });
            */
            //表格工具栏按钮事件
            table.on('toolbar(tableRole)', function(obj){
                switch(obj.event){
                    case 'toolbar-role-remove':
                        var checks = table.checkStatus('table_role');
                        var ids = common.joinArray(checks.data,"roleId");
                        active['remove'].call(this,ids);
                        break;
                    case 'toolbar-role-add':
                        layer.open({
                            type: 2,
                            title: '新增角色',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['600px', '450px'],
                            content: prefix + '/add',
                            btn:["创建","取消"],
                            yes:function(index,layero){
                                layui.config({
                                    base: ctx + 'js/admin/role/'
                                }).use('add',function(){
                                    layui.add.submit({
                                        "index":index,
                                        "layero":layero
                                    });
                                });
                            }
                        });
                        break;
                    case 'toolbar_del':

                        break;
                }
            });
            //表格事件
            table.on('tool(tableRole)', function(obj){
                switch(obj.event){
                    case 'del':
                        active['remove'].call(this,obj.data.roleId);
                        break;
                    case 'data': //数据授权
                        layer.open({
                            type: 2,
                            title: '数据授权',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['600px', '450px'],
                            content: prefix + '/rule/'+obj.data.roleId,
                            btn:["确定","取消"],
                            yes:function(index,layero){
                                layui.config({
                                    base: ctx + 'js/admin/role/'
                                }).use('rule',function(){
                                    layui.rule.submit({
                                        "index":index,
                                        "layero":layero
                                    });
                                });
                            }
                        });
                        break;
                    case 'edit':
                        layer.open({
                            type: 2,
                            title: '编辑',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['800px', '600px'],
                            content: prefix + '/edit/'+obj.data.roleId,
                            btn:["保存","取消"],
                            yes:function(index,layero){
                                layui.config({
                                    base: ctx + 'js/admin/role/'
                                }).use('add',function(){
                                    layui.add.submit({
                                        "index":index,
                                        "layero":layero
                                    });
                                });
                            }
                        });
                        break;
                }
            });
        },
        initForm:function(){
            form.on('switch(filter-switchRoleStatus)',function(obj){
                common.ajax.post(prefix +'/changeStatus',{
                    roleId:this.value,
                    status:obj.elem.checked?1:0
                },function(res){
                    console.log(res);
                });
            });
            $('form .layui-btn').on('click', function(){
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
                return false;
            });
        },
        removeItems:function(){
            active['remove'].call(this);
        },
        refreshTable:function(){
            active['reload'].call(this);
        }
    };
    exports('role',view);
});