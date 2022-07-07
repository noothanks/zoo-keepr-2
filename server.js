const express = require('express');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
//requiring animal JSON data
const {animals} = require('./data/animals.json');
//setting up port variable
const PORT = process.env.PORT || 3001;
//instantiate server
const app = express();

//middleware
//parse incoming string or array data
app.use(express.urlencoded({extend: true}));
//parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));
//middleware for api routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
//set static files to browser


//make server listen for connections at port (destination) 3001 on the host (address)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});