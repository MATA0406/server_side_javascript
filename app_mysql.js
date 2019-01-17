// express 모듈을 불러온다.
var app = require('./config/mysql/express')();

// passport 모듈을 불러온다.
var passport = require('./config/mysql/passport')(app);

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

// 특정 포트를 리스닝 한다(3000번 포트, 콜백 함수).
app.listen(3003, function(req, res){
  console.log('Connected, 3003 Port!!');
});
