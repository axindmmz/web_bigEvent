$(function(){
    //给注册账号添加点击事件
    $('.link-reg').on('click',function(){
        $('.reg-box').show()
        $('.login-box').hide()
    })
    // 给去登陆添加点击事件
    $('.link-login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义密码框的校验规则
    layui.form.verify({
        password: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        
        // 效验确认密码规则  
        repassword: function (value){
            var pwd = $('.reg-box [name=password]').val()
            if ( pwd !== value ){
                return '两次密码不一致！'
            }
        }
    })

    // 事件  获取  展示
    // 给注册reg-form表单监听提交事件
    $('.reg-form').on('submit',function (e) {  
        e.preventDefault()
        // 使用ajax发送提交请求
        var data = {
            username: $('.reg-form [name=username]').val(),
            password: $('.reg-form [name=password]').val()
        }
        $.ajax({
            type: "post",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('注册成功，请登录！')

                $('.link-login').click()
            }
        });
    })


    // 给登录login-form表单监听提交事件
    $('.login-form').on('submit',function (e) {  
        e.preventDefault()

        $.ajax({
            type: "post",
            url: "/api/login",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0){
                    return layui.layer.msg('登录失败！')
                }
                layui.layer.msg('登录成功！')

                localStorage.setItem('token',res.token)

                location.href = '/index.html'
            }
        });
    })
})