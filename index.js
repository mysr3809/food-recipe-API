const FOOD_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;
const RECIPE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const inputEl = document.querySelector('.input-group');

const foodApi = async (url) => {
  const response = await fetch(url); //fetch Food Api
  // console.log('response', response);
  const data = await response.json(); //get the data as JSON format 

  return data;
}

inputEl.style.width = '50%';
function getInputValue() {
  // Selecting the input element and get its value 
  const inputVal = document.getElementById("inputText").value;
  if (inputVal === '') {
    alert('You shoud text a food') //there is no input throw an alert
  } else {
    // Displaying the value
    renderMeal(inputVal);
  }
}

async function renderMeal(meal) {
  let col = '';
  const data = await foodApi(FOOD_URL + meal);
  const mealList = document.querySelector('.mealList');
  data.meals.forEach(meal => {
    col += `
          <div class="col m-2">
            <div class="card" style="width: 18rem;">
              <img src="${meal.strMealThumb}" style="height:100%" class="card-img-top" alt="meal">
              <div class="card-body">
              <h4>${meal.strMeal}</h4>
                <button type="button" onclick='showRecipe("${meal.idMeal}")' class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                See Recipe
                </button>
              </div>
            </div>
          </div>
      `;

    mealList.innerHTML = col;
  })
}

const showRecipe = async (mealId) => {  // show instruction in the modal
  let recipe = '';
  let step = '';
  const response = await fetch(RECIPE_URL + mealId); //fetc instruction of the recipe
  const data = await response.json();
  const recipeBox = document.getElementById('recipeBox');
  recipe =  //all the instructions about meal
    `
     ${data.meals[0].strInstructions}
    `;
  const resultArr = recipe.split('\r\n'); // split the instructions according to recipe steps
  resultArr.forEach(recipe => {
    step += `
             <p>${recipe}</p>
            `
  });
  recipeBox.innerHTML = step;
};


