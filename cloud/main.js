
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define('postProducts', function(req, res) {
  res.success(req.params.data);
  console.log(req);
});
