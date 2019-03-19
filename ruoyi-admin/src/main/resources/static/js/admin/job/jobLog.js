layui.define(['jquery', 'table', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.table;
    var table_job = null;
    //页面事件列表
    var active = {
        reload: function () {
            //执行重载
            table.reload('table_jobLog', {
                page: {
                    curr: 1
                }
                , where: {
                    "jobName": $("[name=jobName]").val(),
                    "jobGroup": $("[name=jobGroup]").val(),
                    "status": $("[name=status]").val()
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
            table_job = table.render({
                elem: '#table_jobLog',
                method: 'POST',
                url: prefix + "/list", //数据接口
                toolbar: '#table_jobLog_toolbar',
                done: function () {
                    $('#table_job').next().css('height', 'auto');
                    form.on("switch(status_switch)",function(data){
                       var jobId  = data.elem.dataset.jobid;
                       if(data.elem.checked){
                           common.ajax.post(prefix + "/changeStatus",{ "jobId": jobId, "status": 1 },function(json){
                              console.log(json);
                           });
                       }else{
                           common.ajax.post(prefix + "/changeStatus",{ "jobId": jobId, "status": 0 },function(json){
                               console.log(json);
                           });
                       }
                    });
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
                        field: 'jobName',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '任务名称'
                    },
                    {
                        field: 'jobGroup',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '任务组名'
                    },
                    {
                        field: 'methodName',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '任务方法'
                    },
                    {
                        field: 'methodParams',
                        sort: true,
                        width: 150,
                        align: 'center',
                        title: '方法参数'
                    },
                    {
                        field: 'jobMessage',
                        align: 'center',
                        title: '日志信息'
                    },
                    {
                        field: 'createTime',
                        sort: true,
                        width: 180,
                        align: 'center',
                        title: '创建时间'
                    }])
            });
            //表格工具栏按钮事件
            table.on('toolbar(table_jobLog)', function (obj) {
                switch (obj.event) {
                    case 'toolbar-job-log-clear':
                        layer.confirm("确定清空所有日志么？", function(index) {
                            common.ajax.post(prefix + "/clean", {}, function (data) {
                                if(data.code === 0)
                                    active['reload'].call(this);
                            });
                            layer.close(index);
                        });
                        break;
                    case 'toolbar-jobLog-remove':
                        var checks = table.checkStatus('table_jobLog');
                        var ids = common.joinArray(checks.data, "jobLogId");
                        active['remove'].call(this, ids);
                        break;

                }
            });
            //表格事件
            table.on('tool(table_job)', function (obj) {
                switch (obj.event) {
                    case 'del':
                        active['remove'].call(this, obj.data.jobId);
                        break;
                    case 'exec': //执行
                        layer.confirm("确定要执行一次该任务么？", function(index){
                            common.ajax.post(prefix+"/run",{"jobId":obj.data.jobId},function(data){
                               console.log(data);
                                if(data.code === 0){
                                    layer.close(index);
                                    layer.msg("执行成功！")
                                }
                            });

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
                            content: prefix + '/edit/' + obj.data.jobId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/job/'
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
    exports('jobLog', view);
});