import { recipes } from "./recipe.js";

const body = document.getElementById("body");
const recipeCardsContainer = document.getElementById("recipe-cards");
const modal = document.getElementById("modal");
const modalInner = document.getElementById("modal_content");
const modalCloseBtn = document.getElementById("modal_close_btn");
const searchBar = document.getElementById("search_bar");
const dietFilter = document.getElementById("diet");
const prepFilter = document.getElementById("prep");

let card
let modal_content

function renderRecipes(recipeArray) {
    recipeCardsContainer.innerHTML = "";
    for (const recipe of recipeArray) {
        card = 
        `
        <div class="recipe-card" id="${recipe.id}">
            <img src="images/${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p>${recipe.description}</p>
            <div class="facts">
                <span>Calories: ${recipe.calories}</span>
                <span>⏱️: ${recipe.prepTime} mins</span>
            </div>
            <div class="diet-tags">
                ${recipe.diet.map(d => `<span class="diet-tag">${d}</span>`).join('')}
            </div>
        </div>
        `

        recipeCardsContainer.innerHTML += card;
    }

    modalPopup(document.querySelectorAll('.recipe-card'));
}

renderRecipes(recipes);

function modalPopup(recipeCardsList) {
    recipeCardsList.forEach(card => {
    card.addEventListener('click', function(e) {
            const clickedId = parseInt(e.currentTarget.id);
            for (const recipe of recipes) {
                if (recipe.id === clickedId) {
                    modal_content = `
                    <h2>${recipe.name}</h2>
                    <ul>
                        ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                    `
                    modalInner.innerHTML = modal_content;
                    break;
                }
            }

            modal.style.display = "block";
            document.body.classList.add("modal-open");
        })
    })
}

modalCloseBtn.addEventListener('click', function() {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
})

searchBar.addEventListener("input", () => {
    renderRecipes(getFilteredRecipes());
});

const prepTimeRanges = {
    "": [0, Infinity],       
    "10": [0, 10],           
    "20": [11, 20],         
    "30": [21, 30],        
    "31": [31, Infinity]     
}


function getFilteredRecipes() {
    const term = searchBar.value.trim().toLowerCase();
    const selectedDiet = dietFilter.value;
    const [minPrep, maxPrep] = prepTimeRanges[prepFilter.value];

    return recipes.filter(recipe => {
        const matchesSearch =
            term === "" ||
            recipe.name.toLowerCase().includes(term) ||
            recipe.description.toLowerCase().includes(term);

        const matchesDiet =
            selectedDiet === "" ||
            recipe.diet.includes(selectedDiet);

        const matchesPrep = recipe.prepTime >= minPrep && recipe.prepTime <= maxPrep;

        return matchesSearch && matchesDiet && matchesPrep;
    });
}




dietFilter.addEventListener("change", function() {
    renderRecipes(getFilteredRecipes());
})

prepFilter.addEventListener("change", function(){
    renderRecipes(getFilteredRecipes());
})