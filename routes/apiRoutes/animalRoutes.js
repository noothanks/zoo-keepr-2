const router = require("express").Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal, } = require("../../lib/animals");
const { animals } = require("../../data/animals");

//adding route to access animals.json data
//get() method looks for string describing client fetch route
//get() methods looks for callback to execute on request
//callback uses corresponding method to say 'hello' for res (response)
//or json() for JSON animals data
//method indicates which type of data is being received to ensure it is delivered properly
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    //checking for 404 error
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
});

//setting up client request for the server to accept data
router.post('/animals', (req, res) => {
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
        res.json(animal);
    }
});

module.exports = router;