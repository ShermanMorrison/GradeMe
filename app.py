__author__ = 'phrayezzen'

from flask import Flask, request, redirect, flash, jsonify, url_for
from werkzeug import secure_filename
import sqlite3 as lite
import uuid
from math import ceil
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
    userrow = c.fetchone()
    return User(userrow['username'], userrow['firstName'], userrow['lastName'], bool(userrow['grader']))

@app.route("/")
@app.route("/index")
def index():
    if "logged_in" in session and not session['logged_in']:
        return redirect(url_for("login"))
    return app.send_static_file("index.html")

@app.route("/assign", methods=["GET", "POST"])
def assign():
    if request.method == "GET":
        return app.send_static_file("assign.html")
    elif request.method == "POST":
        f = request.form
        qs = f.getlist("questions[]")
        for q in qs:
            with con:
                cur.execute("""DELETE FROM grader2question WHERE tId = ? AND question = ?""", [f["test"], q])
                cur.execute("""INSERT INTO grader2question (username, tId, question) VALUES (?, ?, ?)""",
                            [f["grader"], f["test"], q])
        return ('', 204)

@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "GET":
        return app.send_static_file("upload.html")
    elif request.method == "POST":
        files = request.files.getlist("files[]")
        f = request.form
        rev = f["reverse"] == "1"
        with con:
            cur.execute("""SELECT qPerPage, qTotal FROM test WHERE tId = ?""", [f["test"]])
            c = cur.fetchone()
            pTotal = int(ceil(c["qTotal"] / c["qPerPage"]))
            p = (pTotal - 1 if rev else 0)
            for i in files:
                file_name = uuid.uuid1()
                cur.execute("""INSERT INTO page (uuid, professor, tId, pageNum) VALUES (?, ?, ?, ?)""",
                            [file_name, f["professor"], f["test"], p])
                i.save(app.config['UPLOAD_FOLDER'] + "/" + secure_filename(file_name))
                p += (-1 if rev else 1)
                p %= pTotal
        return ('', 204)

@app.route("/grade", methods=["GET", "POST"])
def grade():
    if request.method == "GET":
        return app.send_static_file("grade.html")
    elif request.method == "POST":
        f = request.form
        with con:
            cur.execute("""SELECT qPerPage, qTotal FROM test WHERE tId = ?""", [f["test"]])
            c = cur.fetchone()
            page = int(ceil(f["question"] / c["qPerPage"]))
            cur.execute("""SELECT uuid FROM page WHERE professor = ? AND tId = ? AND page = ?""",
                        [f["professor"], f["test"], page])
            uuids = cur.fetchall()
            for id in uuids:
                pass


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        f = request.form
        with con:
            cur.execute("""INSERT INTO person (firstName, lastName, username, password, grader)
                           VALUES (?, ?, ?, ?, ?)""",
                           (f['firstName'], f['lastName'], f['usernameR'], f['passwordR'], f['grader']))
            con.commit()

        if f['grader'] == "1":
            profs = request.form.getlist("professors[]")
            for prof in profs:
                cur.execute("""INSERT INTO professor2grader (professor, grader)
                               VALUES (?, ?)""", [prof, f['usernameR']])
            con.commit()

        login_user(User(f['usernameR'], f['firstName'], f['lastName'], f['grader']))
        session['logged_in'] = True

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

@app.route("/professor")
def professor():
    with con:
        cur.execute("""SELECT firstName, lastName, username FROM person WHERE grader = ?""", (str(0),))
        contact = {"result": cur.fetchall(), "username": current_user.username}
        return jsonify(contact)

@app.route("/test", methods=["GET", "POST"])
@app.route("/test/<string:prof>", methods=["GET", "POST"])
def test(prof=None):
    if request.method == "POST":
        f = request.form
        with con:
            cur.execute("""INSERT INTO test (name, professor, qPerPage, qTotal)
                           VALUES (?, ?, ?, ?)""",
                           (f['testName'], f['professor'], f['qPerPage'], f['qTotal']))
            con.commit()
        return ('', 204)
    elif request.method == "GET":
        if prof == '' and current_user.grader == True:
            return redirect(url_for("index"))
        with con:
            cur.execute("""SELECT tId, name, qTotal FROM test WHERE professor = ?""",
                        [prof if prof else current_user.username])
            return jsonify({"result": cur.fetchall()})

@app.route("/grader", methods=["GET", "POST"])
def grader():
    if request.method == "GET":
        if current_user.grader == 1:
            return redirect(url_for("index"))
        with con:
            cur.execute("""SELECT firstName, lastName, username FROM person WHERE username IN
                          (SELECT grader FROM professor2grader WHERE professor = ?)""",
                        [current_user.username])
            return jsonify({"result": cur.fetchall(),
                            "self": [current_user.username, current_user.first_name, current_user.last_name]})
    else:
        return 'hi'

@app.route("/question/<string:test>")
def question(test):
    with con:
        cur.execute("""SELECT question FROM grader2question WHERE tId = ? AND username = ?""",
                    [test, current_user.username])
        return jsonify({"result": cur.fetchall()})

@app.route("/img/<string:id>")
def img(id):
    app.send_static_file("/img/" + id)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)