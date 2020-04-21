const cateRouter = require('./router/cateRoute');
const goodsRouter = require('./router/goodsRoute');
const orderRouter = require('./router/orderRoute');
const bodyParser = require('body-parser'); // post 数据是需要
const express = require('express');
const session = require("express-session");
const multer = require("multer");
const fs = require('fs');
const app = express();

const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); //'content-type': 'application/x-www-form-urlencoded'
app.use(session({
    secret: 'this is string key',   // 可以随便写。 一个 String 类型的字符串，作为服务器端生成 session 的签名


    name:'session_id',/*保存在本地cookie的一个名字 默认connect.sid  可以不设置*/
    resave: false,   /*强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。*/
    saveUninitialized: true,   //强制将未初始化的 session 存储。  默认值是true  建议设置成true
    cookie: {
        maxAge:1000 * 3600    /*过期时间 一个小时*/

    },   /*secure https这样的情况才可以访问cookie*/

    //设置过期时间比如是30分钟，只要游览页面，30分钟没有操作的话在过期

    rolling:true //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）/
}));
//配置express中间件

// 全局拦截配置CROS
app.all('*',function(req,res,next){
	res.header('Access-Control-Allow-origin','*')
	res.header('Access-Control-Allow-Headers','accept, origin, X-Requested-With, content-type, token, userId')
	res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS')
	res.header('Content-Type','application/json;charset=utf-8')
	res.header('Access-Control-Allow-Credentials','true')
	next()
})
// 错误处理中间件



// 路由列表
app.use('/cateRoute', cateRouter)
app.use('/goodsRoute', goodsRouter)
app.use('/orderRoute',orderRouter)

app.listen(3000);
console.log('success listen at port:3000......');
