const express = require('express');
const mongoose =require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const sendEmail = require('../middleware/sendMail');
const datetime = require('node-datetime');

const router = express.Router();


router.post('/', async (req,res) => {
    try{
        let order = new Order({ ...req.body });

        if (!order.productId || !order.userEmail)
          return res.status(400).send({ Error: 'Product Id and userEmail required' });
    
        const product = await Product.findById(order.productId);
        if (!product)
          return res.status(400).send({ Error: 'Invalid product id given...' });
    
        order = await order.save();
    
        res.send(order);
      
    }
    catch(ex){
      res.status(400).send(ex);
       
    }
   });





/*
router.post('/', async (req,res) => {
 try{
        let order = await req.body;
    order = await Order.insertMany(order);
    res.send(order);
 }
 catch(ex){
    for (const field in ex.errors) {
        console.log(ex.errors[field].message);
          res.status(400).send(ex.errors[field].message);
    }
    
 }
}); */

router.get('/', auth , async (req,res) => {
    const today = new Date();
    const result = await Order.find({createdAt:{$gte:(today.getTime() - 1000*60*60*24*4)}})
                                .populate({
                                 path: 'products',
                                    populate: {
                                        path: 'categories'
                                    }
                                });
    res.send(result);
    console.log(today.getTime());

});


router.post('/search', auth , async (req,res) => {
    //const countLimit = parseInt(req.query.countLimit) ;
    const countLimit = parseInt(req.query.countLimit)
    const page = parseInt(req.query.page);
    const countSkip = countLimit*(page-1);
    const high = await Order.find().count();
    console.log(high);

   if(countSkip > high){
       res.status(400).send({Error :'page is not available'});
   }
   else{ const results = await Order.find().skip(countSkip).limit(countLimit).sort({createdAt : -1});
    res.send(results);
            }
});

router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
                                .populate({
                                    path: 'products',
                                    populate: {
                                     path: 'categories'
                                    }
                                });

    const date = order.createdAt;
    const dt = datetime.create(date);
    const formatted = dt.format('d/m/yy H:M');       
    console.log(date);
    console.log(formatted);                     

    const context = {
        email: order.userEmail,
        cus_name : order.name,
        product_name : order.products[0].name,
        price : order.products[0].price,
        category_name : order.products[0].categories[0].name,
        purchased : formatted
    }
    sendEmail(order.userEmail,context);
    res.send(order);
});



module.exports = router;