var express = require("express");
var bodyParser = require("body-parser");
var axios = require("axios");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Save = require("./models/Save.js");
var logger = require("morgan");
var cheerio = require("cheerio");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 3000;

// middleware?
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("./public"));

// mongoose
mongoose.Promise = Promise;
var dbConnect = process.env.MONGODB_URI || "mongodb://localhost/ccnScrape";
if(process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(dbConnect);
}

var db = mongoose.connection;
db.on('error',function(err){
    console.log('Mongoose Error',err);
});
db.once('open', function(){
    console.log("Mongoose connection is successful");
});

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

require("./routes/scrape")(app);
require("./routes/html.js")(app);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "views/index.html"));
});


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});