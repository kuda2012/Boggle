const getForm = document.getElementById("theForm");
const getWord = document.getElementById("guess");
const guessResult = document.getElementById("guessResult");
const scoreBoard = document.getElementById("scoreboard");
const score = document.getElementById("score");
const startGame = document.getElementById("startGame");
const submitButton = document.getElementById("submitButton");
const highScore = document.getElementById("highScore");
submitButton.disabled = true;
alert(
  'Upon clicking "Start Game" you have 60 seconds to play the game. Good luck.'
);

startGame.addEventListener("click", function () {
  submitButton.disabled = false;
  startGame.classList.toggle("green");
  setTimeout(function () {
    alert("Game Over.");
    submitButton.disabled = true;
    startGame.disabled = true;
    startGame.classList.toggle("green");
    startGame.classList.toggle("red");
    gameStats();
  }, 20000);
});
getForm.addEventListener("submit", async function (evt) {
  evt.preventDefault();
  const wordGuess = getWord.value;
  getWord.value = "";
  const response = await axios.get("/check-word", {
    params: { wordGuess: wordGuess },
  });
  showResult(response);
});

function showResult(response) {
  removeOldResult();

  answer = document.createElement("p");
  answer.setAttribute("id", "result-text");
  if (response.data === "Word Already Used") {
    answer.innerText = response.data;
  } else if (response.data.result === "ok") {
    answer.innerText = response.data.result;
    word = Object.values(response.config.params)[0];
    tallyScore(word);
  } else {
    answer.innerText = response.data.result;
  }
  guessResult.append(answer);
}

function removeOldResult() {
  if (document.getElementById("result-text")) {
    document.getElementById("result-text").remove();
  }
}
function tallyScore(word) {
  let theScore = parseInt(score.innerText);
  word = parseInt(word.length);
  if (isNaN(theScore)) {
    theScore = word;
    score.innerText = theScore;
  } else {
    score.innerText = word + theScore;
  }
}

async function gameStats() {
  const response = await axios.post("/post-score", {
    score: parseInt(score.innerText),
  });
  highScore.innerText = response.data.highscore;
  if (response.data.brokeRecord) {
    alert("You set a new record!!!");
  }
  console.log(response);
}
