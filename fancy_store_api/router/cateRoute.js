const express = require('express');
const router = express.Router();
const api = require('../server/categoryService');

router.get("/queryAllCategory",async function(req,res,next){
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
        console.log("router start get categrory");
        let result= await api.queryAllCategory(queryCondition);
        console.log("router end get categrory");
        if( result === -1){
            res.json({
                status: false,
                msg: "获取商品列表失败"
            });
            return 0;
        }
        res.json(result);
});
router.get("/qureyGoodsUnderCategory",async function(req,res,next){
        console.log("router start get categrory");
        let result= await api.qureyGoodsUnderCategory();
        console.log("router end get categrory");
        if( result === -1){
            res.json({
                status: false,
                msg: "获取商品列表下商品失败"
            });
            return 0;
        }
        res.json(result);
});
module.exports = router;
