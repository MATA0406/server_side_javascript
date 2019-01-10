/*
* 어떠한 요청이 들어왔을때 제일 처음에 들어온다.
* 라우터(Java의 Servlet같은 존재)
*/

var express = require('express'); // express 모듈 불러오다.
var app = express();

// body-parser
var bodyParser = require('body-parser');

// 템플릿 엔진 사용
app.set('view engine', 'jade');
// 생략 가능(생략하게 되면 디펄트로 views 디렉토리를 잡는다.)
app.set('views', './views');

app.use(express.static('public'));

// POST로 요청을 보낸 데이터를 받는다
app.use(bodyParser.urlencoded({extended: false}));

// html 코드를 이쁘게 해준다.
app.locals.pretty = true;

app.get('/form', function(req, res){
  res.render('form')
});

// GET
app.get('/form_receiver', function(req, res){
  var title = req.query.title;
  var description = req.query.description;

  res.send(title + ', ' + description);
});

// POST
app.post('/form_receiver', function(req, res){
  var title = req.body.title;
  var description = req.body.description;

  res.send(title + ', ' + description);
});

// 세멘틱으로 받는다
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id + ', ' + req.params.mode);
});

// 쿼리스트링 활용
app.get('/topic/:id', function(req, res){
  var topics = [
    'Javascript is...',
    'Nodejs is...',
    'Express is...'
  ];

  var output = `
  <a href="/topic/0">JavaScript</a><br>
  <a href="/topic/1">Nodejs</a><br>
  <a href="/topic/2">Express</a><br><br>
  ${topics[req.params.id]}
  `
  res.send(output);
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
