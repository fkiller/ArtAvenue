
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
exports.main = function(req, res) {
  req.header('Accept','application/json')
  res.render('main', { title: 'Main!!!!' })
};
