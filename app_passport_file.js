var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session); // 인자로 세션을 전달
var bodyParser = require('body-parser');
// 암호화 할 수 있는 기능을 가지고 있는 해시 함수
var bkfd2Password = require("pbkdf2-password"); // 대표적인 암호화 방법
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy; // 페이스북 타사 인증 모듈


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

app.use(passport.initialize()); // 초기화
app.use(passport.session()); // 세션을 사용하겠다.(반드시 세션을 셋팅하고 난 후에!!)

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
    <a href="/auth/facebook">facebook</a>
  `;

  res.send(output);
});


// 로그아웃
app.get('/auth/logout', function(req, res){
  //delete req.session.displayName; // 삭제
  //req.session.destroy(); // 세션의 정보 삭제
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  })
});


app.get('/welcome', function(req, res){
  // 로그인 성공
  if(req.user && req.user.displayName){
    console.log('welcome :: ', req.user.displayName);
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
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
    authId: 'local:mata',
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
      authId: 'local:'+req.body.username,
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };

    // 유저 추가
    users.push(user);

    req.login(user, function(err){
      // 세션에 저장이 끝나면 리다이렉트
      return req.session.save(function(){
        res.redirect('/welcome');
      });
    });

    // 세션에 사용자 이름 저장
  //  req.session.displayName = req.body.displayName;

  });
});


// 로그인 성공 시 콜백 함수 - done()함수의 두번째 인자를 user에 받는다
passport.serializeUser(function(user, done) {
  console.log('serializeUser:: ', user);
  return done(null, user.authId);
});

// 다시 접속했을때 이 함수만 호출한다.(세션에 유저 식별자로 구별)
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser:: ', id);
  // 유저의 수만큼
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.authId === id){
      return done(null, user);
    }
  }

  done('There is no user');
});


// 로컬 전략 등록
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
            console.log('LocalStrategy:: ', user);
            // 로그인 절차가 끝날을 때 유저정보를 객체로 사용
            return done(null, user); // null자리는 에러처리하는 곳
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

// 페이스북 전략 등록
passport.use(new FacebookStrategy({
    clientID: 308995523080030,
    clientSecret: '7eeca6579fede6fd3dffddf80302f751',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'email', 'gender', 'link', 'locale',
      'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('profile :: ', profile);
    var authId = 'facebook:'+profile.id;

    for(var i=0; i<users.length; i++){
      var user = users[i];
      // 동일한 유저가 있을시
      if(user.authId === authId){
         return done(null, user);
      }
    }

    var newuser = {
      'authId':authId,
      'displayName':profile.displayName,
      'email':profile.emails[0].value
    };

    users.push(newuser);

    done(null, newuser);
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));

// 로컬 로그인 라우트
app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {
      // successRedirect: '/welcome',  // 로그인 성공시
      failureRedirect: '/auth/login', // 로그인 실패시
      failureFlash: false
    }
  ),function(req, res){
    // 콜백함수를 주어 유저정보를 세션에 저장 완료 후 리다이렉트
    req.session.save(function(){
      res.redirect('/welcome');
    })
  }
);

// 페이스북 전략
app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook',
    {scope:'email'}
  )
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      failureRedirect: '/auth/login'
    }
  ),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.save(function(){
      res.redirect('/welcome');
    })
  }
);


// 로그인 처리
// app.post('/auth/login', function(req, res){
//   // 브라우저에서 입력한 사용자 정보
//   var uname = req.body.username;
//   var pwd = req.body.password;
//
//   // 유저의 수만큼
//   for(var i=0; i<users.length; i++){
//     var user = users[i];
//
//     if(uname === user.username){
//       return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
//         // hash와 서버에 저장되어 있는 유저의 비밀번호를 비교 일치
//         if(hash === user.password){
//           req.session.displayName = user.displayName
//           req.session.save(function(){
//             res.redirect('/welcome');
//           });
//         }
//         //불일치
//         else{
//           res.send('Who are you? <a href="/auth/login">login</a>');
//         }
//       });
//     }
//   }
// });


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
