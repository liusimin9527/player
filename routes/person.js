var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

// 个人中心
router.get('/', function (req, res) {
  var SQL = 'select * from musiclist';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.render('personal', { title: "音乐台-个人中心", song: doc });
    });
  });
});
router.get('/?', function (req, res) {
  var param = req.query;
  var SQL = "";

  if (param.alt == '1') {   // 我喜欢
    SQL = 'select * from liked';
  // } else if (param.alt == '2') {  // 播放列表

  } else if (param.alt == '3') {
    SQL = 'select * from download';   // 历史记录
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      console.log(doc);
      res.render('personal', { title: "音乐台-个人中心", song: doc });
    });
  });
});

module.exports = router;
