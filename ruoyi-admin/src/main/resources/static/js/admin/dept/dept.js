layui.define(['jquery', 'treeTable', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.treeTable;
    var table_dept = null;
    var tableId = 'table_dept';
    //页面事件列表
    var active = {
        reload: function () {
            table.reload(tableId,{
                url: prefix + "/listTreeGridData?deptName="+$("[name=deptName").val()+"&leader="+$("[name=leader]").val(),
                page:{
                    curr:1
                }
            });
        },
        remove: function (ids) {
            common.ajaxRemove(prefix + "/remove/"+ids, "", function (res) {
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
            table_dept = table.render({
                id:tableId,
                elem: '#'+tableId,
                cellMinWidth: 100,
                url: prefix + "/listTreeGridData", //数据接口
                end: function () {
                    form.render();
                },
                icon_key: 'deptName',
                top_value: 0,
                idField: 'deptId',
                treeId:'deptId',
                treeUpId: 'parentId'
                ,treeShowName:'deptName'//以树形式显示的字段
                ,heightRemove:[".dHead",10]//不计算的高度,表格设定的是固定高度，此项不生效
                ,height:"100%"
                ,isFilter:false
                ,iconOpen:true
                ,isOpenDefault:true
                ,loading:true
                ,method:'GET'
                ,isPage:false,
                icon: {
                    open: 'layui-icon layui-icon-triangle-d',
                    close: 'layui-icon layui-icon-triangle-r',
                    left: 16,
                },
                is_checkbox: true,
                is_cache: true,
                cols: [[
                    {
                        field: 'deptName',
                        width: 200,
                        align: 'left',
                        title: '部门名称'
                    },
                    {
                        field: 'orderNum',
                        align: 'center',
                        width: 150,
                        title: '显示顺序'
                    },
                    {
                        field: 'status',
                        align:'center',
                        width: 150,
                        title: '状态',
                        templet:function(item){
                            if(item.status === "0") return "<span class=\"layui-badge layui-bg-green\">正常</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">停用</span>";
                        }
                    },
                    {
                        field: 'leader',
                        align: 'center',
                        width: 150,
                        title: '负责人'
                    },
                    {
                        field: 'phone',
                        align: 'center',
                        width: 150,
                        title: '联系电话'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        templet: function(item){
                            return '<a class="layui-btn layui-btn-xs"' +
                                '   lay-event="addChild"><i class="fa fa-add"></i>添加子部门' +
                                '</a>' +
                                '<a class="layui-btn layui-btn-xs"' +
                                '   lay-event="edit"><i class="fa fa-edit"></i>编辑' +
                                '</a>' +
                                '<a  class="layui-btn layui-btn-xs"' +
                                '   lay-event="del"><i class="fa fa-remove"></i>删除' +
                                '</a>';
                        }
                    }]]
            });
            $("[lay-filter=toolbar-dept-add]").click(function(){
                layer.open({
                    type: 2,
                    title: '新增',
                    shade: false,
                    fixed: false,
                    maxmin: true,
                    area: ['600px', '450px'],
                    content: prefix + '/add/0',
                    btn: ["创建", "取消"],
                    yes: function (index, layero) {
                        layui.config({
                            base: ctx + 'js/admin/dept/'
                        }).use('add', function () {
                            layui.add.submit({
                                "index": index,
                                "layero": layero
                            });
                        });
                    }
                });
            });
            $("[lay-filter=toolbar-dept-zhedie]").click(function(){
                table.treeOpenAll(tableId,false);
            });
            $("[lay-filter=toolbar-dept-zhankai]").click(function(){
                table.treeOpenAll(tableId,true);
            });
            //表格事件
            table.on('tool('+tableId+')', function (obj) {
                switch(obj.event){
                    case 'addChild':
                        layer.open({
                            type: 2,
                            title: '新增',
                            shade: false,
                            fixed: false,
                            maxmin: true,
                            area: ['600px', '450px'],
                            content: prefix + '/add/'+obj.data.deptId,
                            btn: ["创建", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/dept/'
                                }).use('add', function () {
                                    layui.add.submit({
                                        "index": index,
                                        "layero": layero
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
                            content: prefix + '/edit/' + obj.data.deptId,
                            btn: ["保存", "取消"],
                            yes: function (index, layero) {
                                layui.config({
                                    base: ctx + 'js/admin/dept/'
                                }).use('add', function () {
                                    layui.add.submit({
                                        "index": index,
                                        "layero": layero
                                    });
                                });
                            }
                        });
                        break;
                    case 'del':
                        active['remove'].call(this, obj.data.deptId);
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
    exports('dept', view);
});