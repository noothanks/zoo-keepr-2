const express = require('express');

//requiring animal JSON data
const {animals} = require('./data/animals.json');
//setting up port variable
const PORT = process.env.PORT || 3001;
//instantiate server
const app = express();
//make server listen for connections at port (destination) 3001 on the host (address)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

//setting up filter functionality
function filterByQuery(query, animalsArray) {
    //define data sought after
    let filteredResults = animalsArray;
    //if query by multiple of the same property
        //define property as array
    let personalityTraitsArray = [];

    if(query.personalityTraits) {
        //if one paramater (or string)
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            //if multiple
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through array to check against each item in filteredResults to get data sought after
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    //if query by property
    //filter array to reflect search value using query
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet ===query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    //return data sought after
    return filteredResults;
}

//adding route to access animals.json data
//get() method looks for string describing client fetch route
//get() methods looks for callback to execute on request
//callback uses corresponding method to say 'hello' for res (response)
//or json() for JSON animals data
app.get('/api/animals', (req, res) => {
    //define data sought after
    let results = animals;
    //req.query allows for search of data based on query parameters
    //filter functionality should be kept separate
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    //res.send('hello');
    res.json(results); 
});