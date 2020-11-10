const bodyParser = require ('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.json())

const indexRoutes = require('./routes/index-routes');
app.use('/', indexRoutes);

module.exports = app;