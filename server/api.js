
const mysql = require('mysql');
const dbConfig = require('./config');
const sqlMap = require('./sqlMap');

const pool = mysql.createPool({
    host: dbConfig.mysql.host,
    user: dbConfig.mysql.user,
    password: dbConfig.mysql.password,
    database: dbConfig.mysql.database,
    port: dbConfig.mysql.port,
    multipleStatements: true    // 多语句查询
});


/* 并没有什么用处 */
function helper(array1, k) {
    let res = [];
    if (k === 0) {
        res.push([]);
        return res;
    }
    if (k > array1.length) {
        return res;
    }
    let temp1 = helper(array1.slice(1), k);
    for (let tem of temp1) {
        if (tem.length === k) {
            res.push(tem);
        }
    }
    let temp2 = helper(array1.slice(1), k - 1);
    for (let tem of temp2) {
        if (tem.length + 1 === k) {
            tem.unshift(array1[0]);
            res.push(tem);
        }
    }
    return res;
}


module.exports = {
    async register(userModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let insertInfo = [
                        userModel.username, userModel.password, userModel.phone, userModel.lastLoginTime,
                        userModel.lastModifyTime, userModel.registerTime, userModel.isAdmin, userModel.isDisabled
                    ];
                    connection.query(sqlMap.user.insert, insertInfo, function(err, result){
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result);
                        connection.release();
                    });
                }));
            })
        });
    },

    async login(username, password){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.user.queryPasswordByUsername, [username], function(err, result){
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        if (result.length === 0){
                            console.log("找不到用户" + username);
                            resolve(-1);
                            return ;
                        }
                        let dbPassword = result[0].password;
                        if (password !== dbPassword){
                            console.log("输入的密码有误" + password);
                            resolve(-1);
                            return ;
                        }
                        resolve(result[0].id);
                        connection.release();
                    });
                }));
            })
        });

    },

    async queryAllLearnPart(){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.learnPart.queryAll, [], function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let learnPartList = result.map(function(item){
                            return {
                                credit: item.credit,
                                partId: item.id,
                                partName: item.part_name,
                                rewardPoint: item.reward_point
                            }
                        });
                        resolve(learnPartList);
                    });
                }));
            })
        });
    },
    async insertLearnPart(learnPartModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let insertInfo = [
                        learnPartModel.partName,
                        learnPartModel.addTime,
                        learnPartModel.authorId,
                        learnPartModel.credit,
                        learnPartModel.rewardPoint
                    ];
                    connection.query(sqlMap.learnPart.insert, insertInfo, function(err, result){
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

    },
    async updateLearnPart(learnPartModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let updateModel = [
                        learnPartModel.partName,
                        learnPartModel.credit,
                        learnPartModel.rewardPoint,
                        learnPartModel.partId
                    ];
                    connection.query(sqlMap.learnPart.updateById, updateModel, function(err, result){
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

    },
    async deleteLearnPart(learnPartId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.learnPart.deleteById, [learnPartId], function(err, result){
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

    },

    async queryAllArticle(queryCondition){
        /* 这个地方会处理sql语句的变化 */
        console.log(queryCondition);
        let queryData = [];
        let querySQL = sqlMap.article.queryAll;
        let queryTotalCountSQL = sqlMap.article.queryArticleCount;
        let existBeforeConditionFlag = false;
        if (queryCondition.hasOwnProperty("createTime")){
            querySQL += "where create_time between ? and ? ";
            queryTotalCountSQL += "where create_time between ? and ? ";
            queryData.push(queryCondition.createTime.startTime, queryCondition.createTime.endTime);
            existBeforeConditionFlag = true;
        }
        if (queryCondition.hasOwnProperty("partId")){
            if (existBeforeConditionFlag){
                querySQL += " and ";
                queryTotalCountSQL += " and ";
            }else{
                querySQL += " where ";
                queryTotalCountSQL += " where ";
            }
            querySQL += " part_id = ?";
            queryTotalCountSQL += " part_id = ?";
            queryData.push(queryCondition.partId);
            if (!existBeforeConditionFlag){
             existBeforeConditionFlag = true;
            }
        }
        if (queryCondition.hasOwnProperty("searchContent")){
            if (existBeforeConditionFlag){
                querySQL += " and ";
                queryTotalCountSQL += " and "
            }else {
                querySQL += " where ";
                queryTotalCountSQL += " where ";
            }
            querySQL += "title like ?";
            queryTotalCountSQL += "title like ?";
            queryData.push('%' + queryCondition.searchContent + '%')
        }



        querySQL += " order by create_time desc limit ?, ?";
        queryData.push(queryCondition.offset, queryCondition.limit);

        let articleList = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(querySQL, queryData, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let articleList = result.map(function(item){

                            return {
                                articleId: item.id,
                                title: item.title,
                                content: item.content,
                                partId: item.part_id,
                                authorId: item.author_id,
                                createTime: item.create_time,
                                lastEditTime: item.last_edit_time,
                                viewTimes: item.view_times,
                                rewardPoint: item.reward_point,
                                description: item.description
                            }
                        });
                        resolve(articleList);
                    });
                }));
            });
        });

        let totalCount = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(queryTotalCountSQL, queryData, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result[0].total_count);
                    });
                }));
            });
        });
        return {
            articleList,
            totalCount
        }
    },
    async queryArticleDetail(articleId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.article.queryArticleDetail, [articleId], function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        result = result[0];
                        resolve({
                            articleId: result.id,
                            title: result.title,
                            content: result.content,
                            partId: result.part_id,
                            authorId: result.author_id,
                            createTime: result.create_time,
                            lastEditTime: result.last_edit_time,
                            viewTimes: result.view_times,
                            rewardPoint: result.reward_point,
                            description: result.description
                        });
                    });
                }));
            })
        });

    },
    async insertArticle(articleModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let insertData = [
                        articleModel.title,
                        articleModel.content,
                        articleModel.partId,
                        articleModel.authorId,
                        articleModel.createTime,
                        articleModel.lastEditTime,
                        articleModel.viewTimes,
                        articleModel.rewardPoint,
                        articleModel.description
                    ];
                    connection.query(sqlMap.article.insert, insertData, function(err, result){
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

    },
    async updateArticle(articleModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let updateData = [
                        articleModel.title,
                        articleModel.content,
                        articleModel.lastEditTime,
                        articleModel.rewardPoint,
                        articleModel.articleId,
                        articleModel.description
                    ];
                    connection.query(sqlMap.article.updateById, updateData, function(err, result){
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

    },
    async deleteArticle(articleId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.article.deleteById, [articleId], function(err, result){
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

    },
    async updateArticleViewTimes(viewTimes, articleId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.article.updateViewTimes, [viewTimes, articleId], function(err, result){
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

    },

    async queryAllCertificate(){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.certificate.queryAll, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let certificateList = result.map(function(item){
                            return {
                                certificateId: item.id,
                                certificateName: item.certificate_name,
                                userId: item.user_id,
                                addTime: item.add_time,
                                getType: item.get_type
                            }
                        });
                        resolve(certificateList);
                    });
                }));
            })
        });

    },
    async insertCertificate(certificateModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let insertData = [
                        certificateModel.certificateName,
                        certificateModel.addTime,
                        certificateModel.getType,
                        certificateModel.userId
                    ];
                    connection.query(sqlMap.certificate.insert, insertData, function(err, result){
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


    },
    async updateCertificate(certificateModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let updateData = [
                        certificateModel.certificateName,
                        certificateModel.getType,
                        certificateModel.certificateId
                    ];
                    connection.query(sqlMap.certificate.updateById, updateData, function(err, result){
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

    },
    async deleteCertificate(certificateId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.certificate.deleteById, [certificateId], function(err, result){
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

    },

    async queryAllUser(offset, limit){
        /*
         return await pool.getConnection(async function (err, connection){
            return await connection.query(sqlMap.user.queryAll, [offset, limit], (err, result) => {
                if (err){
                    console.log(err);
                    return -1;
                }
                console.log(result);
                return result;
            })
        })
         */

        /* await pool.getConnection(function(err, connection){

            let data = [{username: "abc"}];
            connection.query(sqlMap.user.queryAll,[offset, limit], function(err, result){

            });
            result = data;
        }); */

        /*
        return await new Promise(function(resolve, reject){
            setTimeout(function(){
                let result = [{username: "abc"}];
                resolve(result);
            }, 1000);
        }); */

        let userList = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.user.queryAll, [offset, limit], function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let userList = result.map(function(item){
                            return {
                                userId: item.id,
                                username: item.username,
                                password: item.password,
                                phone: item.phone,
                                isAdmin: item.is_admin,
                                isDisable: item.is_disabled,
                                lastLoginTime: item.last_login_time,
                                lastModifyTime: item.last_modify_time,
                                registerTime: item.register_time
                            }
                        });
                        resolve(userList);
                    });
                }));
            })
        });

        let totalCount = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.user.queryUserCount, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result[0].total_count);
                    });
                }));
            })
        });
        return {
            userList,
            totalCount
        }
    },

    async insertUser(userModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let insertData = [
                        userModel.username,
                        userModel.password,
                        userModel.phone,
                        userModel.lastLoginTime,
                        userModel.lastModifyTime,
                        userModel.regitsterTime,
                        userModel.isAdmin,
                        userModel.isDisable
                    ];
                    connection.query(sqlMap.user.insert, insertData, function(err, result){
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

    },
    async queryUsernameById(userId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.user.queryUsernameById, [userId], function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        if (result.length === 0){
                            console.log("can't find user: " + userId);
                            resolve(-1);
                        }
                        resolve(result[0].username);
                    });
                }));
            })
        });

    },
    async updateUser(userModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    let updateData = [
                        userModel.username,
                        userModel.password,
                        userModel.lastModifyTime,
                        userModel.isAdmin,
                        userModel.isDisable,
                        userModel.phone,
                        userModel.userId
                    ];
                    connection.query(sqlMap.user.updateById, updateData, function(err, result){
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

    },
    async deleteUser(userId){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.release();
                    connection.query(sqlMap.user.deleteById, [userId], function(err, result){
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result);
                    });
                }));
            })
        });
    },
    async insertUploadFile(fileModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.release();
                    let insertData = [
                        fileModel.partId,
                        fileModel.uploadTime,
                        fileModel.rewardPoint,
                        fileModel.filename
                    ];
                    connection.query(sqlMap.file.insertFile, insertData, function(err, result){
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result);
                    });
                }));
            })
        });
    },

    async queryAllUploadFile(offset, limit){
        let fileList = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.release();
                    connection.query(sqlMap.file.queryAllFile, [offset, limit], function(err, result){
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        let fileList = result.map(function(item){
                           return {
                               partId: item.part_id,
                               uploadTime: item.upload_time,
                               rewardPoint: item.reward_point,
                               filename: item.filename
                           }
                        });
                        resolve(fileList);
                    });
                }));
            })
        });

        let totalCount = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(sqlMap.file.queryAllFileCount, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            resolve(-1);
                        }
                        resolve(result[0].total_count);
                    });
                }));
            })
        });
        return {
            fileList,
            totalCount
        };
    },

    /* 试题 */
    async queryAllExam(queryCondition){
        let queryData = [];
        let querySQL = sqlMap.exam.queryAll;
        let queryTotalCountSQL = sqlMap.exam.queryExamCount;
        let existBeforeConditionFlag = false;
        if (queryCondition.hasOwnProperty("partId")){
            querySQL += "where part_id = ? ";
            queryTotalCountSQL += "where part_id = ? ";
            queryData.push(queryCondition.partId);
            existBeforeConditionFlag = true;
        }
        if (queryCondition.hasOwnProperty("searchContent")){
            if (existBeforeConditionFlag){
                querySQL += " and ";
                queryTotalCountSQL += " and "
            }else {
                querySQL += " where ";
                queryTotalCountSQL += " where ";
            }
            querySQL += "title like ?";
            queryTotalCountSQL += "title like ?";
            queryData.push('%' + queryCondition.searchContent + '%')
        }

        querySQL += " limit ?, ?";
        queryData.push(queryCondition.offset, queryCondition.limit);

        let examList = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(querySQL, queryData, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        let articleList = result.map(function(item){
                            return {
                                examId: item.id,
                                title: item.title,
                                partName: item.part_name,
                                examTime: item.exam_time
                            }
                        });
                        return resolve(articleList);
                    });
                }));
            });
        });

        let totalCount = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(queryTotalCountSQL, queryData, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        return resolve(result[0].total_count);
                    });
                }));
            });
        });
        return {
            examList,
            totalCount
        }
    },

    async queryExamDetail(examId){
        return new Promise(function(resolve, reject){
            pool.getConnection(async function (err, connection) {
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                let examQuestion = await new Promise(function(resolve, reject){
                    connection.query(sqlMap.examQuestion.queryByExamId, function(err, result){
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        let examQuestion = {};
                        result.forEach(function(questionItem){
                            if (questionItem.exam_id === examId){
                                if (examQuestion.hasOwnProperty(questionItem.question_id)){
                                    examQuestion[questionItem.question_id].options.push({
                                        optionId: questionItem.option_id,
                                        description: questionItem.description,
                                        isAnswer: questionItem.is_answer
                                    });
                                }else{
                                    examQuestion[questionItem.question_id] = {
                                        title: questionItem.question_title,
                                        grade: questionItem.question_grade,
                                        type: questionItem.question_type,
                                        options: [
                                            {
                                                optionId: questionItem.option_id,
                                                description: questionItem.description,
                                                isAnswer: questionItem.is_answer
                                            }
                                        ],
                                        questionId: questionItem.question_id
                                    }
                                }
                            }else{
                                console.log("the question option is not belong to the exam");
                            }
                        });
                        resolve(Object.values(examQuestion));
                    });
                });
                let examInfo = await new Promise(function(resolve, reject){
                    connection.query(sqlMap.exam.queryByExamId, [examId], function(err, result){
                       if (err){
                           console.log(err);
                           return resolve(-1);
                       }
                       if (result.length === 0){
                           console.log("cant't find exam " + examId);
                           return resolve(-1);
                       }
                       resolve({
                           title: result[0].title,
                           examTime: result[0].exam_time,
                           partName: result[0].part_name,
                       });
                    });
                });
                connection.release();
                resolve({
                    examId: examId,
                    examQuestions: examQuestion,
                    examTitle: examInfo.title,
                    examTime: examInfo.examTime,
                    partName: examInfo.partName
                });
            })
        });
    },

    async insertExam(examModel){
        return await new Promise(function(resolve, reject){
            pool.getConnection(async function (err, connection) {
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                let examId = await new Promise(function(resolve, reject){
                   connection.query(sqlMap.exam.queryMaxId, function(err, result){
                       if (err){
                           console.log(err);
                           return resolve(-1);
                       }
                       if (result.length === 0){
                           return resolve(1);
                       }
                       resolve(result[0].id + 1);
                   })
                });
                let questionId = await new Promise(function(resolve, reject){
                    connection.query(sqlMap.examQuestion.queryMaxId, function(err, result){
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        if (result.length === 0){
                            return resolve(1);
                        }
                        resolve(result[0].id + 1);
                    })
                });

                /* 插入试题内容 */
                await new Promise(function(resolve, reject){
                    let insertData = [
                        examId,
                        examModel.examTitle,
                        examModel.partId,
                        examModel.examTime,
                        1 // 自动阅卷
                    ];
                    connection.query(sqlMap.exam.insert, insertData, function(err, result){
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        resolve(0);
                    });
                });
                console.log("insert exam success");
                /*
                examModel.questions.forEach(async function(question){
                   await new Promise(function(resolve, reject){
                       let insertData = [
                           questionId,
                           question.title,
                           examId,
                           parseInt(question.grade),
                           1 // 选择题
                       ];
                       connection.query(sqlMap.examQuestion.insert, insertData, function(err, result){
                           if (err){
                               console.log(err);
                               return resolve(-1);
                           }
                       });
                   });
                   */
                /* 插入题目 */
                for (let i = 0; i < examModel.questions.length; i ++){
                    let question = examModel.questions[i];
                    await new Promise(function(resolve, reject){
                        let insertData = [
                            questionId,
                            question.title,
                            examId,
                            parseInt(question.grade),
                            1 // 选择题
                        ];
                        connection.query(sqlMap.examQuestion.insert, insertData, function(err, result){
                            if (err){
                                console.log(err);
                                return resolve(-1);
                            }
                            resolve(0);
                        });
                    });

                    console.log("insert question success: " + questionId);
                    /* 插入题目选项 */
                    for (let index = 0; index < question.options.length; index ++){
                        await new Promise(function(resolve, reject){
                            let insertData = [
                                question.options[index].description,
                                questionId,
                                question.options[index].isAnswer
                            ];
                            connection.query(sqlMap.questionOption.insert, insertData, function(err, result){
                                if (err){
                                    console.log(err);
                                    return resolve(-1);
                                }
                                resolve(0);
                            });
                        });
                        console.log("question options success");
                    }
                    questionId ++;
                    console.log("insert all options, start insert next question: " + questionId);
                }
                console.log("close the connection");
                connection.release();
                resolve(0);
            })
        })
    },

    async queryExamRecord(queryCondition){
        let queryData = [];
        let querySQL = sqlMap.examRecord.queryAll;
        let queryTotalCountSQL = sqlMap.examRecord.queryExamCount;
        if (queryCondition.hasOwnProperty("examId")){
            querySQL += " where exam_id = ? ";
            queryTotalCountSQL += " where exam_id = ? ";
            queryData.push(queryCondition.examId);
        }

        querySQL += " limit ?, ?";
        queryData.push(queryCondition.offset, queryCondition.limit);

        let examRecords = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(querySQL, queryData, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        let records = result.map(function(item){
                            return {
                                recordId: item.id,
                                userId: item.user_id,
                                examId: item.exam_id,
                                examStartTime: item.exam_start_time,
                                examEndTime: item.exam_end_time,
                                scores: item.scores,
                                status: item.status
                            }
                        });
                        return resolve(records);
                    });
                }));
            });
        });

        let totalCount = await new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err){
                    console.log(err);
                    return resolve(-1);
                }
                resolve(new Promise(function(resolve, reject){
                    connection.query(queryTotalCountSQL, queryData, function(err, result){
                        connection.release();
                        if (err){
                            console.log(err);
                            return resolve(-1);
                        }
                        return resolve(result[0].total_count);
                    });
                }));
            });
        });
        return {
            examRecords,
            totalCount
        }
    },
    async insertExamRecord(recordModel){


    }
};




