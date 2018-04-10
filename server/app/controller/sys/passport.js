'use strict';

const crypto = require('crypto');
let _ = require('underscore');

module.exports = app => {
    class sysController extends app.Controller {

        async logout (ctx) {
            ctx.logout();

            ctx.body = {
                "code": "0",
                "msg": "退出登录成功",
                "result": {}
            }
            ctx.status = 200;
        }

        async login (ctx) {
            let [userInfo] = await ctx.app.mysql.get('back').select('user', {
                where: {
                    account: ctx.query.username,
                    password: crypto.createHash('md5').update(ctx.query.password).digest('hex'),
                },
            });

            if (userInfo) {
                ctx.login({
                    username: ctx.query.username,
                    password: ctx.query.password,
                });

                ctx.body = {
                    "code": "0",
                    "msg": "登录成功",
                    "result": {
                        id: userInfo.id,
                        userName: userInfo.name
                    }
                }
                ctx.status = 200;
            } else {
                ctx.body = {
                    "code": '1',
                    "msg": "账号或密码错误",
                    "result": {}
                }
                ctx.status = 200;
            }
        }
    }
    return sysController;
};