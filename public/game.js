const gameContainer = document.getElementById('game-container')
const ingredientsPortals = document.querySelectorAll('.ingredient-portal')
const cookPositions = document.querySelectorAll('.cook-position')
const scoreContainer = document.getElementById('score')
const livesContainer = document.getElementById('lives')
const gameOverContainer = document.getElementById('game-over')
const controlLeft = document.getElementById('control-left')
const controlRight = document.getElementById('control-right')

const cook = createCook()

const ingredients = ['🍅', '🌽', '🥔', '🥒', '🥬', '🍐', '🥑', '🍊', '🍉', '🍇']
const badIngredients = ['👟', '⚽️', '🎈', '🧩', '🎱', '🥄', '📞']
const live = '❤️'
const badIngredientFrequency = 8

let ingredientFallSpeed = 10
let ingredientCreationInterval = 2000
let currentCookPosition = 2
let speedIncreaseThreshold = 50

let score = 0
let lives = 3
let isGameOver = false

document.addEventListener('DOMContentLoaded', function () {
  // Check if Fullscreen API is supported
  if (document.documentElement.requestFullscreen) {
    // Trigger fullscreen mode
    document.documentElement.requestFullscreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    // Firefox
    document.documentElement.mozRequestFullScreen()
  } else if (document.documentElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    document.documentElement.webkitRequestFullscreen()
  } else if (document.documentElement.msRequestFullscreen) {
    // IE/Edge
    document.documentElement.msRequestFullscreen()
  }
})

function createCook() {
  const cookElement = document.createElement('div')
  cookElement.innerHTML = '👩‍🍳'
  return cookElement
}
function createIngredient() {
  if (isGameOver) return
  const ingredientInitialPosition = Math.floor(Math.random() * 4)
  const ingredient = createIngredientElement()
  let isBadIngredient = false

  if (Math.floor(Math.random() * badIngredientFrequency) === 0) {
    isBadIngredient = true
    ingredient.innerText = getRandomBadIngredient()
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
  ingredient.style.top = '0px'
  ingredient.innerText = getRandomIngredient()
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

  if (lives <= 0) {
    isGameOver = true
    gameOverContainer.innerHTML = `<h1>Game Over</h1><p>Your score: ${score}</p>`
    gameOverContainer.classList.remove('hidden')
    gameOverContainer.classList.add('flex flex-col items-center')
  } else {
  }
}

function updateScore() {
  scoreContainer.innerText = score
}

function updateLives() {
  livesContainer.innerHTML = ''
  for (let i = 0; i < lives; i++) {
    livesContainer.innerText += live
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

  if (event.target.closest('#control-left')) {
    moveCookLeft()
  } else if (event.target.closest('#control-right')) {
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
