const express = require("express")
const jwt = require("jsonwebtoken")
const {auth} = require("../middlewares/authMiddleware")
const { ProductModel } = require("../models/productModel")
const dotenv = require("dotenv").config()

const productRouter = express.Router()

productRouter.post("/create",auth,async(req,res)=>{
    try {
        const product = new ProductModel(req.body)
        await product.save()
        res.send({"msg":"A new product has been created"})
    } catch (error) {
        res.send({"error":error})
    }
})

productRouter.get("/",async(req,res)=>{
    try {
        const products = await ProductModel.find()
        res.send(products)
        
    } catch (error) {
        res.send({"error":error.message})
    }
})

productRouter.patch("/update/:productID",auth,async(req,res)=>{
    const {productID} = req.params
    try {
        const findUserID = req.body.userID
        const productUserID = await ProductModel.findById({_id:productID})
        if(productUserID.userID != findUserID){
            return res.status(400).send({"msg":"you are not authorized"})
        }

        await ProductModel.findByIdAndUpdate({_id:productID},req.body)
        res.send(`Product has been updated with ID: ${productID}`)
    } catch (error) {
        res.send({"error":error.message})
    }
})

productRouter.delete("/delete/:productID",auth,async(req,res)=>{
    const {productID} = req.params
    try {

        const findUserID = req.body.userID
        const productUserID = await ProductModel.findById({_id:productID})
        if(productUserID.userID != findUserID){
            return res.status(400).send({"msg":"you are not authorized"})
        }

        await ProductModel.findByIdAndDelete({_id:productID},req.body)
        res.send(`Product has been delete with ID: ${productID}`)
    } catch (error) {
        res.send({"error":error})
    }
})

module.exports = {productRouter}

