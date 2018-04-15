var express = require('express');
var router = express.Router();

// 對應controller位置
var user_controller = require('../controllers/user_controller');

// get => /user_info : 轉至[user_info]頁面，title設為User Info
router.get('/user_info', function (req, res, next) {
  res.render('user_info', {
    title: 'User Info'
  });
});

// get => /user_usbList : 轉至[user_usbList]頁面，title設為USB List
router.get('/user_usbList', function (req, res, next) {
  res.render('user_usbList', {
    title: 'USB List'
  });
});

// post => /get_usbList : 前端取得使用者所有USB
router.post('/get_usbList', user_controller.getUsbList);

// post => /get_userInfo : 前端取得使用者資訊
router.post('/get_userInfo', user_controller.getUserInfo);

// post => /set_key : 使用者註冊KEY
router.post('/set_key', user_controller.regKey);

// post => /set_usbname : 設定USB名稱
router.post('/set_usbname', user_controller.setUsbname);

// post => /set_webvct : 設定網路驗證
router.post('/set_webvct', user_controller.changeWebvct);

module.exports = router;