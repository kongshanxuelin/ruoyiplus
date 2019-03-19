layui.define(['jquery', 'treeTable', 'layer', 'form', 'laydate', 'common'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        common = layui.common,
        laydate = layui.laydate,
        table = layui.treeTable;
    var table_menu = null;
    var tableId = 'table_menu';

    //页面事件列表
    var active = {
        reload: function () {
            table.reload(tableId,{
                url: prefix + "/listTreeGridData?menuName="+$("[name=menuName").val()+"&url="+$("[name=url]").val(),
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
            table_menu = table.render({
                id:tableId,
                elem: '#'+tableId,
                //url: prefix + "/listTreeGridData", //数据接口
                cellMinWidth: 100,
                url: prefix + "/listTreeGridData?menuName="+$("[name=menuName").val()+"&url="+$("[name=url]").val(),
                end: function (data) {
                    console.log("end data:",data)
                    form.render();
                },
                icon_key: 'menuName',// 必须
                top_value: 0,
                idField: 'menuId',
                treeId:'menuId',
                treeUpId: 'parentId'
                ,treeShowName:'menuName'//以树形式显示的字段
                ,heightRemove:[".dHead",10]//不计算的高度,表格设定的是固定高度，此项不生效
                ,height:"100%"
                ,isFilter:false
                ,iconOpen:true
                ,isOpenDefault:true
                ,loading:true
                ,method:'GET'
                ,isPage:false,
                cols: [[
                    {
                        field: 'menuName',
                        width: 300,
                        align: 'left',
                        title: '菜单名称'
                    },
                    {
                        field: 'orderNum',
                        align: 'center',
                        title: '显示顺序'
                    },
                    {
                        field: 'url',
                        align: 'center',
                        title: '请求地址'
                    },
                    {
                        field: 'menuType',
                        align: 'center',
                        title: '菜单类型',
                        templet:function(item){
                            if(item.menuType === "M") return "<span class=\"layui-badge layui-bg-green\">目录</span>";
                            else if(item.menuType === "C") return "<span class=\"layui-badge layui-bg-cyan\">菜单</span>";
                            else if(item.menuType === "F") return "<span class=\"layui-badge layui-bg-blue\">按钮</span>";
                            else return "<span class=\"layui-badge layui-bg-orange\">未知</span>";
                        }
                    },
                    {
                        field: 'visible',
                        align:'center',
                        title: '菜单状态',
                        templet:function(item){
                            if(item.visible === "0") return "<span class=\"layui-badge layui-bg-orange\">显示</span>";
                            else return  "<span class=\"layui-badge layui-bg-orange\">隐藏</span>";
                        }
                    },
                    {
                        field: 'perms',
                        align:'center',
                        title: '权限标识'
                    },
                    {
                        field: 'icon',
                        align: 'center',
                        title: '菜单图标'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width:200,
                        templet: function(item){
                            return '<a class="layui-btn layui-btn-xs"' +
                                '   lay-event="addChild"><i class="fa fa-add"></i>添加子菜单' +
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
            $("[lay-filter=toolbar-menu-add]").click(function(){
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
                            base: ctx + 'js/admin/menu/'
                        }).use('add', function () {
                            layui.add.submit({
                                "index": index,
                                "layero": layero
                            });
                        });
                    }
                });
            });
            $("[lay-filter=toolbar-menu-zhedie]").click(function(){
                table.treeOpenAll(tableId,false);
            });
            $("[lay-filter=toolbar-menu-zhankai]").click(function(){
                table.treeOpenAll(tableId,true);
            });
            //表格事件
            table.on('tool('+tableId+')', function (obj) {
                console.log("xxxx data click",obj);
                if (obj.event === "addChild") {
                    layer.open({
                        type: 2,
                        title: '新增',
                        shade: false,
                        fixed: false,
                        maxmin: true,
                        area: ['600px', '450px'],
                        content: prefix + '/add/' + obj.data.menuId,
                        btn: ["创建", "取消"],
                        yes: function (index, layero) {
                            layui.config({
                                base: ctx + 'js/admin/menu/'
                            }).use('add', function () {
                                layui.add.submit({
                                    "index": index,
                                    "layero": layero
                                });
                            });
                        }
                    });
                } else if (obj.event === "edit") {
                    layer.open({
                        type: 2,
                        title: '编辑',
                        shade: false,
                        fixed: false,
                        maxmin: true,
                        area: ['800px', '600px'],
                        content: prefix + '/edit/' + obj.data.menuId,
                        btn: ["保存", "取消"],
                        yes: function (index, layero) {
                            layui.config({
                                base: ctx + 'js/admin/menu/'
                            }).use('add', function () {
                                layui.add.submit({
                                    "index": index,
                                    "layero": layero
                                });
                            });
                        }
                    });
                } else if (obj.event === "del") {
                    active['remove'].call(this, obj.data.menuId);
                }
            });
        },
        initForm: function () {
            form.render();
            $('form.layui-form .layui-btn').on('click', function (e) {
                console.log("btn click",e)
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
    exports('admin_menu', view);
});