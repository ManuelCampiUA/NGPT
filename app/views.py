import os
from flask import Blueprint, render_template, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from psycopg2.errors import UniqueViolation
from .database import *
from .functions import *


blueprints = Blueprint("views", __name__)


@blueprints.route("/")
def home():
    return render_template("index.html")


@blueprints.route("/register", methods=("GET", "POST"))
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
        data = {"response": "Success"}
        return data
    return render_template("register.html")


@blueprints.route("/login", methods=("GET", "POST"))
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


@blueprints.route("/test")
def test():
    if os.listdir(FILE_FOLDER):
        load_AI()
    files = os.listdir(FILE_FOLDER)
    return render_template("test.html", files=files)


@blueprints.post("/upload")
def upload():
    file_uploaded = False
    if "file_0" not in request.files:
        return {"response": "No selected file"}
    files = request.files
    for file in files:
        if allowed_file(files[file].filename):
            files[file].save(f"{FILE_FOLDER}/{secure_filename(files[file].filename)}")
            file_uploaded = True
    if file_uploaded:
        data = {"response": "Success"}
        return data
    data = {"response": "Error"}
    return data


@blueprints.get("/get_file_list")
def get_file_list():
    files = os.listdir(FILE_FOLDER)
    data = {"response": files}
    return data


@blueprints.get("/process")
def process():
    load_AI()
    data = {"response": "Success"}
    return data


@blueprints.post("/QeA")
def QeA():
    if os.listdir(FILE_FOLDER):
        user_question = request.form["question"]
        data = {"response": get_conversation_chain().run(question=user_question)}
        return data
    data = {"response": False}
    return data
