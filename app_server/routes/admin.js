var express = require('express');
var router = express.Router();

// 對應controller位置
var manager_controller = require('../controllers/manager_controller');

// get => /manager_allUser : 轉至[All User List]頁面
router.get('/manager_allUser', function (req, res, next) {
  res.render('manager_allUser', {
    title: 'All User List'
  });
});

// get => /manager_allUsb : 轉至[All Usb List]頁面
router.get('/manager_allUsb', function (req, res, next) {
  res.render('manager_allUsb', {
    title: 'All Usb List'
  });
});

// post => /get_allUser : 使用ajax去controller取所有使用者資料
router.post('/get_allUser', manager_controller.getAllUser);

// post => /get_allUser : 使用ajax去controller取所有隨身碟資料
router.post('/get_allUsb', manager_controller.getAllUsb);

// post => /new_USB : 新增USB資料
router.post('/new_USB', manager_controller.newUSB);
// post => /edit_USB : 搜尋USB調變參數資料
router.post('/edit_USB', manager_controller.edit_USB);
// post => /edit_USB_Syn : 編輯USB調變參數資料
router.post('/edit_USB_Syn', manager_controller.edit_USB_Syn);

module.exports = router;