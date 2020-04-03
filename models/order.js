const express = require('express');
const mongoose =require('mongoose');
const Product = require('../models/product');

const today = new Date();

const orderSchema = new mongoose.Schema({
      name: String,
      userEmail: {
        type: String,
        require: true
      },
   
      productId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:Product
     //     required : true
      },
      createdAt:{
          type:Date,
          default: Date.now()
      }
});

orderSchema.set('toObject',{'virtuals':true});
orderSchema.set('toJSON',{'virtuals':true});

orderSchema.virtual('products',{
    ref : 'Product',
    localField : 'productId',
    foreignField : '_id'
});







const Order = mongoose.model('Order',orderSchema);

module.exports = Order;