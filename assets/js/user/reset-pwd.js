$(function () {  
    // 设置自定义表单校验
    layui.form.verify({
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
          ],
        // 判断新密码和旧密码是否一样
        samePwd: function (value) { 
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能一样！'
            }
        },
        rePwd: function (value) {  
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').submit(function (e) { 
        e.preventDefault();

        $.ajax({
            type: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                // 判断修改密码是否成功
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                // layui.layer.msg(res.message)
                // layer.alert('更改密码成功，请重新登录！', {icon:8});
                layer.alert('更改密码成功，请重新登录！',{icon:8}, function(index){
                    //do something
                    // 1.清空本地的请求头
                    localStorage.removeItem('token')
                    // 2.返回登录页面
                    window.parent.location.href = '/login.html'
                    layer.close(index);
                  }); 

                
            }
        });
    });


})