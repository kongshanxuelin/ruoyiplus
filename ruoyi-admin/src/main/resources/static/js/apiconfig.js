layui.define(function (exports) {

  //const baseUrl = 'http://localhost:9090/api/';  
  const baseUrl = '/api/';
  const apiconfig = {
    user: {
      login: baseUrl + 'user/login',
      getUsers: baseUrl + 'user/getusers',
      getMenus: baseUrl + 'getmenus',
    }
  };
  exports('apiconfig', apiconfig);
});