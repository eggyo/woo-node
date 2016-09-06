var WooCommerce = require('woocommerce');
var wooCommerce = new WooCommerce({
  url: 'http://klangsang-led.com',
  consumerKey: 'ck_e95a3d1d2224538dfe42ac8fd84b48a408f5d2d1',
  secret: 'cs_366e3a3766c2b7e389b0085ce87a2dc369448d11'
});

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define('postProducts', function(req, res) {
  var data = req.params.data;
  wooCommerce.post('products', data, function(err, data, res) {
    console.log(res);
    res.success("create product done");
  });
});
