import os
from flask import Flask
from .database import database
from .auth import auth
from .main import main


def create_app():
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.environ.get("SECRET_KEY"),
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app.register_blueprint(database)
    app.register_blueprint(auth)
    app.register_blueprint(main)
    return app
