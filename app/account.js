var express = require('express')
var router = express.Router()
var fs = require("fs");
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 数据库数据
var accountDataPath = __dirname + "/json/account.json";

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the login page route
router.get('/login.html', function (req, res) {
  res.sendFile(__dirname + '/page/login.html');
})

// define the register page route
router.get('/register.html', function (req, res) {
  res.sendFile(__dirname + '/page/register.html');
})

/**
 * 验证用户信息
 */
router.post('/checkUser.html', urlencodedParser, function (req, res) {
    console.log('__dirname:'+__dirname);
    // 解决中文乱码问题
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    // 输出 JSON 格式
    let accountUser = {
        username:req.body.username,
        password:req.body.password
    };
    let currentAccount = {};
    let hasUser = false;
    fs.readFile( accountDataPath, 'utf8', function (err, data) {
        console.log('listUsers:', data );
        let dataJson = JSON.parse(data);
        for (let item of dataJson) {
            if(accountUser.username === item.username) {
                if(accountUser.password === item.password) {
                    currentAccount = item;
                    hasUser = true;
                    break;
                }
            }
        }
        if(hasUser) {
            res.end( JSON.stringify({code: 1,data: currentAccount,message: '登录成功'}) );
        } else {
            res.end( JSON.stringify({code: 0,data: {},message: '帐号或密码不匹配'}) );
        }
    });
    
})

/**
 * 注册
 */
router.post('/addAccount.html', urlencodedParser, function(req, res){
    // 解决中文乱码问题
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});

    let accountUser = {
        username:req.body.username,
        password:req.body.password
    };

    let hasUser = false;
    fs.readFile( accountDataPath, 'utf8', function (err, data) {
        console.log('listUsers:', data );
        let dataJson = JSON.parse(data);
        for (let item of dataJson) {
            if(accountUser.username === item.username) {
                if(accountUser.password === item.password) {
                    currentAccount = item;
                    hasUser = true;
                    break;
                }
            }
        }
        if(hasUser) {
            res.end( JSON.stringify({code: 0,data: {},message: '用户已存在'}) );
        } else if(accountUser.username === ''){
            res.end( JSON.stringify({code: 0,data: {},message: '用户名不能为空'}) );
        } else if(accountUser.password === ''){
            res.end( JSON.stringify({code: 0,data: {},message: '密码不能为空'}) );
        } else {
            dataJson.push(accountUser);
            fs.writeFile(accountDataPath, JSON.stringify(dataJson),  function(err) {
                if (err) {
                    return console.error(err);
                }
                console.log("数据写入成功！");
                console.log("--------我是分割线-------------")
                console.log("读取写入的数据！");
                fs.readFile(accountDataPath, 'utf8', function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("异步读取文件数据: " + data.toString());
                    res.end( JSON.stringify({code: 1,data: accountUser, message: '注册成功'}) );
                });
            });
        }
    });
})

router.get('*', function(req, res) {
    res.redirect('/account/login.html');
});

module.exports = router