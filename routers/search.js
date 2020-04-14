const express = require('express');
const mongoose =require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/',auth, async (req, res) => {
    const catId = req.body.catId;
    const price_max = req.body.price.max;
    const price_min = req.body.price.min;
    var condition = {};
    var initCondition = {};
  
    try {
      if (catId) {
        const cat = await Category.findById(catId);
        if (!cat)
          return res .status(400).send({ Error: 'Invalid category Id provided....' });
        initCondition['_id'] = catId;
  
        if (!price_max && !price_min) {
        } else if (price_max && !price_min) {
          condition['price'] = { $lte: price_max };
        } else if (price_min && !price_max) {
          condition['price'] = { $gte: price_min };
        } else {
          if (price_min > price_max)
            return res.status(400).send({ Error: 'price_min must be less than max' }); 
          condition['price'] = { $lte: price_max, $gte: price_min };
        }
      } else {
        if (!price_max && !price_min) {
        } else if (price_max && !price_min) {
          condition['price'] = { $lte: price_max };
        } else if (price_min && !price_max) {
          condition['price'] = { $gte: price_min };
        } else {
          if (price_min > price_max)
            return res.status(400).send({ Error: 'price_min must be less than max' });
  
          condition['price'] = { $lte: price_max, $gte: price_min };
        }
      }
      console.log(initCondition);
      console.log(condition);
      const result = await Category.find(initCondition).populate({
        path: 'products',
        options: {
          sort: { createdAt: -1 },
        },
        match: condition,
      });
      res.send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  


router.post('/searchProduct', async (req,res) => {

    try{

    const search = new RegExp(req.query.search);
    console.log(search);
    const result = await Product.find({name: search});
    console.log(result);
    
    if(result.length == 0){
        res.status(400).send({Error: "No data found..."});
    }else{
        res.send(result);
    }
    }
    catch (e) {
        res.status(400).send(e)
    }

                
    

});







module.exports = router ;