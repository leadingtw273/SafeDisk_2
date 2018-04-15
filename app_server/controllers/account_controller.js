var firebase = require('../models/firebase_model');
var xss = require('xss');

/*
 * [基本頁面]
 * 放置與基本相關的功能
 * 登入、登出、註冊、檢查重複、取得導覽列帳戶名
 */

module.exports = {
    // 使用者帳戶登入
    signin: function (req, res) {

        let redirectUrl = xss(req.session.originalUrl);// 重定向網頁
        let username = xss(req.body.User); // 取得帳戶名稱並做XSS防護
        let password = xss(req.body.Pwd); // 取得帳戶密碼並做XSS防護

        firebase.read_targetData("User_list", "userName", username, function (msg, data) {
            // 確認是否有此使用者資料或是其他意外錯誤
            if (msg.status) {
                let dataKey = Object.keys(data)[0];
                // 比對密碼
                if (password === data[dataKey].password) {
                    console.log('Log in success');
                    req.session.user = req.body.User; // 將使用者名稱導入session

                    // 檢測是否有登入前頁面
                    if (redirectUrl) {
                        // 若有就將頁面設定至 redirectUrl
                        redirectUrl = req.session.originalUrl;
                        req.session.originalUrl = null;
                    } else {
                        // 若無則訂為首頁
                        redirectUrl = '/';
                    }

                    // 將資料傳回用戶端
                    res.send({
                        info: "success",
                        url: redirectUrl,
                        username: req.session.user
                    });

                } else {
                    // [密碼錯誤] 將資訊傳回用戶端
                    console.log('Log in error');
                    res.send({
                        info: "error",
                        message: "Error: Password is not correct !"
                    });
                }

            } else {
                // [帳戶錯誤] 將資訊傳回前端
                console.log('Log in error => %j', msg.error);
                res.send({
                    info: "error",
                    message: msg.error,
                });
            }

        });
    },
    // 使用者帳戶註冊
    signup: function (req, res) {

        // 後端輸入資訊驗證
        req.checkBody("addEmail").notEmpty().isEmail();
        req.checkBody("addPhone").notEmpty().isNumeric().isMobilePhone('zh-TW').isLength({
            min: 10,
            max: 10
        });
        req.checkBody("addUser").notEmpty().isLength({
            min: 6,
            max: 30
        });
        req.checkBody("addPwd").notEmpty().equals(req.body.addvfypwd);
        req.checkBody("addvfypwd").notEmpty();

        let validErrors = req.validationErrors();
        if (validErrors) {
            // 輸出錯誤資訊
            for (let x in validErrors) {
                console.log("validErrors => [param] : " + validErrors[x].param + ", [msg] : " + validErrors[x].msg + ", [value] : " + validErrors[x].value);
            }
            res.send({
                info: "error",
                message: "validErrors"
            });
            return;
        } else {
            console.log("validator ok!");

            // XSS防護
            let userEmail = xss(req.body.addEmail);
            let userPwd = xss(req.body.addPwd);
            let userPhone = xss(req.body.addPhone);
            let userName = xss(req.body.addUser);

            let pushData = {
                email: userEmail,
                password: userPwd,
                phone: userPhone,
                userName: userName
            };

            firebase.read_allcount("User_list", function (msg,data) {
                // 將資料鍵入資料庫
                firebase.new_data("User_list/USER" + data.count, pushData, function (msg) {

                    if (msg.status) {
                        res.send({
                            info: "success"
                        });
                    } else {
                        res.send({
                            info: "error",
                            message: msg.error
                        });
                    }
                    
                });
            });
        }

    },
    // 使用者帳戶登出
    signout: function (req, res) {
        // 清除session值
        req.session.destroy();
        res.send({
            info: "success"
        });
    },
    // 檢查使用者是否重複
    checkUser: function (req, res) {
        firebase.read_targetData("User_list", "userName", req.body.username, function (msg, data) {

            res.send({
                valid: !msg.status
            });

        });
    },
    // 確認用戶使用戶端導航列輸出正確資訊
    checkSession: function (req, res) {
        res.send({
            user: req.session.user
        });
    }
}