var express = require('express');
var router = express.Router();

/* mysql */
var mysql = require('mysql');
var dbconfig = require('../db/DBconfig');
var sql = mysql.createPool(dbconfig.mysql);

router.get('/', function (req, res) {
	res.render('register', { title: '音乐台-注册' });
});

router.post('/', function (req, res) {
	var param = req.body,
      SQL = 'select * from users where telephone = ?',
      imgUrl = 'images/person_300.png',
      msg = '';

  sql.getConnection(function (err, connection) {
    connection.query(SQL, [param.telephone], function (err, doc) {
    	if (doc.length) {
        msg = '该手机号码已被注册';
    		res.send(msg);
    	} else {
        SQL = 'insert into users(uid, name, telephone, password, imgUrl) values(?,?,?,?,?)';
    		connection.query(SQL, [param.uid, param.name, param.telephone, param.password, imgUrl], function (err, doc) {
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

module.exports = router;
