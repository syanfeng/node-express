var express = require('express');
var fs = require("fs");
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var mysql = require('mysql');

var user = require("./app/user");
var birds = require('./app/birds')
var account = require('./app/account')

app.use(cookieParser())

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'world'
// })

// connection.connect(function(err) {
//   if(err) throw err;
//   console.log('connect success');
// });

// connection.query('SELECT * FROM `city`', function(err, result, fields) {
//   if(err) throw err;
//   console.log(result);
// })
// console.log('select ended');

// connection.end(function(err) {
//   if(err) throw err;
//   console.log('connect end');
// })


var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test'
});

pool.getConnection(function (err, connection) {
  if (err) throw err;
  // connected! (unless `err` is set)
  connection.query('SELECT * FROM `user`', function (error, results, fields) {
    // And done with the connection.
    console.log(results)

    connection.release();

    // Handle error after the release.
    if (error) throw error;
  });
});

// 静态文件处理
app.use('/static', express.static(__dirname + '/static'));
// user 模块路由
app.use('/user', user)
// birds 模块路由
app.use('/birds', birds)
// account 
app.use('/account', account)

// 首页 正则匹配index.html
app.get('/?(index.html)?', function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
})

app.post('/process_post', urlencodedParser, function (req, res) {
  // 输出 JSON 格式
  response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
})

// 没有匹配的路由指向这里
app.get('*', function (req, res) {
  console.log("*", res)
  res.sendFile(__dirname + "/" + "404.html");
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})