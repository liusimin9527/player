var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

// 个人中心
// router.get('/', function (req, res) {
//   var SQL = 'select * from musiclist';
//
//   sql.getConnection(function (err, connection) {
//     connection.query(SQL, function (err, doc) {
//       res.render('personal', { title: "音乐台-个人中心", song: doc });
//     });
//   });
// });
router.get('/?', function (req, res) {
  var len = 0;
  var SQL = "";
  var index = parseInt(req.query.index);

  if (req.query.alt == '0') {   // 播放列表
    SQL = 'select * from musiclist where uid = ?';
  } else if (req.query.alt == '1') {   // 我喜欢
    SQL = 'select * from liked where uid = ?';
  } else if (req.query.alt == '2') {   // 下载列表
    SQL = 'select * from download where uid = ?';
  }

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.query.uid], function (err, doc) {
      SQL = SQL + ' limit ?,20';
      len = Math.ceil(doc.length/20);

      connection.query(SQL, [req.query.uid ,index*20], function (err, doc) {
        res.render('personal', { title: "音乐台-个人中心", song: doc, length: len, index: index });
      });
    });
  });
});

module.exports = router;
