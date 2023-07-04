from flask import Blueprint, g, render_template, request, session, redirect, url_for
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from psycopg2.errors import UniqueViolation
from .database import get_db_connection

auth = Blueprint("auth", __name__)


@auth.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, username FROM "user" WHERE id = %s', (user_id,))
        g.user = cur.fetchone()
        cur.close()
        conn.close()


def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))
        return view(**kwargs)

    return wrapped_view


@auth.route("/register", methods=("GET", "POST"))
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        if not username:
            data = {"response": "Username is required"}
            return data
        elif not password:
            data = {"response": "Password is required"}
            return data
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                'INSERT INTO "user" (username, password) VALUES (%s, %s);',
                (username, generate_password_hash(password)),
            )
            conn.commit()
        except UniqueViolation:
            data = {"response": f"User {username} is already registered"}
            return data
        finally:
            cur.close()
            conn.close()
        data = {"response": "Success"}
        return data
    return render_template("register.html")


@auth.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM "user" WHERE username = %s;', (username,))
        user = cur.fetchone()
        cur.close()
        conn.close()
        if user is None:
            data = {"response": "Incorrect username"}
            return data
        if not check_password_hash(user[2], password):
            data = {"response": "Incorrect password"}
            return data
        session.clear()
        session["user_id"] = user[0]
        data = {"response": "Success"}
        return data
    return render_template("login.html")


@auth.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))
