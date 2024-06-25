var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/me', function (req, res, next) {
  if (!req.session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.status(200).json(req.session.user);
});

module.exports = router;
