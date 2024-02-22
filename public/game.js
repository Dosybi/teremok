const gameContainer = document.getElementById('game-container')
const ingredientsPortals = document.querySelectorAll('.ingredient-portal')
const cookPositions = document.querySelectorAll('.cook-position')
const scoreContainer = document.getElementById('score')
const livesContainer = document.getElementById('lives')

const cook = createCook()

const ingredients = ['🍅', '🥦', '🥕', '🌽', '🥔', '🍠', '🍆', '🥒', '🥬', '🥗']
const badIngredients = ['👟', '⚽️', '🧽', '🎈', '🎫']

let ingredientFallSpeed = 10
let ingredientCreationInterval = 2000
let currentCookPosition = 2
let speedIncreaseThreshold = 5

let score = 0
let lives = 3

function createCook() {
  const cookElement = document.createElement('div')
  cookElement.innerHTML = '👩‍🍳'
  return cookElement
}
function createIngredient() {
  const ingredientInitialPosition = Math.floor(Math.random() * 4)
  const ingredient = createIngredientElement()

  ingredientsPortals[ingredientInitialPosition].append(ingredient)

  const fallInterval = setInterval(() => {
    moveIngredientDown(ingredient, fallInterval)
  }, ingredientFallSpeed)

  setTimeout(createIngredient, ingredientCreationInterval)

  if (score >= speedIncreaseThreshold) {
    increaseSpeed()
    speedIncreaseThreshold += 5
  }
}

function createIngredientElement() {
  const ingredient = document.createElement('div')
  ingredient.style.position = 'absolute'
  ingredient.style.top = '0px'
  ingredient.innerText = getRandomIngredient()
  ingredient.className = 'ingredient'
  return ingredient
}

function getRandomIngredient() {
  return ingredients[Math.floor(Math.random() * ingredients.length)]
}

function moveIngredientDown(ingredient, fallInterval) {
  const ingredientHeight = parseInt(ingredient.style.top) + 1
  ingredient.style.top = `${ingredientHeight}px`

  if (ingredientHeight >= gameContainer.offsetHeight) {
    clearInterval(fallInterval)
    ingredient.remove()
  }

  if (
    ingredientHeight >= gameContainer.offsetHeight - cook.offsetHeight &&
    ingredient.offsetLeft >= cookPositions[currentCookPosition].offsetLeft &&
    ingredient.offsetLeft <=
      cookPositions[currentCookPosition].offsetLeft +
        cookPositions[currentCookPosition].offsetWidth
  ) {
    clearInterval(fallInterval)
    ingredient.remove()
    score += 1
    updateScore()
  }
}

function updateScore() {
  scoreContainer.innerText = score
}

function updateLives() {
  livesContainer.innerText = lives
}

function increaseSpeed() {
  ingredientFallSpeed -= 1
  ingredientCreationInterval -= 100

  ingredientFallSpeed = Math.max(ingredientFallSpeed, 1)
  ingredientCreationInterval = Math.max(ingredientCreationInterval, 400)

  console.log('Speed:', ingredientFallSpeed)
  console.log('Interval:', ingredientCreationInterval)
}

function handleArrowKey(event) {
  if (event.key === 'ArrowLeft' && currentCookPosition > 0) {
    moveCookLeft()
  } else if (event.key === 'ArrowRight' && currentCookPosition < 3) {
    moveCookRight()
  }
}

function moveCookLeft() {
  updateCookPosition(-1)
}

function moveCookRight() {
  updateCookPosition(1)
}

function updateCookPosition(offset) {
  cookPositions[currentCookPosition].innerHTML = ''
  currentCookPosition += offset
  cookPositions[currentCookPosition].append(cook)
}

function initGame() {
  cookPositions[currentCookPosition].append(cook)
  updateScore()
  updateLives()

  createIngredient()

  document.addEventListener('keydown', handleArrowKey)
}

initGame()
