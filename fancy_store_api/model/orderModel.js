const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool = mysqlPool.pool;


module.exports = {

    /**
     * 查询用户订单列表
     * @returns {Promise<void>}
     */
    async queryOrderList(offset, limit, userId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                /* 考虑这个地方的resolve问题 */
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.orders.queryAllByUid, [userId, offset, limit], function(err, result){
                        if (err){
                            console.log(err);
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
     *  查询用户订单详情
     * @param orderId
     * @returns {Promise<void>}
     */
    async queryOrderDetail(orderId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.orders.queryDetailByOid, [orderId], function(err, result){
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
     *  添加订单
     * @param orderModel
     * @returns {Promise<void>}
     */
    async addOrder(orderModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    let insertData = [
                        orderModel.oid,
                        orderModel.uid,
                        orderModel.product_id,
                        orderModel.num,
                        orderModel.create_time,
                        orderModel.update_time,
                        orderModel.status_code,
                    ]
                    connection.query(sqlMap.orders.insert, insertData, function(err, result){
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