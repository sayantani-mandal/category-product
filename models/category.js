const express = require('express');
const mongoose =require('mongoose');


const categorySchema = new mongoose.Schema({
    name:String,
    isActive:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
 
 });
 
categorySchema.set('toObject',{'virtuals':true});
categorySchema.set('toJSON',{'virtuals':true});

categorySchema.virtual('products',{
    ref : 'Product',
    localField : '_id',
    foreignField : 'categoryId'

});



 const Category = mongoose.model('Category',categorySchema);
 
 module.exports = Category;