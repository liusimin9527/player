var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);
var music = {};

/* 播放器 */
router.get('/', function (req, res) {
  res.render('player', { title: '正在播放-' + music.musicName, music: music });
});
router.post('/', function (req, res) {
  var SQL = 'select * from music where musicName = ? and singerName = ?';
  alt = parseInt(req.body.alt);

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.body.musicName, req.body.singerName], function (err, doc) {
      music = doc[0];

      res.send('success');
    });
  });
});
// 上一首
router.get('/prev', function (req, res) {
  var len = obj.song.length;

  if (alt == 0) {
    alt = len - 1;
  } else {
    alt = alt - 1;
  }

  music = obj.song[alt];
  res.send('success');
});
// 下一首
router.get('/next', function(req, res) {
  var len = obj.song.length;

  if (alt == len - 1 ) {
    alt = 0;
  } else {
    alt = alt + 1;
  }

  music = obj.song[alt];
  res.send('success');
});

module.exports = router;
