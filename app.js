const port = process.env.PORT || 5000;
const express = require("express");
const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
const config = require("config");

const bodyParser = require('body-parser')
// const mailer = require('./nodemailer')

const {check} = require("express-validator")

const appController = require("./controllers/appController");
const isAuth = require("./middleware/is-auth");
const isAdmin = require("./middleware/isAdmin");
const hasAccess = require('./middleware/hasAccess')

const connectDB = require("./config/db");
const mongoURI = config.get("mongoURI");

// const flash = require('connect-flash');


const app = express();

var path = require('path')

// middlware for contact form
app.use(express.json());


// let user = undefined

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(bodyParser.urlencoded({ extended: false }))




var urlencodedParser = bodyParser.urlencoded({ extended: false }); //to analyze text URL-coding data, submit form data from regular forms set to POST) and provide the resulting object (containing keys and values) to req.body.
app.use("/public", express.static(path.join(__dirname, '/public')));
//requests
app.get('/', (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
    res.render(__dirname + '/views/index.ejs'); //__dirname is to get absolute path to file.
})

// ============US PAGE=================
app.get('/us', (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/us.ejs'); //__dirname is to get absolute path to file.
})

// ====================================

app.get('/contact', (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
    res.render(__dirname + '/views/contact.ejs'); //__dirname is to get absolute path to file.
})


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    cookie: {maxAge: 600000000000},
    resave: false,
    saveUninitialized: true,
  })
);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/main", isAuth, appController.main_get);
app.get("/comment", isAuth, appController.comment_get);
app.get("/publish", isAdmin, appController.publish_get);
app.get("/edit-comment", isAdmin, appController.comment_edit_get);
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

app.get('/courses', hasAccess, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/courses.ejs'); //__dirname is to get absolute path to file.
})

app.get('/ielts-page', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/ielts-page.ejs'); //__dirname is to get absolute path to file.
})
app.get('/unt', hasAccess, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/unt.ejs'); //__dirname is to get absolute path to file.
})
app.get('/support', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/support.ejs'); //__dirname is to get absolute path to file.
})

app.get('/unt0', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/unt0.ejs'); //__dirname is to get absolute path to file.
})
app.get('/hok', hasAccess, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/hok.ejs'); //__dirname is to get absolute path to file.
})
app.get('/rating', isAdmin, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/rating.ejs'); //__dirname is to get absolute path to file.
})
app.get('/rl', hasAccess, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/rl.ejs'); //__dirname is to get absolute path to file.
})
app.get('/ml', hasAccess, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
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


app.get('/hok_var1', isAdmin, appController.hok_var1)
app.get('/hok_var2', isAdmin, appController.hok_var2)
app.get('/hok_var3', isAdmin, appController.hok_var3)

app.get('/rl_var1', isAdmin, appController.ml_var1)

app.get('/ml_var1', isAdmin, appController.ml_var1)
app.get('/ml_var2', isAdmin, appController.ml_var2)
// ============


app.get('/result', isAuth, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/result.ejs'); //__dirname is to get absolute path to file.
})
app.get('/admin', isAdmin, (req, res) => { //method send is convenience to send some strings,but there are pretty big size of code, it is not convenience. for this sendFile funciton is better
  res.render(__dirname + '/views/admin.ejs'); //__dirname is to get absolute path to file.
})

app.post('/check-answers/:id', appController.check_answers);

app.get('/passed', appController.passed);
// app.get('/passed-users', appController.passed_users);
// app.post('view-passed', isAdmin, appController.view_passed);

app.get('/review/:id', appController.review);

app.post('/postReview', appController.postReview)
app.post('/postComment/:id', appController.postComment)
app.post("/delete-comment/:id", isAdmin, appController.delete_comment)
app.post("/delete-review/:id", isAdmin, appController.delete_review)

app.post('/publishPost', isAdmin, appController.publishPost)
// app.post('/publishComment/:id', appController.publishComment)
app.post("/delete-post/:id", isAdmin, appController.delete_post)





app.use((req, res, next) => {
  res.status(404).render(__dirname + '/views/is404.ejs')
})
app.use(isAuth, (req, res, next) => {
  res.status(404).render(__dirname + '/views/is404.ejs')
})


app.listen(port, console.log("App Running on http://localhost:5000"));


