$(document).ready(function () {
  var time = new Date();
  var year = time.getFullYear();
  var name = localStorage.getItem('name');

  if (localStorage.getItem('name')) {
    $('.header_right_name').html(name);  // 用户名
    $('.opt').show();
    $('.header_content').hide();
  }

  $('.logoutBtn').click(function () {
    localStorage.removeItem('uid');
    localStorage.removeItem('name');

    location.reload();
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

  // 底部时间
  $('.footer_time').html(year);
});
