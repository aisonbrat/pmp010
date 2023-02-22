const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// mongoose.connect("mongodb://localhost:27017/pmpacademy",{useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connect('mongodb+srv://Aisultan:Gorifa10@pmp.zdsge.mongodb.net/PMP',{useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true });


const dbb = mongoose.connection;

dbb.once('open',()=>{console.log("Connected");})

dbb.on("error",()=>{console.log("error in conection");})

// module.exports = connectDB;
