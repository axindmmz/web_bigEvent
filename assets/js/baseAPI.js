// 每次调用$.get()、$.post()或$.ajax()时都会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {  
    // console.log(options);
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为有权限的接口设置请求头
    if (options.url.indexOf('/my/') !== -1){
        options.headers = {
            Authorization:localStorage.getItem('token')
        }
    }

    // 在调用权限接口的时候，指定complete回调函数
    // 不论成功还是失败，最终都睡调用complete回调函数
    options.complete = function(res){
        console.log(res);
        // 在complete回调函数中，使用res.responseJSON获取服务器返回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            // 1.清空本地的请求头
            localStorage.removeItem('token')
            // 2.返回注册和登录页面
            location.href = '/login.html'
        }
    }
})