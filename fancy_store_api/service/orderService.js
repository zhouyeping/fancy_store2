const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool=mysqlPool.pool;
module.exports = {
    async addTheOrder(orderModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                let insertData=[
                      orderModel.oid,
                      orderModel.uid,
                      orderModel.product_id,
                      orderModel.num,
                      orderModel.create_time,
                      orderModel.update_time,
                      orderModel.status_code
                ]
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.orders.insert,insertData,function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result);
                    });
                }));
            })
        });
    }

}