$(document).ready(function () {
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
});
