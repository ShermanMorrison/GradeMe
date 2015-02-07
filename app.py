__author__ = 'phrayezzen'

from flask import Flask, request, jsonify
import sqlite3 as lite

app = Flask(__name__)
# con = lite.connect("audio.db", check_same_thread=False)
# def make_dicts(cursor, row):
#     return dict((cursor.description[idx][0], value)
#                 for idx, value in enumerate(row))
# con.row_factory = make_dicts
# cur = con.cursor()

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/upload")
def upload():
    return app.send_static_file("upload.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0")