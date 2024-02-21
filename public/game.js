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
      score += 1
      scoreContainer.innerText = score
    }
  }, ingredientFallSpeed)

  setTimeout(createIngredient, ingredientCreationInterval)
}

function increaseSpeed() {
  ingredientFallSpeed -= 1
  ingredientCreationInterval -= 10
  if (ingredientFallSpeed < 1) ingredientFallSpeed = 5
  if (ingredientCreationInterval < 100) ingredientCreationInterval = 500
  console.log('Speed:', ingredientFallSpeed)
  console.log('Interval:', ingredientCreationInterval)
}

function createIngredientAndIncreaseSpeed() {
  createIngredient()
  increaseSpeed()
  setTimeout(createIngredientAndIncreaseSpeed, ingredientCreationInterval)
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

  // increaseSpeed()
  // setTimeout(createIngredient, ingredientCreationInterval)
  // createIngredientAndIncreaseSpeed()

  // setInterval(() => {
  //   createIngredient()
  //   increaseSpeed()
  // }, ingredientCreationInterval)
}

initGame()
