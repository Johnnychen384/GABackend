const mongoose = require('mongoose')
const Clothes = require('./Clothes')

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    gender: String,
    preference: {type: String},
    cart: [Clothes.schema]
})

const Users = mongoose.model('user', userSchema)

module.exports = Users