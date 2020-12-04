const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

//DATABSE CONNECTION
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect("mongodb://localhost/RESTfulBlogApp");

//APP CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//SCHEMA/MODEL SETUP
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
var Blog = mongoose.model("Blog", blogSchema);

//TEST BLOG CREATION
// Blog.create({
//   title: "Test Blog",
//   image: "https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg",
//   body: "This is a test blog!!!"
// });

//RESTFUL ROUTES
app.get("/", function (req, res) {
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log("ERROR: ");
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log("========");
  console.log(req.body);
  Blog.create(req.body.blog, function (err, newBlog) {
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
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(
    req.params.id,
    req.body.blog,
    function (err, updatedBlog) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    }
  );
});

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});

// app.listen(4000, function () {
//   console.log("Server Has Started!!!");
// });

app.listen(process.env.PORT, process.env.IP);
