const express = require('express');
const router = express.Router();
const OrderService = require("../service/orderService")
const CartService  = require('../service/cartService')

/* 查询用户订单列表 */
router.get('/order/query-list', function(req, res, next){
    OrderService.queryUserOrders(req, res, next)
})

/* 查询用户订单详情 */
router.get('/order/query-detail', function(req, res, next){
    OrderService.queryOrderDetail(req, res, next)
})

/* 添加订单 */
router.post('/order/add', function(req, res, next){
    OrderService.addOrder(req, res, next)
})


/* 查询用户购物差商品列表 */
router.get('/cart/query', function(req, res, next){
    CartService.queryUserCart(req, res, next)
})

/* 添加商品到购物车 */
router.post('/cart/add', function(req, res, next){
    CartService.addCart(req, res, next)
})

module.exports = router
