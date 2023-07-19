from flask import Blueprint, url_for, redirect, request, render_template
from flask_login import UserMixin, login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from .database import get_db

auth = Blueprint("auth", __name__)


class User(UserMixin):
    def __init__(self, user):
        self.id = user[0]
        self.username = user[1]
        self.password = user[2]


@auth.route("/register", methods=("GET", "POST"))
@login_required
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        db = get_db()
        if not username:
            data = {"response": "Username is required"}
            return data, 400
        if not password:
            data = {"response": "Password is required"}
            return data, 400
        try:
            db.execute(
                "INSERT INTO user (username, password) VALUES (?, ?);",
                (username, generate_password_hash(password)),
            )
            db.commit()
        except db.IntegrityError:
            data = {"response": f"User {username} is already registered"}
            return data, 400
        data = {"response": "Success"}
        return data
    return render_template("register.html")


@auth.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE username = ?;", (username,)
        ).fetchone()
        if user is None:
            data = {"response": "Incorrect username"}
            return data, 401
        if not check_password_hash(user[2], password):
            data = {"response": "Incorrect password"}
            return data, 401
        logged_user = User(user)
        login_user(logged_user)
        data = {"response": "Success"}
        return data
    return render_template("login.html")


@auth.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("auth.login"))
