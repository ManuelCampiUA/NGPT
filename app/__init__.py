import os
from flask import Flask
from dotenv import load_dotenv
from .main import main
from .auth import auth


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
    app.register_blueprint(main)
    app.register_blueprint(auth)
    return app
