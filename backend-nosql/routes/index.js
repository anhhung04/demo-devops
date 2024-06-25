var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signin', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signin');
});

router.get('/signup', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

router.get('/dashboard', function (req, res, next) {
  if (!req.session.user) {
    res.redirect('/signin');
    return;
  }
  res.render('dashboard');
})

module.exports = router;
