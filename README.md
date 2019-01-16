# javascript / node.js / Server / Atom

> javascript와 node.js를 이용하여 웹어플리케이션을 만드는 학습

> 웹브라우저에서 동작하는 자바스크립트를 이용해서 PHP나 JSP의 역할을 대체할 수 있다.

> 하나의 언어로 웹어플리케이션 전체를 구현할 수 있다.

***

### 1. node.js 설치
- <https://nodejs.org/>
### 2. Atom
- <https://atom.io/>
### 3. 모듈과 npm
- <https://www.npmjs.com/>
### 4. 콜백(underscore를 사용한 배열의 원소 리턴)
### 5. 동기/비동기(fs를 이용한 동기/비동기 학습)
----------------------------------------------------------------------------------
### 6. Express 도입(웹 프레임워크) => 라우터라고하며(Java의 Servlet같은 존재)
- <http://expressjs.com/>
- npm install express --save
~~~js
// express 모듈을 불러온다.
var express = require('express');

// 어플리케이션 객체 생성
var app = express();
~~~
----------------------------------------------------------------------------------
### 7. body-parser 모듈(POST로 전송한 데이터를 서버에서 전달받을 수 있게 해주는 모듈)
~~~js
// body-parser 모듈을 불러온다.
var bodyParser = require('body-parser');

// body-parser를 사용한다.
app.use(bodyParser.urlencoded({ extended: false }));
~~~
----------------------------------------------------------------------------------
### 8. Path를 배열로 정의할 수 있다.
~~~js
ex) app.get(['/topic/:id/edit'], function(req, res){}
~~~
----------------------------------------------------------------------------------
### 9. multer 모듈(파일 업로드를 가능하도록 해주는 모듈)
~~~js
// 파일 업로드를 가능하도록 해주는 모듈
var multer = require('multer');

var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({storage:_storage});
~~~
----------------------------------------------------------------------------------
### 10. mysql 모듈(mysql을 접속하도록 해주는 모듈) - host, user, password, database 입력
~~~js
// mysql 접속
var mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'id',
  password : 'pass',
  database : 'o2'
});

// 연결
conn.connect();
~~~
----------------------------------------------------------------------------------
### 11. cookie-parser 모듈(쿠키 설정)
~~~js
var cookieParser = require('cookie-parser')

// cookie 모듈 사용(키값 - 암호화)
app.use(cookieParser('1412534sdf23r'));
~~~
----------------------------------------------------------------------------------
### 12. express-session 모듈(Session 사용)
- // session-file-store(File 세션)
~~~js
var session = require('express-session');
var FileStore = require('session-file-store')(session); // 인자로 세션을 전달

app.use(session({
  secret: '123kljhk212334123gkjhg', // 암호화 키
  resave: false,  // 세션 아이디를 접속할때마다 새롭게 발급하지 않는다.
  saveUninitialized: true, // 세션을 사용하기 전까지는 발급하지 말아라.
  store: new FileStore({path:'/sessions/'}) // sessions 디렉토리 경로를 설정
}));
~~~

- // express-mysql-session(MySQL 세션)
~~~js
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

// Session 셋팅
app.use(session({
  secret: '123kljhk212334123gkjhg', // 암호화 키
  resave: false,  // 세션 아이디를 접속할때마다 새롭게 발급하지 않는다.
  saveUninitialized: true, // 세션을 사용하기 전까지는 발급하지 말아라.
    // sessions 디렉토리 경로를 설정
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'id',
    password: 'pass',
    database: 'o2'
  })
}));
~~~
----------------------------------------------------------------------------------
### 13. 비밀번호 보안(md5 -> sha256 -> pbkdf2) => 단방향 해쉬 함수
- md5
~~~js
var md5 = require('md5');
~~~
- sha256
~~~js
var sha256 = require('sha256');
~~~
- pbkdf2
- 기존의 패스워드 값과 새로운 패스워드 값을 비교하는 방식이 아닌 반환하는 해쉬 값에 의하여 콜백되는 해쉬 값과 패스워드를 비교하는 코드
~~~js
var bkfd2Password = require("pbkdf2-password"); // 대표적인 암호화 방법
var hasher = bkfd2Password(); // 암호화 호출

hasher(opts, function(err, pass, salt, hash) {
  opts.salt = salt;
  hasher(opts, function(err, pass, salt, hash2) {
    assert.deepEqual(hash2, hash);

    // password mismatch
    opts.password = "aaa";
    hasher(opts, function(err, pass, salt, hash2) {
      assert.notDeepEqual(hash2, hash);
      console.log("OK");
    });
  });
});
~~~
----------------------------------------------------------------------------------
### 14. passport => 인증을 쉽게 구현할 수 있도록 고안된 인증(결과적으로!!)
- passportjs
- 자세한 정보: <http://www.passportjs.org/>
~~~js
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy; // 로컬 전략

app.use(passport.initialize()); // 초기화(패스포트 등록)
app.use(passport.session()); // 세션을 사용하겠다.(반드시 세션을 셋팅하고 난 후에!!)

app.post(
  '/auth/login',
  passport.authenticate(
    'local', // 로컬 전략
    {
      //successRedirect: '/welcome',  // 로그인 성공시
      failureRedirect: '/auth/login', // 로그인 실패시
      failureFlash: false
    }
  ), function(req, res){
    // 콜백함수를 주어 유저정보를 세션에 저장 완료 후 리다이렉트
    req.session.save(function(){
      redirect('/welcome');
    })
  }
);

// 로컬 전략
passport.use(new LocalStrategy(
  function(username, password, done){
    // 브라우저에서 입력한 사용자 정보
    var uname = username;
    var pwd = password;

    // 유저의 수만큼
    for(var i=0; i<users.length; i++){
      var user = users[i];

      if(uname === user.username){
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          // hash와 서버에 저장되어 있는 유저의 비밀번호를 비교 일치
          if(hash === user.password){
            // 로그인 절차가 끝날을 때 유저정보를 객체로 사용
            done(null, user); // null자리는 에러처리하는 곳, 사용자 정보 객체
          }
          //불일치
          else{
            done(null, false);
          }
        });
      }
    }

    done(null, false);
  }
));

// 로그인 성공 시 콜백 함수 - done()함수의 두번째 인자를 user에 받는다
passport.serializeUser(function(user, done) {
  done(null, user.username); // 세션에 저장
});

// 다시 접속했을때 이 함수만 호출한다.(세션에 유저 식별자로 구별)
passport.deserializeUser(function(id, done) {
  // 유저의 수만큼
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.username === id){
      return done(null, user);
    }
  }
});
~~~
----------------------------------------------------------------------------------
### 15. Federation authentication(타사인증방식)
- 예)페이스북, 네이버, 구글, 카카오 등 이러한 곳에 저장되어 있는 유저 정보로 인증을 받는 방식
- 사용자의 정보를 보관하기엔 부담스럽고 복잡하기 때문에 전담 보안팀을 가지고 있는 거대 기업에게 맞기고,
> 간단한 식별자로 인증을 받는다.

----------------------------------------------------------------------------------
### 16. MySQL을 이용한 회원가입, 로그인, Session store, Passport(타사인증: 페이스북)
