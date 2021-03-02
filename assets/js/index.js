$(function () {  
    //获取用户信息
    getUserInfo()

    // 点击退出，返回login登录界面
    $('#back').on('click',function () {  
        // console.log(123);
        layer.confirm('是否确认退出？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.清空本地的请求头
            localStorage.removeItem('token')
            // 2.返回登录页面
            location.href = '/login.html'
            layer.close(index);
          });
    })
})

// 获取用户信息的函数
function getUserInfo(){
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        // 请求头配置对象
        // headers:{ 
        //     Authorization:localStorage.getItem('token')
        // },
        success: function (res) {
            // console.log(res);
            // 判断用户身份验证
            if (res.status !== 0 ){
                return layui.layer.msg(res.message)
            }
            // layui.layer.msg('身份验证成功')
            // 渲染用户头像
            renderAvatar(res.data)
        },

        // 在调用权限接口的时候，指定complete回调函数
        // 不论成功还是失败，最终都睡调用complete回调函数
        // complete: function(res){
        //     console.log(res);
        //     // 在complete回调函数中，使用res.responseJSON获取服务器返回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1.清空本地的请求头
        //         localStorage.removeItem('token')
        //         // 2.返回登录页面
        //         location.href = '/login.html'
        //     }
        // }
    });
}

function renderAvatar(name) { 
    // 先获取用户的用户名
    var uname = name.nickname || name.username
    // console.log(uname);
    // 渲染页面
    $('.welcome').html('欢迎&nbsp;&nbsp' + uname)

    // 判断按需显示头像
    if (name.user_pic  !== null){
        // 如果不显示为空，则显示图片头像   
        $('.layui-nav-img').attr('src',name.user_pic).show()
        $('.avatar').hide()
    }else {
         // 如果显示为空，则显示文本头像
         $('.layui-nav-img').hide()
         $('.avatar').html(uname[0].toUpperCase()).show()
    }
   

}