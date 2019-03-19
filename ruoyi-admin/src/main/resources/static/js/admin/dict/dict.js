layui.define(['jquery', 'table', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_dict = null;
    //页面事件列表
    var active = {
        reload: function () {
            //执行重载
            table.reload('table_dict', {
                page: {
                    curr: 1
                }
                , where: {
                    "dictName": $("[name=dictName]").val(),
                    "dictType": $("[name=dictType]").val(),
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
            table_dict = table.render({
                elem: '#table_dict',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_dict_toolbar',
                done: function () {
                    $('#table_dict').next().css('height', 'auto');
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
                        field: 'dictName',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '字典名称'
                    },
                    {
                        field: 'dictType',
                        sort: true,
                        width: 200,
                        align: 'center',
                        title: '字典类型'
                    },
                    {
                        field: 'status',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '状态',
                        templet:function(item){
                            if(item.status === "0") return "<span class=\"layui-badge layui-bg-green\">正常</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">停用</span>";
                        }
                    },
                    {
                        field: 'remark',
                        sort: true,
                        align: 'center',
                        title: '备注'
                    },
                    {
                        field: 'createTime',
                        sort: true,
                        width:200,
                        align: 'center',
                        title: '创建时间'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        toolbar: '#col_operation'
                    }])
            });
            //表格工具栏按钮事件
            table.on('toolbar(table_dict)', function (obj) {
                switch (obj.event) {
                    case 'toolbar-dict-remove':
                        var checks = table.checkStatus('table_dict');
                        var ids = common.joinArray(checks.data, "dictId");
                        active['remove'].call(this, ids);
                        break;
                    case 'toolbar-dict-add':
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
                                    base: ctx + 'js/admin/dict/'
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
            table.on('tool(table_dict)', function (obj) {
                switch (obj.event) {
                    case 'del':
                        active['remove'].call(this, obj.data.dictId);
                        break;
                    case 'data': //列表数据
                        layer.open({
                            type: 2,
                            title: '列表数据',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['1200px', '600px'],
                            content: prefix + '/detail/' + obj.data.dictId
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
                            content: prefix + '/edit/' + obj.data.dictId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/dict/'
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
    exports('dict', view);
});