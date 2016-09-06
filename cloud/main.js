var WooCommerce = require('woocommerce');
var wooCommerce = new WooCommerce({
  url: 'http://klangsang-led.com',
  consumerKey: 'ck_e95a3d1d2224538dfe42ac8fd84b48a408f5d2d1',
  secret: 'cs_366e3a3766c2b7e389b0085ce87a2dc369448d11'
});

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});


Parse.Cloud.define('postProducts', function(req, response) {
  var reqData = req.params.data;
  var nameStr = reqData.name;
  var scrUrl = reqData.picUrl;

  var dataReq = {
    name: nameStr,
    type: 'simple',
    regular_price: '21.99',
    description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
    short_description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    categories: [
      {
        id: 9
      },
      {
        id: 14
      }
    ],
    images: [
      {
        src: scrUrl,
        position: 0
      }
    ]
  };

  console.log(dataReq);


  wooCommerce.post('/products', dataReq, function(err, data, res) {
    console.log(data);
    console.log("post error:"+err);

    response.success("create product done");
  });
});
