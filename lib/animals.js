const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
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
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};