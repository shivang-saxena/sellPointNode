const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');


exports.getAddProduct = (req, res, next) => {
  var category=[
    "Cars","Electronics & Appliances","Mobiles","Books", "Sports","Fashion","Properties","Pets"
  ];
  res.render('admin/edit-product', {
    category:category,
    pageTitle: 'Add Course',
    path: '/admin/edit-product',
    editing: false,
  });
};

exports.getAdminLogin = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('admin/admin-login', {
        prods: products,
        pageTitle: 'All Courses',
        path: '/admin/admin-login'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postAdminLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email+password);
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(200).json({msg:"User not Registered",isLoggedIn:false});
      }
      else{
        console.log(user.role);
          if (user.password == password) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return  req.session.save(err => {
              console.log(err);
              res.redirect('/admin/dashboard');
            });
          }
          else{
          req.flash('error', 'Invalid email or password.');
          return res.status(200).json({msg:"Invalid email or password",isLoggedIn:false});
          }
        }   
    })
    .catch(err => console.log(err));
};

exports.getAdminIndex = (req, res, next) => {
  Promise.all([
    User.find({}),
    Product.find({}),
    Order.find({})
   ])
   .then( ([ allUser,product,order]) => {
     
     
    res.render("admin/index", 
    {
      users : allUser ,
      products:product,
      orders:order,
      date : new Date(),
      pageTitle: 'Admin'
    });
  })
  .catch(err => {
    console.log(err);
  });
};



exports.postAddProduct = (req, res, next) => {
  var sampleFile = req.files.foo;
  var fileName = sampleFile.name;
  sampleFile.mv('public/images/' + fileName, function(err) {
    if(err)
      console.log(err);
  });

  const title = req.body.title;
  const imageUrl = '/images/'+fileName;
  const price = req.body.price;
  const description = req.body.description;
  //const fullname = req.body.fullname;
  const location = req.body.location;
  const mobile = req.body.mobile;
  const category = req.body.category;
  const brand = req.body.brand;
  console.log(imageUrl);
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
  res.redirect('/admin/products');
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
  Product.find({userId:req.session.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
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
