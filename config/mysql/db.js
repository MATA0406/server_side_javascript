module.exports = function(){

  var mysql = require('mysql'); // mysql 접속

  // set mysql
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '111111',
    database : 'o2'
  });

  // 연결
  conn.connect();

  return conn;
}
