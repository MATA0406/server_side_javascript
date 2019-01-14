// express 모듈을 불러온다.
var express = require('express');

// body-parser 모듈을 불러온다.
var bodyParser = require('body-parser');

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

// 업로드를 받을 수 있는 미들웨어를 리턴해준다.(데스티네이션:목적지)
// var upload = multer({ storage: 'uploads/' })

// file system을 제어할 수 있는 모듈
var fs = require('fs');

// mysql 접속
var mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

// 연결
conn.connect();

// 어플리케이션 객체 생성
var app = express();

// body-parser를 사용한다.
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', express.static('uploads'));

// html 코드를 이쁘게 해준다.
app.locals.pretty = true;

// view 파일을 ./views_file 아래 두겠다.
app.set('views', './views_mysql');

// 나는 jade를 쓰겠다.
app.set('view engine', 'jade');

app.get('/upload', function(req, res){
  res.render('upload');
});

// 파일이 포함되어 있다면 req 객체에 파일(프로퍼티)을 포함한다.
app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded' + req.file.filename);
});

// 글쓰기 페이지 - 라우팅(GET)
app.get('/topic/add', function(req, res){
  var sql = 'SELECT * FROM topic';

  // add.jade에 글목록 인자를 전달
  conn.query(sql, function(err, topics, fields){
    if(err){
      res.status(500).send('Internal Server Error');
      console.log('err :: ', err);
    }

    res.render('add', {topics:topics});
  });
});


// 입력 및 파일생성 - 라우팅(POST)
app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';

  // insert query
  conn.query(sql, [title, description, author], function(err, result, fields){
    // Error
    if(err){
      res.status(500).send('Internal Server Error');
      console.log('err :: ', err);
    }
    // Success
    else{
      // 리다이렉트
      res.redirect('/topic/' + result.insertId);
    }
  });
});


// 수정페이지 - 라우팅(GET)
app.get(['/topic/:id/edit'], function(req, res){
  var sql = 'SELECT * FROM topic';
  conn.query(sql, function(err, topics, fields){
    if(err){
      res.status(500).send('Internal Server Error');
      console.log('err :: ', err);
    }
    else{
      // path에 아이디를 변수로 받는다.
      var id = req.params.id;

      // id 값이 있다면
      if(id){
        var sql = 'SELECT * FROM topic WHERE id = ?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          else{
            console.log('topic :: ', topic)
            // view.jade로 인자 전달
            res.render('edit', {topics:topics, topic:topic[0]});
          }
        });
      }
      else{
        console.log('There is no id.');
        res.status(500).send('Internal Server Error');
      }
    }
  });
});


// 수정 - 라우팅(POST)
app.post(['/topic/:id/edit'], function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;

  var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';

  conn.query(sql, [title, description, author, id], function(err, result, fields){
    if(err){
      console.log('err :: ', err);
      res.status(500).send('Internal Server Error');
    }
    else{
      res.redirect('/topic/' + id);
    }
  });
});


// 삭제 확인 페이지 - 라우팅(POST)
app.get(['/topic/:id/delete'], function(req, res){
  var sql = 'SELECT * FROM topic';
  var id = req.params.id;

  conn.query(sql, function(err, topics, fields){
    var sql = 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, topic, fields){
      if(err){
        res.status(500).send('Internal Server Error');
        console.log('err :: ', err);
      }
      else{
        if(topic.length === 0){
          res.status(500).send('Internal Server Error');
          console.log('There is no record.');
        }
        else{
          res.render('delete', {topics : topics, topic:topic[0]});
        }
      }
    });
  });
});


// 삭제 - 라우팅(POST)
app.post(['/topic/:id/delete'], function(req, res){
  var id = req.params.id;
  var sql = 'DELETE FROM topic WHERE id=?';

  conn.query(sql, [id], function(err, result){
    res.redirect('/topic/');
  });
});


// 메인 - 라우팅(GET)
app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT * FROM topic';
  conn.query(sql, function(err, topics, fields){
    if(err){
      res.status(500).send('Internal Server Error');
      console.log('err :: ', err);
    }
    else{
      // path에 아이디를 변수로 받는다.
      var id = req.params.id;

      // id 값이 있다면
      if(id){
        var sql = 'SELECT * FROM topic WHERE id = ?';
        conn.query(sql, [id], function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          else{
            console.log('topic :: ', topic)
            // view.jade로 인자 전달
            res.render('view', {topics:topics, topic:topic[0]});
          }
        });
      }
      else{
        // view.jade로 인자 전달
        res.render('view', {topics:topics});
      }
    }
  });
});

// 특정 포트를 리스닝 한다(3000번 포트, 콜백 함수).
app.listen(3000, function(req, res){
  console.log('Connected, 3000 Port!!');
});
