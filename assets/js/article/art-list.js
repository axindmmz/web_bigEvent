$(function () {  
    // 定义查询参数对象
    var data = {
        pagenum: 1,  //页码值，默认请求第一页的数据
        pagesize: 5, //每页显示几条数据
        cate_id: '',   // 文章分类的id
        state: ''  //文章分类的状态
    }

    getArtDataList()
    // 获取文章数据列表
    function getArtDataList(){
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }
                // layui.layer.msg(res.message)
                var htmlStr = template('artList',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        });
    }

    // 定义补零函数
    function Zero(n) { 
        return n >= 10 ? n : "0" + n
     }
    // 添加时间过滤器
    template.defaults.imports.timeFormat = function (date) {
        // getFullYear()    获取当年
        // getMonth()      获取当月（0 - 11）月份+1
        // getDate()         获取当天日期
        // getDay()          获取星期几（周日0 - 周六6）
        // getHours()      获取当前小时
        // getMinutes()   获取当前分钟
        // getSeconds()  获取当前秒数
  
        var date = new Date()
        var y = date.getFullYear()
        var m = Zero(date.getMonth() + 1)
        var d = Zero(date.getDate())

        var hh = Zero(date.getHours())
        var mm = Zero(date.getMinutes())
        var ss = Zero(date.getSeconds())
        
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    getList()
    // 获取文章分类列表渲染到下拉菜单中
    function getList(){
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0){
                    return layui.layer.msg(res.message)
                }

                // 获取列表成功后把数据渲染到下拉菜单中
                var htmlStr = template('cateId',res)
                $('[name=cate_id]').html(htmlStr)

                // 需要通过layui 手动重新渲染
                layui.form.render()
            }
        });
    }

    // 给筛选按钮注册submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        // 先获取表单中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 赋值给data参数对象
        data.cate_id = cate_id
        data.state = state

        // 再重新渲染一下文章数据列表
        getArtDataList()
    });

    // 编辑功能的实现
    $('body').on('click','#edit', function () {
        // 存储当前数据的id
        var id = $(this).attr('data-id')
        localStorage.setItem('id',id)

        // var indexEdit = layui.layer.open({
        //     title: '修改文章内容',
        //     type: 2,
        //     area: ['1200px','600px'],
        //     content: '/article/art-listEdit.html'
        // })

        location.href = '/article/art-listEdit.html'
    });
    // 删除功能的实现
    $('body').on('click','.del', function () {

        // 获取当前页面中删除按钮的个数
        var num = $('.del').length
        console.log(num);
        // console.log(123);
        var id = $(this).attr('data-id')

        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type: "get",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0){
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)

                    // 判断当前 页面的num 值是否等于1  如果等于 1 则删除成功后 当前页面上没有数据需要-1
                    // 还需要判断当前页码数是否为1 如果为1 则不需要-1
                    if ( num === 1){
                        data.pagenum = data.pagenum == 1 ? 1 : data.pagenum - 1
                    }
                    getArtDataList()
                }
            });
            layer.close(index);
          });
    });

    // 渲染分页
    function renderPage(total) {  
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            curr: data.pagenum,
            limit: data.pagesize,
            layout: ['count','limit','prev', 'page', 'next','skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                
                data.pagenum = obj.curr
                data.pagesize = obj.limit
                //首次不执行
                if(!first){
                  //do something
                  getArtDataList()
                }
              }
        });
    }
})