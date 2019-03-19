layui.define(['utils', 'jquery', 'lodash', 'nprogress', 'layer'], function(exports) {
    var utils = layui.utils,
        localStorage = utils.localStorage,
        setItem = localStorage.setItem,
        getItem = localStorage.getItem,
        $ = layui.jquery,
        _ = layui.lodash,
        layer = layui.layer,
        _win = $(window);

    var _viewBoxGlobal = undefined;

    var Route = function() {
        this.config = {
            name: 'KITADMINROUTE', // 这个不能改，可能会出问题。
            routerViewId: undefined,
            beforeRender: undefined,
            routes: []
        };
        var router = layui.router(location.hash)
        this.pathname = router.href === undefined ? '/' : router.href.split('?')[0];
        this.version = '1.2.3';
    };
    /**
     * 设置
     * @param {Object} options
     */
    Route.prototype.set = function(options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };
    /**
     * 设置路由
     * @param {*} options
     */
    Route.prototype.setRoutes = function(options) {
        var that = this;
        options.name = options.name || that.config.name;
        that.config.name = options.name;
        var defaults = {
            routes: []
        };
        $.extend(true, defaults, options);
        _.forEach(defaults.routes, function(item) {
            item.id = new Date().getTime() + '' + _.random(1000, 9999);
        });
        // 缓存到本地
        setItem(defaults.name, defaults.routes);
        $(window).off('popstate').on('popstate', function() {
            // 是否由外部处理
            if (utils.isFunction(options.onChanged)) {
                options.onChanged();
            } else {
                that.render();
            }
        });
        return that;
    };
    /**
     * 获取路由
     */
    Route.prototype.getRoutes = function() {
        return getItem(this.config.name);
    };
    /**
     * 获取路由信息
     * @param {*} hash
     */
    Route.prototype.getRoute = function(hash) {
        var that = this;
        var routes = that.getRoutes(that.config.name);
        if (routes === null || routes === undefined) {
            return undefined;
        }
        hash = hash || location.hash;
        var route = layui.router(hash);
        var href = route.href.split('?');
        var c = utils.find(routes, function(r) {
            return r.path === href[0];
        });
        if (c === undefined) {
            return c;
        }
        if (href.length > 1) {
            c.component += '?' + href[1];
            c.path += '?' + href[1];
        }
        return c;
    };
    /**
     * 渲染页面
     * @param {*} hash
     * @param {*} renderTarget
     * @param {*} callback
     */
    Route.prototype.render = function(hash, renderTarget, callback) {
        var that = this,
            config = that.config,
            _viewBox = undefined;
        // 开始
        NProgress.start();
        var loadIndex = layer.load(2);
        var viewId = utils.randomCode();
        if (renderTarget && renderTarget.length > 0) {
            _viewBox = renderTarget;
        } else {
            var _view = config.routerViewId === undefined ?
                $('router-view') : $('router-view#' + config.routerViewId + '');
            // 如果 router-view 标签存在都创建渲染dom,覆盖原来的
            if (_view.length > 0) {
                // 获取id
                _view.parent().append('<div id="' + viewId + '"></div>');
                _view.remove();
                _viewBox = $('#' + viewId);
                _viewBoxGlobal = _viewBox; //缓存一个全局容器 避免单页面的时候 _viewBox 为 undefined
            }
        }
        // 如果是单页面则读取全局
        if (_viewBox === undefined) {
            _viewBox = _viewBoxGlobal;
        }
        var route = that.getRoute(hash);
        var notFoundTpl = [
            '<div class="layui-fluid">',
            '  <div class="layui-row">',
            '    <div class="layui-col-xs12">',
            '      <div class="layui-row">',
            '        <div class="layui-col-md4">&nbsp;</div>',
            '        <div class="layui-col-md4">',
            '          <div class="kit-exception">',
            '            <i class="layui-icon kit-exception-icon">&#xe61c;</i>',
            '            <h3 class="kit-exception-title">:>404 抱歉，你访问的页面不存在</h3>',
            '            <a href="javascript:history.back(-1);" class="layui-btn">返回上一页</a>',
            '          </div>',
            '        </div>',
            '        <div class="layui-col-md4">&nbsp;</div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ];
        if (route !== undefined) {
            if (typeof config.beforeRender === 'function') {
                route = config.beforeRender(route);
            }
            // 如果是iframe
            if (route.iframe) {
                // _viewBox.html('<div class="kit-body-wapper"><iframe src="' + route.component + '" style="height: 780px;"></iframe></div>');
                _viewBox.html('<iframe src="' + route.component + '" data-id="' + viewId + '" style="height: 780px;"></iframe>');
                // 自适应高度
                _win.on('resize', function() {
                    var currBoxHeight = $('.layui-body').height(); //获取当前容器的高度
                    $('iframe[data-id=' + viewId + ']').height(currBoxHeight - 3);
                }).resize();

                cb();
            } else {
                utils.tplLoader(route.component, function(data) {
                    //console.log("tplLoader",data)
                    _viewBox.html(data);
                    cb();
                    // 设置浏览器地址显示
                    utils.setUrlState(route.name, '#' + route.path);
                }, function(errorMsg) {
                    var h = [
                        '<div class="layui-fluid">',
                        '<div class="layui-row">',
                        '<div class="layui-col-xs12">',
                        '<div class="kit-not-router">',
                        errorMsg,
                        '</div>',
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join('');
                    _viewBox.html(h);
                    cb();
                });
            }
        } else {
            _viewBox.html(notFoundTpl.join(''));
            NProgress.done();
            loadIndex && layer.close(loadIndex);
        }

        function cb() {
            // 结束
            NProgress.done();
            loadIndex && layer.close(loadIndex);
            utils.isFunction(callback) && callback();
        }
        return that;
    };
    /**
     * 获取路由参数
     */
    Route.prototype.params = function() {
        var router = layui.router();
        if (router.href === undefined) return null;
        var href = router.href;
        var p = href.substr(href.indexOf('?') + 1);
        if (href === p) return null;
        var params = p.split('&');
        var data = {};
        _.forEach(params, function(item, index) {
            var kv = item.split('=');
            var key = kv[0];
            var value = kv[1];
            data[key] = value;
        });
        return data;
    };
    var route = new Route();
    //输出router接口
    exports('route', route);
});