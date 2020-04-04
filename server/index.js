const routerApi = require('./router');
const bodyParser = require('body-parser'); // post 数据是需要
const express = require('express');
const session = require("express-session");
const multer = require("multer");
const fs = require('fs');
const app = express();

const api = require('./api');
const cors = require('cors');

app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
// console.log(express.static('public'));
app.use(bodyParser.json());

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


let uploadFolder = './upload/upload-pic/';
let createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

createFolder(uploadFolder);
app.use(express.static(__dirname + "/upload/"));

// 通过 filename 属性定制
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        let timeStamp = Date.now();
        req.filename = file.fieldname + "-" +timeStamp;
        cb(null, file.fieldname + '-' + timeStamp + ".jpg");

    }
});

// 通过 storage 选项来对 上传行为 进行定制化
let upload = multer({ storage: storage });


let uploadPdf = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './upload/upload-pdf');    // 保存的路径，备注：需要自己创建
        },
        filename: function (req, file, cb) {
            // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
            let timeStamp = Date.now();
            req.filename = file.fieldname + "-" +timeStamp + ".pdf";
            cb(null, file.fieldname + '-' + timeStamp + ".pdf");
        }
    })
});


app.use(function(req, res, next){
    console.log(req.path);
    if (req.path !== "/api/login" && !req.session.userinfo){
        // 注意 == false 不能通过的问题
        res.json({
            status: false,
            msg: "请登录"
        });
        return 0;
    }else{
        next();
    }
});


app.post("/api/upload-pic", upload.single("articlePic"), function(req, res, next){
    // 需要返回上传文件路径
    console.log(req.filename);
    res.json({status: true, msg: "success", path: "/upload-pic/" + req.filename + ".jpg"});
});


app.post("/api/upload-pdf", uploadPdf.single("uploadPdf"), async function(req, res, next){
    console.log(req.body);
    let fileModel = {
        filename: req.filename,
        partId: req.body.partId,
        rewardPoint: req.body.rewardPoint,
        uploadTime: Math.round(new Date / 1000)
    };
    let insertRet = await api.insertUploadFile(fileModel);
    if (insertRet === -1){
        res.json({
            status: false,
            msg: "上传文件失败"
        });
        return 0;
    }
    res.json({status: true, msg: "上传文件成功"});
});


// 后端api路由
app.use('/api', routerApi);

// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');
