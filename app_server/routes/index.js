var express = require("express");
var router = express.Router();

// 對應controller位置
var account_controller = require("../controllers/account_controller");

// 控管路徑請求次數
var RateLimit = require("express-rate-limit");

// 同IP註冊帳戶次數限制
var createAccountLimiter = new RateLimit({
  max: 2, // start blocking after 2 requests
  windowMs: 60 * 60 * 1000, // 1 hour window
  skipFailedRequests: true,
  message: "從此IP創建的帳戶太多，請在一小時後再試一次"
});

// 同IP登入帳戶次數限制
var signinAccountLimiter = new RateLimit({
  max: 5, // start blocking after 5 requests
  windowMs: 60 * 60 * 1000, // 1 hour window
  skipFailedRequests: true,
  message: "從此IP登入的帳戶太多，請在一小時後再試一次"
});

// get => / : 轉至[Home_Page]頁面
router.get("/", function(req, res, next) {
  res.render("Home_Page");
});

// get => /signin : 轉至[sign_in]頁面，title設為Sign In
router.get("/signin", function(req, res, next) {
  res.render("sign_in", {
    title: "登入"
  });
});

// get => /sign_up : 轉至[sign_up]頁面，title設為Sign Up
router.get("/signup", function(req, res, next) {
  res.render("sign_up", {
    title: "註冊帳號"
  });
});

// get => /about : 未撰寫
router.get("/about", function(req, res, next) {
  res.render("about");
});

// get => /shop : USB購買頁面
router.get("/shop", function(req, res, next) {
  res.render("shop_USB");
});

// post => /signin : 帳戶登入
router.post("/signin", signinAccountLimiter, account_controller.signin);
// post => /signup : 帳戶註冊
router.post("/signup", createAccountLimiter, account_controller.signup);
// post => /signout : 帳戶登出
router.post("/signout", account_controller.signout);
// post => /checkUser : 在註冊時確認是否重複使用者
router.post("/checkUser", account_controller.checkUser);
// post => /checkSession : 導覽列根據使用者切換顯示
router.post("/checkSession", account_controller.checkSession);

module.exports = router;
