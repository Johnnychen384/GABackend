const mongoose = require('mongoose')


// still trying to figure out the schema
const clothingSchema = new mongoose.Schema ({
    name: String,
    images: [
        {
            url: {type: String}
        }
    ],
    price: {
        formattedValue: {type: String}
    },
    rgbColors: [String],
    categoryName: String,
    articleColorNames: [String],
    selectedColor: {type: String, default: "None"}
})


const Clothes = mongoose.model('Cloth', clothingSchema)
module.exports = Clothes 