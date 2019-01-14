var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();

// cookie 모듈 사용(키값 - 암호화)
app.use(cookieParser('1412534sdf23r'));

var products = {
  1 : {title : 'The history of web 1'},
  2 : {title : 'The next web'}
};

// products
app.get('/products', function(req, res){
  var output = '';
  for(var name in products){
    output += `
    <li>
      <a href="/cart/${name}">${products[name].title}</a>
    </li>`;
  }

  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

// cart
app.get('/cart/:id', function(req, res){
  var id = req.params.id;

  // 쿠키에 카트가 있다면
  if(req.signedCookies.cart){
    var cart = req.signedCookies.cart;
  }
  else{
    var cart = {};
  }

  if(!cart[id]){
    cart[id] = 0;
  }

  cart[id] = parseInt(cart[id]) + 1;

  res.cookie('cart', cart, {signed:true});
  res.redirect('/cart');
})

app.get('/cart', function(req, res){
  var cart = req.signedCookies.cart;

  if(!cart){
    res.send('Empty');
  }
  else{
    var output = '';
    for(var id in cart){
      if(products[id] === undefined){
      }
      else{
        output += `<li>${products[id].title} (${cart[id]})</li>`
      }
    }
  }

  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>
  `);
});

// count
app.get('/count', function(req, res){

  // 쿠키에 count가 있다면
  if(req.signedCookies.count){
    var count = parseInt(req.signedCookies.count);
  }
  else{
    var count = 0
  }

  count = count + 1;

  res.cookie('count', count, {signed:true});
  res.send('count :: ' + count);
});

// set port
app.listen(3003, function(){
  console.log("Connected 3003 port !!");
});
