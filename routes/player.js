var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

/* 播放器 */
router.get('/', function (req, res) {
  var SQL = 'select * from music where musicName = ? and singerName = ?';
  alt = parseInt(req.query.alt);

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.query.musicName, req.query.singerName], function (err, doc) {
      music = doc[0];
      res.render('player', { title: '正在播放 ' + doc[0].musicName + '-' + doc[0].singerName, music: doc[0] });
    });
  });
});

module.exports = router;
