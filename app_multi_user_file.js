var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session); // 인자로 세션을 전달
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

// Session 셋팅
app.use(session({
  secret: '123kljhk212334123gkjhg', // 암호화 키
  resave: false,  // 세션 아이디를 접속할때마다 새롭게 발급하지 않는다.
  saveUninitialized: true, // 세션을 사용하기 전까지는 발급하지 말아라.
  store: new FileStore({path:'/sessions/'}) // sessions 디렉토리 경로를 설정
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


// 로그아웃
app.get('/auth/logout', function(req, res){
  delete req.session.displayName; // 삭제
  res.redirect('/welcome');
});


app.get('/welcome', function(req, res){
  console.log(req.session.displayName);
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
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});


// 회원가입 로그인페이지
app.get('/auth/register', function(req, res){
  var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </P>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="displayName" placeholder="displayName">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;

  res.send(output);
})


var users = [
  {
    username : 'mata',
    password : '111',
    displayName : 'MATA'
  }
];

// 회원가입 처리
app.post('/auth/register', function(req, res){
  var user = {
    username: req.body.username,
    password: req.body.password,
    displayName: req.body.displayName
  };

  users.push(user);

  req.session.displayName = req.body.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});


// 로그인 처리
app.post('/auth/login', function(req, res){
  // 예) DB에서 가져온 사용자 정보
  // var user = {
  //   username : 'mata',
  //   password : '111',
  //   displayName : 'MATA'
  // };

  // 브라우저에서 입력한 사용자 정보
  var uname = req.body.username;
  var pwd = req.body.password;

  // 유저의 수만큼
  for(var i=0; i<users.length; i++){
    var user = users[i];

    // 아이디, 비밀번호 일치
    if(uname === user.username && pwd === user.password){
      req.session.displayName = user.displayName;

      // 세션 값이 셋팅이 완전히 끝나면 부르는 콜백
      return req.session.save(function(){
        // return을 줘야 바로 리다이렉션
        res.redirect('/welcome');
      });
    }
  }

  // 불일치
  res.send('Who are you? <a href="/auth/login">login</a>');
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
