const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool = mysqlPool.pool;

module.exports = {

    /**
     *  添加商品到购物车
     * @param cartModel
     * @returns {Promise<void>}
     */
    async addToCart(cartModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                let insertData = [
                    cartModel.u_id,
                    cartModel.product_id,
                    cartModel.price_count,
                    cartModel.mprice_count,
                    cartModel.sale_num
                ]
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.cart.insert, insertData, function(err, result){
                        if (err){
                            console.log(err)
                            return resolve(-1)
                        }
                        resolve(result)
                        connection.release()
                    })
                }))
            })
        })
    },

    /**
     *  查询购物车商品列表
     * @param cartId
     * @returns {Promise<void>}
     */
    async queryCartDetail(offset, limit, userId) {
        return await new Promise(function (resolve, reject) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function (resolve, reject) {
                    connection.query(sqlMap.cart.queryDetailByUid, [userId, offset, limit], function (err, result) {
                        if (err) {
                            console.log(err)
                            return resolve(-1)
                        }
                        resolve(result)
                        connection.release()
                    })
                }))
            })
        })
    },

    /**
     *  修改购物车商品的数量
     * @param sale_num
     * @param mprice
     * @param user_id
     * @param product_id
     * @returns {Promise<any>}
     */
    async modifyGoodsNumber(sale_num, mprice, user_id, product_id){
        /* 其实直接返回一个promise也可以 */
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if(err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.cart.modifyGoodsNum,[sale_num, mprice, user_id, product_id], function(err, result){
                        if (err){
                            console.log(err)
                            return resolve(-1)
                        }
                        resolve(0)
                        connection.release()
                    })
                }))
            })
        })
    },

    /**
     *  查询用户购物车里面的某个商品的详情
     * @param userId
     * @param productId
     * @returns {Promise<void>}
     */
    async queryCartGoodDetail(userId, productId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.cart.queryDetailByProid, [userId, productId], function(err, result){
                        if(err){
                            console.log(err)
                            return resolve(-1)
                        }
                        if(result.length === 0){
                            console.log("未在用户: " + userId + "的购物车中找到商品：" + productId)
                            return resolve(-1)
                        }
                        resolve(result[0])
                        connection.release()
                    })
                }))
            })
        })
    },

    /**
     *  从用户的购物车中删除商品
     * @param userId
     * @param productId
     * @returns {Promise<any>}
     */
    async deleteGoodsFromCart(userId, productId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.cart.delete, [userId, productId], function(err, result){
                        if (err){
                            console.log(err)
                            return resolve(-1)
                        }
                        resolve(0)
                        connection.release()
                    })
                }))
            })
        })
    }

}