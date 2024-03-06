const gameContainer = document.getElementById('game-container')
const ingredientsPortals = document.querySelectorAll('.ingredient-portal')
const cookPositions = document.querySelectorAll('.cook-position')
const scoreContainer = document.getElementById('score')
const livesContainer = document.getElementById('lives')
const gameOverContainer = document.getElementById('game-over')
const controlsContainer = document.getElementById('controls')
const controlLeft = document.getElementById('control-left')
const controlRight = document.getElementById('control-right')
const playButton = document.getElementById('play')
const infoButton = document.getElementById('info')
const finalScore = document.getElementById('final-score')
const startButton = document.getElementById('start')
const muteButton = document.getElementById('mute')
const volumeButton = document.getElementById('volume')

const catchingSound = new Audio('./assets/sounds/pop.wav')
const failSound = new Audio('./assets/sounds/fail.wav')
const clickSound = new Audio('./assets/sounds/click.wav')
const music = new Audio('./assets/sounds/music.wav')

catchingSound.preload = 'auto'
failSound.preload = 'auto'
clickSound.preload = 'auto'
music.preload = 'auto'

// catchingSound.load()
// failSound.load()
// clickSound.load()
// music.load()

music.loop = true
music.volume = 0.7

const cook = createCook()

const ingredients = [
  `<img style="position: relative; z-index: 40" src="./assets/game/items/banana.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/strawberry.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/cheese.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/cherry.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/chocolate.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/meat.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/mushroom.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/orange.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/salad.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/tuna.png" />`,
]

const badIngredients = [
  `<img style="position: relative; z-index: 40" src="./assets/game/items/phone.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/dice.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/iron.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/guitar.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/calc.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/teapot.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/fircone.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/basketball.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/scoop.png" />`,
  `<img style="position: relative; z-index: 40" src="./assets/game/items/firext.png" />`,
]

const live = `<img src="./assets/game/heart.png" style="width: 30px" />`
const badIngredientFrequency = 8
const plateHeight = 50
const maxCatchableHeight = 100

let isSoundOn = true
let ingredientFallSpeed = 10
let ingredientCreationInterval = 2000
let currentCookPosition = 2
let speedIncreaseThreshold = 50

let score = 0
let lives = 5
let isGameOver = false

function createCook() {
  const cookElement = document.createElement('div')
  cookElement.innerHTML = `<img style="width: 112px" src="./assets/game/cook.png" />`
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

function createIngredientElement() {
  const ingredient = document.createElement('div')
  ingredient.style.position = 'absolute'
  ingredient.style.width = '40px'
  ingredient.style.top = '0px'
  ingredient.innerHTML = getRandomIngredient()
  ingredient.className = 'ingredient'
  return ingredient
}

const getSliceCount = () => {
  let sliceCount = 2
  if (score >= 50 && score < 100) {
    sliceCount = 4
  } else if (score >= 100 && score < 150) {
    sliceCount = 6
  } else if (score >= 150 && score < 200) {
    sliceCount = 8
  } else if (score >= 200) {
    sliceCount = 10
  }
  return sliceCount
}

function getRandomBadIngredient() {
  const sliceCount = getSliceCount()
  const badIngredientsSlice = badIngredients.slice(0, sliceCount)
  return badIngredientsSlice[
    Math.floor(Math.random() * badIngredientsSlice.length)
  ]
}

function getRandomIngredient() {
  const sliceCount = getSliceCount()
  const ingrediantsSlice = ingredients.slice(0, sliceCount)
  return ingrediantsSlice[Math.floor(Math.random() * ingrediantsSlice.length)]
}

function moveIngredientDown(ingredient, fallInterval, isBadIngredient) {
  if (isGameOver) {
    clearInterval(fallInterval)
    ingredient.remove()
    return
  }
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
    ingredientHeight >=
      gameContainer.offsetHeight - cook.offsetHeight + plateHeight &&
    ingredientHeight < gameContainer.offsetHeight - maxCatchableHeight &&
    ingredient.offsetLeft >= cookPositions[currentCookPosition].offsetLeft &&
    ingredient.offsetLeft <=
      cookPositions[currentCookPosition].offsetLeft +
        cookPositions[currentCookPosition].offsetWidth
  ) {
    clearInterval(fallInterval)
    ingredient.remove()
    if (isBadIngredient) {
      loseLife()
    } else {
      if (isSoundOn) catchingSound.cloneNode(true).play()
      score += 10
    }
    updateScore()
  }
}

function loseLife() {
  if (isSoundOn) failSound.cloneNode(true).play()
  lives -= 1
  updateLives()

  if (lives === 0) {
    isGameOver = true
    gameOverContainer.classList.remove('hidden')
    gameOverContainer.classList.add('flex-col')
    gameContainer.style.backgroundImage = 'url(./assets/game/bg_gameover.png)'
    gameContainer.style.backgroundPosition = 'bottom'
    cookPositions[currentCookPosition].innerHTML = ''
    scoreContainer.innerText = ''
    finalScore.innerText = `Счёт: ${score}`
    livesContainer.classList.add('hidden')
    controlsContainer.classList.add('hidden')
  }
}

function updateScore() {
  scoreContainer.innerText = score
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
    const button = controlLeft.children[0]
    button.src = './assets/game/btn_left_active.png'
    moveCookLeft()
    setTimeout(() => {
      button.src = './assets/game/btn_left.png'
    }, 200)
  } else if (
    event.target.closest('#control-right') &&
    currentCookPosition < 3
  ) {
    const button = controlRight.children[0]
    button.src = './assets/game/btn_right_active.png'
    moveCookRight()
    setTimeout(() => {
      button.src = './assets/game/btn_right.png'
    }, 200)
  }
}

function moveCookLeft() {
  if (isGameOver) return
  updateCookPosition(-1)
}

function moveCookRight() {
  if (isGameOver) return
  updateCookPosition(1)
}

function updateCookPosition(offset) {
  cookPositions[currentCookPosition].innerHTML = ''
  currentCookPosition += offset
  cookPositions[currentCookPosition].append(cook)
}

function initGame() {
  catchingSound.load()
  failSound.load()
  clickSound.load()
  music.load()

  score = 0
  lives = 5
  ingredientFallSpeed = 10
  ingredientCreationInterval = 2000
  speedIncreaseThreshold = 50
  isGameOver = false

  if (isSoundOn) {
    muteButton.classList.remove('hidden')
    volumeButton.classList.add('hidden')
    music.play()
  }

  playButton.src = './assets/btn_play.png'

  cookPositions[currentCookPosition].append(cook)
  updateScore()
  updateLives()

  createIngredient()

  document.addEventListener('keydown', handleArrowKey)
  controlLeft.addEventListener('touchstart', handleTouch)
  controlRight.addEventListener('touchstart', handleTouch)
}

playButton.addEventListener('touchstart', () => {
  if (isSoundOn) clickSound.play()
  playButton.src = './assets/btn_play_active.png'

  setTimeout(() => {
    gameContainer.style.backgroundImage = 'url(./assets/game/kitchen.png)'
    gameContainer.style.backgroundPosition = 'bottom'
    livesContainer.classList.remove('hidden')
    controlsContainer.classList.remove('hidden')
    startButton.classList.add('hidden')
    gameOverContainer.classList.add('hidden')
    initGame()
  }, 500)
})

gameContainer.style.backgroundImage = 'url(./assets/game/bg_gameover.png)'
gameContainer.style.backgroundPosition = 'bottom'
livesContainer.classList.add('hidden')
controlsContainer.classList.add('hidden')
gameOverContainer.classList.add('hidden')
startButton.classList.remove('hidden')

startButton.addEventListener('touchstart', () => {
  startButton.src = './assets/btn_play_active.png'
  if (isSoundOn) clickSound.play()

  setTimeout(() => {
    gameContainer.style.backgroundImage = 'url(./assets/game/kitchen.png)'
    gameContainer.style.backgroundPosition = 'bottom'
    livesContainer.classList.remove('hidden')
    controlsContainer.classList.remove('hidden')
    startButton.classList.add('hidden')
    gameOverContainer.classList.add('hidden')
    initGame()
  }, 500)
})

muteButton.addEventListener('touchstart', () => {
  isSoundOn = false
  music.pause()
  muteButton.classList.add('hidden')
  volumeButton.classList.remove('hidden')
})

volumeButton.addEventListener('touchstart', () => {
  isSoundOn = true
  music.play()
  muteButton.classList.remove('hidden')
  volumeButton.classList.add('hidden')
})

window.onblur = () => {
  if (!isGameOver) {
    lives = 1
    loseLife()
  }
}
