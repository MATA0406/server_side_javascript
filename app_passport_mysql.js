

var app = require('./config/mysql/express')();

var passport = require('./config/mysql/passport')(app);

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

// 보안에서는 '소금을 친다.'
// var salt = '2!@%!@#%sdgfasdg!@'

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

app.listen(3003, function(){
  console.log("Connected 3003 port !!");
});
