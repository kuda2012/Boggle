from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, session, jsonify





app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"
BOARD_KEY = "board"
USED_WORDS_KEY = "used_words"
boggle_game = Boggle()

# debug = DebugToolbarExtension(app)
# app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False




@app.route("/")

def show_board():
    """Creates a board and then populates board.html with the board values"""
    board = boggle_game.make_board()
    session[USED_WORDS_KEY] = []
    session[BOARD_KEY] = board
    return render_template("board.html", board = board)


@app.route("/check-word")

def check_board():
    """grabs inputted word and sees if it a real word, or not. If so, sees if the word is on the board"""
    word = request.args["wordGuess"]
    board = session[BOARD_KEY]
    # print(word)
    # print(board)
    response = boggle_game.check_valid_word(board, word)
    # print(response)


    def check_if_used_word(response, word):
        """check if the real word is one that has been used already"""
        if response == "ok" and word not in session[USED_WORDS_KEY]:
            swapper = session[USED_WORDS_KEY]
            swapper.append(word)
            session[USED_WORDS_KEY] = swapper
        elif response == "ok" and word in session[USED_WORDS_KEY]:
            return "1"


    answer = check_if_used_word(response, word)
    if answer == "1":
        response = "Word Already Used"
    return jsonify({'result': response})



@app.route("/post-score", methods = ["POST"])

def stats():
    """Counts the number of times the player has played the game, and keeps a track of the highest score"""
    if session.get("nplays", False) == False:
        session["nplays"] = 1
    else:
        session["nplays"] = session["nplays"] + 1
    score = request.json["score"]
    # print(score)
    # score = 5
    highscore = session.get("highscore", 0)
    session["highscore"] = max(score, highscore)
    return jsonify(brokeRecord = score > highscore, highscore = session["highscore"])