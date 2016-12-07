var express = require('express');
var fs = require("fs");
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var user = require("./app/user");
var birds = require('./app/birds')
var account = require('./app/account')

app.use(cookieParser())

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })



// 静态文件处理
app.use('/static',express.static(__dirname + '/static'));
// user 模块路由
app.use('/user', user)
// birds 模块路由
app.use('/birds', birds)
// account 
app.use('/account', account)

// user.user(app);

// 首页 正则匹配index.html
app.get('/?(index.html)?', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/process_post', urlencodedParser, function (req, res) {
  // 输出 JSON 格式
  response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
})

app.get('*', function(req, res){
  console.log("*", res)
  res.sendFile( __dirname + "/" + "404.html" );
  // res.render('404.html', {
  //     title: 'No Found'
  // })
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})