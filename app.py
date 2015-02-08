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
    userrow = c.fetchone()
    print id
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
                cur.execute("""INSERT INTO grader2question (username, tId, question) VALUES (?, ?, ?)""",
                            [f["grader"], f["test"], q])
        return ('', 204)

@app.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == "GET":
        return app.send_static_file("upload.html")
    elif request.method == "POST":
        files = request.files.getlist("files[]")
        for i in files:
            i.save(app.config['UPLOAD_FOLDER'] + "/" + secure_filename(i.filename))
        return ('', 204)

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
            return jsonify({"result": cur.fetchall()})
    else:
        return 'hi'

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)