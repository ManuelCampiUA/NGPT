import os
from flask import Flask
from dotenv import load_dotenv
from . import views, functions


def create_app():
    app = Flask(__name__)
    app.register_blueprint(views.blueprints)
    load_dotenv()
    if os.listdir(functions.FILE_FOLDER):
        functions.load_AI()
    return app
