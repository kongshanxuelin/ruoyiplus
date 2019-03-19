var APIs = {
  'POST /api/user/login': {
    success: '@boolean',
    msg: '登录成功.',
    statusCode: 200,
    data: null
  },
  'GET /api/getUser': {
    id: 1,
    name: '@name',
    email: '@email',
    address: '@region',
    datetime: '@datetime'
  },
  'POST /api/tableData': {
    'list|10': [{
      'id|+1': 1,
      name: '@name',
      email: '@email',
      datetime: '@datetime',
      address: '@region',
    }]
  },
  'POST /api/submitForm': {
    success: '@boolean',
    msg: "提交成功.",
    count: 1000,
    data: {}
  },
  'POST /demo/table/user': {
    code: 0,
    msg: "xxx",
    count: 1000,
    'data|20': [{
      'id|+1': 1,
      username: '@name',
      sex: '@boolean',
      city: '@city',
      sign: '@csentence',
      experience: '@integer',
      score: '@integer',
      classify: '@word',
      wealth: '@integer',
      auth: '@boolean'
    }]
  },
  'POST /api/getmenus': [{
    id: 1,
    title: '表格',
    path: '#/user/table',
    icon: '&#xe631;',
    pid: 0,
    children: []
  }, {
    id: 1,
    title: '表格一',
    path: '#/user/table2',
    icon: '&#xe631;',
    pid: 0,
    children: []
  }, {
    id: 2,
    title: '一级菜单2',
    path: 'javascript:;',
    icon: '&#xe631;',
    pid: 0,
    children: [{
      id: 21,
      title: '表单',
      path: '#/user/form',
      icon: '&#xe620;',
      pid: 2,
      children: []
    }, {
      id: 22,
      title: '二级菜单二',
      path: '#/user/as',
      icon: '&#xe620;',
      pid: 2,
      children: [{
        id: 222,
        title: '百度一下',
        path: 'https://www.baidu.com',
        blank: true,
        icon: '&#xe62e;',
        pid: 22
      }]
    }, {
      id: 23,
      title: '二级菜单三',
      path: '#/user/aa',
      icon: '&#xe620;',
      pid: 2,
      children: []
    }]
  }, {
    id: 3,
    title: '数据表格3',
    path: '#/user/table3',
    icon: '&#xe631;',
    pid: 0,
    children: []
  }, {
    id: 4,
    title: 'API文档',
    path: '#/user/scq',
    icon: '&#xe631;',
    pid: 0,
    open: true,
    children: [{
      id: 33,
      title: '拦截器(Mockjs)',
      path: '#/docs/mockjs',
      icon: '&#xe60a;',
      pid: 4
    }, {
      id: 34,
      title: '左侧菜单(Menu)',
      path: '#/docs/menu',
      icon: '&#xe60a;',
      pid: 4
    }, {
      id: 35,
      title: '路由配置(Route)',
      path: '#/docs/route',
      icon: '&#xe60a;',
      pid: 4
    }, {
      id: 36,
      title: '选项卡(Tabs)',
      path: '#/docs/tabs',
      icon: '&#xe60a;',
      pid: 4
    }, {
      id: 37,
      title: '工具包(Utils)',
      path: '#/docs/utils',
      icon: '&#xe60a;',
      pid: 4
    }, {
      id: 38,
      title: '组件(Component)',
      path: 'javascript:;',
      icon: '&#xe60a;',
      pid: 4,
      open: true,
      children: [{
        id: 381,
        title: '导航栏(Nav)',
        path: '#/docs/component/nav',
        icon: '&#xe60a;',
        pid: 38
      }]
    }]
  }]
};