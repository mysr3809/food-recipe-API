const FOOD_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;
const RECIPE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772';
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
    alert('You shoud text a food')
  } else {
    // Displaying the value
    console.log(inputVal);
  }
  renderMeal(inputVal);
}

async function renderMeal(meal) {
  const data = await foodApi(FOOD_URL + meal);
  console.log(data);
  const mealList = document.querySelector('.mealList');


  let col = '';
  data.meals.forEach(meal => {
    col += `
          <div class="col m-2">
            <div class="card" style="width: 18rem;">
              <img src="${meal.strMealThumb}" style="height:100%" class="card-img-top" alt="meal">
              <div class="card-body">
              <h4>${meal.strMeal}</h4>
                <button type="button" onclick='showRecipe("${meal.strMeal}")' class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                See Recipe
                </button>
              </div>
            </div>
          </div>
      `;

    mealList.innerHTML = col;
  })
}