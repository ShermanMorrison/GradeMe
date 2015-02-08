__author__ = 'phrayezzen'

from flask import Flask, request, redirect, flash
from werkzeug import secure_filename
import sqlite3 as lite
from flask.ext.login import LoginManager, login_user, logout_user, login_required, session, current_user

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
    c = cur.execute("SELECT username from users where username = (?)", [id])
    userrow = c.fetchone()
    userid = userrow[0] # or whatever the index position is
    return userid

@app.route("/")
def index():
    if current_user is not None and current_user.is_authenticated():
        return app.send_static_file("register.html")
    return app.send_static_file("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    f = request.form
    with con:
        cur.execute("""INSERT INTO person (firstName, lastName, username, password, school, grader)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                       (f['first'], f['last'], f['username'], f['password'], f['school'], f['grader']))
        con.commit()
    session['logged_in']=True
    login_user(f['username'])
    flash("logged in")
    return redirect("/")

@app.route('/login', methods=["GET", "POST"])
def login():
    user = request.form['username']
    passw = request.form['password']
    c = cur.execute("SELECT username from person where username = (?)", [user])
    userexists = c.fetchone()
    if userexists:
        c = cur.execute("SELECT password from person where password = (?) and username = (?)",
                        [passw, userexists[0]])
        passwcorrect = c.fetchone()
        if passwcorrect:
            session['logged_in']=True
            login_user(user)
            flash("logged in")
            return redirect("/")
        else:
            return 'incorrect pw'
    else:
        return 'fail'

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")

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