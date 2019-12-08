//Dependencies//
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

//Initialize dependencies
var PORT = 3000;
var app = express();
app.use(logger("dev"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/News-Scraper", {useNewUrlParser: true});

//Routes
//GET route for main page to always display latest articles
app.get("/", function(req,res){
    //Grab article data using axios and cheerio
    axios.get("https://www.cnn.com/").then(function(response){
        var $ = cheerio.load(response.data);
    //Use specific article data
    $("article h3").each(function(i, element){
        var result = {};

        result.headline = $(this)
            .children("h3")
            .text();
        result.image = $(this)
            .children("img")
            .text();
        result.url = $(this)
            .children("a")
            .attr("href");
    });
    //Save article to News database
    db.News.create(result)
        .then(function(article){
            console.log(article);
        }).catch(function(err){
            console.log(err);
        });
    
    res.send("Latest news");
    });
});

//Start the server
app.listen(PORT, function(){
    console.log("App running on port" + PORT);
});