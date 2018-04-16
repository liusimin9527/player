$(document).ready(function () {
  var time = new Date();
  var year = time.getFullYear();
  var name = localStorage.getItem('name');

  if (localStorage.getItem('name')) {
    $('.header_right_name').html(name);  // 用户名
    $('.userImg').attr('src', '../'+localStorage.getItem('uImg'));
    $('.opt').show();
    $('.header_content').hide();
  }
  // 退出登录
  $('.logoutBtn').click(function () {
    localStorage.removeItem('uid');
    localStorage.removeItem('name');

    location.reload();  // 刷新页面
  });

  $('.song_item:even').css("background", "#fbfbfb");

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
    })
  });
  $('.hot_song__list li').click(function () {
    $.ajax({
      url: 'http://localhost:3000/player',
      type: 'post',
      data: {
        musicName: $(this).find('.musicName').html(),
        singerName: $(this).find('.singerName').html(),
        alt: $(this).index()
      },
        success: function () {
          //window.open('http://localhost:3000/player ');
          location.href = '/player';
        }
    });
  });
  // 播放
  $('.song_list li').click(function () {
    $.ajax({
      url: 'http://localhost:3000/player',
      type: 'post',
      data: {
        musicName: $(this).find('.song_songName').html(),
        singerName: $(this).find('.song_singerName a').html(),
        alt: $(this).index()
      },
      success: function (data) {
        //window.open('http://localhost:3000/player ');
        location.href = '/player';
      }
    });
  });
  $('.page_item li').click(function () {
    $(this).find('a').attr('href', location.href.split('index')[0]+'index='+($(this).index()));
  });

  $('.js_first').click(function () {
    var index = parseInt(location.href.split('index=')[1]);

    $(this).find('a').attr('href', location.href.split('index')[0]+'index=' + (index-1));
  });

  $('.js_end').click(function () {
    var index = parseInt(location.href.split('index=')[1]);

    $(this).find('a').attr('href', location.href.split('index')[0]+'index=' + (index+1));
  })

  // 底部时间
  $('.footer_time').html(year);
});
