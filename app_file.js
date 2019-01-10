// express 모듈을 불러온다.
var express = require('express');

// body-parser 모듈을 불러온다.
var bodyParser = require('body-parser');

// file system을 제어할 수 있는 모듈
var fs = require('fs');

// 어플리케이션 객체 생성
var app = express();

// body-parser를 사용한다.
app.use(bodyParser.urlencoded({ extended: false }));

// html 코드를 이쁘게 해준다.
app.locals.pretty = true;

// view 파일을 ./views_file 아래 두겠다.
app.set('views', './views_file');

// 나는 jade를 쓰겠다.
app.set('view engine', 'jade');

// 글쓰기 페이지 - 라우팅(GET)
app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    res.render('new', {topics:files});
  });
});

// 메인 - 라우팅(GET)
app.get(['/topic', '/topic/:id'], function(req, res){
  // 디렉토리를 전달 받는다.
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    // path를 받는다.
    var id = req.params.id;

    if(id){
      // id 값이 있을 때
      fs.readFile('data/'+id, 'utf8', function(err, data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics:files, title:id, description:data});
      });
    }
    else{
      // id 값이 없을 때
      res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for Server.'});
    }
  });
});

// 입력 및 파일생성 - 라우팅(POST)
app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;

  // 입력(file, data[,option], callback)
  fs.writeFile('data/' + title, description, function(err){
    // 에러일 경우
    if(err){
      console.log(err);
      // 500에러일 경우
      res.status(500).send('Internal Server Error');
    }

    res.redirect('/topic/'+title);
  });
});

// app.get('/topic/:id', function(req, res){
//   // path를 받는다.
//   var id = req.params.id;
//
//   fs.readdir('data', function(err, files){
//     if(err){
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//
//     fs.readFile('data/'+id, 'utf8', function(err, data){
//       if(err){
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       }
//       res.render('view', {topics:files, title:id, description:data});
//     });
//   });
// });

// 특정 포트를 리스닝 한다(3000번 포트, 콜백 함수).
app.listen(3000, function(req, res){
  console.log('Connected, 3000 Port!!');
});
