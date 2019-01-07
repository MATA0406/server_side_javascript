/*
* 어떠한 요청이 들어왔을때 제일 처음에 들어온다.
* 라우터(Java의 Servlet같은 존재)
*/

var express = require('express'); // express 모듈 불러오다.
var app = express();

// 템플릿 엔진 사용
app.set('view engine', 'jade');
// 생략 가능(생략하게 되면 디펄트로 views 디렉토리를 잡는다.)
app.set('views', './views');

app.use(express.static('public'));

// html 코드를 이쁘게 해준다.
app.locals.pretty = true;

app.get('/topic', function(req, res){
  res.send(req.query.id);
});

// template으로 요청이 들어오면 render를 이용해 views 디렉토리의 temp를 실행시킨다.
// 두번째 인자는 변수를 전달해준다.
app.get('/template', function(req, res){
  res.render('temp', {time:Date(), _title:'제목쿠'});
});

app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/route.png"');
});

app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i=5; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  res.send(lis);
});

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
