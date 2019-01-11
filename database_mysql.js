var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

// 연결
conn.connect();

// insert
// var sql = 'SELECT * FROM topic';
//
// conn.query(sql, function(err, rows, fields){
//   if(err){
//     console.log(err);
//   }
//   else {
//     for(var i=0; i<rows.length; i++){
//       console.log(rows[i].author);
//     }
//   }
// });

var sql = 'INSERT INTO topic (title, description, author) values(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];

// sql에 ?를 사용하면 query의 두번째 인자에 parameter를 넣어준다.(배열로!!)
conn.query(sql, params, function(err, rows, fields){
  if(err){
    console.log(err);
  }
  else{
    console.log('rows :: ', rows);
  }
});

// 해제
conn.end();
