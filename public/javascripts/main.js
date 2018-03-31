$(document).ready(function () {
  var time = new Date();
  var year = time.getFullYear();
  var name = localStorage.getItem('name');

  //
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
          location.href="/singer?singerName=" + keyword;
        }
      }
    })
  });
  $('.song_list li').click(function () {
    $.ajax({
      url: 'http://localhost:3000/player',
      type: 'post',
      data: {
        musicName: $(this).find('.song_songName').html(),
        alt: $(this).index()-1
      },
      success: function (data) {
        location.href = '/player';
      }
    });
  });
  // 添加到我喜欢
  // $('.attent').click(function () {
  //   $.ajax({
  //     url: 'addLike?',
  //     type: 'GET',
  //     data: {
  //
  //     }
  //     success: function (data) {
  //
  //     }
  //   });
  // });

  // 底部时间
  $('.footer_time').html(year);
});
