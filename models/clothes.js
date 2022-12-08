const mongoose = require('mongoose')


// still trying to figure out the schema
const clothingSchema = new mongoose.Schema ({
    name: String,
    image: String,
    price: String,
    rgbcolors: [String],
    catName: String,
    articleColorNames: [String],

})


const Clothes = mongoose.model('Cloth', clothingSchema)
module.exports = Clothes 