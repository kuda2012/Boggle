from unittest import TestCase
from app import app
from flask import session, request
from boggle import Boggle
import json



app.config['TESTING'] = True

# # This is a bit of hack, but don't use Flask DebugToolbar
# app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
# app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False
# Make Flask errors be real errors, not HTML pages with error info

class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!



    # @classmethod

    # def setUpClass(cls):
    #     print("Inside Set up Class")
    
    # @classmethod
    # def tearDownClass(cls):
    #     print("Inside Tear Down Class")

    # def setUp(self):
    #     print("Inside Set up")
    
    # def tearDown(self):
    #     print("Inside Tear down")

    def test_board_made(self):
        "Check if board made, check if it, and list of used_words are added to the session"
        with app.test_client() as client:
            res = client.get("/")
            html = res.get_data(as_text=True)
            self.assertEqual(res.status_code, 200)
            self.assertTrue(session["board"])
            self.assertEqual(session["used_words"], [])
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            # self.assertIn(f"<tbody id =\"length_{len(board)}\">", html)
            # self.assertIn("<td>", html)

        
    
    def test_valid_word(self):
        "Check if word entered to see if it has been used already comes back as string from boggle.py"
        with app.test_client() as client:
             with client.session_transaction() as sess:
                sess['board'] = [["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"], 
                                 ["C", "A", "T", "T", "T"]]
            
            
                sess["used_words"] =[]
            #  client.get("/")
        sent = {"wordGuess":"cat"}
        res = client.get("/check-word",query_string = sent)
        self.assertEqual(res.json['result'], 'ok')



    def test_invalid_word(self):
        """Test if word is in the dictionary"""
        with app.test_client() as client:
            client.get("/")
            sent = {"wordGuess", "impossible"}
            response = client.get('/check-word?wordGuess=impossible')
            self.assertEqual(response.json['result'], 'not-on-board')


    def non_english_word(self):
        """Test if word is on the board"""
        with app.test_client() as client:
            client.get("/")
            response = client.get(
                '/check-word?guessWord=fsjdakfkldsfjdslkfjdlksf')
            self.assertEqual(response.json['result'], 'not-word')
    
    def test_post_score(self):
        "Check if highScore and number of times played is calculated"
        with app.test_client() as client:
            # pdb.set_trace()
            sent = {"score": 7}
            res = client.post("/post-score", json=sent)
            self.assertTrue(res.status_code,200)
            self.assertTrue(session["highscore"])
            self.assertTrue(session["nplays"])