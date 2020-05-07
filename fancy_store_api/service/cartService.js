const CartModel = require('../model/cartModel')
const GoodModel = require('../model/goodsModel')

module.exports = {

    /**
     *  查询用户的购物车详情
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async queryUserCart(req, res, next){
        if (req.query.page === undefined || req.query.limit === undefined){
            console.log(req.query)
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }
        req.query.page = parseInt(req.query.page)
        req.query.limit = parseInt(req.query.limit)

        let limit = req.query.limit
        let offset = limit * (req.query.page - 1)
        let userId = req.session.userinfo.uid

        let cartDetail = await CartModel.queryCartDetail(offset, limit, userId)

        if (cartDetail === -1){
            console.log("获取购物车详情失败")
            res.json({
                status: false,
                msg: "获取购物车详情失败"
            })
            return 0
        }
        res.json({
            status: true,
            data: cartDetail
        })
    },


    /**
     *  添加商品到购物车
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async addCart(req, res, next){
        if (req.body.product_id === undefined || req.body.sale_num === undefined){
            console.log(req.body)
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }

        let goodDetail = await GoodModel.queryGoodDetail(req.body.product_id)
        if (goodDetail === -1){
            console.log("获取商品详情失败")
            res.json({
                status: false,
                msg: "获取商品价格失败"
            })
            return 0
        }

        let cartModel = {
            u_id: req.session.userinfo.uid,
            product_id: req.body.product_id,
            price_count: goodDetail.price ,
            sale_num: req.body.sale_num,
            mprice_count: req.body.sale_num * goodDetail.price
        }

        let insertRet = await CartModel.addToCart(cartModel)
        if (insertRet === -1){
            console.log('添加购物车失败')
            res.josn({
                status: false,
                msg: "添加购物车失败"
            })
            return 0
        }
        res.json({
            status: true,
            msg: "添加购物车成功"
        })
    },

    /**
     *  修改购物车商品的数量
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async modifyCartGoodsNum(req, res, next){
        if (req.body.product_id === undefined || req.body.sale_num === undefined){
            console.log(req.body)
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }

        console.log(typeof req.body.product_id)

        let goodDetail = await CartModel.queryCartGoodDetail(req.session.userinfo.uid, req.body.product_id)
        if (goodDetail === -1){
            console.log("获取购物车商品详情失败")
            res.json({
                status: false,
                msg: "获取购物车商品价格失败"
            })
            return 0
        }

        let modifyRet = await CartModel.modifyGoodsNumber(
            goodDetail.sale_num + req.body.sale_num,
            goodDetail.mprice_count + req.body.sale_num * goodDetail.price_count,
            req.session.userinfo.uid, req.body.product_id
        )

        if (modifyRet === -1){
            res.json({
                status: false,
                msg: "修改购物车商品失败"
            })
            return 0
        }
        res.json({
            status: true,
            msg: "修改购物车商品成功"
        })
    },

    /**
     *  删除购物车中的商品
     * @param req
     * @param res
     * @param next
     * @returns {Promise<number>}
     */
    async removeGoodsFromCart(req, res, next){
        if (req.body.product_ids === undefined){
            res.json({
                status: false,
                msg: "参数错误"
            })
            return 0
        }

        let productIds = req.body.product_ids

        /*
        productIds.forEach(function(productId){
            // 又涉及到了这个地方
        })
        */

        for (let i = 0, len = productIds.length; i < len; i ++){
            let removeRet = await CartModel.deleteGoodsFromCart(req.session.userinfo.uid, productIds[i])
            if (removeRet === -1){
                res.json({
                    status: false,
                    msg: "移除商品失败"
                })
                return
            }
        }

        res.json({
            status: true,
            msg: "移除商品成功"
        })
    }

}
