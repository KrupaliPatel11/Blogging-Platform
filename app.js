const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const categoryRoutes = require('./api/routes/category');
const adminRoutes = require('./api/routes/admin');
const blogRoutes = require('./api/routes/blog');
const slugRoutes = require('./api/routes/search_slug');
const titleRoutes = require('./api/routes/blog');

mongoose.connect('mongodb://krupalip:mJ307ySceDhxuJInLr9C@15.206.7.200:28017/krupalip?authMechanism=DEFAULT&authSource=admin');
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Contol-Allow-Origin', "*");
    res.header('Access-Contol-Allow-Headers', "Origin, X-Requested-with, Content-Type, Accept,Authorization ");

    if (req.method === 'OPTIONS') {
        res.header('Access-Contol-Allow-Methods', 'PUT', 'POST', 'PETCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/category', categoryRoutes)
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/', slugRoutes)

module.exports = app;