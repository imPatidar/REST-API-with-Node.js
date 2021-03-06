const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://impatiadr:'+process.env.MONGO_ATLAS_PW+'@node-testing-vnuif.mongodb.net/test?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//To handle Get requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It Works!'
//     });
// });

app.use((req, res, next) => {
    const error  = new Error('Not Found');
    error.status= 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;

