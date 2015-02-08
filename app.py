__author__ = 'phrayezzen'

from flask import Flask, request, redirect, flash, jsonify, url_for
from werkzeug import secure_filename
import sqlite3 as lite
from flask.ext.login import LoginManager, login_user, logout_user, session, current_user

from model import *

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "/Users/phrayezzen/Documents/Projects/GradeMe/imgtest"
app.config['SECRET_KEY'] = "1234567890"

lm = LoginManager()
lm.init_app(app)

con = lite.connect("grader.db", check_same_thread=False)
def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))
con.row_factory = make_dicts
cur = con.cursor()

@lm.user_loader
def load_user(id):
    c = cur.execute("SELECT * from person where username = (?)", [id])
    user = c.fetchone()
    return User(user['username'], user['firstName'], user['lastName'], bool(user['grader']))

@app.route("/")
@app.route("/index")
def index():
    if not session['logged_in']:
        return redirect(url_for("login"))
    return app.send_static_file("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        f = request.form
        with con:
            cur.execute("""INSERT INTO person (firstName, lastName, username, password, grader)
                           VALUES (?, ?, ?, ?, ?)""",
                           (f['firstName'], f['lastName'], f['usernameR'], f['passwordR'], f['grader']))
            con.commit()
        session['logged_in'] = True
        login_user(User(f['usernameR'], f['firstName'], f['lastName'], f['grader']))
        flash("logged in")
        return redirect("/")
    elif request.method == "GET":
        return app.send_static_file("register.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return app.send_static_file("register.html")
    elif request.method == "POST":
        user = request.form['username']
        passw = request.form['password']
        c = cur.execute("SELECT * from person where username = (?)", [user])
        userexists = c.fetchone()
        if userexists:
            c = cur.execute("SELECT password from person where password = (?) and username = (?)",
                            [passw, user])
            passwcorrect = c.fetchone()
            if passwcorrect:
                print 'hi'
                session['logged_in'] = True
                login_user(User(userexists['username'], userexists['firstName'],
                                userexists['lastName'], bool(userexists['grader'])))
                flash("logged in")
                return redirect(url_for("index"))
            else:
                flash("Password Failed")
                return ('', 204)
        else:
            flash("Username Failed")
            return ('', 204)

@app.route("/logout")
def logout():
    session['logged_in'] = False
    logout_user()
    return redirect("/")

@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "GET":
        return app.send_static_file("upload.html")
    elif request.method == "POST":
        files = request.files.getlist("files[]")
        for i in files:
            i.save(app.config['UPLOAD_FOLDER'] + "/" + secure_filename(i.filename))
        return ('', 204)

@app.route("/professor")
def professor():
    with con:
        cur.execute("""SELECT firstName, lastName, username FROM person WHERE grader = ?""", (str(0),))
        contact = {"result": cur.fetchall()}
        return jsonify(contact)

@app.route("/test", methods=["GET", "POST"])
def test():
    if request.method == "POST":
        f = request.form
        with con:
            cur.execute("""INSERT INTO test (professor, qPerPage, qTotal)
                           VALUES (?, ?, ?)""",
                           (f['professor'], f['qPerPage'], f['qTotal']))
            con.commit()
            cur.execute("""SELECT * FROM contact WHERE contactId = ?""", (str(cur.lastrowid),))
            contact = {"result": [cur.fetchone()]}
            return jsonify(contact)
    elif request.method == "GET":
        return 'hi'

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)