/*var WooCommerce = require('woocommerce');
var wooCommerce = new WooCommerce({
  url: 'http://klangsang-led.com',
  logLevel:1,
  consumerKey: 'ck_e95a3d1d2224538dfe42ac8fd84b48a408f5d2d1',
  secret: 'cs_366e3a3766c2b7e389b0085ce87a2dc369448d11'
});*/
var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
  url: 'http://klangsang-led.com',
  wpAPI: true,
  version: 'wc/v1',
  consumerKey: 'ck_e95a3d1d2224538dfe42ac8fd84b48a408f5d2d1',
  consumerSecret: 'cs_366e3a3766c2b7e389b0085ce87a2dc369448d11'
});

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');

});

Parse.Cloud.define('testOrder', function(req, response) {
  var data = {
  payment_method: 'bacs',
  payment_method_title: 'Direct Bank Transfer',
  set_paid: true,
  billing: {
    first_name: 'John',
    last_name: 'Doe',
    address_1: '969 Market',
    address_2: '',
    city: 'San Francisco',
    state: 'CA',
    postcode: '94103',
    country: 'US',
    email: 'john.doe@example.com',
    phone: '(555) 555-5555'
  },
  shipping: {
    first_name: 'John',
    last_name: 'Doe',
    address_1: '969 Market',
    address_2: '',
    city: 'San Francisco',
    state: 'CA',
    postcode: '94103',
    country: 'US'
  },
  line_items: [
    {
      product_id: 9,
      quantity: 2
    },
    {
      product_id: 2,
      quantity: 1
    }
  ],
  shipping_lines: [
    {
      method_id: 'flat_rate',
      method_title: 'Flat Rate',
      total: 10
    }
  ]
};

WooCommerce.post('orders', dataReq, function(err, data, res) {
  console.log(res);
  response.success(data);

  });
});

Parse.Cloud.define('postProducts', function(req, response) {
  var reqData = req.params.data;
  var nameStr = reqData.name;
  var scrUrl = reqData.picUrl;
  var pId = reqData.id;

  var dataReq = {
  name: nameStr,
  type: 'simple',
  regular_price: '100',
  description: 'รายละเอียดสินค้าแบบยาว',
  short_description: 'รายละเอียดสินค้าแบบสั้น',
  images:[
    {
      id:pId,
      position: 0
    }
  ]
};

  WooCommerce.post('products', dataReq, function(err, data, res) {
    if (err == null) {
    /*  console.log(res);
      var resultsID = JSON.parse(res);
      var data2 = {
        images:[
          {
            id:pId,
            position: 0
          }
        ]
      };
      var productID = 'products/' + resultsID.id;
      WooCommerce.put(productID, data2, function(err, data, res) {
        response.success(res);
      });*/
      response.success(res);
    }
  });
});

Parse.Cloud.define('getCategories', function(req, response) {

  WooCommerce.get('products/categories', dataReq, function(err, data, res) {
    if (err == null) {
      response.success(res);
    }
  });
});
