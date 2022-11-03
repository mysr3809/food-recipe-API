const FOOD_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;
const RECIPE_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772';
const inputEl = document.querySelector('.input-group');

const foodApi = async (url) => {
  const response = await fetch(url); //fetch Food Api
  // console.log('response', response);
  const data = await response.json(); //get the data as JSON format 

  return data;
}