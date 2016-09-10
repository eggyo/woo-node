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


//------->
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');

});


//------->
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



//------->
Parse.Cloud.define('postProducts', function(req, response) {
  var reqData = req.params.data;
  var nameStr = reqData.name;
  var scrUrl = reqData.picUrl;
  var pId = reqData.id;
  var categoryItems = reqData.categories;
  var _categories =[]
  console.log('categoryItems:'+categoryItems);
  for(var i=0;i<categoryItems.length;i++){
    _categories.push({id:categoryItems[i]});
  }
  var dataReq = {
  name: nameStr,
  type: 'simple',
  regular_price: '100',
  description: 'รายละเอียดสินค้าแบบยาว',
  short_description: 'รายละเอียดสินค้าแบบสั้น',
  categories:_categories,
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

//------->
Parse.Cloud.define('getProducts', function(req, response) {
  var page = req.params.page;
  var getProductsReq = 'products?per_page=20&page=' + page;
  WooCommerce.get(getProductsReq, function(err, data, res) {
    if (err == null) {
      var totalProducts = data.headers['x-wp-total'];
      var totalPage = data.headers['x-wp-totalpages'];
      console.log('totalProducts:'+totalProducts+' | totalPage:'+totalPage);
      var results = JSON.parse(res);
      response.success({'results':results,'totalProducts':totalProducts,'totalPage':totalPage});
    }
  });
});

//------->
Parse.Cloud.define('getOrders', function(req, response) {
  var page = req.params.page;
  var getOrdersReq = 'orders?per_page=20&page=' + page;
  WooCommerce.get(getOrdersReq, function(err, data, res) {
    if (err == null) {
      var totalOrders = data.headers['x-wp-total'];
      var totalPage = data.headers['x-wp-totalpages'];
      console.log('totalOrders:'+totalOrders+' | totalPage:'+totalPage);
      var results = JSON.parse(res);
      response.success({'results':results,'totalOrders':totalOrders,'totalPage':totalPage});
    }
  });
});


//--------->
Parse.Cloud.define('getCategories', function(req, response) {
  WooCommerce.get('products/categories?per_page=60', function(err, data, res) {
    if (err == null) {
      var results = JSON.parse(res);
      response.success(results);
    }
  });
});

//--------->
Parse.Cloud.define('createdOrderNofPub', function(req, response) {
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo('channels', 'admin'); // Set our channel
  Parse.Push.send({
    where: pushQuery,
    data: {
      alert: 'You received new order!',
      badge: 1,
      sound: 'default'
    }
  }, {
  success: function() {
    console.log('##### PUSH OK');
    response.success({results:"done"});

  },
  error: function(error) {
    console.log('##### PUSH ERROR');
    response.error(error);

  },
  useMasterKey: true
  });
});
