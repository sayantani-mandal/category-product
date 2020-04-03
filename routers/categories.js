const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/category');
const auth = require('../middleware/auth');
const router = express.Router();





router.post('/', auth , async (req, res) => {
    
    try {
        let cat = req.body;
        if(cat.constructor === Array){
            if(cat.length){
                var isErr = false;
                var isDuplicate = false;
                var nameArr = [];
                var uniqueNameArr = [];

                for(let index=0; index<cat.length; index++){
                    if(!cat[index].name){
                        isErr = true;
                        break;
                    }
                    else if(uniqueNameArr.includes(cat[index].name.toLowerCase())){
                        isDuplicate = true;
                        break;
                    }
                    else{
                        nameArr.push(new RegExp(cat[index].name, 'i'));
                        uniqueNameArr.push(cat[index].name.toLowerCase());
                    }
                }

                if(!isErr && !isDuplicate){
                    try {
                        var documents = await Category.countDocuments({name: {$in: nameArr}});
                        if(documents == 0){
                            const categories = await Category.insertMany(cat);
                            res.send(categories); 
                        }
                        else{
                            res.status(400).send({Error:'Duplicate cat name found in db'});
                        }
                    } catch (err) {
                        console.log(err);
                        return res.status(500).send({err: 'Internal server error'});
                    }
                }
                else if(isErr){
                    res.status(400).send({Error:'Invalid request parameter'});
                }
                else{
                    res.status(400).send({Error:'Duplicate cat name found in array'});
                }
            }
        }
        else{
            res.status(400).send({Error:'Invalid request parameter...'});
        }

        
    } catch (e) {
        res.status(400).send(e)
    }
    
});



router.get('/', auth , async (req,res)=>{
  const result = await Category.find().populate({
                    path: 'products',
                    options: {
                        sort: {price: -1}
                    },
                    perDocumentLimit: 2
                });
  res.send(result);

});



module.exports=router;