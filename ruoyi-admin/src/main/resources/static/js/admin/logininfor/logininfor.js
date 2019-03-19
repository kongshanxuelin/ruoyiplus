layui.define(['jquery', 'table', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_logininfor = null;
    //页面事件列表
    var active = {
        reload: function () {
            //执行重载
            table.reload('table_logininfor', {
                page: {
                    curr: 1
                }
                , where: {
                    "loginName": $("[name=loginName]").val(),
                    "unknown": 0
                }
            });
        },
        remove: function (ids) {
            common.ajaxRemove(prefix + "/remove", ids, function (res) {
                active['reload'].call(this);
            });
        }
    };
    var _config = null;
    var view = {
        init: function (config) {
            _config = config;
            laydate.render({
                elem: '.ss-laydate'
            });
            this.initTable();
            this.initForm();
        },
        initTable: function () {
            table_logininfor = table.render({
                elem: '#table_logininfor',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_logininfor_toolbar',
                done: function () {
                    $('#table_logininfor').next().css('height', 'auto');
                },
                limit: 20,
                height: 680,
                page: true,
                cols: new Array([
                    {
                        field: 'loginName',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '登录账号'
                    },
                    {
                        field: 'ipaddr',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '登录IP地址',
                        templet:function(item){
                            return "<span class=\"layui-badge layui-bg-green\" title='"+item.ipaddr+"'>"+item.loginLocation  +"</span>";
                        }
                    },
                    {
                        field: 'browser',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '浏览器类型'
                    },
                    {
                        field: 'os',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '操作系统'
                    },
                    {
                        field: 'status',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '登录状态',
                        templet:function(item){
                            if(item.status === "0") return "<span class=\"layui-badge layui-bg-green\">成功</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">失败</span>";
                        }
                    },
                    {
                        field: 'msg',
                        sort: true,
                        align: 'center',
                        title: '提示消息'
                    },
                    {
                        field: 'loginTime',
                        sort: true,
                        width: 200,
                        align: 'center',
                        title: '访问时间'
                    }])
            });
            //表格工具栏按钮事件
            table.on('toolbar(table_logininfor)', function (obj) {
                switch (obj.event) {
                    case 'toolbar-logininfor-remove':
                        var checks = table.checkStatus('table_logininfor');
                        var ids = common.joinArray(checks.data, "infoId");
                        active['remove'].call(this, ids);
                        break;
                    case 'toolbar-logininfor-add':
                        layer.open({
                            type: 2,
                            title: '新增',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['600px', '450px'],
                            content: prefix + '/add',
                            btn: ["创建", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/logininfor/'
                                }).use('add', function () {
                                    layui.add.submit({
                                        "index": index,
                                        "layero": layero
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
            table.on('tool(table_logininfor)', function (obj) {
                switch (obj.event) {
                    case 'del':
                        active['remove'].call(this, obj.data.infoId);
                        break;
                    case 'data': //数据授权
                        layer.open({
                            type: 2,
                            title: '编辑',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['800px', '600px'],
                            content: prefix + '/rule/' + obj.data.infoId
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
                            content: prefix + '/edit/' + obj.data.infoId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/logininfor/'
                                }).use('add', function () {
                                    layui.add.submit({
                                        "index": index,
                                        "layero": layero
                                    });
                                });
                            }
                        });
                        break;
                }
            });
        },
        initForm: function () {
            $('form .layui-btn').on('click', function () {
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';
                return false;
            });
        },
        removeItems: function () {
            active['remove'].call(this);
        },
        refreshTable: function () {
            active['reload'].call(this);
        }
    };
    exports('logininfor', view);
});