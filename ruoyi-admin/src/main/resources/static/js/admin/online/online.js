layui.define(['jquery','table','layer','form','laydate','common'], function(exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_online = null;
    //页面事件列表
    var active = {
        reload: function(){
            //执行重载
            table.reload('table_online', {
                page: {
                    curr: 1
                }
                ,where: {
                                                                                                                    "loginName": $("[name=loginName]").val(),
                                                                                                                                                                                                                                                                                                                                                                                                                    "lastAccessTime": $("[name=lastAccessTime]").val(),
                                                                                                "expireTime": $("[name=expireTime]").val(),
                                                                "unknown":0
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
            laydate.render({
                elem: '.ss-laydate'
            });
            this.initTable();
            this.initForm();
        },
        initTable:function(){
            table_online = table.render({
                elem: '#table_online',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_online_toolbar',
                done: function() {
                    $('#table_online').next().css('height', 'auto');
                },
                limit: 20,
                height: 680,
                page: true,
                cols: new Array([
                    {
                        type:'checkbox',
                        sort: false,
                        align:'center',
                        width:40,
                        fixed: 'left'
                    },
                                                                                                                    {
                                field: 'loginName',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '登录账号'
                            },
                                                                                                {
                                field: 'deptName',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '部门名称'
                            },
                                                                                                {
                                field: 'ipaddr',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '登录IP地址'
                            },
                                                                                                {
                                field: 'loginLocation',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '登录地点'
                            },
                                                                                                {
                                field: 'browser',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '浏览器类型'
                            },
                                                                                                {
                                field: 'os',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '操作系统'
                            },
                                                                                                {
                                field: 'status',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '在线状态on_line在线off_line离线'
                            },
                                                                                                {
                                field: 'startTimestamp',
                                sort: true,
                                width:150,
                                align:'center',
                                title: 'session创建时间'
                            },
                                                                                                {
                                field: 'lastAccessTime',
                                sort: true,
                                width:150,
                                align:'center',
                                title: 'session最后访问时间'
                            },
                                                                                                {
                                field: 'expireTime',
                                sort: true,
                                width:150,
                                align:'center',
                                title: '超时时间，单位为分钟'
                            },
                                                                {
                        title: '操作',
                        align: 'center',
                        toolbar:'#col_operation'
                    }])
            });
            //表格工具栏按钮事件
            table.on('toolbar(table_online)', function(obj){
                switch(obj.event){
                    case 'toolbar-online-remove':
                        var checks = table.checkStatus('table_online');
                        var ids = common.joinArray(checks.data,"sessionId");
                        active['remove'].call(this,ids);
                        break;
                    case 'toolbar-online-add':
                        layer.open({
                            type: 2,
                            title: '新增',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['600px', '450px'],
                            content: prefix + '/add',
                            btn:["创建","取消"],
                            yes:function(index,layero){
                                layui.config({
                                    base: ctx + 'js/admin/online/'
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
            table.on('tool(table_online)', function(obj){
                switch(obj.event){
                    case 'del':
                        active['remove'].call(this,obj.data.sessionId);
                        break;
                    case 'data': //数据授权
                        layer.open({
                            type: 2,
                            title: '编辑',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['800px', '600px'],
                            content: prefix + '/rule/'+obj.data.sessionId
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
                            content: prefix + '/edit/'+obj.data.sessionId,
                            btn:["保存","取消"],
                            yes:function(index,layero){
                                layui.config({
                                    base: ctx + 'js/admin/online/'
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
    exports('online',view);
});