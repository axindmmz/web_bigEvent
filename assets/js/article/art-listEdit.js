$(function () {  


    
    getCate()
    // 获取文章分类列表 下拉菜单
    function getCate() {  
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }

                var htmlStr = template('cateList',res)
                $('[name=cate_id]').html(htmlStr)

                layui.form.render()
                getData()
            }
        });
    }

    var id = localStorage.getItem('id')
  
    var $image = null
    // 根据id 获取当前数据的具体内容渲染到form表单中
    function getData(){
        $.ajax({
            type: "get",
            url: "/my/article/" + id,
            success: function (res) {
                console.log(res);
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                layui.form.val('form-edit',res.data)

                // 初始化富文本编辑器
                initEditor()

                // 1. 回显图片
                $image = $('#image').attr("src", "http://ajax.frontend.itheima.net" + res.data.cover_img);
                        
                // 2. 裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview'
                }
                
                // 3. 初始化裁剪区域
                $image.cropper(options)

            }
        });
    }

    // 给退出按钮注册点击事件
    $('#back').on('click', function () {
        location.href = '/article/art-list.html'
    });
   
     // 给选择封面注册点击事件
     $('#choose').on('click', function () {
        $('#file').click()
    });

    // 监听 file 文本选择框的change事件
    $('#file').on('change', function (e) {
        var file = e.target.files
        // console.log(file);
        // 判断是否选择了文件
        if (file.length === 0) return
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 给表单注册submit事件
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()
        // console.log(123);
        // console.log($(this)[0]);
         // 基于form表单创建formData对象
         var fd = new FormData($(this)[0])
 
         var data = layui.form.val('form-edit')
         console.log(data);

        fd.forEach(function (item) {  
            console.log(item);
        })
        
 
         $image
             .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                 width: 400,
                 height: 280
             })
             .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                 // 得到文件对象后，进行后续的操作
 
                 // 将文件传入fd
                 fd.append('cover_img',blob)
                 fd.append('Id',id)
                 publishArt(fd)
             })
    });

    
    // 定义发布文章的函数
    function publishArt(fd){
        // 发送ajax请求
        $.ajax({
          type: "post",
          url: "/my/article/edit",
          data: fd,
          // 注意：如果向服务器提交的是 FormData 格式的数据，
          // 必须添加以下两个配置项
          contentType: false,
          processData: false,
          success: function (res) {
              console.log(res);
              if (res.status !== 0){
                  return layui.layer.msg(res.message)
              }
              layui.layer.msg(res.message)
       
            location.href = '/article/art-list.html'
            
          }
      });
  }
  
})