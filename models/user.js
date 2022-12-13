const mongoose = require('mongoose')
const Clothes = require('./clothes')

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    preference: {
        pricerange: {type: String},
        colors: {type: String},
        shortsleeves: {type: String},
        longsleeves: {type: String},
        topsize: {type: String},
        pants: {type: String},
        shorts: {type: String},
        skirts: {type: String},
        bottomssize: {type: String},
        genderclothing: {type: String}
    },
    cart: [Clothes.schema],

})

const Users = mongoose.model('user', userSchema)

module.exports = Users