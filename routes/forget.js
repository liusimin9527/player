var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

router.get('/', function (req, res) {
  res.render('forget', {title: '音乐台-忘记密码'});
});

router.post('/', function (req, res) {
  var SQL = 'select * from users where telephone = ?'

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [req.body.telephone], function (err, doc) {
      if (doc.length) {
        data = {
          msg: 'success',
          uid: doc[0].uid,
          name: doc[0].name,
          uImg: doc[0].imgUrl
        };
      } else {
        data = {
          msg: 'default'
        }
      }

      res.send(data);
    });
  });
});

module.exports = router;
