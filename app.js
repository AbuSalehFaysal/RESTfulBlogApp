const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//DATABSE CONNECTION
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/RESTfulBlogApp");

//APP CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//SCHEMA/MODEL SETUP
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//TEST BLOG CREATION
// Blog.create({
//   title: "Test Blog",
//   image: "https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg",
//   body: "This is a test blog!!!"
// });

//RESTFUL ROUTES
app.get("/",function(req,res){
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req,res){
  Blog.find({}, function(err, blogs){
    if (err) {
      console.log("ERROR: ")
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      console.log(err);
      res.renders("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE 
app.get("/blogs/:id", function (req, res) {
  // find the blog with provide id
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
  // res.send("show single page!!!")
});


app.listen(4000, function () {
  console.log("Server Has Started!!!");
});

// app.listen(process.env.PORT, process.env.IP);




