const FOOD_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;
const RECIPE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const inputEl = document.querySelector('.input-group');
const headerLogoEl = document.getElementById('cookerLogo');
const startPageEl = document.querySelector('.startPage'); // hidden start page content
const logoTextEl = document.querySelector('.logoText')
let inputVal = document.getElementById("inputText");
const favListEl = document.querySelector('.favList');
const searchedMeal = localStorage.getItem('searchedMeal');





const startPage = () => {
  console.log(searchedMeal)
  if (searchedMeal) {
    startPageEl.style.display = 'none';
    headerLogoEl.style.display = 'block';
    logoTextEl.style.display = 'block';
    inputVal.value = searchedMeal.toString();
    renderMeal(searchedMeal);
  } else {
    startPageEl.style.display = 'all';
  }
}



const foodApi = async (url) => {
  try {
    const response = await fetch(url); //fetch Food Api
    if (!response.ok) {
      throw new Error('There is some error on API.')
    }

    // console.log('response', response);
    const data = await response.json(); //get the data as JSON format 

    if (data.meals === null) {
      throw new Error('data is null');
    }
    return data;
  } catch (err) {
    alert(err)
  }

}

function getInputValue() {
  const inputVal = document.getElementById("inputText").value;
  // Selecting the input element and get its value 
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
  const inputVal = document.getElementById("inputText").value;
  const mealList = document.querySelector('.mealList');
  let col = '';
  try {
    const data = await foodApi(FOOD_URL + meal);
    if (data === undefined) {
      throw new Error(err)
    }
    localStorage.setItem('searchedMeal', inputVal)
    console.log(inputVal);
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
  } catch (err) {
    console.log(err);
  }
  mealList.innerHTML = col;
};
// data.meals.forEach(meal => {
// const obj = {
//   meal: meal.strMeal,
//   id: meal.idMeal
// }


const favArr = [];
let favList = '';
const addFavourate = (mealName, mealId, mealImg) => {
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
      <div class="card favCard" style="width: 18rem;">
        <img src="${mealImg}" style="height:100%" class="card-img-top" alt="meal">
        <div class="card-body">
        <h4>${mealName}</h4>
        </div>
      </div>
    </div>
  `;
    localStorage.setItem('favArr', favArr); // store favorite meals in the local storage and show it again after refresh the page
  }
  favListEl.innerHTML = favList;
  console.log(favArr)
}

const showFavorite = () => {
  const favArr = localStorage.getItem('favArr');
  console.log(favArr)
  let template = '';
  for (let meal of favArr) {
    template += `
    <div class="meals  col-lg-6 col-sm-12  m-0">
   <div class="card favCard" style="width: 18rem;">
     <img src="${meal.img}" style="height:100%" class="card-img-top" alt="meal">
     <div class="card-body">
     <h4>${meal.name}</h4>
     </div>
   </div>
 </div>
`
  }
  favListEl.innerHTML = template;
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
  modalTitle = `
  <p>${data.meals[0].strMeal}</p>
  <a href='${data.meals[0].strYoutube}' target=”_blank”>Go to Recipe Video</a>`;
  modalTitleEl.innerHTML = modalTitle;
  const resultArr = recipe.split('\r\n'); // split the instructions according to recipe steps
  resultArr.forEach(recipe => {
    step += `<p>${recipe}</p>`;
  });
  recipeBox.innerHTML = step;
};


window.addEventListener('load', startPage);
