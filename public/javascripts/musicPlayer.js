// 播放器插件
;(function($, window, document, undefined){
  var MusicPlayer = function (player) {
    var self = this;
    var isFirst = false;

    this.nextBtn = player.find("span.next");    // 下一首
    this.playBtn = player.find("span.play_btn"); // 播放
    this.prevBtn = player.find("span.prev");     // 上一首
    this.playerDom = player.find("audio.audioDom");  // audio
    this.process = player.find(".process");         // 进度条()
    this.duration_process = player.find(".duration_process");  // 进度条()
    this.lyric = player.find(".lyric");   // 歌词

    this.prevBtn.click(function prev() {
      $.ajax({
        url: '/player/prev',
        type: 'get',
        success: function (data) {
          location.href = '/player';
        }
      })
    });
    
    this.playBtn.click(function () {
      if (isFirst) {
        self.playerDom[0].play();  // 播放
        isFirst = false;
        $('.play_btn').css('background', '#fff url(/images/pause.png) no-repeat center center');
      } else {
        self.playerDom[0].pause(); // 暂停
        isFirst = true;
        $('.play_btn').css('background', '#333 url(images/cover_play.png) no-repeat center center');
      }
    });

    this.nextBtn.click(function next() {
      $.ajax({
        url: '/player/next',
        type: 'get',
        success: function (data) {
          location.href = '/player';
        }
      })
    });

    this.process.click(function (event) {
      var width = event.clientX - $('.process').offset().left;
      var currentTime = width/$('.process').width()*audioDom.duration;
      var time = self.getCurrentTime(currentTime);

      audioDom.currentTime = currentTime;
      $('.process_btn').css('left', width);
      $('.duration_process').css('width', width);
      $('.duration_time').html(time);
    });

    this.duration_process.click(function () {
      var width = event.clientX - $('.process').offset().left;
      var currentTime = width/$('.process').width()*audioDom.duration;
      var time = self.getCurrentTime(currentTime);

      audioDom.currentTime = currentTime;
      $('.process_btn').css('left', width);
      $('.duration_process').css('width', width);
      $('.duration_time').html(time);
    });
  };
  //
  MusicPlayer.prototype = {
    // 获取歌曲的信息
    getSongInfo: function () {

    },
    // 解析歌词
    getLyric: function () {

    },
    // 获取时间
    getCurrentTime: function (currentTime) {
      var second = Math.floor(currentTime/60);
      var minute = Math.floor(currentTime%60);
      var time = '';

      second = second<10?'0'+second:second;
      minute = minute<10?'0'+minute:minute;

      time = second + ':' + minute;

      return time;
    }
  };

  // 初始化
  MusicPlayer.init = function (player) {
    var _this_ = this;

    player.each(function(){
      new  _this_($(this));
    });
  };

  window["MusicPlayer"] = MusicPlayer;

})(jQuery, window, document);
