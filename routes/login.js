var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

router.get('/', function (req, res) {
  res.render('login', { title: '音乐台-登录' });
});

router.post('/', function (req, res) {
  var SQL = 'select * from users where name = ? and password = ?';
  var msg;

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.body.name, req.body.password], function (err, doc) {
      if (doc.length) {
        msg = 'success';
        data = {
          msg: 'success',
          uid: doc[0].uid,
          name: doc[0].name,
          uImg: doc[0].imgUrl,
          attention: doc[0].attention
        };
      } else {
        data = {
          msg: 'error'
        };
      }
      res.send(data);
    });
  });
});

module.exports = router;
