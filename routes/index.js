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
  res.render('index', { title: '音乐台-首页', user: obj.user});
});
// 排行榜
router.get('/chart', function (req, res) {
  res.render('chart', { title: '音乐台-排行版', user: obj.user});
});
// 打榜
router.get('/billboard', function (req, res) {
  res.render('billboard', { title: '音乐台-打榜', user: obj.user });
});
// 歌手列表
router.get('/singerList', function (req, res) {
  res.render('singerList', { title: '音乐台-歌手', user: obj.user});
});

/* 传输数据 */
// 歌手
router.get('/singer?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      SQL = 'select * from music where singerId = ?';
      obj["singerInfo"] = doc[0];
      connection.query(SQL, [doc[0].singerId], function (err, doc) {
        res.render('singer', { title: '音乐台-歌手', user: obj.user, song: doc , singer: obj.singerInfo });
      });
    });
  });
});

router.get('/singerLi', function (req, res) {
  var SQL = 'select * from singer';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.json(doc);
    });
  });
});

router.get('/singers', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where countryType = ? and singerGender = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.countryType, param.singerGender], function (err, doc) {
      res.json(doc);
    });
  });
});
/* 评论 */
router.get('/comment?', function (req, res) {
  var param = req.query;
  var users = {};
  var SQL = 'select users.*, comment.* from comment left join users on users.uid = comment.uid where musicId = ? order by time';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicId], function (err, doc) {
      res.render('comment', { title: '音乐台-评论', comment: doc, user: obj.user });
    });
  });
})
/* 增加评论 */
// todo: 不同的用户评论
router.post('/addComment', function (req, res) {
  var param = req.body,
      SQL = 'insert into comment(uid, musicId, comment, time) values(?, ?, ?, ?)',
      msg = '';
  var date = new Date();

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [obj.user.uid, param.musicId, param.comment, date], function (err, doc) {
      if (err) {
        msg = 'defalt';
      } else {
        msg = 'success';
      }

      res.send(msg);
    });
  });
})

router.get('/player?', function (req, res) {
  var param = req.query;
  var SQL = 'select music.*, singer.* from singer left join music on music.singerId = singer.singerId where musicName = ? and singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName, param.singerName], function (err, doc) {
      res.render('player', { title: '正在播放-' + param.musicName, user: obj.userName, music: doc[0] });
    });
  });
});
/* 注册 */
router.route('/register')
  .get(function (req, res) {
  	res.render('register', { title: '音乐台-注册' });
  })
  .post(function (req, res) {
  	var param = req.body,
        SQL = 'select * from users where telephone = ?',
        msg = '';

    sql.getConnection(function (err, connection) {
      connection.query(SQL, [param.telephone], function (err, doc) {
      	if (doc.length) {
          msg = '该手机号码已被注册';
      		res.send(msg);
      	} else {
          SQL = 'insert into users(uid, name, telephone, password) values(?,?,?,?)';
      		connection.query(SQL, [param.uid, param.name, param.telephone, param.password], function (err, doc) {
            if (err) {
              msg = '注册失败';
            } else {
              msg = '注册成功';
            }

            res.send(msg);
      		});
      	}
      });
    });
  });
/* 登录 */
router.route('/login')
  .get(function (req, res) {
    res.render('login', { title: '音乐台-登录' });
  })
  .post(function (req, res, next) {
    var param = req.body,
        SQL = 'select * from users where name = ?',
        msg = '';

    sql.getConnection(function (err, connection) {
      connection.query(SQL, [param.name], function (err, doc) {
        if (!doc.length) {
           msg = '未注册';
        } else {
          if (doc[0].password == param.password) {
            msg = '登录成功';
            obj['user'] = doc[0];
          } else {
            msg = '密码错误';
          }
        }

        res.send(msg);
      });
    });
  });

/* 搜索歌曲 */
router.get('/result?', function (req, res) {
  var param = req.query,
      SQL = 'select music.*, singer.* from singer left join music on music.singerId = singer.singerId where musicName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName], function (err, doc) {
      res.render('result', { title: '音乐台-搜索结果',user: obj.user ,result: doc});
    });
  });
});

router.get('/searching?', function (req, res) {
  var param = req.query,
      SQL = 'select * from singer where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.keyword], function (err, doc) {
      if (doc.length == 0) {
        msg = '歌曲';
      } else {
        msg = '歌手';
      }

      res.send(msg);
    });
  });
});

module.exports = router;
