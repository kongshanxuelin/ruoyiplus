layui.define(['jquery','table','layer','form','eleTree','common'], function(exports){
    var $ = layui.jquery,form=layui.form,eleTree=layui.eleTree,common=layui.common;
    var _config = null;
    var view = {
      init:function(config){
          _config = config;
          if("2" === _config.dataScopeFlag){
              $("#dataScopeDiv").show();
          }else{
              $("#dataScopeDiv").hide();
          }
          //下拉框事件
          form.on("select(dataScope)",function(v){
              if("2" === v.value){
                  $("#dataScopeDiv").show();
              }else{
                  $("#dataScopeDiv").hide();
              }
          });
          //初始化数据授权Tree
          var treeUrl = _config.ctx + "system/dept/roleDeptTreeData2?roleId=" + $("#roleId").val();

          var menuTree=eleTree.render({
              elem: '#deptTrees',
              showCheckbox: true,
              url: treeUrl,
              request: {
                  name: "name",
                  key: "id",
                  children: "children",
                  checked: "checked",
                  disabled: "disabled",
                  isLeaf: "isLeaf"
              },
              response: {
                  statusName: "code",
                  statusCode: 0,
                  dataName: "data"
              },
              done: function(res){
                  var ss = common.getJsonArrayValue(res.data,"children","checked","id");
                  menuTree.setChecked(ss,false);
              },
              defaultExpandAll: false,
              expandOnClickNode: false,
              highlightCurrent: true
          });

          form.on("submit(form-role-data)",function(data){
              var deptIds = menuTree.getChecked(false,false);
              console.log("data.fields:",data.field)
              $.ajax({
                  cache : false,
                  type : "POST",
                  url : prefix + "/rule",
                  data : {
                      "roleId": $("[name=roleId]").val(),
                      "roleName": $("[name=roleName]").val(),
                      "roleKey": $("[name=roleKey]").val(),
                      "dataScope": $("[name=dataScope]").val(),
                      "deptIds": common.joinArray(deptIds,"id")
                  },
                  async : false,
                  error : function(request) {
                      layer.msg("系统错误");
                  },
                  success : function(data) {
                      if(data.code > 0 ){
                          layer.msg(data.msg);
                      }else{
                          var index = parent.layer.getFrameIndex(window.name);
                          parent.layer.close(index);
                          parent.layui.role.refreshTable();
                      }
                  }
              });
              return false;
          });
      },
      submit:function(config){
            var iframeWindow = window['layui-layer-iframe'+ config.index];
            var _form = $(window.frames["layui-layer-iframe" + config.index].document).contents().find("#btn-add");
            $(_form).click();
      }
    };

    exports('rule',view);
});