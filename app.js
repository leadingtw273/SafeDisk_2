const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const helmet = require('helmet');

//  設定路由位置
const index = require('./app_server/routes/index');
const users = require('./app_server/routes/users');
const admin = require('./app_server/routes/admin');

//  初始化 express
const app = express();

//  戴帽子 防範已知的 Web 漏洞
app.use(helmet());

// view 路徑設定 命設定 view engine 為 ejs
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');

//  使 logger 輸出到 Terminal 中
app.use(logger('dev'));

//  bodyparser 此中中介軟體的作用是獲得請求體字串，然後轉成物件賦值給req.body
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
//  判斷請求體格式是不是json格式，如果是的話會呼叫JSON.parse方法把請求體字串轉成物件
app.use(bodyParser.json());
//  上面兩者只會有一個生效

// layout 設置與存放路徑
app.use(expressLayouts);
app.set('layout', 'layouts/default_layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// 設置靜態檔案存放位置
app.use(express.static(path.join(__dirname, '/public')));

// 設定 cookie
app.use(cookieParser());
// 設定 session
app.use(
  session({
    secret: 'eSRG6A8ET4HD5F1GAW6RJH456DTY1adf5g4s6tg41sd121EF6AERTH123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 120 * 60 * 1000, // 設定 cookie 存活時間
      sameSite: 'strict' // 防範CSRF XSSI 攻擊
    }
  })
);

// 輸入驗證
app.use(validator());

// set flash
app.use(flash());
app.use(function(req, res, next) {
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

// 登入攔截實作
app.use(function(req, res, next) {
  const url = req.originalUrl;
  const arr = url.split('/');

  // 顯示使用者與進入路徑
  console.log('path: ' + url + ', user: ' + req.session.user);

  if (req.session.user) {
    if (req.session.user != 'root' && arr[1] === 'admin') {
      console.log('[Login Error] User not root!!');
      res.redirect('/');
    } else if (req.session.user == 'root' && arr[1] === 'user') {
      console.log('[Login Error] Root can not use this!!');
      res.redirect('/');
    } else {
      next();
    }
  } else {
    if (arr[1] === 'user' || arr[1] === 'admin') {
      req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
      req.flash('error', 'You are not logged in');
      res.redirect('/signin');
    } else {
      next();
    }
  }
});

// 設定路徑與指定路由
app.use('/', index);
app.use('/user', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
