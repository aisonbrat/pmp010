const port = process.env.PORT || 5000;
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");

const bodyParser = require('body-parser')

const nodemailer = require('nodemailer');

const {check} = require("express-validator")

const appController = require("./controllers/appController");
const isAuth = require("./middleware/is-auth");
const isAdmin = require("./middleware/isAdmin");

const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");

const flash = require('connect-flash');

// ------ANNOUNCEMENT
// const Article = require('./models/article')
// const articleRouter = require('./routes/articles')
// const methodOverride = require('method-override')
//

const app = express();

var path = require('path')

// middlware for contact form
app.use(express.json());
app.post('/suc', (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aisultan.zhaksytaev@gmail.com',
      pass: 'Gorifa10GOOGLE'
    }
  })
  const mailOptions = {
    from: 'aisultan.zhaksytaev@gmail.com',
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    phone: req.body.phone,
    text: req.body.message
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.log(error);
      res.send('error');
    } else {
      console.log("Email sent: " + info.response);
      res.send('success');
    }
  })
})
// end

var urlencodedParser = bodyParser.urlencoded({ extended: false }); //to analyze text URL-coding data, submit form data from regular forms set to POST) and provide the resulting object (containing keys and values) to req.body.
app.use("/public", express.static(path.join(__dirname, '/public')));
//requests
app.get('/', (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
    res.render(__dirname + '/views/index.ejs'); //__dirname is to get absolute path to file.
})

app.get('/contact', (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
    res.render(__dirname + '/views/contact.ejs'); //__dirname is to get absolute path to file.
})



//


// connectDB();

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/reg",
    // databaseName: "sessions",
  collection: "users",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());
//=================== Routes
// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/main", isAuth, appController.main_get);
app.get("/comment", isAuth, appController.comment_get);
// app.get("/profile", isAuth, appController.userprofile_get);

app.post("/logout", appController.logout_post);

app.get("/admin-users", isAdmin, appController.admin_users)

app.get("/user-edit/:id", isAdmin, appController.user_edit)

app.post("/user-edit/:id", isAdmin, appController.user_update)

app.post("/user-delete/:id", isAdmin, appController.user_delete)




app.get('/account-settings', isAuth, appController.settings_page)

app.post('/account-settings', isAuth, appController.settings_post)

app.post('/change-password', isAuth, appController.change_password)


app.get('/profile', isAuth, appController.profile_get, (req, res) => {
  res.render(__dirname + '/views/profile.ejs');
})

app.post('/register', isAuth, (req, res) => {
  console.log(req.body);
})

app.get('/courses', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/courses.ejs'); //__dirname is to get absolute path to file.
})

app.get('/ielts-page', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/ielts-page.ejs'); //__dirname is to get absolute path to file.
})
app.get('/unt', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/unt.ejs'); //__dirname is to get absolute path to file.
})

app.get('/hok', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/hok.ejs'); //__dirname is to get absolute path to file.
})
app.get('/rl', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/rl.ejs'); //__dirname is to get absolute path to file.
})
app.get('/ml', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/ml.ejs'); //__dirname is to get absolute path to file.
})

// ------VIDEO-----------
app.get('/hok-video', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/hok-video.ejs'); //__dirname is to get absolute path to file.
})
app.get('/ielts-video', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/ielts-video.ejs'); //__dirname is to get absolute path to file.
})
// ------------
app.get('/sat-page', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/sat-variants.ejs'); //__dirname is to get absolute path to file.
})

// ======SUB VARIANTS====
app.get('/sat1', isAuth, appController.sat1)

app.get('/sat2', isAuth, appController.sat2)

app.get('/hok1', isAuth, appController.hok1)
app.get('/hok2', isAuth, appController.hok2)
app.get('/hok3', isAuth, appController.hok3)


app.get('/rl1', isAuth, appController.rl1)

app.get('/ml1', isAuth, appController.ml1)
app.get('/ml2', isAuth, appController.ml2)


app.get('/hok_var1', appController.hok_var1)
app.get('/hok_var2', appController.hok_var2)
app.get('/hok_var3', appController.hok_var3)

app.get('/rl_var1', appController.ml_var1)

app.get('/ml_var1', appController.ml_var1)
app.get('/ml_var2', appController.ml_var2)
// ============

app.get('/testging', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/testging.ejs'); //__dirname is to get absolute path to file.
})

app.get('/result', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/result.ejs'); //__dirname is to get absolute path to file.
})
app.get('/admin', isAdmin, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/admin.ejs'); //__dirname is to get absolute path to file.
})

app.post('/check-answers/:id', appController.check_answers);

app.get('/passed', appController.passed);

app.get('/review/:id', appController.review);

app.post('/postReview', appController.postReview)

app.post('/postComment/:id', appController.postComment)





app.use((req, res, next) => {
  res.status(404).render(__dirname + '/views/is404.ejs')
})
app.use(isAuth, (req, res, next) => {
  res.status(404).render(__dirname + '/views/is404.ejs')
})


app.listen(port, console.log("App Running on http://localhost:5000"));


