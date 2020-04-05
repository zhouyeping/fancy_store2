const cors=require('cors');
const bodyParser=require('body-parser');//解析表单
// 引入express框架
const express= require('express');
const app=express();
var mysql= require('mysql');
const session = require("express-session");
const port = 9999;//设置端口号，如果端口号被占用需要自己修改，否则无法跑起来(建议不要用80和8080，一般情况都会被占用)
app.listen(port, () => console.log(`http://127.0.0.1:${port}`));//打印一下接口用例地址

app.use(cors()); //解决跨域
app.use(bodyParser.json()); //json请求
app.use(bodyParser.urlencoded({extended:false})); //表单请求
//mysql连接池
const pool = mysql.createPool({
    host:'111.231.217.199' ,
    user:'root',
    password: 'syntaxNever763bee',
    database: 'fancy_store',
    port: '3306',
    multipleStatements: true    // 多语句查询
});
// 获取商品分类所有的数据
app.post('/fancy_store/category',(req,res) => {
    // 定义SQL语句
    const sqlStr = 'select * from category'
    pool.getConnection(function (err, connection) {
        if (err){
            console.log(err);
        }
        connection.query(sqlStr, function(err, result){
                if (err){
                    console.log(err);
                }
                res.json({
                    err_code:0,message:result[0],affectedRows:0
                })
            })
    })
});
//根据商品id获取商品分类数据
app.post('/fancy_store/categoryById',(req,res) => {
    const id = req.query.id;
    // 定义SQL语句
    const sqlStr = 'select * from category where cid = ? '
    pool.getConnection(function (err, connection) {
        if (err){
            console.log(err);
        }
        connection.query(sqlStr,id, function(err, result){
                if (err){
                    console.log(err);
                }
                res.json({
                    err_code:0,message:result[0],affectedRows:0
                })
            })
    })
})
