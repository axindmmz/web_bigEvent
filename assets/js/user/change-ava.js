$(function () {  
      // 1.1 获取裁剪区域的 DOM 元素
        var $image = $('#image')
        // 1.2 配置选项
        const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }

        // 1.3 创建裁剪区域
        $image.cropper(options)


        // 给文件选择框注册change事件
        $('#file').on('change', function (e) {
            var fileList = e.target.files
            // console.log(fileList);
            // 判断是否选择了图片
            if (fileList.length === 0){
                return layui.layer.msg('未选择图片')
            }
            var file = e.target.files[0]
            console.log(file);
            // 根据文件的选择，创建一个对应的URL地址
            var newImgURL = URL.createObjectURL(file)
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        });

        // 给上传按钮注册点击事件
        $('#upload').on('click', function () {
            $('#file').click()
        });

        // 给确认按钮注册点击事件
        $('#sure').click(function () { 
            // 获取剪裁后的图片，并将图片转换为base64格式的字符串
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            // 发送ajax请求
            $.ajax({
                type: "post",
                url: "/my/update/avatar",
                data: {
                    avatar: dataURL
                },
                success: function (res) {
                    console.log(res);
                    // 判断头像是否上传成功
                    if (res.status !== 0){
                        return layui.layer.msg(msg.message)
                    }
                    layui.layer.msg('头像上传成功！')

                    // 调用父页面中的方法，重新渲染用户头像
                     window.parent.getUserInfo()
                }
            });
            
        });
})