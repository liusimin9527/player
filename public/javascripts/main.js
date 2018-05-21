$(document).ready(function () {
  var time = new Date();
  var year = time.getFullYear();
  var musics = [];
  var objWin;
  var index = parseInt(location.href.split('index=')[1]);
  var user = JSON.parse(localStorage.getItem('user'));
  var isClick = false;

  /* 设置样式 */
  // 显示用户信息
  if (user) {
    var attens = user.attention.split(',');

    for (var i = 0; i < attens.length; i++) {   // 关注
      if (attens.indexOf($('.singer_name').html()) != -1) {
        $('.attention').hide();
        $('.cancel').show();
      } else {
        $('.attention').show();
        $('.cancel').hide();
      }
    }

    $('.header_content').hide();  // 隐藏注册和登录按钮
    $('.opt').show();             // 显示用户信息
    $('.header_right_name').html(user.uName);  // 用户名
    $('.userImg').attr('src', '../' + user.uImg);  // 显示用户头像
  }
  // 歌曲列表的样式
  $('.song_item:even').css("background", "#fbfbfb");
  // 显示底部时间
  $('.footer_time').html(year);
  // 分页页码样式
  $('.page_item li').each(function () {
    if ($(this).index() == parseInt(location.href.split('index=')[1])) {
      $('.page_item li').find('a').removeClass('page_link--current');
      $(this).find('a').addClass('page_link--current');
    }
  });
  // 经过歌曲名时
  $('.song_songName').on({
    mouseenter: function () {
      $(this).children('.song_icon').children().show();
    },
    mouseleave: function () {
      $(this).children('.song_icon').children().hide();
    }
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
  // 排行榜
  $('.chart_list').each(function () {
    var keyword = location.href;
    var _href = $(this).attr('href');

    if (keyword == _href) {
      $('.chart_list').removeClass('chart_list--current');
      $(this).addClass('chart_list--current');
    }
  });
  // 显示上一页
  if (parseInt(location.href.split('index=')[1]) == 0) {
    $('.js_first').hide();
  } else {
    $('.js_first').show();
  }
  // 显示下一页
  if (parseInt(location.href.split('index=')[1]) == ($('.page_item li').length - 1)) {
    $('.js_end').hide();
  } else {
    $('.js_end').show();
  }
  $('.js_spread').click(function () {
    if (!isClick) {
      $('.spread_content').show();
      $('.spread').html("收起");
      isClick = true;
    } else {
      $('.spread_content').hide();
      $('.spread').html("展开");
      isClick = false;
    }
  });
  // 歌手引导
  $('.singer_tag__item').each(function () {
    var keyword = location.href.split('index')[0];
    var _href = $(this).attr('href').split('index')[0];

    if (keyword == _href) {
      $('.singer_tag__item').removeClass('singer_tag__item--select');
      $(this).addClass('singer_tag__item--select');
    }
  });
  // 用户名检测 字母开头，允许 5-16 字节，允许字母数字下划线
  $('.register_name').blur(function () {
    var name = $('.register_name').val(),
        reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;

    if (!reg.test(name)) {
      $('.name_tip').html("请输入以字母开头的5-16个字符");
    } else {
      $('.name_tip').html("");
    }
  });
  // 密码检测 以字母开头，长度在 6~18 之间，只能包含字母、数字和下划线
  $('.register_pass').blur(function () {
    var password = $('.register_pass').val(),
        reg = /^[a-zA-Z]\w{5,17}$/;

    if (!reg.test(password)) {
      $('.pass_tip').html("请输入以字母开头的6-18个字符");
    } else {
      $('.pass_tip').html("");
    }
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
  /* 与后台交互 */
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
          var user = {
            uId: data.uid,
            uName: data.name,
            uImg: data.uImg,
            attention: data.attention
          };
          localStorage.setItem('user', JSON.stringify(user));
          window.location.href = document.referrer;  // 返回上一页并刷新
        } else if (data.msg == 'error') {
          $('.login_tip').html("用户名或密码不正确");
          $('.login_name').val('');  // 清空表单
          $('.login_pass').val('');
        }
      }
    });
  });
  // 退出登录
  $('.logoutBtn').click(function () {
    localStorage.removeItem('user');
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
        var user = {
          uId: data.uid,
          uName: data.name,
          uImg: data.uImg,
          attention: data.attention
        };

        if (data.msg == 'success') {
          localStorage.setItem('user', JSON.stringify(user));
          location.href = '/';
        } else {
          $('.forget_tip').html("手机号码或验证码错误");
        }
      }
    });
  });
  // 分页页码
  $('.page_item li').click(function () {
    $(this).find('a').attr('href', location.href.split('index')[0]+'index='+($(this).index()));
  });
  // 查找
  $('.js_search').click(function () {
    var keyword = $('.search_input').val();

    $.ajax({
      url: 'http://localhost:3000/searching?keyword=' + keyword,
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
  // 关注歌手
  $('.js_att').click(function () {
    var singerName = $('.singer_name').html();
    var user = JSON.parse(localStorage.getItem('user'));

    if (user.uName == null) {
      alert("请先登陆");
    } else {
      user.attention += singerName + ',';

      var data = {
        singerName: singerName,
        attention: user.attention,
        uid: user.uId
      };

      $.ajax({
        url: '/attention',
        type: 'POST',
        data: data,
        success: function (data) {
          if (data == 'success') {
            localStorage.setItem('user', JSON.stringify(user));
            location.reload();
          }
        }
      });
    }
  });
  // 取消关注
  $('.js_cancle').click(function () {
    var attens = user.attention.split(',');
    var singerName = $('.singer_name').html();
    var str = '';
    var data = {
      singerName: singerName,
      attention: str,
      uid: user.uId
    };

    for (var i = 0; i < attens.length - 1; i++) {
      if (attens[i] != singerName) {
        str += attens[i] + ',';
      }
    }

    user.attention = str;

    $.ajax({
      url: '/cancel',
      type: 'POST',
      data: data,
      success: function (data) {
        if (data == 'success') {
          localStorage.setItem('user', JSON.stringify(user));
          location.reload();
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
  // 添加至我喜欢
  $('.js_append').click(function () {
    var musicName = $(this).parent().siblings('.music_name').html();
    var singerName = $(this).parent().parent().siblings('.song_singerName').children('a').html();
    var timer = setTimeout(function () {
      $('.success').hide();
    }, 2000);

    // 判断用户是否已经登录
    if (user == null) {
      $('.success').html('请先登录').show();
    } else {
      $.ajax({
        url: 'http://localhost:3000/append',
        type: 'POST',
        data: {
          uId: user.uId,
          musicName: musicName,
          singerName: singerName
        },
        success: function (data) {
          $('.success').html('已添加至我喜欢').show();
        }
      });
    }
  });
  // 添加至下载列表
  $('.js_download').click(function () {
    var musicName = $(this).parent().siblings('.music_name').html();
    var singerName = $(this).parent().parent().siblings('.song_singerName').children('a').html();
    var timer = setTimeout(function () {
      $('.success').hide();
    }, 2000);

    if (user == null) {
      $('.js_download').attr('href', 'javascript:;');
      $('.success').html('请先登录').show();
    } else {
      $.ajax({
        url: 'http://localhost:3000/download',
        type: 'POST',
        data: {
          uId: user.uId,
          musicName: musicName,
          singerName: singerName
        },
        success: function (data) {
          if (data == 'success') {
            $('.success').html('已添加至下载列表').show();
          } else if (data == 'default') {
            $('.js_download').attr('href', 'javascript:;');
            $('.success').html('已下载').show();
          }
        }
      });
    }
  });
  // 删除歌曲
  $('.js_delete').click(function (){
    var user = JSON.parse(localStorage.getItem('user'));
    var musicName = $(this).parent().siblings('.music_name').html();
    var singerName = $(this).parent().parent().siblings('.song_singerName').children('a').html();
    var alt = location.href.split('=')[1].split('&')[0];

    $.ajax({
      url: 'http://localhost:3000/delete',
      type: 'POST',
      data: {
        musicName: musicName,
        singerName: singerName,
        alt: alt
      },
      success: function (data) {
        if (data == 'success') {
          // location.reload();
          $('.success').html('删除成功').show();
          var timer = setTimeout(function () {
            $('.success').hide();
            location.reload();
          }, 1000);
        } else if (data == 'default') {
          $('.success').html('删除失败').show();
          var timer = setTimeout(function () {
            $('.success').hide();
          }, 2000);
        }
      }
    });
  });
  // 歌曲详细信息 包括评论
  $('.music_name').click(function () {
    var musicName = $(this).html();
    var singerName = $(this).parent().siblings('.song_singerName').children('a').html();
    location.href = 'http://localhost:3000/comment?musicName=' + musicName + '&singerName=' + singerName;
  });
  // 小图标-评论
  $('.bottom_right_comment').click(function () {
    var song = $(this).parents().find('.songName').html();
    var musicName = song.split('-')[0];
    var singerName = song.split('-')[1];

    window.open('http://localhost:3000/comment?musicName=' + musicName + '&singerName='+singerName);
  });
  $('.js_play_comment').click(function () {
    var musicName = $(this).parent().siblings('.comment_musicName').html();
    var singerName = $(this).parent().siblings('.comment_singerName').html();

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
  // 小图标-播放
  $('.js_play').click(function () {
    var musicName = $(this).parent().siblings('.music_name').html();
    var singerName = $(this).parent().parent().siblings('.song_singerName').children('a').html();
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
  $('.js_append_comment').click(function () {
    var musicName = $('.comment_musicName').html();
    var singerName = $('.comment_singerName').html();
    var timer = setTimeout(function () {
      $('.success').hide();
    }, 2000);

    // 判断用户是否已经登录
    if (user == null) {
      $('.success').html('请先登录').show();
    } else {
      $.ajax({
        url: 'http://localhost:3000/append',
        type: 'POST',
        data: {
          musicName: musicName,
          singerName: singerName
        },
        success: function (data) {
          $('.success').html('已添加至我喜欢').show();
        }
      });
    }
  });
  $('.js_download_comment').click(function () {
    var musicName = $('.comment_musicName').html();
    var singerName = $('.comment_singerName').html();
    var timer = setTimeout(function () {
      $('.success').hide();
    }, 2000);

    if (user == null) {
      $('.js_download_comment').attr('href', 'javascript:;');
      $('.success').html('请先登录').show();
    } else {
      $.ajax({
        url: 'http://localhost:3000/download',
        type: 'POST',
        data: {
          musicName: musicName,
          singerName: singerName
        },
        success: function (data) {
          if (data == 'success') {
            $('.success').html('已添加至下载列表').show();
          } else if (data == 'default') {
            $('.js_download_comment').attr('href', 'javascript:;');
            $('.success').html('已下载').show();
          }
        }
      });
    }
  });
  $('.js_comment').click(function () {
    var data = {
      uid: user.uId,
      musicName: $('.comment_musicName').html(),
      singerName: $('.comment_singerName').html(),
      comment: $('.comment_content').val()
    };

    if (user == null) {
      alert("请先登录");
    } else {
      $.ajax({
        url: 'http://localhost:3000/addComment?',
        type: 'POST',
        data: data,
        success: function (msg) {
          if (msg == 'success') {
            location.reload();
          } else if (msg == 'defalt') {
            alert('评论失败');
          }
        }
      });
    }
  });
});
