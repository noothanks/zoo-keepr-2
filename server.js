const express = require('express');
const fs = require('fs');
const path = require('path');

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
//set static files to browser
app.use(express.static('public'));

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

//adding findById() functionality
function findById(id, animalsArray) {
    // take animalsArray and filter the items to match the selected id
    //update array for filtered animal
    //save result as index 0 of updated array
    const result = animalsArray.filter(animal => animal.id === id)[0]
    return result;
}

//creating functionality for passing req.body to the animals array
function createNewAnimal(body, animalsArray) {
    //define animal as body received from POST request
    const animal = body;
    //main function code
    //updating animals array to include added animal
    animalsArray.push(animal);
    //updating actual animals.json file to include new animal
    fs.writeFileSync(
        //join file paths from current file to the file sought after
        //the end result is the file being written
        path.join(__dirname, './data/animals.json'),
        //this is the data being passed into the file
        //null indicates we don't want to change existing data
        //2 indicates whitespace between data
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    //return animal to post route for response
    return animal;
}

//checking that the newly created animal is formatted properly
function validateAnimal(animal) {
    //if no animal name or not a string return false
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    //if no species or not a string return false
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    //if no diet or not a string return false
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    //if no animal personality trais or if not an array return false
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}
//adding route to access animals.json data
//get() method looks for string describing client fetch route
//get() methods looks for callback to execute on request
//callback uses corresponding method to say 'hello' for res (response)
//or json() for JSON animals data
//method indicates which type of data is being received to ensure it is delivered properly
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

//get() for a single animal by id
//use re1.params.propertyName for retriving item with single property
// ex. can replace /:id below with /:insertPropertyHere
//separated because id is unique to each individual animal
//other query code is not useful here, so a new request is defined
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    //checking for 404 error
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
});

//get request for index.html
app.get('/', (req, res) => {
    //retrieves file (res.sendFile()) from chosen location (path.join(currentDirectory, chosen file path))
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//get animals page
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
  });

//get zookeepers page
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeeprs.html'));
});

//wildcard route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//setting up client request for the server to accept data
app.post('/api/animals', (req, res) => {
    //set new animal id to the next index of the array based on array length
    //converts id to string and saves new animal id to the body
    req.body.id = animals.length.toString();

    //add animal to json file and animals array
    //check if any data in req.body is incorrect
    //if so send back 400 error
     if(!validateAnimal(req.body)){ 
        res.status(400).send('The animal is not formatted correctly.');
     } else {
        //define data sought after
        const animal = createNewAnimal(req.body, animals);
        //req.body is where incoming content will be populated
        res.json(req.body);
    }
});

//make server listen for connections at port (destination) 3001 on the host (address)
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});