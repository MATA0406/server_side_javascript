module.exports = function(app){

  var conn = require('./db')();

  // 암호화 할 수 있는 기능을 가지고 있는 해시 함수
  var bkfd2Password = require("pbkdf2-password"); // 대표적인 암호화 방법
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy; // 페이스북 타사 인증 모듈

  var hasher = bkfd2Password(); // 암호화 호출

  app.use(passport.initialize()); // 초기화
  app.use(passport.session()); // 세션을 사용하겠다.(반드시 세션을 셋팅하고 난 후에!!)

  // 로그인 성공 시 콜백 함수 - done()함수의 두번째 인자를 user에 받는다
  passport.serializeUser(function(user, done) {
    // 세션스토어 안에 현재 접속하는 사용자의 식별값이 authId로 저장이 된다.
    return done(null, user.authId);
  });

  // 다시 접속했을때 이 함수만 호출한다.(세션에 유저 식별자로 구별)
  passport.deserializeUser(function(id, done) {
    var sql = 'SELECT * FROM users WHERE authId=?';

    conn.query(sql, [id], function(err, results){
      if(err){
        console.log('deserializeUser.err :: ', err);
        done('There is no user.');
      }
      else{
        done(null, results[0])
      }
    });
  });

  // 로컬 전략 등록
  passport.use(new LocalStrategy(
    function(username, password, done){
      // 브라우저에서 입력한 사용자 정보
      var uname = username;
      var pwd = password;

      var sql = 'SELECT * FROM users WHERE authId = ?'

      // 로컬에서 등록된 유저가 있는지 확인
      conn.query(sql, ['local:'+uname], function(err, results){
        if(err){
          return done('There is no user.');
        }

        var user = results[0];

        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          // hash와 서버에 저장되어 있는 유저의 비밀번호를 비교 일치
          if(hash === user.password){
            // 로그인 절차가 끝날을 때 유저정보를 객체로 사용
            return done(null, user); // null자리는 에러처리하는 곳
          }
          //불일치
          else{
            done(null, false);
          }
        });
      });
    }
  ));

  // 페이스북 전략 등록
  passport.use(new FacebookStrategy({
      clientID: 308995523080030,
      clientSecret: '7eeca6579fede6fd3dffddf80302f751', // 아무한테도 알려주면 안됨!! 깃허브에서 메일 날라옴.
      callbackURL: "/auth/facebook/callback",
      profileFields:['id', 'email', 'gender', 'link', 'locale',
        'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('facebook.profile :: ', profile);
      var authId = 'facebook:'+profile.id;

      var sql = 'SELECT * FROM users WHERE authId=?';
      // 페북사용자 확인
      conn.query(sql, [authId], function(err, results){
        //사용자가 있다면 로그인
        if(results.length>0){
          done(null, results[0]);
        }
        // 사용자가 없다면 추가
        else{
          var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
          };

          var sql = 'INSERT INTO users SET ?';
          conn.query(sql , newuser, function(err, results){
            if(err){
              console.log(err);
              done('FaceBook Login Error.');
            }
            else{
              done(null, newuser);
            }
          });
        }
      })
    }
  ));

  return passport;
}
