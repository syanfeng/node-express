var express = require('express')
var router = express.Router()
var fs = require("fs");

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', function (req, res) {
  res.send('user home page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('About user')
})

router.get('/listUsers', function (req, res) {
    console.log('__dirname:'+__dirname);
    fs.readFile( __dirname + "/json/users.json", 'utf8', function (err, data) {
        console.log('listUsers:', data );
        res.end( data );
    });
})

//添加的新用户数据
var user = {
    "user4" : {
        "name" : "mohit",
        "password" : "password4",
        "profession" : "teacher",
        "id": 4
    }
}
router.get('/addUser', function(req, res){
    // 读取已存在的数据
    fs.readFile( __dirname + "/json/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        data["user4"] = user["user4"];
        console.log( data );
        fs.writeFile(__dirname + '/json/users.json', JSON.stringify(data),  function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("数据写入成功！");
            console.log("--------我是分割线-------------")
            console.log("读取写入的数据！");
            fs.readFile(__dirname + "/json/" + "users.json", 'utf8', function (err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log("异步读取文件数据: " + data.toString());
                res.end( JSON.stringify(data));
            });
        });
    });
})

router.get('/showUser/:id', function(req, res){
    // 首先我们读取已存在的用户
    fs.readFile( __dirname + "/json/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        var user = data["user" + req.params.id] 
        console.log( user );
        res.end( JSON.stringify(user));
    });
})

router.get('/deleteUser/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/json/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        delete data["user" + req.params.id];
        
        console.log( data );
        res.end( JSON.stringify(data));
    });
})

module.exports = router

// function user(app) {
//     app.get('/user/listUsers', function (req, res) {
//         console.log('__dirname:'+__dirname);
//         fs.readFile( __dirname + "/json/users.json", 'utf8', function (err, data) {
//             console.log('listUsers:', data );
//             res.end( data );
//         });
//     })
    

//     app.get('/user/addUser', function (req, res) {
//         // 读取已存在的数据
//         fs.readFile( __dirname + "/json/" + "users.json", 'utf8', function (err, data) {
//             data = JSON.parse( data );
//             data["user4"] = user["user4"];
//             console.log( data );
//             fs.writeFile(__dirname + '/json/users.json', JSON.stringify(data),  function(err) {
//                 if (err) {
//                     return console.error(err);
//                 }
//                 console.log("数据写入成功！");
//                 console.log("--------我是分割线-------------")
//                 console.log("读取写入的数据！");
//                 fs.readFile(__dirname + "/json/" + "users.json", 'utf8', function (err, data) {
//                     if (err) {
//                         return console.error(err);
//                     }
//                     console.log("异步读取文件数据: " + data.toString());
//                     res.end( JSON.stringify(data));
//                 });
//             });
//         });
//     })

//     app.get('/user/showUser/:id', function (req, res) {
//         // 首先我们读取已存在的用户
//         fs.readFile( __dirname + "/json/" + "users.json", 'utf8', function (err, data) {
//             data = JSON.parse( data );
//             var user = data["user" + req.params.id] 
//             console.log( user );
//             res.end( JSON.stringify(user));
//         });
//     })

//     app.get('/user/deleteUser/:id', function (req, res) {
//         // First read existing users.
//         fs.readFile( __dirname + "/json/" + "users.json", 'utf8', function (err, data) {
//             data = JSON.parse( data );
//             delete data["user" + req.params.id];
            
//             console.log( data );
//             res.end( JSON.stringify(data));
//         });
//     })
// }
