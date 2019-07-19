const Product = require('../models/product');
const Order = require('../models/order');


const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);


exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Courses',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: product.title,
        path: 'shop/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getCategoryProduct = (req, res, next) => {
  const slug = req.params.categoryslug;
  Product.find({category:slug})
    .then(product => {
      res.render('shop/category', {
        CatProducts: product,
        pageTitle: product.title,
        path: 'shop/caegory'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Highjack',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user.cart);
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  var order_id="";
  var total=req.body.total;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products,
        total:total
      });
       order.save();
       order_id=order._id;
       return;
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      
      transporter.sendMail({
        to:req.user.email,
        from:'course@highjack.com',
        subject:'Your Order is Successfull',
        html:'<h2>Your Order is Successfull with Order id:<b>'+order_id+'</b></h2><h4>Your payment details is coming soon</h4>'
       })
       .catch(err =>{
         console.log(err);
       })
       res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
