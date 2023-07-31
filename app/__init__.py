from flask import Flask
from os import environ
from .database import database
from .views.auth import auth_views, login_manager
from .views.index import index_views
from .views.chat import chat_views
from .views.settings import settings_views

FILE_FOLDER = "upload"


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
    app.register_blueprint(database)
    app.register_blueprint(auth_views)
    app.register_blueprint(index_views)
    app.register_blueprint(chat_views)
    app.register_blueprint(settings_views)
    login_manager.init_app(app)
    return app
