const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();


// connect DB
mongoose.connect('mongodb+srv://mike:'+process.env.MONGO_ATLAS_PW+'@node-shop.xu6mz.mongodb.net/node-shop?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

// use morgan to log
app.use(morgan('dev'));

// middleware for file uploading
app.use('/uploads',express.static('uploads'));

// parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// handling cors
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control_Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req === 'OPTIONS') {
        res.header("Access-Control-Allow-methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// routes
app.use('/products', require('./api/routes/products.js'));
app.use('/orders', require('./api/routes/order'));
app.use('/users', require('./api/routes/user'));

// process the 404 error
app.use((req, res, next)=> {
    const err = new Error('404| not found');
    err.status = 404;
    next(err);
})

// process all kinds of errors
app.use((err, req, res, next)=> {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    })
})

module.exports = app;