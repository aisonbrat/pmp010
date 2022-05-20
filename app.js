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
    from: req.body.email,
    to: 'aisultan.zhaksytaev@gmail.com',
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
// app.get("/user-profile", isAuth, appController.userprofile_get);

app.post("/logout", appController.logout_post);


app.get('/user-profile', isAuth, (req, res) => {
  res.render(__dirname + '/views/user-profile.ejs');
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
app.use(isAuth, (req, res, next) => {
  res.status(404).render(__dirname + '/views/is404.ejs')
})
// app.use((req, res, next) => {
//   res.status(404).render(__dirname + '/views/404.ejs')
// })
// app.get("/admin", isAdmin);

app.listen(port, console.log("App Running on http://localhost:5000"));


