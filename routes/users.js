var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users/cool listing. */
router.get('/cool', function(req, res, next) {
let dat="you are so cool"
res.send(dat);
//res.render('coolshow', { title: 'cool' });
});


module.exports = router;
