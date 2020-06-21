class Game {
  constructor() {
    this.score = document.getElementById("score");
    this.highScore = document.getElementById("highScore");
    // binding the value of this for the addEventListener callback function
    this.handleFormSubmitBound = this.handleFormSubmit.bind(this);
    this.getForm();
    this.endGameLogicBound = this.endGameLogic.bind(this);
    this.endGame();
  }

  getForm() {
    const getForm = document.getElementById("theForm");
    // passing that function which has a bound value of the this keyword
    getForm.addEventListener("submit", this.handleFormSubmitBound);
  }

  // added this as a separate method
  async handleFormSubmit(evt) {
    evt.preventDefault();
    const getWord = document.getElementById("guess");
    const wordGuess = getWord.value;
    getWord.value = "";
    const response = await axios.get("/check-word", {
      params: { wordGuess: wordGuess },
    });
    this.showResult(response);
  }

  showResult(response) {
    this.removeOldResult();
    const guessResult = document.getElementById("guessResult");
    const answer = document.createElement("p");
    answer.setAttribute("id", "result-text");
    if (response.data === "Word Already Used") {
      answer.innerText = response.data;
    } else if (response.data.result === "ok") {
      answer.innerText = response.data.result;
      const word = response.config.params.wordGuess;
      this.tallyScore(word);
    } else {
      answer.innerText = response.data.result;
    }
    guessResult.append(answer);
  }

  removeOldResult() {
    if (document.getElementById("result-text")) {
      document.getElementById("result-text").remove();
    }
  }
  tallyScore(word) {
    let theScore = parseInt(this.score.innerText);
    word = parseInt(word.length);
    if (isNaN(theScore)) {
      theScore = word;
      this.score.innerText = theScore;
    } else {
      this.score.innerText = word + theScore;
    }
  }
  endGame() {
    // setTimeout(function () {
    //   alert("Game Over.");
    //   submitButton.disabled = true;
    //   startGame.disabled = true;
    //   startGame.classList.toggle("green");
    //   startGame.classList.toggle("red");
    //   console.log(this);
    //   this.gameStats.bind(Game);
    // }, 20000);
    // console.log(this);
    setTimeout(this.endGameLogicBound, 20000);
  }
  endGameLogic() {
    alert("Game Over.");
    submitButton.disabled = true;
    startGame.disabled = true;
    startGame.remove();
    const section = document.getElementById("section");
    const resetButton = document.createElement("button");
    resetButton.innerText = "Reset Button";
    resetButton.addEventListener("click", function () {
      location.reload();
    });
    section.prepend(resetButton);
    this.gameStats();
  }

  async gameStats() {
    const response = await axios.post("/post-score", {
      score: parseInt(this.score.innerText),
    });
    this.highScore.innerText = response.data.highscore;
    if (response.data.brokeRecord) {
      alert("You set a new record!!!");
    }
  }
}

const submitButton = document.getElementById("submitButton");
submitButton.disabled = true;
alert(
  'Upon clicking "Start Game" you have 60 seconds to play the game. Good luck.'
);
startGame.addEventListener("click", function () {
  submitButton.disabled = false;
  startGame.classList.toggle("green");
  new Game();
});
