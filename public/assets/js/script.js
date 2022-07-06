const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  //post request using fetch api
  //collects all input data into an object and posts using fetch
  fetch('/api/animals', {
    //specify fetch type to ensure proper endpoint
    method: 'POST',
    //set headers to accept json data
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    //stringify new data and add animalObject to body
    body: JSON.stringify(animalObject)
  })
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      alert('Error:' + response.statusText);
    })
    .then(postResponse => {
      console.log(post.response);
      alert('Thank you for adding an animal!');
    })
};

$animalForm.addEventListener('submit', handleAnimalFormSubmit);
