const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool=mysqlPool.pool;
module.exports = {
    async queryAllGoods(){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.goods.queryAll, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let goodsList = result.map(function(item){
                            return {
                                id: item.id,
                                category_id: item.category_id,
                                name: item.name,
                            }
                        });
                        resolve(goodsList);
                    });
                }));
            })
        });
    },

    async queryGoodsDetails(id){
         return await new Promise(function(resolve,reject){
            pool.getConnection(function(err,connection){
                 if(err){
                     console(err);
                     resolve(-1);
                 }
                 resolve(new Promise(function(resolve,reject){
                        connection.query(sqlMap.goods.queryGoodsDetails,[id],function(err,result){
                            if(err){
                                console.log(err);
                                resolve(-1);
                            }
                            let goodsDetail=result.map(function(res){
                                  return{
                                    id:res.id,
                                    category_id:res.category_id,
                                    sn:res.sn,
                                    name:res.name,
                                    keyword:res.keyword,
                                    picture:res.picture,
                                    tips:res.tips,
                                    description:res.description,
                                    content:res.content,
                                    price:res.price,
                                    stock:res.stock,
                                    score:res.score,
                                    is_on_sale:res.is_on_sale,
                                    is_del:res.is_del,
                                    is_free_shipping:res.is_free_shipping,
                                    sell_count:res.sell_count,
                                    comment:res.comment,
                                    on_sale_time:res.on_sale_time,
                                    create_time:res.create_time,
                                    update_time:res.update_time
                                  }
                            });
                            resolve(goodsDetail);
                        });
                 }));
            });
         });
    },


}