$(function () {  
    userInfo()
    // 获取用户基本信息，渲染到表单中
    function userInfo() {  
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function (res) {
                // console.log(res);
                // 判断获取用户基本信息是否成功
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                // layui.layer.msg('res.message')

                layui.form.val('form-userInfo',res.data)
            }
        });
    }

    // 设置自定义表单校验
    layui.form.verify({
        nickname: function(value){
            if (value.length > 6){
                return "昵称的长度必须在1~6位字符中间"
            }
        }
    })

    // 给重置按钮注册点击事件
    $('#btn-reset').click(function (e) { 
        e.preventDefault();
        userInfo()
    });
    
    // 给form表单注册submit事件，并渲染用户头像
    $('.layui-form').submit(function (e) { 
        // console.log(123);
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // 判断是否修改成功
                if (res.status !== 0){
                    return layui.layer.msg('修改用户信息失败！')
                }

                layui.layer.msg('修改用户信息成功！')

                // 调用父页面中的方法，重新渲染用户头像
                window.parent.getUserInfo()
            }
        });
    });
})