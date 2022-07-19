require('dotenv').config() //dotenv file for API key security purpose
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json()); // Sets up body parser for express
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(__dirname + "/assets")); //Used to serve static files on express server

//MongoDB Connection
mongoose.connect(process.env.MONGODB,
  (err) => {
    if (err) throw err;
    else console.log("Connected to database successfully!");
  }
);

//Defining a MongoDB Schema
const feedbackSchema = mongoose.Schema({
    name: String,
    email: String,
    message : String
})

//Creating a model/collection with the name Feedback with the schema named feedbackSchema
const Feedback = mongoose.model('Feedback',feedbackSchema);

app.get("/", (req, res) => { //Handles a get request to the express server
  res.sendFile(__dirname + "/index.html"); //__dirname is used to fetch the current location from the root directory 
});

app.post("/", (req, res) => { //Handles the post request of the feedback/contact us form
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const feedback = new Feedback(); //Creates a new feedback object when a post request is sent
  feedback.name = name; //Assigns each attribute/field the values fetched using the express body parser
  feedback.email = email;
  feedback.message = message;
  feedback.save((err)=>{ //Saves the feedback object into the feedbacks collection
      if(err) throw err;
      else console.log("Feedback submitted successfully");
  });
  res.redirect("/");
});

app.listen(3000, (req, res) => { //Used to start the server at port 3000
  console.log("Server is started at port 3000");
});
