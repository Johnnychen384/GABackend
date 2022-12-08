//___________________
//Dependencies
//___________________
const express = require('express');
const mongoose = require ('mongoose');
const User = require('./models/user')
const axios = require('axios')
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// APIKEY 
const APIKEY = process.env.APIKEY

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, () => {
  console.log('connected')
});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project


//___________________
// Routes
//___________________
//localhost:3000

// creates new user
app.post('/', (req, res) => {
  User.create(req.body, (error, data) => {
    res.json(data)
  })
})


// not done need form data to pass in. Also will need to change user.prefernce.
app.put('/quiz/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, )
})

// login route
app.post('/login', (req, res) => {
  const username = req.body.email
  const password = req.body.password

  User.findOne({email: username}, (error, data) => {
    // if there is an error with code
    if(error) console.log(error)
    // if there is no error
    else {
      // if data is present
      if(data) {
        // check if data.password is equal to the password they typed for login.
        if(data.password === password){
          res.json(data)
        }
      }
    }
  })
})






// not done but dashboard route
app.get('/clothes/:id' , (req, res) => {
  
  // options var contains all information needed for axios request
  const options = {
    method: 'GET',
    url: 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/categories/list',
    params: {lang: 'en', country: 'us'},
    headers: {
      'X-RapidAPI-Key': APIKEY,
      'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
    }
  };

  // because options var contains the type of request already. We just need to use the .request instead.
  axios.request(options)
  .then(res => console.log(res.data), error => console.log(error))
  .catch(error => console.log(error))
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));