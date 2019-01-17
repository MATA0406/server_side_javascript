module.exports = function(){
  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  // 글쓰기 페이지 - 라우팅(GET)
  route.get('/add', function(req, res){
    var sql = 'SELECT * FROM topic';

    // add.jade에 글목록 인자를 전달
    conn.query(sql, function(err, topics, fields){
      if(err){
        res.status(500).send('Internal Server Error');
        console.log('err :: ', err);
      }

      res.render('topic/add', {topics:topics, user:req.user});
    });
  });


  // 입력 및 파일생성 - 라우팅(POST)
  route.post('/add', function(req, res){
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
  route.get(['/:id/edit'], function(req, res){
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
              res.render('topic/edit', {topics:topics, topic:topic[0], user:req.user});
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
  route.post(['/:id/edit'], function(req, res){
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
  route.get(['/:id/delete'], function(req, res){
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
            res.render('topic/delete', {topics : topics, topic:topic[0], user:req.user});
          }
        }
      });
    });
  });


  // 삭제 - 라우팅(POST)
  route.post(['/:id/delete'], function(req, res){
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';

    conn.query(sql, [id], function(err, result){
      res.redirect('/topic/');
    });
  });


  // 메인 - 라우팅(GET)
  route.get(['/', '/:id'], function(req, res){
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
              res.render('topic/view', {topics:topics, topic:topic[0], user:req.user});
            }
          });
        }
        else{
          // view.jade로 인자 전달
          res.render('topic/view', {topics:topics, user:req.user});
        }
      }
    });
  });

  return route;
}
