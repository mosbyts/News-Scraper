var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    headline: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

var Article = mongoose.model("Article", ArticleSchema);

//Export the model
module.exports = Article;