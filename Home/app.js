const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const axios = require("axios");
const session = require('express-session');
const jwt = require('jsonwebtoken');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false } // Set secure: true if using HTTPS
}));

const API_BASE_URL = "http://localhost:5000/api/";
const JWT_SECRET_KEY = "your_jwt_secret";

app.get("/signup", function (req, res) {
  res.render("signup-page");
});

app.get("/login", function (req, res) {
  res.render("login-page");
});

app.post("/login", async function (req, res){

  const {email, password} = req.body;

  if (!email || !password) {
    console.log("fields are empty")
    return
  }

  try {

    const response = await axios.post(`${API_BASE_URL}auth/login`, req.body);

    console.log("api response = ", response);
    console.log("api response.data = ", response.data);

    const data = response.data;
    
    if (response.status === 200  && data.token) {
      req.session.token = data.token;
      console.log("login successful")
      res.redirect("/home");
    } else {
      console.log("login failed, try again");
    }
  } catch (error) {
    console.error("Error:", error)
     console.log("Server error. Try again later.")
  }

  // Check if user is already logged in
  // if (token) {
    // Verify token validity
    // axios.get(`${API_BASE_URL}/auth/verify`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   },
    // })
      // .then((response) => {
      //   console.log("token validity response", response)
      //   response.json()})
      // .then((data) => {
      //   if (data.valid) {
      //     res.redirect("/home");
      //   } else {
      //     localStorage.removeItem("token")
      //   }
      // })
      // .catch((error) => {
      //   console.error("Error:", error)
      //   localStorage.removeItem("token")
      // })
  // }


})



app.get("/home", function (req, res){

  try {
    if (!req.session.token) {
      return res.redirect('/');
    }
  
    const decoded = jwt.verify(req.session.token, JWT_SECRET_KEY);
    console.log("Decoded Payload:", decoded);
    res.render("home", {userId: decoded.id});

  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});

app.get("/cart", function (req, res){
  res.render("cart");
})

app.get("/order", function (req, res){
  res.render("order");
})

app.get("/list", function (req, res){
  res.render("my-list");
})


app.listen(process.env.PORT || 3000, function () {
    console.log("server started on port 3000");
});