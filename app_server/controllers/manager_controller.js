var firebase = require('../models/firebase_model');
var crypto = require("../models/crypto_model");
var xss = require('xss');

/*
 * [管理者帳戶]
 * 放置與管理者相關的功能
 * 取得所有USB、取得所有使用者
 */

module.exports = {
    // 取得所有使用者資料
    getAllUser: function (req, res) {
        firebase.read_allData("User_list", function (msg, data) {

            let table_data = {
                aaData: Object.values(data)
            };

            res.send(table_data);
        });
    },
    // 取得所有USB資料
    getAllUsb: function (req, res) {
        firebase.read_allData("USB_list", function (msg, data) {

            let table_data = {
                aaData: Object.values(data)
            };

            res.send(table_data);
        });
    },
    // 編輯USB調變參數
    edit_USB_Syn: function(req,res){

        let a1 = parseFloat(xss(req.body.a1)).toFixed(3);
        let a2 = parseFloat(xss(req.body.a2)).toFixed(3);
        let a3 = parseFloat(xss(req.body.a3)).toFixed(3);

        let key = xss(req.body.key);
        let sendData = {};

        let arr = [a1, a2, a3];
        let syn = arr.join('/');
        let encSyn = crypto.encrypt(syn, key);

        sendData = {"synValue":encSyn};

        firebase.editor_targetData("USB_list", "usbKey", key, sendData,function(data){

            if(data.status){
                res.send({
                    info: "success"
                });
            }else{
                res.send({
                    info: "error",
                    message: data.error
                });
            }

        });

    },
    // 搜尋編輯之USB資料
    edit_USB: function (req, res) {
        let key = xss(req.body.key);
        let usbKey = "";
        let synKey = "";
        let synData = "";
        let A = [];

        firebase.read_targetData("USB_list", "usbKey", key, function (msg, data) {

            let dataKey = Object.keys(data)[0];

            if (msg.status) {

                usbKey = data[dataKey].usbKey;
                synKey = data[dataKey].synValue;
                synData = crypto.decrypt(synKey, usbKey);

                data[dataKey].Syndata = synData.split("/");

                res.send({
                    info: "success",
                    data: data[dataKey]
                });
            } else {
                res.send({
                    info: "error",
                    message: data.error
                });
            }
        });
    },
    // 新增USB資料
    newUSB: function (req, res) {
        
        var obj_data = {};

        async function setUsbData(min, max) {

            for (let i = min; i < max; i++) {

                // USB 後面數字設定
                let usbString = '';
                if (i < 100) {
                    if (i < 10) {
                        usbString = '00' + i;
                    } else {
                        usbString = '0' + i;
                    }
                } else {
                    usbString = String(i);
                }

                // 產生金鑰
                let key = crypto.getKey(10);
                let syn = crypto.getSyn(0, 10, 3);
                let cryptoSync = crypto.encrypt(syn, key);

                // 存放的資料
                let sendKey = "USB" + usbString;
                let sendData = {
                    usbKey: key,
                    synValue: cryptoSync,
                    linkID: usbString,
                    usbName: 'NULL',
                    userName: 'NULL',
                    webVct: 0
                };

                obj_data[sendKey] = sendData;

            }
        }

        // 設定起始數字與欲增加的數量
        firebase.read_allcount("USB_list", async function (msg, data) {

            let num = xss(req.body.MAX);
            let min = data.count;
            let max = min + parseInt(num);

            console.log("min : " + min + ", max : " + max);

            setUsbData(min, max).then(function () {
                // 資料庫動作
                firebase.new_data("USB_list", obj_data, function (data) {

                    if (data.status) {
                        res.send({
                            info: "success"
                        });
                    } else {
                        res.send({
                            info: "error",
                            message: data.error
                        });
                    }

                });
            }).catch(function(reason){
                console.log('Handle rejected promise ('+reason+') here.');
            });
        });
    }
}