// 每次调用$.get()、$.post()或$.ajax()时都会先调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {  
    console.log(options);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})