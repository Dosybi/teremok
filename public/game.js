const gameContainer = document.getElementById('game-container')
const ingredientContainer = document.getElementById('ingredients')
const ingredientsPortals = document.querySelectorAll('.ingredient-portal')
const cookPositionsContainer = document.getElementById('cook-positions')
const cookPositions = document.querySelectorAll('.cook-position')

const cook = (document.createElement('div').innerHTML = '👩‍🍳')

const ingredients = ['🍅', '🥦', '🥕', '🌽', '🥔', '🍠', '🍆', '🥒', '🥬', '🥗']

let score = 0
let lives = 3

function createIngredient() {
  const ingredientPosition = Math.floor(Math.random() * 4)
  const ingredient = document.createElement('div')
  ingredient.innerText =
    ingredients[Math.floor(Math.random() * ingredients.length)]
  ingredient.className = 'ingredient'

  ingredientsPortals[ingredientPosition].append(ingredient)
  console.log(ingredientPosition)
  console.log(ingredient)
}

function updateScoreAndLives() {}

function catchIngredient() {}

function missIngredient() {}

function gameLoop() {}

function initGame() {
  let currentCookPosition = 2
  cookPositions[currentCookPosition].append(cook)

  createIngredient()

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      if (currentCookPosition > 0) {
        cookPositions[currentCookPosition].innerHTML = ''
        currentCookPosition--
        cookPositions[currentCookPosition].append(cook)
      }
    }
    if (event.key === 'ArrowRight') {
      if (currentCookPosition < 4) {
        cookPositions[currentCookPosition].innerHTML = ''
        currentCookPosition++
        cookPositions[currentCookPosition].append(cook)
      }
    }
  })
}

initGame()
