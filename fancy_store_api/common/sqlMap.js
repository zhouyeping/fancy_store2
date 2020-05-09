module.exports = {
    category: {
        queryAll: "select cid, cname from category",
        qureyGoodsUnderCategory:"select product_info.id,product_info.category_id,product_info.sn,product_info.name,"+
        "product_info.keyword,product_info.picture,product_info.tips,product_info.description,product_info.content,"+
        "product_info.price,product_info.stock,product_info.score,product_info.is_on_sale,product_info.is_del,"+
        "product_info.is_free_shipping,product_info.sell_count,product_info.comment,product_info.on_sale_time,"+
        "product_info.create_time,product_info.update_time,category.cid,category.cname "+
        "from product_info join category on product_info.category_id=category.cid",
        insert: "insert into category values(null, ?)",
        deleteById: "delete from category where cid = ?",
        updateById: "update category set cname = ? where cid = ?"
    },
    goods: {
        queryAll: "select id,category_id,name from product_info",
        queryGoodsDetails:"select id,category_id,sn,name,keyword,picture,tips,description,content,"+
        "+price,stock,score,is_on_sale,is_del,is_free_shipping,sell_count,comment,on_sale_time,create_time,update_time"+
        " from product_info where id=?",
        queryArticleCount: "select count(*) as total_count from product_info ",
        insert: "insert into product_info values(null,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        deleteById: "delete from product_info where id = ?",
        updateById: "update product_info set name = ?, comment = ?, price = ?, update_time = ?, on_sale_time = ? where id = ?"
    },
    orders:{
        queryAllByUid:"select * from orders where uid=? limit ?, ?",
        queryDetailByOid: "select * from orders where oid = ?",
        insert:"insert into orders values(null,?,?,?,?,?,?,?)"
    },
    cart: {
        queryDetailByUid: "select cart.cart_id, cart.u_id, cart.product_id, cart.price_count," +
        "cart.mprice_count, cart.sale_num, product_info.name, product_info.picture from cart left join product_info on " +
        "cart.product_id = product_info.id where cart.u_id = ?  limit ?,? ",
        queryDetailByProid: "select * from cart where u_id = ? and product_id = ?",
        insert: "insert into cart values(null, ?, ?, ?, ?, ?)",
        modifyGoodsNum: "update cart set sale_num = ?, mprice_count = ? where u_id = ? and product_id = ?",
        delete: "delete from cart where u_id = ? and product_id = ?"
    },
    user: {
        queryByOpenid: "select id, username, password from user where openid = ?",
        insert: "insert into user values(null,?,?,?,?,?,?,?,?)",
        queryByUserid: "select username, password, phone, id from user where id = ?"
    }
};