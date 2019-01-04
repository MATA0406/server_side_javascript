/*
* 어떠한 요청이 들어왔을때 제일 처음에 들어온다.
* 라우터(Java의 Servlet같은 존재)
*/

var express = require('express'); // express 모듈 불러오다.
var app = express();

// '/'은 홈으로 접속했을때 두번째 인자를 호출(콜백함수)
app.get('/', function(req, res){
  res.send('Hello home page');
});

app.get('/login', function(req, res){
  res.send('<h1>Login Please</h1>');
});

//3000번 포트 지정
app.listen(3000, function(){
  console.log('Conneted 3000 port!');
});
