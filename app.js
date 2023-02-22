const port = process.env.PORT || 5002;
const express = require("express");
const session = require("express-session");

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




const app = express();

var path = require('path')


app.use(express.json());


// let user = undefined

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(bodyParser.urlencoded({ extended: false }))




var urlencodedParser = bodyParser.urlencoded({ extended: false }); 
app.use("/public", express.static(path.join(__dirname, '/public')));
//requests
app.get('/', (req, res) => { 
    res.render(__dirname + '/views/index.ejs'); 
})

// ============US PAGE=================
app.get('/us', (req, res) => { 
  res.render(__dirname + '/views/us.ejs');
})

// ====================================

app.get('/contact', (req, res) => { 
    res.render(__dirname + '/views/contact.ejs'); 
})


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    cookie: {maxAge: 6000000000000},
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

app.get('/courses', hasAccess, (req, res) => { 
  res.render(__dirname + '/views/courses.ejs'); 
})

app.get('/unt', hasAccess, (req, res) => { 
  res.render(__dirname + '/views/unt.ejs'); 
})

app.get('/unt0', isAuth, (req, res) => { 
  res.render(__dirname + '/views/unt0.ejs'); 
})
app.get('/hok', hasAccess, (req, res) => { 
  res.render(__dirname + '/views/hok.ejs'); 
})
app.get('/rating', isAdmin, (req, res) => { 
  res.render(__dirname + '/views/rating.ejs'); 
})
app.get('/rl', hasAccess, (req, res) => { 
  res.render(__dirname + '/views/rl.ejs'); 
})
app.get('/ml', hasAccess, (req, res) => { 
  res.render(__dirname + '/views/ml.ejs'); 
})


// ======SUB VARIANTS====


app.get('/hok1', isAuth, appController.hok1)
app.get('/hok2', isAuth, appController.hok2)
app.get('/hok3', isAuth, appController.hok3)


app.get('/rl1', isAuth, appController.rl1)

app.get('/ml1', isAuth, appController.ml1)
app.get('/ml2', isAuth, appController.ml2)


// ============


app.get('/result', isAuth, (req, res) => { 
  res.render(__dirname + '/views/result.ejs'); 
})
app.get('/admin', isAdmin, (req, res) => { 
  res.render(__dirname + '/views/admin.ejs'); 
})

app.post('/check-answers/:id', appController.check_answers);

app.get('/passed', appController.passed)

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


app.listen(port, console.log("App Running on http://localhost:5002"));


