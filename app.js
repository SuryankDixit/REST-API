const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyparser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/wikiDB';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const articleSchema = mongoose.Schema({
    title: String,
    content: String
});
const Article = new mongoose.model("article", articleSchema);



app.get("/", function(req, res) {
    res.redirect("/articles");
})

///////////////////////////////////////////// Requesting All Routes/////////////////////////////////////////////////

// Chained Methods in Express Routes:

app.route("/articles")

.get(function(req, res) {
    Article.find({}, function(err, items) {
        if (err) {
            console.log(err);
        } else {
            // console.log(items);
            res.send(items);
        }
    })
})

.post(function(req, res) {
    const title = req.body.title;
    const content = req.body.content;

    console.log(title);
    console.log(content);

    const newArticle = new Article({
        title: title,
        content: content
    });
    newArticle.save(function(err) {
        if (!err) {
            res.redirect("/");
        } else {
            res.send("Error!");
        }
    })
})

.delete(function(req, res) {

    Article.deleteMany({}, function(err, items) {
        if (err) {
            res.send(err);
        } else {
            res.send("Succesfully deleted.");
        }
    })
});



///////////////////////////////////////////// Requesting Specific Routes/////////////////////////////////////////////////



app.route("/articles/:articleTitle")

.get(function(req, res) {

    const title = req.params.articleTitle;
    Article.findOne({ title: title }, function(err, item) {
        if (item) {
            res.send(item);
        } else {
            res.send("No matching item found");
        }
    })
})


// put requests replace entire record.

.put(function(req, res) {

    const title = req.params.articleTitle;
    console.log(title);

    // update is deprecated , use updateOne, updateMany

    Article.update({ title: title }, { title: req.body.title, content: req.body.content }, { overwrite: true },
        function(err) {
            if (!err) {
                res.send("Successfully Updated Article");
            } else {
                res.send(err);
            }
        }
    );
})

// patch request only modifies the desired key in database 

.patch(function(req, res) {

    const title = req.params.articleTitle;
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(title);
    // look at syntax:

    Article.update({ title: title }, { $set: req.body },
        function(err, item) {
            if (!err) {
                res.send("Succesfully updated.");
            } else {
                console.log(item);
                res.send(err);
            }
        }
    );
})


.delete(function(req, res) {

    const title = req.params.articleTitle;

    Article.deleteOne({ title: title }, function(err) {
        if (!err) {
            res.send("Succesully Deleted");
        } else {
            res.send(err);
        }
    })
});




const port = 3000;
app.listen(process.env.PORT || port, function() {
    console.log(`Server started on port ${port}.`);
})