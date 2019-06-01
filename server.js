//Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");


// Require all models
var Article = require("./models/Article.js");
var Comment = require("./models/comment.js");

//Define port
var PORT = process.env.PORT || 3000;

// Variable to hold our Database connections
var herokuDeploy = "";
var localDeploy = "mongodb://localhost/ESPN";

//Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//Set up a static folder (public) for our web app.
app.use(express.static("public"));


mongoose.Promise = Promise;

 // Mongoose (orm) connects to our mongo db and allows us to have access to the MongoDB commands for easy CRUD 
// If deployed, use the deployed database. Otherwise use the local newsscraper database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

// Database configuration with mongoose
mongoose.Promise = Promise;
mongoose.connect(herokuDeploy, {
  useMongoClient: true
});
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log("Mongoose connection successful.");
});


//Parse application/json
app.use(bodyParser.json());

//Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")

//Routes
var routes = require('./controllers/main.js');
app.use('/',routes);


//Set the app to listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port 3000");
})