const express =require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');

const router = express.Router();

router.post('/', async (req,res)=>{


    try {
        let products = await req.body;
        console.log(products);

        var flag = true;
        
        for(let i=0; i < products.length-1; i++){
            
            for(let j=i+1; j<products.length; j++){
                
                if ((products[i].name.toLowerCase() == products[j].name.toLowerCase()) && (products[i].categoryId == products[j].categoryId)){
                    
                     flag = false;
                     console.log(flag);
                     break;
                }
                
            }
            console.log(flag);
        }
        console.log(flag);
        if(!flag) return res.status(400).send({Error:'Duplicate product found..'});

        var flag1 = true;
        for(let i=0; i < products.length; i++){
            let catId = products[i].categoryId;
            console.log(catId);
            let name =  products[i].name;
            console.log(name);
            let results = await Product.find({categoryId: catId});
            console.log(results);

           for(let j=0; j<results.length; j++){
               if(results[j].name.toLowerCase() == name.toLowerCase()){
                   flag1 = false;
                   break;
               }
           }
        }

        console.log(flag1);
        if(!flag1) return res.status(400).send({Error:'Duplicate product found in db..'});
        console.log(1);

        //products = await Product.create(products);
        let product = await Product.insertMany(products);
        console.log(2);
        res.send(product);
    } catch (ex) {
        for (const field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
    
});

router.post('/search', async (req,res) => {
    try{
const highest = req.body.highest;
const lowest = req.body.lowest;
const result = await Product.find({price:{$gte:lowest , $lt: highest}}).sort({price: -1}).populate('categories');
res.send(result);
    }
    catch (e) {
        res.status(400).send(e)
    }
});





module.exports = router;