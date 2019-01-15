var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session); // 인자로 세션을 전달
var bodyParser = require('body-parser');
// var md5 = require('md5'); // 암호화
// var sha256 = require('sha256'); // 암호화(단방향 해쉬)
// 암호화 할 수 있는 기능을 가지고 있는 해시 함수
var bkfd2Password = require("pbkdf2-password"); // 대표적인 암호화 방법
var hasher = bkfd2Password(); // 암호화 호출

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
  //delete req.session.displayName; // 삭제
  req.session.destroy(); // 세션의 정보 삭제
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

// 보안에서는 '소금을 친다.'
// var salt = '2!@%!@#%sdgfasdg!@'

var users = [
  {
    username : 'mata',
    password : 'JK/5SPoPZf7Y+d7G87stJqfLHAuJ9tiVfhhQc9SoTSMaYu2DdF95UC72Cdr7oDrHm2kNY17jmnQuXTt9orzen6sXJ0BeupgCLXFgSy4NH7uCoej+m+u0FM9LLW9E5evkt3lje6PV1TaJc/RNsjjebMybjpgbCmdkrlSQJ+BMt+M=',
    salt: 'Ayg9yWlauGsjORAMXEQUxDg/iWBzt6XJQGC18DRSK8bklxBx3RiFC6hhQx3bd2S+U4PmLTEJUkLlaURo1ntVEQ==',
    displayName : 'MATA'
  }
];

// 회원가입 처리
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };

    // 유저 추가
    users.push(user);

    // 세션에 사용자 이름 저장
    req.session.displayName = req.body.displayName;
    // 저장이 끝나면 리다이렉트
    req.session.save(function(){
      res.redirect('/welcome');
    });
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

    if(uname === user.username){
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        // hash와 서버에 저장되어 있는 유저의 비밀번호를 비교 일치
        if(hash === user.password){
          req.session.displayName = user.displayName
          req.session.save(function(){
            res.redirect('/welcome');
          });
        }
        //불일치
        else{
          res.send('Who are you? <a href="/auth/login">login</a>');
        }
      });
    }

    // 아이디, 비밀번호 일치
    // if(uname === user.username && sha256(pwd+user.salt) === user.password){
    //   req.session.displayName = user.displayName;
    //
    //   // 세션 값이 셋팅이 완전히 끝나면 부르는 콜백
    //   return req.session.save(function(){
    //     // return을 줘야 바로 리다이렉션
    //     res.redirect('/welcome');
    //   });
    // }
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
