layui.define(['jquery', 'table', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_operlog = null;
    //页面事件列表
    var active = {
        reload: function () {
            //执行重载
            table.reload('table_operlog', {
                page: {
                    curr: 1
                }
                , where: {
                    "title": $("[name=title]").val(),
                    "method": $("[name=method]").val(),
                    "operLocation": $("[name=operLocation]").val(),
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
            table_operlog = table.render({
                elem: '#table_operlog',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_operlog_toolbar',
                done: function () {
                    $('#table_operlog').next().css('height', 'auto');
                },
                limit: 20,
                height: 680,
                page: true,
                cols: new Array([
                    {
                        field: 'title',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '模块标题'
                    },
                    {
                        field: 'businessType',
                        sort: true,
                        width: 100,
                        align: 'center',
                        title: '业务类型',
                        templet:function(item){
                            if(item.status === 0) return "<span class=\"layui-badge layui-bg-green\">其他</span>";
                            else if(item.status === 1) return "<span class=\"layui-badge layui-bg-cyan\">新增</span>";
                            else if(item.status === 2) return "<span class=\"layui-badge layui-bg-blue\">修改</span>";
                            else if(item.status === 3) return "<span class=\"layui-badge layui-bg-red\">删除</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">未知</span>";
                        }
                    },
                    {
                        field: 'method',
                        sort: true,
                        width: 200,
                        align: 'center',
                        title: '方法名称',
                        templet:function(item){
                            var _str = item.method;
                            if(_str.length > 25){
                                _str = "..." + _str.substring(_str.length-25,_str.length);
                            }
                            return "<span title='"+item.method+"' style='color:#009688;font-size:12px;'>"+_str+"</span>";
                        }
                    },
                    {
                        field: 'operatorType',
                        sort: true,
                        width: 100,
                        align: 'center',
                        title: '操作类别',
                        templet:function(item){
                            item.operatorType = item.operatorType + "";
                            if(item.operatorType === "0") return "<span class=\"layui-badge layui-bg-green\">其他</span>";
                            else if(item.operatorType === "1") return "<span class=\"layui-badge layui-bg-blue\">后台用户</span>";
                            else if(item.operatorType === "2") return "<span class=\"layui-badge layui-bg-cyan\">手机端用户</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">未知</span>";
                        }
                    },
                    {
                        field: 'operName',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '操作人员',
                        templet:function(item){
                            return "<span>"+item.operName + "(" + item.deptName+")</span>";
                        }
                    },
                    {
                        field: 'operUrl',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '请求URL'
                    },
                    {
                        field: 'operIp',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '主机地址',
                        templet:function(item){
                            return "<span title='"+item.operIp+"'>"+item.operLocation + "</span>";
                        }
                    },
                    {
                        field: 'status',
                        sort: true,
                        width: 100,
                        align: 'center',
                        title: '操作状态',
                        templet:function(item){
                            item.status = item.status + "";
                            if(item.status === "0") return "<span class=\"layui-badge layui-bg-green\">正常</span>";
                            else if(item.status === "1") return "<span class=\"layui-badge layui-bg-red\">异常："+item.errorMsg+"</span>";
                        }
                    },
                    {
                        field: 'operTime',
                        sort: true,
                        align: 'center',
                        title: '操作时间'
                    }])
            });
            //表格工具栏按钮事件
            table.on('toolbar(table_operlog)', function (obj) {
                switch (obj.event) {
                    case 'toolbar-operlog-remove':
                        var checks = table.checkStatus('table_operlog');
                        var ids = common.joinArray(checks.data, "operId");
                        active['remove'].call(this, ids);
                        break;
                    case 'toolbar-operlog-add':
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
                                    base: ctx + 'js/admin/operlog/'
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
            table.on('tool(table_operlog)', function (obj) {
                switch (obj.event) {
                    case 'del':
                        active['remove'].call(this, obj.data.operId);
                        break;
                    case 'data': //数据授权
                        layer.open({
                            type: 2,
                            title: '编辑',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['800px', '600px'],
                            content: prefix + '/rule/' + obj.data.operId
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
                            content: prefix + '/edit/' + obj.data.operId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/operlog/'
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
    exports('operlog', view);
});