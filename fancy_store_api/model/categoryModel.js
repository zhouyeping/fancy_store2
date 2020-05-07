const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool = mysqlPool.pool;


module.exports = {
    /**
     * 根据商品分类cid 获取商品分类下商品详情
     * @param cid
     * @returns {Promise<any>}
     */
    async queryGoodsDetails(cid){
        return await new Promise(function(resolve,reject){
           pool.getConnection(function(err,connection){
                if(err){
                    console(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve,reject){
                       connection.query(sqlMap.goods.queryGoodsDetails,[cid],function(err,result){
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
    /**
     * 根据商品分类及商品分类下商品详情
     * @param null
     * @returns {Promise<any>}
     */
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