const FOOD_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;
const RECIPE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const headerLogoEl = document.getElementById('cookerLogo');
const startPageEl = document.querySelector('.startPage'); // for hidden start page content
const startPageTitle = document.querySelector('.startPageText')
const logoTextEl = document.querySelector('.logoText')
let inputEl = document.getElementById("inputText");
const favListEl = document.querySelector('.favList');
const searchedMeal = localStorage.getItem('searchedMeal');
const mealList = document.querySelector('.mealList');
const resultEl = document.querySelector('.result');

const startPage = () => {  // call renderMeal func. if there is an input
  if (searchedMeal) {
    startPageEl.style.display = 'none';
    inputEl.value = searchedMeal.toString();
    renderMeal(searchedMeal);
  } else { // if there is no value in localStorage show startPage
    startPageEl.style.display = 'all';
  }
}

async function renderMeal(meal) {

  try {
    let col = '';
    let resultText = '';
    const data = await foodApi(FOOD_URL + meal); // added input value end of the url and call the func with async await
    if (data === undefined) { //  wrong url, response.status= 404 
      resultEl.innerHTML = resultText;
      mealList.innerHTML = col;
      startPageEl.style.display = 'block';
      startPageTitle.style.display = 'inline';
      headerLogoEl.style.display = 'none';
      logoTextEl.style.display = 'none';
      return; // with an error case it should be end with an error message
    }
    resultText = `<h4 class='resultTitle'> Your Search Result: <span class='resultNumber'>${data.meals.length}</span> Meal Found</h4> `;
    headerLogoEl.style.display = 'block'; // if the response is correct, func. will continue 
    logoTextEl.style.display = 'block';
    localStorage.setItem('searchedMeal', inputEl.value) // set input value in localStorage
    for (let meal of data.meals) {
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
    }
    resultEl.innerHTML = resultText;
    mealList.innerHTML = col;
  } catch (err) {
    renderError(err);
  }
};

const foodApi = async (url) => {
  try {
    const response = await fetch(url); //fetch Food Api
    if (!response.ok) {  // checked if there is an error from API
      throw new Error('There is some error on API.')
    }
    const data = await response.json(); //get the data as JSON format
    if (data.meals === null) { // checked if the ingredient is wrong and throw an error, (eggff)
      col = '';
      throw new Error('Please check your ingredient!');
    }
    return data;
  } catch (err) {
    renderError(err)
  }
}

function getInputValue() {
  const inputEl = document.getElementById("inputText");
  // Selecting the input element and get its value 
  if (inputEl.value === '') {
    renderError('You should text an ingredient!') //there is no input throw an alert
  } else {
    startPageEl.style.display = 'none';
    // Displaying the value
    renderMeal(inputEl.value);
  }
}



const showAllMeal = async () => {
  startPageEl.style.display = 'none';
  headerLogoEl.style.display = 'block';
  logoTextEl.style.display = 'block';
  inputEl.value = '';
  localStorage.setItem('searchedMeal', '');
  mealList.innerHTML = '';
  let col = '';
  let resultText = '';
  try {
    const data = await foodApi(FOOD_URL);
    if (data == undefined) {
      throw new Error('There is some error on API.')
    }
    for (let meal of data.meals) {
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
    }
    resultText = `<h4 class='resultTitle'> Your Search Result: <span class='resultNumber'>${data.meals.length}</span> Meal Found</h4> `;
    resultEl.innerHTML = resultText;
    mealList.innerHTML = col;

  } catch (err) {
    renderError(err);
  }

};

const renderError = (err) => {
  const html = `
    <div class='alert alert-danger'>
      ${err}
    </div>
  `;
  setTimeout(() => {
    document.getElementById('errors').innerHTML = '';
  }, 3000);
  document.getElementById('errors').innerHTML = html;
}


const favArr = []; // adding fav meals as an object, check to avoid adding same meal again
let favList = '';
const addFavourate = (mealName, mealId, mealImg) => {
  const obj = {
    meal: mealName,
    id: mealId,
    img: mealImg
  };
  const found = favArr.find(element => element.id === mealId); // to avoid adding same meal again
  if (!found) {
    favArr.push(obj);
    favList += `
    <div class="meals  col-lg-6 col-sm-12  m-0">
      <div class="card favCard" style="width: 18rem;">
        <img src="${mealImg}" style="height:100%" class="card-img-top" alt="meal">
        <div class="card-body">
        <h4>${mealName}</h4>
        </div>
      </div>
    </div>
  `;
  }
  favListEl.innerHTML = favList;
}

const showRecipe = async (mealId) => {  // show instruction in the modal
  let recipe = '';
  let step = '';
  let modalTitle = '';

  const response = await fetch(RECIPE_URL + mealId); //fetch another API for instruction of the recipe
  if (!response.ok) { // to avoid an error from API
    throw new Error(err);
  }
  const data = await response.json();
  const recipeBox = document.getElementById('recipeBox');
  const modalTitleEl = document.querySelector('.modal-title');
  modalTitle = `
  <p>${data.meals[0].strMeal}</p>
  <a href='${data.meals[0].strYoutube}' target=”_blank”>Go to Recipe Video</a>`;
  modalTitleEl.innerHTML = modalTitle;
  recipe = `${data.meals[0].strInstructions}`; //all the instructions about meal
  const resultArr = recipe.split('\r\n'); // split the instructions according to recipe steps
  resultArr.forEach(recipe => {
    step += `<p>${recipe}</p>`;
  });
  recipeBox.innerHTML = step;
};

window.addEventListener('load', startPage);
