const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(200).json({msg:"User not Registered",isLoggedIn:false});
        //return res.redirect('/');
      }
      // bcrypt
      //   .compare(password, user.password)
      //   .then(doMatch => {
      else{
          if (user.password == password) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.status(200).json({msg:"User Logged in",isLoggedIn:true});
            });
          }
          else{
          req.flash('error', 'Invalid email or password.');
          return res.status(200).json({msg:"Invalid email or password",isLoggedIn:false});
          }
        // })
        // .catch(err => {
        //   console.log(err);
        //   res.status(200).json({msg:"Sorry ! Some error occured.",isLoggedIn:false});
        // });
        }   
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const confirmPassword = req.body.confirmPassword;
  User.find({
    $or: [
        {email: email},
        {username : username},
    ],
  })
    .then(userDoc => {
      console.log(userDoc);
      if (Object.keys(userDoc).length > 0) {
       return res.status(200).json({msg:"Email or username is taken"});
      }
          const user = new User({
            username: username,
            email: email,
            password: password,
            cart: { items: [] }
          });
          return user.save()
        .then(result => {
          return res.status(200).json({msg:"User Registered Successfully! Login now"});
        });
    })
    .catch(err => {
      return res.status(200).json({msg:err});
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
