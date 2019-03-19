layui.define(['jquery', 'table', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_notice = null;
    //页面事件列表
    var active = {
        reload: function () {
            //执行重载
            table.reload('table_notice', {
                page: {
                    curr: 1
                }
                , where: {
                    "noticeTitle": $("[name=noticeTitle]").val(),
                    "noticeType": $("[name=noticeType]").val()
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
            table_notice = table.render({
                elem: '#table_notice',
                method: 'POST',
                url: prefix + "/list",
                toolbar: '#table_notice_toolbar',
                done: function () {
                    $('#table_notice').next().css('height', 'auto');
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
                        field: 'noticeTitle',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '公告标题'
                    },
                    {
                        field: 'noticeType',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '公告类型',
                        templet:function(item){
                            return "<span class=\"layui-badge layui-bg-green\">"+common.getDictLabel(types,item.noticeType)+"</span>";
                        }
                    },
                    {
                        field: 'noticeContent',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '公告内容'
                    },
                    {
                        field: 'status',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '公告状态',
                        templet:function(item){
                            var _status = common.getDictLabel(datas,item.status);
                            if(_status === "正常") return "<span class=\"layui-badge layui-bg-green\">正常</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">停用</span>";
                        }
                    },
                    {
                        field: 'remark',
                        sort: true,
                        width: 150,
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
            table.on('toolbar(table_notice)', function (obj) {
                switch (obj.event) {
                    case 'toolbar-notice-remove':
                        var checks = table.checkStatus('table_notice');
                        var ids = common.joinArray(checks.data, "noticeId");
                        active['remove'].call(this, ids);
                        break;
                    case 'toolbar-notice-add':
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
                                    base: ctx + 'js/admin/notice/'
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
            table.on('tool(table_notice)', function (obj) {
                switch (obj.event) {
                    case 'del':
                        active['remove'].call(this, obj.data.noticeId);
                        break;
                    case 'edit':
                        layer.open({
                            type: 2,
                            title: '编辑',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['800px', '600px'],
                            content: prefix + '/edit/' + obj.data.noticeId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/notice/'
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
    exports('notice', view);
});