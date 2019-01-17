module.exports = function(){

  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');

  var app = express();

  // view 파일을 ./views/mysql 아래 두겠다.
  app.set('views', './views/mysql');

  // 나는 jade를 쓰겠다.
  app.set('view engine', 'jade');

  app.use(bodyParser.urlencoded({ extended: false}));

  // Session 셋팅
  app.use(session({
    secret: '123kljhk212334123gkjhg', // 암호화 키
    resave: false,  // 세션 아이디를 접속할때마다 새롭게 발급하지 않는다.
    saveUninitialized: true, // 세션을 사용하기 전까지는 발급하지 말아라.
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '111111',
      database: 'o2'
    })
  }));

  return app;
}
