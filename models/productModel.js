const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName:String,
    price:Number,
    userID:String,
    user:String
},{
    versionKey:false,
})

const ProductModel = mongoose.model("product",productSchema)

module.exports = {ProductModel}