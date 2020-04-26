const express = require('express');
const router = express.Router();
const api = require('../service/orderService');

router.post("/add",async function(req,res,next){
    console.log(req.body);
    if (!req.body.oid || !req.body.product_id || !req.body.status_code ||!req.body.update_time){
        res.json({
            status: false,
            msg: "请求参数错误"
        });
        return 0;
    }
    let orderModel = {
        oid: req.body.oid,
        product_id: req.body.product_id,
        num:req.body.num,
        status_code: req.body.status_code,
        update_time: req.body.update_time
    };
    // 获取登陆用户（当前写死，前端传入）
    //articleModel.uid = req.session.userinfo.userId;
    orderModel.uid = req.body.uid;

    let currentTime = Math.round(new Date / 1000);
    orderModel.create_time = currentTime;
    if (await api.addTheOrder(orderModel) === -1){
        res.json({
            status: false,
            msg: "添加订单失败"
        });
        return 0;
    }
    res.json({
        status: true,
        msg: "成功添加订单"
    })
});
module.exports=router;