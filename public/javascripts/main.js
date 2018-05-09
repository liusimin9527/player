$(document).ready(function () {
  var time = new Date();
  var year = time.getFullYear();
  var musics = [];
  var objWin;

  /* 设置样式 */
  $('.song_item:even').css("background", "#fbfbfb");
  // 底部时间
  $('.footer_time').html(year);
  //
  $('.page_item li').click(function () {
    $(this).find('a').attr('href', location.href.split('index')[0]+'index='+($(this).index()));
  });
  // 上一页
  $('.js_first').click(function () {
    var index = parseInt(location.href.split('index=')[1]);

    $(this).find('a').attr('href', location.href.split('index')[0]+'index=' + (index-1));
  });
  // 下一页
  $('.js_end').click(function () {
    var index = parseInt(location.href.split('index=')[1]);

    $(this).find('a').attr('href', location.href.split('index')[0]+'index=' + (index+1));
  });
  // 手机号码检验
  $('.telephone').blur(function () {
    var telephone = $('.telephone').val(),
        reg = /^1[3|4|5|8][0-9]\d{4,8}$/;

    if (!reg.test(telephone)) {
      $('.telephone_tip').html("请输入正确的手机号码");
    } else {
      $('.telephone_tip').html("");
    }
  });
  // 发送验证码
  $('.js_send').click(function () {
    clearInterval(timer);
    i = 20;
    var timer = setInterval(function () {
      i--;
      $('.sendVer').html("重新发送("+ i +"s)").attr("disabled", true);

      if (i == 0) {
        clearInterval(timer);
        $('.sendVer').attr("disabled", false).html("发送验证码");
      }
    }, 1000);
  });
  // 设置用户信息
  if (localStorage.getItem('name')) {
    $('.header_content').hide();  // 隐藏注册和登录按钮
    $('.opt').show();             // 显示用户信息

    $('.header_right_name').html(localStorage.getItem('name'));  // 用户名
    $('.userImg').attr('src', '../'+localStorage.getItem('uImg'));  // 显示用户头像
  }
  // 注册
  $('.js_register').click(function () {
    var name = $('.register_name').val(),
        password = $('.register_pass').val(),
        telephone = $('.telephone').val(),
        data = {
          name: name,
          password: password,
          telephone: telephone
        };

    if (!telephone.length) {
      $('.register_tip').html('手机号不能为空');
    } else {
      $.ajax({
        url: '/register',
        type: 'POST',
        data: data,
        success: function (msg) {
          if (msg == '该手机号码已被注册') {
            $('.register_tip').html('该手机号码已被注册，请登录');
          }
          if (msg == '注册成功') {
            alert('注册成功');
            location.href = '/login';
          }
        },
        error: function () {
          location.href = '/register';
        }
      });
    }
  });
  // 登录
  $('.js_login').click(function () {
    $.ajax({
      url: '/login',
      type: 'POST',
      data: {
        name: $('.login_name').val(),
        password: $('.login_pass').val()
      },
      success: function (data) {
        if (data.msg == 'success') {
          localStorage.setItem('uid', data.uid);
          localStorage.setItem('name', data.name);
          localStorage.setItem('uImg', data.uImg);

          window.location.href = document.referrer;  // 返回上一页并刷新
        }
        if (data.msg == 'error') {
          $('.login_tip').html("用户名或密码不正确");
          // 清空表单
          $('.login_name').val('');
          $('.login_pass').val('');
        }
      }
    });
  });
  // 退出登录
  $('.logoutBtn').click(function () {
    localStorage.removeItem('uid');
    localStorage.removeItem('name');

    location.reload();  // 刷新页面
  });
  // 忘记密码
  $('.js_forget').click(function () {
    $.ajax({
      url: '/forget',
      type: 'POST',
      data: {
        telephone: $('.forget_tel').val(),
        verification: $('.forget_val').val()
      },
      success: function (data) {
        if (data.msg == 'success') {
          localStorage.setItem('uid', data.uid);
          localStorage.setItem('name', data.name);
          localStorage.setItem('uImg', data.uImg);

          location.href = '/';
        } else {
          $('.forget_tip').html("手机号码或验证码错误");
        }
      }
    });
  });
  // 查找
  $('.js_search').click(function () {
    var keyword = $('.search_input').val();

    $.ajax({
      url: 'searching?keyword=' + keyword,
      type: 'GET',
      success: function (data) {
        if (data == '歌曲') {
          location.href="/result?musicName=" + keyword;
        } else if (data == '歌手') {
          location.href="/singerList/singer?singerName=" + keyword;
        }
      }
    });
  });
  // 排行榜
  $('.chart_list').each(function () {
    var keyword = location.href;
    var _href = $(this).attr('href');

    if (keyword == _href) {
      $('.chart_list').removeClass('chart_list--current');
      $(this).addClass('chart_list--current');
    }
  });
  // 关注歌手
  $('.js_att').click(function () {
    text = $('.fans').html();
    $.ajax({
      url: '/attention?singerName=' + $('.singer_name').html(),
      type: 'GET',
      success: function (data) {
        if (data == 'success') {
          $('.fans').html(parseInt(text)+1);
          $('.attention').hide();
          $('.cancel').show();
        }
      }
    });
  });
  // 取消关注
  $('.js_cancle').click(function () {
    text = $('.fans').html();
    $.ajax({
      url: '/cancel?singerName=' + $('.singer_name').html(),
      type: 'GET',
      success: function (data) {
        if (data == 'success') {
          $('.fans').html(parseInt(text)-1);
          $('.attention').show();
          $('.cancel').hide();
        }
      }
    });
  });
  // 热门歌曲播放
  $('.hot_song__list li').click(function () {
    var musicName = $(this).find('.musicName').html();
    var singerName = $(this).find('.singerName').html();
    var target = 'http://localhost:3000/player?musicName=' + musicName + '&singerName=' + singerName;
    var data = {
      musicName: musicName,
      singerName: singerName
    };

    musics.push(data);
    localStorage.setItem("index", musics.length-1);
    localStorage.setItem("musics", JSON.stringify(musics));

    if (objWin == null || objWin.closed) {  // 打开页面
      objWin = window.open(target);
    } else {
      objWin.location.replace(target);
    }
  });
  // 评论
  $('.music_name').click(function () {
    var musicName = $(this).html();
    var singerName = $(this).parent().siblings('.song_singerName').html();

    location.href = 'http://localhost:3000/comment?musicName=' + musicName + '&singerName=' + singerName;
  });
  $('.bottom_right_comment').click(function () {
    var song = $(this).parents().find('.songName').html();
    var musicName = song.split('-')[0];
    var singerName = song.split('-')[1];

    window.open('http://localhost:3000/comment?musicName=' + musicName + '&singerName='+singerName);
  });
  $('.song_list .play').click(function () {
    var musicName = $(this).parent().siblings('.song_songName').children('.music_name').html();
    var singerName = $(this).parent().siblings('.song_singerName').html();
    var target = 'http://localhost:3000/player?musicName=' + musicName + '&singerName=' + singerName;
    var data = {
      musicName: musicName,
      singerName: singerName
    };

    musics.push(data);
    localStorage.setItem("index", musics.length-1);
    localStorage.setItem("musics", JSON.stringify(musics));

    if (objWin == null || objWin.closed) {  // 打开页面
      objWin = window.open(target);
    } else {
      objWin.location.replace(target);
    }
  });
});
