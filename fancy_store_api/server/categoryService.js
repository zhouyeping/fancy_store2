const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool=mysqlPool.pool;
module.exports = {
    async queryAllCategory(){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.category.queryAll, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let categoryList = result.map(function(item){
                            return {
                                cid: item.cid,
                                cname: item.cname
                            }
                        });
                        resolve(categoryList);
                    });
                }));
            })
        });
    },
  async qureyGoodsUnderCategory(){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.category.qureyGoodsUnderCategory, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let categoryList = result.map(function(item){
                            return {
                                id: item.id,
                                category_id: item.category_id,
                                sn: item.sn,
                                name: item.name,
                                keyword: item.keyword,
                                picture: item.picture,
                                tips: item.tips,
                                description: item.description,
                                content: item.content,
                                price: item.price,
                                stock: item.stock,
                                score: item.score,
                                is_on_sale: item.is_on_sale,
                                is_del: item.is_del,
                                is_free_shipping: item.is_free_shipping,
                                sell_count: item.sell_count,
                                comment: item.comment,
                                on_sale_time: item.on_sale_time,
                                create_time: item.create_time,
                                update_time: item.update_time,
                                cid: item.cid,
                                cname: item.cname
                            }
                        });
                        resolve(categoryList);
                    });
                }));
            })
        });
    },
}