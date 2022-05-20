const bcrypt = require("bcryptjs");
const flash = require('connect-flash');
// const Role = require("../models/Role");
const User = require("../models/User");

// const {check} = require("express-validator")

// const {validationResult} = require('express-validator')

exports.landing_page = (req, res) => {
  res.render("landing");
};

exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Invalid Credentials";
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.username = user.username;
  console.log(req.body);
  res.redirect("/user-profile", {data: req.body});
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  // const errors = validationResult(req)
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({message: "error when register", errors})
  // }
  // [
  //   check('username', "Username cannot be empty").notEmpty(),
  //   check('password', "Password must be more than 7 characters and less than 20 characters").isLength({min:7, max:20})
  // ]
  const { username, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/register");
  }

  const hasdPsw = await bcrypt.hash(password, 12);

  // const  userRole = await Role.findOne({value: "USER"})
  user = new User({
    username,
    email,
    password: hasdPsw,
    // roles: [userRole.value]
  });

  await user.save();
  if(!error)
  req.flash('message', 'Registered successfully')
  res.redirect("/login");
};

exports.main_get = (req, res) => {
  res.render('main');

  // try {
    
  //   res.json(('sss'))
  // } catch (error) {
  //   console.log(error)
  // }
};

exports.userprofile_get = (req, res) => {
  // const username = req.session.username;
  // const email = req.session.email;
  if(req.session.user){
    // res.render('user-profile', { data : req.session.body });
}else{
    res.send("Unauthorize User")
    // res.render('user-profile', { user : req.session.username });

}
 
};

// exports.dashboard_get = (req, res) => {
//     const username = req.session.username;
//     res.render("main", { name: username });
//   };
  
  // exports.dashboard_get('/dashboard', function(req, res, next) {
  //   var username1 = req.session.username1;
  //   res.render("dashboard", { name: username1 });
  // })

exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/login");
  });
};
