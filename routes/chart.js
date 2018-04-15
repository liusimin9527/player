var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

// 排行榜
router.get('/?', function (req, res) {
  var param = req.query;
  var SQL = '';

  if (param.alt == '0') {
    SQL = 'select * from music order by clicks desc limit 0,20';
  } else if (param.alt == '1') {  // 内地
    SQL = "select * from music where songType = '内地' order by clicks desc limit 0,20";
  } else if (param.alt == '2') {  // 港台
    SQL = "select * from music where songType = '港台' order by clicks desc limit 0,20";
  } else if (param.alt == '3') {  // 日韩
    SQL = "select * from music where songType = '日韩' order by clicks desc limit 0,20";
  } else if (param.alt == '4') {  // 欧美
    SQL = "select * from music where songType = '欧美' order by clicks desc limit 0,20";
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      res.render('chart', { title: "音乐台-排行榜", song: doc });
    });
  });
});

module.exports = router;
