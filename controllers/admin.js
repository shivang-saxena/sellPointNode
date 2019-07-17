const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  var category=[
    "Cars","Jobs","Electronics & Appliances","Mobiles","Books, Sports & Hobbies","Fashion","Properties","Pets"
  ];
  res.render('admin/edit-product', {
    category:category,
    pageTitle: 'Add Course',
    path: '/admin/edit-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  //const fullname = req.body.fullname;
  const location = req.body.location;
  const mobile = req.body.mobile;
  const category = req.body.category;
  const brand = req.body.brand;
  const product = new Product({
    username:req.user.username,
    title: title,
    mobile: mobile,
    location:location,
    price: price,
    description: description,
    imageUrl: imageUrl,
    category:category,
    brand:brand,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  var category=[
    "Cars","Jobs","Electronics & Appliances","Mobiles","Books, Sports & Hobbies","Fashion","Properties","Pets"
  ];
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Course',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        category:category
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedusername = req.user.username;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedmobile = req.body.mobile;
  const updatedlocation = req.body.location;
  const updatedcategory = req.body.category;
  const updatedbrand = req.body.brand;


  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      product.username = updatedusername;
      product.mobile = updatedmobile;
      product.location = updatedlocation;
      product.brand=updatedbrand;
      product.category=updatedcategory

      return product.save();
    })
    .then(result => {
      console.log('UPDATED Course!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Courses',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED Courses');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
