__author__ = 'phrayezzen'

from flask import Flask, request, jsonify
from werkzeug import secure_filename
import sqlite3 as lite

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "/Users/phrayezzen/Documents/Projects/GradeMe/imgtest"
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

@app.route("/uplod", methods=["POST"])
def uplod():
	files = request.files.getlist("files[]")
	for i in files:
		i.save(app.config['UPLOAD_FOLDER'] + "/" + secure_filename(i.filename))
	return ('', 204)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)