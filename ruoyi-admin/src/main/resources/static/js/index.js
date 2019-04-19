var mods = [
  'element', 'sidebar', 'mockjs', 'select',
  'tabs', 'menu', 'route', 'utils', 'component', 'kit', 'echarts','common'
];

layui.define(mods, function(exports) {
  var element = layui.element,
    utils = layui.utils,
    $ = layui.jquery,
    _ = layui.lodash,
    route = layui.route,
    tabs = layui.tabs,
    layer = layui.layer,
    menu = layui.menu,
    component = layui.component,
    kit = layui.kit;
    common = layui.common;

    function fullScreen() {
      var e = document.documentElement,
        a = e.requestFullScreen || e.webkitRequestFullScreen || e.mozRequestFullScreen || e.msRequestFullscreen;
      "undefined" != typeof a && a && a.call(e)
    }
    function exitScreen() {
      document.documentElement;
      document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen()
    }

  var Admin = function() {
    this.config = {
      elem: '#app',
      loadType: 'SPA'
    };
    this.version = '1.0.0';
  };

  Admin.prototype.ready = function(callback) {
    var that = this,
      config = that.config;

    // 初始化加载方式
    var getItem = utils.localStorage.getItem;
    var setting = getItem("KITADMIN_SETTING_LOADTYPE");
    var settingTheme = getItem("KITADMIN_SETTING_THEME");
    if (setting !== null && setting.loadType !== undefined) {
      config.loadType = setting.loadType;
    }
    if (settingTheme) {
      config.theme = settingTheme.theme || "default";
    } else {
      config.theme = "default";
    }

    kit.set({
      type: config.loadType,
      theme: config.theme || "default"
    }).init();

    // var str = $('#theme').attr('href');
    // var _themeUrl = str.substr(0, str.lastIndexOf('/') + 1);
    // $('#theme').attr('href', _themeUrl + config.theme + '.css');
    // console.log(_themeUrl + config.theme + '.css');
    // var _body = $('body');
    // if (!_body.hasClass('kit-theme-' + config.theme)) {
    //   _body.addClass('kit-theme-' + config.theme);
    // }

    // 初始化路由
    _private.routeInit(config);
    // 初始化选项卡
    if (config.loadType === 'TABS') {
      _private.tabsInit();
    }
    // 初始化左侧菜单
    _private.menuInit(config);
    // 跳转至首页
    if (location.hash === '') {
      utils.setUrlState('主页', '#/');
    }

    // // 处理 sidebar
    layui.sidebar.render({
      elem: '#ccleft',
      //content:'', 
      title: '这是左侧打开的栗子',
      shade: true,
      // shadeClose:false,
      direction: 'left',
      dynamicRender: true,
      url: '/js/views/app.html',
      width: '50%', //可以设置百分比和px
    });

    $('#cc').on('click', function(evt) {
      var a = "layui-icon-screen-full",
        t = "layui-icon-screen-restore",
        i = $(evt.target).children("i");
      if($(evt.target).is("i")){
        i = $(evt.target);
      }
      i.hasClass(a) ? (fullScreen(), i.addClass(t).removeClass(a)) : (exitScreen(), i.addClass(a).removeClass(t))
    });
    // 监听头部右侧 nav
    component.on('nav(header_right)', function(_that) {
      var target = _that.elem.attr('kit-target');
      if (target === 'setting') {
        // 绑定sidebar
        layui.sidebar.render({
          elem: _that.elem,
          //content:'', 
          title: '设置',
          shade: true,
          // shadeClose:false,
          // direction: 'left'
          dynamicRender: true,
          url: '/js/views/setting.html',
          // width: '50%', //可以设置百分比和px
        });
      }
      if (target === 'help') {
        layer.open({
          type: 1,
          content: '<div style="margin:30px;font-size:13px;color:green;"><a href="https://jq.qq.com/?_wv=1027&k=5kbkBlt">点击这里加入群聊【Sumslack开源】</a></div>'
        });
      }
    });

    // 注入mock
    //layui.mockjs.inject(APIs);

    // 初始化渲染
    if (config.loadType === 'SPA') {
      route.render();
    }
    that.render();

    // 执行回调函数
    typeof callback === 'function' && callback();
  }
  Admin.prototype.render = function() {
    var that = this;
    return that;
  }

  var _private = {
    routeInit: function(config) {
      var that = this;
      // route.set({
      //   beforeRender: function (route) {
      //     if (!utils.oneOf(route.path, ['/user/table', '/user/table2', '/'])) {
      //       return {
      //         id: new Date().getTime(),
      //         name: 'Unauthorized',
      //         path: '/exception/403',
      //         component: 'components/exception/403.html'
      //       };
      //     }
      //     return route;
      //   }
      // });
      // TODO: 这里可以动态读取子工程的配置路由地址push到common.routes
      var routeOpts = {
        routes: common.routes
      };
      if (config.loadType === 'TABS') {
        routeOpts.onChanged = function() {
          // 如果当前hash不存在选项卡列表中
          if (!tabs.existsByPath(location.hash)) {
            // 新增一个选项卡
            that.addTab(location.hash, new Date().getTime());
          } else {
            // 切换到已存在的选项卡
            tabs.switchByPath(location.hash);
          }
        }
      }
      // 设置路由
      route.setRoutes(routeOpts);
      return this;
    },
    addTab: function(href, layid) {
      var r = route.getRoute(href);
      if (r) {
        tabs.add({
          id: layid,
          title: r.name,
          path: href,
          component: r.component,
          rendered: false,
          icon: '&#xe62e;'
        });
      }
    },
    menuInit: function(config) {
      var that = this;
      // 配置menu
      menu.set({
        dynamicRender: false,
        isJump: config.loadType === 'SPA',
        onClicked: function(obj) {
          if (config.loadType === 'TABS') {
            if (!obj.hasChild) {
              var data = obj.data;
              var href = data.href;
              var layid = data.layid;
              that.addTab(href, layid);
            }
          }
        },
        elem: '#menu-box',
        remote: {
          url: '/api/getmenus',
          method: 'post'
        },
        cached: false
      }).render();
      return this;
    },
    tabsInit: function() {
      tabs.set({
        onChanged: function(layid) {
          // var tab = tabs.get(layid);
          // if (tab !== null) {
          //   utils.setUrlState(tab.title, tab.path);
          // }
        }
      }).render(function(obj) {
        // 如果只有首页的选项卡
        if (obj.isIndex) {
          route.render('#/');
        }
      });
    }
  }

  var admin = new Admin();
  admin.ready(function() {
    console.log('Init successed.');
  });

  //输出admin接口
  exports('index', {});
});