from flask import Blueprint, g, url_for, redirect, session, request, render_template
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from .database import get_db

auth = Blueprint("auth", __name__)


def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))
        return view(**kwargs)

    return wrapped_view


@auth.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        g.user = (
            get_db().execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
        )


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
        session.clear()
        session["user_id"] = user[0]
        data = {"response": "Success"}
        return data
    return render_template("login.html")


@auth.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))
