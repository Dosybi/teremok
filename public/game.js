const gameContainer = document.getElementById('game-container')
const ingredientsPortals = document.querySelectorAll('.ingredient-portal')
const cookPositions = document.querySelectorAll('.cook-position')
const scoreContainer = document.getElementById('score')
const livesContainer = document.getElementById('lives')
const gameOverContainer = document.getElementById('game-over')
const controlLeft = document.getElementById('control-left')
const controlRight = document.getElementById('control-right')

const cook = createCook()

const ingredients = [
  `<img src="./assets/game/items/banana.png" />`,
  `<img src="./assets/game/items/cheese.png" />`,
  `<img src="./assets/game/items/cherry.png" />`,
  `<img src="./assets/game/items/chocolate.png" />`,
  `<img src="./assets/game/items/meat.png" />`,
  `<img src="./assets/game/items/mushroom.png" />`,
  `<img src="./assets/game/items/orange.png" />`,
  `<img src="./assets/game/items/salad.png" />`,
  `<img src="./assets/game/items/tuna.png" />`,
  `<img src="./assets/game/items/strawberry.png" />`,
]

const badIngredients = [
  `<img src="./assets/game/items/firext.png" />`,
  `<img src="./assets/game/items/basketball.png" />`,
  `<img src="./assets/game/items/calc.png" />`,
  `<img src="./assets/game/items/dice.png" />`,
  `<img src="./assets/game/items/fircone.png" />`,
  `<img src="./assets/game/items/guitar.png" />`,
  `<img src="./assets/game/items/iron.png" />`,
  `<img src="./assets/game/items/phone.png" />`,
  `<img src="./assets/game/items/scoop.png" />`,
  `<img src="./assets/game/items/teapot.png" />`,
]

const live = `<img src="./assets/game/heart.png" style="width: 30px" />`
const badIngredientFrequency = 8

let ingredientFallSpeed = 10
let ingredientCreationInterval = 2000
let currentCookPosition = 2
let speedIncreaseThreshold = 50

let score = 0
let lives = 5
let isGameOver = false

function createCook() {
  const cookElement = document.createElement('div')
  cookElement.innerHTML = `<img class="w-32" src="./assets/game/cook.png" />`
  return cookElement
}

function createIngredient() {
  if (isGameOver) return
  const ingredientInitialPosition = Math.floor(Math.random() * 4)
  const ingredient = createIngredientElement()
  let isBadIngredient = false

  if (Math.floor(Math.random() * badIngredientFrequency) === 0) {
    isBadIngredient = true
    ingredient.innerHTML = getRandomBadIngredient()
  }

  ingredientsPortals[ingredientInitialPosition].append(ingredient)

  const fallInterval = setInterval(() => {
    moveIngredientDown(ingredient, fallInterval, isBadIngredient)
  }, ingredientFallSpeed)

  setTimeout(createIngredient, ingredientCreationInterval)

  if (score >= speedIncreaseThreshold) {
    increaseSpeed()
    speedIncreaseThreshold += 5
  }
}

function getRandomBadIngredient() {
  return badIngredients[Math.floor(Math.random() * badIngredients.length)]
}

function createIngredientElement() {
  const ingredient = document.createElement('div')
  ingredient.style.position = 'absolute'
  ingredient.style.width = '40px'
  ingredient.style.top = '0px'
  ingredient.innerHTML = getRandomIngredient()
  ingredient.className = 'ingredient'
  return ingredient
}

function getRandomIngredient() {
  return ingredients[Math.floor(Math.random() * ingredients.length)]
}

function moveIngredientDown(ingredient, fallInterval, isBadIngredient) {
  const ingredientHeight = parseInt(ingredient.style.top) + 1
  ingredient.style.top = `${ingredientHeight}px`

  if (ingredientHeight >= gameContainer.offsetHeight) {
    clearInterval(fallInterval)
    ingredient.remove()

    if (!isBadIngredient) {
      loseLife()
    }
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
    if (isBadIngredient) {
      score -= 10
    } else {
      score += 10
    }
    updateScore()
  }
}

function loseLife() {
  lives -= 1
  updateLives()

  if (lives === 0) {
    isGameOver = true
    // gameOverContainer.innerHTML = `<div class="mx-auto" style="width: fit-content"><div style="width: fit-content">Конец</div><div style="width: fit-content">Your score: ${score}</div></div>`
    gameOverContainer.classList.remove('hidden')
    gameOverContainer.classList.add('flex-col')
  } else {
  }
}

function updateScore() {
  scoreContainer.innerText = `СЧЁТ: ${score}`
}

function updateLives() {
  livesContainer.innerHTML = ''
  for (let i = 0; i < lives; i++) {
    livesContainer.innerHTML += live
  }
}

function increaseSpeed() {
  ingredientFallSpeed -= 1
  ingredientCreationInterval -= 100

  ingredientFallSpeed = Math.max(ingredientFallSpeed, 1)
  ingredientCreationInterval = Math.max(ingredientCreationInterval, 400)
}

function handleArrowKey(event) {
  if (event.key === 'ArrowLeft' && currentCookPosition > 0) {
    moveCookLeft()
  } else if (event.key === 'ArrowRight' && currentCookPosition < 3) {
    moveCookRight()
  }
}

function handleTouch(event) {
  event.preventDefault()

  if (event.target.closest('#control-left') && currentCookPosition > 0) {
    moveCookLeft()
  } else if (
    event.target.closest('#control-right') &&
    currentCookPosition < 3
  ) {
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
  controlLeft.addEventListener('touchstart', handleTouch)
  controlRight.addEventListener('touchstart', handleTouch)
}

initGame()
