//___________________
//Dependencies
//___________________
const express = require('express');
const mongoose = require ('mongoose');
const User = require('./models/user')
const Clothes = require('./models/clothes')
const axios = require('axios')
const cors = require('cors')
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

app.use(cors())

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


// updates user preference with quiz data.
app.put('/quiz/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { preference: req.body }, {new: true}, (error, data) => {
    res.json(data)
  })
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


// get all clothes route
app.get('/', (req, res) => {
  Clothes.find({}, (error, data) => {
    res.json(data)
  })
})

// add item to cart route
app.post('/add/:user', (req, res) => {
  User.findOne({_id: req.params.user}, (error, userData) => {
    Clothes.create(req.body, (error, newItem) => {
      userData.cart.push(newItem)
      userData.save((error, data) => {
        res.json(data)
      })
    })
  })
})


// delete route
app.delete('/delete/:user/:id', (req, res) => {
  User.findOne({_id: req.params.user}, (error, userData) => {
    userData.cart.id(req.params.id).remove()
    userData.save((error, newUser) => res.json(newUser))
  })
})

// route for when user in the cart changes from 1 of an item to two or more. User will pass a new object called item into the params which is from a state that holds all our preferred items. 
app.post('/edit/:user/:name/:number', (req, res) => {
  
  // numberOFItem is how many the user wants of that clothes.
  let numberOfItem = req.params.number
  let nameOfItem = req.params.name
  User.findOne({_id: req.params.user}, (error, userData) => {
    let cartArray = userData.cart

    // how many of the item we are looking for exist in the cart
    let count = 0

    // array to hold all the objects that match the name of the item we are looking for.
    let temp = []

    // goes through the cart array and checks the name property of each object
    for(let elem of cartArray){
      // if name of object is equal to the item we want to increase/decrease increment count
      if(elem.name === nameOfItem){
        count++
        temp.push(elem)
      }
    }

    // if count which is how many of that clothes we have in the cart is less than the numberOfItem which represents how much of that clothes we want to have than add one more to the cart.
    if(count < numberOfItem){
      Clothes.create(req.body, (error, newItem) => {
        cartArray.push(newItem)
        userData.save((error, data) => res.json(data))
      })


    } else if (count > numberOfItem){
      let diff = count - numberOfItem
      // loops through the temp array which contains only items with the same name
      let toBeRemoved = temp.splice(0, diff)

      for(let i = 0; i < toBeRemoved.length; i++){
        // removes each item from cart.
        cartArray.id(toBeRemoved[i]._id).remove()
        // saves
        userData.save((error, newUser) => res.json(newUser))
      }

    }


  })
})


// seed route
const getData = async () => {
  const options = {
    method: 'GET',
    url: 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list',
    params: {country: 'us', lang: 'en', currentpage: '0', pagesize: '30'},
    headers: {
      'X-RapidAPI-Key': '18198b9e6fmsh35966d93fe90053p1badeejsn680060b71161',
      'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
    }
  }

  const res = await axios.request(options)
  const data = await res.data
  const arr = data.results.filter(item => item.categoryName === "Men" || item.categoryName === "Ladies")
  Clothes.create(arr, (error, items) => {
    console.log(items)
  })
}

app.get('/seed', (req, res) => {
  getData()
})




//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));