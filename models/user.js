const mongoose = require('mongoose')
const Clothes = require('./clothes')

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    gender: String,
    preference: {
        clothing: {type: String},
        color: {type: String},
        price: {type: String}
    },
    cart: [Clothes.schema]
})

const Users = mongoose.model('user', userSchema)

module.exports = Users