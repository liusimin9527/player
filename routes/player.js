var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

/* 播放器 */
router.get('/', function (req, res) {
  var SQL = 'select * from music where musicName = ? and singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.query.musicName, req.query.singerName], function (err, doc) {
      res.render('player', { title: '正在播放 ' + doc[0].musicName + '-' + doc[0].singerName, music: doc[0] });
    });
  });
});

router.post('/', function (req, res) {
  var SQL = "delete from musiclist where (musicName,singerName) in ( select a.musicName, a.singerName from ( select distinct a.musicName, a.singerName from musiclist a where a.musicName = ? and a.singerName = ?) a HAVING count(*) >= 1)";
  var param = req.body;

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.musicName, param.singerName], function (err, doc) {
      var SQL = "insert into musiclist select music.*, ? as 'uid' from music where musicName = ? and singerName = ?";

      connection.query(SQL, [param.uid, param.musicName, param.singerName], function (err, doc) {
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

module.exports = router;
