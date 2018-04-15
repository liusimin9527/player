var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);
var index = 0;

// 歌手列表
router.get('/', function (req, res) {
  var SQL = 'select * from singer';
  var len = 0;
  index = parseInt(req.query.index);

  sql.getConnection(function (err, connection) {
    connection.query(SQL, function (err, doc) {
      SQL = 'select * from singer order by attention desc limit ?,75';
      len = Math.ceil(doc.length/75);

      console.log(doc.length%75);

      connection.query(SQL, [parseInt(req.query.index)*75], function (err, doc) {
        res.render('singerList', { title: '音乐台-歌手', singer: doc, length: len, index: index });
      });
    });
  });
});
/* 传输数据 */
// 某位歌手信息
router.get('/singer?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where singerName = ?';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.singerName], function (err, doc) {
      SQL = 'select * from music where singerId = ? order by clicks limit 0,10';
      obj["singerInfo"] = doc[0];
      connection.query(SQL, [doc[0].singerId], function (err, doc) {
        obj['song'] = doc;
        res.render('singer', { title: '音乐台-歌手', song: doc, singer: obj.singerInfo });
      });
    });
  });
});
// 歌手列表
router.get('/singers?', function (req, res) {
  var param = req.query;
  var SQL = 'select * from singer where countryType = ? and singerGender = ?';
  var len = 0;
  index = parseInt(param.index);

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
      SQL = 'select * from singer where countryType = ? and singerGender = ? order by attention desc limit ?,75';
      len = Math.ceil(doc.length/75);

      connection.query(SQL, [param.countryType, param.singerGender, index*75], function (err, doc) {
        res.render('singerList', { title: '音乐台-歌手', singer: doc, length: len, index: index });
      });
    });
  });
});


module.exports = router;
