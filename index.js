const express = require('express');
const mongoose =require('mongoose');
const categories =require('./routers/categories');
const products = require('./routers/products');
const orders = require('./routers/orders');
const search = require('./routers/search');


const app=express();

app.use(express.json())

app.use('/api/categories',categories);
app.use('/api/products',products);
app.use('/api/orders',orders);
app.use('/api/search',search);


mongoose.connect('mongodb://localhost/SHOP',{useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify: false, useCreateIndex: true})
.then(()=>console.log('connected to mongodb.....'))
.catch(err=>console.error('could not connect to mongodb......'));




/*

async function getCategory() {
    return await Category
    .find({name:'sab'})
   
 
  }
  
 async function run() {
    const categories = await getCategory();
    console.log(categories);
  }
  
  run();

*/
port =3001;
app.listen(port,()=>console.log(`server is running on port  ${port}`));