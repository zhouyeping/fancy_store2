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
    async queryCartDetail(offset, limit, userId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.cart.queryDetailByUid, [userId, offset, limit], function(err, result){
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
    }
}