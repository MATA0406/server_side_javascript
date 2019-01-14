var express = require('express');
var session = require('express-session');
//var FileStore = require('session-file-store')(session); // 인자로 세션을 전달
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

// Session 셋팅
app.use(session({
  secret: '123kljhk212334123gkjhg', // 암호화 키
  resave: false,  // 세션 아이디를 접속할때마다 새롭게 발급하지 않는다.
  saveUninitialized: true, // 세션을 사용하기 전까지는 발급하지 말아라.
    // sessions 디렉토리 경로를 설정
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'o2'
  })
}));


// 로그인페이지
app.get('/auth/login', function(req, res){
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </P>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;

  res.send(output);
});


app.get('/auth/logout', function(req, res){
  delete req.session.displayName; // 삭제

  // 데이터 스토어에 저장이 끝났을 때 콜백함수를 나중에 호출한다.
  req.session.save(function(){
    res.redirect('/welcome');
  })
});


app.get('/welcome', function(req, res){
  // 로그인 성공
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  }
  // 실패
  else{
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a>
    `);
  }
});


// 로그인 처리
app.post('/auth/login', function(req, res){
  // 예) DB에서 가져온 사용자 정보
  var user = {
    username : 'mata',
    password : '111',
    displayName : 'MATA'
  };

  // 브라우저에서 입력한 사용자 정보
  var uname = req.body.username;
  var pwd = req.body.password;

  // 아이디, 비밀번호 일치
  if(uname === user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    
    // 데이터 스토어에 저장이 끝났을 때 콜백함수를 나중에 호출한다.
    req.session.save(function(){
      res.redirect('/welcome');
    });
  }
  // 불일치
  else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
});


app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  }
  else{
    req.session.count = 1;
  }

  res.send('Hi, Session:: ' + req.session.count);
})

app.get('/tmp', function(req, res){
  res.send('result :: ' + req.session.count);
})

app.listen(3003, function(){
  console.log("Connected 3003 port !!");
});
