var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);
var alt = 0;

/* 路由控制 */
/* GET home page. */
router.get('/', function (req, res) {
  var SQL = "select * from music order by clicks desc";

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      obj.song = doc;
      res.render('index', { title: '音乐台-首页', music: doc });
    });
  });
});
// 关注
router.post('/attention', function (req, res) {
  var param = req.body;
  var msg = '';
  var SQL = 'update singer set attention = attention+1 where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      SQL = 'update users set attention = ? where uid = ?';
      connection.query(SQL, [param.attention, param.uid], function (err, doc) {
        if (err) {
            msg = 'default'
        } else {
            msg = 'success'
        }

        res.send(msg);
      });
    });
  });
});
// 取消关注
router.post('/cancel', function (req, res) {
  var param = req.body;
  var SQL = 'update singer set attention = attention-1 where singerName = ?'

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      SQL = 'update users set attention = ? where uid = ?';
      connection.query(SQL, [param.attention, param.uid], function (err, doc) {
        if (err) {
            msg = 'default'
        } else {
            msg = 'success'
        }

        res.send(msg);
      });
    });
  });
});
/* 查看评论 */
router.get('/comment?', function (req, res) {
  var SQL = 'select users.*, comment.* from comment left join users on users.uid = comment.uid where musicName = ? and singerName = ? order by time desc';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.query.musicName, req.query.singerName], function (err, doc) {
      SQL = 'select * from music where musicName = ? and singerName = ?';
      for (var i = 0; i < doc.length; i++) {
        time = doc[i].time;
        doc[i].time = time.format("yyyy-MM-dd hh:mm:ss");
      }

      obj['comment'] = doc;
      connection.query(SQL, [req.query.musicName, req.query.singerName], function (err, doc) {
        console.log(obj.comment);
        res.render('comment', { title: '音乐台-评论', comment: obj.comment, song: doc[0] });
      });
    });
  });
});
/* 增加评论 */
router.post('/addComment', function (req, res) {
  var param = req.body;
  var SQL = 'insert into comment(uid, musicName, singerName, comment, time) values(?, ?, ?, ?, ?)';
  var date = new Date();
  var msg = '';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.uid, param.musicName, param.singerName, param.comment, date], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        msg = 'success';
      }

      res.send(msg);
    });
  });
});
// 添加至我喜欢
router.post('/append', function (req, res) {
  var SQL = "delete from liked where (musicName,singerName) in ( select a.musicName, a.singerName from ( select distinct a.musicName, a.singerName from musiclist a where a.musicName = ? and a.singerName = ?) a HAVING count(*) >= 1)";

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.body.musicName, req.body.singerName], function (err, doc) {
      SQL = "insert into liked select music.*, ? as 'uid' from music where musicName = ? and singerName = ?";
      connection.query(SQL, [parseInt(req.body.uId), req.body.musicName, req.body.singerName], function (err, doc) {
        if (err) {
          msg = 'default';
        } else {
          msg = 'success';
        }
        res.send(msg);
      });
    });
  });
});
// 添加至下载列表
router.post('/download', function (req, res) {
  var SQL = "delete from download where (musicName,singerName) in ( select a.musicName, a.singerName from ( select distinct a.musicName, a.singerName from musiclist a where a.musicName = ? and a.singerName = ?) a HAVING count(*) >= 1)";

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.body.musicName, req.body.singerName], function (err, doc) {
      SQL = "insert into download select music.*, ? as 'uid' from music where musicName = ? and singerName = ?";

      connection.query(SQL, [parseInt(req.body.uId), req.body.musicName, req.body.singerName], function (err, doc) {
        if (err) {
          msg = 'default';
        } else {
          msg = 'success';
        }

        res.send(msg);
      });
    });
  })
});
// 删除
router.post('/delete', function (req, res) {
  var SQL = '';
  var msg = '';
  console.log(req.body);  

  if (req.body.alt == '0') {
    SQL = 'delete from musiclist where musicName = ? and singerName = ? and uid = ?';
  } else if (req.body.alt == '1') {
    SQL = 'delete from liked where musicName = ? and singerName = ? and uid = ?';
  } else if (req.body.alt == '2') {
    SQL = 'delete from download where musicName = ? and singerName = ? and uid = ?';
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.body.musicName, req.body.singerName, parseInt(req.body.uid)], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        msg = 'success';
      }

      res.send(msg);
    });
  })
});
/* 搜索歌曲结果 */
router.get('/result?', function (req, res) {
  var param = req.query,
      SQL = 'select * from music where musicName = ? order by clicks desc';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName], function (err, doc) {
      obj.song = doc;
      res.render('result', { title: '音乐台-搜索结果', song: doc});
    });
  });
});
/*  */
router.get('/searching?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.keyword, param.keyword], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        if (doc.length) {
          msg = '歌手';
        } else {
          msg = '歌曲';
        }
      }

      res.send(msg);
    });
  });
});
router.post('/dabang', function (req, res) {
  var SQL = 'update music set clicks = clicks+1 where musicName = ? and singerName = ?';
  var param = req.body;

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName, param.singerName], function (err, doc) {
      if (err) {
        msg = 'default';
      } else {
        msg = 'success';
      }

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
