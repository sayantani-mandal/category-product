const express = require('express');
const mongoose =require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');

const router = express.Router();

router.post('/', async (req,res) => {
   const catId = req.body.catId;
   const price_min = req.body.price_min;
   const price_max = req.body.price_max;
  

   if(catId){

    const cat = await Category.findById(catId);
    if(!cat) return res.status(400).send({Error:'Invalid category Id provided....'});

    if(!price_max && !price_min){
        const result = await Category.findById(catId).populate({path: 'products', options: {sort: {'price': -1}}});
        res.send(result);
    }
    else if(price_max && !price_min){
        const result = await Category.findById(catId)
        .populate({
            path: 'products', 
            options: {
                sort: {price: -1}
            },
            match: {price: {$lte: price_max}}
        });
        res.send(result);
    }
    else if(price_min && !price_max){
        const result = await Category.findById(catId)
        .populate({
            path: 'products', 
            options: {
                sort: {price: -1}
            },
            match: {price: {$gte: price_min}}
        });
        res.send(result);
    }
    else {
        const result = await Category.findById(catId)
        .populate({
            path: 'products', 
            options: {
                sort: {price: -1}
            },
            match: {
                price: {$lte: price_max, $gte: price_min}
            }
        });
        res.send(result);
    }
}
else {
    if(!price_max && !price_min){
        const result = await Category.find().populate({path: 'products', options: {sort: {'price': -1}}});
        res.send(result);
    }
    else if(price_max && !price_min){
        const result = await Category.find()
        .populate({
            path: 'products', 
            options: {
                sort: {price: -1}
            },
            match: {price: {$lte: price_max}}
        });
        res.send(result);
    }
    else if(price_min && !price_max){
        const result = await Category.find()
        .populate({
            path: 'products', 
            options: {
                sort: {price: -1}
            },
            match: {price: {$gte: price_min}}
        });
        res.send(result);
    }
    else {
        const result = await Category.find()
        .populate({
            path: 'products', 
            options: {
                sort: {price: -1}
            },
            match: {
                price: {$lte: price_max, $gte: price_min}
            }
        });
        res.send(result);
    }
}
});



router.post('/searchProduct', async (req,res) => {

    const search = req.query.search;
  
       const result = await Product.find({name: new RegExp(search, 'i')});
       res.send(result);

                
    

});







module.exports = router ;