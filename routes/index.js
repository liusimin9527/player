var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);
var obj = {};

/* 路由控制 */
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '音乐台-首页' });
});
// 排行榜
router.get('/chart', function (req, res) {
  var SQL = 'select * from music order by clicks desc limit 10';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.render('chart', { title: '音乐台-排行版', song: doc});
    });
  });
});
// 个人中心
router.get('/personal', function (req, res) {
  var SQL = 'select * from musiclist';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.render('personal', { title: "音乐台-个人中心", song: doc });
    });
  });
});
// 歌手列表
router.get('/singerList', function (req, res) {
  var SQL = 'select * from singer order by attention desc';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.render('singerList', { title: '音乐台-歌手', singer: doc });
    });
  });
});
/* 传输数据 */
// 歌手信息
router.get('/singer?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      SQL = 'select * from music where singerId = ?';
      obj["singerInfo"] = doc[0];
      connection.query(SQL, [doc[0].singerId], function (err, doc) {
        res.render('singer', { title: '音乐台-歌手', user: obj.user, song: doc, singer: obj.singerInfo });
      });
    });
  });
});
// 歌手列表
router.get('/singers?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where countryType = ? and singerGender = ? order by attention desc';

  if (param.countryType == '1') {
    param.countryType = '华语';
  } else if (param.countryType == '2') {
    param.countryType = '日韩';
  } else if (param.countryType == '3') {
    param.countryType = '欧美';
  }

  if (param.singerGender == '1') {
    param.singerGender = '男';
  } else if (param.singerGender == '2') {
    param.singerGender = '女';
  } else if (param.singerGender == '3') {
    param.singerGender = '组合';
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.countryType, param.singerGender], function (err, doc) {
      res.render('singerList', { singer: doc });
    });
  });
});
/* 个人中心 */
router.get('/person?', function (req, res) {
  var param = req.query;
  var SQL = "";

  if (param.alt == '1') {   // 我喜欢
    SQL = "select * from musiclist where liked = 'true'";
  // } else if (param.alt == '2') {  // 播放列表

  } else if (param.alt == '3') {  // 下载列表
    SQL = "select * from musiclist where download = 'true'";
  } else if (param.alt == '4') {  // 全部歌曲
    SQL = 'select * from musiclist';
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      console.log(doc);
      res.render('personal', { title: "音乐台-个人中心", song: doc });
    });
  });
});
// 关注
router.get('/attention?', function (req, res) {
  var param = req.query;
  var SQL = 'update singer set attention = attention+1 where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        msg = 'success';
      }

      res.send(msg);
    });
  });
});
// 取消关注
router.get('/cancel?', function (req, res) {
  var param = req.query;
  var SQL = 'update singer set attention = attention-1 where singerName = ?'

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        msg = 'success';
      }

      res.send(msg);
    });
  });
});
// 排行榜
router.get('/charts?', function (req, res) {
  var param = req.query;
  var SQL = '';

  if (param.alt == '1') {  // 内地
    SQL = "select * from music where songType = '内地' order by clicks desc limit 10";
  } else if (param.alt == '2') {  // 港台
    SQL = "select * from music where songType = '港台' order by clicks desc limit 10";
  } else if (param.alt == '3') {  // 日韩
    SQL = "select * from music where songType = '日韩' order by clicks desc limit 10";
  } else if (param.alt == '4') {  // 欧美
    SQL = "select * from music where songType = '欧美' order by clicks desc limit 10";
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.render('chart', { title: "音乐台-排行榜", song: doc });
    });
  });
});
/* 查看评论 */
router.get('/comment?', function (req, res) {
  var param = req.query;
  var users = {};
  var SQL = 'select users.*, comment.* from comment left join users on users.uid = comment.uid where musicId = ? order by time desc';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicId], function (err, doc) {
      for (var i = 0; i < doc.length; i++) {
        time = doc[i].time;
        doc[i].time = time.format("yyyy-MM-dd hh:mm:ss");
        console.log(time);
      }

      res.render('comment', { title: '音乐台-评论', comment: doc, user: obj.user });
    });
  });
})
/* 增加评论 */
router.post('/addComment', function (req, res) {
  var param = req.body,
      SQL = 'insert into comment(uid, musicId, comment, time) values(?, ?, ?, ?)',
      msg = '';
  var date = new Date();

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.uid, param.musicId, param.comment, date], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        msg = 'success';
      }

      res.send(msg);
    });
  });
})
/* 播放器 */
router.get('/player?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from music where singerName = ? limit ?,1';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName, parseInt(param.alt)], function (err, doc) {
      console.log(doc);
      res.render('player', { title: '正在播放-' + param.musicName, music: doc[0] });
    });
  });
});
/* 搜索歌曲结果 */
router.get('/result?', function (req, res) {
  var param = req.query,
      SQL = 'select music.*, singer.* from singer left join music on music.singerId = singer.singerId where musicName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName], function (err, doc) {
      res.render('result', { title: '音乐台-搜索结果', song: doc});
    });
  });
});
/*  */
router.get('/searching?', function (req, res) {
  var param = req.query,
      SQL = 'select * from singer where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.keyword], function (err, doc) {
      if (doc.length) {
        msg = '歌手';
      } else {
        msg = '歌曲';
      }
      // console.log(doc);
      res.send(msg);
    });
  });
});

Date.prototype.format = function(fmt) {
   var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

module.exports = router;
