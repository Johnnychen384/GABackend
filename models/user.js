const mongoose = require('mongoose')
const Clothes = require('./Clothes')

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    gender: String,
    preference: [String],
    cart: [Clothes.Schema]
})

const Users = mongoose.model('user', userSchema)

module.exports = Users