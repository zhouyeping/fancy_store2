const OrderModel = require('../model/orderModel')
const CartModel = require("../model/cartModel")

function generateOid(len){
    len = len || 20
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let randomStr = ''
    for (let i = 0; i < len; i ++){
        randomStr += chars[Math.floor(Math.random() * chars.length)]
    }
    return randomStr
}

module.exports = {

    /**
     *  查询用户的订单列表
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async queryUserOrders(req, res, next){
        if (req.query.page === undefined || req.query.limit === undefined){
            console.log('params error: ', req.query)
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

        let orderList = await OrderModel.queryOrderList(offset, limit, userId)
        if (orderList === -1){
            console.log("获取订单列表失败")
            res.json({
                status: false,
                msg: '获取订单列表失败'
            })
            return 0
        }
        res.json({
            status: true,
            data: orderList
        })
    },

    /**
     *  查询用户的订单详情
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async queryOrderDetail(req, res, next){
        if (req.query.order_id === undefined){
            console.log("params error: ", req.query)
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }

        let orderDetail = await OrderModel.queryOrderDetail(req.query.order_id)
        if (orderDetail === -1){
            console.log("获取订单详情失败")
            res.json({
                status: false,
                msg: "获取订单详情失败"
            })
            return 0
        }
        res.json({
            status: true,
            data: orderDetail
        })
    },


    /**
     *  添加订单
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async addOrder(req, res, next){
        if (req.body.product_list === undefined){
            console.log("params error: ", req.body)
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }
        req.body.product_list.forEach(function(item){
            if (item.product_id === undefined || item.num === undefined){
                res.json({
                    status: false,
                    msg: "请求参数错误"
                })
                return 0
            }
        })
        req.body.product_list.forEach(async function(item){
            let orderModel = {
                oid: generateOid(20),
                uid: req.session.userinfo.uid,
                product_id: item.product_id,
                num: item.num,
                create_time: Math.round( new Date / 1000, 3),
                update_time: Math.round( new Date / 1000, 3),
                status_code: 0
            }
            let insertRet = await OrderModel.addOrder(orderModel)
            if (insertRet === -1){
                console.log("插入订单失败")
                res.json({
                    status: false,
                    msg: "提交订单失败"
                })
                return 0
            }

            /* 删除购物车的商品记录 */
            let removeCartGoodRet = await CartModel.deleteGoodsFromCart(req.session.userinfo.uid, item.product_id)
            if (removeCartGoodRet === -1){
                console.log("删除购物车记录失败")
                res.json({
                    status: false,
                    msg: "提交订单失败"
                })
                return 0
            }
        })
        res.json({
            status: true,
            msg: "添加订单成功"
        })
    }

}