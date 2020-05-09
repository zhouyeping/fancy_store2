const axios = require("axios")
const jwt = require("jsonwebtoken")
const appConfig = require("../config/db").wxApp
const sysConfig = require("../config/db").system
const UserModel = require("../model/userModel")

module.exports = {

    /**
     *  通过用户的login code 向微信服务器获取用户id
     * @param code
     */
    loginToWX(code){
        return axios.get('https://api.weixin.qq.com/sns/jscode2session', {
            params: {
                appid: appConfig.AppID,
                secret: appConfig.AppSecret,
                js_code: code
            }
        })
    },

    /**
     *  用户登录
     * @param req
     * @param res
     * @param next
     * @returns {Promise<number>}
     */
    async login(req, res, next){
        if (req.body.code === undefined){
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }

        let wxLoginRet = await this.loginToWX(req.body.code)
        let openid = ''
        if ((openid = wxLoginRet.data.openid) == undefined){
            res.json({
                status: false,
                msg: "查找用户失败"
            })
            return 0
        }

        let userInfo = await UserModel.queryUserInfoByOpenId(openid)
        if (userInfo === -1 || userInfo.length == 0){
            res.json({
                status: false,
                msg: "用户未注册"
            })
            return 0
        }

        /* 更新用户的上一次登录时间 */

        /* 为用户生成token */
        let token = jwt.sign(
            {uid: userInfo[0].id, username: userInfo[0].username},
            sysConfig.TokenKey,
            {
                expiresIn: 60 *60*24
            })

        res.json({
            status: true,
            msg: "登录成功",
            token: token
        })
    },

    /**
     *  用户注册
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    async register(req, res, next){
        if (req.body.code === undefined || req.body.username === undefined ||
        req.body.password === undefined || req.body.phone === undefined){
            res.json({
                status: false,
                msg: "请求参数错误"
            })
            return 0
        }

        /* 用户名和密码校验 */

        let phoneReg = /^1[3456789]\d{9}$/
        if (!phoneReg.test(req.body.phone)){
            res.json({
                status: false,
                msg: "手机号格式不正确"
            })
            return 0
        }

        let wxLoginRet = await this.loginToWX(req.body.code)
        let openid = ''
        if ((openid = wxLoginRet.data.openid) == undefined){
            res.json({
                status: false,
                msg: "查找用户失败"
            })
            return 0
        }

        let userModel = {
            username: req.body.username,
            password: req.body.password,
            phone: req.body.password,
            last_login_time: Math.round((new Date)/ 1000),
            last_modify_time: Math.round((new Date)/1000),
            register_time: Math.round((new Date)/ 1000),
            openid
        }

        let insertRet = await UserModel.register(userModel)
        if(insertRet === -1){
            res.json({
                status: false,
                msg: "插入用户失败"
            })
            return 0
        }

        res.json({
            status: true,
            msg: "注册用户成功"
        })
    }
}