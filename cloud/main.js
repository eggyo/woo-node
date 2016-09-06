
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define('postProducts', function(req, res) {
  var data = req.params.data;
  WooCommerce.post('products', data, function(err, data, res) {
    console.log(res);
    res.success("create product done");
  });
});
