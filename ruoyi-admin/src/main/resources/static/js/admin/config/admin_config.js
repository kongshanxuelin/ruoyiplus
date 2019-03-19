layui.define(['jquery', 'table', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_config = null;
    //页面事件列表
    var active = {
        reload: function () {
            //执行重载
            table.reload('table_config', {
                page: {
                    curr: 1
                }
                , where: {
                    "configName": $("[name=configName]").val()
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
            table_config = table.render({
                elem: '#table_config',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_config_toolbar',
                done: function () {
                    $('#table_config').next().css('height', 'auto');
                },
                limit: 20,
                height: 680,
                page: true,
                cols: new Array([
                    {
                        type: 'checkbox',
                        sort: false,
                        align: 'center',
                        width: 40,
                        fixed: 'left'
                    },
                    {
                        field: 'configName',
                        sort: true,
                        width: 200,
                        align: 'center',
                        title: '参数名称'
                    },
                    {
                        field: 'configKey',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '参数键名'
                    },
                    {
                        field: 'configValue',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '参数键值'
                    },
                    {
                        field: 'configType',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '系统内置',
                        templet:function(item){
                            if(item.configType === "Y") return "<span class=\"layui-badge layui-bg-green\">是</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">否</span>";
                        }
                    },
                    {
                        field: 'remark',
                        sort: true,
                        align: 'center',
                        title: '备注'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        toolbar: '#col_operation'
                    }])
            });
            //表格工具栏按钮事件
            table.on('toolbar(table_config)', function (obj) {
                switch (obj.event) {
                    case 'toolbar-config-remove':
                        var checks = table.checkStatus('table_config');
                        var ids = common.joinArray(checks.data, "configId");
                        active['remove'].call(this, ids);
                        break;
                    case 'toolbar-config-add':
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
                                    base: ctx + 'js/admin/config/'
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
            table.on('tool(table_config)', function (obj) {
                switch (obj.event) {
                    case 'del':
                        active['remove'].call(this, obj.data.configId);
                        break;
                    case 'data': //数据授权
                        layer.open({
                            type: 2,
                            title: '编辑',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['800px', '600px'],
                            content: prefix + '/rule/' + obj.data.configId
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
                            content: prefix + '/edit/' + obj.data.configId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/config/'
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
    exports('admin_config', view);
});