var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);
var alt = 0;

/* 路由控制 */
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '音乐台-首页' });
});
// 排行榜

router.get('/addLike', function (req, res) {
  var SQL = 'insert into like(uid, musicName, singerName, ) value (?????????)';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [], function (err, doc) {

    });
  })
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
router.get('/chart', function (req, res) {
  var SQL = 'select * from music order by clicks desc limit 10';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      obj.song = doc;
      res.render('chart', { title: '音乐台-排行版', song: doc});
    });
  });
});
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
      obj.song = doc;
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
/* 搜索歌曲结果 */
router.get('/result?', function (req, res) {
  var param = req.query,
      SQL = 'select * from music where musicName = ? order by clicks';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName], function (err, doc) {
      obj.song = doc;
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
