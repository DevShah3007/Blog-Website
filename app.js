const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-dev:test123@cluster0.yuei5.mongodb.net/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("post",postSchema);


const homeStartingContent = "A blog is a type of website that is updated regularly with new content. Most blogs contain short, informal articles called blog posts. These posts usually contain some combination of text, photos, videos, and other media. At its core, a blog is just a space on the Web that you can create to record and express your opinions, experiences, and interests. The people who write blogs are called bloggers. From what you hear on the news, you might think bloggers are all a certain type of people—young, politically inclined, and tech-savvy. Or maybe you've heard about bloggers who've written about amazing experiences or ambitious projects, then turned their blogs into bestselling books. While some bloggers do fit these descriptions, a majority of bloggers don't. In fact, there's no 'average' blogger—blogs are written by people of all ages and backgrounds and from all walks of life.";
const aboutContent = "We are a team of dedicated web developers hoping to learn more and apply what we have learnt to our projects.";
const contactContent = "How can we help you?";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Post.find({},function(err,posts){
    if(!err){
      res.render("home",{
        home_content: homeStartingContent,
        postsArray: posts
      });
    }
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{contact_content:contactContent});
});

app.get("/about",function(req,res){
  res.render("about",{about_content: aboutContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postId",function(req,res){
  const requestedId = req.params.postId;
  Post.findOne({_id: requestedId},function(err,post){
    if(!err){
      res.render("post",{
        title: post.title,
        content: post.content
      });
    }
  });
});

app.post("/",function(req,res){
  res.render("compose");
})

app.post("/compose",function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});
