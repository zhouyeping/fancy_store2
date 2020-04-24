const express = require('express');
const router = express.Router();
const api = require('../service/goodsService');

router.get("/queryAllGoods",async function(req,res,next){
    console.log("router start get goods");
    let result= await api.queryAllGoods();
    console.log("router end get goods");
    if( result === -1){
        res.json({
            status: false,
            msg: "获取商品列表"
        });
        return 0;
    }
    res.json(result);
});
router.get("/queryGoodsDetails",async function(req,res,next){
    if (!req.query.id){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let id=parseInt(req.query.id);
    console.log("start get good by id  =="+id);
    let result=await api.queryGoodsDetails(id);
    console.log("end get good ");
    if(result== -1 ) {
        res.json({
            status: false,
            msg:"获取商品详情"
        });
        return 0;
    }
    res.json(result);
});
module.exports = router;