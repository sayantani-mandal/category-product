const express =require('express');
const mongoose = require('mongoose');
const Category = require('../models/category');

const productSchema = new mongoose.Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    name:{
        type :String,
        unique : true,
        minlength: 3
    },
    price: Number,
    isActive:{
        type:Boolean,
        default:false

    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

});

productSchema.set('toObject',{'virtuals':true});
productSchema.set('toJSON',{'virtuals':true});

productSchema.virtual('categories',{
    ref : 'Category',
    localField : 'categoryId',
    foreignField : '_id'
});


const Product = mongoose.model('Product',productSchema);
module.exports = Product;