
const express = require('express');
const router = express.Router();
const api = require('./api');
const fs = require('fs');



router.post("/register", (req, res, next) => {
    if(!req.body.username || !req.body.password || !req.body.password){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let userModel = {
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
    };
    let currentTimeStamp = (new Date()).getTime();
    userModel.registerTime = currentTimeStamp;
    userModel.lastLoginTime = 0;
    userModel.lastModifyTime = 0;

    userModel.isAdmin = 0;
    userModel.isDisabled = 0;

    if(api.register(userModel) === -1){
        console.log("注册用户失败");
        res.json({
            status: false,
            msg: "注册失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "注册成功"
    })
});


router.post("/login", async function(req, res, next){
    if (!req.body.username || !req.body.password){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let userId = await api.login(req.body.username, req.body.password);
    if (userId === -1){
        console.log("登录失败");
        res.json({
            status: false,
            msg: "登录失败"
        });
        return 0;
    }
    req.session.userinfo = {
        username: req.body.username,
        userId: userId
    };
    res.json({
        status: true,
        msg: "登录成功"
    })
});


router.post("/logout", function(req, res, next){
    delete req.session.userinfo;
    res.json({
        status: true,
        msg: "退出成功"
    });
});


router.get("/admin-info", function(req, res, next){
    res.json({
        username: req.session.userinfo.username
    });
});


router.get("/article/query", async function(req, res, next){

    if (!req.query.page || !req.query.limit || req.query.searchContent === undefined ||
        req.query.createTime === undefined || req.query.partId === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    req.query.page = parseInt(req.query.page);
    req.query.limit = parseInt(req.query.limit);
    let queryCondition = {
        offset: (req.query.page - 1) * (req.query.limit),
        limit: req.query.limit
    };
    if (req.query.partId !== "all"){
       queryCondition.partId = parseInt(req.query.partId);
    }
    if (req.query.searchContent !== ""){
        queryCondition.searchContent = req.query.searchContent;
    }
    if (req.query.createTime !== "all"){
        req.query.createTime = JSON.parse(req.query.createTime);
        queryCondition.createTime = {
            startTime: req.query.createTime.startTime,
            endTime: req.query.createTime.endTime
        }
    }
    console.log("router start get article");
    let result = await api.queryAllArticle(queryCondition);
    console.log("router end get article");
    if( result === -1){
        res.json({
            status: false,
            msg: "获取文章列表失败"
        });
        return 0;
    }
    res.json(result);
});


router.get("/article/article-detail", async function(req, res, next){
    if (!req.query.articleId){
        res.json({
           status: false,
           msg: "请求参数错误"
        });
    }
    let articleDetail = await api.queryArticleDetail(req.query.articleId);
    if (articleDetail === -1){
        res.json({
            status: false,
            msg: "获取文章详情失败"
        });
        return 0;
    }
    res.json(articleDetail);
});


router.post("/article/add", async function(req, res, next){
    console.log(req.body);
    if (!req.body.title || !req.body.content || !req.body.partId ||
        !req.body.rewardPoint || req.body.description === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let articleModel = {
        title: req.body.title,
        content: req.body.content,
        partId: req.body.partId,
        viewTimes: 0,
        rewardPoint: req.body.rewardPoint,
        description: req.body.description
    };
    // 获取登录用户
    articleModel.authorId = req.session.userinfo.userId;

    let currentTime = Math.round(new Date / 1000);
    articleModel.createTime = currentTime;
    articleModel.lastEditTime = currentTime;
    if (await api.insertArticle(articleModel) === -1){
        res.json({
            status: false,
            msg: "添加文章失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "添加文章成功"
    })
});


router.post("/article/update", async function (req, res, next) {
    if (!req.body.title || !req.body.content || !req.body.rewardPoint || !req.body.articleId ||
        !req.body.description){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let articleModel = {
        title: req.body.title,
        content: req.body.content,
        rewardPoint: req.body.rewardPoint,
        articleId: req.body.articleId,
        description: req.body.description
    };
    let currentTime = (new Date()).getTime();
    articleModel.lastEditTime = currentTime;

    if (await api.updateArticle(articleModel) === -1){
        res.json({
            status: false,
            msg: "修改文章内容失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "修改文章内容成功"
    });
});


router.post("/article/delete/",async  function(req, res, next){
    if (!req.body.articleId){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    if(await api.deleteArticle(req.body.articleId) === -1){
        res.json({
            status: false,
            msg: "删除文章失败"
        });
        return -1;
    }
    res.json({
        status: true,
        msg: "删除文章成功"
    })
});


router.get("/learn-part/query", async function(req, res, next){
    let result = await api.queryAllLearnPart();
    if (result === -1){
        res.json({
            status: false,
            msg: "获取专区列表失败"
        });
        return 0;
    }
    res.json(result);
});


router.post("/learn-part/add", async function(req, res, next){
    if (req.body.partName === undefined || req.body.credit === undefined
        || req.body.rewardPoint === undefined){
        res.json({
            status: false, msg: "请求参数错误"
        });
        return 0;
    }
    let partModel = {
        partName: req.body.partName,
        credit: req.body.credit,
        rewardPoint: req.body.rewardPoint
    };
    partModel.addTime = Math.round(new Date / 1000);
    partModel.authorId = req.session.userinfo.userId;

    if (await api.insertLearnPart(partModel) === -1){
        res.json({
            status: false,
            msg: "添加学习专区失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "添加学习专区成功"
    })
});

router.post("/learn-part/update", async function(req, res, next){
    if (req.body.partName === undefined || req.body.partId === undefined ||
        req.body.credit === undefined || req.body.rewardPoint === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let partModel = {
        partName: req.body.partName,
        partId: req.body.partId,
        credit: req.body.credit,
        rewardPoint: req.body.rewardPoint
    };
    if (await api.updateLearnPart(partModel) === -1){
        res.json({
            status: false,
            msg: "修改学习专区失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "修改学习专区成功"
    });
});


router.post("/learn-part/delete", async function(req, res, next){
    if (req.body.partId === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    if (await api.deleteLearnPart(req.body.partId) === -1){
        res.json({
            status: false,
            msg: "删除学习专区失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "删除学习专区成功"
    })
});


router.get("/certificate/query", async function(req, res, next){
    let result = await api.queryAllCertificate();
    if (result === -1){
        res.json({
            status: false,
            msg: "获取证书列表失败"
        });
        return 0;
    }
    res.json(result);
});


router.post("/certificate/add", async function(req, res, next){
    if (!req.body.certificateName || req.body.getType === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let certificateModel = {
        certificateName: req.body.certificateName,
        getType: req.body.getType,
        addTime: 0
    };
    // 获取当前登录用户
    certificateModel.userId = req.session.userinfo.userId;
    console.log(certificateModel);

    if (await api.insertCertificate(certificateModel) === -1){
        res.json({
            status: false,
            msg: "添加证书失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "添加证书成功"
    })
});


router.post("/certificate/update", async function(req, res, next){
    if (!req.body.certificateName || !req.body.certificateId || req.body.getType === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let certificateModel = {
        certificateName: req.body.certificateName,
        getType: req.body.getType,
        certificateId: req.body.certificateId
    };
    if (await api.updateCertificate(certificateModel) === -1){
        res.json({
            status: false,
            msg: "修改证书失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "修改证书成功"
    });
});


router.post("/certificate/delete", async function(req, res, next){
    if (!req.body.certificateId){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    if (await api.deleteCertificate(req.body.certificateId) === -1){
        res.json({
            status: false,
            msg: "删除证书失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "删除证书成功"
    });
});


router.get("/user/query", async function(req, res, next){
    if (!req.query.page || !req.query.limit){
        res.json({
            status: false,
            msg: "参数请求错误"
        });
        return 0;
    }
    req.query.page = parseInt(req.query.page);
    req.query.limit = parseInt(req.query.limit);
    let offset = (req.query.page - 1) * req.query.limit;
    let limit = req.query.limit;
    let result = await api.queryAllUser(offset, limit);
    if (result === -1){
        res.json({
            status: false,
            msg: "获取用户列表失败"
        });
        return 0;
    }
    res.json(result);
});


router.post("/user/add", async function(req, res, next){
    if (!req.body.username || !req.body.password || !req.body.phone ||
        req.body.isAdmin === undefined || req.body.isDisable === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let userModel = {
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        isDisable: req.body.isDisable,
        registerTime: Math.round(new Date / 1000),
        lastLoginTime: 0,
        lastModifyTime: 0
    };

    if (await api.insertUser(userModel) === -1){
        res.json({
            status: false,
            msg: "添加用户失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "添加用户成功"
    })

});


router.post("/user/update", async function(req, res, next){
    if (!req.body.username || !req.body.password || !req.body.phone ||
        req.body.userId === undefined || req.body.isAdmin === undefined ||
        req.body.isDisable === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let userModel = {
        userId: req.body.userId,
        isAdmin: req.body.isAdmin,
        isDisable: req.body.isDisable,
        username: req.body.username,
        password: req.body.password,
        phone: req.body.phone
    };
    userModel.lastModifyTime = Math.round(new Date / 1000);
    if(await api.updateUser(userModel) === -1){
        res.json({
            status: false,
            msg: "更新用户失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "更新用户成功"
    });
});


router.post("/user/delete", async function(req, res, next){
    if (!req.body.userId){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    if (await api.deleteUser(req.body.userId) === -1){
        res.json({
            status: false,
            msg: "删除用户失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "删除用户成功"
    });
});


router.get("/file/query", async function(req, res, next){
    if (!req.query.page || !req.query.limit){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    req.query.page = parseInt(req.query.page);
    req.query.limit = parseInt(req.query.limit);
    let fileList = await api.queryAllUploadFile((req.query.page - 1) * req.query.limit, req.query.limit);
    if (fileList === -1){
        res.json({
            status: false,
            msg: "获取文件列表失败"
        });
        return 0;
    }
    res.json(fileList);
});


router.get("/exam/query", async function(req, res, next){
    if (!req.query.page || !req.query.limit || req.query.partId === undefined ||
        req.query.searchContent === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    req.query.page = parseInt(req.query.page);
    req.query.limit = parseInt(req.query.limit);
    let queryCondition = {
        offset: (req.query.page - 1) * req.query.limit,
        limit: req.query.limit,
    };
    if (req.query.partId !== "all"){
        queryCondition.partId = req.query.partId;
    }
    if (req.query.searchContent !== ""){
        queryCondition.searchContent = req.query.searchContent;
    }
    let examList = await api.queryAllExam(queryCondition);
    if (examList === -1){
        res.json({
            status: false,
            msg: "获取试题列表失败"
        });
        return 0;
    }
    res.json(examList);
});


router.post("/exam/add", async function(req, res, next){
    if (!req.body.examTitle || !req.body.examTime || !req.body.partId ||
        req.body.questions === undefined){
        console.log(req.body);
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let examModel = {
        questions: req.body.questions,
        examTitle: req.body.examTitle,
        partId: req.body.partId,
        examTime: req.body.examTime
    };

    if (await api.insertExam(examModel) === -1){
        res.json({
            status: false,
            msg: "添加考试失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "添加考试成功"
    })

});


router.get("/exam/detail", async function(req, res, next){
    if (req.query.examId === undefined){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let examInfo = await api.queryExamDetail(parseInt(req.query.examId));
    if (examInfo === -1){
        res.json({
            status: false,
            msg: "获取试题详情失败"
        });
        return 0;
    }
    res.json(examInfo);
});

module.exports = router;