const express = require('express');
const router = express.Router();
const OrderService = require("../service/orderService")
const CartService  = require('../service/cartService')
const GoodsService = require("../service/goodsService")
const CategoryService  = require('../service/categoryService')
const UserService = require("../service/userService")

/* 查询商品名称 */
router.get('/goods/query-list', function(req, res, next){
    GoodsService.queryAllGoods(req, res, next)
})

/* 查询商品详情 */
router.get('/goods/query-detail', function(req, res, next){
    GoodsService.queryGoodsDetails(req, res, next)
})

/* 查询商品分类及商品详情 */
router.get('/category/query-list', function(req, res, next){
    CategoryService.qureyGoodsUnderCategory(req, res, next)
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

/* 修改购物车商品的数量 */
router.post("/cart/modify", function(req, res, next){
    CartService.modifyCartGoodsNum(req, res, next)
})

/* 从购物车中删除商品 */
router.post('/cart/delete', function(req, res, next){
    CartService.removeGoodsFromCart(req, res, next)
})

/* 用户登录 */
router.post('/login', function(req, res, next){
    UserService.login(req, res, next)
})

/* 用户注册 */
router.post('/register', function(req, res, next){
    UserService.register(req, res, next)
})

module.exports = router
