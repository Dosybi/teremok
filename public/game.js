const gameContainer = document.getElementById('game-container')
const ingredientContainer = document.getElementById('ingredients')
const ingredientsPortals = document.querySelectorAll('.ingredient-portal')
const cookPositionsContainer = document.getElementById('cook-positions')
const cookPositions = document.querySelectorAll('.cook-position')
const scoreContainer = document.getElementById('score')

const cook = document.createElement('div')
cook.innerHTML = '👩‍🍳'

const ingredients = ['🍅', '🥦', '🥕', '🌽', '🥔', '🍠', '🍆', '🥒', '🥬', '🥗']

let ingredientFallSpeed = 20
let ingredientCreationInterval = 2000
let currentCookPosition = 2

let score = 0
let lives = 3

// function createIngredient() {
//   let ingedientHeight = 0
//   const ingredientInitialPosition = Math.floor(Math.random() * 4)
//   const ingredient = document.createElement('div')

//   ingredient.style.position = 'absolute'
//   ingredient.style.top = '0px'
//   ingredient.innerText =
//     ingredients[Math.floor(Math.random() * ingredients.length)]
//   ingredient.className = 'ingredient'

//   ingredientsPortals[ingredientInitialPosition].append(ingredient)

//   setInterval(() => {
//     ingedientHeight += 1
//     ingredient.style.top = `${ingedientHeight}px`
//   }, 20)
// }

function createIngredient() {
  let ingredientHeight = 0
  const ingredientInitialPosition = Math.floor(Math.random() * 4)
  const ingredient = document.createElement('div')

  ingredient.style.position = 'absolute'
  ingredient.style.top = '0px'
  ingredient.innerText =
    ingredients[Math.floor(Math.random() * ingredients.length)]
  ingredient.className = 'ingredient'

  ingredientsPortals[ingredientInitialPosition].append(ingredient)

  const fallInterval = setInterval(() => {
    ingredientHeight += 1
    ingredient.style.top = `${ingredientHeight}px`
    if (ingredientHeight >= gameContainer.offsetHeight) {
      clearInterval(fallInterval)
      ingredient.remove()
    }

    if (
      ingredientHeight >= gameContainer.offsetHeight - cook.offsetHeight &&
      ingredientInitialPosition === currentCookPosition
    ) {
      clearInterval(fallInterval)
      ingredient.remove()
      score += 1 // increase score
      scoreContainer.innerText = score // update score display
    }
  }, ingredientFallSpeed)
}

function increaseSpeed() {
  ingredientFallSpeed -= 1 // increase speed
  ingredientCreationInterval -= 100 // decrease interval
  // if (ingredientFallSpeed < 5) ingredientFallSpeed = 5 // set a minimum speed
  // if (ingredientCreationInterval < 500) ingredientCreationInterval = 500 // set a minimum interval

  console.log('ingredientCreationInterval', ingredientCreationInterval)
  console.log('ingredientFallSpeed', ingredientFallSpeed)
}

function updateScoreAndLives() {}

function catchIngredient() {}

function missIngredient() {}

function gameLoop() {}

function initGame() {
  cookPositions[currentCookPosition].append(cook)
  scoreContainer.innerText = score

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
      if (currentCookPosition < 3) {
        cookPositions[currentCookPosition].innerHTML = ''
        currentCookPosition++
        cookPositions[currentCookPosition].append(cook)
      }
    }
  })

  setInterval(() => {
    createIngredient()
    increaseSpeed()
  }, ingredientCreationInterval)
}

initGame()
