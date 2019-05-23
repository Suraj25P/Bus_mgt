/*INCLUDES */
var no = 1000;
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require("mongoose");

//DATABASE CONNECTION
mongoose.connect(
  "mongodb://localhost:27017/info",
  { useNewUrlParser: true }
);

/*Data base */
var Schema1 = new mongoose.Schema({
  stop: String,
  busno: Number,
  fees: Number
});
var bus = mongoose.model("busdata", Schema1);

var Schema = new mongoose.Schema({
  _id: Number,
  name: String,
  year: Number,
  dept: String,
  stop: String,
  busno: Number,
  fees: Number
});
var user = mongoose.model("profile", Schema);

mongoose.connection
  .once("open", function() {
    console.log("Database connection successfull!!");
  })
  .on("error", function(error) {
    console.log("Database connection failed!!");
  });

//SERVER CONNECTION
app.listen(3000);

//VIEW ENGINE AND MIDDLEWARES
app.set("view engine", "ejs");
app.use("/styles", express.static("styles"));
app.use("../styles", express.static("styles"));
app.use("/scripts", express.static("scripts"));

//home page
app.get("/home", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

//INDEX PAGE ROUTING
app.get("/login", function(req, res) {
  res.render("login", {
    data: no
  });
});
//LOGIN PAGE AJAX
app.get("/products/:id", function(req, res) {
  var s = req.params.id;
  bus.find({ stop: s }, function(err, result) {
    if (err) {
      console.log("coudnt find results");
    } else {
      if (result.length === 0) {
        console.log("no such stop");
      } else {
        res.send(result);
      }
    }
  });
});

//LOGIN ROUTING

app.post("/login", urlencodedParser, function(req, res) {
  /*put to server */
  new user({
    _id: req.body.recptno,
    name: req.body.name,
    year: req.body.year,
    dept: req.body.branch,
    stop: req.body.stop,
    busno: req.body.busno,
    fees: req.body.feespaid
  }).save(function(err, result) {
    if (err) {
      console.log("Entry Coudnt be save");
      console.log(err);
    } else {
      console.log("Entry was successfully saved");
      no++;
    }
  });

  var date = new Date();
  res.render("login-success", {
    data: req.body,
    d: date
  });
  console.log("bill created");
});

//view user data routing
app.get("/popup1", function(req, res) {
  res.render("popup1");
});

app.post("/popup1result", urlencodedParser, function(req, res) {
  var f = req.body.recno;
  user.find({ _id: f }, function(err, result) {
    if (err) {
      console.log("coudnt find results");
    } else {
      if (result.length === 0) {
        res.render("error.ejs");
      } else {
        res.render("retrived-data", { data: result });
      }
    }
  });
});

app.get("/delete/:idd", function(req, res) {
  user.remove({ _id: req.params.idd }, function(err, result) {
    if (err) {
      console.log("coudnt find results");
    } else {
      res.redirect("/home");
    }
  });
});

//view bus data routing
app.get("/popup2", function(req, res) {
  res.render("popup2");
});

app.post("/popup2result", urlencodedParser, function(req, res) {
  var f = req.body.busno;
  bus.find({ busno: f }, function(err, result) {
    if (err) {
      console.log("coudnt find results");
    } else {
      if (result.length === 0) {
        res.render("error.ejs");
      } else {
        res.render("retrive-bus-data", { data: result, bno: f });
      }
    }
  });
});
