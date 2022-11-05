const FOOD_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;
const RECIPE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const inputEl = document.querySelector('.input-group');
const headerLogoEl = document.getElementById('cookerLogo');
const startPageEl = document.querySelector('.startPage'); // hidden start page content
const logoTextEl = document.querySelector('.logoText')


const startPage = () => {
}



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
    startPageEl.style.display = 'none';
    headerLogoEl.style.display = 'block';
    logoTextEl.style.display = 'block'
    // Displaying the value
    renderMeal(inputVal);
  }
}

async function renderMeal(meal) {
  let col = '';
  const data = await foodApi(FOOD_URL + meal);
  const mealList = document.querySelector('.mealList');
  data.meals.forEach(meal => {
    // const obj = {
    //   meal: meal.strMeal,
    //   id: meal.idMeal
    // }
    col += `
          <div class="meals col-xl-4 col-lg-6 col-sm-12  m-0">
            <div class="card mealCard" style="width: 18rem;">
              <a class="heartBtn" onclick="addFavourate('${meal.strMeal}','${meal.idMeal}','${meal.strMealThumb}') "><i class="fa-solid fa-heart heartIcon"></i></a> 
              <img src="${meal.strMealThumb}" style="height:100%" class="card-img-top" alt="meal">
              <div class="card-body">
              <h4>${meal.strMeal}</h4>
                <button type="button" onclick='showRecipe("${meal.idMeal}")' class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#recipe">
                See Recipe
                </button>
              </div>
            </div>
          </div>
      `;

    mealList.innerHTML = col;
  })
}

const favArr = [];
let favList = '';
const addFavourate = (mealName, mealId, mealImg) => {
  const favListEl = document.querySelector('.favList');
  const obj = {
    meal: mealName,
    id: mealId,
    img: mealImg
  };
  const found = favArr.find(element => element.id === mealId);
  if (!found) {
    favArr.push(obj);
    favList += `
    <div class="meals  col-lg-6 col-sm-12  m-0">
      <div class="card mealCard" style="width: 18rem;">
        <img src="${mealImg}" style="height:100%" class="card-img-top" alt="meal">
        <div class="card-body">
        <h4>${mealName}</h4>
        </div>
      </div>
    </div>
  `;
  }

  favListEl.innerHTML = favList;
  console.log(favArr)
}

const showRecipe = async (mealId) => {  // show instruction in the modal
  let recipe = '';
  let step = '';
  let modalTitle = '';
  const response = await fetch(RECIPE_URL + mealId); //fetc instruction of the recipe
  const data = await response.json();
  const recipeBox = document.getElementById('recipeBox');
  const modalTitleEl = document.querySelector('.modal-title');

  recipe = `${data.meals[0].strInstructions}`; //all the instructions about meal
  modalTitle = `<p>${data.meals[0].strMeal}</p>`;
  modalTitleEl.innerHTML = modalTitle;
  const resultArr = recipe.split('\r\n'); // split the instructions according to recipe steps
  resultArr.forEach(recipe => {
    step += `<p>${recipe}</p>`;
  });
  recipeBox.innerHTML = step;
};


window.addEventListener('load', startPage);
