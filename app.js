const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This webapp allows you to journal digitally and saves when you compose a post.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://elsdonc:zoCj8ujLnqsJPjhA@cluster0.pa17gqm.mongodb.net/journalDB");
const postSchema = {
  title: String,
  content: String
}
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err,posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    })
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  newPost.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = _.lowerCase(req.params.postId);

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    })
  })

});

app.listen(3000 || process.env.PORT, function() {
  console.log("Server started on port 3000");
});
