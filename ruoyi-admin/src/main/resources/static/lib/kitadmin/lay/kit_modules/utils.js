layui.define(['lodash', 'axios'], function(exports) {
    var _ = layui.lodash,
        axios = layui.axios;
    var utils = {
        error: function(msg) {
            console.error(msg);
        },
        oneOf: function(value, validList) {
            var flag = false;
            _.forEach(validList, function(item, index) {
                if (item === value) {
                    flag = true;
                }
            })
            return flag;
        },
        // 本地存储相关
        localStorage: {
            getItem: function(key) {
                return JSON.parse(localStorage.getItem(key));
            },
            setItem: function(key, data) {
                var d = (typeof data === 'object' || typeof data === 'array') ?
                    JSON.stringify(data) : data;
                localStorage.setItem(key, d);
            },
            removeItem: function(key) {
                localStorage.removeItem(key);
            },
            clear: function() {
                localStorage.clear();
            }
        },
        /**
         * 在一个数组里面查询一个对象
         * var r = 1;
         * var arr = [{name:'a',id:1},{name:'b',id:2}]
         * var result = utils.find(arr,function(item){
         *   return r === item.id;
         * });
         *  // result : {name:'a',id:1}
         */
        find: function(arr, callback) {
            return arr[_.findKey(arr, callback)];
        },
        // 读取模板
        tplLoader: function(url, callback, onerror) {
            var that = this;
            var data = '';
            // TODO 跨域未实现
            axios.get(url + '?v=' + new Date().getTime())
                .then(function(res) {
                    data = res.data;
                    //modify by cxlh：如果ID都被重置，那么控件如何渲染？
                    /*
                    var regList = [];
                    // 重置id 防止冲突
                    var ids = data.match(/id=\"\w*\"/g);
                    ids !== null && _.forEach(ids, function(item) { regList.push(item); });
                    // 重置lay-filter 防止冲突
                    var filters = data.match(/lay-filter=\"\w*\"/g);
                    filters !== null && _.forEach(filters, function(item) { regList.push(item); });

                    if (regList.length > 0) {
                        // 循环替换
                        _.forEach(regList, function(item) {
                            var matchResult = item.match(/\"\w*\"/);
                            if (matchResult !== undefined && matchResult != null && matchResult.length > 0) {
                                var result = matchResult[0];
                                var regStr = result.substring(1, result.length - 1);
                                var reg = new RegExp(regStr, 'g');
                                data = data.replace(reg, that.randomCode());
                            }
                        });
                    }
                    */
                })
                .catch(function(error) {
                    var request = error.request;
                    var errorMsg = '读取模板出现异常，异常代码：' + request.status + '、 异常信息：' + request.statusText;
                    console.log(errorMsg);
                    typeof onerror === 'function' && onerror(errorMsg);
                });

            var interval = setInterval(function() {
                if (data !== '') {
                    clearInterval(interval);
                    callback(data);
                }
            }, 50);
        },
        setUrlState: function(title, url) {
            history.pushState({}, title, url);
        },
        // 获取随机字符
        randomCode: function() {
            return 'r' + Math.random().toString(36).substr(2);
        },
        isFunction: function(obj) {
            return typeof obj === 'function';
        },
        isString: function(obj) {
            return typeof obj === 'string';
        },
        isObject: function(obj) {
            return typeof obj === 'object';
        }
    };
    //输出utils接口
    exports('utils', utils);
});