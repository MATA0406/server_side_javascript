var express = require('express');
var app = express();

// p1.js를 불러온다. - p1.js로 app을 전달해줄 수 있다.
var p1 = require('./routes/p1')(app);

// p2.js를 불러온다. - p2.js로 app을 전달해줄 수 있다.
var p2 = require('./routes/p2')(app);

// /p1으로 들어오는 모든 접속은 router에게 위임한다.
app.use('/p1', p1);

app.use('/p2', p2);

app.listen(3003, function(){
  console.log('3003 Connected !!');
});
