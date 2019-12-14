//Dependencies//
var express = require("express");
var logger = require("morgan");
var mongojs = require("mongo");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var db = require("./models");

//Initialize dependencies
var PORT = 3000;
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
mongoose.connect("mongodb://localhost/News-Scraper", {useNewUrlParser: true});
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//Routes
//GET route for main page to always display latest articles
app.get("/scrape", function(req, res){
    //Grab article data using axios and cheerio
    axios.get("https://www.npr.org/sections/news/").then(function(response){
        var $ = cheerio.load(response.data);
    //Use specific article data
    $("article .item-info-wrap .item-info").each(function(i, element){
        var result = {};

        result.headline = $(this)
            .children("h2")
            .text();
        result.category = $(this)
            .children("div")
            .children("h3")
            .children("a")
            .text();
        result.summary = $(this)
            .children("p")
            .text();
        result.url = $(this)
            .children("h2")
            .children("a")
            .attr("href");

    //Save article to News database
    db.Article.create(result)
    .then(function(article){
        console.log("Information saved to database: " + article);
    }).catch(function(err){
        console.log("Error! " + err);
    });
    });
    res.send("Latest news grabbed.");
    });
});

app.get("/", function(req, res){
    db.Article.find({})
        .then(function(article){
            res.render("index", {news: article});
        }).catch(function(err){
            res.json(err);
        });
});

//Start the server
app.listen(PORT, function(){
    console.log("App running on port " + PORT);
});