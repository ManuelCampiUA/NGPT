from flask import Blueprint, url_for, redirect, request, render_template, abort
from flask_login import UserMixin, login_required, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from .database import get_db

auth = Blueprint("auth", __name__)


class User(UserMixin):
    def __init__(self, user):
        self.id = user[0]
        self.username = user[1]
        self.password = user[2]


def url_has_allowed_host_and_scheme(url, allowed_hosts, require_https=False):
    if url is not None:
        url = url.strip()
    if not url:
        return False
    if allowed_hosts is None:
        allowed_hosts = set()
    elif isinstance(allowed_hosts, str):
        allowed_hosts = {allowed_hosts}
    return url_has_allowed_host_and_scheme(
        url, allowed_hosts, require_https=require_https
    ) and url_has_allowed_host_and_scheme(
        url.replace("\\", "/"), allowed_hosts, require_https=require_https
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
        logged_user = User(user)
        login_user(logged_user)
        next = request.args.get("next")
        if not url_has_allowed_host_and_scheme(next, request.host):
            return abort(400)
        data = {"response": "Success"}
        return data
    return render_template("login.html")


@auth.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("auth.login"))
