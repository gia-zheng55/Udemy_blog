//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const blogs = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-gia:udemy123@atlascluster.tughnav.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "Day 1",
  content: "You say that you love rain, but you open your umbrella when it rains... You say that you love the sun, but you find a shadow spot when the sun shines...You say that you love the wind, But you close your windows when wind blows..."
});

const post2 = new Post({
  title: "Day 2",
  content: "I'll be a tree, if you are its flower, Or a flower, if you are the dew. I'll be the dew, if you are the sunbeam. Only to be united with you."
});

const post3 = new Post({
  title: "Day 3",
  content: "The fountains mingle with the river. And the rivers with the ocean. The winds of heaven mix forever. with a sweet emotion. Nothing in the world is single. All things by a law divine."
});

const defaultItems = [post1, post2, post3];

app.get("/", function(req, res){
  Post.find({}, function(err, foundItems){
    if(err){
      console.log(err);
    }else{
      if(foundItems.length === 0){
        Post.insertMany(defaultItems, function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Successfully insert default items to DB");
          }
        });
        res.redirect("/");
      }else{
        res.render("home", {homeContent:homeStartingContent, blogs:foundItems});
      }
    }
  })
})

app.get("/about", function(req, res){
  res.render("about", {aboutContent:aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contactContent:contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.get("/post/:requestId", function(req, res){
  const requestId = req.params.requestId;
  Post.findOne({_id: requestId}, function(err, post){
    if(!err){
      res.render("post", {requestTitle:post.title, requestContent:post.content});
    }
  });
})

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.blogTitle,
    content: req.body.blogContent
  });
  post.save();
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
