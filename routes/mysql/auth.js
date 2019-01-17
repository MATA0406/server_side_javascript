module.exports = function(passport){
  var bkfd2Password = require("pbkdf2-password"); // 대표적인 암호화 방법
  var hasher = bkfd2Password(); // 암호화 호출
  var conn = require('../../config/mysql/db')();
  var route = require('express').Router();

  // 회원가입 로그인페이지
  route.get('/register', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      res.render('auth/register', {topics:topics});
    });
  })

  // 로그인페이지
  route.get('/login', function(req, res){
    var sql = 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      res.render('auth/login', {topics:topics});
    });
  });

  // 회원가입 처리
  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authId: 'local:'+req.body.username,
        username: req.body.username,
        password: hash,
        salt: salt,
        displayName: req.body.displayName
      };

      // 유저 추가
      var sql = 'INSERT INTO users SET ?';
      conn.query(sql, user, function(err, results, fields){
        if(err){
          console.log('err::', err);
          res.status(500);
        }
        else{
          req.login(user, function(err){
            // 세션에 저장이 끝나면 리다이렉트(회원가입 후 바로 로그인)
            return req.session.save(function(){
              res.redirect('/topic');
            });
          });
        }
      });

      // 세션에 사용자 이름 저장
    //  req.session.displayName = req.body.displayName;

    });
  });

  // 로컬 로그인 처리
  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/topic',  // 로그인 성공시
        failureRedirect: '/auth/login', // 로그인 실패시
        failureFlash: false
      }
    )
  );

  // 페이스북 전략
  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      {scope:'email'}
    )
  );
  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        failureRedirect: '/auth/login'
      }
    ),
    function(req, res) {
      // Successful authentication, redirect home.
      req.session.save(function(){
        res.redirect('/topic');
      })
    }
  );

  // 로그아웃 처리
  route.get('/logout', function(req, res){
    //delete req.session.displayName; // 삭제
    //req.session.destroy(); // 세션의 정보 삭제
    req.logout();
    req.session.save(function(){
      res.redirect('/topic');
    })
  });

  return route;
};
