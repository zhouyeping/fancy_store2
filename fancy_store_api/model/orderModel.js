const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool = mysqlPool.pool;


module.exports = {

    /**
     * 查询用户订单列表
     * @returns {Promise<void>}
     */
    async queryOrderList(){

    },

    /**
     *  查询用户订单详情
     * @param orderId
     * @returns {Promise<void>}
     */
    async queryOrderDetail(orderId){


    },

    /**
     *  添加订单
     * @param orderModel
     * @returns {Promise<void>}
     */
    async addOrder(orderModel){


    }
}