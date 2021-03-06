$(function () {  

    // 给添加类别注册点击事件
    $('#add-sort').on('click', function () {
        var indexAdd = layui.layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px','250px'],
            content: $('#addAtrForm').html()
        })

        $('body').on('submit','#form-add',function (e) { 
            e.preventDefault();
            
            //新增文章分类
            $.ajax({
                type: "post",
                url: "/my/article/addcates",
                data: $(this).serialize(),
                success: function (res) {
                    console.log(res);
                    // 判断文章类别是否添加成功
                    if (res.status !== 0){
                        return layui.layer.msg(res.message)
                    }

                    layui.layer.msg(res.message)
                    getArtSortList()
                    layui.layer.close(indexAdd)
                }
            });
        });
    });

    getArtSortList()
    // 获取文章分类列表
    function getArtSortList(){
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                //把template返回的模板字符串设置到页面容器中
            }
        });
    }

    // 给编辑按钮注册点击事件，修改当前数据的内容
    $('body').on('click','#edit', function () {
        var indexEdit = layui.layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px','250px'],
            content: $('#EditAtrForm').html()
        })

        // 获取当前元素的id 
        var id = $(this).attr('data-id')
        // console.log(id);
        // 发送ajax请求
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function (res) {
               console.log(res); 
                // 判断获取文章分类列表是否成功
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                // layui.layer.msg(res.message)
                layui.form.val('form-edit',res.data)
            }
        });

         // 给确认修改注册submit事件
        $('body').on('submit','#form-edit', function (e) {
            e.preventDefault()
            // console.log(123);
            $.ajax({
                type: "post",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0){
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)
                    layui.layer.close(indexEdit)
                    getArtSortList()
                }
            });
        });
    });

    // 给删除按钮注册点击事件
    $('body').on('click', '#del',function () {
        // console.log(123);
        var id = $(this).attr('data-id')

        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type: "get",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0){
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)
                    getArtSortList()
                }
            });
            layer.close(index);
          });
  
    });
   
})