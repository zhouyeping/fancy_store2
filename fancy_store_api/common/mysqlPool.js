const mysql = require('mysql');
const dbConfig = require('../config/db');
//exports.add
// 数据库连接池配置
module.exports = {
    pool:mysql.createPool({
        host: dbConfig.mysql.host,
        user: dbConfig.mysql.user,
        password: dbConfig.mysql.password,
        database: dbConfig.mysql.database,
        port: dbConfig.mysql.port,
        multipleStatements: true    // 多语句查询
    })
};
