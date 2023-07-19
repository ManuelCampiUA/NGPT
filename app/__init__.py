from flask import Flask
from os import environ, listdir
from flask_login import LoginManager
from .database import database, get_db
from .auth import auth, User
from .index import index
from .functions import load_AI

FILE_FOLDER = "upload"
login_manager = LoginManager()


def internal_server_error(e):
    data = {"response": "Server error"}
    return data, 500


def create_app():
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=environ.get("SECRET_KEY"),
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app.register_error_handler(500, internal_server_error)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    app.register_blueprint(database)
    app.register_blueprint(auth)
    app.register_blueprint(index)
    if listdir(FILE_FOLDER):
        load_AI()
    return app


@login_manager.user_loader
def load_user(user_id):
    user = get_db().execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
    return User(user)
