const mongoose = require('mongoose');
const express = require('express');
const pizzaSchema = require('../models/PizzaDetail');
const router = require('../routes/route');

const getAllPizza = async (req, res) => {
    try {
        if (req.session.username) {
            let data = await pizzaSchema.find({})
            res.render('menu', { data: data.map(data => data.toJSON()),header:"header.css",title:"Menu" })
          //  console.log(data);
        }
        else {
            res.redirect('/');
        }

    } catch (error) {
        console.log(error);
    }
}

const view = async (req, res) => { 
   const id=req.params.id;
   let data=await pizzaSchema.findById(id);
   res.render('view',{data:data});
    console.log(data)
        
}
module.exports = {
    getAllPizza,
    view
}