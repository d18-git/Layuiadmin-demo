/**

 @Name：layuiAdmin 内容系统
 @Author：star1029
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(['table', 'form'], function (exports) {
  var $ = layui.$
    , table = layui.table
    , form = layui.form;

  //文章管理
  table.render({
    elem: '#LAY-app-content-list'
    , url: layui.setter.base + 'json/content/list.js' //模拟接口
    , cols: [[
      { type: 'checkbox', fixed: 'left' }
      , { field: 'id', width: 100, title: '文章ID', sort: true }
      , {
        field: 'title', title: '文章标题', minWidth: 500, templet: function (d) {
          return '<a href="#" style="color:#1e9fff" lay-event="edit">' + d.title + '</a>'
        }
      }
      , { field: 'label', title: '文章标签', width: '8%', align: 'center' }
      , { field: 'browse', title: '浏览', sort: true, width: '8%', align: 'center' }
      , {
        field: 'thumbnail', title: '缩略图', align: 'center', templet: function (d) {
          if (!d.thumbnail) {
            return '<button type="button" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="thumbnail">上传</button>'
          } else {
            return '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event="thumbnail">查看</button>'
          }
        }
      }
      , { field: 'uploadtime', title: '上传时间', sort: true }
      , { field: 'status', title: '发布状态', templet: '#buttonTpl', minWidth: 80, align: 'center' }
      , { title: '操作', minWidth: 150, align: 'center', fixed: 'right', toolbar: '#table-content-list' }
    ]]
    , page: true
    , limit: 1
    , limits: [10, 15, 20, 25, 30]
    , text: '对不起，加载出现异常！'
  });

  //监听工具条
  table.on('tool(LAY-app-content-list)', function (obj) {
    var data = obj.data;
    if (obj.event === 'del') {
      layer.confirm('确定删除此文章？', function (index) {
        obj.del();
        layer.close(index);
      });
    } else if (obj.event === 'edit') {
      layer.open({
        type: 2
        , title: ['编辑文章', 'color: #fff; background-color: #009f95;']
        , content: '../../../views/app/content/listform.html?id=' + data.id
        , maxmin: true
        , area: ['80%', '90%']
        , btn: ['确定', '取消']
        , yes: function (index, layero) {
          var iframeWindow = window['layui-layer-iframe' + index]
            , submit = layero.find('iframe').contents().find("#layuiadmin-app-form-edit");

          //监听提交
          iframeWindow.layui.form.on('submit(layuiadmin-app-form-edit)', function (data) {
            var field = data.field; //获取提交的字段

            //提交 Ajax 成功后，静态更新表格中的数据
            //$.ajax({});              
            obj.update({
              label: field.label
              , title: field.title
              , author: field.author
              , status: field.status
            }); //数据更新

            form.render();
            layer.close(index); //关闭弹层
          });

          submit.trigger('click');
        }
      });

    } else if (obj.event === 'thumbnail') {
      layer.open({
        type: 2
        , title: ['缩略图', 'color: #fff; background-color: #009f95;']
        , content: '../../../views/app/content/thumbnail.html?id=' + data.id
        , maxmin: true
        , area: ['80%', '90%']
        , btn: ['确定', '取消']
        , yes: function (index, layero) {
          var iframeWindow = window['layui-layer-iframe' + index]
            , submit = layero.find('iframe').contents().find("#layuiadmin-app-form-upload");

          //监听提交
          iframeWindow.layui.form.on('submit(layuiadmin-app-form-upload)', function (data) {
            var field = data.field; //获取提交的字段

            //提交 Ajax 成功后，静态更新表格中的数据
            //$.ajax({});              
            obj.update({
              label: field.label
              , title: field.title
              , author: field.author
              , status: field.status
            }); //数据更新

            form.render();
            layer.close(index); //关闭弹层
          });

          submit.trigger('click');
        }
      })
    }
  });

  //分类管理
  table.render({
    elem: '#LAY-app-content-tags'
    , url: layui.setter.base + 'json/content/tags.js' //模拟接口
    , cols: [[
      { type: 'numbers', fixed: 'left' }
      , { field: 'id', width: 100, title: 'ID', sort: true }
      , { field: 'tags', title: '分类名', minWidth: 100 }
      , { title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#layuiadmin-app-cont-tagsbar' }
    ]]
    , text: '对不起，加载出现异常！'
  });

  //监听工具条
  table.on('tool(LAY-app-content-tags)', function (obj) {
    var data = obj.data;
    if (obj.event === 'del') {
      layer.confirm('确定删除此分类？', function (index) {
        obj.del();
        layer.close(index);
      });
    } else if (obj.event === 'edit') {
      var tr = $(obj.tr);
      layer.open({
        type: 2
        , title: '编辑分类'
        , content: '../../../views/app/content/tagsform.html?id=' + data.id
        , area: ['80%', '90%']
        , btn: ['确定', '取消']
        , yes: function (index, layero) {
          //获取iframe元素的值
          var othis = layero.find('iframe').contents().find("#layuiadmin-app-form-tags")
            , tags = othis.find('input[name="tags"]').val();

          if (!tags.replace(/\s/g, '')) return;

          obj.update({
            tags: tags
          });
          layer.close(index);
        }
        , success: function (layero, index) {
          //给iframe元素赋值
          var othis = layero.find('iframe').contents().find("#layuiadmin-app-form-tags").click();
          othis.find('input[name="tags"]').val(data.tags);
        }
      });
    }
  });

  //评论管理
  table.render({
    elem: '#LAY-app-content-comm'
    , url: layui.setter.base + 'json/content/comment.js' //模拟接口
    , cols: [[
      { type: 'checkbox', fixed: 'left' }
      , { field: 'id', width: 100, title: 'ID', sort: true }
      , { field: 'reviewers', title: '评论者', minWidth: 100 }
      , { field: 'content', title: '评论内容', minWidth: 100 }
      , { field: 'commtime', title: '评论时间', minWidth: 100, sort: true }
      , { title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-content-com' }
    ]]
    , page: true
    , limit: 10
    , limits: [10, 15, 20, 25, 30]
    , text: '对不起，加载出现异常！'
  });

  //监听工具条
  table.on('tool(LAY-app-content-comm)', function (obj) {
    var data = obj.data;
    if (obj.event === 'del') {
      layer.confirm('确定删除此条评论？', function (index) {
        obj.del();
        layer.close(index);
      });
    } else if (obj.event === 'edit') {
      layer.open({
        type: 2
        , title: '编辑评论'
        , content: '../../../views/app/content/contform.html'
        , area: ['450px', '300px']
        , btn: ['确定', '取消']
        , yes: function (index, layero) {
          var iframeWindow = window['layui-layer-iframe' + index]
            , submitID = 'layuiadmin-app-comm-submit'
            , submit = layero.find('iframe').contents().find('#' + submitID);

          //监听提交
          iframeWindow.layui.form.on('submit(' + submitID + ')', function (data) {
            var field = data.field; //获取提交的字段

            //提交 Ajax 成功后，静态更新表格中的数据
            //$.ajax({});
            table.reload('LAY-app-content-comm'); //数据刷新
            layer.close(index); //关闭弹层
          });

          submit.trigger('click');
        }
        , success: function (layero, index) {

        }
      });
    }
  });

  exports('contlist', {})
});
