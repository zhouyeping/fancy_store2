const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool = mysqlPool.pool;

module.exports = {

    /**
     * 根据商品id 获取商品详情
     * @param product_id
     * @returns {Promise<any>}
     */
    async queryGoodDetail(product_id){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.goods.queryGoodsDetails, [product_id], function(err, result){
                        if (err){
                            console.log(err)
                            return resolve(-1)
                        }
                        if (result.length && result.length === 0){
                            console.log("product_id error: ", product_id)
                            return resolve(-1)
                        }
                        resolve(result[0])
                        connection.release()
                    })
                }))
            })
        })
    }
}
