const sqlMap = require('../common/sqlMap');
const mysqlPool = require('../common/mysqlPool');
const pool = mysqlPool.pool;

module.exports =  {

    /**
     *  通过openID查找用户信息
     * @param openID
     * @returns {Promise<void>}
     */
    async queryUserInfoByOpenId(openID){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.user.queryByOpenid, [openID], function(err, result){
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
     *  向数据库中插入一条用户记录
     * @param userModel
     * @returns {Promise<any>}
     */
    async register(userModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection){
                if (err){
                    console.log(err)
                    return resolve(-1)
                }
                resolve(new Promise(function(resolve, reject){
                    let insertData = [
                        userModel.username,
                        userModel.password,
                        userModel.phone,
                        userModel.last_login_time,
                        userModel.last_modify_time,
                        userModel.register_time,
                        0,
                        userModel.openid
                    ]
                    connection.query(sqlMap.user.insert, insertData, function(err, result){
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
}

