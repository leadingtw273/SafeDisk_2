var firebase = require('../models/firebase_model');
var xss = require('xss');

/*
 * [使用者帳戶]
 * 放置與使用者相關的功能
 * 取得使用者USB、取得使用者資料、註冊USB、變更網路驗證、設定USB名稱
 */

module.exports = {
    // 取得使用者USB資料
    getUsbList: function (req, res) {

        // XSS防護
        let user = xss(req.session.user);

        firebase.read_targetData("USB_list", "userName", user, function (msg, data) {
            console.log("data => %j", data);

            let table_data = {
                aaData: Object.values(data)
            };

            res.send(table_data);
        });
    },
    // 取得使用者資訊
    getUserInfo: function (req, res) {

        // XSS防護
        let user = xss(req.session.user);

        firebase.read_targetData("User_list", "userName", user, function (msg, data) {
            let dataKey = Object.keys(data)[0];
            res.send(data[dataKey]);
        });
    },
    // 註冊USB金鑰
    regKey: function (req, res) {

        // XSS防護
        let key = xss(req.body.key);
        let user = xss(req.session.user);

        // 重複判斷
        firebase.read_targetData("USB_list", "usbKey", key, function (msg, data) {
            let dataKey = Object.keys(data)[0];
            if (data[dataKey].userName == "NULL") {
                firebase.editor_targetData("USB_list", "usbKey", key, {
                    userName: user
                }, function (data) {
                    console.log("controller: " + data.status);

                    res.send({
                        info: true
                    });

                });
            } else {
                res.send({
                    info: data.status
                });
            }
        });


    },
    // 變更網路驗證需求
    changeWebvct: function (req, res) {

        // XSS防護
        let key = xss(req.body.key);
        let web = xss(req.body.web);

        firebase.editor_targetData("USB_list", "usbKey", key, {
            webVct: web
        }, function (data) {
            console.log("controller: " + key + " set => " + web + " feeback: " + data.status);

            res.send({
                info: data.status
            });

        });
    },
    // 設定USB名稱
    setUsbname: function (req, res) {

        // XSS防護
        let usbName = xss(req.body.usbname);
        let USBkey = xss(req.body.key);

        firebase.editor_targetData("USB_list", "usbKey", USBkey, {
            usbName: usbName
        }, function (data) {
            console.log("controller: " + USBkey + " set => " + usbName + " feeback: " + data.status);

            res.send({
                info: data.status
            });

        });
    }
}